# IdentityService Frontend

This is the React.js frontend for the IdentityService.

## Project Structure

```
/src
  /pages
    - Login.jsx
    - Register.jsx
  /services
    - authService.js
  /utils
    - axiosInstance.js
```

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   npm start
   ```

## Features
- User Registration
- User Login
- JWT Token Storage
- API Communication with IdentityService

## Notes
- Update `axiosInstance.js` with your backend API base URL if needed.
- For production, ensure HTTPS and secure token storage.