'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useInView, useScroll, useTransform } from 'framer-motion';
import { Search, Plus, FileText, Shield, TrendingUp, ArrowRight, Edit, Trash2, CheckCircle, Lock, Upload, Info } from 'lucide-react';

// Particle background component
const ParticleBackground = () => {
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; size: number; delay: number}>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 30 }, (_, i) => ({
        id: i,
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
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-gradient-to-r from-blue-400/20 to-cyan-300/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            y: [0, -20, 0],
            x: [0, 5, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 4,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Ripple button component
const RippleButton = ({ children, onClick, className = '' }: { children: React.ReactNode; onClick?: () => void; className?: string }) => {
  const [ripple, setRipple] = useState<{ x: number; y: number; key: number } | null>(null);

  const handleClick = (event: React.MouseEvent) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setRipple({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
      key: Date.now(),
    });
    onClick?.();
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-semibold py-3 px-6 rounded-xl ${className}`}
      onClick={handleClick}
    >
      {children}
      {ripple && (
        <motion.span
          key={ripple.key}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 0,
            height: 0,
          }}
          animate={{ width: 200, height: 200, opacity: 0 }}
          transition={{ duration: 0.6 }}
        />
      )}
    </motion.button>
  );
};

// Glassmorphic card component
const GlassCard = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <motion.div
    className={`glassmorphic-card border border-blue-500/20 bg-gray-900/50 backdrop-blur-md rounded-2xl p-6 ${className}`}
    whileHover={{ y: -2, transition: { duration: 0.2 } }}
  >
    {children}
  </motion.div>
);

// Animated input component
const AnimatedInput = ({ label, type = 'text', ...props }: { label: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative">
      <motion.input
        type={type}
        className="w-full bg-gray-800/50 border border-blue-500/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-400 transition-all duration-300"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...props}
      />
      <motion.label
        className={`absolute left-4 pointer-events-none transition-all duration-300 ${
          focused || props.value ? 'text-cyan-400 -top-2 text-xs bg-gray-900 px-2' : 'text-gray-400 top-3'
        }`}
      >
        {label}
      </motion.label>
      {focused && (
        <motion.div
          className="absolute inset-0 border-2 border-cyan-400 rounded-lg pointer-events-none"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
};

// Navbar component
// const Navbar = () => {
//   const [searchFocused, setSearchFocused] = useState(false);

//   return (
//     <nav className="relative z-50 border-b border-blue-500/20 bg-gray-900/80 backdrop-blur-md">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           <motion.div
//             className="flex items-center space-x-2"
//             initial={{ opacity: 0, x: -20 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg" />
//             <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
//               Smart-Pay
//             </span>
//           </motion.div>

//           <div className="hidden md:flex items-center space-x-8">
//             {['Dashboard', 'RWA Assets', 'Transactions', 'Settings'].map((item) => (
//               <motion.a
//                 key={item}
//                 href="#"
//                 className={`relative font-medium transition-colors duration-300 ${
//                   item === 'RWA Assets' 
//                     ? 'text-cyan-400' 
//                     : 'text-gray-300 hover:text-white'
//                 }`}
//                 whileHover={{ y: -1 }}
//               >
//                 {item}
//                 {item === 'RWA Assets' && (
//                   <motion.div
//                     className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-blue-600 to-cyan-400"
//                     layoutId="navbarIndicator"
//                   />
//                 )}
//               </motion.a>
//             ))}
//           </div>

//           <motion.div
//             className="relative"
//             initial={{ opacity: 0, x: 20 }}
//             animate={{ opacity: 1, x: 0 }}
//           >
//             <div className="flex items-center space-x-4">
//               <motion.div
//                 className={`relative transition-all duration-300 ${
//                   searchFocused ? 'w-64' : 'w-48'
//                 }`}
//               >
//                 <input
//                   type="text"
//                   placeholder="Search assets..."
//                   className="w-full bg-gray-800/50 border border-blue-500/30 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
//                   onFocus={() => setSearchFocused(true)}
//                   onBlur={() => setSearchFocused(false)}
//                 />
//                 <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
//               </motion.div>
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// Sample data for RWA assets
const initialAssets = [
  {
    id: 1,
    name: 'Commercial Real Estate',
    owner: 'You',
    value: '$2,500,000',
    description: 'Downtown office building',
    status: 'Available' as const,
  },
  {
    id: 2,
    name: 'Government Bonds',
    owner: 'You',
    value: '$1,200,000',
    description: '10-year treasury bonds',
    status: 'Available' as const,
  },
  {
    id: 3,
    name: 'Gold Reserve',
    owner: 'Jane Smith',
    value: '$850,000',
    description: 'Physical gold bullion',
    status: 'Locked' as const,
  },
];

export default function RWAAssetsPage() {
  const [assets, setAssets] = useState(initialAssets);
  const [selectedAsset, setSelectedAsset] = useState(initialAssets[0]);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');

  const heroRef = useRef(null);
  const formRef = useRef(null);
  const assetsRef = useRef(null);
  const paymentRef = useRef(null);
  const tipsRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, amount: 0.3 });
  const formInView = useInView(formRef, { once: true, amount: 0.3 });
  const assetsInView = useInView(assetsRef, { once: true, amount: 0.3 });
  const paymentInView = useInView(paymentRef, { once: true, amount: 0.3 });
  const tipsInView = useInView(tipsRef, { once: true, amount: 0.3 });

  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const handlePayment = async () => {
    setPaymentStatus('processing');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setPaymentStatus('success');
    setTimeout(() => setPaymentStatus('idle'), 3000);
  };

  const addAsset = (asset: typeof initialAssets[0]) => {
    const newAsset = { ...asset, id: assets.length + 1 };
    setAssets([newAsset, ...assets]);
    setSelectedAsset(newAsset);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950/50 to-gray-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-cyan-800/10"
        style={{ y: backgroundY }}
      />
      <ParticleBackground />

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent bg-300%">
                Pay Using Real-World Assets
              </span>
            </motion.h1>
            <motion.p
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Leverage tokenized assets for secure and fast transactions with institutional-grade security.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <RippleButton className="text-lg px-8 py-4">
                Get Started <ArrowRight className="inline ml-2 h-5 w-5" />
              </RippleButton>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Add RWA Asset Form */}
      <section ref={formRef} className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={formInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.3 }}
          >
            <GlassCard className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-2xl blur opacity-30"></div>
              <div className="relative">
                <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Add New RWA Asset
                </h2>
                <div className="space-y-4">
                  <AnimatedInput label="Asset Name" />
                  <AnimatedInput label="Value ($)" type="number" />
                  <AnimatedInput label="Description" />
                  <div className="relative">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="border-2 border-dashed border-blue-500/30 rounded-lg p-6 text-center cursor-pointer hover:border-cyan-400/50 transition-colors"
                    >
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Upload asset documentation (optional)</p>
                      <p className="text-sm text-gray-500">PDF, DOC, or image files</p>
                    </motion.div>
                  </div>
                  <RippleButton className="w-full mt-4" onClick={() => addAsset(initialAssets[0])}>
                    <Plus className="inline mr-2 h-5 w-5" />
                    Add Asset
                  </RippleButton>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Existing RWA Assets List */}
      <section ref={assetsRef} className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={assetsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Your RWA Assets Portfolio
            </h2>
            
            <GlassCard>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-blue-500/20">
                      <th className="text-left py-4 px-4 text-cyan-400 font-semibold">Asset Name</th>
                      <th className="text-left py-4 px-4 text-cyan-400 font-semibold">Owner</th>
                      <th className="text-left py-4 px-4 text-cyan-400 font-semibold">Current Value</th>
                      <th className="text-left py-4 px-4 text-cyan-400 font-semibold">Description</th>
                      <th className="text-left py-4 px-4 text-cyan-400 font-semibold">Status</th>
                      <th className="text-left py-4 px-4 text-cyan-400 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset, index) => (
                      <motion.tr
                        key={asset.id}
                        className="border-b border-blue-500/10 hover:bg-blue-500/5 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
                      >
                        <td className="py-4 px-4 font-medium">{asset.name}</td>
                        <td className="py-4 px-4 text-gray-300">{asset.owner}</td>
                        <td className="py-4 px-4 text-green-400 font-semibold">{asset.value}</td>
                        <td className="py-4 px-4 text-gray-400">{asset.description}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            asset.status === 'Available' 
                              ? 'bg-green-500/20 text-green-400' 
                              : 'bg-red-500/20 text-red-400'
                          }`}>
                            {asset.status === 'Available' ? (
                              <CheckCircle className="h-4 w-4 mr-1" />
                            ) : (
                              <Lock className="h-4 w-4 mr-1" />
                            )}
                            {asset.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex space-x-2">
                            <motion.button
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-blue-500/20 rounded-lg hover:bg-blue-500/30 transition-colors"
                              onClick={() => setSelectedAsset(asset)}
                            >
                              <FileText className="h-4 w-4 text-blue-400" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors"
                            >
                              <Edit className="h-4 w-4 text-cyan-400" />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1, y: -1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                            >
                              <Trash2 className="h-4 w-4 text-red-400" />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Pay with RWA Section */}
      <section ref={paymentRef} className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={paymentInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
            className="grid md:grid-cols-2 gap-8"
          >
            {/* Selected Asset Card */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Selected Asset</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-gray-400 text-sm">Asset Name</label>
                  <p className="font-semibold">{selectedAsset.name}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Current Value</label>
                  <p className="text-green-400 font-bold">{selectedAsset.value}</p>
                </div>
                <div>
                  <label className="text-gray-400 text-sm">Status</label>
                  <p className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                    selectedAsset.status === 'Available' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {selectedAsset.status}
                  </p>
                </div>
              </div>
            </GlassCard>

            {/* Payment Form */}
            <GlassCard>
              <h3 className="text-xl font-bold mb-4 text-cyan-400">Pay with RWA</h3>
              <div className="space-y-4">
                <AnimatedInput
                  label="Amount to Pay ($)"
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
                
                <AnimatePresence>
                  {paymentStatus === 'processing' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full"
                        />
                        <span>Processing payment...</span>
                      </div>
                    </motion.div>
                  )}

                  {paymentStatus === 'success' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-green-500/20 border border-green-500/30 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-3 text-green-400">
                        <CheckCircle className="h-6 w-6" />
                        <span>Payment successful! Transaction completed.</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <RippleButton
                  className="w-full"
                  onClick={handlePayment}
                  disabled={paymentStatus === 'processing'}
                >
                  {paymentStatus === 'processing' ? 'Processing...' : 'Confirm Payment'}
                </RippleButton>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Tips / Info Section */}
      <section ref={tipsRef} className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={tipsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.8 }}
          >
            <GlassCard>
              <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                Best Practices for RWA Usage
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  {
                    icon: Shield,
                    title: 'Secure Documentation',
                    description: 'Always upload verified documentation for your real-world assets to ensure transparency and trust.'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Regular Valuation',
                    description: 'Keep your asset valuations up-to-date to maintain accurate collateral value.'
                  },
                  {
                    icon: FileText,
                    title: 'Legal Compliance',
                    description: 'Ensure all assets comply with local regulations and international standards.'
                  },
                  {
                    icon: Info,
                    title: 'Risk Management',
                    description: 'Diversify your RWA portfolio to mitigate risks associated with single asset exposure.'
                  }
                ].map((tip, index) => (
                  <motion.div
                    key={tip.title}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={tipsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-400 p-3 rounded-lg">
                      <tip.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-cyan-400 mb-1">{tip.title}</h3>
                      <p className="text-gray-300 text-sm">{tip.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-blue-500/20 bg-gray-900/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-400 rounded-lg" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Smart-Pay
                </span>
              </div>
              <p className="text-gray-400">Revolutionizing payments with real-world asset backing.</p>
            </div>
            
            {['About', 'Documentation', 'Support', 'Legal'].map((section) => (
              <div key={section}>
                <h3 className="font-semibold text-cyan-400 mb-4">{section}</h3>
                <ul className="space-y-2">
                  {Array.from({ length: 3 }, (_, i) => (
                    <li key={i}>
                      <motion.a
                        href="#"
                        className="text-gray-400 hover:text-white transition-colors relative group"
                        whileHover={{ x: 2 }}
                      >
                        <span className="relative">
                          {section} Link {i + 1}
                          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-400 transition-all group-hover:w-full"></span>
                        </span>
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          
          <div className="border-t border-blue-500/20 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Smart-Pay. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
