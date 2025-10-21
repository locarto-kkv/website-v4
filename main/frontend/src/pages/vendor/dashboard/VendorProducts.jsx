// src/pages/vendor/dashboard/VendorProducts.jsx
import React, { useState } from "react";
import { formatCurrency } from "../../../lib/utils.js";
import { VendorProductService } from "../../../services/vendor/vendorProductService.js";
import { useVendorData } from "../../../context/vendor/vendorDataContext.jsx";

const VendorProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All"); // Changed default to 'All'
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid"); // Default to grid
  const [imagesUpdated, setImagesUpdated] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(null); // Keep track of ID for edits
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    product_images: [], // Stores { file: File } or { name: string, url: string }
  });

  const { products, getAnalytics } = useVendorData(); // Assuming products is an array

  // Example categories - adjust as needed or fetch dynamically
  const predefinedCategories = ["All", "Personal Care", "Accessories"]; // Make sure 'All' is first

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      // Add new file object to the array
      setProductData((prev) => ({
        ...prev,
        product_images: [...prev.product_images, { file: e.target.files[0] }],
      }));
      setImagesUpdated(true); // Mark images as updated for backend logic
    }
     // Clear the input value to allow selecting the same file again if needed
     e.target.value = null;
  };

  const handleDeleteImage = async (image, index) => {
    if (window.confirm("Are you sure you want to remove this image preview?")) {
      const updatedImages = productData.product_images.filter(
        (_, i) => i !== index
      );
      setProductData({
        ...productData,
        product_images: updatedImages,
      });
      // If editing, mark that images need updating on the backend
      if (editingProduct) {
        setImagesUpdated(true);
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        if (editingProduct) {
            await VendorProductService.editProduct(
                productId, // Pass the correct product ID
                productData,
                imagesUpdated // Pass flag indicating if images were changed
            );
        } else {
            await VendorProductService.addProduct(productData);
        }
        await getAnalytics(); // Refresh data after add/edit
        resetForm(); // Reset form state
        setShowModal(false); // Close modal
    } catch (error) {
        console.error("Error submitting product:", error);
        // Add user-friendly error handling (e.g., toast notification)
    } finally {
        setLoading(false);
    }
  };


  const handleEditProduct = async (product) => {
    setEditingProduct(true);
    setProductId(product.product_id); // Set the ID of the product being edited

    // Format existing images from URLs into the expected structure for display
    const formattedImages = (product.product_images || []).map((imgUrl, i) => ({
       name: `existing_image_${i + 1}.jpg`, // Provide a placeholder name
       url: imgUrl, // The URL from the backend
     }));


    setProductData({
      name: product.name || "",
      description: product.description || "",
      price: product.price?.toString() || "", // Ensure string for input
      quantity: product.quantity?.toString() || "", // Ensure string for input
      category: product.category || "",
      product_images: formattedImages, // Use the formatted images
    });
    setImagesUpdated(false); // Reset image update flag when starting edit
    setShowModal(true);
  };


  const handleDeleteProduct = async (productIdToDelete) => { // Accept productId directly
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      try {
          await VendorProductService.deleteProduct(productIdToDelete); // Use the passed ID
          await getAnalytics(); // Refresh data
          // Optionally add success feedback (e.g., toast)
      } catch (error) {
          console.error("Error deleting product:", error);
           // Optionally add error feedback (e.g., toast)
      } finally {
        setLoading(false);
      }
    }
  };


  const resetForm = () => {
    setProductData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      product_images: [],
    });
    setProductId(null); // Reset productId
    setEditingProduct(null); // Reset editing state
    setImagesUpdated(false); // Reset image update flag
  };

  // --- Utility Functions --- (Keep existing functions: getStockStatus, getProductIcon)
  const getStockStatus = (quantity) => { // Renamed from stock to quantity
    const qty = Number(quantity); // Ensure it's a number
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
      // Use category names consistent with your predefinedCategories or actual data
      "Personal Care": "fas fa-spa", // Example
      "Accessories": "fas fa-gem", // Example
      Default: "fas fa-box",
    };
    return icons[category] || icons["Default"];
  };
  // --- End Utility Functions ---

  // Filter and sort products
  const filteredProducts = (products || []) // Ensure products is an array
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch =
        product.name?.toLowerCase().includes(searchQuery.toLowerCase()) || // Safer access
        product.description?.toLowerCase().includes(searchQuery.toLowerCase()); // Safer access
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      // Ensure properties exist before comparing
      const aVal = a?.[sortBy];
      const bVal = b?.[sortBy];

      switch (sortBy) {
        case "price":
          return (Number(aVal) || 0) - (Number(bVal) || 0); // Convert to number safely
        case "quantity": // Assuming 'quantity' is the field name for stock
          return (Number(bVal) || 0) - (Number(aVal) || 0); // Descending stock
        case "sales": // Assuming 'sales' exists, otherwise use a placeholder
          return (Number(b.sales) || 0) - (Number(a.sales) || 0); // Descending sales
        default: // Sort by name (case-insensitive)
           return (aVal || "").toString().localeCompare((bVal || "").toString()); // Safer string comparison
      }
    });

  return (
    // Removed outer padding (p-6) - assuming layout provides it
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Enhanced Header - Responsive adjustments */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        {/* Title removed - handled by layout */}
        <div className="flex items-center gap-4 mt-4 sm:mt-0 w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={() => { resetForm(); setShowModal(true); }} // Reset form when opening for 'Add'
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
          >
            <i className="fas fa-plus text-xs sm:text-sm"></i>
            Add Product
          </button>
        </div>
      </div>

      {/* Enhanced Controls - Responsive adjustments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        {/* Category Tabs & View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
          {/* Category Tabs - Scrollable on mobile */}
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
                         ({(products || []).filter((p) => p.category === category).length}) {/* Safer count */}
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
                viewMode === "grid" ? "bg-orange-100 text-orange-600" : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="Grid View"
            >
              <i className="fas fa-th-large"></i>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list" ? "bg-orange-100 text-orange-600" : "text-gray-500 hover:bg-gray-100"
              }`}
              aria-label="List View"
            >
              <i className="fas fa-list"></i>
            </button>
          </div>
        </div>

        {/* Search and Sort - Stack vertically on mobile */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
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

          {/* Sort Dropdown */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-medium text-sm sm:text-base"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="quantity">Sort by Stock</option> {/* Updated value */}
            <option value="sales">Sort by Sales</option>
          </select>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        // --- Empty State --- (Adjusted padding and text sizes)
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-box-open text-2xl sm:text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
            {selectedCategory === "All" ? "No products yet" : `No products in ${selectedCategory}`}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto text-sm sm:text-base">
            {selectedCategory === "All"
              ? "Get started by adding your first product to showcase your offerings."
              : `Add products to the ${selectedCategory} category to see them here.`}
          </p>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base"
          >
            <i className="fas fa-plus mr-2 text-xs sm:text-sm"></i>
            Add Your First Product
          </button>
        </div>
        // --- End Empty State ---
      ) : (
         // --- Grid/List Container --- (Responsive grid columns)
        <div className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6" : "space-y-4"}>
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.quantity);

            // --- List View Item --- (Responsive adjustments)
            if (viewMode === "list") {
              return (
                <div
                  key={product.product_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    {/* Image/Icon */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                       {product.product_images && product.product_images.length > 0 && product.product_images[0]?.url ? (
                            <img src={product.product_images[0].url} alt={product.name} className="w-full h-full object-cover rounded-xl"/>
                       ) : (
                           <i className={`${getProductIcon(product.category)} text-xl sm:text-2xl text-orange-600`}></i>
                       )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between mb-1 sm:mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 truncate mb-1 sm:mb-0">
                          {product.name}
                        </h3>
                         <span className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${stockStatus.class} ml-0 sm:ml-4`}>
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
                          {product.avg_review && (
                            <div className="flex items-center gap-1">
                              <i className="fas fa-star text-yellow-400 text-xs sm:text-sm"></i>
                              <span className="text-xs sm:text-sm font-medium">
                                {product.avg_review}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                             className="p-2 sm:p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors text-sm sm:text-base"
                             aria-label={`Edit ${product.name}`}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product.product_id)} // Pass ID directly
                            className="p-2 sm:p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm sm:text-base"
                            aria-label={`Delete ${product.name}`}
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

            // --- Grid View Item --- (Responsive adjustments)
            return (
              <div
                key={product.product_id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col" // Added flex flex-col
              >
                {/* Image Area */}
                <div className="relative h-40 sm:h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  {product.product_images && product.product_images.length > 0 && product.product_images[0]?.url ? (
                    <img
                      src={product.product_images[0].url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      loading="lazy" // Add lazy loading
                    />
                  ) : (
                    <div className="text-center">
                      <i className={`${getProductIcon(product.category)} text-3xl sm:text-4xl text-gray-400 mb-2`}></i>
                      <p className="text-xs text-gray-500">No image</p>
                    </div>
                  )}

                  {/* Stock Status Badge */}
                  <div className={`absolute top-2 sm:top-3 right-2 sm:right-3 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${stockStatus.class}`}>
                    {stockStatus.text}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 bg-black/30 backdrop-blur-sm rounded-full text-[10px] sm:text-xs font-semibold text-white">
                    {product.category}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-4 sm:p-6 flex flex-col flex-grow"> {/* Added flex-grow */}
                  {/* Title & Description */}
                  <div className="mb-3 sm:mb-4 flex-grow"> {/* Added flex-grow */}
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2 group-hover:text-orange-600 transition-colors truncate"> {/* Added truncate */}
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Price & Stock/Rating */}
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

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-auto"> {/* Added mt-auto */}
                    <button
                      onClick={() => handleEditProduct(product)}
                      disabled={loading}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium text-xs sm:text-sm ${loading && "opacity-70 cursor-not-allowed"}`}
                      aria-label={`Edit ${product.name}`}
                    >
                      <i className="fas fa-edit text-[10px] sm:text-xs"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.product_id)} // Pass ID directly
                      disabled={loading}
                      className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 py-1.5 sm:py-2 px-2 sm:px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium text-xs sm:text-sm ${loading && "opacity-70 cursor-not-allowed"}`}
                       aria-label={`Delete ${product.name}`}
                    >
                      <i className="fas fa-trash text-[10px] sm:text-xs"></i> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        // --- End Grid/List Container ---
      )}

      {/* Enhanced Add/Edit Product Modal - Responsive adjustments */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"> {/* Added overflow-y-auto */}
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-md md:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"> {/* Responsive max-w and flex col */}
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sm:p-6 flex-shrink-0">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  <p className="text-orange-100 mt-1 text-xs sm:text-sm">
                    {editingProduct ? "Update product information" : "Fill in the product details"}
                  </p>
                </div>
                <button
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                   aria-label="Close modal"
                >
                  <i className="fas fa-times text-lg sm:text-xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable */}
            <div className="p-4 sm:p-6 overflow-y-auto flex-grow">
              <form onSubmit={handleSubmit}>
                {/* Responsive grid for inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  {/* Product Name */}
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">Product Name *</label>
                    <input type="text" name="name" value={productData.name} onChange={handleInputChange} required
                      className="w-full p-3 sm:p-4 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      placeholder="Enter product name"/>
                  </div>

                  {/* Description */}
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">Description *</label>
                    <textarea name="description" value={productData.description} onChange={handleInputChange} required rows="3" // Reduced rows
                      className="w-full p-3 sm:p-4 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
                      placeholder="Describe the product"></textarea>
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">Price (₹) *</label>
                    <div className="relative">
                      <span className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium text-sm sm:text-base">₹</span>
                      <input type="number" name="price" value={productData.price} onChange={handleInputChange} required min="0" step="0.01"
                        className="w-full pl-7 sm:pl-8 pr-4 py-3 sm:py-4 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                        placeholder="0.00"/>
                    </div>
                  </div>

                  {/* Quantity */}
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">Stock Quantity *</label>
                    <input type="number" name="quantity" value={productData.quantity} onChange={handleInputChange} required min="0"
                      className="w-full p-3 sm:p-4 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
                      placeholder="e.g., 10"/>
                  </div>

                  {/* Category */}
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">Category *</label>
                    <select name="category" value={productData.category} onChange={handleInputChange} required
                      className="w-full p-3 sm:p-4 text-sm sm:text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white appearance-none">
                      <option value="">Select category</option>
                       {/* Ensure categories are correctly mapped */}
                      {predefinedCategories.slice(1).map((category) => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>

                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-1 sm:mb-2">Product Images</label>
                    {/* Image Preview Area */}
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                         {productData.product_images?.map((image, index) => (
                          <div key={index} className="relative aspect-square border rounded-lg overflow-hidden group">
                              <img
                                  src={image.url || (image.file ? URL.createObjectURL(image.file) : 'placeholder.png')} // Handle both existing URL and new file
                                  alt={`Product image ${index + 1}`}
                                  className="w-full h-full object-cover"
                              />
                               <button
                                type="button"
                                onClick={() => handleDeleteImage(image, index)}
                                className="absolute top-1 right-1 bg-red-600/70 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                title="Remove image"
                                aria-label="Remove image"
                              >
                                  <i className="fas fa-times text-[10px]"></i>
                              </button>
                          </div>
                      ))}
                      {/* Upload Button Placeholder */}
                       <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors flex flex-col items-center justify-center text-gray-400 hover:text-orange-500">
                          <i className="fas fa-plus text-lg sm:text-xl mb-1"></i>
                          <span className="text-[10px] sm:text-xs text-center">Add Image</span>
                          <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                       </label>
                    </div>
                  </div>
                </div>

                {/* Modal Footer - Stick to bottom */}
                <div className="flex items-center justify-end gap-3 sm:gap-4 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all text-xs sm:text-sm">
                    Cancel
                  </button>
                  <button type="submit" disabled={loading}
                    className={`px-5 sm:px-8 py-2 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold transition-all shadow-lg transform text-xs sm:text-sm
                      ${loading ? "opacity-70 cursor-not-allowed" : "hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:scale-105"}`}>
                    {loading ? (
                      <><i className="fas fa-spinner fa-spin mr-2"></i>Processing...</>
                    ) : editingProduct ? (
                      <><i className="fas fa-save mr-2"></i>Update</> // Shorter text
                    ) : (
                      <><i className="fas fa-plus mr-2"></i>Add</> // Shorter text
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProducts;