
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Reusable API request handler
const request = async (endpoint, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body
          ? { "Content-Type": "application/json" }
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
export const login = (credentials) =>
  request("/users/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

// Refresh access token
export const refreshToken = () =>
  request("/users/newAxcToken", {
    method: "POST",
  });

export { request };
