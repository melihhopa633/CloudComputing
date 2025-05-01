# User Role API Documentation

## Endpoints

### 1. Assign Role to User
Assigns a role to a user.

**Endpoint:** `POST /api/userroles`

**Request Body:**
```json
{
    "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "roleId": "5da85f64-5717-4562-b3fc-2c963f66afa7"
}
```

**Success Response (201 Created):**
```json
{
    "success": true,
    "message": "UserRole created",
    "data": "7fa85f64-5717-4562-b3fc-2c963f66afa8"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `404 Not Found`: User or Role not found
- `409 Conflict`: User already has this role

### 2. Get All User Roles
Retrieves all user-role assignments.

**Endpoint:** `GET /api/userroles`

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "UserRoles fetched",
    "data": [
        {
            "id": "7fa85f64-5717-4562-b3fc-2c963f66afa8",
            "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "roleId": "5da85f64-5717-4562-b3fc-2c963f66afa7",
            "username": "johndoe",
            "roleName": "admin"
        }
    ]
}
```

### 3. Get User Role by ID
Retrieves a specific user-role assignment.

**Endpoint:** `GET /api/userroles/{id}`

**Parameters:**
- `id`: GUID of the user-role assignment (in URL)

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "UserRole fetched",
    "data": {
        "id": "7fa85f64-5717-4562-b3fc-2c963f66afa8",
        "userId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "roleId": "5da85f64-5717-4562-b3fc-2c963f66afa7",
        "username": "johndoe",
        "roleName": "admin"
    }
}
```

**Error Response:**
- `404 Not Found`: UserRole not found



### 5. Delete User Role
Removes a role from a user.

**Endpoint:** `DELETE /api/userroles/{id}`

**Parameters:**
- `id`: GUID of the user-role assignment (in URL)

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "UserRole deleted"
}
```

**Error Response:**
- `404 Not Found`: UserRole not found

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
- UserId: Required, must be a valid GUID
- RoleId: Required, must be a valid GUID
