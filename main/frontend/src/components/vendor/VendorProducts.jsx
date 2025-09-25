// src/pages/VendorProducts.jsx
import React, { useState, useEffect } from "react";
import { VendorProductService } from "../../services/vendor/vendorProductService";

const VendorProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    image: null,
  });

  // Predefined categories list
  const predefinedCategories = ["All", "Wellness", "Lifestyle", "Accessories"];

  // Extract unique categories from products (including predefined ones)
  const availableCategories = [
    ...new Set([
      ...predefinedCategories,
      ...products.map((product) => product.category),
    ]),
  ].filter((category) => category); // Remove empty categories

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      // const productService = VendorProductService();
      // const fetchedProducts = await productService.getProducts();
      // setProducts(fetchedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setNewProduct((prev) => ({ ...prev, image: e.target.files[0] }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const productService = new VendorProductService();
      await productService.addProduct(newProduct);
      setShowAddModal(false);
      setNewProduct({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        image: null,
      });
      fetchProducts(); // Refresh product list
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter((product) => product.category === selectedCategory);

  if (loading) {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Products</h1>

      {/* Top Tabs - Matching Analytics Style */}
      <div className="flex border-b border-gray-200 mb-6">
        {predefinedCategories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 font-medium ${
              selectedCategory === category
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-600 hover:text-gray-800 border-b-2 border-transparent"
            }`}
          >
            {category}
          </button>
        ))}
      </div>
      {/* Category Filter Bar */}

      {/* Action Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium transition"
        >
          <i className="fas fa-plus mr-2"></i>
          Add Product
        </button>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-12 text-center">
          <i className="fas fa-box-open text-5xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">
            {selectedCategory === "All"
              ? "No products yet"
              : `No products in ${selectedCategory}`}
          </h3>
          <p className="text-gray-500 mb-6">
            {selectedCategory === "All"
              ? "Get started by adding your first product"
              : `Add products to the ${selectedCategory} category`}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-medium transition"
          >
            Add Product
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition"
            >
              <div className="h-48 bg-gray-100 flex items-center justify-center">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <i className="fas fa-image text-gray-400 text-4xl"></i>
                )}
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {product.category}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded ${
                      product.stock > 10
                        ? "bg-green-100 text-green-800"
                        : product.stock > 0
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.stock > 0
                      ? `${product.stock} in stock`
                      : "Out of stock"}
                  </span>
                </div>
                <p className="text-gray-600 mt-3 line-clamp-2">
                  {product.description}
                </p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </span>
                  <div className="flex space-x-2">
                    <button className="text-gray-500 hover:text-orange-600">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-gray-500 hover:text-red-500">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Add New Product</h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>

              <form onSubmit={handleAddProduct}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={newProduct.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                      placeholder="Enter product name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={newProduct.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                      placeholder="Enter product description"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Price ($)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={newProduct.price}
                        onChange={handleInputChange}
                        required
                        min="0"
                        step="0.01"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={newProduct.stock}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      name="category"
                      value={newProduct.category}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-orange-600"
                    >
                      <option value="">Select category</option>
                      {predefinedCategories.slice(1).map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Image
                    </label>
                    <div className="flex items-center">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                          <p className="text-sm text-gray-500">
                            <span className="font-semibold">
                              Click to upload
                            </span>{" "}
                            or drag and drop
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
                    {newProduct.image && (
                      <p className="mt-2 text-sm text-gray-500">
                        Selected: {newProduct.image.name}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                  >
                    Add Product
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
