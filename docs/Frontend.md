# Frontend Documentation

The frontend is a Single Page Application (SPA) built with React 19 and Vite.

## Tooling Highlights

- **Vite**: Provides lightning-fast Hot Module Replacement (HMR) during development and highly optimized rollup builds for production.
- **Babel React Compiler**: Automatically memoizes components and hooks. This means we don't have to manually write `useMemo` and `useCallback` to prevent unnecessary re-renders, greatly improving default performance.

## Routing (`App.jsx`)

React Router v7 is used to manage navigation without full page reloads.

Key Routes:
- `/`: `LandingPage.jsx` - The marketing/home page.
- `/posts`: `PostsPage.jsx` - The main feed showing lost and found items.
- `/posts/:id`: `PostDetailsPage.jsx` - Detailed view of a specific item.
- `/login`: `LoginPage.jsx` (Or handled via `LoginModal.jsx`).
- `/messages`: `MessagesPage.jsx` - The chat interface (Protected Route).

## Key Components

- **Navbar (`Navbar.jsx`)**: Global navigation. Handles checking authentication state and displays conditional links (e.g., Login vs Logout/Messages).
- **Post Forms (`PostFoundForm.jsx`, `ReportLostForm.jsx`)**: Forms that use `FormData` API to handle image uploads and text data, sending `multipart/form-data` to the backend.
- **ProtectedRoute (`ProtectedRoute.jsx`)**: A wrapper component that checks if a user is authenticated. If not, it redirects them to the login page/modal.

## State Management

State is primarily managed locally within components using React hooks (`useState`, `useEffect`).
For cross-cutting concerns like Authentication, context or custom hooks (often wrapping Axios interceptors) are used.

### API Communication

Axios is used for HTTP requests.
- `withCredentials: true` is configured globally or per-request so that the HTTP-only JWT cookies are automatically sent with every request to the backend.

### Real-Time Sockets

In the `MessagesPage.jsx` or a global context, `socket.io-client` connects to the backend:
```javascript
const socket = io(import.meta.env.VITE_API_BASE_URL);
```
- It listens for `receiveMessage` events to update the local chat state immediately, providing a seamless user experience.
