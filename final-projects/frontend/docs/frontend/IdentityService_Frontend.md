
# IdentityService Frontend Integration Guide (React.js)

## 📆 Project Context
This document describes how the **FrontendPortal** (React.js) interacts with the **IdentityService** for user registration, login, and role management in the Secure Systems & Secure Software Development Final Project.

---

## 🔄 Authentication Flow

### 1. User Registration (Signup)
- **Page:** `Register.jsx`
- **Endpoint:** `POST /api/auth/register`
- **Request Body Example:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "Password123!"
}
```
- **Frontend Action:**
  - Collect username, email, password.
  - Submit form via Axios POST.
  - On success, redirect to login page.
  - On error, display validation or server error message.

### 2. User Login (Signin)
- **Page:** `Login.jsx`
- **Endpoint:** `POST /api/auth/login`
- **Request Body Example:**
```json
{
  "email": "newuser@example.com",
  "password": "Password123!"
}
```
- **Frontend Action:**
  - Collect email and password.
  - Submit form via Axios POST.
  - On success, store the received JWT Token in **localStorage**.
  - Redirect to protected dashboard or homepage.
  - On error, show "invalid credentials" message.

### 3. Role Management (Optional - Admin Only)
- **Page/Component:** Admin Panel
- **Endpoints:**
  - Create Role: `POST /api/roles/create`
  - Assign Role: `POST /api/roles/assign`

> Only accessible if logged-in user has **admin** or authorized roles.

---

## 🔑 Token Management
- JWT Token received from `/api/auth/login` must be:
  - Stored in `localStorage`.
  - Automatically attached in Authorization headers:
    ```
    Authorization: Bearer <token>
    ```
- **Axios Instance:**
  - Create a custom `axiosInstance.js` file to automatically attach the token for secured API calls.

---

## 🔎 Error Handling
- **Validation Errors:**
  - Example: Missing email, invalid password format.
  - Capture and show in the form with friendly messages.

- **Unauthorized (401) or Forbidden (403):**
  - Redirect user to login page or show "Unauthorized" screen.

- **Server Errors (500):**
  - Display a generic error message: "An unexpected error occurred. Please try again later."

---

## ✨ Frontend Project File Structure (Important for IdentityService)
```
/src
  /pages
    - Login.jsx
    - Register.jsx
  /services
    - authService.js (Axios logic for /api/auth/* calls)
  /utils
    - axiosInstance.js (with Authorization header injection)
```

---

## 💡 Security Tips
- Always validate forms on the frontend before sending requests.
- Implement auto-logout on token expiration (optionally decode JWT and track expiry).
- Prefer secure context (HTTPS) for production deployments.

---

# 🚀 Ready to Build Secure Frontends!
