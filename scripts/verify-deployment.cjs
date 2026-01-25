/**
 * Verify Contract Deployment
 * Checks that all v7 contracts are deployed on mainnet
 */

const DEPLOYER = 'SP3FKNEZ86RG5RT7SZ5FBRGH85FZNG94ZH1MCGG6N';
const API_BASE = 'https://api.mainnet.hiro.so';

const CONTRACTS = [
  'stacksusu-traits-v5',
  'stacksusu-admin-v7',
  'stacksusu-reputation-v7',
  'stacksusu-referral-v7',
  'stacksusu-core-v7',
  'stacksusu-escrow-v7',
  'stacksusu-nft-v7',
  'stacksusu-emergency-v7',
  'stacksusu-governance-v7',
];

async function verifyDeployment() {
  console.log('🔍 Verifying StackSusu v7 deployment...\n');
  console.log(`Deployer: ${DEPLOYER}\n`);
  
  let allDeployed = true;
  const results = [];

  for (const contract of CONTRACTS) {
    const contractId = `${DEPLOYER}.${contract}`;
    
    try {
      const res = await fetch(`${API_BASE}/extended/v1/contract/${contractId}`);
      const data = await res.json();

      if (data.tx_id) {
        console.log(`✅ ${contract}`);
        console.log(`   TX: ${data.tx_id}`);
        console.log(`   Block: ${data.block_height}`);
        results.push({ contract, deployed: true, txId: data.tx_id, block: data.block_height });
      } else {
        console.log(`❌ ${contract} - NOT FOUND`);
        results.push({ contract, deployed: false });
        allDeployed = false;
      }
    } catch (e) {
      console.log(`❌ ${contract} - Error: ${e.message}`);
      results.push({ contract, deployed: false, error: e.message });
      allDeployed = false;
    }
  }

  console.log('\n========================================');
  console.log(allDeployed ? '✅ All contracts deployed!' : '❌ Some contracts missing');
  console.log('========================================');

  return { allDeployed, results };
}

// Run verification
verifyDeployment()
  .then(({ allDeployed }) => process.exit(allDeployed ? 0 : 1))
  .catch(err => {
    console.error('Verification failed:', err);
    process.exit(1);
  });
