# 📦 ResourceManagerService Documentation

## 📌 Purpose

The `ResourceManagerService` is responsible for handling user-initiated service requests, dynamically managing Docker containers, and logging usage metrics. It plays a central role in the cloud resource orchestration system.

---

## 🎯 Core Responsibilities

* Receive and validate authenticated service requests
* Start and stop Docker containers on demand
* Track usage details (start time, stop time, duration)
* Store task metadata in PostgreSQL
* Log all activities via Seq
* Forward usage logs to BlockchainService for immutable storage

---

## 🛠️ Technologies Used

* **Backend Language:** .NET Core 8.0 (C#) or Node.js (Express)
* **Container Management:** Docker SDK
* **Database:** PostgreSQL
* **Logging:** Serilog (for .NET) to Seq
* **Communication:** REST API (secured with JWT)

---

## 📁 Key Endpoints

### `POST /api/tasks`

* **Description:** Launch a new container based on requested service
* **Input:** `{ userId, serviceType }`
* **Output:** `{ taskId, containerPort, iframeUrl }`

### `DELETE /api/tasks/{id}`

* **Description:** Stop and remove an existing container
* **Input:** Task ID (from URL)
* **Output:** `{ success: true, duration }`

### `GET /api/tasks`

* **Description:** List running or historical tasks for a user (admin or self)
* **Output:** Task array with metadata

### `GET /api/tasks/{id}`

* **Description:** Fetch single task detail
* **Output:** Task object

---

## 🗂️ Data Model (PostgreSQL)

### `Tasks`

| Column      | Type      | Description                     |
| ----------- | --------- | ------------------------------- |
| Id          | UUID      | Unique identifier               |
| UserId      | UUID      | Owner of the task               |
| ServiceType | VARCHAR   | Type of service (e.g., jupyter) |
| ContainerId | VARCHAR   | Docker container ID             |
| Port        | INT       | Exposed port                    |
| StartTime   | TIMESTAMP | Start of usage                  |
| StopTime    | TIMESTAMP | End of usage                    |
| Duration    | INTERVAL  | Usage duration                  |
| Status      | VARCHAR   | (Running, Stopped, Error)       |

---

## 🔐 Security

* All endpoints require valid JWT access token
* Authorization policies to restrict admin-level operations

---

## 🔄 Inter-Service Communication

* **To BlockchainService:** Sends POST logs with usage hash and metadata
* **To IdentityService:** Optionally fetches user info if needed
* **To Docker Engine:** Starts/stops containers via Docker SDK or CLI

---

## 📋 Example Use Flow

1. User logs in via `IdentityService`
2. React frontend sends `POST /api/tasks` to start Jupyter
3. ResourceManager creates a container, assigns a port, logs start time
4. When user finishes, `DELETE /api/tasks/{id}` is called
5. ResourceManager stops the container, logs usage, sends to blockchain

---

## 🧪 Future Improvements

* Auto-timeout idle containers
* WebSocket integration for live task updates
* Dashboard for usage analytics

---

**Owner:** Backend Team
**Version:** 1.0
**Status:** In Development 🚧
