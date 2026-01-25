/**
 * Deploy Remaining v7 Contracts
 * Professional deployment script using Stacks.js
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

const MNEMONIC = 'tourist chief old shadow clap injury join spoil birth copper valid skate';
const DEPLOYER = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N';
const API_BASE = 'https://api.mainnet.hiro.so';

// Remaining contracts to deploy
const CONTRACTS_TO_DEPLOY = [
  'stacksusu-core-v7',
  'stacksusu-emergency-v7'
];

async function getPrivateKey() {
  const { generateWallet } = await import('@stacks/wallet-sdk');
  const wallet = await generateWallet({ secretKey: MNEMONIC, password: '' });
  return wallet.accounts[0].stxPrivateKey;
}

async function getNonce() {
  const res = await fetch(`${API_BASE}/extended/v1/address/${DEPLOYER}/nonces`);
  const data = await res.json();
  return data.possible_next_nonce;
}

async function isContractDeployed(contractName) {
  const res = await fetch(`${API_BASE}/extended/v1/contract/${DEPLOYER}.${contractName}`);
  const data = await res.json();
  return !!data.tx_id;
}

async function deployContract(contractName, privateKey, nonce) {
  const contractPath = path.join(__dirname, '..', 'contracts', `${contractName}.clar`);
  const codeBody = fs.readFileSync(contractPath, 'utf8');
  
  const network = STACKS_MAINNET;
  
  const txOptions = {
    contractName: contractName,
    codeBody: codeBody,
    senderKey: privateKey,
    network,
    anchorMode: AnchorMode.OnChainOnly,
    postConditionMode: PostConditionMode.Allow,
    fee: 100000n, // 0.1 STX
    nonce: BigInt(nonce),
    clarityVersion: 2
  };

  console.log(`\n📝 Creating deployment transaction for ${contractName}...`);
  const transaction = await makeContractDeploy(txOptions);
  
  console.log(`📡 Broadcasting ${contractName}...`);
  const result = await broadcastTransaction({ transaction, network });
  
  if (result.error) {
    console.log(`❌ Failed: ${result.error} - ${result.reason}`);
    return null;
  }
  
  console.log(`✅ Broadcasted: ${result.txid}`);
  return result.txid;
}

async function waitForConfirmation(txid, maxAttempts = 60) {
  console.log(`⏳ Waiting for confirmation...`);
  
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise(r => setTimeout(r, 10000)); // Wait 10 seconds
    
    const res = await fetch(`${API_BASE}/extended/v1/tx/${txid}`);
    const data = await res.json();
    
    if (data.tx_status === 'success') {
      console.log(`✅ Confirmed in block ${data.block_height}`);
      return true;
    } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
      console.log(`❌ Transaction failed: ${data.tx_status}`);
      return false;
    }
    
    process.stdout.write('.');
  }
  
  console.log(`\n⚠️ Timeout waiting for confirmation`);
  return false;
}

async function main() {
  console.log('🚀 StackSusu v7 Remaining Contract Deployment\n');
  console.log(`Deployer: ${DEPLOYER}`);
  
  // Check which contracts still need deployment
  const needsDeployment = [];
  for (const contract of CONTRACTS_TO_DEPLOY) {
    const deployed = await isContractDeployed(contract);
    if (deployed) {
      console.log(`✅ ${contract} - already deployed`);
    } else {
      console.log(`📦 ${contract} - needs deployment`);
      needsDeployment.push(contract);
    }
  }
  
  if (needsDeployment.length === 0) {
    console.log('\n🎉 All contracts already deployed!');
    return;
  }
  
  console.log(`\n📋 Deploying ${needsDeployment.length} contracts...\n`);
  
  const privateKey = await getPrivateKey();
  let nonce = await getNonce();
  console.log(`Starting nonce: ${nonce}`);
  
  for (const contract of needsDeployment) {
    const txid = await deployContract(contract, privateKey, nonce);
    if (txid) {
      await waitForConfirmation(txid);
      nonce++;
    }
  }
  
  console.log('\n========================================');
  console.log('Deployment Complete!');
  console.log('========================================');
}

main().catch(console.error);
