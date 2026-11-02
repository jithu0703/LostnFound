# Backend Documentation

The backend is built with Express.js and handles the core business logic, database interactions, and real-time sockets.

## Database Models

The models are defined using Mongoose (`backend/src/models/`).

### User Model (`User.js`)
Stores user information.
- `name`: String, required.
- `email`: String, required, unique. Includes Regex validation.
- `password`: String, required, min length 7. (Hashed using bcrypt before saving).
- `phone`: String, required, unique. Must be exactly 10 digits.
- `timestamps`: Automatically manages `createdAt` and `updatedAt`.

### Post Model (`Post.js`)
Represents an item that is reported as lost or found.
- `userId`: ObjectId reference to `User`.
- `type`: String, Enum (`"lost"`, `"found"`).
- `itemName`: String, required.
- `description`: String, required.
- `imageUrl`: String, stores the URL to the uploaded image.
- `location`: Object containing `block`, `floor`, and `room`.
- `date`: Date, when the item was lost/found.

### Message Model (`Message.js`)
Handles chat messages between users.
- `senderId`: ObjectId reference to `User`.
- `receiverId`: ObjectId reference to `User`.
- `content`: String, the actual message text.
- `read`: Boolean, defaults to false.

## API Routes Structure

Routes are grouped logically in `backend/src/routes/` and managed by controllers in `backend/src/controllers/`.

### Authentication (`/api/auth`)
- `POST /register`: Creates a new user, hashes password, sets HTTP-only cookie.
- `POST /login`: Verifies credentials, sets HTTP-only cookie.
- `POST /logout`: Clears the cookie.
- `GET /me`: Returns the currently authenticated user based on the cookie.

### Posts (`/api/posts`)
- `GET /`: Retrieves all posts (often with filtering/pagination logic).
- `GET /:id`: Retrieves a specific post by its ID.
- `POST /`: Creates a new post. (Protected route, uses Multer middleware for image upload).
- `PUT /:id`: Updates a post. (Protected).
- `DELETE /:id`: Deletes a post. (Protected).

### Messages (`/api/messages`)
- `GET /:userId`: Gets conversation history with a specific user. (Protected).
- `POST /`: Sends a new message. (Protected).

## Middleware

- `authMiddleware.js`: Reads the JWT from the HTTP-only cookie. If valid, attaches the `userId` to `req.user` and allows the request to proceed. If missing or invalid, returns a 401/403.
- `uploadMiddleware.js`: Uses Multer to parse `multipart/form-data`. configured to either save files to the `/uploads` directory or stream them to Cloudinary.

## WebSocket Integration (`app.js` / `server.js`)

Socket.io is initialized alongside the Express server.
- Clients connect and pass their user ID.
- The server maintains a mapping of `userId` -> `socketId`.
- When a `POST /api/messages` request is successful, the server emits a `receiveMessage` event directly to the recipient's active socket, enabling instant UI updates.
