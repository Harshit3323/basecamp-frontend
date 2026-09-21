import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor for Token Refresh & Empty List 404 Normalization
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Check for 404 on list endpoints to normalize empty states
    if (error.response?.status === 404 && originalRequest) {
      const url = originalRequest.url || "";
      const isListEndpoint =
        url === "/projects" ||
        url === "/projects/" ||
        (url.includes("/tasks/") && !url.includes("/t/")) ||
        (url.includes("/notes/") && !url.includes("/n/")) ||
        (url.includes("/projects/") && url.endsWith("/members"));

      const message = error.response?.data?.message || "";
      const isEmptyMessage =
        message.includes("no projects found") ||
        message.includes("doesn't have any tasks") ||
        message.includes("doesn't have any notes") ||
        message.includes("no members present");

      if (isListEndpoint && isEmptyMessage) {
        return {
          data: {
            statusCode: 200,
            data: [],
            message: "Success (Normalized Empty State)",
            success: true,
          },
          status: 200,
          statusText: "OK",
          headers: error.response.headers,
          config: originalRequest,
        };
      }
    }

    // 2. Token refresh interceptor (401 -> refresh -> retry once)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/refresh-token")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => axiosInstance(originalRequest))
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(
          `${API_BASE_URL}/auth/refresh-token`,
          {},
          { withCredentials: true }
        );
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);
