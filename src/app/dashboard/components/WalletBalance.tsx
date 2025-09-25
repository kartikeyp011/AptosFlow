'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Wallet, TrendingUp } from 'lucide-react';
import { useWallet } from '@/components/WalletProvider'; // Your context hook

export const WalletBalance = () => {
  const { account, aptBalance } = useWallet(); // account info + real-time APT balance
  const [displayBalance, setDisplayBalance] = useState(0);

  useEffect(() => {
    if (aptBalance !== undefined) {
      let current = 0;
      const increment = aptBalance / 30;
      const counter = setInterval(() => {
        current += increment;
        if (current >= aptBalance) {
          current = aptBalance;
          clearInterval(counter);
        }
        setDisplayBalance(current);
      }, 30);
      return () => clearInterval(counter);
    }
  }, [aptBalance]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gray-800/50 p-8 border border-gray-700/50 shadow-2xl"
    >
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-cyan-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-300">Total APT Balance</h2>
            <p className="text-sm text-gray-400">{account ? account.address : 'Connect wallet'}</p>
          </div>
          <motion.div whileHover={{ rotate: 15, scale: 1.1 }} className="p-3 bg-gray-800/50 rounded-xl border border-gray-700/50">
            <Wallet className="w-6 h-6 text-cyan-400" />
          </motion.div>
        </div>

        <motion.div className="text-5xl font-bold text-white tracking-tight">
          {displayBalance.toFixed(2)} APT
        </motion.div>

        <div className="flex items-center space-x-4 mt-2 text-green-400 font-medium">
          <TrendingUp className="w-4 h-4" />
          <span>Real-time balance</span>
        </div>
      </div>
    </motion.div>
  );
};
