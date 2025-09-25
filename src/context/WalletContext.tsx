'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

// Types for Aptos wallet
interface AptosWallet {
  connect: () => Promise<{ address: string }>;
  disconnect: () => Promise<void>;
  account: () => Promise<{ address: string }>;
  isConnected: () => Promise<boolean>;
  network: () => Promise<string>;
  signAndSubmitTransaction: (transaction: any) => Promise<any>;
}

interface WalletContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  account: string | null;
  aptBalance: number | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: () => {},
  account: null,
  aptBalance: null,
  isConnected: false,
  isConnecting: false,
  error: null,
});

export const useWallet = () => useContext(WalletContext);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [aptBalance, setAptBalance] = useState<number | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    if (typeof window === 'undefined') return;

    try {
      // Check for Petra wallet (Aptos official wallet)
      if (window?.aptos) {
        const connected = await window.aptos.isConnected();
        if (connected) {
          const account = await window.aptos.account();
          setAccount(account.address);
          setIsConnected(true);
          await fetchBalance(account.address);
        }
      }
      // Check for Martian wallet
      else if (window?.martian) {
        const connected = await window.martian.isConnected();
        if (connected) {
          const account = await window.martian.account();
          setAccount(account.address);
          setIsConnected(true);
          await fetchBalance(account.address);
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const connect = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      // Try Petra wallet first
      if (window?.aptos) {
        const response = await window.aptos.connect();
        setAccount(response.address);
        setIsConnected(true);
        await fetchBalance(response.address);
      }
      // Try Martian wallet second
      else if (window?.martian) {
        const response = await window.martian.connect();
        setAccount(response.address);
        setIsConnected(true);
        await fetchBalance(response.address);
      }
      // No wallet detected
      else {
        throw new Error(
          'No Aptos wallet found. Please install Petra wallet from https://petra.app/'
        );
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setError(error instanceof Error ? error.message : 'Failed to connect wallet');
      setIsConnected(false);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    try {
      if (window?.aptos) {
        await window.aptos.disconnect();
      }
      if (window?.martian) {
        await window.martian.disconnect();
      }
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    } finally {
      setAccount(null);
      setAptBalance(null);
      setIsConnected(false);
      setError(null);
    }
  };

  const fetchBalance = async (address: string) => {
    try {
      // Simulate balance fetch - replace with actual Aptos API call
      const mockBalance = Math.random() * 100; // Random balance for demo
      setAptBalance(parseFloat(mockBalance.toFixed(2)));
      
      // Actual implementation would look like:
      // const client = new AptosClient('https://fullnode.devnet.aptoslabs.com');
      // const resources = await client.getAccountResources(address);
      // const coinResource = resources.find(r => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>');
      // const balance = coinResource ? parseInt(coinResource.data.coin.value) / 100000000 : 0;
      // setAptBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setAptBalance(null);
    }
  };

  return (
    <WalletContext.Provider
      value={{
        connect,
        disconnect,
        account,
        aptBalance,
        isConnected,
        isConnecting,
        error,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

// Extend Window interface to include wallet providers
declare global {
  interface Window {
    aptos?: any;
    martian?: any;
  }
}
