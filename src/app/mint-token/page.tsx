'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiMenu, 
  FiX, 
  FiInfo, 
  FiCheckCircle, 
  FiAlertCircle, 
  FiArrowRight, 
  FiZap,
  FiSearch,
  FiBell,
  FiUser,
  FiFilter,
  FiDownload,
  FiTrendingUp,
  FiActivity
} from 'react-icons/fi';

// Ripple Button Component
const RippleButton = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) => {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null);
  
  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    setTimeout(() => setRipple(null), 600);
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {children}
      {ripple && (
        <motion.span
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute rounded-full bg-white/30"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
    </button>
  );
};

// Status Badge Component
const StatusBadge = ({ status }: { status: 'pending' | 'success' | 'failed' | 'processing' }) => {
  const statusConfig = {
    pending: { color: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40', label: 'Pending' },
    success: { color: 'bg-green-500/20 text-green-300 border-green-500/40', label: 'Success' },
    failed: { color: 'bg-red-500/20 text-red-300 border-red-500/40', label: 'Failed' },
    processing: { color: 'bg-blue-500/20 text-blue-300 border-blue-500/40', label: 'Processing' },
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`px-3 py-1 rounded-full text-xs font-medium border ${statusConfig[status].color}`}
    >
      {statusConfig[status].label}
    </motion.span>
  );
};

// Enhanced Navbar Component
// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [hasUnreadNotifications, setHasUnreadNotifications] = useState(true);

//   return (
//     <nav className="bg-gray-900/80 backdrop-blur-xl border-b border-gray-700/50 sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           {/* Logo */}
//           <div className="flex items-center">
//             <motion.div
//               whileHover={{ scale: 1.05 }}
//               className="flex items-center space-x-3"
//             >
//               <div className="relative">
//                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-xl blur opacity-75"></div>
//                 <FiZap className="relative h-8 w-8 text-white" />
//               </div>
//               <span className="text-white text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
//                 SmartPay
//               </span>
//             </motion.div>
//           </div>

//           {/* Search Bar */}
//           <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
//             <div className="relative w-full">
//               <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <motion.input
//                 whileFocus={{ scale: 1.02 }}
//                 type="text"
//                 placeholder="Search transactions, tokens..."
//                 className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent backdrop-blur-sm"
//               />
//             </div>
//           </div>

//           {/* Desktop Menu & Actions */}
//           <div className="hidden md:flex items-center space-x-4">
//             {/* Notifications */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="relative p-2 text-gray-300 hover:text-white transition-colors"
//             >
//               <FiBell className="h-5 w-5" />
//               {hasUnreadNotifications && (
//                 <motion.span
//                   initial={{ scale: 0 }}
//                   animate={{ scale: 1 }}
//                   className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900"
//                 />
//               )}
//             </motion.button>

//             {/* Filter Button */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl text-gray-300 hover:text-white hover:border-blue-500/50 transition-all backdrop-blur-sm"
//             >
//               <FiFilter className="h-4 w-4" />
//               <span>Filter</span>
//             </motion.button>

//             {/* Export Button */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600/80 to-cyan-500/80 border border-blue-500/30 rounded-xl text-white hover:from-blue-500 hover:to-cyan-400 transition-all backdrop-blur-sm"
//             >
//               <FiDownload className="h-4 w-4" />
//               <span>Export</span>
//             </motion.button>

//             {/* Navigation Links */}
//             <div className="flex items-center space-x-1 ml-4">
//               {['Dashboard', 'Payments', 'Assets', 'Mint', 'Settings'].map((item) => (
//                 <motion.a
//                   key={item}
//                   href="#"
//                   whileHover={{ y: -2 }}
//                   className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
//                     item === 'Mint'
//                       ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg'
//                       : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
//                   }`}
//                 >
//                   {item}
//                 </motion.a>
//               ))}
//             </div>

