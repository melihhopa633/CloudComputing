# BillingService - CloudChain Platform

## Overview

BillingService is a Python FastAPI-based microservice that generates invoices and manages billing for the CloudChain Platform. It calculates costs based on container resource usage metrics stored in the blockchain database.

## Features

- 📊 **Resource Usage Calculation**: Calculate CPU and memory usage costs
- 🧾 **Invoice Generation**: Generate professional PDF invoices
- 💾 **Database Integration**: Connect to blockchain metrics database
- 🔄 **Monthly Billing**: Automated monthly invoice generation
- 📈 **Usage Summary**: Detailed resource usage analytics
- 🎨 **PDF Styling**: Beautiful invoice layouts with ReportLab

## API Endpoints

### Billing Endpoints (`/api/billing`)

| Method | Endpoint                        | Description                    |
| ------ | ------------------------------- | ------------------------------ |
| GET    | `/users`                        | List all users with metrics    |
| POST   | `/calculate`                    | Calculate billing for a period |
| POST   | `/generate-invoice`             | Generate and save invoice PDF  |
| GET    | `/monthly-invoice/{user_email}` | Generate monthly invoice       |
| GET    | `/download/{filename}`          | Download PDF invoice           |
| GET    | `/usage-summary/{user_email}`   | Get usage summary              |
| GET    | `/health`                       | Health check                   |

### Main Endpoints

| Method | Endpoint  | Description           |
| ------ | --------- | --------------------- |
| GET    | `/`       | Service information   |
| GET    | `/health` | Health check          |
| GET    | `/docs`   | OpenAPI documentation |

## Usage Examples

### 1. Calculate Billing

```bash
curl -X POST "http://localhost:5003/api/billing/calculate" \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "user@example.com",
    "start_date": "2024-01-01T00:00:00",
    "end_date": "2024-01-31T23:59:59"
  }'
```

### 2. Generate Invoice

```bash
curl -X POST "http://localhost:5003/api/billing/generate-invoice" \
  -H "Content-Type: application/json" \
  -d '{
    "user_email": "user@example.com",
    "start_date": "2024-01-01T00:00:00",
    "end_date": "2024-01-31T23:59:59"
  }'
```

### 3. Monthly Invoice

```bash
curl "http://localhost:5003/api/billing/monthly-invoice/user@example.com?year=2024&month=1"
```

### 4. Usage Summary

```bash
curl "http://localhost:5003/api/billing/usage-summary/user@example.com?days=30"
```

## Configuration

Environment variables (can be set in `.env` file):

```bash
# Database Configuration
POSTGRES_HOST=postgres_blockchain
POSTGRES_PORT=5432
POSTGRES_DB=blockchain_metrics
POSTGRES_USER=blockchain
POSTGRES_PASSWORD=blockchain

# Billing Rates
CPU_RATE_PER_HOUR=0.05
MEMORY_RATE_PER_GB_HOUR=0.01

# API Configuration
API_PORT=5003
API_HOST=0.0.0.0

# Company Information
COMPANY_NAME=CloudChain Platform
COMPANY_ADDRESS=123 Cloud Street, Tech City
COMPANY_EMAIL=billing@cloudchain.com
COMPANY_PHONE=+1 (555) 123-4567
```

## Billing Calculation

### Resource Rates

- **CPU Usage**: $0.05 per CPU hour
- **Memory Usage**: $0.01 per GB hour
- **Tax Rate**: 18% (KDV)

### Calculation Formula

```
CPU Cost = CPU Hours × CPU Rate
Memory Cost = Memory GB Hours × Memory Rate
Subtotal = CPU Cost + Memory Cost
Tax = Subtotal × 18%
Total = Subtotal + Tax
```

## Development

### Local Development

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Run the service:

   ```bash
   python -m uvicorn app.main:app --reload --port 5003
   ```

3. Access API documentation:
   ```
   http://localhost:5003/docs
   ```

### Docker Development

```bash
# Build image
docker build -t billingservice .

# Run container
docker run -p 5003:5003 billingservice
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs billingservice
```

## Architecture

```
BillingService/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application
│   ├── config.py            # Configuration settings
│   ├── api/
│   │   └── billing.py       # API endpoints
│   ├── models/
│   │   └── billing.py       # Pydantic models
│   └── services/
│       ├── database.py      # Database operations
│       ├── billing_calculator.py  # Billing logic
│       └── pdf_generator.py       # PDF generation
├── generated_invoices/      # PDF storage
├── requirements.txt
├── Dockerfile
└── README.md
```

## Database Schema

### Metrics Table (Existing)

```sql
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR(255) NOT NULL,
    user_fullname VARCHAR(255),
    container_id VARCHAR(255) NOT NULL,
    container_name VARCHAR(255) NOT NULL,
    memory_mb DECIMAL(10,2) NOT NULL,
    cpu_usage DECIMAL(5,4) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tx_hash VARCHAR(66),
    block_number INTEGER
);
```

### Invoices Table (New)

```sql
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,
    invoice_id VARCHAR(50) UNIQUE NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_fullname VARCHAR(255),
    start_date TIMESTAMP WITH TIME ZONE,
    end_date TIMESTAMP WITH TIME ZONE,
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2),
    currency VARCHAR(10),
    pdf_path VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## Integration with Other Services

### BlockchainService

- Reads metrics from `postgres_blockchain` database
- Uses same database connection for invoices

### Frontend Integration

- API endpoints for billing dashboard
- PDF download functionality
- Usage analytics display

## Monitoring

### Health Checks

- `/health` endpoint for service health
- Database connectivity checks
- Automatic container health monitoring

### Logging

- Structured logging with timestamps
- Error tracking and debugging
- Request/response logging

## Error Handling

- Comprehensive exception handling
- HTTP status codes for different scenarios
- Detailed error messages for debugging
- Graceful degradation for missing data

## Security Considerations

- Input validation with Pydantic models
- SQL injection prevention
- CORS configuration
- PDF file access control

## Performance

- Connection pooling for database
- Efficient SQL queries
- PDF generation optimization
- Caching for repeated calculations

## Future Improvements

- [ ] Email invoice delivery
- [ ] Multiple currency support
- [ ] Custom billing periods
- [ ] Automated payment processing
- [ ] Advanced analytics and reporting
- [ ] API rate limiting
- [ ] Authentication/authorization
