# Task Management API Documentation

This document describes the Task Management API endpoints provided by the ResourceManagerService.

## Endpoints

### Create Task
- **URL:** `/api/tasks`
- **Method:** `POST`
- **Description:** Creates a new task
- **Request Body (CreateTaskCommand):**
  ```json
  {
    "userId": "string (GUID)",
    "serviceType": "string",
    "containerId": "string"
  }
  ```
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "success": true,
      "message": "Task created",      "data": {
        "id": "string (GUID)",
        "serviceType": "string",
        "containerId": "string",
        "port": "number"
      }
    }
    ```

### Get Task by ID
- **URL:** `/api/tasks/{id}`
- **Method:** `GET`
- **Parameters:**
  - `id` (GUID) - Task ID in the path
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "success": true,
      "message": "Task found",      "data": {
        "id": "string (GUID)",
        "userId": "string (GUID)",
        "serviceType": "string",
        "containerId": "string",
        "port": "number",
        "startTime": "string (DateTime)",
        "stopTime": "string (DateTime) | null",
        "duration": "string (TimeSpan) | null",
        "status": "string ('Running', 'Stopped', 'Error')",
        "events": [
          {
            "id": "string (GUID)",
            "timestamp": "string (DateTime)",
            "type": "string",
            "details": "string"
          }
        ]
      }
    }
    ```
- **Error Response:**
  - **Code:** 404 Not Found
  - **Content:**
    ```json
    {
      "success": false,
      "message": "Task not found"
    }
    ```

### Get All Tasks
- **URL:** `/api/tasks`
- **Method:** `GET`
- **Query Parameters:**
  - `status` (optional) - Filter tasks by status
  - `serviceType` (optional) - Filter tasks by service type
  - `userId` (optional) - Filter tasks by user ID
  - `orderBy` (optional) - Sort field
  - `order` (optional) - Sort direction
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "success": true,
      "message": "Tasks listed",      "data": [
        {
          "id": "string (GUID)",
          "userId": "string (GUID)",
          "serviceType": "string",
          "containerId": "string",
          "port": "number",
          "startTime": "string (DateTime)",
          "stopTime": "string (DateTime) | null",
          "duration": "string (TimeSpan) | null",
          "status": "string ('Running', 'Stopped', 'Error')",
          "events": [
            {
              "id": "string (GUID)",
              "timestamp": "string (DateTime)",
              "type": "string",
              "details": "string"
            }
          ]
        }
      ]
    }
    ```

### Delete Task
- **URL:** `/api/tasks/{id}`
- **Method:** `DELETE`
- **Parameters:**
  - `id` (GUID) - Task ID in the path
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "success": true,
      "message": "Task deleted"
    }
    ```
- **Error Response:**
  - **Code:** 404 Not Found
  - **Content:**
    ```json
    {
      "success": false,
      "message": "Task not found"
    }
    ```

### Get Tasks by User ID
- **URL:** `/api/tasks/user/{userId}`
- **Method:** `GET`
- **Parameters:**
  - `userId` (GUID) - User ID in the path
- **Success Response:**
  - **Code:** 200 OK
  - **Content:**
    ```json
    {
      "success": true,
      "message": "User's tasks listed",      "data": [
        {
          "id": "string (GUID)",
          "userId": "string (GUID)",
          "serviceType": "string",
          "containerId": "string",
          "port": "number",
          "startTime": "string (DateTime)",
          "stopTime": "string (DateTime) | null",
          "duration": "string (TimeSpan) | null",
          "status": "string ('Running', 'Stopped', 'Error')",
          "events": [
            {
              "id": "string (GUID)",
              "timestamp": "string (DateTime)",
              "type": "string",
              "details": "string"
            }
          ]
        }
      ]
    }
    ```

## Common Response Format

All endpoints return responses in the following format:

```json
{
  "success": boolean,
  "message": "string",
  "data": any // Optional, present only in successful responses that return data
}
```

## Notes
- All ID parameters are in GUID format
- Authentication may be required for these endpoints (implementation details should be provided by the authentication service)
- Error responses will always have `success: false` and an error message
- Successful responses will always have `success: true` and may include data
