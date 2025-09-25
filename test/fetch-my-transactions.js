// fetch-my-transactions.js
const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');

class MyTransactionFetcher {
  constructor() {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    this.aptos = new Aptos(aptosConfig);
  }

  async fetchAllMyTransactions(myAddress, limit = 50) {
    try {
      console.log(`🔍 Fetching transactions for: ${myAddress}\n`);
      
      const transactions = await this.aptos.getAccountTransactions({
        accountAddress: myAddress,
        options: { limit }
      });

      console.log(`📊 Found ${transactions.length} total transactions\n`);

      const aptTransactions = [];
      let stats = {
        total: 0,
        sent: 0,
        received: 0,
        failed: 0,
        other: 0
      };

      for (const txn of transactions) {
        if (txn.type === 'user_transaction') {
          stats.total++;
          const userTxn = txn;

          console.log(`--- Transaction ${stats.total} ---`);
          console.log('Hash:', userTxn.hash);
          console.log('Status:', userTxn.success ? '✅ Success' : '❌ Failed');
          console.log('Timestamp:', new Date(Number(userTxn.timestamp) / 1000).toLocaleString());
          console.log('Sender:', userTxn.sender);
          console.log('Function:', userTxn.payload?.function || 'Unknown');

          if (!userTxn.success) {
            stats.failed++;
            console.log('❌ Skipping failed transaction\n');
            continue;
          }

          const parsedTxn = this.parseTransaction(userTxn, myAddress);
          if (parsedTxn) {
            aptTransactions.push(parsedTxn);
            if (parsedTxn.type === 'sent') stats.sent++;
            if (parsedTxn.type === 'received') stats.received++;
            console.log('💰 APT Transaction:', parsedTxn.description);
            console.log('Amount:', parsedTxn.amount, 'APT');
            console.log('Type:', parsedTxn.type === 'sent' ? '📤 Sent' : '📥 Received');
          } else {
            stats.other++;
            console.log('⚡ Other transaction (contract call, etc.)');
          }

          // Show events for more details
          if (userTxn.events && userTxn.events.length > 0) {
            console.log('Events:', userTxn.events.length);
            userTxn.events.forEach((event, i) => {
              if (event.type.includes('coin') || event.type.includes('transfer')) {
                console.log(`  Event ${i+1}: ${event.type}`);
                if (event.data?.amount) {
                  console.log(`    Amount: ${Number(event.data.amount) / 100000000} APT`);
                }
              }
            });
          }
          console.log(''); // Empty line for readability
        }
      }

      return {
        transactions: aptTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        stats,
        rawCount: transactions.length
      };

    } catch (error) {
      console.error('❌ Error fetching transactions:', error);
      return { transactions: [], stats, rawCount: 0 };
    }
  }

  parseTransaction(userTxn, myAddress) {
    const timestamp = new Date(Number(userTxn.timestamp) / 1000);
    const isIncoming = userTxn.sender !== myAddress;

    // Check for APT transfers in payload
    if (userTxn.payload?.function) {
      const functionName = userTxn.payload.function;
      
      // Standard APT transfer functions
      if (functionName.includes('::aptos_coin::transfer') ||
          functionName.includes('::coin::transfer') ||
          functionName.includes('::aptos_account::transfer')) {
        
        if (userTxn.payload.arguments?.[1]) {
          const amount = Number(userTxn.payload.arguments[1]) / 100000000;
          const recipient = userTxn.payload.arguments[0];
          
          if (userTxn.sender === myAddress) {
            return {
              hash: userTxn.hash,
              type: 'sent',
              amount,
              description: 'Sent APT',
              timestamp,
              to: recipient,
              from: myAddress,
              function: functionName
            };
          } else if (recipient === myAddress) {
            return {
              hash: userTxn.hash,
              type: 'received',
              amount,
              description: 'Received APT',
              timestamp,
              from: userTxn.sender,
              to: myAddress,
              function: functionName
            };
          }
        }
      }
    }

    // Check events for coin transfers
    if (userTxn.events) {
      for (const event of userTxn.events) {
        if (event.type.includes('::coin::DepositEvent') && event.data?.amount) {
          const amount = Number(event.data.amount) / 100000000;
          return {
            hash: userTxn.hash,
            type: 'received',
            amount,
            description: 'Received APT (from event)',
            timestamp,
            from: userTxn.sender,
            to: myAddress,
            function: 'event_based'
          };
        }
        else if (event.type.includes('::coin::WithdrawEvent') && event.data?.amount) {
          const amount = Number(event.data.amount) / 100000000;
          return {
            hash: userTxn.hash,
            type: 'sent',
            amount,
            description: 'Sent APT (from event)',
            timestamp,
            from: myAddress,
            to: 'unknown',
            function: 'event_based'
          };
        }
      }
    }

    return null;
  }

  async getCurrentBalance(address) {
    try {
      const balance = await this.aptos.getAccountCoinAmount({
        accountAddress: address,
        coinType: "0x1::aptos_coin::AptosCoin",
      });
      return Number(balance) / 100000000;
    } catch (error) {
      console.error('Error fetching balance:', error);
      return 0;
    }
  }
}

// Main function
async function main() {
  const fetcher = new MyTransactionFetcher();
  
  // Replace with your address
  const myAddress = "0xaa5edfbad7cfd7ae37d35bd890f2981d674c3af50b11e533bc4218136a1de743";
  
  console.log('🚀 Starting Transaction Fetch...\n');
  
  // Get current balance
  const balance = await fetcher.getCurrentBalance(myAddress);
  console.log(`🏦 Current Balance: ${balance} APT\n`);
  
  // Fetch transactions
  const result = await fetcher.fetchAllMyTransactions(myAddress, 30);
  
  console.log('\n📈 ===== FINAL SUMMARY =====');
  console.log(`📊 Total transactions processed: ${result.rawCount}`);
  console.log(`💰 APT transfers found: ${result.transactions.length}`);
  console.log(`📤 Sent: ${result.stats.sent}`);
  console.log(`📥 Received: ${result.stats.received}`);
  console.log(`❌ Failed: ${result.stats.failed}`);
  console.log(`⚡ Other: ${result.stats.other}`);
  
  if (result.transactions.length > 0) {
    console.log('\n🔍 APT Transaction Details:');
    result.transactions.forEach((txn, index) => {
      console.log(`\n${index + 1}. ${txn.description}`);
      console.log(`   Amount: ${txn.amount} APT`);
      console.log(`   Type: ${txn.type === 'sent' ? '📤 Sent to' : '📥 Received from'} ${txn.type === 'sent' ? txn.to : txn.from}`);
      console.log(`   Time: ${new Date(txn.timestamp).toLocaleString()}`);
      console.log(`   Hash: ${txn.hash}`);
      console.log(`   Function: ${txn.function}`);
    });
  } else {
    console.log('\n❌ No APT transfer transactions found in your history');
  }
  
  console.log('\n✅ Fetch completed!');
}

// Run the script
main().catch(console.error);
