'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FiMenu, 
  FiX, 
  FiZap,
  FiBell,
  FiUser,
  FiFilter,
  FiDownload,
  FiHome,
  FiPlusCircle,
  FiShare2,
  FiRepeat,
  FiDollarSign,
  FiBarChart2
} from 'react-icons/fi';

// Mock wallet connection
// const useWallet = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [address, setAddress] = useState('');
//   const [balance, setBalance] = useState('1,250.75');

//   const connectWallet = async () => {
//     setIsConnected(true);
//     setAddress('0xaa5a1e6d8c8a7b8c9d0e1f2a3b4c5d6e7f8a9b0c');
//   };

//   const disconnectWallet = () => {
//     setIsConnected(false);
//     setAddress('');
//   };

//   return { isConnected, address, balance, connectWallet, disconnectWallet };
// };

export default function Navbar() {
  const pathname = usePathname();
  // const { isConnected, address, balance, connectWallet, disconnectWallet } = useWallet();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home', icon: FiHome },
    { href: '/mint-token', label: 'Mint', icon: FiPlusCircle },
    { href: '/transfer-split', label: 'Split', icon: FiShare2 },
    { href: '/recurring-payments', label: 'Recurring Payments', icon: FiRepeat },
    { href: '/rwa-payments', label: 'RWA', icon: FiDollarSign },
    { href: '/transaction-history', label: 'Transaction History', icon: FiBarChart2 },
  ];

  // const truncateAddress = (addr: string) => {
  //   return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  // };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isDropdownOpen]);

  return (
    <>
      <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3"
              >
                <Link href="/" className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl blur opacity-75"></div>
                    <FiZap className="relative h-8 w-8 text-white" />
                  </div>
                  <span className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    SmartPay
                  </span>
                </Link>
              </motion.div>
            </div>

            {/* Desktop Menu & Actions */}
            <div className="hidden md:flex items-center space-x-4">
              {/* Navigation Links */}
              <div className="flex items-center space-x-1">
                {navLinks.map((link) => {
                  const IconComponent = link.icon;
                  const isActive = pathname === link.href;
                  
                  return (
                    <motion.div key={link.href} whileHover={{ y: -2 }}>
                      <Link
                        href={link.href}
                        className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
                            : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                        }`}
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{link.label}</span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative p-2 text-gray-300 hover:text-white transition-colors"
              >
                <FiBell className="h-5 w-5" />
                {hasUnreadNotifications && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"
                  />
                )}
              </motion.button>

              {/* Wallet/Account Section */}
              {/* {isConnected ? (
                <div className="relative">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-blue-500/50 transition-all backdrop-blur-sm"
                  >
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="font-mono text-sm">{truncateAddress(address)}</span>
                    <span className="text-cyan-300 font-semibold">{balance}</span>
                  </motion.button>

                  {/* Dropdown Menu */}
                  {/* {isDropdownOpen && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-gray-900/95 backdrop-blur-xl rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden z-50"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="p-3 border-b border-gray-700/50">
                        <div className="text-sm text-white font-semibold">{truncateAddress(address)}</div>
                        <div className="text-xs text-cyan-300 font-mono">{balance} tokens</div>
                      </div>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 transition-colors">
                        Profile
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-gray-800/50 transition-colors">
                        Settings
                      </button>
                      <button 
                        onClick={disconnectWallet}
                        className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors border-t border-gray-700/50"
                      >
                        Disconnect
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={connectWallet}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/80 to-cyan-500/80 border border-blue-500/30 rounded-xl text-white hover:from-blue-500 hover:to-cyan-400 transition-all backdrop-blur-sm"
                >
                  <FiUser className="h-4 w-4" />
                  <span>Connect Wallet</span>
                </motion.button>
              )} */}

              {/* Filter Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-blue-500/50 transition-all backdrop-blur-sm"
              >
                <FiFilter className="h-4 w-4" />
                <span>Filter</span>
              </motion.button>

              {/* Export Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/80 to-cyan-500/80 border border-blue-500/30 rounded-xl text-white hover:from-blue-500 hover:to-cyan-400 transition-all backdrop-blur-sm"
              >
                <FiDownload className="h-4 w-4" />
                <span>Export</span>
              </motion.button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              {/* {isConnected && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative p-2 text-gray-300 hover:text-white transition-colors"
                >
                  <FiBell className="h-5 w-5" />
                  {hasUnreadNotifications && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-900" />
                  )}
                </motion.button>
              )} */}
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-300 hover:text-white p-2"
              >
                {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
              </motion.button>
            </div>
          </div>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden border-t border-gray-700/50 backdrop-blur-xl bg-gray-900/95"
              >
                <div className="px-2 pt-2 pb-3 space-y-1">
                  {/* Navigation Links */}
                  {navLinks.map((link) => {
                    const IconComponent = link.icon;
                    const isActive = pathname === link.href;
                    
                    return (
                      <motion.div key={link.href} whileTap={{ scale: 0.98 }}>
                        <Link
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-base font-medium ${
                            isActive
                              ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
                              : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                          <span>{link.label}</span>
                        </Link>
                      </motion.div>
                    );
                  })}

                  {/* Mobile Wallet Section */}
                  {/* <div className="px-3 py-2 border-t border-gray-700/50">
                    {isConnected ? (
                      <div className="space-y-2">
                        <div className="text-sm text-gray-400">Connected Wallet</div>
                        <div className="flex justify-between items-center">
                          <span className="font-mono text-cyan-300 text-sm">{truncateAddress(address)}</span>
                          <span className="text-white font-semibold">{balance}</span>
                        </div>
                        <button 
                          onClick={() => {
                            disconnectWallet();
                            setIsMenuOpen(false);
                          }}
                          className="w-full px-3 py-2 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition-colors"
                        >
                          Disconnect Wallet
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          connectWallet();
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg font-medium"
                      >
                        <FiUser className="h-4 w-4" />
                        <span>Connect Wallet</span>
                      </button>
                    )}
                  </div> */}

                  {/* Mobile Action Buttons */}
                  <div className="flex space-x-2 px-3 py-2 border-t border-gray-700/50">
                    <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg text-gray-300 text-sm">
                      <FiFilter className="h-4 w-4" />
                      <span>Filter</span>
                    </button>
                    <button className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-lg text-sm">
                      <FiDownload className="h-4 w-4" />
                      <span>Export</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Overlay for mobile menu */}
      {isMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
}
