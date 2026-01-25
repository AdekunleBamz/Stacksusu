/**
 * Deploy StackSusu V6 Contracts to Mainnet
 * Deployment order based on contract dependencies
 * Fee: 0.1 STX per contract (100000 microSTX)
 */

const { 
  makeContractDeploy, 
  broadcastTransaction, 
  AnchorMode,
  PostConditionMode 
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const fs = require('fs');
const path = require('path');

// Configuration
const DEPLOYER = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N';
const PRIVATE_KEY = process.env.STACKS_PRIVATE_KEY;
const API_BASE = 'https://api.mainnet.hiro.so';
const FEE = 100000; // 0.1 STX in microSTX

// Deployment order (based on dependencies)
const CONTRACTS_V6 = [
  { name: 'stacksusu-traits-v4', file: 'stacksusu-traits-v4.clar' },      // No deps
  { name: 'stacksusu-admin-v6', file: 'stacksusu-admin-v6.clar' },        // No deps
  { name: 'stacksusu-reputation-v6', file: 'stacksusu-reputation-v6.clar' }, // No deps
  { name: 'stacksusu-governance-v6', file: 'stacksusu-governance-v6.clar' }, // admin
  { name: 'stacksusu-referral-v6', file: 'stacksusu-referral-v6.clar' },  // admin, reputation
  { name: 'stacksusu-nft-v6', file: 'stacksusu-nft-v6.clar' },            // admin, traits
  { name: 'stacksusu-core-v6', file: 'stacksusu-core-v6.clar' },          // admin, reputation
  { name: 'stacksusu-escrow-v6', file: 'stacksusu-escrow-v6.clar' },      // admin, core, referral, reputation
  { name: 'stacksusu-emergency-v6', file: 'stacksusu-emergency-v6.clar' }, // admin, core, reputation
];

const network = STACKS_MAINNET;

async function checkBalance() {
  const res = await fetch(`${API_BASE}/extended/v1/address/${DEPLOYER}/balances`);
  const data = await res.json();
  const balance = parseInt(data.stx.balance) / 1000000;
  const locked = parseInt(data.stx.locked) / 1000000;
  const available = balance - locked;
  
  console.log(`\n💰 Deployer Wallet Balance:`);
  console.log(`   Address: ${DEPLOYER}`);
  console.log(`   Balance: ${balance.toFixed(6)} STX`);
  console.log(`   Locked:  ${locked.toFixed(6)} STX`);
  console.log(`   Available: ${available.toFixed(6)} STX`);
  
  const requiredFees = (CONTRACTS_V6.length * FEE) / 1000000;
  console.log(`\n📋 Deployment Cost:`);
  console.log(`   Contracts: ${CONTRACTS_V6.length}`);
  console.log(`   Fee each: ${FEE / 1000000} STX`);
  console.log(`   Total required: ${requiredFees} STX`);
  
  if (available < requiredFees) {
    throw new Error(`Insufficient balance! Need ${requiredFees} STX, have ${available.toFixed(6)} STX`);
  }
  
  console.log(`   ✅ Sufficient balance\n`);
  return available;
}

async function checkIfDeployed(contractName) {
  const contractId = `${DEPLOYER}.${contractName}`;
  try {
    const res = await fetch(`${API_BASE}/extended/v1/contract/${contractId}`);
    const data = await res.json();
    return data.tx_id ? true : false;
  } catch (e) {
    return false;
  }
}

async function getNonce() {
  const res = await fetch(`${API_BASE}/extended/v1/address/${DEPLOYER}/nonces`);
  const data = await res.json();
  return data.possible_next_nonce;
}

async function deployContract(contract, nonce) {
  const contractPath = path.join(__dirname, '..', 'contracts', contract.file);
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  
  console.log(`\n📦 Deploying: ${contract.name}`);
  console.log(`   File: ${contract.file}`);
  console.log(`   Size: ${(codeBody.length / 1024).toFixed(2)} KB`);
  console.log(`   Nonce: ${nonce}`);
  console.log(`   Fee: ${FEE / 1000000} STX`);
  
  const txOptions = {
    contractName: contract.name,
    codeBody: codeBody,
    senderKey: PRIVATE_KEY,
    network,
    anchorMode: AnchorMode.OnChainOnly,
    postConditionMode: PostConditionMode.Allow,
    fee: FEE,
    nonce: nonce,
    clarityVersion: 2,
  };

  const transaction = await makeContractDeploy(txOptions);
  const txId = transaction.txid();
  
  console.log(`   TX ID: 0x${txId}`);
  
  const broadcastResponse = await broadcastTransaction({ transaction, network });
  
  if (broadcastResponse.error) {
    console.log(`   ❌ Broadcast failed: ${broadcastResponse.reason}`);
    throw new Error(broadcastResponse.reason);
  }
  
  console.log(`   ✅ Broadcast successful!`);
  console.log(`   View: https://explorer.hiro.so/txid/0x${txId}?chain=mainnet`);
  
  return txId;
}

async function waitForConfirmation(txId, maxWait = 600000) {
  const startTime = Date.now();
  console.log(`   ⏳ Waiting for confirmation...`);
  
  while (Date.now() - startTime < maxWait) {
    try {
      const res = await fetch(`${API_BASE}/extended/v1/tx/0x${txId}`);
      const data = await res.json();
      
      if (data.tx_status === 'success') {
        console.log(`   ✅ Confirmed in block ${data.block_height}`);
        return true;
      } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
        console.log(`   ❌ Transaction failed: ${data.tx_status}`);
        return false;
      }
    } catch (e) {
      // TX not found yet, keep waiting
    }
    
    await new Promise(r => setTimeout(r, 10000)); // Wait 10 seconds
    process.stdout.write('.');
  }
  
  console.log(`   ⚠️ Timeout waiting for confirmation`);
  return false;
}

