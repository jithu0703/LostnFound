# Backend

REST API for the Campus Lost & Found application. Handles authentication, item listings, and file uploads.

## Stack

- **Runtime** — Node.js
- **Framework** — Express
- **Database** — MongoDB via Mongoose
- **Auth** — JWT stored in HTTP-only cookies
- **Uploads** — Multer
- **Password hashing** — bcrypt

---

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Create a `.env` file** in the `backend/` root:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

**3. Start the server**

```bash
npm run dev    # development (nodemon)
npm start      # production
```

---

## Project Structure

```
backend/
├── src/
│   ├── config/        # Database connection, env validation
│   ├── controllers/   # Route handler logic
│   ├── middleware/    # Auth guard, error handler, morgan logging
│   ├── models/        # Mongoose schemas
│   ├── routes/        # Express routers
│   ├── services/      # Business logic layer
│   ├── utils/         # Shared helpers
│   └── app.js         # Express app setup, middleware chain
└── server.js          # Entry point
```

---

## API Reference

### Auth

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| `POST` | `/api/auth/register` | Create a new account | No |
| `POST` | `/api/auth/login` | Log in and receive a session cookie | No |
| `GET` | `/api/auth/me` | Get the current authenticated user | Yes |

### Items

| Method | Endpoint | Description | Auth required |
|---|---|---|---|
| `POST` | `/api/items` | Post a lost or found item | Yes |
| `GET` | `/api/items` | List all items | No |
| `GET` | `/api/items/:id` | Get a single item by ID | No |
| `PUT` | `/api/items/:id` | Update an item | Yes |
| `DELETE` | `/api/items/:id` | Delete an item | Yes |

---

## Authentication

All protected routes expect a valid JWT. The token is issued on login and stored in an HTTP-only cookie — it is never exposed to JavaScript on the client.

Protected routes use the `protect` middleware:

```js
router.get('/me', protect, getMe)
```

---

## Roadmap

- [ ] Real-time chat between users (Socket.io)
- [ ] In-app notifications
- [ ] Advanced search and filtering
- [ ] Role-based access control (admin, student)