/**
 * Check STX Balances for Test Wallets
 */

const wallets = require('./test-wallets.json');

const addresses = [
  { name: 'MASTER', address: wallets.master_wallet.address },
  ...wallets.test_wallets.slice(0, 15).map(w => ({ name: w.name, address: w.address }))
];

async function checkBalances() {
  console.log('💰 Checking STX balances for 16 wallets (master + 15 test)...\n');
  
  let total = 0;
  const results = [];
  
  for (const { name, address } of addresses) {
    const res = await fetch(`https://api.mainnet.hiro.so/extended/v1/address/${address}/balances`);
    const data = await res.json();
    const stx = Number(data.stx.balance) / 1000000;
    total += stx;
    results.push({ name, address, stx });
    console.log(`${name.padEnd(12)}: ${stx.toFixed(6).padStart(12)} STX  ${address}`);
  }
  
  console.log('\n' + '='.repeat(70));
  console.log(`Total Available: ${total.toFixed(6)} STX`);
  console.log('='.repeat(70));
  
  // Calculate needed STX for testing
  const walletsWithZero = results.filter(r => r.stx < 0.1).length;
  const neededPerWallet = 0.5; // 0.5 STX per wallet for testing
  const neededTotal = walletsWithZero * neededPerWallet;
  
  console.log(`\n📊 Analysis:`);
  console.log(`   Wallets with < 0.1 STX: ${walletsWithZero}`);
  console.log(`   STX needed per wallet: ${neededPerWallet} STX`);
  console.log(`   Total STX needed: ${neededTotal.toFixed(2)} STX`);
  
  if (walletsWithZero > 0) {
    console.log(`\n⚠️  Send ${neededTotal.toFixed(2)} STX to MASTER wallet:`);
    console.log(`   ${wallets.master_wallet.address}`);
    console.log(`\n   Then run: node tests/distribute-stx.cjs`);
  } else {
    console.log(`\n✅ All wallets have sufficient STX for testing!`);
  }
  
  return { total, walletsWithZero, neededTotal };
}

checkBalances().catch(console.error);
