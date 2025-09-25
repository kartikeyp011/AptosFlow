// check-recipient.js
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');

async function checkRecipient() {
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const recipientAddress = "0x19ecd4256516e1417102f1df2e1dcb67fa3df60ffb406ccb28c79499908fcdc1";
  
  console.log('🔍 Checking recipient balance and transactions...');
  
  try {
    // Check recipient balance
    const balance = await aptos.getAccountCoinAmount({
      accountAddress: recipientAddress,
      coinType: "0x1::aptos_coin::AptosCoin",
    });
    
    console.log('💰 Recipient Balance:', Number(balance) / 100000000, 'APT');
    
    // Check recipient transactions
    const transactions = await aptos.getAccountTransactions({
      accountAddress: recipientAddress,
      options: { limit: 5 }
    });
    
    console.log('📊 Recipient transaction count:', transactions.length);
    
    // Check if the transaction appears in recipient's history
    const specificTxn = transactions.find(t => t.hash === "0x15147bb9635511aa2ca8a7521ba7ef2814b18f28f9eb65bd8ea1ff7c25120755");
    console.log('🎯 Does recipient see the transaction?', specificTxn ? 'YES' : 'NO');
    
  } catch (error) {
    console.error('❌ Error checking recipient:', error);
  }
}

checkRecipient().then(() => {
  console.log('✅ Recipient check completed!');
});
