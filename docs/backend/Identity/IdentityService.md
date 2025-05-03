# IdentityService - Detailed Technical Specification

## 👉 Purpose

IdentityService is designed to securely manage:
- User Registration
- User Login (JWT Token generation)
- Role and Permission Management
- Future Multi-Factor Authentication (MFA) integration

IdentityService supports the overall project goals of **authentication**, **authorization**, and **secure access control** under the Secure Systems & Secure Software Development Final Projects.

---

## 📆 Technology Stack

| Component | Technology |
|:----------|:-----------|
| Framework | .NET Core 8 Web API |
| API Design | Carter (Minimal API + Clean Endpoints) |
| Architecture | CQRS (Command Query Responsibility Segregation) |
| Authentication | JWT Bearer Tokens |
| Database | PostgreSQL |
| ORM | Entity Framework Core (EF Core) |
| Validation | FluentValidation |
| Password Hashing | BCrypt |
| Docker | Fully containerized |

---

## 🔧 Project Folder Structure

```
/IdentityService
│
├── Program.cs
├── appsettings.json
├── /Features
│   ├── /Authentication
│   │   ├── RegisterCommand.cs
│   │   ├── RegisterCommandHandler.cs
│   │   ├── RegisterValidator.cs
│   │   ├── LoginCommand.cs
│   │   ├── LoginCommandHandler.cs
│   │   ├── LoginValidator.cs
│
├── /Roles
│   ├── CreateRoleCommand.cs
│   ├── AssignRoleCommand.cs
│
├── /Entities
│   ├── User.cs
│   ├── Role.cs
│   ├── UserRole.cs
│
├── /Persistence
│   ├── AppDbContext.cs
│   ├── PostgreSQL Migrations
│
├── /Security
│   ├── JwtService.cs
│
├── /Common
│   ├── ApiResponse.cs
│   ├── ExceptionsMiddleware.cs
```

---

## 🔍 API Endpoints

| HTTP Method | Endpoint | Purpose |
|:------------|:---------|:--------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login and receive JWT Token |
| POST | `/api/roles/create` | Create a new role |
| POST | `/api/roles/assign` | Assign an existing role to a user |

All endpoints will be implemented through **Carter modules** following CQRS.

---

## 🔒 Authentication and Security

- Passwords will be stored using **BCrypt** hashing.
- JWTs will include claims for UserId, Username, and Roles.
- Tokens will be signed with a strong asymmetric key pair (private/public keys).
- Sensitive endpoints will require authorization with appropriate role checks.
- Standard middleware for exception handling and logging will be included.

---

## 📈 Database Schema (PostgreSQL)

### Users Table
| Column | Type | Description |
|:-------|:-----|:-------------|
| Id | UUID | Primary Key |
| Username | VARCHAR(255) | Unique username |
| Email | VARCHAR(255) | Unique email address |
| PasswordHash | TEXT | Encrypted password hash |
| CreatedAt | TIMESTAMP | Registration timestamp |

### Roles Table
| Column | Type | Description |
|:-------|:-----|:-------------|
| Id | UUID | Primary Key |
| RoleName | VARCHAR(100) | Unique role name |

### UserRoles Table
| Column | Type | Description |
|:-------|:-----|:-------------|
| Id | UUID | Primary Key |
| UserId | UUID | Foreign Key (Users) |
| RoleId | UUID | Foreign Key (Roles) |

---

## 🔄 CQRS Flow Examples

### User Registration Flow
1. User sends POST `/api/auth/register` with username, email, and password.
2. Request is mapped to `RegisterCommand`.
3. `RegisterCommandHandler` validates and processes the registration.
4. Password is hashed.
5. User record is saved into PostgreSQL.
6. `ApiResponse` returns success status.

### User Login Flow
1. User sends POST `/api/auth/login` with credentials.
2. `LoginCommandHandler` verifies the password.
3. JWT Token is generated with roles.
4. Token is returned to the user.

---

## 📅 Deployment Details

- Docker container configured to expose IdentityService on internal port 5001.
- Connected to a PostgreSQL container managed by docker-compose.
- JWT Secret Key loaded from environment variables.

---

## 🚀 Key Advantages

- Clean, Minimal API development via Carter
- Separation of concerns and scalability using CQRS
- Industry-standard authentication via JWT
- Highly secure user password management
- Full dockerization for portability and deployment
- PostgreSQL relational database for stable, relational data storage

---

# 🚀 IdentityService - Secure Authentication Built the Right Way!