//             {/* User Profile */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               className="p-2 text-gray-300 hover:text-white transition-colors"
//             >
//               <FiUser className="h-5 w-5" />
//             </motion.button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="md:hidden flex items-center">
//             <motion.button
//               whileTap={{ scale: 0.95 }}
//               onClick={() => setIsMenuOpen(!isMenuOpen)}
//               className="text-gray-300 hover:text-white p-2"
//             >
//               {isMenuOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
//             </motion.button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         <AnimatePresence>
//           {isMenuOpen && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               className="md:hidden border-t border-gray-700/50 backdrop-blur-xl bg-gray-900/95"
//             >
//               <div className="px-2 pt-2 pb-3 space-y-1">
//                 {['Dashboard', 'Payments', 'Assets', 'Mint', 'Settings'].map((item) => (
//                   <motion.a
//                     key={item}
//                     href="#"
//                     whileTap={{ scale: 0.98 }}
//                     className={`block px-3 py-2 rounded-lg text-base font-medium ${
//                       item === 'Mint'
//                         ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white'
//                         : 'text-gray-300 hover:text-white hover:bg-gray-800/50'
//                     }`}
//                   >
//                     {item}
//                   </motion.a>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </div>
//     </nav>
//   );
// };

// Sample Transactions Data
const transactions = [
  { id: 1, type: 'Mint', amount: '1000 SPT', status: 'success', date: '2024-01-15', hash: '0x1a2b...3c4d' },
  { id: 2, type: 'Transfer', amount: '500 SPT', status: 'pending', date: '2024-01-15', hash: '0x5e6f...7g8h' },
  { id: 3, type: 'Mint', amount: '2000 SPT', status: 'failed', date: '2024-01-14', hash: '0x9i0j...1k2l' },
  { id: 4, type: 'Receive', amount: '750 SPT', status: 'success', date: '2024-01-14', hash: '0x3m4n...5o6p' },
];

