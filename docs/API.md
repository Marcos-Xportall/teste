# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Auth

#### POST /auth/register
Register a new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "john@example.com",
    "name": "John Doe",
    "plan": "STARTER",
    "credits": 100
  },
  "token": "jwt-token"
}
```

#### POST /auth/login
Login user

**Request:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "token": "jwt-token"
}
```

#### GET /auth/me
Get current user (requires auth)

**Response:**
```json
{
  "user": { ... }
}
```

---

### Projects

#### GET /projects
Get all user projects (requires auth)

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "My App",
    "description": "Description",
    "status": "READY",
    "code": { ... },
    "createdAt": "2024-01-01T00:00:00Z"
  }
]
```

#### GET /projects/:id
Get project by ID (requires auth)

**Response:**
```json
{
  "id": "uuid",
  "name": "My App",
  "description": "Description",
  "status": "READY",
  "code": {
    "html": "...",
    "css": "...",
    "javascript": "..."
  },
  "deployments": [...]
}
```

#### POST /projects
Create new project (requires auth + 50 credits)

**Request:**
```json
{
  "name": "My App",
  "description": "A cool app",
  "prompt": "Create a todo list app with dark mode"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "My App",
  "status": "GENERATING"
}
```

#### PUT /projects/:id
Update project (requires auth)

**Request:**
```json
{
  "name": "Updated Name",
  "code": { ... }
}
```

#### DELETE /projects/:id
Delete project (requires auth)

#### POST /projects/:id/generate
Generate/regenerate code (requires auth + 10 credits)

**Request:**
```json
{
  "prompt": "Add a dark mode toggle"
}
```

#### POST /projects/:id/deploy
Deploy project (requires auth + 10 credits)

**Response:**
```json
{
  "message": "Deployment started",
  "deployment": { ... }
}
```

---

### AI

#### POST /ai/generate-idea
Generate app idea (requires auth + 2 credits)

**Request:**
```json
{
  "prompt": "fitness tracking app"
}
```

**Response:**
```json
{
  "idea": "Detailed app description..."
}
```

#### POST /ai/generate-code
Generate code (requires auth + 5 credits)

**Request:**
```json
{
  "prompt": "Create a login form",
  "context": { ... }
}
```

**Response:**
```json
{
  "code": {
    "html": "...",
    "css": "...",
    "javascript": "..."
  }
}
```

#### POST /ai/edit-component
Edit component code (requires auth + 5 credits)

**Request:**
```json
{
  "componentCode": "<div>...</div>",
  "instruction": "Change background to blue"
}
```

**Response:**
```json
{
  "code": "Updated code..."
}
```

---

### User

#### GET /user/profile
Get user profile (requires auth)

#### PUT /user/profile
Update profile (requires auth)

**Request:**
```json
{
  "name": "New Name",
  "avatar": "https://..."
}
```

#### GET /user/credits
Get user credits (requires auth)

**Response:**
```json
{
  "credits": 150
}
```

#### GET /user/usage
Get usage history (requires auth)

**Response:**
```json
{
  "totalUsed": 50,
  "transactions": [...]
}
```

---

### Payments

#### GET /payments/plans
Get available plans

**Response:**
```json
[
  {
    "id": "starter",
    "name": "Starter",
    "price": 47,
    "credits": 500,
    "features": [...]
  }
]
```

#### POST /payments/create-checkout-session
Create Stripe checkout (requires auth)

**Request:**
```json
{
  "priceId": "price_..."
}
```

**Response:**
```json
{
  "url": "https://checkout.stripe.com/..."
}
```

#### GET /payments/transactions
Get payment history (requires auth)

---

## WebSocket Events

Connect to: `ws://localhost:3000`

### Client → Server

```javascript
socket.emit('join-project', projectId)
```

### Server → Client

```javascript
// Code generation completed
socket.on('code-generated', ({ projectId, code }) => {})

// Code generation failed
socket.on('code-generation-failed', ({ projectId, error }) => {})

// Deployment success
socket.on('deployment-success', ({ projectId, url }) => {})

// Deployment failed
socket.on('deployment-failed', ({ projectId, error }) => {})
```

---

## Error Responses

All errors follow this format:

```json
{
  "status": "error",
  "message": "Error description"
}
```

### Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `402` - Payment Required (insufficient credits)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

- General API: 100 requests per 15 minutes
- Auth endpoints: 5 requests per minute

Response headers include:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1234567890
```
