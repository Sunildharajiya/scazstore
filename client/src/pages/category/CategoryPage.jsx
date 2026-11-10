import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import {
  getCategoryProducts,
  addProductToCart,
} from "../../services/productApi";

const CATEGORY_DATA = {
  products: {
    title: "All Products",
    description: "Explore everything available at ScazStore.",
    icon: "🛍️",
  },
  groceries: {
    title: "Groceries",
    description: "Shop everyday grocery essentials.",
    icon: "🛒",
  },
  vegetables: {
    title: "Fresh Vegetables",
    description: "Fresh vegetables for your everyday meals.",
    icon: "🥦",
  },
  fruits: {
    title: "Fresh Fruits",
    description: "Discover fresh and delicious fruits.",
    icon: "🍎",
  },
  "daily-needs": {
    title: "Daily Needs",
    description: "Everything you need for daily life.",
    icon: "🏠",
  },
  electronics: {
    title: "Electronics",
    description: "Explore electronics and accessories.",
    icon: "📱",
  },
  "personal-care": {
    title: "Personal Care",
    description: "Personal care and hygiene essentials.",
    icon: "🧴",
  },
};

const ProductCard = ({ product, onAddToCart, adding }) => {
  return (
    <article className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Image */}
      <div className="relative flex h-40 items-center justify-center overflow-hidden bg-gray-50 sm:h-52">

        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
        />

        {product.discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
            {product.discount}% OFF
          </span>
        )}

      </div>

      {/* Details */}
      <div className="p-3">

        <p className="text-xs text-gray-400">
          {product.category}
        </p>

        <h3 className="mt-1 line-clamp-2 min-h-10 text-sm font-bold text-gray-800">
          {product.name}
        </h3>

        <div className="mt-2 flex items-center gap-2">

          <span className="font-extrabold text-green-700">
            ₹{product.price}
          </span>

          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{product.originalPrice}
            </span>
          )}

        </div>

        {product.rating != null && (
          <p className="mt-2 text-xs text-yellow-600">
            ★ {product.rating} ({product.reviews || 0})
          </p>
        )}

        <button
          disabled={adding || product.stock === 0}
          onClick={() => onAddToCart(product)}
          className="mt-3 w-full rounded-lg bg-green-600 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:bg-gray-400"
        >
          {product.stock === 0
            ? "Out of Stock"
            : adding
            ? "Adding..."
            : "+ Add to Cart"}
        </button>

      </div>
    </article>
  );
};

