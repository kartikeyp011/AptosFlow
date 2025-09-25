'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Aptos, AptosConfig, Network, Types, AccountAddress } from '@aptos-labs/ts-sdk';  
import {
  Bell,
  CreditCard,
  Calendar,
  Users,
  Send,
  ArrowUpRight,
  ArrowDownLeft,
  LogOut,
  TrendingUp,
  Wallet,
  MoreVertical,
  Eye,
  AlertCircle,
  CheckCircle,
  Info,
  Shield,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

// Types for our data
interface Transaction {
  id: string;
  type: 'incoming' | 'outgoing';
  amount: number;
  description: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  hash?: string;
  from?: string;
  to?: string;
  version?: string;
}

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  timestamp: string;
  unread: boolean;
  action?: () => void;
}

// Aptos client setup with error handling - TESTNET ONLY
const createAptosClient = () => {
  try {
    const aptosConfig = new AptosConfig({ network: Network.TESTNET });
    return new Aptos(aptosConfig);
  } catch (error) {
    console.error('Failed to create Aptos client:', error);
    return null;
  }
};

const aptos = createAptosClient();

// CORRECTED aptosService with proper transaction handling
const aptosService = {
  getTransactions: async (address: string): Promise<Transaction[]> => {
    if (!aptos) {
      console.error('Aptos client not initialized');
      return [];
    }

    try {
      const transactions = await aptos.getAccountTransactions({
        accountAddress: address,
        options: { limit: 20 }
      });

      const formattedTransactions: Transaction[] = [];
      
      for (const txn of transactions) {
        if (txn.type === 'user_transaction') {
          const userTxn = txn as Types.UserTransaction;
          const isIncoming = userTxn.sender !== address;
          
          // Skip failed transactions for cleaner display
          if (!userTxn.success) continue;

          const timestamp = new Date(Number(userTxn.timestamp) / 1000);
          let amount = 0;
          let description = 'Transaction';

          // Parse transaction events to get amount and type
          if (userTxn.payload && typeof userTxn.payload === 'object') {
            const payload = userTxn.payload as any;
            
            // Check if it's a coin transfer
            if (payload.function === '0x1::aptos_account::transfer' || 
                payload.function === '0x1::coin::transfer') {
              
              // Extract amount from arguments (in octas)
              if (payload.arguments && payload.arguments.length >= 2) {
                amount = Number(payload.arguments[1]) / 100000000; // Convert octas to APT
              }
              
              description = isIncoming ? 'Received APT' : 'Sent APT';
            }
          }

          // Also check events for amount information
          if (userTxn.events && amount === 0) {
            for (const event of userTxn.events) {
              if (event.type === '0x1::coin::DepositEvent' || 
                  event.type === '0x1::coin::WithdrawEvent') {
                try {
                  const eventData = event.data as any;
                  if (eventData.amount) {
                    amount = Number(eventData.amount) / 100000000;
                    description = isIncoming ? 'Received APT' : 'Sent APT';
                  }
                } catch (e) { 
                  console.log('Could not parse event data:', e); 
                }
              }
            }
          }

          // Only include transactions with positive amounts
          if (amount > 0) {
            formattedTransactions.push({
              id: userTxn.hash,
              type: isIncoming ? 'incoming' : 'outgoing',
              amount,
              description,
              timestamp: timestamp.toISOString(),
              status: userTxn.success ? 'completed' : 'failed',
              hash: userTxn.hash,
              from: userTxn.sender,
              to: isIncoming ? address : (userTxn.payload as any)?.arguments?.[0] || 'Unknown',
              version: userTxn.version
            });
          }
        }
      }
      
      return formattedTransactions.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Error fetching transactions:', error);
      return [];
    }
  },

  getAccountBalance: async (address: string): Promise<number> => {
    if (!aptos) {
      console.error('Aptos client not initialized');
      return 0;
    }

    try {
      const balance = await aptos.getAccountCoinAmount({
        accountAddress: address,
        coinType: "0x1::aptos_coin::AptosCoin",
      });

      return Number(balance) / 1e8;
    } catch (err) {
      console.error("Error fetching balance:", err);
      return 0;
    }
  },

  // CORRECTED: Use the proper transaction format for wallet adapter
  sendPayment: async (to: string, amount: number, signAndSubmitTransaction: any) => {
    if (!aptos) {
      return { success: false, error: 'Aptos client not initialized' };
    }

    try {
      // Validate recipient address
      if (!to.startsWith('0x') || to.length !== 66) { 
        return { success: false, error: 'Invalid recipient address format. Must be 0x followed by 64 characters.' }; 
      }
      
      if (amount <= 0) { 
        return { success: false, error: 'Amount must be greater than 0' }; 
      }

      // Convert amount to octas (8 decimal places)
      const amountInOctas = Math.floor(amount * 100000000);

      // Use the correct transaction format for wallet adapter
      const transaction = {
        data: {
          function: '0x1::aptos_account::transfer',
          typeArguments: [],
          functionArguments: [to, amountInOctas]
        }
      };

      console.log('Sending transaction:', transaction);
      
      const response = await signAndSubmitTransaction(transaction);
      console.log('Transaction submitted:', response);

      // Wait for transaction confirmation
      const result = await aptos.waitForTransaction({
        transactionHash: response.hash,
        options: { timeoutSecs: 30, checkSuccess: true }
      });

      console.log('Transaction confirmed:', result);

      return { 
        success: true, 
        hash: response.hash, 
        version: result.version 
      };
    } catch (error: any) {
      console.error('Error sending payment:', error);
      return { 
        success: false, 
        error: error.message || 'Transaction failed. Please check the recipient address and your balance.' 
      };
    }
  }
};

