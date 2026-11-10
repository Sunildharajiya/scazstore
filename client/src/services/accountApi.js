const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const request = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
};

// Get logged-in user profile
export const getProfile = () =>
  request("/me/profile");

// Update profile
export const updateProfile = (profile) =>
  request("/me/profile", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });

// Get customer addresses
export const getAddresses = () =>
  request("/me/addresses");

// Add address
export const addAddress = (address) =>
  request("/me/addresses", {
    method: "POST",
    body: JSON.stringify(address),
  });

// Update address
export const updateAddress = (id, address) =>
  request(`/me/addresses/${id}`, {
    method: "PATCH",
    body: JSON.stringify(address),
  });

// Get all customer orders
export const getMyOrders = () =>
  request("/me/orders");

// Get individual order tracking
export const getOrderTracking = (orderId) =>
  request(`/orders/${orderId}/tracking`);

// Update parcel receiver details
export const updateReceiverDetails = (orderId, details) =>
  request(`/orders/${orderId}/receiver`, {
    method: "PATCH",
    body: JSON.stringify(details),
  });