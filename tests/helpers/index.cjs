/**
 * Test Helper Utilities
 * Reusable functions for contract testing on mainnet
 */

const { generateWallet, getStxAddress } = require('@stacks/wallet-sdk');
const { 
  makeSTXTokenTransfer,
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  PostConditionMode
} = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');

const DEPLOYER = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N';
const API_BASE = 'https://api.mainnet.hiro.so';

/**
 * Generate wallet from mnemonic
 */
async function getWallet(mnemonic) {
  const wallet = await generateWallet({ secretKey: mnemonic, password: '' });
  const account = wallet.accounts[0];
  const address = getStxAddress({ account, transactionVersion: 1 });
  return { account, address, privateKey: account.stxPrivateKey };
}

/**
 * Get STX balance for an address
 */
async function getBalance(address) {
  const res = await fetch(`${API_BASE}/extended/v1/address/${address}/stx`);
  const data = await res.json();
  return parseInt(data.balance) / 1000000;
}

/**
 * Get next available nonce
 */
async function getNonce(address) {
  const res = await fetch(`${API_BASE}/extended/v1/address/${address}/nonces`);
  const data = await res.json();
  return data.possible_next_nonce;
}

/**
 * Wait for transaction confirmation
 */
async function waitForTx(txid, maxWait = 120000) {
  const start = Date.now();
  
  while (Date.now() - start < maxWait) {
    const res = await fetch(`${API_BASE}/extended/v1/tx/${txid}`);
    const data = await res.json();
    
    if (data.tx_status === 'success') {
      return { success: true, data };
    }
    if (data.tx_status === 'abort_by_response') {
      return { success: false, data, error: data.tx_result?.repr };
    }
    if (data.tx_status === 'abort_by_post_condition') {
      return { success: false, data, error: 'Post-condition failed' };
    }
    
    await sleep(5000);
  }
  
  return { success: false, error: 'Timeout waiting for confirmation' };
}

/**
 * Sleep helper
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Format microSTX to STX string
 */
function formatSTX(microSTX) {
  return (microSTX / 1000000).toFixed(6) + ' STX';
}

/**
 * Check if a transaction is in mempool
 */
async function isInMempool(txid) {
  const res = await fetch(`${API_BASE}/extended/v1/tx/${txid}`);
  const data = await res.json();
  return data.tx_status === 'pending';
}

/**
 * Get mempool transactions for an address
 */
async function getMempoolTxs(address) {
  const res = await fetch(`${API_BASE}/extended/v1/address/${address}/mempool`);
  const data = await res.json();
  return data.results || [];
}

/**
 * Send STX transfer
 */
async function sendSTX(senderKey, recipient, amountMicroSTX, nonce, fee = 10000) {
  const tx = await makeSTXTokenTransfer({
    recipient,
    amount: amountMicroSTX,
    senderKey,
    network: STACKS_MAINNET,
    anchorMode: AnchorMode.Any,
    nonce,
    fee,
  });
  
  const result = await broadcastTransaction({ transaction: tx, network: STACKS_MAINNET });
  return result.txid;
}

/**
 * Call a contract function
 */
async function callContract(options) {
  const {
    senderKey,
    contractAddress = DEPLOYER,
    contractName,
    functionName,
    functionArgs = [],
    nonce,
    fee = 10000,
    postConditions = [],
  } = options;
  
  const tx = await makeContractCall({
    contractAddress,
    contractName,
    functionName,
    functionArgs,
    senderKey,
    network: STACKS_MAINNET,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    postConditions,
    nonce,
    fee,
  });
  
  const result = await broadcastTransaction({ transaction: tx, network: STACKS_MAINNET });
  return result.txid;
}

/**
 * Check current block height
 */
async function getCurrentBlock() {
  const res = await fetch(`${API_BASE}/extended/v2/blocks?limit=1`);
  const data = await res.json();
  return data.results[0]?.height || 0;
}

/**
 * Verify contract exists
 */
async function contractExists(contractId) {
  const res = await fetch(`${API_BASE}/extended/v1/contract/${contractId}`);
  const data = await res.json();
  return !!data.tx_id;
}

module.exports = {
  DEPLOYER,
  API_BASE,
  getWallet,
  getBalance,
  getNonce,
  waitForTx,
  sleep,
  formatSTX,
  isInMempool,
  getMempoolTxs,
  sendSTX,
  callContract,
  getCurrentBlock,
  contractExists,
};
