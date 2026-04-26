import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true, // Critical: Ensures cookies are sent
});

// Global variables to manage the lock
let isRefreshing = false;
let failedQueue = [];

// Helper to process the queue after refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      // CASE 1: A refresh is already happening
      if (isRefreshing) {
        // Return a promise that waits for the current refresh to finish
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // CASE 2: Start a new refresh
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call the refresh endpoint
        const res = await api.post("/api/refresh", {
          withCredentials: true,
        });

        const newAccessToken = res.data.accessToken;

        // Update localStorage
        localStorage.setItem("token", newAccessToken);

        // Update the header for the current request
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        // Resolve all pending requests with the new token
        processQueue(null, newAccessToken);

        // Retry the original request
        return api(originalRequest);
      } catch (err) {
        // If refresh fails (token is invalid), logout
        processQueue(err, null);
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // Optional: clear user data
        // Avoid multiple redirects
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(err);
      } finally {
        // Release the lock
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
