# Secure Systems & Secure Software Development Final Projects

This repository contains two combined final projects for:

- **COMP4208 - Computer Systems Security**
- **COMP3006 - Secure Software Development**

Both projects are modularly integrated under a single Dockerized microservice architecture.

---

## 🎯 Project Purpose

The primary goal of this project is to design and implement a secure, modular microservice architecture that ensures:

- **Confidentiality:** Uploaded files are encrypted using AES-256 encryption before storage.
- **Integrity:** Each uploaded file's hash is calculated using SHA-256 and recorded on a blockchain-like ledger.
- **Authentication & Authorization:** User authentication with JWT tokens and role-based access control.
- **Auditability:** All user activities are logged to ensure traceability and security monitoring.
- **Scalability:** The system is fully Dockerized, ensuring easy deployment, scalability, and maintenance.

The project focuses on protecting files from unauthorized access, ensuring that uploaded files cannot be altered without detection by maintaining a blockchain-like data structure that links all blocks (file records) together through cryptographic hashes.

---

## 📦 Project Structure

```
/final-projects/
│
├── backend/
│   ├── IdentityService/              # User authentication and role management
│   ├── FileStorageService/           # File upload, AES-256 encryption, MinIO storage
│   ├── AuditLogService/               # Monitoring and logging user activities
│   ├── LinkService/                   # Time-limited file access links
│   ├── HashingBlockchainService/      # File hashing (SHA-256) and blockchain recording
│   ├── SecurityGateway/               # API traffic control (JWT verification and rate limiting)
│
├── frontend/
│   ├── FrontendPortal/                # React.js web portal for users
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Technologies Used

| Component | Technology Stack |
|:----------|:------------------|
| Backend Services | .NET Core (C#) Web API |
| Blockchain Service | Node.js (Express.js) + MongoDB |
| API Gateway | Express Gateway or Nginx |
| Frontend | React.js + Tailwind CSS |
| Storage | MinIO (S3-compatible object storage) |
| Database | PostgreSQL (for IdentityService, FileStorageService, AuditLogService, LinkService), MongoDB (for HashingBlockchainService) |

---

## 📚 Service Breakdown

| Service | Purpose | Technology | Related Course |
|:--------|:--------|:------------|:---------------|
| IdentityService | User registration, login, JWT authentication, role management | .NET Core | COMP4208 |
| FileStorageService | AES-256 encryption, file upload, MinIO storage | .NET Core | COMP4208 |
| AuditLogService | Activity and access logging | .NET Core | COMP4208 |
| LinkService | Time-limited secure access link generation | .NET Core | COMP4208 |
| HashingBlockchainService | File hashing (SHA-256) and blockchain ledgering | Node.js (Express) + MongoDB | COMP3006 |
| SecurityGateway | Protecting APIs: JWT validation, rate limiting | Node.js (Express Gateway) | COMP3006 |
| FrontendPortal | User interface for all operations | React.js | COMP4208 + COMP3006 |

---

## 🔒 Blockchain Mechanism Explanation

Instead of connecting to a live blockchain network, a **mock blockchain** is implemented inside the `HashingBlockchainService`, but it follows the real blockchain principles:

Each file's SHA-256 hash is saved along with:
- Its own index.
- The previous block's hash.
- A timestamp.

Example MongoDB document structure:

```json
{
  "index": 1,
  "fileHash": "abc123...",
  "previousHash": "0",
  "timestamp": "2025-04-27T10:00:00Z"
}
```

Each block is cryptographically linked to the previous one, ensuring that if any record changes, the entire chain becomes invalid — just like a real blockchain.

✅ No external blockchain dependency.  
✅ Fully Dockerized and database-driven.

---

## 📊 Database Usage

| Service | Database | Purpose |
|:--------|:---------|:--------|
| IdentityService | PostgreSQL | Storing user accounts, roles, and authentication data |
| FileStorageService | PostgreSQL | Storing encrypted file metadata (file name, owner, etc.) |
| AuditLogService | PostgreSQL | Storing user activity logs and security events |
| LinkService | PostgreSQL | Storing generated time-limited access link information |
| HashingBlockchainService | MongoDB | Storing file hashes and blockchain linkage |
| SecurityGateway | None | No persistent data needed |
| FrontendPortal | None | No persistent data needed |

---

## ⚙️ How to Run

1. Clone the repository.
2. Make sure Docker and Docker Compose are installed.
3. Build and start all services:
   ```bash
   docker-compose up --build
   ```
4. Access the frontend via [http://localhost:3000](http://localhost:3000).

---

## 🛡️ Security Features

- JWT Authentication for secure API communication
- AES-256 symmetric encryption for file confidentiality
- Secure file upload and storage with access control
- Blockchain-based file integrity verification
- Centralized API security via API Gateway
- Audit logs for access monitoring and forensic analysis

---

## 🌟 Academic Mapping

| Feature | Related Course Topics |
|:--------|:-----------------------|
| Authentication and Authorization (JWT) | COMP4208 - Week 2 |
| File Encryption (AES-256) | COMP4208 - Week 10 |
| Secure Data Processing (Hashing) | COMP3006 - Week 5 |
| Blockchain-based Integrity | COMP3006 - Week 13 |
| API Security (Rate Limiting, JWT Verification) | COMP3006 - Week 6-7 |
| Audit Logging and Monitoring | COMP4208 - Week 5 |

---

## 📢 Final Notes

- This project is designed for educational purposes.
- The system is modular and can easily be expanded into a full production-level microservice architecture.
- The Blockchain service can be upgraded to Hyperledger Fabric or a real blockchain network in the future.
- All security best practices from the course contents are applied.

---

# 🚀 Let's Secure Systems Properly!

