'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, ChevronRight, Zap, Shield, Globe, Code, Users, Rocket, 
  CheckCircle, ArrowRight, Star, Play, Search, Bell, Download, Filter,
  TrendingUp, Wallet, CreditCard, BarChart3, Settings, User, LogOut,
  Eye, EyeOff, Copy, ExternalLink, MoreHorizontal
} from 'lucide-react';

// Enhanced Floating Background with Professional Dark Blue Palette
const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-blue-900/80 to-cyan-900/60" />
      
      {/* Animated orbs */}
      <motion.div
        className="absolute w-80 h-80 bg-gradient-to-r from-blue-600/20 to-cyan-500/20 rounded-full blur-3xl top-1/4 -left-40"
        animate={{
          y: [0, -40, 0],
          x: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-cyan-500/15 to-blue-600/20 rounded-full blur-3xl top-1/2 -right-48"
        animate={{
          y: [0, 40, 0],
          x: [0, -30, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute w-72 h-72 bg-gradient-to-r from-blue-700/20 to-cyan-400/15 rounded-full blur-3xl bottom-1/4 left-1/3"
        animate={{
          y: [0, -30, 0],
          scale: [1, 1.08, 1],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
      
      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
          animate={{
            y: [0, -100, 0],
            x: [0, Math.sin(i) * 50, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.3,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}
    </div>
  );
};

// Professional Navigation Bar with Search and Notifications
const NavigationBar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(3);

  const navItems = [
    { name: 'Dashboard', icon: BarChart3 },
    { name: 'Wallet', icon: Wallet },
    { name: 'Transactions', icon: CreditCard },
    { name: 'Analytics', icon: TrendingUp },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Smart-Pay
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.name}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-4 h-4" />
                {item.name}
              </motion.button>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <motion.div
              className={`relative ${isSearchOpen ? 'w-64' : 'w-10'}`}
              animate={{ width: isSearchOpen ? 256 : 40 }}
            >
              <Input
                placeholder="Search transactions..."
                className={`bg-gray-800/50 border-gray-700 text-white pl-10 pr-4 transition-all duration-300 ${
                  isSearchOpen ? 'opacity-100' : 'opacity-0 w-0'
                }`}
              />
              <motion.button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Search className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Notifications */}
            <motion.button
              className="relative p-2 text-gray-400 hover:text-white transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {unreadNotifications}
                </motion.span>
              )}
            </motion.button>

            {/* User Menu */}
            <motion.div
              className="flex items-center gap-2 p-1 rounded-lg bg-gray-800/50 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <Settings className="w-4 h-4 text-gray-400" />
            </motion.div>
          </div>
        </div>
      </div>
    </nav>
  );
};

// Enhanced Ripple Button Component with Glassmorphism
const RippleButton = ({ 
  children, 
  variant = "primary",
  className = "",
  onClick,
  icon,
  size = "default"
}: { 
  children: React.ReactNode; 
  variant?: "primary" | "secondary" | "glass";
  className?: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  size?: "sm" | "default" | "lg";
}) => {
  const [ripples, setRipples] = React.useState<Array<{ x: number; y: number; id: number }>>([]);

  const handleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setRipples(prev => [...prev, { x, y, id: Date.now() }]);
    setTimeout(() => setRipples(prev => prev.slice(1)), 600);
    onClick?.();
  };

  const sizeStyles = {
    sm: "px-4 py-2 text-sm",
    default: "px-8 py-3 text-base",
    lg: "px-10 py-4 text-lg"
  };

  const baseStyles = "relative overflow-hidden rounded-xl font-semibold transition-all duration-300 group";
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl",
    secondary: "bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white border border-gray-600 hover:border-gray-500",
    glass: "bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white hover:border-white/30"
  };

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05,
        y: -2,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizeStyles[size]} ${className}`}
      onClick={handleClick}
    >
      {ripples.map(ripple => (
        <motion.span
          key={ripple.id}
          className="absolute bg-white/30 rounded-full"
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
          }}
        />
      ))}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {icon && <span className="group-hover:scale-110 transition-transform">{icon}</span>}
        {children}
        {variant === 'primary' && (
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        )}
      </span>
    </motion.button>
  );
};

// Interactive Chart Component with Tooltips
const AnalyticsChart = () => {
  const data = [
    { month: 'Jan', revenue: 65, volume: 45 },
    { month: 'Feb', revenue: 78, volume: 52 },
    { month: 'Mar', revenue: 90, volume: 68 },
    { month: 'Apr', revenue: 81, volume: 59 },
    { month: 'May', revenue: 56, volume: 42 },
    { month: 'Jun', revenue: 95, volume: 75 },
    { month: 'Jul', revenue: 72, volume: 58 },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  const maxVolume = Math.max(...data.map(d => d.volume));

  return (
    <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Revenue Analytics</h3>
            <p className="text-gray-400 text-sm">Last 7 months performance</p>
          </div>
          <div className="flex gap-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
              Revenue
            </Badge>
            <Badge variant="secondary" className="bg-cyan-500/20 text-cyan-300">
              Volume
            </Badge>
          </div>
        </div>

        <div className="relative h-64">
          {/* Grid lines */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} className="h-px bg-gray-700/50" />
            ))}
          </div>

          {/* Chart bars */}
          <div className="absolute inset-0 flex items-end justify-between px-4">
            {data.map((item, index) => (
              <div key={item.month} className="flex flex-col items-center gap-2">
                {/* Revenue bar */}
                <motion.div
                  className="relative w-8 bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg cursor-pointer group"
                  style={{ height: `${(item.revenue / maxRevenue) * 80}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.revenue / maxRevenue) * 80}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Tooltip */}
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 whitespace-nowrap"
                      >
                        <div className="text-sm font-semibold text-white">${item.revenue}K</div>
                        <div className="text-xs text-gray-400">{item.month}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Volume bar */}
                <motion.div
                  className="relative w-6 bg-gradient-to-t from-cyan-500 to-blue-400 rounded-t-lg opacity-80"
                  style={{ height: `${(item.volume / maxVolume) * 60}%` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${(item.volume / maxVolume) * 60}%` }}
                  transition={{ duration: 0.8, delay: index * 0.1 + 0.2 }}
                />
                
                <span className="text-xs text-gray-400 font-medium">{item.month}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Transactions Table with Filters and Export
const TransactionsTable = () => {
  const transactions = [
    { id: 1, type: 'Received', amount: '+2.5 ETH', value: '$4,250', status: 'Completed', date: '2024-01-15', from: '0x1a2b...3c4d' },
    { id: 2, type: 'Sent', amount: '-1.2 BTC', value: '$48,000', status: 'Completed', date: '2024-01-14', from: '0x5e6f...7g8h' },
    { id: 3, type: 'Received', amount: '+15,000 USDT', value: '$15,000', status: 'Pending', date: '2024-01-14', from: '0x9i0j...1k2l' },
    { id: 4, type: 'Swapped', amount: 'ETH → BTC', value: '$12,500', status: 'Completed', date: '2024-01-13', from: 'Smart-Pay' },
    { id: 5, type: 'Received', amount: '+0.5 BTC', value: '$20,000', status: 'Failed', date: '2024-01-12', from: '0x3m4n...5o6p' },
  ];

  const statusColors = {
    Completed: 'bg-green-500/20 text-green-400',
    Pending: 'bg-yellow-500/20 text-yellow-400',
    Failed: 'bg-red-500/20 text-red-400'
  };

  return (
    <Card className="bg-gray-800/50 backdrop-blur-md border border-gray-700/50">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
            <p className="text-gray-400 text-sm">Last 30 days activity</p>
          </div>
          <div className="flex gap-2">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge variant="secondary" className="bg-gray-700/50 hover:bg-gray-600/50 cursor-pointer">
                <Filter className="w-3 h-3 mr-1" />
                Filter
              </Badge>
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Badge variant="secondary" className="bg-gray-700/50 hover:bg-gray-600/50 cursor-pointer">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Badge>
            </motion.button>
          </div>
        </div>

        <div className="space-y-3">
          {transactions.map((transaction) => (
            <motion.div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg border border-gray-600/30 hover:border-gray-500/50 transition-colors group"
              whileHover={{ y: -2, scale: 1.01 }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  transaction.type === 'Received' ? 'bg-green-500/20' : 
                  transaction.type === 'Sent' ? 'bg-red-500/20' : 'bg-blue-500/20'
                }`}>
                  {transaction.type === 'Received' ? (
                    <ArrowRight className="w-5 h-5 text-green-400 rotate-180" />
                  ) : transaction.type === 'Sent' ? (
                    <ArrowRight className="w-5 h-5 text-red-400" />
                  ) : (
                    <Swap className="w-5 h-5 text-blue-400" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{transaction.type}</span>
                    <Badge className={statusColors[transaction.status as keyof typeof statusColors]}>
                      {transaction.status}
                    </Badge>
                  </div>
                  <div className="text-gray-400 text-sm">{transaction.date}</div>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`font-semibold ${
                  transaction.type === 'Received' ? 'text-green-400' : 
                  transaction.type === 'Sent' ? 'text-red-400' : 'text-blue-400'
                }`}>
                  {transaction.amount}
                </div>
                <div className="text-gray-400 text-sm">{transaction.value}</div>
              </div>

              <motion.button 
                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-600/50 rounded"
                whileHover={{ scale: 1.1 }}
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400" />
              </motion.button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

// Enhanced Hero Section with Professional Dark Theme
const HeroSection = () => {
  const headline = "Revolutionize Crypto Payments";
  const subheading = "Enterprise-grade cryptocurrency payment processing with unmatched security, speed, and reliability for modern businesses.";

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900/80 to-cyan-900/60 px-4 overflow-hidden pt-16">
      <FloatingOrbs />
      
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          {/* Trust Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 mb-4"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
              <span className="text-sm text-white/80 font-medium">Trusted by 10,000+ businesses worldwide</span>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1 
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <span className="bg-gradient-to-r from-white via-blue-200 to-cyan-200 bg-clip-text text-transparent">
              {headline}
            </span>
          </motion.h1>

          <motion.p 
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {subheading}
          </motion.p>

          {/* Feature chips */}
          <motion.div 
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            {['⚡ Instant Settlements', '🔒 Bank-Grade Security', '🌍 Global Coverage', '💸 0.1% Fees'].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 + index * 0.1 }}
                className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-4 py-3 hover:border-white/20 transition-colors"
                whileHover={{ y: -2, scale: 1.05 }}
              >
                <span className="text-white/80 text-sm font-medium">{feature}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center mt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.8 }}
          >
            <RippleButton variant="primary" size="lg">
              Start Free Trial
            </RippleButton>
            
            <RippleButton variant="glass" size="lg" icon={<Play className="w-5 h-5" />}>
              Watch Demo
            </RippleButton>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-white/60 text-sm font-medium">Scroll to explore</span>
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <motion.div 
              className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

