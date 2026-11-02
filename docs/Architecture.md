# Architecture & Tech Stack

This project follows a standard MERN-like stack approach but leverages modern tooling to provide a better developer experience and improved performance.

## Tech Stack

### Frontend
- **Framework**: React 19
- **Build Tool**: Vite (Extremely fast HMR and optimized builds)
- **Compiler**: Babel React Compiler (Optimizes rendering performance by auto-memoizing components)
- **Styling**: TailwindCSS & Vanilla CSS (Rapid UI development with utility classes, combined with custom CSS for specific components like `LandingPage.css`)
- **Routing**: React Router DOM (v7)
- **Network Requests**: Axios
- **Real-time Communication**: `socket.io-client`

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose ODM)
- **Authentication**: JWT (JSON Web Tokens) sent securely via HTTP-only cookies
- **File Uploads**: Multer (handling multipart/form-data) and Cloudinary (Cloud storage for images)
- **Real-time Communication**: `socket.io`
- **Security**: Helmet, CORS, Express Rate Limit

## High-Level Architecture

The application is structured into two main decoupled services:

1. **Frontend Client**: A Single Page Application (SPA) that runs in the browser. It communicates with the backend via RESTful APIs and WebSocket connections for real-time messaging.
2. **Backend Server**: A REST API that handles business logic, interacts with the MongoDB database, manages user authentication, and serves as the WebSocket server for the messaging feature.

### Authentication Flow
1. User submits login/signup credentials to the API.
2. The server verifies the credentials and, upon success, generates a JWT.
3. The server sends the JWT back to the client inside an **HTTP-only cookie**. This prevents XSS attacks from accessing the token via JavaScript.
4. For subsequent requests, the browser automatically includes this cookie, which the server verifies to authenticate the user.

### File Upload Flow
1. When creating a post with an image, the frontend sends a `multipart/form-data` request.
2. The backend uses **Multer** to parse the incoming file.
3. The image is either saved locally or (in production/configured environments) uploaded directly to **Cloudinary**.
4. The image URL is saved in the MongoDB document representing the post.

### Real-Time Messaging Flow
1. Upon successful login, the frontend establishes a persistent WebSocket connection to the backend using `socket.io-client`.
2. The server registers the user's socket ID.
3. When a user sends a message, it is saved to the database via a REST API endpoint.
4. The server then uses Socket.io to emit an event to the recipient's socket (if they are online), delivering the message in real-time.
