import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getOffers,
  trackOfferClick,
} from "../../services/offersApi";

const filters = [
  "All",
  "Groceries",
  "Vegetables",
  "Fruits",
  "Daily Needs"
];

const OfferCard = ({ offer, onClick }) => {
  const [copied, setCopied] = useState(false);

  const copyCoupon = async () => {
    if (!offer.couponCode) return;

    try {
      await navigator.clipboard.writeText(offer.couponCode);
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const discount =
    offer.discountType === "percentage"
      ? `${offer.discountValue}% OFF`
      : offer.discountType === "flat"
      ? `₹${offer.discountValue} OFF`
      : offer.title;

  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Offer Image */}
      <div className="relative h-44 overflow-hidden bg-green-50 sm:h-52">

        <img
          src={offer.image || "/images/offer-placeholder.webp"}
          alt={offer.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        {/* Sponsored Badge */}
        {offer.type === "shop" && (
          <span className="absolute left-3 top-3 rounded-md bg-black/75 px-3 py-1 text-xs font-semibold text-white">
            Sponsored
          </span>
        )}

        {offer.type === "platform" && (
          <span className="absolute left-3 top-3 rounded-md bg-green-600 px-3 py-1 text-xs font-semibold text-white">
            ScazStore Exclusive
          </span>
        )}

        {/* Discount */}
        <span className="absolute bottom-3 right-3 rounded-lg bg-red-500 px-3 py-2 text-sm font-black text-white shadow">
          {discount}
        </span>

      </div>

      {/* Offer Details */}
      <div className="p-4">

        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-green-600">
            {offer.category || "Special Offer"}
          </span>

          {offer.shopName && (
            <span className="truncate text-xs text-gray-500">
              {offer.shopName}
            </span>
          )}
        </div>

        <h3 className="text-lg font-extrabold text-gray-900">
          {offer.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-10 text-sm text-gray-500">
          {offer.description}
        </p>

        {/* Minimum Purchase */}
        {offer.minimumPurchase > 0 && (
          <p className="mt-3 text-xs text-gray-500">
            Minimum purchase: ₹{offer.minimumPurchase}
          </p>
        )}

        {/* Coupon */}
        {offer.couponCode && (
          <div className="mt-4 flex items-center justify-between gap-2 rounded-lg border border-dashed border-green-400 bg-green-50 p-3">

            <div>
              <p className="text-[10px] font-semibold uppercase text-gray-500">
                Coupon Code
              </p>

              <p className="font-extrabold tracking-wider text-green-800">
                {offer.couponCode}
              </p>
            </div>

            <button
              onClick={copyCoupon}
              className="rounded-md bg-green-600 px-3 py-2 text-xs font-bold text-white hover:bg-green-700"
            >
              {copied ? "Copied!" : "Copy"}
            </button>

          </div>
        )}

        {/* Expiry */}
        {offer.validUntil && (
          <p className="mt-3 text-xs text-orange-600">
            Valid until:{" "}
            {new Date(offer.validUntil).toLocaleDateString("en-IN")}
          </p>
        )}

        {/* Action */}
        <button
          onClick={() => onClick(offer)}
          className="mt-4 w-full rounded-xl bg-green-600 py-3 text-sm font-bold text-white transition hover:bg-green-700 active:scale-95"
        >
          Explore Offer →
        </button>

      </div>
    </article>
  );
};

const OffersPage = () => {
  const navigate = useNavigate();

  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [activeType, setActiveType] = useState("all");
  const [activeCategory, setActiveCategory] = useState("all");
  const [search, setSearch] = useState("");

  const loadOffers = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getOffers({
        type: activeType,
        category: activeCategory,
        search,
      });

      setOffers(data);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [activeType, activeCategory, search]);

  useEffect(() => {
    const timer = setTimeout(loadOffers, 300);

    return () => clearTimeout(timer);
  }, [loadOffers]);

  // Separate shop and platform offers
  const shopOffers = offers.filter(
    (offer) => offer.type === "shop"
  );

  const platformOffers = offers.filter(
    (offer) => offer.type === "platform"
  );

  // Offer click handler
  const handleOfferClick = async (offer) => {
    try {
      await trackOfferClick(offer._id);
    } catch (err) {
      console.error("Offer tracking failed:", err);
    }

    if (offer.redirectUrl) {
      // Only allow trusted web URLs.
      try {
        const url = new URL(offer.redirectUrl);

        if (["https:", "http:"].includes(url.protocol)) {
          window.location.assign(url.href);
          return;
        }
      } catch {
        // Fall back to the product page.
      }
    }

    if (offer.productId) {
      navigate(`/product/${offer.productId}`);
    } else if (offer.shopId) {
      navigate(`/shop/${offer.shopId}`);
    } else {
      navigate("/products");
    }
  };

  const renderSection = (title, subtitle, items, icon) => (
    <section className="mb-12">

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            {icon} {title}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {subtitle}
          </p>
        </div>

        <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-bold text-green-700">
          {items.length} Offers
        </span>
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {items.map((offer) => (
            <OfferCard
              key={offer._id}
              offer={offer}
              onClick={handleOfferClick}
            />
          ))}

        </div>
      ) : (
        <div className="rounded-2xl bg-gray-50 py-10 text-center">
          <p className="text-gray-500">
            No offers available right now.
          </p>
        </div>
      )}

    </section>
  );

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero */}
      <section className="bg-gradient-to-r from-green-800 to-green-500 px-4 py-14 text-white sm:py-20">

        <div className="mx-auto max-w-7xl">

          <span className="rounded-full bg-white/20 px-4 py-2 text-xs font-bold uppercase tracking-wider">
            ScazStore Special Deals
          </span>

          <h1 className="mt-5 text-3xl font-black sm:text-5xl">
            Offers & Deals
          </h1>

          <p className="mt-4 max-w-xl text-sm text-green-50 sm:text-base">
            Discover exclusive shop promotions, platform discounts
            and special deals. Save more on your everyday shopping!
          </p>

        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">

        {/* Search */}
        <div className="mb-6">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search offers, shops or coupons..."
            className="w-full rounded-xl border border-gray-200 bg-white px-5 py-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />
        </div>

        {/* Offer Type Filters */}
        <div className="mb-5 flex gap-3 overflow-x-auto pb-2">

          {[
            { id: "all", label: "All Offers" },
            { id: "shop", label: "Shop Offers" },
            { id: "platform", label: "Platform Offers" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveType(filter.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${
                activeType === filter.id
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-600 hover:bg-green-50"
              }`}
            >
              {filter.label}
            </button>
          ))}

        </div>

        {/* Category Filters */}
        <div className="mb-8 flex gap-2 overflow-x-auto pb-2">

          {filters.map((category) => (
            <button
              key={category}
              onClick={() =>
                setActiveCategory(
                  category === "All"
                    ? "all"
                    : category.toLowerCase()
                )
              }
              className={`shrink-0 rounded-lg border px-4 py-2 text-xs font-semibold transition ${
                activeCategory ===
                (category === "All" ? "all" : category.toLowerCase())
                  ? "border-green-600 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-600"
              }`}
            >
              {category}
            </button>
          ))}

        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl bg-white"
              >
                <div className="h-48 bg-gray-200" />
                <div className="space-y-3 p-4">
                  <div className="h-4 rounded bg-gray-200" />
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                  <div className="h-10 rounded bg-gray-200" />
                </div>
              </div>
            ))}

          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-50 p-8 text-center">
            <p className="font-semibold text-red-700">{error}</p>

            <button
              onClick={loadOffers}
              className="mt-4 rounded-lg bg-red-600 px-5 py-2 text-white"
            >
              Retry
            </button>
          </div>
        )}

        {/* Offers */}
        {!loading && !error && (
          <>
            {(activeType === "all" || activeType === "shop") &&
              renderSection(
                "Shop Sponsored Offers",
                "Exclusive promotions from participating shops.",
                shopOffers,
                "🏪"
              )}

            {(activeType === "all" || activeType === "platform") &&
              renderSection(
                "ScazStore Platform Offers",
                "Special discounts and deals from ScazStore.",
                platformOffers,
                "🎉"
              )}
          </>
        )}

      </div>
    </main>
  );
};

export default OffersPage;