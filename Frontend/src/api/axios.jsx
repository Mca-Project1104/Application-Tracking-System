import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || localStorage.getItem("admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//Complete this work automatic user logout
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Account deleted"
    ) {
      localStorage.clear();
      window.location.href = "/";     //refirect landing page
    }

    return Promise.reject(error);
  },
);

export default api;
