# StackSUSU

[![Contracts CI](https://github.com/AdekunleBamz/Stacksusu/actions/workflows/contracts.yml/badge.svg)](https://github.com/AdekunleBamz/Stacksusu/actions/workflows/contracts.yml)

A decentralized savings circle (SUSU/ROSCA) platform built on the Stacks blockchain.

## Overview

StackSUSU enables trustless, community-based savings circles where members contribute regularly and take turns receiving the pooled funds. Built with Clarity smart contracts on Stacks, it brings traditional rotating savings practices to Web3 with transparency and security.

## Features

### Core Functionality
- **Create Circles** - Start a savings circle with customizable contribution amounts and frequency
- **Join Circles** - Browse and join existing circles based on your savings goals
- **Contribute** - Make regular STX contributions to your circles
- **Receive Payouts** - Automatically receive pooled funds when it's your turn

### Frontend Features
- **Dashboard** - Overview of your circles, contributions, and upcoming payouts
- **Circle Comparison** - Compare circles side-by-side to make informed decisions
- **Payout Calendar** - Visual calendar showing upcoming contribution and payout dates
- **Contribution Streak** - Track your on-time payment streaks with milestones
- **Circle Activity Log** - Timeline view of all circle events
- **Member Reputation** - View member trust scores and payment history
- **Favorites** - Bookmark circles for quick access
- **Quick Actions** - Floating action button for common tasks
- **Welcome Tour** - Guided onboarding for new users
- **Network Status** - Real-time connection indicator
- **Data Export** - Export circle stats and profile data as CSV/JSON

### Accessibility
- Skip-to-content navigation
- Keyboard shortcuts support
- Screen reader friendly

## Tech Stack

### Smart Contracts (Clarity)
- `stacksusu-core` - Main circle logic
- `stacksusu-admin` - Admin functions
- `stacksusu-escrow` - Fund management
- `stacksusu-nft` - Membership NFTs
- `stacksusu-reputation` - Member reputation system
- `stacksusu-governance` - DAO governance
- `stacksusu-referral` - Referral rewards
- `stacksusu-emergency` - Emergency controls

### Frontend
- **React 19** with TypeScript
- **Vite** for build tooling
- **React Router** for navigation
- **TanStack Query** for data fetching
- **Zustand** for state management
- **Stacks.js** for blockchain interaction

### Stacks SDK Usage
- **@stacks/connect** - Wallet authentication and user session management
- **@stacks/transactions** - Building, signing, and broadcasting Clarity transactions

## Getting Started

### Prerequisites
- Node.js 18+
- Clarinet (for smart contract development)
- A Stacks wallet (Leather/Xverse)

### Installation

```bash
# Clone the repository
git clone https://github.com/AdekunleBamz/Stacksusu.git
cd Stacksusu

# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

### Smart Contract Development

```bash
# Check contracts
clarinet check

# Run tests
clarinet test

# Deploy to devnet
clarinet deployments apply -p deployments/default.devnet-plan.yaml
```

## Project Structure

```
stacksusu/
├── contracts/           # Clarity smart contracts
├── deployments/         # Deployment configurations
├── docs/               # Documentation
├── frontend/           # React frontend
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Page components
│   │   ├── services/   # API and blockchain services
│   │   ├── utils/      # Utility functions
│   │   └── context/    # React context providers
├── settings/           # Network configurations
└── tests/              # Integration tests
```

## Documentation

- [Getting Started](docs/GETTING_STARTED.md)
- [Architecture](docs/ARCHITECTURE.md)
- [API Reference](docs/API.md)
- [Security](docs/SECURITY.md)
- [Testing](docs/TESTING.md)
- [Contracts](docs/CONTRACTS.md)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
