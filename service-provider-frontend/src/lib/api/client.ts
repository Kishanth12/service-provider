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
  (response) => {
    // Check if response is JSON (prevent Unexpected Token error)
    const contentType = response.headers['content-type'];
    if (contentType && !contentType.includes('application/json')) {
      console.warn("⚠️ Received non-JSON response from API:", contentType);
      // We don't reject here if it's a 2xx, but usually API should return JSON
    }
    return response;
  },
  (error) => {
    if (error.code === "ERR_NETWORK") {
      console.error(
        "❌ Network Error: Backend not reachable at",
        error.config?.baseURL
      );
    }
    
    // Check for HTML response in error (common for 404/500 on some hosts)
    const contentType = error.response?.headers?.['content-type'];
    if (contentType && contentType.includes('text/html')) {
        return Promise.reject({
            ...error,
            message: "The server returned an invalid response (HTML). This usually means the API URL is incorrect or the server is down.",
            isHtmlError: true
        });
    }

    return Promise.reject(error);
  }
);
