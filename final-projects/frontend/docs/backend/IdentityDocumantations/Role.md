# Role API Documentation

## Endpoints

### 1. Create Role
Creates a new role in the system.

**Endpoint:** `POST /api/roles`

**Request Body:**
```json
{
    "roleName": "admin"
}
```

**Success Response (201 Created):**
```json
{
    "success": true,
    "message": "Role created",
    "data": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body
- `409 Conflict`: Role already exists

### 2. Get All Roles
Retrieves all roles from the system.

**Endpoint:** `GET /api/roles`

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Roles fetched",
    "data": [
        {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "roleName": "admin"
        },
        {
            "id": "5da85f64-5717-4562-b3fc-2c963f66afa7",
            "roleName": "user"
        }
    ]
}
```

### 3. Get Role by ID
Retrieves a specific role by its ID.

**Endpoint:** `GET /api/roles/{id}`

**Parameters:**
- `id`: GUID of the role (in URL)

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Role fetched",
    "data": {
        "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "roleName": "admin"
    }
}
```

**Error Response:**
- `404 Not Found`: Role not found

### 4. Update Role
Updates an existing role.

**Endpoint:** `PUT /api/roles/{id}`

**Parameters:**
- `id`: GUID of the role (in URL)

**Request Body:**
```json
{
    "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
    "roleName": "super-admin"
}
```

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Role updated"
}
```

**Error Responses:**
- `400 Bad Request`: ID mismatch between URL and request body
- `404 Not Found`: Role not found

### 5. Delete Role
Deletes a role from the system.

**Endpoint:** `DELETE /api/roles/{id}`

**Parameters:**
- `id`: GUID of the role (in URL)

**Success Response (200 OK):**
```json
{
    "success": true,
    "message": "Role deleted"
}
```

**Error Response:**
- `404 Not Found`: Role not found

## Common Response Format
All endpoints return responses in the following format:
```json
{
    "success": boolean,
    "message": "string",
    "data": any // optional, present only in GET and POST responses
}
```