// Enhanced Features Section with Glassmorphism
const FeaturesSection = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Process transactions in under 3 seconds with our optimized blockchain infrastructure.",
      gradient: "from-blue-600 to-cyan-500",
      stats: "99.9% Uptime"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Military-Grade Security",
      description: "Multi-signature wallets, cold storage, and insurance protection for your peace of mind.",
      gradient: "from-cyan-500 to-blue-600",
      stats: "256-bit Encryption"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Global Reach",
      description: "Accept payments from 150+ countries with automatic currency conversion.",
      gradient: "from-blue-500 to-cyan-400",
      stats: "150+ Countries"
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: "Easy Integration",
      description: "RESTful APIs, SDKs, and plugins for all major e-commerce platforms.",
      gradient: "from-cyan-400 to-blue-500",
      stats: "15 Min Setup"
    }
  ];

  return (
    <section id="features" className="py-24 bg-gradient-to-br from-gray-900 to-blue-900/50 px-4 relative overflow-hidden">
      <FloatingOrbs />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full px-6 py-3 mb-6"
          >
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Why Choose Smart-Pay</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Built for <span className="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">Enterprise</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Everything you need to accept cryptocurrency payments, manage your finances, and grow your business globally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border border-white/10 hover:border-white/20 transition-all duration-300 group h-full">
                <CardContent className="p-8">
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center text-white shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <Badge variant="secondary" className="bg-white/10 text-white/80">
                      {feature.stats}
                    </Badge>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  
                  <motion.div 
                    className="flex items-center text-cyan-400 font-medium text-sm cursor-pointer"
                    whileHover={{ x: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Analytics Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <AnalyticsChart />
        </motion.div>

        {/* Transactions Preview */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8"
        >
          <TransactionsTable />
        </motion.div>
      </div>
    </section>
  );
};

// Add missing Swap icon component
const Swap = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

// Main Page Component
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900">
      <NavigationBar />
      <HeroSection />
      <FeaturesSection />
    </main>
  );
}