// Enhanced Wallet Connect Button Component
const WalletConnectButton = () => {
  const { connect, disconnect, account, connected, connecting, wallets } = useWallet();
  const [isCopied, setIsCopied] = useState(false);

  const handleConnect = async () => {
    try {
      if (wallets.length > 0) {
        // Use the first available wallet (Petra should be available)
        await connect(wallets[0].name);
      } else {
        alert('No wallets detected. Please install Petra Wallet.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  const copyAddress = () => {
    if (account?.address) {
      navigator.clipboard.writeText(account.address);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  if (connected && account) {
    return (
      <div className="flex items-center space-x-3">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={copyAddress}
          className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600/50 transition-all"
          title="Copy address"
        >
          {isCopied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-sm text-gray-300">
            {account.address.slice(0, 6)}...{account.address.slice(-4)}
          </span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleDisconnect}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-500 to-red-600 px-4 py-2 rounded-lg text-white font-medium shadow-lg hover:shadow-red-500/25 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Disconnect</span>
        </motion.button>
      </div>
    );
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-3 rounded-xl text-white font-semibold shadow-lg hover:shadow-cyan-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Wallet className="w-5 h-5" />
      <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </motion.button>
  );
};

// Enhanced Connection Banner Component
const ConnectionBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between flex-col lg:flex-row gap-6">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">Connect Your Wallet</h3>
            <p className="text-blue-200/80">
              Connect your Aptos wallet to start using SmartPay. We support Petra wallet on TESTNET.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4 flex-wrap justify-center">
          <a
            href="https://petra.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-white transition-all"
          >
            <span>Get Petra Wallet</span>
          </a>
          <WalletConnectButton />
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Wallet Balance Component
const WalletBalance = () => {
  const { account, connected } = useWallet();
  const [aptBalance, setAptBalance] = useState<number>(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchBalance = async () => {
    if (!account) return;

    setIsRefreshing(true);
    try {
      const balance = await aptosService.getAccountBalance(account.address);
      setAptBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (connected && account) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 15000);
      return () => clearInterval(interval);
    } else {
      setAptBalance(0);
    }
  }, [account, connected]);

  const formatBalance = (balance: number) => {
    if (balance === 0) return '0.000000';
    if (balance < 0.000001) return balance.toFixed(8);
    if (balance < 1) return balance.toFixed(6);
    return balance.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.8 }}
      whileHover={{ scale: 1.01 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 p-8 shadow-2xl border border-gray-700/50"
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-300 mb-1">Wallet Balance</h2>
            {connected ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-400">Connected to TestNet</span>
              </div>
            ) : (
              <span className="text-sm text-red-400">Wallet disconnected</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={fetchBalance}
              disabled={isRefreshing}
              className="p-2 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-700/50 transition-all disabled:opacity-50"
              title="Refresh balance"
            >
              <RefreshCw className={`w-4 h-4 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
            </motion.button>
            <Wallet className="w-6 h-6 text-cyan-400" />
          </div>
        </div>

        <div className="text-5xl font-bold text-white mb-2 tracking-tight">
          {formatBalance(aptBalance)} APT
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm font-medium text-green-400">
            <TrendingUp className="w-4 h-4" />
            <span>Live</span>
          </div>
          <span className="text-gray-400 text-sm">Aptos Testnet</span>
          {isRefreshing && (
            <span className="text-xs text-cyan-400">Updating...</span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Quick Stats Component
const QuickStats = () => {
  const { account, connected } = useWallet();
  const [stats, setStats] = useState({
    totalTransactions: 0,
    totalSent: 0,
    totalReceived: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (account) {
        const transactions = await aptosService.getTransactions(account.address);
        const sent = transactions.filter(t => t.type === 'outgoing').length;
        const received = transactions.filter(t => t.type === 'incoming').length;

        setStats({
          totalTransactions: transactions.length,
          totalSent: sent,
          totalReceived: received
        });
      }
    };

    if (connected && account) {
      fetchStats();
    } else {
      setStats({ totalTransactions: 0, totalSent: 0, totalReceived: 0 });
    }
  }, [account, connected]);

  const quickStats = [
    {
      label: 'Total Transactions',
      value: stats.totalTransactions.toString(),
      change: `${stats.totalTransactions} total`,
      icon: CreditCard
    },
    {
      label: 'Sent',
      value: stats.totalSent.toString(),
      change: 'Outgoing',
      icon: ArrowUpRight
    },
    {
      label: 'Received',
      value: stats.totalReceived.toString(),
      change: 'Incoming',
      icon: ArrowDownLeft
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <Icon className="w-6 h-6 text-blue-400" />
              </div>
              <MoreVertical className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400 mb-2">{stat.label}</div>
            <div className="text-xs text-green-400 font-medium">{stat.change}</div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Enhanced Action Button Component
const ActionButton = ({
  icon: Icon,
  label,
  description,
  delay,
  gradient,
  onClick,
  disabled = false
}: {
  icon: React.ElementType;
  label: string;
  description: string;
  delay: number;
  gradient: string;
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{
        scale: disabled ? 1 : 1.05,
        y: disabled ? 0 : -5
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`relative group p-6 rounded-xl ${gradient} shadow-2xl overflow-hidden ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl'
      } transition-all duration-300`}
    >
      <div className="relative z-10 flex items-center space-x-4">
        <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-left">
          <div className="font-semibold text-white text-lg mb-1">{label}</div>
          <div className="text-white/80 text-sm">{description}</div>
        </div>
      </div>
    </motion.button>
  );
};

// Enhanced Actions Section
const ActionsSection = () => {
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [isSending, setIsSending] = useState(false);

  const handleSendPayment = async () => {
    if (!connected || !account) {
      alert('Please connect your wallet first');
      return;
    }

    const recipient = prompt('Enter recipient address (0x...):');
    if (!recipient) return;

    // Validate recipient address format
    if (!recipient.startsWith('0x') || recipient.length !== 66) {
      alert('Invalid recipient address format. Must be 0x followed by 64 characters.');
      return;
    }

    const amountInput = prompt('Enter amount (APT):');
    if (!amountInput) return;

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount greater than 0');
      return;
    }

    // Check if user has sufficient balance
    const balance = await aptosService.getAccountBalance(account.address);
    if (amount > balance) {
      alert(`Insufficient balance. You have ${balance.toFixed(6)} APT but trying to send ${amount} APT.`);
      return;
    }

    setIsSending(true);
    try {
      const result = await aptosService.sendPayment(recipient, amount, signAndSubmitTransaction);
      if (result.success) {
        alert(`✅ Payment sent successfully!\nTransaction hash: ${result.hash}`);
        // Refresh the page to show updated balance and transactions
        setTimeout(() => window.location.reload(), 2000);
      } else {
        alert(`❌ Payment failed: ${result.error}`);
      }
    } catch (error: any) {
      alert(`❌ Payment failed: ${error.message || 'An unexpected error occurred'}`);
    } finally {
      setIsSending(false);
    }
  };

  const actions = [
    {
      icon: Send,
      label: isSending ? 'Sending...' : 'Send APT',
      description: 'Transfer APT to any address',
      gradient: 'bg-gradient-to-br from-blue-600 to-blue-700',
      onClick: handleSendPayment,
      disabled: isSending || !connected
    },
    {
      icon: Calendar,
      label: 'Schedule',
      description: 'Recurring payments (Soon)',
      gradient: 'bg-gradient-to-br from-purple-600 to-purple-700',
      onClick: () => alert('🚧 Scheduled payments coming soon!'),
      disabled: !connected
    },
    {
      icon: Users,
      label: 'Split Payment',
      description: 'Split expenses (Soon)',
      gradient: 'bg-gradient-to-br from-cyan-600 to-cyan-700',
      onClick: () => alert('🚧 Split payments coming soon!'),
      disabled: !connected
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {actions.map((action, index) => (
        <ActionButton
          key={action.label}
          {...action}
          delay={0.4 + index * 0.1}
        />
      ))}
    </div>
  );
};

// Enhanced Transaction Item Component
const TransactionItem = ({
  transaction,
  index
}: {
  transaction: Transaction;
  index: number;
}) => {
  const Icon = transaction.type === 'incoming' ? ArrowDownLeft : ArrowUpRight;
  const isIncoming = transaction.type === 'incoming';
  const [isCopied, setIsCopied] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'failed': return 'text-red-400 bg-red-400/10 border-red-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const viewOnExplorer = () => {
    if (transaction.hash) {
      window.open(`https://explorer.aptoslabs.com/txn/${transaction.hash}?network=testnet`, '_blank');
    }
  };

  const copyHash = () => {
    if (transaction.hash) {
      navigator.clipboard.writeText(transaction.hash);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all group"
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-lg border ${
          isIncoming
            ? 'bg-green-400/10 border-green-400/20 text-green-400'
            : 'bg-red-400/10 border-red-400/20 text-red-400'
        }`}>
          <Icon className="w-5 h-5" />
        </div>

        <div>
          <div className="font-medium text-white group-hover:text-cyan-400 transition-colors">
            {transaction.description}
          </div>
          <div className="text-sm text-gray-400">
            {new Date(transaction.timestamp).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        <span className={`text-lg font-semibold ${
          isIncoming ? 'text-green-400' : 'text-red-400'
        }`}>
          {isIncoming ? '+' : '-'}{transaction.amount.toFixed(6)} APT
        </span>

        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(transaction.status)}`}>
          {transaction.status}
        </span>

        <div className="flex items-center space-x-1">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={copyHash}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title="Copy transaction hash"
          >
            {isCopied ? (
              <Check className="w-4 h-4 text-green-400" />
            ) : (
              <Copy className="w-4 h-4 text-gray-400" />
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={viewOnExplorer}
            className="p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            title="View on Explorer"
          >
            <Eye className="w-4 h-4 text-gray-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced Transactions Section
const TransactionsSection = () => {
  const { account, connected } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTransactions = async () => {
    if (!connected || !account) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    const loadingState = transactions.length === 0 ? setLoading : setIsRefreshing;
    loadingState(true);

    try {
      const txns = await aptosService.getTransactions(account.address);
      setTransactions(txns);
      console.log('Fetched transactions:', txns);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      loadingState(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [account, connected]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-800/30 rounded-2xl border border-gray-700/30 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">
            Recent Transactions
            {loading && <span className="text-sm text-gray-400 ml-2">Loading...</span>}
          </h3>
          <p className="text-gray-400 text-sm">Your latest blockchain activities</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchTransactions}
          disabled={isRefreshing}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-700/50 hover:bg-gray-700 rounded-lg border border-gray-600/50 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span className="text-sm text-gray-300">Refresh</span>
        </motion.button>
      </div>

      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            {loading ? 'Loading transactions...' : 'No transactions found'}
          </div>
        ) : (
          transactions.map((transaction, index) => (
            <TransactionItem key={transaction.id} transaction={transaction} index={index} />
          ))
        )}
      </div>
    </motion.div>
  );
};

// Enhanced Notifications Section
const NotificationsSection = () => {
  const { connected, account } = useWallet();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!connected) {
      setNotifications([{
        id: 'connect-wallet',
        type: 'warning',
        message: 'Connect your wallet to see transactions and send payments',
        timestamp: 'Just now',
        unread: true
      }]);
      return;
    }

    const realNotifications: Notification[] = [
      {
        id: '1',
        type: 'success',
        message: `Wallet connected: ${account?.address.slice(0, 8)}...`,
        timestamp: new Date().toLocaleTimeString(),
        unread: true
      },
      {
        id: '2',
        type: 'info',
        message: 'You can now send APT tokens and view your transaction history',
        timestamp: 'Just now',
        unread: true
      }
    ];

    setNotifications(realNotifications);
  }, [account, connected]);

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.map(n =>
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="bg-gray-800/30 rounded-2xl border border-gray-700/30 p-6 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-semibold text-white mb-1">Notifications</h3>
          <p className="text-gray-400 text-sm">Wallet status and updates</p>
        </div>

        <div className="flex items-center space-x-2">
          <Bell className="w-5 h-5 text-cyan-400" />
          {unreadCount > 0 && (
            <span className="text-sm text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full">
              {unreadCount} new
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50 transition-all ${
                notification.unread ? 'border-l-4 border-l-cyan-400' : ''
              }`}
            >
              <div className={`p-2 rounded-lg border ${
                notification.type === 'warning' ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' :
                notification.type === 'error' ? 'text-red-400 bg-red-400/10 border-red-400/20' :
                notification.type === 'success' ? 'text-green-400 bg-green-400/10 border-green-400/20' :
                'text-cyan-400 bg-cyan-400/10 border-cyan-400/20'
              }`}>
                {notification.type === 'warning' ? <AlertCircle className="w-4 h-4" /> :
                 notification.type === 'error' ? <Shield className="w-4 h-4" /> :
                 notification.type === 'success' ? <CheckCircle className="w-4 h-4" /> :
                 <Info className="w-4 h-4" />}
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium text-white">{notification.message}</div>
                <div className="text-xs text-gray-400">{notification.timestamp}</div>
              </div>

              {notification.unread && (
                <button
                  onClick={() => dismissNotification(notification.id)}
                  className="p-1 hover:bg-gray-700/50 rounded transition-colors text-gray-400 hover:text-white"
                >
                  ×
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Main Dashboard Page
export default function DashboardPage() {
  const { connected, connecting, error } = useWallet();

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-500/10 border border-red-500/30 rounded-2xl p-8 max-w-md text-center"
        >
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h2 className="text-xl font-semibold text-white mb-2">Connection Error</h2>
          <p className="text-red-200/80 mb-4">{error.message}</p>
          <WalletConnectButton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Banner */}
        {!connected && <ConnectionBanner />}

        {/* Wallet Balance */}
        {connected && (
          <section className="mb-8">
            <WalletBalance />
          </section>
        )}

        {/* Quick Stats */}
        {connected && (
          <section className="mb-8">
            <QuickStats />
          </section>
        )}

        {/* Actions Section */}
        {connected && (
          <section className="mb-8">
            <ActionsSection />
          </section>
        )}

        {/* Transactions and Notifications Grid */}
        {connected && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <TransactionsSection />
            <NotificationsSection />
          </section>
        )}

        {/* Loading State */}
        {connecting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <div className="bg-gray-800/90 border border-gray-700/50 rounded-2xl p-8 text-center">
              <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h3 className="text-xl font-semibold text-white mb-2">Connecting Wallet</h3>
              <p className="text-gray-400">Please approve the connection in your wallet</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
