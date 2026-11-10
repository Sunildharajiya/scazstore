import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  addProductToCart,
} from "../../../services/productApi";

const SECTIONS = [
  {
    id: "popular",
    title: "Popular Products",
    subtitle: "Products everyone loves",
    icon: "🔥",
    limit: 8,
  },
  {
    id: "new",
    title: "New Arrivals",
    subtitle: "Discover what's new",
    icon: "✨",
    limit: 8,
  },
  {
    id: "daily",
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

  // Get customer location for nearby products
  const getCustomerLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Location is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationMessage("");
      },
      () => {
        setLocationMessage(
          "Enable location permission to find nearby products."
        );
      }
    );
  };

  // Fetch all homepage product sections
  const loadProducts = useCallback(async () => {
    setLoading(true);

    const results = await Promise.allSettled(
      SECTIONS.map(async (section) => {
        const result = await getProducts({
          section: section.id,
          limit: section.limit,
          category: activeCategory === "all" ? "" : activeCategory,
          ...(section.id === "nearby" && location
            ? location
            : {}),
        });

        return {
          id: section.id,
          products: result,
        };
      })
    );

    const newProducts = {};
    const newErrors = {};

    results.forEach((result, index) => {
      const sectionId = SECTIONS[index].id;

      if (result.status === "fulfilled") {
        newProducts[sectionId] = result.value.products;
      } else {
        newProducts[sectionId] = [];
        newErrors[sectionId] = result.reason?.message || "Something went wrong.";
      }
    });

    setProducts(newProducts);
    setErrors(newErrors);
    setLoading(false);
  }, [activeCategory, location]);

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      loadProducts();
    }, 0);

    return () => window.clearTimeout(timerId);
  }, [loadProducts]);

  // Add to wishlist
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

      window.dispatchEvent(
        new CustomEvent("cart-updated")
      );
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

      {/* Category Filter */}
      <div className="px-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-3">

          {["all", "groceries", "vegetables", "fruits", "daily"].map(
            (category) => (
              <button
                key={category}
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

      {/* Location Button */}
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
          onClick={getCustomerLocation}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700"
        >
          {location ? "Refresh Location" : "Find Near Me"}
        </button>
      </div>

      {/* Product Sections */}
      {SECTIONS.map((section) => {
        const sectionProducts = products[section.id] || [];

        return (
          <section key={section.id} className="px-4">

            {/* Section Header */}
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
                onClick={() => handleViewAll(section.id)}
                className="shrink-0 text-sm font-bold text-green-600 hover:text-green-800"
              >
                View All →
              </button>

            </div>

            {/* Loading */}
            {loading && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse overflow-hidden rounded-xl border border-gray-100"
                  >
                    <div className="h-36 bg-gray-200 sm:h-44" />
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
            {!loading && errors[section.id] && (
              <div className="rounded-xl bg-red-50 p-5 text-center">
                <p className="text-sm text-red-700">
                  {errors[section.id]}
                </p>

                <button
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
                    No products available right now.
                  </p>
                </div>
              )}

            {/* Product Grid */}
            {!loading && sectionProducts.length > 0 && (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">

                {sectionProducts.map((product) => (
                  <article
                    key={product._id}
                    className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >

                    {/* Product Image */}
                    <div
                      onClick={() => navigate(`/product/${product._id}`)}
                      className="relative flex h-36 cursor-pointer items-center justify-center overflow-hidden bg-gray-50 sm:h-48"
                    >

                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
                      />

                      {/* Discount Badge */}
                      {product.discount > 0 && (
                        <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
                          {product.discount}% OFF
                        </span>
                      )}

                      {/* Wishlist */}
                      <button
                        onClick={() => handleWishlist(product._id)}
                        aria-label="Toggle wishlist"
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
                      >
                        <span className={wishlist.includes(product._id) ? "text-red-500" : "text-gray-500"}>
                          {wishlist.includes(product._id) ? "♥" : "♡"}
                        </span>
                      </button>

                    </div>

                    {/* Product Details */}
                    <div className="p-3">

                      <p className="mb-1 text-xs text-gray-400">
                        {product.category}
                      </p>

                      <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-gray-800">
                        {product.name}
                      </h3>

                      {/* Price */}
                      <div className="mt-2 flex flex-wrap items-center gap-2">

                        <span className="text-base font-extrabold text-green-700">
                          ₹{product.price}
                        </span>

                        {product.originalPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}

                      </div>

                      {/* Rating */}
                      {product.rating != null && (
                        <p className="mt-2 text-xs text-yellow-600">
                          ★ {product.rating}
                          <span className="text-gray-400">
                            {" "}({product.reviews || 0} reviews)
                          </span>
                        </p>
                      )}

                      {/* Add To Cart */}
                      <button
                        disabled={
                          cartLoading === product._id ||
                          product.stock === 0
                        }
                        onClick={() => handleAddToCart(product)}
                        className="mt-3 w-full rounded-lg bg-green-600 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-sm"
                      >
                        {product.stock === 0
                          ? "Out of Stock"
                          : cartLoading === product._id
                          ? "Adding..."
                          : "+ Add to Cart"}
                      </button>

                    </div>

                  </article>
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