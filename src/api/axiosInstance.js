import axios from "axios";
import { API_URL } from "../config";
const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});
// Request Interceptor - Tambahkan token otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`📤 ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error("❌ Request Error:", error);
    return Promise.reject(error);
  },
);
// Response Interceptor - Handle 401 (token expired)
api.interceptors.response.use(
  (response) => {
    console.log(`📥 ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("❌ Unauthorized! Token expired or invalid.");
      // Redirect ke login
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    console.error("❌ Error:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);
export default api;
