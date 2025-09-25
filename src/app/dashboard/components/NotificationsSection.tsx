'use client';

import { Bell } from 'lucide-react';
import { motion } from 'framer-motion';

const notifications = [
  { id: 1, message: 'Your subscription was renewed.', time: '2h ago' },
  { id: 2, message: 'You received 50 APT from Alex.', time: '5h ago' },
];

export const NotificationsSection = () => (
  <div className="bg-gray-800/30 rounded-xl border border-gray-700/30 p-6 space-y-3">
    <div className="flex items-center mb-4">
      <Bell className="w-5 h-5 text-cyan-400 mr-2" />
      <h4 className="text-white font-semibold">Notifications</h4>
    </div>
    {notifications.map((n) => (
      <motion.div key={n.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: n.id * 0.1 }} className="p-3 bg-gray-800/50 rounded-lg border border-gray-700/30">
        <div className="text-sm text-white">{n.message}</div>
        <div className="text-xs text-gray-400">{n.time}</div>
      </motion.div>
    ))}
  </div>
);
