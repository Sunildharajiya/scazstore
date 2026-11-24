import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";

import ProductCard from "../../components/cards/productCard.jsx";
import { getCategoryProducts } from "../../services/productApi.js";

const CATEGORY_LABELS = {
  products: "All Products",
  groceries: "Groceries",
  vegetables: "Fresh Vegetables",
  fruits: "Fresh Fruits",
  "daily-needs": "Daily Needs",
  electronics: "Electronics",
  "personal-care": "Personal Care",
};

const CategoryPage = () => {
  const { slug = "products" } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const title = CATEGORY_LABELS[slug] || "Products";
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(() => searchParams.get("search") || "");
  const [submittedSearch, setSubmittedSearch] = useState(() => searchParams.get("search") || "");
  const [sort, setSort] = useState("newest");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlist, setWishlist] = useState([]);

  const category = useMemo(() => slug === "products" ? "" : slug, [slug]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getCategoryProducts({
        category,
        search: submittedSearch,
        sort,
        page,
        limit: 12,
      });

      setProducts(result.products);
      setTotalPages(result.totalPages);
      setTotalProducts(result.totalProducts || result.products.length);
    } catch (err) {
      setProducts([]);
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  }, [category, page, sort, submittedSearch]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSubmittedSearch(search.trim());
    if (search.trim()) setSearchParams({ search: search.trim() });
    else setSearchParams({});
  };

  const toggleWishlist = (productId) => {
    setWishlist((current) => current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    );
  };

  return (
    <main className="mx-auto min-h-[60vh] max-w-7xl px-4 py-8 sm:px-6">
      <header className="mb-7">
        <p className="text-sm font-bold uppercase tracking-wider text-green-700">Explore ScazStore</p>
        <h1 className="mt-1 text-3xl font-black text-gray-900">{title}</h1>
        <p className="mt-2 text-sm text-gray-500">Find the products you need for every day.</p>
      </header>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row">
        <form onSubmit={handleSearch} className="flex min-w-0 flex-1 gap-2">
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${title.toLowerCase()}...`}
            aria-label="Search products"
            className="min-w-0 flex-1 rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-600"
          />
          <button type="submit" className="rounded-lg bg-green-600 px-5 py-3 font-bold text-white hover:bg-green-700">Search</button>
        </form>

        <label className="flex items-center gap-2 text-sm text-gray-600">
          <span>Sort by</span>
          <select
            value={sort}
            onChange={(event) => { setSort(event.target.value); setPage(1); }}
            className="rounded-lg border border-gray-200 bg-white px-3 py-3 outline-none focus:border-green-600"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to high</option>
            <option value="price-high">Price: High to low</option>
            <option value="name">Name</option>
          </select>
        </label>
      </div>

      <div className="mb-4 flex items-center justify-between text-sm text-gray-500">
        <span>{totalProducts} products</span>
        <button type="button" onClick={loadProducts} disabled={loading} className="font-semibold text-green-700 disabled:opacity-50">
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error ? (
        <div className="rounded-xl border border-red-100 bg-red-50 p-6 text-center text-red-700">
          <p>{error}</p>
          <button type="button" onClick={loadProducts} className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-white">Try again</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => <div key={index} className="h-64 animate-pulse rounded-xl bg-gray-100" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-xl bg-gray-50 px-4 py-16 text-center">
          <p className="text-lg font-bold text-gray-800">No products found</p>
          <p className="mt-2 text-sm text-gray-500">Try another search or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product._id || index}
              product={product}
              wishlist={wishlist}
              onWishlist={toggleWishlist}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Product pages" className="mt-8 flex items-center justify-center gap-4">
          <button type="button" disabled={page <= 1 || loading} onClick={() => setPage((current) => current - 1)} className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
          <button type="button" disabled={page >= totalPages || loading} onClick={() => setPage((current) => current + 1)} className="rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40">Next</button>
        </nav>
      )}
    </main>
  );
};

export default CategoryPage;
