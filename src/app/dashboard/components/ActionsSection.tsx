'use client';

import { motion } from 'framer-motion';
import { Send, Calendar, Users } from 'lucide-react';

const actions = [
  { icon: Send, label: 'Send Payment', description: 'Instant transfer to anyone', gradient: 'bg-gradient-to-br from-blue-600 to-blue-700' },
  { icon: Calendar, label: 'Schedule', description: 'Recurring payments', gradient: 'bg-gradient-to-br from-purple-600 to-purple-700' },
  { icon: Users, label: 'Split Payment', description: 'Share expenses', gradient: 'bg-gradient-to-br from-cyan-600 to-cyan-700' },
];

export const ActionsSection = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {actions.map((action, idx) => (
      <motion.button
        key={idx}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 + idx * 0.1 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className={`relative group p-6 rounded-xl ${action.gradient} shadow-2xl overflow-hidden`}
      >
        <div className="relative z-10 flex items-center space-x-4">
          <div className="p-3 bg-white/10 rounded-lg backdrop-blur-sm border border-white/20">
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <div className="font-semibold text-white text-lg mb-1">{action.label}</div>
            <div className="text-white/80 text-sm">{action.description}</div>
          </div>
        </div>
      </motion.button>
    ))}
  </div>
);
