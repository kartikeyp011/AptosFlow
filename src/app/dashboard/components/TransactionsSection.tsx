'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

const transactions = [
  { id: 1, type: 'incoming', amount: 500, description: 'Payment from Alex', timestamp: '2024-01-15', status: 'completed', icon: ArrowDownLeft },
  { id: 2, type: 'outgoing', amount: 120, description: 'Netflix', timestamp: '2024-01-14', status: 'recurring', icon: ArrowUpRight },
];

export const TransactionsSection = () => {
  const getColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'recurring': return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  return (
    <div className="space-y-3">
      {transactions.map((tx, idx) => {
        const Icon = tx.icon;
        const isIncoming = tx.type === 'incoming';
        return (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/30 hover:border-gray-600/50"
          >
            <div className="flex items-center space-x-4">
              <div className={`p-3 rounded-lg border ${isIncoming ? 'bg-green-400/10 border-green-400/20 text-green-400' : 'bg-red-400/10 border-red-400/20 text-red-400'}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-white font-medium">{tx.description}</div>
                <div className="text-sm text-gray-400">{tx.timestamp}</div>
              </div>
            </div>
            <div className="text-lg font-semibold">{isIncoming ? `+${tx.amount}` : `-${tx.amount}`}</div>
            <div className={`px-2 py-1 rounded-full text-xs border ${getColor(tx.status)}`}>{tx.status}</div>
          </motion.div>
        );
      })}
    </div>
  );
};
