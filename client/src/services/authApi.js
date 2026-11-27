
import {
  getAccessToken,
  setAccessToken,
  clearAccessToken,
} from "./authSession.js";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Reusable API request handler
const request = async (endpoint, options = {}) => {
  let response;

  try {
    const token = getAccessToken();

    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
          : {}),
        ...(token
          ? { Authorization: `Bearer ${token}` }
          : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error(
      "Could not connect to the ScazStore server. Check that the backend is running."
    );
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    const errorMessage =
      data.errors?.join(", ") ||
      data.message ||
      `Request failed with status ${response.status}.`;

    throw new Error(errorMessage);
  }

  return data;
};

// Signup
export const signup = (userData) =>
  request("/users/signup", {
    method: "POST",
    body: JSON.stringify(userData),
  });

// Login
export const login = async (credentials) => {
  const data = await request("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (data.token) {
    setAccessToken(data.token);
  }

  return data;
};

// Refresh access token
export const refreshToken = async () => {
  const data = await request("/users/newAxcToken", {
    method: "POST",
  });

  if (data.token) {
    setAccessToken(data.token);
  }

  return data;
};

// Clear in-memory authentication
export const clearAuth = () => {
  clearAccessToken();
};

export { request };