const CategoryPage = () => {
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const category = slug || "products";
  const categoryInfo =
    CATEGORY_DATA[category] || CATEGORY_DATA.products;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const [addingId, setAddingId] = useState(null);
  const [message, setMessage] = useState("");

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "newest",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    page: Math.max(1, Number(searchParams.get("page")) || 1),
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const result = await getCategoryProducts({
        category:
          category === "products" ? "" : category,
        ...filters,
        limit: 12,
      });

      setProducts(result.products);
      setTotalPages(result.totalPages);
      setTotalProducts(result.totalProducts);
    } catch (err) {
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [category, filters]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadProducts();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadProducts]);

  // Keep URL filters updated
  useEffect(() => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.sort !== "newest") params.set("sort", filters.sort);
    if (filters.page > 1) params.set("page", String(filters.page));
    if (filters.minPrice !== "") params.set("minPrice", filters.minPrice);
    if (filters.maxPrice !== "") params.set("maxPrice", filters.maxPrice);

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      setAddingId(product._id);
      setMessage("");

      await addProductToCart(product._id);

      setMessage(`${product.name} added to cart!`);

      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (err) {
      setMessage(err.message || "Unable to add product.");
    } finally {
      setAddingId(null);
    }
  };

  const updateFilter = (key, value) => {
    setFilters((previous) => ({
      ...previous,
      [key]: value,
      page: 1,
    }));
  };

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Category Hero */}
      <section className="bg-gradient-to-r from-green-900 to-green-600 px-4 py-12 text-white sm:py-16">

        <div className="mx-auto max-w-7xl">

          <p className="text-4xl">
            {categoryInfo.icon}
          </p>

          <h1 className="mt-4 text-3xl font-black sm:text-5xl">
            {categoryInfo.title}
          </h1>

          <p className="mt-3 text-sm text-green-50 sm:text-base">
            {categoryInfo.description}
          </p>

          <p className="mt-4 text-sm font-semibold">
            {totalProducts} Products Available
          </p>

        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Search and Sorting */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row">

          <input
            type="search"
            value={filters.search}
            onChange={(e) =>
              updateFilter("search", e.target.value)
            }
            placeholder="Search products..."
            className="min-w-0 flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500"
          />

          <select
            value={filters.sort}
            onChange={(e) =>
              updateFilter("sort", e.target.value)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-green-500"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

        </div>

        {/* Price Filter */}
        <div className="mb-8 flex flex-wrap items-center gap-3 rounded-xl bg-white p-4 shadow-sm">

          <span className="text-sm font-bold text-gray-700">
            Price Range:
          </span>

          <input
            type="number"
            min="0"
            placeholder="Min ₹"
            value={filters.minPrice}
            onChange={(e) =>
              updateFilter("minPrice", e.target.value)
            }
            className="w-24 rounded-lg border px-3 py-2 text-sm"
          />

          <input
            type="number"
            min="0"
            placeholder="Max ₹"
            value={filters.maxPrice}
            onChange={(e) =>
              updateFilter("maxPrice", e.target.value)
            }
            className="w-24 rounded-lg border px-3 py-2 text-sm"
          />

          <button
            onClick={() =>
              setFilters((previous) => ({
                ...previous,
                page: 1,
              }))
            }
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
          >
            Apply
          </button>

          <button
            onClick={() =>
              setFilters({
                search: "",
                sort: "newest",
                minPrice: "",
                maxPrice: "",
                page: 1,
              })
            }
            className="text-sm font-semibold text-red-500"
          >
            Clear Filters
          </button>

        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-xl bg-white"
              >
                <div className="h-40 bg-gray-200 sm:h-52" />
                <div className="space-y-3 p-3">
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-4 w-1/2 rounded bg-gray-200" />
                  <div className="h-9 rounded bg-gray-200" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-8 text-center">
            <p className="text-red-700">{error}</p>

            <button
              onClick={loadProducts}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

              {products.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onAddToCart={handleAddToCart}
                  adding={addingId === product._id}
                />
              ))}

            </div>

            {/* Pagination */}
            <div className="mt-10 flex items-center justify-center gap-4">

              <button
                disabled={filters.page <= 1}
                onClick={() =>
                  updateFilter("page", filters.page - 1)
                }
                className="rounded-lg border bg-white px-5 py-2 font-semibold disabled:opacity-40"
              >
                ← Previous
              </button>

              <span className="text-sm font-bold text-gray-700">
                Page {filters.page} of {totalPages}
              </span>

              <button
                disabled={filters.page >= totalPages}
                onClick={() =>
                  updateFilter("page", filters.page + 1)
                }
                className="rounded-lg border bg-white px-5 py-2 font-semibold disabled:opacity-40"
              >
                Next →
              </button>

            </div>
          </>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl bg-white py-16 text-center shadow-sm">

            <p className="text-5xl">🛍️</p>

            <h2 className="mt-4 text-xl font-bold text-gray-800">
              No Products Found
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              onClick={() =>
                setFilters({
                  search: "",
                  sort: "newest",
                  minPrice: "",
                  maxPrice: "",
                  page: 1,
                })
              }
              className="mt-5 rounded-lg bg-green-600 px-6 py-3 font-bold text-white"
            >
              Clear Filters
            </button>

          </div>
        )}

      </div>

      {/* Cart Notification */}
      {message && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
        >
          {message}
        </div>
      )}

    </main>
  );
};

export default CategoryPage;