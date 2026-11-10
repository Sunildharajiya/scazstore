const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Get offers from backend
export const getOffers = async ({
  type = "all",
  category = "all",
  search = "",
} = {}) => {
  const params = new URLSearchParams();

  params.append("type", type);

  if (category !== "all") {
    params.append("category", category);
  }

  if (search.trim()) {
    params.append("search", search.trim());
  }

  const response = await fetch(
    `${API_URL}/offers?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Unable to load offers.");
  }

  const data = await response.json();

  return Array.isArray(data) ? data : data.offers || [];
};

// Track offer click
export const trackOfferClick = async (offerId) => {
  const response = await fetch(
    `${API_URL}/offers/${offerId}/click`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Unable to track offer.");
  }

  return response.json();
};