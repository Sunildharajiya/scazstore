
import React from "react";

const ProductCard = ({
  product,
  onAddToCart,
  onWishlist,
  wishlist = [],
  cartLoading,
}) => {
  if (!product) return null;

  const productId = product._id;

  const image =
    product.images?.[0]?.url ||
    product.image ||
    "/placeholder.png";

  const compareAtPrice = Number(product.compareAtPrice || 0);
  const price = Number(product.price || 0);

  const discount =
    compareAtPrice > price && compareAtPrice > 0
      ? Math.round(
          ((compareAtPrice - price) / compareAtPrice) * 100
        )
      : 0;

  const isWishlisted = wishlist.includes(productId);
  const isOutOfStock = Number(product.stock) <= 0;

  return (
    <article className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Product Image */}
      <div className="relative flex h-36 cursor-pointer items-center justify-center overflow-hidden bg-gray-50 sm:h-48">

        <img
          src={image}
          alt={product.name || "Product"}
          loading="lazy"
          onError={(event) => {
            event.currentTarget.src = "/placeholder.png";
          }}
          className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
        />

        {/* Discount */}
        {discount > 0 && (
          <span className="absolute left-2 top-2 rounded-md bg-red-500 px-2 py-1 text-xs font-bold text-white">
            {discount}% OFF
          </span>
        )}

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => onWishlist?.(productId)}
          aria-label="Toggle wishlist"
          className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow"
        >
          <span
            className={
              isWishlisted
                ? "text-red-500"
                : "text-gray-500"
            }
          >
            {isWishlisted ? "♥" : "♡"}
          </span>
        </button>
      </div>

      {/* Product Details */}
      <div className="p-3">

        <p className="mb-1 text-xs capitalize text-gray-400">
          {product.category}
        </p>

        <h3 className="line-clamp-2 min-h-10 text-sm font-bold text-gray-800">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-2 flex flex-wrap items-center gap-2">

          <span className="text-base font-extrabold text-green-700">
            ₹{price}
          </span>

          {compareAtPrice > price && (
            <span className="text-xs text-gray-400 line-through">
              ₹{compareAtPrice}
            </span>
          )}
        </div>

        {/* Unit */}
        {product.unit && (
          <p className="mt-1 text-xs text-gray-400">
            Per {product.unit}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <p className="mt-2 text-xs text-yellow-600">
            ★ {product.rating.average || 0}

            <span className="text-gray-400">
              {" "}({product.rating.count || 0} reviews)
            </span>
          </p>
        )}

        {/* Add To Cart */}
        <button
          type="button"
          disabled={cartLoading === productId || isOutOfStock}
          onClick={() => onAddToCart?.(product)}
          className="mt-3 w-full rounded-lg bg-green-600 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:bg-gray-400 sm:text-sm"
        >
          {isOutOfStock
            ? "Out of Stock"
            : cartLoading === productId
            ? "Adding..."
            : "+ Add to Cart"}
        </button>

      </div>
    </article>
  );
};

export default ProductCard;
