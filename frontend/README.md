# Frontend

React client for the Campus Lost & Found application.

## Stack

- **Build tool** — Vite
- **UI** — React 19 with the React Compiler
- **Language** — JavaScript

The React Compiler handles memoization automatically — avoid manually adding `useMemo`, `useCallback`, or `memo()` wrappers unless you have a specific reason to override the compiler's output.

---

## Setup

**1. Install dependencies**

```bash
npm install
```

**2. Configure the API base URL**

The dev server proxies `/api` requests to `http://localhost:5000` via `vite.config.js`. If your backend runs on a different port, update the proxy target there.

**3. Start the dev server**

```bash
npm run dev
```

**Other commands**

```bash
npm run build    # production build → dist/
npm run preview  # preview the production build locally
```

---

## Project Structure

```
frontend/
├── public/
└── src/
    ├── assets/
    ├── components/
    ├── pages/
    ├── hooks/
    ├── services/      # API call functions
    ├── context/       # React context providers
    ├── utils/
    └── main.jsx
```

---

## Notes

- API requests should go through the `services/` layer rather than calling `fetch` directly in components.
- Auth state is managed via context and persists across page reloads using the HTTP-only session cookie set by the backend — there is no token stored in `localStorage`.