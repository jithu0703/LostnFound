# Campus Lost & Found

A full-stack web application for reporting and recovering lost items on campus. Students can post lost or found items, browse listings, and connect with each other to reunite people with their belongings.

Built with a React frontend and a Node.js/Express backend, connected to MongoDB.

---

## Project Structure

```
/
├── frontend/   # Vite + React (JS) with React Compiler
└── backend/    # Node.js + Express REST API
```

Each folder has its own README with setup instructions.

---

## Getting Started

You'll need to run both the frontend and backend simultaneously during development.

**Prerequisites**

- Node.js v18+
- A MongoDB instance (local or Atlas)

**Quick start**

```bash
# Terminal 1 — API server
cd backend
npm install
npm run dev

# Terminal 2 — Dev server
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:5173` and proxies API requests to the backend at `http://localhost:5000`.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Compiler |
| Backend | Node.js, Express |
| Database | MongoDB via Mongoose |
| Auth | JWT (HTTP-only cookies) |
| File Uploads | Multer |

---

## Author

Jithendra

---

## Deployment

This app is configured for deployment on **Vercel** (Frontend) and **Render** (Backend).

### Backend (Render)
1. Set the Root Directory to `backend`
2. Set the Build Command to `npm install`
3. Set the Start Command to `npm start` (make sure your `package.json` has `"start": "node server.js"`)
4. Add the following Environment Variables:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `CLIENT_URL`: Set this to your live **Vercel domain** (e.g., `https://lostnfound.vercel.app`)

### Frontend (Vercel)
1. Set the Root Directory to `frontend`
2. The Build Command and Output Directory should be automatically detected by Vercel for a Vite project.
3. Add the following Environment Variable:
   - `VITE_API_BASE_URL`: Set this to your live **Render API URL** (e.g., `https://lostnfound-backend.onrender.com/api`)
