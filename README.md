# Polymarket Copy Trading Bot

## Introduction
This project is a Polymarket Copy Trading Bot that allows users to automatically copy trades from a selected trader on Polymarket.

## Features
- **Automated Trading**: Automatically copy trades from a selected trader.
- **Real-time Monitoring**: Continuously monitor the selected trader's activity.
- **Customizable Settings**: Configure trading parameters and risk management.

## Installation
1. Install latest version of Node.js and npm
2. Navigate to the project directory:
    ```bash
    cd polymarket_copy_trading_bot
    ```
3. Create `.env` file:
    ```bash
    touch .env
    ```
4. Configure env variables:
    ```typescript
    USER_ADDRESS = 'Selected account wallet address to copy'

    PROXY_WALLET = 'Your Polymarket account address'
    PRIVATE_KEY = 'My wallet private key'

    CLOB_HTTP_URL = 'https://clob.polymarket.com/'
    CLOB_WS_URL = 'wss://ws-subscriptions-clob.polymarket.com/ws'

    FETCH_INTERVAL = 1      // default is 1 second
    TOO_OLD_TIMESTAMP = 1   // default is 1 hour
    RETRY_LIMIT = 3         // default is 3 times

    MONGO_URI = 'mongodb+srv://polymarket_copytrading_bot:V5ufvi9ra1dsOA9M@cluster0.j1flc.mongodb.net/polymarket_copytrading'

    RPC_URL = 'https://polygon-mainnet.infura.io/v3/90ee27dc8b934739ba9a55a075229744'

    USDC_CONTRACT_ADDRESS = '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174'
    ```
3. Install the required dependencies:
    ```bash
    npm install
    ```
5. Build the project:
    ```bash
    npm run build
    ```
6. Run BOT:
    ```bash
    npm run start
    ```

## Contributing
Contributions are welcome! Please open an issue or submit a pull request. And if you are interested in this project, please consider giving it a star✨.

## Contact
For updated version or any questions, please contact me at [Telegram](https://t.me/trust4120).
