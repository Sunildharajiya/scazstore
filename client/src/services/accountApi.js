import { getAccessToken } from "./authSession.js";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

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
    throw new Error(
      data.errors?.join(", ") ||
      data.message ||
      `Request failed with status ${response.status}.`
    );
  }

  return data;
};

export const getProfile = () =>
  request("/users/profile");

export const updateProfile = (profile) =>
  request("/users/profileUpdate", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });

export const getAddresses = () =>
  request("/users/address");

export const addAddress = (address) =>
  request("/users/addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });

export const updateAddress = (id, address) =>
  request(`/user/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(address),
  });

export const getMyOrders = () =>
  request("/user/orders");

export const getOrderTracking = (orderId) =>
  request(`/orders/${orderId}/tracking`);

export const updateReceiverDetails = (orderId, details) =>
  request(`/orders/${orderId}/receiver`, {
    method: "PATCH",
    body: JSON.stringify(details),
  });
