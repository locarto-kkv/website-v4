import React, { useState } from "react";
import { formatCurrency } from "../../../lib/utils.js";
import { VendorProductService } from "../../../services/vendor/vendorProductService.js";
import { useVendorData } from "../../../context/vendor/vendorDataContext.jsx";

const VendorProducts = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [imagesUpdated, setImagesUpdated] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState(null);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    category: "",
    product_images: [],
  });

  const { products, getAnalytics } = useVendorData();

  const predefinedCategories = ["All", "Personal Care", "Accessories"];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setProductData((prev) => ({
      ...prev,
      product_images: [...prev.product_images, { file: e.target.files[0] }],
    }));
    setImagesUpdated(true);
  };

  const handleDeleteImage = async (image, index) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      const updatedImages = productData.product_images.filter(
        (_, i) => i !== index
      );
      setProductData({
        ...productData,
        product_images: updatedImages,
      });
      setImagesUpdated(true);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (editingProduct) {
      await VendorProductService.editProduct(
        productId,
        productData,
        imagesUpdated
      );
    } else {
      await VendorProductService.addProduct(productData);
    }

    resetForm();

    await getAnalytics();
    setLoading(false);

    setShowModal(false);
    setProductId(null);
    setImagesUpdated(false);
  };

  const handleEditProduct = async (product) => {
    setEditingProduct(true);
    setProductId(product.product_id);

    const formattedImages = (product.product_images || []).map((img, i) => {
      if (typeof img === "string") {
        return {
          name: `product_image_${i + 1}`,
          url: img,
        };
      }
      return img;
    });

    setProductData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      category: product.category,
      product_images: formattedImages,
    });

    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setLoading(true);
      await VendorProductService.deleteProduct(productId);
      await getAnalytics();

      setLoading(false);
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
    setProductId(null);
    setEditingProduct(null);
  };

  const getStockStatus = (stock) => {
    if (stock === 0)
      return { text: "Out of Stock", class: "bg-red-100 text-red-800" };
    if (stock <= 5)
      return { text: "Low Stock", class: "bg-yellow-100 text-yellow-800" };
    if (stock <= 10)
      return { text: "Limited", class: "bg-orange-100 text-orange-800" };
    return { text: "In Stock", class: "bg-green-100 text-green-800" };
  };

  const getProductIcon = (category) => {
    const icons = {
      Wellness: "fas fa-heart",
      Lifestyle: "fas fa-home",
      Accessories: "fas fa-gem",
      Default: "fas fa-box",
    };
    return icons[category] || icons["Default"];
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.price - b.price;
        case "stock":
          return b.stock - a.stock;
        case "sales":
          return (b.sales || 0) - (a.sales || 0);
        default:
          return a.name.localeCompare(b.name);
      }
    });

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
              <i className="fas fa-box text-white"></i>
            </div>
            My Products
          </h1>
          <p className="text-gray-600">
            Manage your product inventory and listings
          </p>
        </div>

        <div className="flex items-center gap-4 mt-4 lg:mt-0">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <>
              <i className="fas fa-plus"></i>
              Add Product
            </>
          </button>
        </div>
      </div>

      {/* Enhanced Controls */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex flex-wrap gap-2">
            {predefinedCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category}
                {category !== "All" && (
                  <span className="ml-2 text-xs opacity-75">
                    ({products.filter((p) => p.category === category).length})
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
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
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white font-medium"
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
            <option value="stock">Sort by Stock</option>
            <option value="sales">Sort by Sales</option>
          </select>
        </div>
      </div>

      {/* Products Display */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <i className="fas fa-box-open text-3xl text-gray-400"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">
            {selectedCategory === "All"
              ? "No products yet"
              : `No products in ${selectedCategory}`}
          </h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {selectedCategory === "All"
              ? "Get started by adding your first product to showcase your offerings"
              : `Add products to the ${selectedCategory} category to get started`}
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Your First Product
          </button>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredProducts.map((product) => {
            const stockStatus = getStockStatus(product.quantity);

            if (viewMode === "list") {
              return (
                <div
                  key={product.product_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <i
                        className={`${getProductIcon(
                          product.category
                        )} text-2xl text-orange-600`}
                      ></i>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 ml-4">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.class}`}
                          >
                            {stockStatus.text}
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-3 line-clamp-2">
                        {product.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <span className="text-2xl font-black text-gray-900">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="text-sm text-gray-500">
                            Stock: {product.quantity}
                          </span>
                          {product.avg_review && (
                            <div className="flex items-center gap-1">
                              <i className="fas fa-star text-yellow-400"></i>
                              <span className="text-sm font-medium">
                                {product.avg_review}
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditProduct(product)}
                            className="p-3 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product)}
                            className="p-3 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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

            return (
              <div
                key={product.product_id}
                className="group bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                  {product.product_images ? (
                    <img
                      src={product.product_images[0]?.url}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center">
                      <i
                        className={`${getProductIcon(
                          product.category
                        )} text-4xl text-gray-400 mb-2`}
                      ></i>
                      <p className="text-xs text-gray-500">No image</p>
                    </div>
                  )}

                  {/* Stock Status Badge */}
                  <div
                    className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${stockStatus.class}`}
                  >
                    {stockStatus.text}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-3 py-1 bg-black/20 backdrop-blur-sm rounded-full text-xs font-semibold text-white">
                    {product.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    <div className="text-right">
                      <div className="text-sm text-gray-500">
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      disabled={loading}
                      className={`${
                        loading && "opacity-70 cursor-not-allowed"
                      } flex-1 flex items-center justify-center gap-2 py-2 px-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors font-medium`}
                    >
                      <i className="fas fa-edit text-sm"></i>
                      {loading ? (!productId ? "Edit" : "Editing...") : "Edit"}
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.product_id)}
                      disabled={loading}
                      className={`${
                        loading && "opacity-70 cursor-not-allowed"
                      } flex-1 flex items-center justify-center gap-2 py-2 px-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium`}
                    >
                      <i className="fas fa-trash text-sm"></i>
                      {loading
                        ? !productId
                          ? "Deleting..."
                          : "Delete"
                        : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Enhanced Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </h3>
                  <p className="text-orange-100 mt-1">
                    {editingProduct
                      ? "Update your product information"
                      : "Fill in the details for your new product"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={productData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="Enter a compelling product name"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={productData.description}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                      placeholder="Describe your product's features and benefits"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Price (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                        ₹
                      </span>
                      <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        placeholder="0.00"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Stock Quantity *
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={productData.quantity}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                      placeholder="Available quantity"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Category *
                    </label>
                    <select
                      name="category"
                      value={productData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all bg-white"
                    >
                      <option value="">Choose a category</option>
                      {predefinedCategories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      Product Image
                    </label>
                    <div className="relative">
                      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 group-hover:text-orange-500 transition-colors mb-3"></i>
                          <p className="text-sm text-gray-600 text-center">
                            <span className="font-semibold text-orange-600">
                              Click to upload
                            </span>{" "}
                            or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>
                    {productData.product_images?.map((image, index) => (
                      <div
                        key={index}
                        className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center"
                      >
                        <a
                          href={
                            image.url
                              ? image.url
                              : image.file instanceof File
                              ? URL.createObjectURL(image.file)
                              : "#"
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-green-800 flex items-center gap-2 hover:underline"
                        >
                          <i className="fas fa-image"></i>
                          {`product_image_${index + 1}`}
                        </a>

                        <button
                          type="button"
                          onClick={() => handleDeleteImage(image, index)}
                          className="text-red-500 hover:text-red-700"
                          title="Remove image"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setLoading(false);
                      setImagesUpdated(false);
                      resetForm();
                    }}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold transition-all shadow-lg transform
    ${
      loading
        ? "opacity-70 cursor-not-allowed"
        : "hover:from-orange-600 hover:to-red-600 hover:shadow-xl hover:scale-105"
    }`}
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Processing...
                      </>
                    ) : editingProduct ? (
                      <>
                        <i className="fas fa-save mr-2"></i>
                        Update Product
                      </>
                    ) : (
                      <>
                        <i className="fas fa-plus mr-2"></i>
                        Add Product
                      </>
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
