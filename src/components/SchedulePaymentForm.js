// components/SchedulePaymentForm.js
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWeb3 } from '../contexts/Web3Context';
import { ethers } from 'ethers';

// Mock smart contract ABI (replace with your actual contract ABI)
const RECURRING_PAYMENTS_ABI = [
  "function createRecurringPayment(address payee, uint256 amount, uint256 interval, uint256 startTime) external returns (uint256)",
  "function getPayment(uint256 paymentId) external view returns (address, uint256, uint256, uint256, bool)",
  "function cancelPayment(uint256 paymentId) external"
];

const CONTRACT_ADDRESS = "0xYourContractAddressHere"; // Replace with actual contract address

const SchedulePaymentForm = () => {
  const { account, provider, isConnected, connectWallet } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    payeeAddress: '',
    amount: '',
    interval: 'monthly',
    startDate: '',
    startTime: '',
  });

  const intervalsInSeconds = {
    daily: 24 * 60 * 60,
    weekly: 7 * 24 * 60 * 60,
    monthly: 30 * 24 * 60 * 60, // Approximate
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!formData.payeeAddress || !formData.amount || !formData.startDate || !formData.startTime) {
      alert('Please fill all fields');
      return;
    }

    setIsLoading(true);

    try {
      // Validate Ethereum address
      if (!ethers.utils.isAddress(formData.payeeAddress)) {
        throw new Error('Invalid Ethereum address');
      }

      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, RECURRING_PAYMENTS_ABI, signer);

      // Convert amount to wei
      const amountInWei = ethers.utils.parseEther(formData.amount);
      
      // Calculate start timestamp
      const startDateTime = new Date(`${formData.startDate}T${formData.startTime}`);
      const startTimestamp = Math.floor(startDateTime.getTime() / 1000);

      // Get interval in seconds
      const intervalSeconds = intervalsInSeconds[formData.interval];

      // Create recurring payment
      const tx = await contract.createRecurringPayment(
        formData.payeeAddress,
        amountInWei,
        intervalSeconds,
        startTimestamp
      );

      console.log('Transaction sent:', tx.hash);
      
      // Wait for transaction confirmation
      const receipt = await tx.wait();
      console.log('Transaction confirmed:', receipt);

      alert('Recurring payment scheduled successfully!');
      
      // Reset form
      setFormData({
        payeeAddress: '',
        amount: '',
        interval: 'monthly',
        startDate: '',
        startTime: '',
      });

    } catch (error) {
      console.error('Error scheduling payment:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Set default start date to tomorrow
  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
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
            
            {!isConnected ? (
              <div className="text-center py-8">
                <p className="text-gray-300 mb-4">Connect your wallet to schedule payments</p>
                <RippleButton onClick={connectWallet} className="w-full py-4 text-lg">
                  Connect Wallet
                </RippleButton>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Connected Wallet Info */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                  <p className="text-green-400 text-sm">
                    Connected: {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>

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
                    placeholder="0x742d35Cc6634C0532925a3b8D..."
                    required
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Amount (ETH)
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="number"
                    value={formData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    placeholder="0.00"
                    step="0.001"
                    min="0.001"
                    required
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
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
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
                      value={formData.startDate || getTomorrowDate()}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      min={getTomorrowDate()}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Start Time
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="time"
                      value={formData.startTime || '09:00'}
                      onChange={(e) => handleInputChange('startTime', e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-4 py-3 text-white transition-all duration-300 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <RippleButton 
                    type="submit" 
                    className="w-full py-4 text-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Schedule Recurring Payment'}
                  </RippleButton>
                </div>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
