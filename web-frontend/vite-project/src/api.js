// src/api.js
import axios from "axios";

// All /api requests get the JWT automatically
const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default api;

// Helper to check for an existing token
export function getToken() {
  return localStorage.getItem("token");
}
