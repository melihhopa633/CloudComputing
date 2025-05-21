# Cloud Computing Project Architecture

## System Overview
This project implements a cloud computing platform with microservices architecture, consisting of three main backend services and a frontend application. The system is containerized using Docker and orchestrated with Docker Compose.

## Architecture Components

### 1. Frontend Service
- React-based web application
- Communicates with backend services through REST APIs
- Provides user interface for resource management and monitoring
- Uses Tailwind CSS for styling

### 2. Backend Services

#### 2.1 Identity Service (.NET Core)
- Handles user authentication and authorization
- Manages user accounts and permissions
- Provides JWT-based authentication
- Implements role-based access control

#### 2.2 Resource Manager Service (.NET Core)
- Manages cloud resources and containers
- Handles resource allocation and deallocation
- Monitors resource usage
- Communicates with Blockchain Service for metric recording

#### 2.3 Blockchain Service (Node.js)
- Records resource metrics on blockchain
- Implements smart contracts for immutable metric storage
- Provides REST API for metric operations
- Uses Ethereum-compatible blockchain (Ganache)

### 3. Infrastructure Components

#### 3.1 Nginx
- Acts as reverse proxy
- Handles routing between services
- Manages SSL termination
- Load balancing

#### 3.2 Prometheus
- System monitoring and metrics collection
- Stores time-series data
- Provides metrics for system health monitoring

## Service Communication

1. **Authentication Flow**
   - Frontend → Identity Service: User authentication
   - Identity Service → Other Services: JWT token validation

2. **Resource Management Flow**
   - Frontend → Resource Manager: Resource operations
   - Resource Manager → Blockchain Service: Metric recording
   - Resource Manager → Prometheus: System metrics

3. **Monitoring Flow**
   - Prometheus → All Services: Metrics collection
   - Frontend → Prometheus: Metrics visualization

## Security Architecture

1. **Authentication**
   - JWT-based authentication
   - Secure password hashing
   - Token-based session management

2. **Authorization**
   - Role-based access control
   - Service-to-service authentication
   - API endpoint protection

3. **Data Security**
   - Encrypted communication (HTTPS)
   - Secure credential storage
   - Blockchain-based immutable records

## Deployment Architecture

1. **Containerization**
   - Each service runs in its own Docker container
   - Docker Compose for orchestration
   - Environment-specific configurations

2. **Networking**
   - Internal Docker network for service communication
   - Nginx for external access
   - Isolated service environments

3. **Monitoring**
   - Prometheus for metrics collection
   - Health check endpoints
   - System-wide monitoring

## Development Workflow

1. **Local Development**
   - Docker Compose for local environment
   - Hot-reloading for frontend and backend
   - Local blockchain node (Ganache)

2. **Testing**
   - Unit tests for each service
   - Integration tests for service communication
   - End-to-end testing

3. **Deployment**
   - Docker-based deployment
   - Environment-specific configurations
   - CI/CD pipeline support 