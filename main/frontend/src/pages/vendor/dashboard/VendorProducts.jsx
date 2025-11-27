// src/pages/vendor/dashboard/VendorProducts.jsx
import React, { useState, useEffect, useRef } from "react"; // Added useRef, useEffect
import { useNavigate } from "react-router-dom";
import { formatCurrency } from "../../../lib/utils.js";
import { VendorProductService } from "../../../services/vendor/vendorProductService.js";
import { useVendorDataStore } from "../../../store/vendor/vendorDataStore.jsx";
import { ConsumerProductService } from "../../../services/consumer/consumerProductService.js";
import { useAuthStore } from "../../../store/useAuthStore.jsx";

const VendorProducts = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  // --- NEW: State to track which dropdown is open ---
  const [activeMenuId, setActiveMenuId] = useState(null);
  const menuRef = useRef(null);

  const currentUser = useAuthStore((s) => s.currentUser);
  const fetchAnalytics = useVendorDataStore((s) => s.fetchAnalytics);

  const predefinedCategories = ["All", "Personal Care", "Accessories"];

  useEffect(() => {
    const fetchProducts = async () => {
      const products = await ConsumerProductService.getProductsByFilter({
        vendor_id: currentUser.id,
      });
      setProducts(products);
    };

    fetchProducts();
  }, []);

  // --- NEW: Handle clicking outside to close menu ---
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate to Form Page
  const handleAddProduct = () => {
    navigate("/vendor/dashboard/product/form", { state: { mode: "add" } });
  };

  const handleEditProduct = (product) => {
    navigate("/vendor/dashboard/product/form", {
      state: { mode: "edit", product },
    });
    setActiveMenuId(null);
  };

  // --- NEW: Handle Add Variant (Navigates to edit with intent) ---
  const handleAddVariant = (product) => {
    navigate("/vendor/dashboard/product/form", {
      state: { mode: "edit", product, focusVariants: true },
    });
    setActiveMenuId(null);
  };

  // --- NEW: Handle View Product ---
  const handleViewProduct = (product) => {
    navigate(`/product/${product.product_uuid}`);
    setActiveMenuId(null);
  };

  const handleDeleteProduct = async (productIdToDelete) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      setActiveMenuId(null);
      try {
        await VendorProductService.deleteProduct(productIdToDelete);
        await fetchAnalytics();
      } catch (error) {
        console.error("Error deleting product:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // --- Utility Functions ---
  const getStockStatus = (quantity) => {
    const qty = Number(quantity);
    if (qty === 0)
      return { text: "Out of Stock", class: "bg-red-100 text-red-800" };
    if (qty <= 5)
      return { text: "Low Stock", class: "bg-yellow-100 text-yellow-800" };
    if (qty <= 10)
      return { text: "Limited", class: "bg-orange-100 text-orange-800" };
    return { text: "In Stock", class: "bg-green-100 text-green-800" };
  };

  const getProductIcon = (category) => {
    const icons = {
      "Personal Care": "fas fa-spa",
      Accessories: "fas fa-gem",
      Default: "fas fa-box",
    };
    return icons[category] || icons["Default"];
  };

  // Filter and sort products
  const filteredProducts = (products || [])
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      const aVal = a?.[sortBy];
      const bVal = b?.[sortBy];

      switch (sortBy) {
        case "price":
          return (Number(aVal) || 0) - (Number(bVal) || 0);
        case "quantity":
          return (Number(bVal) || 0) - (Number(aVal) || 0);
        case "sales":
          return (Number(b.sales) || 0) - (Number(a.sales) || 0);
        default:
          return (aVal || "").toString().localeCompare((bVal || "").toString());
      }
    });

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={handleAddProduct}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
          >
            <i className="fas fa-plus text-xs sm:text-sm"></i>
            Add Product
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        {/* Category Tabs & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          {/* Category Tabs */}
          <div className="w-full overflow-x-auto pb-2 sm:pb-0">
            <div className="flex flex-nowrap sm:flex-wrap gap-2">
              {predefinedCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex-shrink-0 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold transition-all duration-300 text-xs sm:text-sm whitespace-nowrap ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-md"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {category}
                  {category !== "All" && (
                    <span className="ml-1.5 text-xs opacity-75">
                      (
                      {
                        (products || []).filter((p) => p.category === category)
                          .length
                      }
                      )
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-orange-100 text-orange-600"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
            />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-medium text-sm sm:text-base"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="quantity">Sort by Stock</option>
            <option value="sales">Sort by Sales</option>
          </select>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-box-open text-2xl sm:text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            {selectedCategory === "All"
              ? "No products yet"
              : `No products in ${selectedCategory}`}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
            {selectedCategory === "All"
              ? "Get started by adding your first product to showcase your offerings."
              : `Add products to the ${selectedCategory} category to see them here.`}
          </p>
          <button
            onClick={handleAddProduct}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <i className="fas fa-plus mr-2 text-xs sm:text-sm"></i>
            Add Your First Product
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.quantity);

            // --- List View Item (Simplified for brevity, can apply similar menu logic if needed) ---
            if (viewMode === "list") {
              return (
                <div
                  key={product.product_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                >
                  {/* ... List view content (you can add the menu here too if desired) ... */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      {product.product_images &&
                      product.product_images.length > 0 &&
                      product.product_images[0]?.url ? (
                        <img
                          src={product.product_images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <i
                          className={`${getProductIcon(
                            product.category
                          )} text-xl sm:text-2xl text-orange-600`}
                        ></i>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-1 sm:mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate mb-1 sm:mb-0">
                          {product.name}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${stockStatus.class} ml-0 sm:ml-4`}
                        >
                          {stockStatus.text}
                        </span>
                      </div>

                      <p className="text-gray-600 mb-2 sm:mb-3 line-clamp-2 text-sm">
                        {product.description}
                      </p>

                      <div className="flex flex-col sm:flex-row items-center justify-between">
                        <div className="flex items-center gap-4 sm:gap-6 mb-3 sm:mb-0">
                          <span className="text-xl sm:text-2xl font-black text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-500">
                            Stock: {product.quantity}
                          </span>
                        </div>
                        {/* List view actions can remain buttons or switch to menu */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-2 sm:p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm sm:text-base"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteProduct(product.product_id)
                            }
                            className="p-2 sm:p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                          >
                            <i className="fas fa-trash"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            // --- Grid View Item (MODIFIED SECTION) ---
            return (
              <div
                key={product.product_id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
              >
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  {product.product_images &&
                  product.product_images.length > 0 &&
                  product.product_images[0]?.url ? (
                    <img
                      src={product.product_images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  ) : (
                    <div className="text-center">
                      <i
                        className={`${getProductIcon(
                          product.category
                        )} text-3xl sm:text-4xl text-gray-400 mb-2`}
                      ></i>
                      <p className="text-xs text-gray-500">No image</p>
                    </div>
                  )}

                  <div
                    className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${stockStatus.class}`}
                  >
                    {stockStatus.text}
                  </div>
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-semibold text-white">
                    {product.category}
                  </div>
                </div>

                <div className="p-4 sm:p-6 flex flex-col flex-grow">
                  <div className="mb-3 sm:mb-4 flex-grow">
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors truncate">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="text-lg sm:text-xl font-black text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    <div className="text-right">
                      <div className="text-xs sm:text-sm text-gray-500">
                        Stock: {product.quantity}
                      </div>
                      {product.avg_review && (
                        <div className="flex items-center gap-1 justify-end mt-1">
                          <i className="fas fa-star text-yellow-400 text-xs"></i>
                          <span className="text-xs font-medium">
                            {product.avg_review}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* --- REPLACED: Action Buttons with Menu --- */}
                  <div className="relative mt-auto flex justify-end">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(
                          activeMenuId === product.product_id
                            ? null
                            : product.product_id
                        );
                      }}
                      className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors focus:outline-none"
                    >
                      <i className="fas fa-ellipsis-v text-lg"></i>
                    </button>

                    {/* Dropdown Menu */}
                    {activeMenuId === product.product_id && (
                      <div
                        ref={menuRef}
                        className="absolute right-0 bottom-full mb-2 w-48 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden animate-fade-in-up"
                      >
                        <div className="py-1">
                          <button
                            onClick={() => handleViewProduct(product)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors flex items-center gap-3"
                          >
                            <i className="fas fa-eye w-4"></i> View Product
                          </button>
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center gap-3"
                          >
                            <i className="fas fa-edit w-4"></i> Edit Details
                          </button>
                          <button
                            onClick={() => handleAddVariant(product)}
                            className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors flex items-center gap-3"
                          >
                            <i className="fas fa-plus-circle w-4"></i> Add
                            Variant
                          </button>
                          <div className="border-t border-gray-100 my-1"></div>
                          <button
                            onClick={() =>
                              handleDeleteProduct(product.product_id)
                            }
                            className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-3"
                          >
                            <i className="fas fa-trash-alt w-4"></i> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* --- END REPLACEMENT --- */}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorProducts;
