/**
 * StackSusu v7 Random Interaction Test
 * 100 random transactions across all funded wallets
 */

const { 
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode,
  uintCV,
  stringAsciiCV,
  principalCV,
  boolCV
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');

const DEPLOYER = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N';
const API_BASE = 'https://api.mainnet.hiro.so';
const NETWORK = STACKS_MAINNET;

const wallets = require('./test-wallets.json');
const ALL_WALLETS = [wallets.master_wallet, ...wallets.test_wallets];

const MIN_BALANCE = 0.05; // Minimum STX to participate
const TOTAL_TXS = 100;

// Transaction types
const TX_TYPES = [
  'create-circle',
  'join-circle',
  'create-referral',
  'create-proposal',
  'vote',
  'mint-badge',
  'mint-reputation-badge',
  'start-circle'
];

// State tracking
let circleCount = 1; // Start from 1 (already have one from previous test)
let proposalCount = 1;
let referralCount = 1;
const walletNonces = {};
const walletKeys = {};
const circleMembers = {}; // circle-id -> [members]
const votedProposals = {}; // proposal-id -> [voters]

async function getPrivateKey(mnemonic) {
  const { generateWallet } = await import('@stacks/wallet-sdk');
  const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
  return wallet.accounts[0].stxPrivateKey;
}

async function getBalance(address) {
  try {
    const res = await fetch(`${API_BASE}/extended/v1/address/${address}/balances`);
    if (!res.ok) {
      await new Promise(r => setTimeout(r, 2000));
      const retry = await fetch(`${API_BASE}/extended/v1/address/${address}/balances`);
      const data = await retry.json();
      return Number(data.stx.balance) / 1000000;
    }
    const data = await res.json();
    return Number(data.stx.balance) / 1000000;
  } catch (e) {
    return 0;
  }
}

async function getNonce(address) {
  if (walletNonces[address] !== undefined) {
    return walletNonces[address];
  }
  try {
    const res = await fetch(`${API_BASE}/extended/v1/address/${address}/nonces`);
    if (!res.ok) {
      await new Promise(r => setTimeout(r, 2000));
      const retry = await fetch(`${API_BASE}/extended/v1/address/${address}/nonces`);
      const data = await retry.json();
      walletNonces[address] = data.possible_next_nonce;
      return walletNonces[address];
    }
    const data = await res.json();
    walletNonces[address] = data.possible_next_nonce;
    return walletNonces[address];
  } catch (e) {
    walletNonces[address] = 0;
    return 0;
  }
}

async function callContract(wallet, contractName, functionName, args) {
  if (!walletKeys[wallet.address]) {
    walletKeys[wallet.address] = await getPrivateKey(wallet.mnemonic);
  }
  
  const nonce = await getNonce(wallet.address);
  
  try {
    const tx = await makeContractCall({
      contractAddress: DEPLOYER,
      contractName: contractName,
      functionName: functionName,
      functionArgs: args,
      senderKey: walletKeys[wallet.address],
      network: NETWORK,
      anchorMode: AnchorMode.Any,
      postConditionMode: PostConditionMode.Allow,
      fee: 3000n,
      nonce: BigInt(nonce)
    });
    
    const result = await broadcastTransaction({ transaction: tx, network: NETWORK });
    
    if (result.txid) {
      walletNonces[wallet.address] = nonce + 1;
      return { success: true, txid: result.txid };
    } else {
      return { success: false, error: result.reason || result.error };
    }
  } catch (e) {
    return { success: false, error: e.message };
  }
}

function randomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

async function executeRandomTx(wallet, txNum) {
  const txType = randomElement(TX_TYPES);
  let result;
  let description;
  
  switch (txType) {
    case 'create-circle':
      circleCount++;
      description = `create-circle #${circleCount}`;
      result = await callContract(wallet, 'stacksusu-core-v7', 'create-circle', [
        stringAsciiCV(`Circle ${circleCount}`),
        stringAsciiCV(`Random test circle ${circleCount}`),
        uintCV(100000 + Math.floor(Math.random() * 100000)), // 0.1-0.2 STX
        uintCV(3 + Math.floor(Math.random() * 5)), // 3-7 members
        uintCV(144 + Math.floor(Math.random() * 288)) // 1-3 days
      ]);
      if (result.success) {
        circleMembers[circleCount] = [wallet.address];
      }
      break;
      
    case 'join-circle':
      // Pick a random circle that wallet hasn't joined
      const availableCircles = Object.entries(circleMembers)
        .filter(([id, members]) => !members.includes(wallet.address) && members.length < 7)
        .map(([id]) => parseInt(id));
      
      if (availableCircles.length === 0) {
        // Create new circle instead
        circleCount++;
        description = `create-circle #${circleCount} (fallback)`;
        result = await callContract(wallet, 'stacksusu-core-v7', 'create-circle', [
          stringAsciiCV(`Circle ${circleCount}`),
          stringAsciiCV(`Fallback circle`),
          uintCV(100000),
          uintCV(5),
          uintCV(144)
        ]);
        if (result.success) {
          circleMembers[circleCount] = [wallet.address];
        }
      } else {
        const circleId = randomElement(availableCircles);
        description = `join-circle #${circleId}`;
        result = await callContract(wallet, 'stacksusu-core-v7', 'join-circle', [
          uintCV(circleId)
        ]);
        if (result.success) {
          circleMembers[circleId].push(wallet.address);
        }
      }
      break;
      
    case 'create-referral':
      referralCount++;
      const code = `REF${randomString(6)}`;
      description = `create-referral ${code}`;
      result = await callContract(wallet, 'stacksusu-referral-v7', 'create-referral-code', [
        stringAsciiCV(code)
      ]);
      break;
      
    case 'create-proposal':
      proposalCount++;
      description = `create-proposal #${proposalCount}`;
      result = await callContract(wallet, 'stacksusu-governance-v7', 'create-proposal', [
        stringAsciiCV(`Proposal ${proposalCount}: ${randomString(10)}`),
        stringAsciiCV(`Description for proposal ${proposalCount}`)
      ]);
      if (result.success) {
        votedProposals[proposalCount] = [wallet.address];
      }
      break;
      
    case 'vote':
      // Vote on a proposal we haven't voted on
      const availableProposals = Object.entries(votedProposals)
        .filter(([id, voters]) => !voters.includes(wallet.address))
        .map(([id]) => parseInt(id));
      
      if (availableProposals.length === 0) {
        // Create proposal instead
        proposalCount++;
        description = `create-proposal #${proposalCount} (fallback)`;
        result = await callContract(wallet, 'stacksusu-governance-v7', 'create-proposal', [
          stringAsciiCV(`Proposal ${proposalCount}`),
          stringAsciiCV(`Fallback proposal ${proposalCount}`)
        ]);
        if (result.success) {
          votedProposals[proposalCount] = [wallet.address];
        }
      } else {
        const propId = randomElement(availableProposals);
        const voteFor = Math.random() > 0.3; // 70% vote for
        description = `vote ${voteFor ? 'YES' : 'NO'} on proposal #${propId}`;
        result = await callContract(wallet, 'stacksusu-governance-v7', 'vote', [
          uintCV(propId),
          boolCV(voteFor)
        ]);
        if (result.success) {
          votedProposals[propId].push(wallet.address);
        }
      }
      break;
      
    case 'mint-badge':
      description = `mint-member-badge`;
      result = await callContract(wallet, 'stacksusu-nft-v7', 'mint-member-badge', [
        principalCV(wallet.address),
        stringAsciiCV(`https://stacksusu.com/badge/${randomString(8)}`)
      ]);
      break;
      
    case 'mint-reputation-badge':
      description = `mint-reputation-badge`;
      result = await callContract(wallet, 'stacksusu-nft-v7', 'mint-reputation-badge', [
        principalCV(wallet.address),
        uintCV(Math.floor(Math.random() * 100) + 1), // score 1-100
        stringAsciiCV(`https://stacksusu.com/rep/${randomString(8)}`)
      ]);
      break;
      
    case 'start-circle':
      // Find circles we created with enough members
      const ownedCircles = Object.entries(circleMembers)
        .filter(([id, members]) => members[0] === wallet.address && members.length >= 2)
        .map(([id]) => parseInt(id));
      
      if (ownedCircles.length > 0) {
        const circleId = randomElement(ownedCircles);
        description = `start-circle #${circleId}`;
        result = await callContract(wallet, 'stacksusu-core-v7', 'start-circle', [
          uintCV(circleId)
        ]);
      } else {
        // Fallback to create proposal
        proposalCount++;
        description = `create-proposal #${proposalCount} (no circle to start)`;
        result = await callContract(wallet, 'stacksusu-governance-v7', 'create-proposal', [
          stringAsciiCV(`Proposal ${proposalCount}`),
          stringAsciiCV(`Auto proposal`)
        ]);
        if (result.success) {
          votedProposals[proposalCount] = [wallet.address];
        }
      }
      break;
      
    default:
      description = 'unknown';
      result = { success: false, error: 'unknown tx type' };
  }
  
  return { txType, description, ...result };
}

async function main() {
  console.log('🎲 StackSusu v7 Random Transaction Test');
  console.log('========================================\n');
  console.log(`Target: ${TOTAL_TXS} transactions\n`);
  
  // Get wallets with balance
  console.log('📊 Checking wallet balances...\n');
  const fundedWallets = [];
  
  for (const w of ALL_WALLETS) {
    const balance = await getBalance(w.address);
    if (balance >= MIN_BALANCE) {
      fundedWallets.push({ ...w, balance });
    }
  }
  
  console.log(`Found ${fundedWallets.length} wallets with >= ${MIN_BALANCE} STX\n`);
  
  if (fundedWallets.length === 0) {
    console.log('❌ No funded wallets available');
    return;
  }
  
  // Run random transactions
  console.log('🚀 Starting random transactions...\n');
  
  const results = {
    success: 0,
    failed: 0,
    byType: {},
    byWallet: {}
  };
  
  for (let i = 1; i <= TOTAL_TXS; i++) {
    const wallet = randomElement(fundedWallets);
    const walletName = wallet.name || 'MASTER';
    
    const tx = await executeRandomTx(wallet, i);
    
    // Track results
    if (!results.byType[tx.txType]) {
      results.byType[tx.txType] = { success: 0, failed: 0 };
    }
    if (!results.byWallet[walletName]) {
      results.byWallet[walletName] = { success: 0, failed: 0 };
    }
    
    if (tx.success) {
      results.success++;
      results.byType[tx.txType].success++;
      results.byWallet[walletName].success++;
      console.log(`[${i.toString().padStart(3)}] ✅ ${walletName.padEnd(12)} ${tx.description.padEnd(35)} ${tx.txid.slice(0, 12)}...`);
    } else {
      results.failed++;
      results.byType[tx.txType].failed++;
      results.byWallet[walletName].failed++;
      console.log(`[${i.toString().padStart(3)}] ❌ ${walletName.padEnd(12)} ${tx.description.padEnd(35)} ${(tx.error || '').slice(0, 30)}`);
    }
    
    // Delay between transactions to avoid rate limiting
    await new Promise(r => setTimeout(r, 600));
    
    // Extra delay every 10 txs
    if (i % 10 === 0) {
      console.log(`    ⏳ Pausing to avoid rate limits...`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(70));
  console.log('📊 RESULTS SUMMARY');
  console.log('='.repeat(70));
  
  console.log(`\nTotal: ${results.success}/${TOTAL_TXS} successful (${(results.success/TOTAL_TXS*100).toFixed(1)}%)\n`);
  
  console.log('By Transaction Type:');
  for (const [type, counts] of Object.entries(results.byType).sort((a, b) => b[1].success - a[1].success)) {
    const total = counts.success + counts.failed;
    console.log(`  ${type.padEnd(25)} ${counts.success}/${total} (${(counts.success/total*100).toFixed(0)}%)`);
  }
  
  console.log('\nBy Wallet:');
  for (const [wallet, counts] of Object.entries(results.byWallet).sort((a, b) => b[1].success - a[1].success)) {
    const total = counts.success + counts.failed;
    console.log(`  ${wallet.padEnd(15)} ${counts.success}/${total}`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log('✅ Test complete!');
  console.log('='.repeat(70));
  
  // Save results
  const fs = require('fs');
  fs.writeFileSync('tests/random-test-results.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    totalTxs: TOTAL_TXS,
    success: results.success,
    failed: results.failed,
    byType: results.byType,
    byWallet: results.byWallet,
    circlesCreated: circleCount,
    proposalsCreated: proposalCount
  }, null, 2));
  
  console.log('\nResults saved to tests/random-test-results.json');
}

main().catch(console.error);
