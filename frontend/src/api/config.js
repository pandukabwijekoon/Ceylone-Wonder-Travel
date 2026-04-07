// Centralized API Base URL for easier deployment
// By using import.meta.env, we can change the API URL on Vercel/Netlify without changing code.
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default API_BASE_URL;
