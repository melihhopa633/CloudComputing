# Cloud Computing Project Documentation

## Project Structure

### Backend Services

The project consists of two main microservices:

1. **Identity Service** (`/backend/IdentityService/`)

   - Authentication and Authorization service
   - Features:
     - User Management
     - Role Management
     - User-Role Management
     - Authentication (Login, Refresh Token)

2. **Resource Manager Service** (`/backend/ResourceManagerService/`)
   - Resource and Task Management service
   - Features:
     - Task Management
     - User-specific Task Management

### Frontend (`/frontend/`)

- React-based web application
- Components:
  - Layout components
  - Role management
  - User management
  - User-Role management
  - Task management

### Infrastructure

#### Docker Services Configuration

The application uses Docker Compose for containerization and orchestration. Here's the breakdown of services:

1. **Backend Services**

   - `identityservice` (Port: 5001)

     - .NET Core application
     - PostgreSQL database
     - JWT authentication
     - Healthcheck enabled

   - `resourcemanagerservice` (Port: 5002)
     - .NET Core application
     - PostgreSQL database
     - Docker socket access for container management
     - Healthcheck enabled

2. **Databases**

   - `postgres_identity` (Port: 5432)

     - PostgreSQL 16
     - Stores identity and authentication data
     - Persistent volume: pgdata

   - `postgres_resource` (Port: 5433)
     - PostgreSQL 16
     - Stores resource management data
     - Persistent volume: pgdata_resource

3. **Monitoring & Logging**

   - `seq`

     - Centralized logging service
     - Web interface for log aggregation
     - Persistent volume: seqdata

   - `docker_stats_exporter` (Port: 9487)

     - Exports Docker container metrics
     - Used for monitoring container performance

   - `prometheus` (Port: 9090)
     - Metrics collection and monitoring
     - Integrates with docker_stats_exporter

4. **Reverse Proxy**
   - `nginx` (Port: 9098)
     - Load balancer and reverse proxy
     - Handles routing and SSL termination

#### Networking

- All services are connected through `app-network` bridge network
- Internal service discovery enabled

#### Volumes

- `pgdata`: Identity database persistence
- `pgdata_resource`: Resource database persistence
- `seqdata`: Logging data persistence

## Environment Variables

### Identity Service

- `ASPNETCORE_ENVIRONMENT`: Development
- `ConnectionStrings__DefaultConnection`: PostgreSQL connection string
- `Jwt__Key`: JWT signing key
- `Jwt__Issuer`: Token issuer
- `Jwt__Audience`: Token audience
- `Jwt__ExpireHours`: Token expiration
- `Serilog__SeqServerUrl`: Logging service URL

### Resource Manager Service

- `ASPNETCORE_ENVIRONMENT`: Development
- `ConnectionStrings__DefaultConnection`: PostgreSQL connection string
- `Serilog__SeqServerUrl`: Logging service URL

## Health Monitoring

- Both backend services implement health checks
- PostgreSQL databases have built-in health checks
- Prometheus monitors container metrics
- Seq provides centralized logging

## Security Considerations

- JWT-based authentication
- Secure database credentials
- NGINX reverse proxy
- Container isolation
- Persistent volumes for data security

## Development Setup

1. Ensure Docker and Docker Compose are installed
2. Clone the repository
3. Navigate to the final-projects directory
4. Run `docker-compose up -d`
5. Access services:
   - Identity Service: http://localhost:5001
   - Resource Manager: http://localhost:5002
   - Seq Dashboard: http://localhost:9098
   - Prometheus: http://localhost:9090
