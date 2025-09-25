'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Particle Background Component
const ParticleBackground = () => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        duration: Math.random() * 20 + 10,
        delay: Math.random() * 5,
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-300/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Ripple Button Component
const RippleButton = ({ children, onClick, className = '' }) => {
  const [ripple, setRipple] = useState({ x: 0, y: 0, isRippling: false });

  const handleClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      isRippling: true,
    });
    
    setTimeout(() => setRipple({ ...ripple, isRippling: false }), 600);
    
    if (onClick) onClick(event);
  };

  return (
    <button
      className={`relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25 ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripple.isRippling && (
        <motion.span
          className="absolute bg-white/30 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
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

// Glassmorphism Card Component
const GlassCard = ({ children, className = '' }) => (
  <motion.div
    className={`backdrop-blur-md bg-gray-900/30 border border-gray-700/50 rounded-2xl p-6 relative overflow-hidden ${className}`}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-400/5 rounded-2xl" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

// Navbar Component
// const Navbar = () => {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);

//   return (
//     <nav className="relative z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-700/50">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between items-center h-16">
//           {/* Logo */}
//           <motion.div
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//             className="flex items-center space-x-2"
//           >
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg" />
//             <span className="text-xl font-bold text-white">Smart-Pay</span>
//           </motion.div>

//           {/* Navigation Links */}
//           <div className="hidden md:flex items-center space-x-8">
//             {['Dashboard', 'Payments', 'Recurring', 'Analytics', 'Settings'].map((item) => (
//               <motion.a
//                 key={item}
//                 href="#"
//                 className={`relative font-medium transition-colors duration-200 ${
//                   item === 'Recurring' 
//                     ? 'text-cyan-400' 
//                     : 'text-gray-300 hover:text-white'
//                 }`}
//                 whileHover={{ y: -1 }}
//               >
//                 {item}
//                 {item === 'Recurring' && (
//                   <motion.div
//                     className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400"
//                     layoutId="navbarIndicator"
//                   />
//                 )}
//               </motion.a>
//             ))}
//           </div>

//           {/* Search Bar */}
//           <div className="flex items-center space-x-4">
//             <motion.div
//               className={`relative ${isSearchOpen ? 'w-64' : 'w-8'}`}
//               animate={{ width: isSearchOpen ? 256 : 32 }}
//             >
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className={`w-full bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 ${
//                   isSearchOpen ? 'opacity-100' : 'opacity-0 absolute'
//                 }`}
//               />
//               <motion.button
//                 onClick={() => setIsSearchOpen(!isSearchOpen)}
//                 className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors"
//                 whileHover={{ scale: 1.1 }}
//                 whileTap={{ scale: 0.9 }}
//               >
//                 🔍
//               </motion.button>
//             </motion.div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// Hero Section
const HeroSection = () => (
  <section className="relative z-10 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
    <div className="max-w-7xl mx-auto text-center">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent mb-6"
      >
        Recurring Payments
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
      >
        Automate your payments and stay on top effortlessly with Smart-Pay's intelligent scheduling system.
      </motion.p>
    </div>
  </section>
);

// Schedule Payment Form
const SchedulePaymentForm = () => {
  const [formData, setFormData] = useState({
    payeeAddress: '',
    amount: '',
    interval: 'monthly',
    startDate: '',
    startTime: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission logic would go here
    console.log('Scheduling payment:', formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring' }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Schedule New Payment</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payee Address */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payee Address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="text"
                  value={formData.payeeAddress}
                  onChange={(e) => handleInputChange('payeeAddress', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="Enter payee wallet address"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Amount
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  type="number"
                  value={formData.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>

              {/* Interval */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Interval
                </label>
                <motion.select
                  whileFocus={{ scale: 1.02 }}
                  value={formData.interval}
                  onChange={(e) => handleInputChange('interval', e.target.value)}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="custom">Custom</option>
                </motion.select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Time
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => handleInputChange('startTime', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <RippleButton type="submit" className="w-full py-4 text-lg">
                  Schedule Recurring Payment
                </RippleButton>
              </div>
            </form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

// Upcoming Payments List
const UpcomingPaymentsList = () => {
  const payments = [
    {
      id: 1,
      payee: '0x742d35Cc6634C0532925a3b8D...',
      amount: '0.5 ETH',
      interval: 'Monthly',
      nextPayment: '2024-02-15 14:30',
      status: 'active',
    },
    {
      id: 2,
      payee: '0x89205A3a3b2C5D8e8D...',
      amount: '1.2 ETH',
      interval: 'Weekly',
      nextPayment: '2024-02-08 09:00',
      status: 'active',
    },
    {
      id: 3,
      payee: '0x3450a3B5d4Cc2D5E8F...',
      amount: '0.8 ETH',
      interval: 'Daily',
      nextPayment: '2024-02-06 18:00',
      status: 'paused',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400';
      case 'completed': return 'bg-blue-500/20 text-blue-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Upcoming Payments</h2>
            <div className="space-y-4">
              {payments.map((payment, index) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-cyan-400/30 transition-all duration-300"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{payment.payee[2]}</span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{payment.payee.slice(0, 10)}...{payment.payee.slice(-8)}</p>
                      <p className="text-gray-400 text-sm">{payment.interval}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-white font-semibold">{payment.amount}</p>
                      <p className="text-gray-400 text-sm">{payment.nextPayment}</p>
                    </div>
                    
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </div>
                    
                    <div className="flex space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.1, x: -2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-colors"
                      >
                        ✏️
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1, x: 2 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                      >
                        🗑️
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

// Tips/Info Section
const TipsSection = () => {
  const tips = [
    {
      icon: '⏰',
      title: 'Set It and Forget It',
      description: 'Automate your regular payments and never miss a deadline again.',
    },
    {
      icon: '🔒',
      title: 'Secure & Reliable',
      description: 'Your payments are protected by blockchain technology with full transparency.',
    },
    {
      icon: '📊',
      title: 'Track Everything',
      description: 'Monitor all your recurring payments from one centralized dashboard.',
    },
  ];

  return (
    <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Why Use Recurring Payments?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="text-center p-6"
                >
                  <div className="text-4xl mb-4">{tip.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                  <p className="text-gray-400">{tip.description}</p>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};

// Footer Component
const Footer = () => (
  <footer className="relative z-10 bg-gradient-to-b from-gray-900 to-gray-950 border-t border-gray-800/50 mt-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="md:col-span-2">
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg" />
            <span className="text-xl font-bold text-white">Smart-Pay</span>
          </div>
          <p className="text-gray-400 max-w-md">
            Automate your payments with confidence. Smart-Pay provides secure, reliable recurring payment solutions built on cutting-edge technology.
          </p>
        </div>
        
        {['Product', 'Company', 'Developers', 'Support'].map((category) => (
          <div key={category}>
            <h4 className="text-white font-semibold mb-4">{category}</h4>
            <ul className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <li key={i}>
                  <motion.a
                    href="#"
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-200 relative group"
                    whileHover={{ x: 5 }}
                  >
                    <span className="relative">
                      Link {i + 1}
                      <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full" />
                    </span>
                  </motion.a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      
      <div className="border-t border-gray-800/50 mt-8 pt-8 text-center text-gray-400">
        <p>&copy; 2024 Smart-Pay. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

// Main Component
// src/app/recurring-payment/page.tsx
import { Web3Provider } from '@/contexts/Web3Context';

export default function RecurringPaymentsPage() {
  return (
    <Web3Provider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white relative overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-cyan-900/10 animate-gradient-shift" />
        
        {/* Particle Background */}
        <ParticleBackground />
        
        {/* Main Content */}
        <div className="relative z-10">
          <HeroSection />
          <SchedulePaymentForm />
          <UpcomingPaymentsList />
          <TipsSection />
          <Footer />
        </div>

        {/* Custom CSS for animations */}
        <style jsx global>{`
          @keyframes gradient-shift {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient-shift {
            background-size: 200% 200%;
            animation: gradient-shift 15s ease infinite;
          }
        `}</style>
      </div>
    </Web3Provider>
  );
}
// export default function RecurringPaymentsPage() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white relative overflow-hidden">
//       {/* Animated Gradient Background */}
//       <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-blue-900/20 to-cyan-900/10 animate-gradient-shift" />
      
//       {/* Particle Background */}
//       <ParticleBackground />
      
//       {/* Main Content */}
//       <div className="relative z-10">
//         <HeroSection />
//         <SchedulePaymentForm />
//         <UpcomingPaymentsList />
//         <TipsSection />
//         <Footer />
//       </div>

//       {/* Custom CSS for animations */}
//       <style jsx global>{`
//         @keyframes gradient-shift {
//           0%, 100% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//         }
//         .animate-gradient-shift {
//           background-size: 200% 200%;
//           animation: gradient-shift 15s ease infinite;
//         }
//       `}</style>
//     </div>
//   );
// }
