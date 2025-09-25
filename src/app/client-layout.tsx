'use client';

import type { ReactNode } from "react";
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";
import Navbar from "@/components/Navbar";
import "./globals.css";

const wallets = [new PetraWallet()];

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <AptosWalletAdapterProvider
      wallets={wallets}
      autoConnect={true}
      onError={(error) => {
        console.log('Wallet error:', error);
      }}
    >
      <ReactQueryProvider>
        <div id="root" className="min-h-screen flex flex-col bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
          <Navbar />
          <main className="flex-1 p-4">
            {children}
          </main>
        </div>
        <WrongNetworkAlert />
        <Toaster />
      </ReactQueryProvider>
    </AptosWalletAdapterProvider>
  );
}
