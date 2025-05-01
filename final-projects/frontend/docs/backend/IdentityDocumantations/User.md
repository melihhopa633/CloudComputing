# User API Documentation

## Endpoints

### 1. Create User
Creates a new user in the system.

**Endpoint:** `POST /api/users`

**Request Body:**
```json
{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "secure123"
}
```

**Success Response (201 Created):**
```json
{
    "success": true,
    "message": "User created",
    "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body or validation errors
- `409 Conflict`: Email already registered

### 2. Get All Users
Retrieves all users from the system.

**Endpoint:** `GET /api/users`

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Users fetched",
    "data": [
        {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "username": "johndoe",
            "email": "john@example.com",
            "createdAt": "2025-05-01T12:00:00Z"
        }
    ]
}
```

### 3. Get User by ID
Retrieves a specific user by their ID.

**Endpoint:** `GET /api/users/{id}`

**Parameters:**
- `id`: GUID of the user (in URL)

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "User fetched",
    "data": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "username": "johndoe",
        "email": "john@example.com",
        "createdAt": "2025-05-01T12:00:00Z"
    }
}
```

**Error Response:**
- `404 Not Found`: User not found

### 4. Update User
Updates an existing user's information.

**Endpoint:** `PUT /api/users/{id}`

**Parameters:**
- `id`: GUID of the user (in URL)

**Request Body:**
```json
{
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "username": "johndoe2",
    "email": "john2@example.com"
}
```

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "User updated"
}
```

**Error Responses:**
- `400 Bad Request`: ID mismatch between URL and request body
- `404 Not Found`: User not found

### 5. Delete User
Deletes a user from the system.

**Endpoint:** `DELETE /api/users/{id}`

**Parameters:**
- `id`: GUID of the user (in URL)

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "User deleted"
}
```

**Error Response:**
- `404 Not Found`: User not found

## Common Response Format
All endpoints return responses in the following format:
```json
{
    "success": boolean,
    "message": "string",
    "data": any // optional, present only in GET and POST responses
}
```

## Validation Rules
- Username: Required, 3-20 characters
- Email: Required, valid email format
- Password: Required, minimum 6 characters (for create only)
