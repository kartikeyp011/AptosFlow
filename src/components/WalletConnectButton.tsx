// components/WalletConnectButton.tsx
'use client';

import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { LogOut, Wallet } from 'lucide-react';

export const WalletConnectButton = () => {
  const { connect, disconnect, account, connected, connecting, wallets } = useWallet();

  const handleConnect = async () => {
    try {
      if (wallets.length > 0) {
        await connect(wallets[0].name);
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  const handleDisconnect = () => {
    disconnect();
  };

  if (connected && account) {
    return (
      <button
        onClick={handleDisconnect}
        className="flex items-center space-x-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white font-medium transition-colors"
      >
        <LogOut className="w-4 h-4" />
        <span>Disconnect</span>
        <span className="text-xs bg-black/20 px-2 py-1 rounded">
          {account.address.slice(0, 6)}...{account.address.slice(-4)}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      disabled={connecting}
      className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50"
    >
      <Wallet className="w-4 h-4" />
      <span>{connecting ? 'Connecting...' : 'Connect Wallet'}</span>
    </button>
  );
};
