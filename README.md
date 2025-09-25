# Aptosphere - Aptos Blockchain Payment Platform

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Petra Wallet browser extension

### Installation
```bash
# Clone the repository
git clone https://github.com/kartikeyp011/aptosphere.git

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create `.env.local` file:
```env
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── layout.tsx         # Root layout (server component)
│   ├── client-layout.tsx  # Client-side providers
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Dashboard/         # Main dashboard components
│   ├── ui/               # Reusable UI components
│   └── Wallet/           # Wallet connection components
├── context/              # React contexts
│   └── WalletContext.tsx # Wallet state management
├── lib/                  # Utility libraries
│   └── aptos.ts         # Aptos blockchain interactions
└── types/               # TypeScript definitions
    └── index.ts         # Shared type definitions
```

## 💳 Core Features

### Wallet Management
- **Multi-wallet support**: Petra, Martian, Pontem compatibility
- **Auto-connect**: Persistent wallet connections
- **Balance tracking**: Real-time APT balance updates
- **Address management**: Copy/display wallet addresses

### Transaction System
- **Send APT**: Instant token transfers
- **Transaction history**: Complete transaction ledger
- **Real-time updates**: Live balance and transaction polling
- **Explorer integration**: Direct links to Aptos Explorer

### Advanced Payments
- **Scheduled payments**: Future-dated transactions (Coming soon)
- **Split payments**: Multi-party payment splitting (Coming soon)
- **Recurring payments**: Automated periodic transfers (Coming soon)

### Security Features
- **Transaction validation**: Address and amount verification
- **Error handling**: Comprehensive error boundaries
- **Secure signing**: Wallet-based transaction signing

## 🔧 Technical Implementation

### Blockchain Integration
```typescript
// Aptos client configuration
const aptosConfig = new AptosConfig({ 
  network: Network.TESTNET 
});
const aptos = new Aptos(aptosConfig);

// Transaction handling
const transaction = {
  arguments: [recipient, amountInOctas],
  function: '0x1::coin::transfer',
  type: 'entry_function_payload',
  type_arguments: ['0x1::aptos_coin::AptosCoin']
};
```

### Data Flow Architecture
1. **Wallet Connection** → Wallet adapter context setup
2. **Balance Fetching** → Account resource polling every 10s
3. **Transaction Loading** → Account transactions with event parsing
4. **Real-time Updates** → WebSocket-like polling mechanism
5. **UI State Management** → Optimistic updates with rollback

### State Management
```typescript
// Wallet state
interface WalletState {
  account: AccountInfo | null;
  connected: boolean;
  connecting: boolean;
  error: string | null;
}

// Transaction state
interface TransactionState {
  transactions: Transaction[];
  loading: boolean;
  lastUpdated: Date | null;
}
```

## 🎨 UI/UX Features

### Responsive Design
- **Mobile-first approach**: Optimized for all devices
- **Dark theme**: Eye-friendly interface
- **Loading states**: Skeleton screens and progress indicators
- **Animation system**: Framer Motion transitions

### User Experience
- **One-click transactions**: Streamlined payment flow
- **Copy functionality**: Address and hash copying
- **Refresh controls**: Manual data updates
- **Notification system**: Real-time alerts and status updates

## 🔒 Security Considerations

### Client-Side Security
- **Input validation**: Address format and amount verification
- **Error boundaries**: Graceful failure handling
- **Transaction confirmation**: User approval requirements
- **No private key storage**: Wallet-based signing only

### Blockchain Security
- **TESTNET validation**: Production-ready transaction checks
- **Gas optimization**: Automatic gas calculation
- **Transaction status**: Success/failure state tracking
- **Network compatibility**: Aptos testnet and testnet support

## 🧪 Testing Strategy

### Test Coverage
```bash
# Unit tests
npm run test:unit

# Integration tests  
npm run test:integration

# E2E tests
npm run test:e2e
```

### Testing Areas
- **Wallet connection flows**
- **Transaction submission and validation**
- **Balance calculation accuracy**
- **Error handling scenarios**
- **UI component functionality**

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Static export (optional)
npm run export
```

### Deployment Platforms
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Alternative deployment option
- **AWS Amplify**: Enterprise deployment solution
- **Docker**: Containerized deployment ready

### Environment Variables
```env
# Production environment
NEXT_PUBLIC_APTOS_NETWORK=testnet
NEXT_PUBLIC_APP_URL=https://aptosphere.vercel.app
NEXT_PUBLIC_VERSION=1.0.0
```

## 🔄 Development Workflow

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Husky**: Pre-commit hooks for quality control

### Git Strategy
```
feature/    # New features
bugfix/     # Bug fixes
hotfix/     # Critical production fixes
release/    # Release preparation
```

### Commit Convention
```
feat: Add scheduled payments functionality
fix: Resolve balance update issue
docs: Update transaction flow documentation
style: Improve button hover states
refactor: Optimize wallet connection logic
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open pull request

### Code Review Process
1. **Automated checks**: Tests and linting must pass
2. **Peer review**: Minimum 1 reviewer approval required
3. **QA testing**: Feature testing on testnet environment
4. **Security review**: Smart contract and frontend security audit

## 🐛 Troubleshooting

### Common Issues
**Wallet Connection Failed**
- Verify Petra Wallet installation
- Check network connectivity
- Ensure wallet is unlocked

**Transaction Stuck**
- Confirm sufficient gas fees
- Check network congestion
- Verify recipient address format

**Balance Not Updating**
- Check internet connection
- Verify wallet connection status
- Manual refresh may be required

### Debug Mode
Enable debug logging by setting:
```javascript
localStorage.setItem('debug', 'aptosphere:*');
```

## 🔮 Future Roadmap

### Medium-term (v1.4-2.0)
- [ ] Multi-token support
- [ ] DeFi integration

### Long-term (v2.0+)
- [ ] Cross-chain compatibility
- [ ] Enterprise features
- [ ] API development
- [ ] Governance system

## 📚 Additional Resources

### Documentation
- [Aptos Developer Docs](https://aptos.dev)
- [Next.js Documentation](https://nextjs.org/docs)
- [Wallet Adapter Documentation](https://github.com/aptos-labs/aptos-wallet-adapter)
