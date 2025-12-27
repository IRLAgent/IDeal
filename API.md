# CarMarket.ie API Documentation

**Base URL**: `http://localhost:5000/api` (development)

## Authentication

All protected endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire after 24 hours.

---

## Health Check

### GET `/health`

Check if server is running.

**Response** (200 OK):
```json
{
  "status": "Server is running",
  "timestamp": "2025-12-27T10:30:00.000Z",
  "uptime": 3600
}
```

---

## Authentication Endpoints

### POST `/auth/register`

Register a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "phone": "+353 87 123 4567",
  "sellerType": "private"
}
```

**Response** (201 Created):
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 400: Missing required fields or invalid input
- 400: User already exists

---

### POST `/auth/login`

Login with email and password.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200 OK):
```json
{
  "user": {
    "id": "cuid123",
    "email": "user@example.com",
    "name": "John Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errors**:
- 400: Missing email or password
- 401: Invalid credentials

---

## Car Endpoints

### GET `/cars`

Get all cars with optional filters.

**Query Parameters**:
```
?make=BMW
?model=3-Series
?priceMin=10000
?priceMax=50000
?skip=0
?take=20
```

**Response** (200 OK):
```json
[
  {
    "id": "car123",
    "userId": "user123",
    "make": "BMW",
    "model": "3 Series",
    "year": 2020,
    "price": 22990,
    "mileage": 45000,
    "fuelType": "Petrol",
    "transmission": "Manual",
    "description": "Excellent condition...",
    "photoUrls": ["https://..."],
    "status": "active",
    "createdAt": "2025-12-27T10:00:00Z",
    "updatedAt": "2025-12-27T10:00:00Z",
    "user": {
      "id": "user123",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
]
```

---

### GET `/cars/:id`

Get a single car listing.

**Parameters**:
- `id` (string): Car ID

**Response** (200 OK):
```json
{
  "id": "car123",
  "userId": "user123",
  "make": "BMW",
  "model": "3 Series",
  "year": 2020,
  "price": 22990,
  "mileage": 45000,
  "fuelType": "Petrol",
  "transmission": "Manual",
  "description": "Excellent condition...",
  "photoUrls": ["https://..."],
  "status": "active",
  "createdAt": "2025-12-27T10:00:00Z",
  "updatedAt": "2025-12-27T10:00:00Z",
  "user": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Errors**:
- 404: Car not found

---

### POST `/cars`

Create a new car listing. **Requires authentication.**

**Request Body**:
```json
{
  "make": "BMW",
  "model": "3 Series",
  "year": 2020,
  "price": 22990,
  "mileage": 45000,
  "fuelType": "Petrol",
  "transmission": "Manual",
  "description": "Excellent condition. Full service history.",
  "photoUrls": ["https://cloudinary.com/..."]
}
```

**Response** (201 Created):
```json
{
  "id": "car123",
  "userId": "user123",
  "make": "BMW",
  "model": "3 Series",
  "year": 2020,
  "price": 22990,
  "mileage": 45000,
  "fuelType": "Petrol",
  "transmission": "Manual",
  "description": "Excellent condition...",
  "photoUrls": ["https://..."],
  "status": "active",
  "createdAt": "2025-12-27T10:00:00Z",
  "updatedAt": "2025-12-27T10:00:00Z"
}
```

**Errors**:
- 400: Missing required fields
- 401: Not authenticated

---

### PUT `/cars/:id`

Update a car listing. **Requires authentication & ownership.**

**Request Body**: Same fields as POST (all optional)

**Response** (200 OK): Updated car object

**Errors**:
- 401: Not authenticated
- 403: Not authorized (not owner)
- 404: Car not found

---

### DELETE `/cars/:id`

Delete a car listing. **Requires authentication & ownership.**

**Response** (200 OK):
```json
{
  "success": true
}
```

**Errors**:
- 401: Not authenticated
- 403: Not authorized (not owner)
- 404: Car not found

---

### GET `/cars/user/listings`

Get current user's listings. **Requires authentication.**

**Response** (200 OK):
```json
[
  {
    "id": "car123",
    "make": "BMW",
    "model": "3 Series",
    ...
  }
]
```

---

## Message Endpoints

### POST `/messages`

Send a message. **Requires authentication.**

**Request Body**:
```json
{
  "toUserId": "user456",
  "carId": "car123",
  "messageText": "Hi, I'm interested in this car. Is it still available?"
}
```

**Response** (201 Created):
```json
{
  "id": "msg123",
  "fromUserId": "user123",
  "toUserId": "user456",
  "carId": "car123",
  "messageText": "Hi, I'm interested...",
  "read": false,
  "createdAt": "2025-12-27T10:00:00Z",
  "fromUser": {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "toUser": {
    "id": "user456",
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

**Errors**:
- 400: Missing required fields
- 401: Not authenticated

---

### GET `/messages`

Get all messages for current user. **Requires authentication.**

**Response** (200 OK):
```json
[
  {
    "id": "msg123",
    "fromUserId": "user456",
    "toUserId": "user123",
    "carId": "car123",
    "messageText": "Thanks for the inquiry...",
    "read": false,
    "createdAt": "2025-12-27T10:00:00Z",
    "fromUser": {
      "id": "user456",
      "name": "Jane Smith"
    },
    "toUser": {
      "id": "user123",
      "name": "John Doe"
    },
    "car": {
      "id": "car123",
      "make": "BMW",
      "model": "3 Series"
    }
  }
]
```

---

### GET `/messages/:otherUserId`

Get conversation with specific user. **Requires authentication.**

**Response** (200 OK): Array of messages ordered by timestamp

---

### PATCH `/messages/:messageId/read`

Mark a message as read. **Requires authentication.**

**Response** (200 OK): Updated message object with `read: true`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

### 403 Forbidden
```json
{
  "error": "Not authorized"
}
```

### 404 Not Found
```json
{
  "error": "Endpoint not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Testing with Postman

### 1. Register a User
```
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "testPassword123",
  "name": "Test User",
  "phone": "+353 87 123 4567",
  "sellerType": "private"
}
```

Save the returned `token`.

### 2. Create a Listing
```
POST http://localhost:5000/api/cars
Content-Type: application/json
Authorization: Bearer <token>

{
  "make": "BMW",
  "model": "3 Series",
  "year": 2020,
  "price": 22990,
  "mileage": 45000,
  "fuelType": "Petrol",
  "transmission": "Manual",
  "description": "Great condition!",
  "photoUrls": []
}
```

### 3. Get All Cars
```
GET http://localhost:5000/api/cars?make=BMW&priceMax=30000
```

### 4. Send a Message
```
POST http://localhost:5000/api/messages
Content-Type: application/json
Authorization: Bearer <token>

{
  "toUserId": "other-user-id",
  "carId": "car-id",
  "messageText": "Is this car still available?"
}
```

---

## Rate Limiting

Not yet implemented. Plan for Phase 2.

---

## Versioning

Current version: **v1** (included in base URL)

---

## Support

For API issues, check:
1. `/api/health` endpoint is responding
2. Database connection is valid
3. Environment variables are set
4. JWT token is valid and not expired