async function deploy() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('       StackSusu V6 Contract Deployment');
  console.log('═══════════════════════════════════════════════════════');
  
  // Check private key
  if (!PRIVATE_KEY) {
    console.error('\n❌ Error: STACKS_PRIVATE_KEY environment variable not set');
    console.log('\nUsage:');
    console.log('  export STACKS_PRIVATE_KEY="your-private-key"');
    console.log('  node scripts/deploy-v6.cjs');
    process.exit(1);
  }
  
  // Check balance
  await checkBalance();
  
  // Get starting nonce
  let nonce = await getNonce();
  console.log(`Starting nonce: ${nonce}\n`);
  
  // Deploy order display
  console.log('📋 Deployment Order:');
  CONTRACTS_V6.forEach((c, i) => {
    console.log(`   ${i + 1}. ${c.name}`);
  });
  
  const deployed = [];
  const failed = [];
  
  for (const contract of CONTRACTS_V6) {
    // Check if already deployed
    const isDeployed = await checkIfDeployed(contract.name);
    if (isDeployed) {
      console.log(`\n⏭️  Skipping ${contract.name} (already deployed)`);
      deployed.push(contract.name);
      continue;
    }
    
    try {
      const txId = await deployContract(contract, nonce);
      nonce++; // Increment nonce for next transaction
      
      // Wait for confirmation before deploying next
      const confirmed = await waitForConfirmation(txId);
      if (confirmed) {
        deployed.push(contract.name);
      } else {
        failed.push(contract.name);
        console.log(`\n⚠️ Stopping deployment due to failure`);
        break;
      }
    } catch (e) {
      console.log(`\n❌ Deployment failed: ${e.message}`);
      failed.push(contract.name);
      break;
    }
  }
  
  // Summary
  console.log('\n═══════════════════════════════════════════════════════');
  console.log('                    DEPLOYMENT SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`\n✅ Deployed: ${deployed.length}/${CONTRACTS_V6.length}`);
  deployed.forEach(c => console.log(`   - ${c}`));
  
  if (failed.length > 0) {
    console.log(`\n❌ Failed: ${failed.length}`);
    failed.forEach(c => console.log(`   - ${c}`));
  }
  
  console.log('\n═══════════════════════════════════════════════════════\n');
  
  return failed.length === 0;
}

// Run deployment
deploy()
  .then(success => process.exit(success ? 0 : 1))
  .catch(err => {
    console.error('Deployment error:', err);
    process.exit(1);
  });
