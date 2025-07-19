import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // use .env file for URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors if needed
// axiosInstance.interceptors.request.use(...);
// axiosInstance.interceptors.response.use(...);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.message);
    return Promise.reject(error);
  }
);

export default api;
