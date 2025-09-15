import React, { useState } from 'react';

const AddProductForm = ({ onSubmit }) => {
  const [newProduct, setNewProduct] = useState({
    name: "",
    category: "",
    price: 0,
    quantity: 0,
    product_images: [],
  });

  const handleChange = (e) => {
    setNewProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleImageChange = (files) => {
    setNewProduct(prev => ({ ...prev, product_images: [...prev.product_images, ...files] }));
  };

  const handleRemoveImage = (index) => {
    setNewProduct(prev => ({
        ...prev,
        product_images: prev.product_images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newProduct);
    // Optional: clear form after submission
    setNewProduct({ name: "", category: "", price: 0, quantity: 0, product_images: [] });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-secondary mb-6">Add New Product</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* All form inputs (Name, Category, Price, etc.) go here */}
        {/* Example for Product Name */}
        <div>
          <label className="block text-gray-700 mb-2">Product Name</label>
          <input
            name="name" type="text" required value={newProduct.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Enter product name"
          />
        </div>
        {/* Add other inputs for category, price, quantity, and image upload */}
        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProductForm;