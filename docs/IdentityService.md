# IdentityService - Technical Specification

This document defines the design and structure of the **IdentityService** for the Secure Systems & Secure Software Development Final Project.

---

## 👉 Purpose

IdentityService is responsible for:
- User Registration
- User Login (JWT Token generation)
- Role and Permission Management
- Multi-Factor Authentication (optional for future improvements)

Designed with a focus on security, scalability, and clean architecture principles.

---

## 📆 Technology Stack

| Component | Choice |
|:----------|:--------|
| Framework | .NET Core 8 Web API |
| Routing | Carter (Minimal API + Clean Endpoints) |
| Architecture | CQRS (Command Query Responsibility Segregation) |
| Authentication | JWT Bearer Tokens |
| Database | PostgreSQL |
| ORM | Entity Framework Core (EF Core) |
| Validation | FluentValidation |

---

## 🔧 Project Structure

```
/IdentityService
│
├── Program.cs
├── appsettings.json
├── /Features
│   ├── /Register
│   │   ├── RegisterCommand.cs
│   │   ├── RegisterCommandHandler.cs
│   │   ├── RegisterValidator.cs
│   ├── /Login
│   │   ├── LoginCommand.cs
│   │   ├── LoginCommandHandler.cs
│   │   ├── LoginValidator.cs
│   ├── /Roles
│   │   ├── CreateRoleCommand.cs
│   │   ├── AssignRoleCommand.cs
│
├── /Entities
│   ├── User.cs
│   ├── Role.cs
│   ├── UserRole.cs
│
├── /Persistence
│   ├── AppDbContext.cs
│   ├── Migrations/
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

Using **Carter** for clean endpoint definition with **CQRS** pattern.

| HTTP Method | Endpoint | Purpose |
|:------------|:---------|:--------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | User login and receive JWT Token |
| POST | `/api/roles/create` | Create a new role |
| POST | `/api/roles/assign` | Assign a role to a user |

---

## 🔒 Security

- Passwords are hashed with a strong hashing algorithm (e.g., BCrypt or PBKDF2).
- JWT tokens are signed using a secure private key.
- Role-based Authorization will be applied.
- Rate limiting can optionally be enforced via SecurityGateway.

---

## 📚 Database Schema (PostgreSQL)

### Tables

- **Users**
  - Id (PK)
  - Username
  - Email
  - PasswordHash
  - CreatedAt

- **Roles**
  - Id (PK)
  - RoleName

- **UserRoles**
  - Id (PK)
  - UserId (FK)
  - RoleId (FK)

---

## 🔄 CQRS Flow Example (User Registration)

1. User submits a POST request to `/api/auth/register`.
2. Carter maps the request to `RegisterCommand`.
3. `RegisterCommandHandler` validates and processes registration.
4. `AppDbContext` saves new user into PostgreSQL.
5. `ApiResponse` object returns success message.

---

## 📈 Key Benefits

- **Clean structure** using CQRS: easy maintenance and testability.
- **Minimal API style** with Carter: fewer controllers, simpler routes.
- **High Security**: JWT, hashed passwords, role-based authorization.
- **Docker-ready**: Integrated with docker-compose.yml for containerized deployment.

---

# 🚀 IdentityService Ready to Secure Authentication!

