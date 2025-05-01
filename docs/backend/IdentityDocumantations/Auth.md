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
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "username": "johndoe",
        "email": "john@example.com",
        "roles": ["user", "admin"]
    }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid username or password
- `400 Bad Request`: Missing username or password

### 2. Refresh Token
Get a new access token using a valid refresh token.

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
    "success": true,
    "message": "Token refreshed",
    "data": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "username": "johndoe",
        "email": "john@example.com",
        "roles": ["user", "admin"]
    }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid refresh token
- `401 Unauthorized`: Refresh token expired
- `400 Bad Request`: Missing refresh token

## Token Usage

### Access Token
- Include in request headers for protected endpoints:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
- Valid for: 1 hour
- Used for: All protected API endpoints

### Refresh Token
- Used to obtain new access tokens
- Valid for: 7 days
- Store securely in client application
- Used when: Access token expires

## Error Response Format
```json
{
    "success": false,
    "message": "Error message description"
}
```

## Authentication Flow
1. Call login endpoint with credentials
2. Store received tokens
3. Use access token in Authorization header
4. When access token expires:
   - Use refresh token to get new access token
   - If refresh token expired, user must login again
