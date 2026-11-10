const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Fetch products by section
export const getProducts = async ({
  section,
  limit = 8,
  category = "",
  latitude,
  longitude,
}) => {
  const params = new URLSearchParams({
    section,
    limit: String(limit),
  });

  if (category) {
    params.append("category", category);
  }

  if (latitude != null && longitude != null) {
    params.append("latitude", latitude);
    params.append("longitude", longitude);
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Unable to load products.");
  }

  const data = await response.json();

  // Supports either an array or { products: [] }
  return Array.isArray(data) ? data : data.products || [];
};

// Add product to cart
export const addProductToCart = async (productId, quantity = 1) => {
  const response = await fetch(`${API_URL}/cart/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      productId,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Unable to add product to cart.");
  }

  return response.json();
};

// Fetch category products with filters and pagination
export const getCategoryProducts = async ({
  category = "",
  search = "",
  sort = "newest",
  page = 1,
  limit = 12,
  minPrice,
  maxPrice,
} = {}) => {
  const params = new URLSearchParams();

  params.append("category", category);
  params.append("search", search);
  params.append("sort", sort);
  params.append("page", String(page));
  params.append("limit", String(limit));

  if (minPrice !== undefined && minPrice !== "") {
    params.append("minPrice", String(minPrice));
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    params.append("maxPrice", String(maxPrice));
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`
  );

  if (!response.ok) {
    throw new Error("Unable to load products.");
  }

  const data = await response.json();

  return {
    products: Array.isArray(data)
      ? data
      : data.products || [],
    totalPages: data.totalPages || 1,
    totalProducts: data.totalProducts || 0,
  };
};