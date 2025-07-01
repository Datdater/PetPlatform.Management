import axios from "axios";
import { useAuthStore } from "../stores/authStore";

// Create base client with common configuration
export const createClient = (baseURL: string) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Interceptor: luôn lấy token mới nhất từ Zustand store
  instance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().token;
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return instance;
};

// Create specific clients for different services
export const feClient = createClient(`${import.meta.env.VITE_BACKEND_URL}`);

// Export default client for backward compatibility
export const client = feClient;
