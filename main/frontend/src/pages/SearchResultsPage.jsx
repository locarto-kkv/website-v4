// src/pages/SearchResultsPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import { ConsumerSearchService } from "../services/consumer/consumerSearchService.js";
import { ConsumerListService } from "../services/consumer/consumerListService.js";
import { useConsumerDataStore } from "../store/consumer/consumerDataStore.jsx";
import { useAuthStore } from "../store/useAuthStore.jsx";
import { formatCurrency } from "../lib/utils.js";
import SearchIcon from "../components/SearchIcon.jsx";
import toast from "react-hot-toast";

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const navigate = useNavigate();

  // --- Global Store & Auth ---
  const currentUser = useAuthStore((s) => s.currentUser);
  const lists = useConsumerDataStore((s) => s.lists);
  const vendorInCart = useConsumerDataStore((s) => s.vendorInCart);
  const { updateList, removeFromList } = ConsumerListService;

  const cart = lists?.cart || [];
  const wishlist = lists?.wishlist || [];

  // --- Local State ---
  const [query, setQuery] = useState(queryParam);
  const [results, setResults] = useState({ products: [], vendors: [] });
  const [loading, setLoading] = useState(true);

  // Filter & Sort State
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState("relevance");

  // Mobile UI State
  const [showMobileSort, setShowMobileSort] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  // --- Effects ---

  // Sync local query state
  useEffect(() => {
    setQuery(queryParam);
  }, [queryParam]);

  // Fetch Results
  useEffect(() => {
    const fetchResults = async () => {
      if (!queryParam) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const data = await ConsumerSearchService.getSimilarResults(queryParam);
        setResults(data || { products: [], vendors: [] });
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [queryParam]);

  // --- Handlers ---

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const showAuthToast = () => {
    toast(
      (t) => (
        <div className="flex flex-col gap-2 items-start">
          <span className="font-medium text-gray-800">
            Not signed in as customer
          </span>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              navigate("/consumer/login", {
                state: {
                  isSignup: true,
                  from: window.location.pathname + window.location.search,
                },
              });
            }}
            className="px-3 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
          >
            Sign Up as Customer
          </button>
        </div>
      ),
      {
        duration: 5000,
        icon: "🔒",
        style: {
          background: "#fff",
          color: "#333",
          border: "1px solid #e5e7eb",
        },
      }
    );
  };

  const toggleWishlist = async (e, product) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentUser?.type !== "consumer") {
      showAuthToast();
      return;
    }

    const isInWishlist = wishlist.some(
      (item) => item.product_id === product.id
    );
    try {
      if (isInWishlist) {
        const newList = await removeFromList("wishlist", product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
        }));
        toast.success("Removed from wishlist");
      } else {
        const newList = await updateList("wishlist", 1, product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
        }));
        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      toast.error("Failed to update wishlist");
    }
  };

  const handleCartChange = async (e, product, delta) => {
    e.preventDefault();
    e.stopPropagation();

    if (currentUser?.type !== "consumer") {
      showAuthToast();
      return;
    }

    const cartItem = cart.find((item) => item.id === product.id);
    const currentQty = cartItem?.quantity || 0;
    const newQty = currentQty + delta;
    const vendorId = product.vendor_id;

    if (vendorInCart && vendorId !== vendorInCart && !cartItem) {
      toast.error(
        "You can only add items from one brand at a time. Please clear your cart first."
      );
      return;
    }

    try {
      if (newQty <= 0) {
        const newList = await removeFromList("cart", product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
          vendorInCart: newList.cart ? state.vendorInCart : null,
        }));
        if (currentQty > 0) toast.success("Removed from cart");
      } else {
        const newList = await updateList("cart", newQty, product.id);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
          vendorInCart: vendorId,
        }));
        if (delta > 0 && currentQty === 0) toast.success("Added to cart");
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      toast.error("Failed to update cart");
    }
  };

  // --- Filtering & Sorting Logic ---

  const processedProducts = useMemo(() => {
    let filtered = [...results.products];

    // Category Filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Price Filter
    if (priceRange !== "all") {
      filtered = filtered.filter((p) => {
        const price = Number(p.price) || 0;
        if (priceRange === "0-500") return price < 500;
        if (priceRange === "500-1000") return price >= 500 && price <= 1000;
        if (priceRange === "1000-2500") return price > 1000 && price <= 2500;
        if (priceRange === "2500+") return price > 2500;
        return true;
      });
    }

    // Rating Filter
    if (minRating > 0) {
      filtered = filtered.filter(
        (p) => (Number(p.avg_review) || 0) >= minRating
      );
    }

    // Sorting
    if (sortBy === "price_low") {
      filtered.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price_high") {
      filtered.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "rating") {
      filtered.sort((a, b) => Number(b.avg_review) - Number(a.avg_review));
    }

    return filtered;
  }, [results.products, selectedCategory, priceRange, minRating, sortBy]);

  const processedVendors = results.vendors;
  const totalResults = results.products.length + results.vendors.length;
  const showProducts = activeTab === "all" || activeTab === "products";
  const showVendors = activeTab === "all" || activeTab === "brands";

  // Reusable Filter Content
  const FilterContent = () => (
    <>
      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Category</h4>
        <div className="space-y-2">
          {["all", "Personal Care", "Accessories"].map((cat) => (
            <label
              key={cat}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => setSelectedCategory(cat)}
                className="text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span
                className={`text-sm ${
                  selectedCategory === cat
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 group-hover:text-gray-800"
                }`}
              >
                {cat === "all" ? "All Categories" : cat}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Price</h4>
        <div className="space-y-2">
          {[
            { val: "all", label: "Any Price" },
            { val: "0-500", label: "Under ₹500" },
            { val: "500-1000", label: "₹500 - ₹1000" },
            { val: "1000-2500", label: "₹1000 - ₹2500" },
            { val: "2500+", label: "Over ₹2500" },
          ].map((opt) => (
            <label
              key={opt.val}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="price"
                checked={priceRange === opt.val}
                onChange={() => setPriceRange(opt.val)}
                className="text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span
                className={`text-sm ${
                  priceRange === opt.val
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 group-hover:text-gray-800"
                }`}
              >
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">Rating</h4>
        <div className="space-y-2">
          {[4, 3, 2].map((r) => (
            <label
              key={r}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className="text-orange-500 focus:ring-orange-500 border-gray-300"
              />
              <span
                className={`text-sm flex items-center gap-1 ${
                  minRating === r
                    ? "text-gray-900 font-semibold"
                    : "text-gray-600 group-hover:text-gray-800"
                }`}
              >
                {r}+ <i className="fas fa-star text-yellow-400 text-xs"></i>
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="rating"
              checked={minRating === 0}
              onChange={() => setMinRating(0)}
              className="text-orange-500 focus:ring-orange-500 border-gray-300"
            />
            <span
              className={`text-sm ${
                minRating === 0
                  ? "text-gray-900 font-semibold"
                  : "text-gray-600 group-hover:text-gray-800"
              }`}
            >
              Any Rating
            </span>
          </label>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 font-sans text-[#0D1539]">
      <Navbar />

      <main className="flex-grow container mx-auto px-2 lg:px-4 py-6 pt-24 max-w-7xl pb-24">
        {/* --- TOP SECTION: Search Bar --- */}
        <div className="mb-6 lg:mb-8 max-w-3xl mx-auto px-2 lg:px-0">
          <form onSubmit={handleSearchSubmit} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
            <div className="relative bg-white rounded-full shadow-lg flex items-center p-1 border border-gray-100">
              <div className="pl-4 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands..."
                className="flex-grow px-4 py-2.5 lg:py-3 rounded-full focus:outline-none text-gray-700 font-medium placeholder-gray-400 text-sm lg:text-base"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 lg:px-6 py-2 lg:py-2.5 rounded-full font-bold shadow-md hover:shadow-lg transform hover:scale-105 transition-all text-xs lg:text-sm"
              >
                Search
              </button>
            </div>
          </form>
        </div>

        {/* --- MAIN LAYOUT --- */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* LEFT SIDEBAR: Filters (Desktop) */}
          {!loading && results.products.length > 0 && (
            <aside className="hidden lg:block w-64 flex-shrink-0 space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sticky top-24">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setPriceRange("all");
                      setMinRating(0);
                    }}
                    className="text-xs text-orange-600 font-semibold hover:underline"
                  >
                    Clear All
                  </button>
                </div>
                <FilterContent />
              </div>
            </aside>
          )}

          {/* RIGHT SIDE: Results Content */}
          <div className="flex-1">
            {/* Header: Tabs & Sorting (Desktop) */}
            {!loading && totalResults > 0 && (
              <div className="hidden lg:flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex gap-2 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "all"
                        ? "bg-orange-50 text-orange-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    All Results
                  </button>
                  <button
                    onClick={() => setActiveTab("products")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "products"
                        ? "bg-orange-50 text-orange-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Products ({results.products.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("brands")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeTab === "brands"
                        ? "bg-orange-50 text-orange-700"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    Brands ({results.vendors.length})
                  </button>
                </div>

                {showProducts && (
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 border border-gray-200 rounded-xl bg-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-700 cursor-pointer shadow-sm hover:border-gray-300"
                  >
                    <option value="relevance">Sort by: Relevance</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                )}
              </div>
            )}

            {/* Results Grid */}
            {loading ? (
              <div className="min-h-[50vh] flex flex-col items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
                <div className="relative">
                  <div className="animate-spin rounded-full h-12 w-12 lg:h-16 lg:w-16 border-4 border-gray-200 border-t-orange-500"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="fas fa-search text-orange-500 text-lg lg:text-xl"></i>
                  </div>
                </div>
                <p className="text-gray-600 mt-6 font-medium animate-pulse text-sm lg:text-base">
                  Searching the marketplace...
                </p>
              </div>
            ) : totalResults === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                <div className="max-w-md mx-auto px-4">
                  <div className="text-6xl mb-6">🔍</div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-3">
                    No results found
                  </h2>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    We couldn't find matches for{" "}
                    <span className="font-semibold text-gray-900">
                      "{queryParam}"
                    </span>
                    .
                  </p>
                  <Link
                    to="/map"
                    className="inline-flex items-center justify-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-orange-700 transition-all"
                  >
                    Browse Categories
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* VENDORS SECTION */}
                {showVendors && processedVendors.length > 0 && (
                  <div className="animate-fadeIn">
                    {activeTab === "all" && (
                      <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg lg:text-xl font-bold text-gray-800">
                          Brands
                        </h2>
                      </div>
                    )}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                      {processedVendors.map((vendor) => (
                        <Link
                          key={vendor.id}
                          to={`/vendor/${vendor.id}/products/all`}
                          className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all border border-gray-100 flex items-center gap-4 group hover:-translate-y-1"
                        >
                          <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0 bg-gray-50">
                            <img
                              src={
                                vendor.brand_logo_1 ||
                                "https://placehold.co/100x100?text=Logo"
                              }
                              alt={vendor.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex-grow min-w-0">
                            <h3 className="font-bold text-gray-900 truncate">
                              {vendor.name}
                            </h3>
                            <p className="text-xs text-gray-500 truncate">
                              {vendor.email}
                            </p>
                          </div>
                          <i className="fas fa-chevron-right text-gray-300 group-hover:text-orange-500"></i>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* PRODUCTS SECTION */}
                {showProducts && processedProducts.length > 0 && (
                  <div className="animate-fadeIn">
                    {activeTab === "all" && (
                      <div className="flex items-center justify-between mb-4 px-1">
                        <h2 className="text-lg lg:text-xl font-bold text-gray-800">
                          Products
                        </h2>
                      </div>
                    )}
                    {/* MODIFIED: Mobile optimized grid */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-2 md:gap-4 lg:gap-6">
                      {processedProducts.map((product) => {
                        const cartItem = cart.find(
                          (item) => item.id === product.id
                        );
                        const quantity = cartItem?.quantity || 0;
                        const isInWishlist = wishlist.some(
                          (item) => item.product_id === product.id
                        );

                        return (
                          <Link
                            key={product.id}
                            to={`/product/${product.product_uuid}`}
                            className="group bg-white rounded-xl lg:rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full hover:-translate-y-1"
                          >
                            {/* Mobile aspect ratio 3/4, desktop 4/3 or square */}
                            <div className="relative aspect-[3/4] lg:aspect-[4/3] bg-gray-100 overflow-hidden">
                              <img
                                src={
                                  product.product_images?.[0]?.url ||
                                  "https://placehold.co/400x300?text=No+Image"
                                }
                                alt={product.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              />

                              <button
                                onClick={(e) => toggleWishlist(e, product)}
                                className={`absolute top-2 right-2 lg:top-3 lg:right-3 p-1.5 lg:p-2 rounded-full shadow-md transition-all z-10 ${
                                  isInWishlist
                                    ? "bg-white text-red-500"
                                    : "bg-black/40 text-white hover:bg-white hover:text-red-500"
                                }`}
                              >
                                <i
                                  className={`${
                                    isInWishlist ? "fas" : "far"
                                  } fa-heart text-sm lg:text-lg`}
                                ></i>
                              </button>

                              {/* Price Badge - Compact on mobile */}
                              <div className="absolute bottom-2 left-2 lg:bottom-3 lg:left-3 bg-white/95 backdrop-blur-md px-2 py-0.5 lg:px-3 lg:py-1 rounded-md lg:rounded-lg shadow-sm">
                                <span className="font-bold text-gray-900 text-xs lg:text-base">
                                  {formatCurrency(product.price)}
                                </span>
                              </div>
                            </div>

                            <div className="p-3 lg:p-4 flex flex-col flex-grow">
                              <div className="flex justify-between items-start mb-1 lg:mb-2">
                                <h3 className="font-bold text-gray-900 text-xs lg:text-base line-clamp-1 lg:line-clamp-2 leading-snug group-hover:text-orange-600 transition-colors">
                                  {product.name}
                                </h3>
                              </div>

                              <p className="text-[10px] lg:text-xs text-gray-500 mb-2 lg:mb-4 line-clamp-1 lg:line-clamp-2 flex-grow">
                                {product.description ||
                                  "No description available"}
                              </p>

                              <div className="pt-2 lg:pt-3 border-t border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-1 text-yellow-400 text-[10px] lg:text-xs">
                                  <i className="fas fa-star"></i>
                                  <span className="font-bold text-gray-700 text-xs lg:text-sm">
                                    {product.avg_review || "0.0"}
                                  </span>
                                </div>

                                {/* Add to Cart / Quantity Logic - Compact for mobile */}
                                {quantity > 0 ? (
                                  <div className="flex items-center gap-1 lg:gap-2 bg-gray-100 rounded-lg p-0.5 lg:p-1">
                                    <button
                                      onClick={(e) =>
                                        handleCartChange(e, product, -1)
                                      }
                                      className="w-5 h-5 lg:w-7 lg:h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-red-500 transition-colors"
                                    >
                                      <i className="fas fa-minus text-[8px] lg:text-xs"></i>
                                    </button>
                                    <span className="text-xs lg:text-sm font-bold w-3 lg:w-4 text-center">
                                      {quantity}
                                    </span>
                                    <button
                                      onClick={(e) =>
                                        handleCartChange(e, product, 1)
                                      }
                                      className="w-5 h-5 lg:w-7 lg:h-7 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-green-500 transition-colors"
                                    >
                                      <i className="fas fa-plus text-[8px] lg:text-xs"></i>
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) =>
                                      handleCartChange(e, product, 1)
                                    }
                                    className="bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white px-2 py-1 lg:px-4 lg:py-2 rounded-lg text-[10px] lg:text-sm font-bold transition-all flex items-center gap-1 lg:gap-2"
                                  >
                                    <i className="fas fa-shopping-cart text-[10px] lg:text-xs"></i>
                                    <span className="hidden lg:inline">
                                      Add
                                    </span>
                                  </button>
                                )}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* --- MOBILE STICKY SORT & FILTER BAR --- */}
      <div className="lg:hidden fixed bottom-[64px] left-0 right-0 z-30 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex h-12">
        <button
          onClick={() => setShowMobileSort(true)}
          className="flex-1 flex items-center justify-center gap-2 border-r border-gray-200 text-sm font-bold text-gray-700 active:bg-gray-50"
        >
          <i className="fas fa-sort text-gray-500"></i> Sort
        </button>
        <button
          onClick={() => setShowMobileFilter(true)}
          className="flex-1 flex items-center justify-center gap-2 text-sm font-bold text-gray-700 active:bg-gray-50"
        >
          <i className="fas fa-filter text-gray-500"></i> Filter
        </button>
      </div>

      {/* --- MOBILE SORT MODAL (Bottom Sheet) --- */}
      {showMobileSort && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-50 transition-opacity"
            onClick={() => setShowMobileSort(false)}
          ></div>
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-2xl overflow-hidden animate-slide-up pb-6">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-bold text-lg text-gray-800">Sort By</h3>
              <button onClick={() => setShowMobileSort(false)}>
                <i className="fas fa-times text-gray-500 text-lg"></i>
              </button>
            </div>
            <div className="py-2">
              {[
                { value: "relevance", label: "Relevance" },
                { value: "price_low", label: "Price: Low to High" },
                { value: "price_high", label: "Price: High to Low" },
                { value: "rating", label: "Top Rated" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setSortBy(opt.value);
                    setShowMobileSort(false);
                  }}
                  className={`w-full text-left px-5 py-3.5 text-sm font-medium flex justify-between items-center ${
                    sortBy === opt.value
                      ? "text-orange-600 bg-orange-50"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                  {sortBy === opt.value && <i className="fas fa-check"></i>}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* --- MOBILE FILTER MODAL (Full Screen) --- */}
      {showMobileFilter && (
        <div className="fixed inset-0 bg-white z-[60] flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-white">
            <h3 className="font-bold text-lg text-gray-800">Filters</h3>
            <button
              onClick={() => setShowMobileFilter(false)}
              className="p-2 -mr-2 text-gray-500"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-5">
            <FilterContent />
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-gray-200 flex gap-4 bg-white">
            <button
              onClick={() => {
                setSelectedCategory("all");
                setPriceRange("all");
                setMinRating(0);
              }}
              className="flex-1 py-3 border border-gray-300 rounded-xl font-bold text-gray-600 text-sm active:scale-95 transition-transform"
            >
              Clear All
            </button>
            <button
              onClick={() => setShowMobileFilter(false)}
              className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-transform"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      <Footer />
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default SearchResultsPage;