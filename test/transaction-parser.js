// simple-transaction-parser.js
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');

class SimpleTransactionParser {
  constructor() {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    this.aptos = new Aptos(aptosConfig);
  }

  async parseMyTransactions(address, limit = 20) {
    try {
      console.log(`🔍 Fetching transactions for MY address: ${address}`);
      
      const transactions = await this.aptos.getAccountTransactions({
        accountAddress: address,
        options: { limit }
      });

      console.log(`📊 Total transactions found: ${transactions.length}`);

      const myTransactions = [];
      let stats = { total: 0, sent: 0, failed: 0, other: 0 };

      for (const txn of transactions) {
        if (txn.type === 'user_transaction') {
          stats.total++;
          const userTxn = txn;

          if (!userTxn.success) {
            stats.failed++;
            continue;
          }

          const transaction = this.parseMyTransaction(userTxn, address);
          if (transaction) {
            myTransactions.push(transaction);
            if (transaction.type === 'sent') stats.sent++;
          } else {
            stats.other++;
          }
        }
      }

      return {
        transactions: myTransactions.sort((a, b) => b.timestamp - a.timestamp),
        stats
      };

    } catch (error) {
      console.error('❌ Error parsing transactions:', error);
      return { transactions: [], stats: { total: 0, sent: 0, failed: 0, other: 0 } };
    }
  }

  parseMyTransaction(userTxn, myAddress) {
    const timestamp = new Date(Number(userTxn.timestamp) / 1000);
    
    console.log(`\n--- Analyzing: ${userTxn.hash} ---`);
    console.log('Function:', userTxn.payload?.function);

    // Only look for APT transfers that I sent
    if (userTxn.payload?.function) {
      if (userTxn.payload.function.includes('::aptos_account::transfer') ||
          userTxn.payload.function.includes('::coin::transfer')) {
        
        if (userTxn.payload.arguments?.[1]) {
          const amount = Number(userTxn.payload.arguments[1]) / 100000000;
          const recipient = userTxn.payload.arguments[0];
          
          console.log('💰 APT Transfer Found!');
          console.log('Amount:', amount, 'APT');
          console.log('Recipient:', recipient);

          return {
            hash: userTxn.hash,
            type: 'sent',
            amount,
            description: 'Sent APT',
            timestamp,
            to: recipient,
            from: myAddress,
            status: 'completed'
          };
        }
      }
    }

    console.log('❌ Not an APT transfer transaction');
    return null;
  }
}

// Test function
async function testSimpleParser() {
  const parser = new SimpleTransactionParser();
  
  // Test with your address
  const myAddress = "0xaa5edfbad7cfd7ae37d35bd890f2981d674c3af50b11e533bc4218136a1de743";
  
  console.log(`🎯 ===== TESTING MY TRANSACTIONS: ${myAddress} =====`);
  
  const result = await parser.parseMyTransactions(myAddress, 20);
  
  console.log('\n📈 ===== FINAL RESULTS =====');
  console.log('📊 Stats:', result.stats);
  console.log('💸 APT Transactions I Sent:', result.transactions.length);
  
  if (result.transactions.length > 0) {
    console.log('\n🔍 My APT Transfers:');
    result.transactions.forEach((txn, index) => {
      console.log(`${index + 1}. ${txn.description}`);
      console.log(`   Amount: ${txn.amount} APT`);
      console.log(`   To: ${txn.to}`);
      console.log(`   Time: ${txn.timestamp}`);
      console.log(`   Hash: ${txn.hash}`);
      console.log('   ---');
    });
  } else {
    console.log('❌ No APT transfer transactions found that I sent');
  }
}

// Run the test
console.log('🚀 Starting Simple Aptos Transaction Parser Test...');
testSimpleParser().then(() => {
  console.log('✅ Test completed!');
}).catch(error => {
  console.error('💥 Test failed:', error);
});
