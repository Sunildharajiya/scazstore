const formatPrice = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "—";
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(amount);
};

const ProductCard = ({
  product,
  onAddToCart,
  onWishlist,
  wishlist = [],
  cartLoading,
}) => {
  if (!product) return null;

  const productId = product._id || product.id;
  const image = product.images?.[0]?.url || product.image?.url || product.image || "";
  const price = Number(product.price ?? 0);
  const compareAtPrice = Number(
    product.compareAtPrice ?? product.originalPrice ?? 0
  );
  const discount = compareAtPrice > price && compareAtPrice > 0
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : Number(product.discount || 0);
  const isWishlisted = wishlist.includes(productId);
  const hasStockInformation = product.stock !== undefined && product.stock !== null;
  const isOutOfStock = hasStockInformation && Number(product.stock) <= 0;
  const rating = typeof product.rating === "object"
    ? product.rating.average
    : product.rating;
  const reviewCount = product.rating?.count ?? product.reviews ?? 0;

  return (
    <article className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex h-36 items-center justify-center overflow-hidden bg-gray-50 sm:h-48">
        {image ? (
          <img
            src={image}
            alt={product.name || "Product"}
            loading="lazy"
            onError={(event) => { event.currentTarget.style.display = "none"; }}
            className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
          />
        ) : (
          <span className="px-3 text-center text-xs text-gray-400">Image not available</span>
        )}

        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
            {discount}% OFF
          </span>
        )}

        {onWishlist && productId && (
          <button
            type="button"
            onClick={() => onWishlist(productId)}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWishlisted}
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
          >
            <span className={isWishlisted ? "text-red-500" : "text-gray-500"}>
              {isWishlisted ? "♥" : "♡"}
            </span>
          </button>
        )}
      </div>

      <div className="flex flex-1 flex-col p-3">
        <p className="mb-1 text-xs capitalize text-gray-400">{product.category || "General"}</p>
        <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-gray-800">
          {product.name || "Unnamed product"}
        </h3>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="text-base font-extrabold text-green-700">₹{formatPrice(price)}</span>
          {compareAtPrice > price && (
            <span className="text-xs text-gray-400 line-through">₹{formatPrice(compareAtPrice)}</span>
          )}
        </div>

        {product.unit && <p className="mt-1 text-xs text-gray-400">Per {product.unit}</p>}

        {rating != null && rating !== "" && (
          <p className="mt-2 text-xs text-yellow-600">
            ★ {Number(rating).toFixed(1)}
            <span className="text-gray-400"> ({reviewCount} reviews)</span>
          </p>
        )}

        <button
          type="button"
          disabled={!onAddToCart || !productId || cartLoading === productId || isOutOfStock}
          onClick={() => onAddToCart?.(product)}
          className="mt-auto w-full rounded-lg bg-green-600 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:mt-3 sm:text-sm"
        >
          {isOutOfStock
            ? "Out of Stock"
            : !onAddToCart
            ? "Cart Coming Soon"
            : cartLoading === productId
            ? "Adding..."
            : "+ Add to Cart"}
        </button>
      </div>
    </article>
  );
};

export default ProductCard;
