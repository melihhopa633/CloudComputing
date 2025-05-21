# Blockchain Service Architecture

## Overview
The Blockchain Service is a Node.js-based microservice that provides immutable storage of container resource metrics using blockchain technology. It implements a smart contract-based solution for recording and querying metrics in a tamper-proof manner.

## Core Components

### 1. Smart Contract (MetricContract.sol)
- Written in Solidity
- Stores container metrics (memory, CPU usage, timestamps)
- Provides functions for:
  - Adding new metrics
  - Querying metrics by container ID
  - Getting total metric count
  - Retrieving all metrics

### 2. API Layer (api.js)
- Express.js REST API
- Endpoints:
  - POST /api/metrics: Record new metrics
  - GET /api/metrics: List all metrics
  - GET /api/metrics/:containerId: Filter by container
  - GET /api/metrics/count: Get total count
  - GET /health: Health check

### 3. Blockchain Integration (database.js)
- Uses ethers.js for blockchain interaction
- Handles:
  - Smart contract deployment
  - Transaction management
  - Event listening
  - Data querying

### 4. Deployment Script (deploy.js)
- Manages smart contract deployment
- Handles contract address storage
- Configures initial contract state

## Data Flow

1. **Metric Recording**
   ```
   ResourceManager → API → Smart Contract → Blockchain
   ```

2. **Metric Querying**
   ```
   Client → API → Smart Contract → Blockchain → Client
   ```

## Technical Details

### Smart Contract Structure
```solidity
struct Metric {
    string containerId;
    uint256 memoryMB;
    uint256 cpuUsage;
    uint256 timestamp;
}
```

### Key Features
- Immutable metric storage
- Time-series data support
- Container-specific queries
- Event-based updates

### Security Considerations
- Transaction signing
- Gas optimization
- Error handling
- Input validation

## Integration Points

### 1. Resource Manager Service
- Receives metrics via REST API
- Asynchronous processing
- Error handling and retries

### 2. Frontend
- Provides metric visualization
- Real-time updates
- Historical data access

### 3. Monitoring
- Health check endpoints
- Performance metrics
- Error tracking

## Development Guidelines

### Local Development
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   - RPC_URL
   - MNEMONIC
   - CONTRACT_ADDRESS

3. Deploy contract:
   ```bash
   node deploy.js
   ```

### Testing
- Unit tests for API endpoints
- Smart contract testing
- Integration tests
- Performance testing

### Deployment
- Docker containerization
- Environment configuration
- Health monitoring
- Backup procedures

## Performance Considerations

### Optimization
- Batch processing
- Caching strategies
- Gas optimization
- Query optimization

### Scaling
- Load balancing
- Connection pooling
- Resource management
- Error handling

## Monitoring and Maintenance

### Health Checks
- API availability
- Blockchain connection
- Contract interaction
- Resource usage

### Logging
- Transaction logs
- Error tracking
- Performance metrics
- Audit trails

## Future Improvements

### Planned Features
- Batch metric recording
- Advanced querying
- Metric aggregation
- Performance optimization

### Technical Debt
- Code refactoring
- Documentation updates
- Test coverage
- Security audits 