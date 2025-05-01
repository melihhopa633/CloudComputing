# Authentication API Documentation

## Endpoints

### 1. Login
Authenticates a user and returns access and refresh tokens.

**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
    "username": "johndoe",
    "password": "your-password"
}
```

**Success Response (200 OK):**
```json
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "johndoe",
    "email": "john@example.com",
    "roles": ["user", "admin"]
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid username or password
- `400 Bad Request`: Invalid request body

### 2. Refresh Token
Refreshes an expired access token using a valid refresh token.

**Endpoint:** `POST /api/auth/refresh-token`

**Request Body:**
```json
{
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200 OK):**
```json
{
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "username": "johndoe",
    "email": "john@example.com",
    "roles": ["user", "admin"]
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid refresh token or expired refresh token
- `400 Bad Request`: Invalid request body

## Authentication Flow
1. Call the login endpoint with username and password
2. Store the received tokens
3. Use the access token in the Authorization header for subsequent requests:
   ```
   Authorization: Bearer <access-token>
   ```
4. When the access token expires, use the refresh token to get a new access token
5. If the refresh token is also expired, user needs to login again

## Token Expiration
- Access Token: 1 hour
- Refresh Token: 7 days
