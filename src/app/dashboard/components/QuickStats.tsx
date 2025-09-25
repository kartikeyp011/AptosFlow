'use client';

import { motion } from 'framer-motion';
import { CreditCard, Calendar, Users, MoreVertical } from 'lucide-react';

const quickStats = [
  { label: 'Total Transactions', value: 128, change: '+12%', icon: CreditCard },
  { label: 'Active Subscriptions', value: 7, change: '+2', icon: Calendar },
  { label: 'Split Payments', value: 23, change: '+5%', icon: Users },
];

export const QuickStats = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {quickStats.map((stat, idx) => {
      const Icon = stat.icon;
      return (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 + idx * 0.1 }}
          whileHover={{ y: -5, scale: 1.02 }}
          className="bg-gray-800/50 rounded-xl p-6 border border-gray-700/30 hover:border-gray-600/50 transition-all group"
        >
          <div className="flex justify-between mb-4">
            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <Icon className="w-6 h-6 text-blue-400" />
            </div>
            <MoreVertical className="w-5 h-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
          <div className="text-sm text-gray-400">{stat.label}</div>
          <div className="text-xs text-green-400 font-medium">{stat.change}</div>
        </motion.div>
      );
    })}
  </div>
);
