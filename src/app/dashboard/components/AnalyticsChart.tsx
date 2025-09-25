'use client';

import { motion } from 'framer-motion';

const chartData = [
  { date: 'Jan 1', income: 4000, expenses: 2400 },
  { date: 'Jan 5', income: 3000, expenses: 1398 },
];

export const AnalyticsChart = () => {
  const maxValue = Math.max(...chartData.map(d => Math.max(d.income, d.expenses)));

  return (
    <div className="bg-gray-800/30 rounded-2xl border border-gray-700/30 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Financial Analytics</h3>
      </div>

      <div className="space-y-2">
        {chartData.map((d, idx) => (
          <motion.div key={idx} initial={{ width: 0 }} animate={{ width: `${(d.income / maxValue) * 100}%` }} transition={{ duration: 0.6 }} className="relative bg-blue-500 h-4 rounded-full">
            <span className="absolute right-2 top-0 text-xs text-white">{d.income}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
