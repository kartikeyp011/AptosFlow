// debug-transaction.js
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');

async function debugTransaction() {
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);

  const transactionHash = "0x15147bb9635511aa2ca8a7521ba7ef2814b18f28f9eb65bd8ea1ff7c25120755";
  
  console.log('🔍 Debugging transaction:', transactionHash);
  
  try {
    // Get detailed transaction info
    const txn = await aptos.getTransactionByHash({ transactionHash });
    
    console.log('\n📊 Transaction Details:');
    console.log('Hash:', txn.hash);
    console.log('Type:', txn.type);
    console.log('Success:', txn.success);
    console.log('Sender:', txn.sender);
    console.log('Timestamp:', new Date(Number(txn.timestamp) / 1000));
    
    if (txn.type === 'user_transaction') {
      console.log('\n💸 Payload:');
      console.log('Function:', txn.payload.function);
      console.log('Arguments:', txn.payload.arguments);
      
      console.log('\n📈 Events:');
      if (txn.events && txn.events.length > 0) {
        txn.events.forEach((event, index) => {
          console.log(`Event ${index + 1}:`, event.type);
          console.log('Data:', event.data);
        });
      }
      
      console.log('\n💰 Gas & Fees:');
      console.log('Gas Used:', txn.gas_used);
      console.log('Gas Unit Price:', txn.gas_unit_price);
      console.log('Max Gas Amount:', txn.max_gas_amount);
      
      const gasCost = (BigInt(txn.gas_used) * BigInt(txn.gas_unit_price)) / BigInt(100000000);
      console.log('Total Gas Cost (APT):', Number(gasCost));
    }
    
    // Check current balance of sender
    const senderAddress = txn.sender;
    const balance = await aptos.getAccountCoinAmount({
      accountAddress: senderAddress,
      coinType: "0x1::aptos_coin::AptosCoin",
    });
    
    console.log('\n🏦 Current Balance:');
    console.log('Address:', senderAddress);
    console.log('Balance (octas):', balance);
    console.log('Balance (APT):', Number(balance) / 100000000);
    
  } catch (error) {
    console.error('❌ Error debugging transaction:', error);
  }
}

// Also test sending a new transaction
async function testSendTransaction() {
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);
  
  console.log('\n🎯 Testing new transaction format...');
  
  // This is what your frontend should send
  const testTransaction = {
    data: {
      function: '0x1::aptos_account::transfer',
      typeArguments: [],
      functionArguments: [
        '0x19ecd4256516e1417102f1df2e1dcb67fa3df60ffb406cbb28c79499908fcdc1', 
        '1000000' // 0.01 APT
      ]
    }
  };
  
  console.log('Transaction format to use:');
  console.log(JSON.stringify(testTransaction, null, 2));
}

console.log('🚀 Starting Transaction Debug...');
debugTransaction().then(() => {
  return testSendTransaction();
}).then(() => {
  console.log('✅ Debug completed!');
});
