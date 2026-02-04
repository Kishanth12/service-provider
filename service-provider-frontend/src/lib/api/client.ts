import axios from "axios";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Add token to headers
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state?.accessToken) {
        config.headers.Authorization = `Bearer ${state.accessToken}`;
      }
    }
  }
  return config;
});

// Better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error(
        "❌ Network Error: Backend not reachable at",
        error.config?.baseURL
      );
    }
    return Promise.reject(error);
  }
);
