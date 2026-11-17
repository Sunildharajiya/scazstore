import ProductDebug from "../../../universal/debug/ProductDebug";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  addProductToCart,
} from "../../../services/productApi";

import ProductCard from "../../../components/cards/productCard";

const SECTIONS = [
  {
    id: "trending",
    title: "Popular Products",
    subtitle: "Products everyone loves",
    icon: "🔥",
    limit: 8,
  },
  {
    id: "featured",
    title: "New Arrivals",
    subtitle: "Discover what's new",
    icon: "✨",
    limit: 8,
  },
  {
    id: "daily-needs",
    title: "Daily Needs",
    subtitle: "Everything for everyday life",
    icon: "🛒",
    limit: 8,
  },
  {
    id: "vegetables",
    title: "Fresh Vegetables",
    subtitle: "Freshness delivered daily",
    icon: "🥦",
    limit: 8,
    category: "vegetables",
  },
  {
    id: "nearby",
    title: "Best Near You",
    subtitle: "Products available around you",
    icon: "📍",
    limit: 8,
  },
];

const ProductSections = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [cartLoading, setCartLoading] = useState(null);
  const [cartMessage, setCartMessage] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const [location, setLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");

  // Get customer location
  const getCustomerLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported.");
      return;
    }

    setLocationMessage("Getting your location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationMessage("");
      },
      (error) => {
        setLocationMessage(
          error.code === 1
            ? "Location permission denied."
            : "Unable to get your location."
        );
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  // Fetch homepage product sections
  const loadProducts = useCallback(async () => {
    setLoading(true);

    const results = await Promise.allSettled(
      SECTIONS.map(async (section) => {
        // Do not request nearby products without coordinates
        
        if (section.id === "nearby" && !location) {
          return {
            id: section.id,
            products: [],
          };
        }

        const category =
          activeCategory !== "all"
            ? activeCategory
            : section.category || "";

        const result = await getProducts({
          section:
            section.id === "vegetables" ||
            section.id === "nearby"
              ? undefined
              : section.id,

          limit: section.limit,
          category,

          ...(section.id === "nearby" ? location : {}),
        });

        return {
          id: section.id,
          products: result,
        };
      })
    );

    console.log("[PRODUCT SECTIONS] Results:", results);

    const newProducts = {};
    const newErrors = {};

    if (result.status === "fulfilled") {
  newProducts[sectionId] = result.value;
} else {
  newProducts[sectionId] = [];

  newErrors[sectionId] =
    result.reason?.message || "Unable to load products.";
}

    setProducts(newProducts);
    setErrors(newErrors);
    setLoading(false);
  }, [activeCategory, location]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Wishlist
  const handleWishlist = (productId) => {
    setWishlist((previous) =>
      previous.includes(productId)
        ? previous.filter((id) => id !== productId)
        : [...previous, productId]
    );
  };

  // Add to cart
  const handleAddToCart = async (product) => {
    try {
      setCartLoading(product._id);
      setCartMessage("");

      await addProductToCart(product._id);

      setCartMessage(`${product.name} added to cart!`);

      window.dispatchEvent(new CustomEvent("cart-updated"));
    } catch (error) {
      setCartMessage(error.message || "Unable to add product.");
    } finally {
      setCartLoading(null);
    }
  };

  // View all products
  const handleViewAll = (section) => {
    navigate(`/products?section=${section}`);
  };

  return (
    <div className="space-y-12 py-8">

      <ProductDebug
  products={products}
  loading={loading}
  errors={errors}
/>

      {/* Temporary fetch status */}
      <div className="mx-4 rounded-lg bg-gray-100 p-3 text-sm">
        <p>
          Status: {loading ? "Loading products..." : "Loaded"}
        </p>

        <p>
          Total loaded:{" "}
          {Object.values(products).reduce(
            (total, items) => total + items.length,
            0
          )}
        </p>
      </div>

      {/* Category Filter */}
      <div className="px-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-3">
          {["all", "groceries", "vegetables", "fruits", "daily"].map(
            (category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
                  activeCategory === category
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-green-100"
                }`}
              >
                {category === "all" ? "All Products" : category}
              </button>
            )
          )}
        </div>
      </div>

      {/* Location */}
      <div className="mx-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-green-50 p-4">

        <div>
          <h3 className="font-bold text-green-950">
            📍 Find products near you
          </h3>

          <p className="mt-1 text-sm text-gray-600">
            Discover products available in your area.
          </p>

          {locationMessage && (
            <p className="mt-2 text-xs text-orange-700">
              {locationMessage}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={getCustomerLocation}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white"
        >
          {location ? "Refresh Location" : "Find Near Me"}
        </button>
      </div>

      {/* Product Sections */}
      {SECTIONS.map((section) => {
        const sectionProducts = products[section.id] || [];

        return (
          <section key={section.id} className="px-4">

            {/* Header */}
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 sm:text-2xl">
                  {section.icon} {section.title}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {section.subtitle}
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleViewAll(section.id)}
                className="shrink-0 text-sm font-bold text-green-600"
              >
                View All →
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="h-56 animate-pulse rounded-xl bg-gray-100"
                  />
                ))}
              </div>
            )}

            {/* Error */}
            {!loading && errors[section.id] && (
              <div className="rounded-xl bg-red-50 p-5 text-center">
                <p className="text-sm text-red-700">
                  {errors[section.id]}
                </p>

                <button
                  type="button"
                  onClick={loadProducts}
                  className="mt-3 font-bold text-red-700 underline"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Empty */}
            {!loading &&
              !errors[section.id] &&
              sectionProducts.length === 0 && (
                <div className="rounded-xl bg-gray-50 py-10 text-center">
                  <p className="text-gray-500">
                    {section.id === "nearby" && !location
                      ? "Enable location to discover nearby products."
                      : "No products available right now."}
                  </p>
                </div>
              )}

            {/* Product Cards */}
            {!loading && sectionProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">

                {sectionProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="cursor-pointer"
                  >
                    <div onClick={(event) => event.stopPropagation()}>
                      <ProductCard
                        product={product}
                        onAddToCart={handleAddToCart}
                        onWishlist={handleWishlist}
                        wishlist={wishlist}
                        cartLoading={cartLoading}
                      />
                    </div>
                  </div>
                ))}

              </div>
            )}

          </section>
        );
      })}

      {/* Cart Message */}
      {cartMessage && (
        <div
          role="status"
          className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white shadow-xl"
        >
          {cartMessage}
        </div>
      )}

    </div>
  );
};

export default ProductSections;
