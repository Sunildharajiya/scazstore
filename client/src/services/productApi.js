
const API_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api"
).replace(/\/+$/, "");

// Product endpoint
const PRODUCT_ENDPOINT = `${API_URL}/product/products`;

// Browser debugging alert
const showApiAlert = (title, details) => {
  if (typeof window === "undefined") return;

  window.alert(`${title}\n\n${details}`);
};

// Fetch API
const fetchApi = async (url, options = {}) => {
  try {
    return await fetch(url, options);
  } catch (error) {
    showApiAlert(
      "ScazStore API: Connection Failed",
      `URL: ${url}\nError: ${error.message}`
    );

    throw new Error(
      "Could not connect to the ScazStore server. Check that the backend is running."
    );
  }
};

// Handle backend response
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  let data;

  if (contentType.includes("application/json")) {
    data = await response.json().catch(() => null);
  } else {
    const message = await response.text().catch(() => "");
    data = message ? { message } : null;
  }

  if (!response.ok) {
    throw new Error(
      data?.message ||
      data?.error ||
      `Request failed with status ${response.status}.`
    );
  }

  if (data == null) {
    throw new Error(
      "The server returned an empty or invalid response."
    );
  }

  if (data.success === false) {
    throw new Error(
      data.message || "The request was not successful."
    );
  }

  return data;
};

// Extract products from different response structures
const extractProducts = (data) => {
  if (Array.isArray(data)) return data;

  if (Array.isArray(data?.products)) {
    return data.products;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.data?.products)) {
    return data.data.products;
  }

  if (Array.isArray(data?.result?.products)) {
    return data.result.products;
  }

  return [];
};

// Build product query parameters
const buildProductQuery = ({
  section,
  limit = 8,
  category = "",
  search = "",
  sort,
  page,
  latitude,
  longitude,
  minPrice,
  maxPrice,
} = {}) => {
  const params = new URLSearchParams();

  if (section) params.set("section", section);

  if (category) params.set("category", category);

  if (search) params.set("search", search);

  if (sort) params.set("sort", sort);

  if (page != null) {
    params.set("page", String(page));
  }

  if (limit != null) {
    params.set("limit", String(limit));
  }

  if (latitude != null && longitude != null) {
    params.set("latitude", String(latitude));
    params.set("longitude", String(longitude));
  }

  if (minPrice !== undefined && minPrice !== "") {
    params.set("minPrice", String(minPrice));
  }

  if (maxPrice !== undefined && maxPrice !== "") {
    params.set("maxPrice", String(maxPrice));
  }

  return params.toString();
};

// Fetch homepage products
// Returns: Array of products
export const getProducts = async (options = {}) => {
  const query = buildProductQuery(options);

  const url = `${PRODUCT_ENDPOINT}${query ? `?${query}` : ""}`;

  const response = await fetchApi(url);

  const data = await handleResponse(response);

  const products = extractProducts(data);

  console.log("[PRODUCT API] Products:", products);

  return products;
};

// Add product to cart
export const addProductToCart = async (
  productId,
  quantity = 1
) => {
  if (!productId) {
    throw new Error("A valid product ID is required.");
  }

  const url = `${API_URL}/cart/items`;

  const response = await fetchApi(url, {
    method: "POST",
    credentials: "include",
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

// Fetch category products with pagination
export const getCategoryProducts = async (options = {}) => {
  const query = buildProductQuery({
    limit: 12,
    sort: "newest",
    page: 1,
    ...options,
  });

  const url = `${PRODUCT_ENDPOINT}${query ? `?${query}` : ""}`;

  const response = await fetchApi(url);

  const data = await handleResponse(response);

  const nested =
    data?.data && !Array.isArray(data.data)
      ? data.data
      : data;

  return {
    products: extractProducts(data),

    totalPages: Math.max(
      1,
      Number(nested?.totalPages || data?.totalPages || 1)
    ),

    totalProducts: Math.max(
      0,
      Number(nested?.totalProducts || data?.totalProducts || 0)
    ),

    currentPage: Number(
      nested?.currentPage ||
      data?.currentPage ||
      options.page ||
      1
    ),
  };
};
