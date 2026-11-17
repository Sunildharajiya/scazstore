
const API_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/product"
).replace(/\/+$/, "");

// Handle API responses
const handleResponse = async (response) => {
  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Invalid server response.");
  }

  if (!response.ok) {
    throw new Error(
      data?.message || `Request failed: ${response.status}`
    );
  }

  return data;
};

// Fetch products by section
export const getProducts = async ({
  section,
  limit = 8,
  category = "",
  latitude,
  longitude,
} = {}) => {
  const params = new URLSearchParams();

  if (section) params.append("section", section);

  params.append("limit", String(limit));

  if (category) params.append("category", category);

  if (latitude != null && longitude != null) {
    params.append("latitude", String(latitude));
    params.append("longitude", String(longitude));
  }

  const response = await fetch(
    `${API_URL}/products?${params.toString()}`
  );

  

  const data = await handleResponse(response);

console.log("[PRODUCT API] Response:", data);

if (Array.isArray(data)) return data;

if (Array.isArray(data.products)) {
  return data.products;
}

throw new Error("Products array not found in API response.");
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

  return handleResponse(response);
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

  if (category) params.append("category", category);
  if (search) params.append("search", search);

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

  const data = await handleResponse(response);

  return {
    products: Array.isArray(data)
      ? data
      : Array.isArray(data.products)
      ? data.products
      : [],

    totalPages: data.totalPages || 1,
    totalProducts: data.totalProducts || 0,
  };
};
