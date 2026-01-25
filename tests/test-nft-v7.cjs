/**
 * Test NFT v7 mint-member-badge
 */
const { makeContractCall, broadcastTransaction, AnchorMode, PostConditionMode, stringAsciiCV, principalCV } = require('@stacks/transactions');
const { STACKS_MAINNET } = require('@stacks/network');
const wallets = require('./test-wallets.json');

async function main() {
  const { generateWallet } = await import('@stacks/wallet-sdk');
  const wallet = await generateWallet({ secretKey: wallets.test_wallets[0].mnemonic, password: '' });
  const key = wallet.accounts[0].stxPrivateKey;
  
  const res = await fetch('https://api.mainnet.hiro.so/extended/v1/address/' + wallets.test_wallets[0].address + '/nonces');
  const nonce = (await res.json()).possible_next_nonce;
  
  const tx = await makeContractCall({
    contractAddress: 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N',
    contractName: 'stacksusu-nft-v7',
    functionName: 'mint-member-badge',
    functionArgs: [
      principalCV(wallets.test_wallets[0].address),
      stringAsciiCV('https://stacksusu.com/nft/v7-badge')
    ],
    senderKey: key,
    network: STACKS_MAINNET,
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Allow,
    fee: 5000n,
    nonce: BigInt(nonce)
  });
  
  const result = await broadcastTransaction({ transaction: tx, network: STACKS_MAINNET });
  if (result.txid) {
    console.log('✅ nft-v7 mint-member-badge TX:', result.txid);
  } else {
    console.log('❌ Error:', result.error, result.reason);
  }
}

main().catch(console.error);