// Footer Component
const Footer = () => (
  <footer className="bg-gray-900/80 backdrop-blur-xl border-t border-gray-700/50 mt-16">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <motion.div whileHover={{ scale: 1.05 }} className="flex items-center space-x-2 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg blur opacity-75"></div>
              <FiZap className="relative h-6 w-6 text-white" />
            </div>
            <span className="text-white text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              SmartPay
            </span>
          </motion.div>
          <p className="text-gray-400 text-sm">
            Automated blockchain payments and asset integration platform.
          </p>
        </div>
        
        {['Product', 'Company', 'Developers', 'Legal'].map((section) => (
          <div key={section}>
            <h3 className="text-white font-semibold mb-4">{section}</h3>
            <ul className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <motion.a 
                    href="#" 
                    whileHover={{ x: 5, color: '#22d3ee' }}
                    className="text-gray-400 hover:text-cyan-400 text-sm transition-colors block"
                  >
                    {section} Link {i + 1}
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-700/50 mt-8 pt-8 text-center">
        <p className="text-gray-500 text-sm">
          © 2024 SmartPay. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);

const MintTokenPage = () => {
  const [amount, setAmount] = useState('');
  const [tokenName, setTokenName] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'processing' | null; message: string }>({ type: null, message: '' });

  const handleMint = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseInt(amount) <= 0) {
      setStatus({
        type: 'error',
        message: 'Please enter a valid amount greater than 0.'
      });
      return;
    }

    // Simulate processing state
    setStatus({
      type: 'processing',
      message: 'Processing your mint transaction...'
    });

    // Simulate API call delay
    setTimeout(() => {
      setStatus({
        type: 'success',
        message: `Successfully minted ${amount} ${tokenName || 'SPT'} tokens! Transaction Hash: 0x1a2b3c4d5e6f...`
      });
      
      setAmount('');
      setTokenName('');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-transparent to-cyan-800/10 animate-pulse-slow"></div>
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text text-transparent">
                Mint Tokens
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create your custom tokens on the blockchain with enterprise-grade security, 
              real-time analytics, and seamless integration capabilities.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Mint Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-gray-800/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/50 p-8"
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg">
                  <FiZap className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Mint New Tokens</h2>
              </div>

              <form onSubmit={handleMint} className="space-y-6">
                {/* Amount Input */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-3">
                    Amount to Mint *
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1000"
                    className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                    required
                  />
                </div>

                {/* Token Name Input */}
                <div>
                  <label htmlFor="tokenName" className="block text-sm font-medium text-gray-300 mb-3">
                    Token Name (Optional)
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02, borderColor: '#3b82f6' }}
                    type="text"
                    id="tokenName"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    placeholder="SPT"
                    className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
                  />
                </div>

                {/* Submit Button */}
                <RippleButton
                  onClick={handleMint}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-200 flex items-center justify-center space-x-2 mt-6"
                >
                  <span>Mint Tokens</span>
                  <FiArrowRight className="w-5 h-5" />
                </RippleButton>
              </form>
            </motion.div>

            {/* Recent Transactions */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  View All
                </motion.button>
              </div>
              
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-700/30 hover:border-cyan-500/30 transition-all"
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        tx.type === 'Mint' ? 'bg-blue-500/20' : 
                        tx.type === 'Transfer' ? 'bg-purple-500/20' : 'bg-green-500/20'
                      }`}>
                        <FiActivity className={`h-4 w-4 ${
                          tx.type === 'Mint' ? 'text-blue-400' : 
                          tx.type === 'Transfer' ? 'text-purple-400' : 'text-green-400'
                        }`} />
                      </div>
                      <div>
                        <div className="text-white font-medium">{tx.type}</div>
                        <div className="text-gray-400 text-sm">{tx.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-medium">{tx.amount}</div>
                      <StatusBadge status={tx.status as any} />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Stats & Info */}
          <div className="space-y-8">
            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-blue-600/20 to-cyan-500/20 backdrop-blur-xl rounded-2xl border border-blue-500/30 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FiTrendingUp className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Minting Stats</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Minted</span>
                  <span className="text-white font-semibold">45,200 SPT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Today</span>
                  <span className="text-green-400 font-semibold">+1,200 SPT</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Success Rate</span>
                  <span className="text-cyan-400 font-semibold">98.7%</span>
                </div>
              </div>
            </motion.div>

            {/* Guidelines Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <FiInfo className="h-5 w-5 text-cyan-400" />
                <h3 className="text-lg font-semibold text-white">Minting Guidelines</h3>
              </div>
              
              <ul className="space-y-3">
                {[
                  'Maximum mint limit: 1,000,000 tokens per transaction',
                  'Gas fees vary based on network congestion',
                  'Token names must be unique and 3-12 characters',
                  'Transactions typically confirm in 15-30 seconds',
                  'Keep 0.01 ETH for gas fees in your wallet'
                ].map((tip, index) => (
                  <motion.li 
                    key={index}
                    whileHover={{ x: 5 }}
                    className="flex items-start space-x-2 text-gray-300 text-sm"
                  >
                    <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-1.5 flex-shrink-0"></div>
                    <span>{tip}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>

        {/* Status Messages */}
        <AnimatePresence>
          {status.type && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`fixed top-20 right-8 max-w-sm p-4 rounded-xl border backdrop-blur-xl z-50 ${
                status.type === 'success'
                  ? 'bg-green-500/10 border-green-500/30 text-green-200'
                  : status.type === 'error'
                  ? 'bg-red-500/10 border-red-500/30 text-red-200'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-200'
              }`}
            >
              <div className="flex items-center space-x-3">
                {status.type === 'success' ? (
                  <FiCheckCircle className="w-5 h-5 text-green-400" />
                ) : status.type === 'error' ? (
                  <FiAlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-400 border-t-transparent"></div>
                )}
                <div>
                  <p className="font-medium">{status.type.charAt(0).toUpperCase() + status.type.slice(1)}</p>
                  <p className="text-sm opacity-90">{status.message}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      <Footer />
    </div>
  );
};

export default MintTokenPage;
