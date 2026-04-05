import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
});

// Request Interceptor: Automatically inject the Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle auth failures globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Automatic Logout on 401 Unauthorized
      console.warn("Session expired or unauthorized. Logging out...");
      localStorage.removeItem('token');
      localStorage.removeItem('currentUser');
      
      // We can also trigger a redirect to home with a login flag
      if (window.location.pathname !== '/') {
        window.location.href = '/?login=true';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
