# BlockchainService

This microservice records and queries container resource metrics on an Ethereum-compatible blockchain (e.g., Ganache). It exposes a REST API and interacts with a Solidity smart contract.

## Features
- Deploys and interacts with a Metric smart contract
- REST API for recording and querying metrics
- Uses ethers.js, Express.js, and Node.js

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Set up your `.env` file (see below for required variables).
3. Compile and deploy the smart contract (see `deploy.js`).
   - After deployment, set the `CONTRACT_ADDRESS` in your `.env` file.
4. Start the service:
   ```bash
   npm start
   ```

### Required Environment Variables
- `RPC_URL` - Ethereum node URL (e.g. `http://blockchain-node:8545`)
- `MNEMONIC` - Wallet mnemonic for deployment/interactions
- `CONTRACT_ADDRESS` - Deployed MetricContract address

## API Endpoints
- `POST /api/metrics`: Record a new metric
  - Body: `{ "containerId": string, "memoryMB": number, "cpuUsage": number, "timestamp": number }`
- `GET /api/metrics`: List all metrics
- `GET /api/metrics/:containerId`: Filter metrics by container
- `GET /api/metrics/count`: Get metric count
- `GET /health`: Health check

## Usage Flow
1. ResourceManagerService sends metrics to `POST /api/metrics`.
2. BlockchainService writes metrics to the blockchain smart contract.
3. Metrics can be queried via the GET endpoints.

## Docker
This service is designed to run in Docker and connect to a Ganache node as described in the main project documentation. 