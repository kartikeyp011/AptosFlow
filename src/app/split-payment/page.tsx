'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Particle background component
const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{x: number, y: number, size: number, delay: number}>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 5
      }));
      setParticles(newParticles);
    };
    generateParticles();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-transparent to-cyan-400/10"></div>
      <AnimatePresence>
        {particles.map((particle, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-blue-400/30 to-cyan-300/30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              delay: particle.delay,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Ripple effect component
const RippleButton = ({ children, onClick, className = '' }: { children: React.ReactNode, onClick?: () => void, className?: string }) => {
  const [ripple, setRipple] = useState<{x: number, y: number, key: number} | null>(null);
  
  const handleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      key: Date.now()
    });
    setTimeout(() => setRipple(null), 600);
    onClick?.();
  };

  return (
    <button 
      className={`relative overflow-hidden rounded-lg px-6 py-3 font-medium transition-all duration-300 hover:scale-105 hover:shadow-2xl ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripple && (
        <motion.span
          key={ripple.key}
          className="absolute rounded-full bg-white/30"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: 'translate(-50%, -50%)'
          }}
        />
      )}
    </button>
  );
};

// Glassmorphism card component
const GlassCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    className={`glassmorphism border border-blue-500/20 bg-blue-900/10 backdrop-blur-md ${className}`}
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
  >
    {children}
  </motion.div>
);

// Animated counter component
const AnimatedCounter = ({ value, duration = 2 }: { value: number, duration?: number }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration * 1000) / end;
    
    const timer = setInterval(() => {
      start += 1;
      setCount(start);
      if (start === end) clearInterval(timer);
    }, incrementTime);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <span>${count.toLocaleString()}</span>;
};

const PaymentSplitPage = () => {
  const [senderBalance] = useState(12500);
  const [recipients, setRecipients] = useState([{ id: 1, name: '', address: '', amount: '' }]);
  const [splits, setSplits] = useState([
    { id: 1, name: 'Team Payment', recipients: 3, total: 4500, status: 'completed', date: '2024-01-15' },
    { id: 2, name: 'Vendor Split', recipients: 2, total: 3200, status: 'pending', date: '2024-01-16' },
    { id: 3, name: 'Project Funds', recipients: 4, total: 7800, status: 'completed', date: '2024-01-14' }
  ]);

  const addRecipient = () => {
    setRecipients([...recipients, { id: recipients.length + 1, name: '', address: '', amount: '' }]);
  };

  const removeRecipient = (id: number) => {
    if (recipients.length > 1) {
      setRecipients(recipients.filter(recipient => recipient.id !== id));
    }
  };

  const updateRecipient = (id: number, field: string, value: string) => {
    setRecipients(recipients.map(recipient => 
      recipient.id === id ? { ...recipient, [field]: value } : recipient
    ));
  };

  const totalAmount = recipients.reduce((sum, recipient) => sum + (parseFloat(recipient.amount) || 0), 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white">
      <ParticleBackground />
      
      {/* Navbar */}
      <nav className="border-b border-blue-500/20 bg-blue-900/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Smart-Pay
            </motion.div>
            
            <motion.div 
              className="flex items-center space-x-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search..."
                  className="rounded-lg bg-blue-800/20 border border-blue-500/30 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-300">
                  🔍
                </div>
              </div>
              <div className="flex space-x-6">
                {['Dashboard', 'Split Payment', 'History', 'Settings'].map((item) => (
                  <a 
                    key={item}
                    className={`relative font-medium transition-all duration-300 hover:text-cyan-300 ${
                      item === 'Split Payment' ? 'text-cyan-400' : 'text-blue-200'
                    }`}
                  >
                    {item}
                    {item === 'Split Payment' && (
                      <motion.div 
                        className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-cyan-300"
                        layoutId="navbarIndicator"
                      />
                    )}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="container mx-auto px-6 text-center">
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-size-200 animate-gradient">
              Split Your Payments Effortlessly
            </span>
          </motion.h1>
          <motion.p 
            className="text-xl text-blue-200 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Divide payments among multiple recipients with ease. Fast, secure, and transparent payment splitting for teams, vendors, and projects.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 pb-20">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Split Form */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <GlassCard className="p-8">
              <motion.h2 
                className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent"
                variants={itemVariants}
              >
                Create Payment Split
              </motion.h2>
              
              {/* Sender Balance */}
              <motion.div 
                className="mb-8 p-4 rounded-lg bg-blue-800/20 border border-blue-500/30"
                variants={itemVariants}
              >
                <div className="text-blue-300 text-sm">Your Balance</div>
                <div className="text-2xl font-bold text-cyan-300">
                  $<AnimatedCounter value={senderBalance} />
                </div>
              </motion.div>

              {/* Recipients List */}
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-blue-200">Recipients</h3>
                  <span className="text-sm text-blue-400">{recipients.length} recipient(s)</span>
                </div>
                
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {recipients.map((recipient, index) => (
                    <motion.div 
                      key={recipient.id}
                      className="p-4 rounded-lg bg-blue-800/10 border border-blue-500/20"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                          <label className="text-sm text-blue-300 block mb-1">Name</label>
                          <input 
                            type="text"
                            value={recipient.name}
                            onChange={(e) => updateRecipient(recipient.id, 'name', e.target.value)}
                            className="w-full rounded-lg bg-blue-900/30 border border-blue-500/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
                            placeholder="Recipient Name"
                          />
                        </div>
                        <div>
                          <label className="text-sm text-blue-300 block mb-1">Amount ($)</label>
                          <input 
                            type="number"
                            value={recipient.amount}
                            onChange={(e) => updateRecipient(recipient.id, 'amount', e.target.value)}
                            className="w-full rounded-lg bg-blue-900/30 border border-blue-500/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="text-sm text-blue-300 block mb-1">Wallet Address</label>
                        <input 
                          type="text"
                          value={recipient.address}
                          onChange={(e) => updateRecipient(recipient.id, 'address', e.target.value)}
                          className="w-full rounded-lg bg-blue-900/30 border border-blue-500/30 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 transition-all duration-300"
                          placeholder="0x..."
                        />
                      </div>
                      {recipients.length > 1 && (
                        <button 
                          onClick={() => removeRecipient(recipient.id)}
                          className="text-red-400 hover:text-red-300 text-sm transition-colors duration-300"
                        >
                          Remove
                        </button>
                      )}
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={addRecipient}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full mt-4 py-3 border-2 border-dashed border-blue-500/30 rounded-lg text-blue-300 hover:text-cyan-300 hover:border-cyan-400/50 transition-all duration-300"
                >
                  + Add Recipient
                </motion.button>
              </motion.div>

              {/* Total Amount */}
              <motion.div 
                className="mt-6 p-4 rounded-lg bg-gradient-to-r from-blue-600/20 to-cyan-400/20 border border-cyan-400/30"
                variants={itemVariants}
              >
                <div className="flex justify-between items-center">
                  <span className="text-blue-200">Total Amount</span>
                  <span className="text-2xl font-bold text-cyan-300">
                    ${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </motion.div>

              {/* Submit Button */}
              <motion.div className="mt-8" variants={itemVariants}>
                <RippleButton 
                  onClick={() => {}}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold text-lg py-4"
                >
                  Create Payment Split
                </RippleButton>
              </motion.div>
            </GlassCard>
          </motion.div>

          {/* Existing Splits List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <GlassCard className="p-8">
              <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Existing Splits
              </h2>
              
              <div className="space-y-4">
                {splits.map((split, index) => (
                  <motion.div
                    key={split.id}
                    className="p-4 rounded-lg bg-blue-800/10 border border-blue-500/20 hover:border-cyan-400/30 transition-all duration-300 hover:scale-105"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-blue-100">{split.name}</h3>
                        <p className="text-sm text-blue-400">
                          {split.recipients} recipients • {split.date}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        split.status === 'completed' 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-yellow-500/20 text-yellow-300'
                      }`}>
                        {split.status}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-cyan-300">
                        ${split.total.toLocaleString()}
                      </span>
                      <div className="flex space-x-2">
                        <motion.button 
                          className="p-2 rounded-lg bg-blue-700/30 hover:bg-blue-600/50 transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          ✏️
                        </motion.button>
                        <motion.button 
                          className="p-2 rounded-lg bg-red-700/30 hover:bg-red-600/50 transition-colors duration-300"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          🗑️
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>

            {/* Tips Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <GlassCard className="p-6 mt-8">
                <h3 className="text-xl font-semibold mb-4 text-cyan-300">💡 Tips for Efficient Splitting</h3>
                <ul className="space-y-2 text-blue-200">
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Double-check wallet addresses before submitting</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Keep individual amounts above network fees</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>Use descriptive names for better tracking</span>
                  </li>
                </ul>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-blue-500/20 bg-blue-900/10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <motion.div 
              className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent mb-4 md:mb-0"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              Smart-Pay
            </motion.div>
            
            <motion.div 
              className="flex space-x-6"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              {['About', 'Documentation', 'Support', 'Privacy'].map((item) => (
                <a 
                  key={item}
                  className="text-blue-300 hover:text-cyan-300 transition-colors duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              ))}
            </motion.div>
          </div>
          <motion.div 
            className="text-center mt-6 text-blue-400 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            © 2024 Smart-Pay. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentSplitPage;
