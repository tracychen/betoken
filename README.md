# Betoken

BETOKEN is a community-focused prediction market on Telegram for trading and creating event tokens. Anyone can participate by creating markets and buying predictions via a Telegram mini app.

This project was created as a part of ETHGlobal Bangkok 2024 hackathon.

## Core Features

- Token creation, each option in the prediction market is an ERC20 token
- Two types of markets supported: general and price markets:
  - **General**: Any topic, market creators act as the oracle. Open market creation, increased topic range and creative opportunity.
  - **Price markets**: Price markets, for example to predict the price of ETH/USDC in the future. Uses Chronicle as the oracle.
- Quick & easy funding: Supports on-ramp via external wallet, Moonpay, Coinbase, or in-app swaps
- Better wallet UX: Leverages Privy embedded wallets to be able to sign and send transactions from within the Telegram mini app.
- Reputation scoring: Uses various factors to determine a score for each user. This is especially useful for trust in open market creation and resolution. These are the factors supported and their purpose:
  - Wallet activity & balances: Onchain activity and prevents bots, external wallets can only be linked to one BETOKEN account.
  - EAS Attestations e.g. Coinbase trading account, country: Benefit from 3rd party platform verifications, e.g. Coinbase KYC
  - World ID: Proof-of-personhood
  - Gnosis Circles: Social connections and network

## Tech Stack

This project is built as a Telegram mini app using the following:

**Stack / Core tools**:

- Telegram
- Next.js
- tma.js
- Foundry

**Partner technologies**:

- Coinbase OnchainKit: onramp, displaying user addresses and identities, in-app swap, get attestations for reputation score
- Coinbase CDP SDK: Fetching various smart contract events from the main market contract, generate Coinbase buy URL
- Privy: Telegram auth, embedded wallet creation, linking external accounts, onramp
- Chronicle: price market oracle
- World ID: Used as a factor in reputation scoring
- Gnosis Circles: Used as a factor in reputation scoring
- Blockscout: Used as the main explorer
- Mantle, Base: Networks that the app lives on
