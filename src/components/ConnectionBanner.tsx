'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Download, ExternalLink } from 'lucide-react';
import { WalletConnectButton } from './WalletConnectButton';

export const ConnectionBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-900/20 to-cyan-900/20 border border-blue-500/30 rounded-2xl p-6 mb-8 backdrop-blur-sm"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-blue-500/20 rounded-xl border border-blue-500/30">
            <AlertCircle className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-white mb-1">Connect Your Wallet</h3>
            <p className="text-blue-200/80">
              Connect your Aptos wallet to start using SmartPay. We support Petra, Martian, and other Aptos wallets.
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <a
            href="https://petra.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-300 hover:text-white transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Get Petra Wallet</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <WalletConnectButton />
        </div>
      </div>
    </motion.div>
  );
};
