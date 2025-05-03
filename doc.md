# ☁️ Blockchain-Based Cloud Resource Management System

This project implements a modular cloud resource management platform that allows users to request and use isolated development environments (e.g., Jupyter, IDE, file manager) in Docker containers. It provides secure access control, detailed usage tracking, and immutable logging through a custom blockchain service.

---

## 🎯 Project Purpose

- Provide on-demand development environments for authenticated users
- Automatically manage Docker containers per user request
- Track and log usage data (who used what, when, how long)
- Ensure transparency and immutability through blockchain-based logging
- Visualize system metrics using modern dashboards (Grafana)

---

## 🧱 System Architecture

```plaintext
[FrontendApp] ──▶ [IdentityService] ──▶ [ResourceManagerService] ──▶ [Docker Containers]
      │                    │                         │
      ▼                    ▼                         ▼
 [Seq Logs]          [JWT/Auth]              [BlockchainService]
      │                                            │
      └────────────▶ [Grafana + Prometheus + cAdvisor]
