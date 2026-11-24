const API_BASE = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");
const API_ORIGIN = new URL(API_BASE).origin;

export const checkServerHealth = async () => {
  try {
    const response = await fetch(`${API_ORIGIN}/h`, { method: "GET" });
    const message = await response.text();

    return {
      success: response.ok,
      status: response.status,
      message: message || response.statusText || "Server responded.",
    };
  } catch (error) {
    return {
      success: false,
      status: 0,
      message: error.message || "Unable to reach the backend.",
    };
  }
};
