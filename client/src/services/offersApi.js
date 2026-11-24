const API_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Could not connect to the ScazStore server. Check that the backend is running.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success === false) {
    throw new Error(data.message || `Request failed with status ${response.status}.`);
  }
  return data;
};

// Get offers from backend.
export const getOffers = async ({ type = "all", category = "all", search = "" } = {}) => {
  const params = new URLSearchParams({ type });
  if (category !== "all") params.set("category", category);
  if (search.trim()) params.set("search", search.trim());

  const data = await request(`/offers?${params.toString()}`);
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.offers)) return data.offers;
  if (Array.isArray(data.data?.offers)) return data.data.offers;
  return [];
};

// Track an offer click.
export const trackOfferClick = async (offerId) => {
  if (!offerId) throw new Error("A valid offer ID is required.");
  return request(`/offers/${encodeURIComponent(offerId)}/click`, { method: "POST" });
};
