import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { VendorProductService } from "../../../services/vendor/vendorProductService";
import { useVendorDataStore } from "../../../store/vendor/vendorDataStore";
import { ConsumerProductService } from "../../../services/consumer/consumerProductService.js";

const ProductForm = ({ data, handler, variant, base = true }) => {
  const categories = ["Personal Care", "Accessories"];
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Product Name */}
      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Product Name *
        </label>
        <input
          type="text"
          name="name"
          value={data.name}
          onChange={handler.handleInputChange}
          required
          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
          placeholder="Enter product name"
        />
      </div>

      {/* Description */}
      <div className="md:col-span-2">
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          value={data.description}
          onChange={handler.handleInputChange}
          required
          rows="4"
          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all resize-none"
          placeholder="Describe the product features and benefits..."
        ></textarea>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Price (₹) *
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">
            ₹
          </span>
          <input
            type="number"
            name="price"
            value={data.price}
            onChange={handler.handleInputChange}
            required
            min="0"
            step="0.01"
            className="w-full pl-8 pr-4 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Weight */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Weight (grams) *
        </label>
        <input
          type="number"
          name="weight"
          value={data.weight}
          onChange={handler.handleInputChange}
          required
          min="1"
          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
          placeholder="e.g. 500"
        />
      </div>

      {/* Quantity */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Stock Quantity *
        </label>
        <input
          type="number"
          name="quantity"
          value={data.quantity}
          onChange={handler.handleInputChange}
          required
          min="0"
          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
          placeholder="Available units"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Category *
        </label>
        <select
          name="category"
          value={data.category}
          onChange={handler.handleInputChange}
          required
          disabled={!base}
          className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all bg-white"
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {variant && (
        <>
          {/* Attribute Type */}

          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Attribute Type *
            </label>
            <input
              type="text"
              name="attribute_type"
              value={data.attribute_type}
              onChange={handler.handleInputChange}
              required
              disabled={!base}
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
              placeholder="Enter Variant type (Size/Quantity/etc.)"
            />
          </div>

          {/* Attribute Name */}
          <div className="md:col-span-1">
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Attribute Name *
            </label>
            <input
              type="text"
              name="attribute_name"
              value={data.attribute_name}
              onChange={handler.handleInputChange}
              required
              className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all"
              placeholder="Enter Variant name (Large/100ml/etc.)"
            />
          </div>
        </>
      )}

      {base && (
        <div>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`
        relative w-14 h-7 flex items-center rounded-full transition-colors duration-300
        ${
          enabled
            ? "bg-gradient-to-r from-[#f8693b] to-[#f83600]"
            : "bg-gray-300"
        }
      `}
          >
            <span
              className={`
          absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${enabled ? "translate-x-7" : "translate-x-1"}
        `}
            ></span>
          </button>

          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`
        relative w-14 h-7 flex items-center rounded-full transition-colors duration-300
        ${
          enabled
            ? "bg-gradient-to-r from-[#f8693b] to-[#f83600]"
            : "bg-gray-300"
        }
      `}
          >
            <span
              className={`
          absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${enabled ? "translate-x-7" : "translate-x-1"}
        `}
            ></span>
          </button>
          <button
            type="button"
            onClick={() => setEnabled(!enabled)}
            className={`
        relative w-14 h-7 flex items-center rounded-full transition-colors duration-300
        ${
          enabled
            ? "bg-gradient-to-r from-[#f8693b] to-[#f83600]"
            : "bg-gray-300"
        }
      `}
          >
            <span
              className={`
          absolute w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300
          ${enabled ? "translate-x-7" : "translate-x-1"}
        `}
            ></span>
          </button>
        </div>
      )}
      {/* Image Upload Section */}
      <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
        <label className="block text-sm font-bold text-gray-700 mb-3">
          Product Images
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
          {data.product_images?.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square border rounded-lg overflow-hidden group bg-white shadow-sm"
            >
              <img
                src={
                  image.url ||
                  (image.file
                    ? URL.createObjectURL(image.file)
                    : "placeholder.png")
                }
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => handler.handleDeleteImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-700"
                title="Remove"
              >
                <i className="fas fa-times text-xs"></i>
              </button>
            </div>
          ))}

          {/* Upload Button */}
          <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-white hover:border-orange-500 transition-all flex flex-col items-center justify-center text-gray-400 hover:text-orange-500 group">
            <i className="fas fa-camera text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
            <span className="text-xs font-semibold">Add Photo</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handler.handleImageChange}
            />
          </label>
        </div>
      </div>
    </div>
  );
};

const VendorProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const fetchAnalytics = useVendorDataStore((s) => s.fetchAnalytics);
  // Determine mode and initial data from navigation state
  const { mode, product: data } = location.state || {
    mode: "add",
    product: null,
  };
  const isEditMode = mode === "edit";

  const [loading, setLoading] = useState(false);
  const [imagesUpdated, setImagesUpdated] = useState(false);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const product = await ConsumerProductService.getProductVariants(
        data.product_uuid
      );
      setProduct(product);
    };

    fetchProduct();
  }, []);

  // Form State
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    weight: "",
    category: "",
    product_images: [],
    attribute_type: "",
    attribute_name: "",
    cod: "",
    replace: "",
    refund_return: "",
  });

  const [variantsData, setVariantsData] = useState([]);

  // Initialize form if in edit mode
  useEffect(() => {
    if (isEditMode && product) {
      if (product.count_variants < 2) {
        setProductData({
          name: product.base.name || "",
          description: product.base.description || "",
          price: product.base.price || "",
          quantity: product.base.quantity || "",
          weight: product.base.weight || "",
          category: product.category || "",
          product_images: product.base.product_images || [],
        });
      } else {
        const attribute_type = Object.keys(product.variants)[0];
        const base = product.variants[attribute_type].find(
          (variant) => variant.base
        );
        const variants = product.variants[attribute_type].filter(
          (variant) => variant !== base
        );

        setProductData({
          id: base.id,
          product_uuid: product.product_uuid,
          vendor_id: product.vendor_id,
          category: product.category || "",
          attribute_name: base.attribute_name || "",
          name: base.name || "",
          description: base.description || "",
          price: base.price || "",
          quantity: base.quantity || "",
          weight: base.weight || "",
          product_images: base.product_images || [],
          attribute_type,
        });
        setVariantsData(variants);
      }
    }
  }, [isEditMode, product]);

  const handleProduct = {
    handleInputChange: (e) => {
      const { name, value } = e.target;
      setProductData((prev) => ({ ...prev, [name]: value }));
    },

    handleImageChange: (e) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setProductData((prev) => ({
          ...prev,
          product_images: [...prev.product_images, { file }],
        }));
        setImagesUpdated(true);
      }
      e.target.value = null;
    },

    handleDeleteImage: (index) => {
      if (window.confirm("Remove this image?")) {
        const updatedImages = productData.product_images.filter(
          (_, i) => i !== index
        );
        setProductData({ ...productData, product_images: updatedImages });
        if (isEditMode) setImagesUpdated(true);
      }
    },
  };

  const handleProductVariant = {
    handleInputChange: (e, variant_idx) => {
      const { name, value } = e.target;
      setVariantsData((prev) =>
        prev.map((item, i) =>
          i === variant_idx ? { ...item, [name]: value } : item
        )
      );
    },

    handleImageChange: (e, variant_idx) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        setVariantsData((prev) =>
          prev.map((item, i) =>
            i === variant_idx
              ? {
                  ...item,
                  product_images: [...item.product_images, { file }],
                }
              : item
          )
        );
        setImagesUpdated(true);
      }
      e.target.value = null;
    },

    handleDeleteImage: (imageIndex, variant_idx) => {
      if (window.confirm("Remove this variant image?")) {
        setVariantsData((prev) =>
          prev.map((item, i) => {
            if (i === variant_idx) {
              const updatedImages = item.product_images.filter(
                (_, imgI) => imgI !== imageIndex
              );
              return { ...item, product_images: updatedImages };
            }
            return item;
          })
        );
        if (isEditMode) setImagesUpdated(true);
      }
    },

    handleRemoveVariant: (variant_idx) => {
      if (window.confirm("Remove this variant?")) {
        setVariantsData((prev) => prev.filter((_, i) => i !== variant_idx));
      }
    },
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // console.log(productData);
    // console.log(variantsData);

    try {
      if (isEditMode) {
        await VendorProductService.editProduct(
          productData.id,
          productData,
          imagesUpdated
        );
        if (variantsData.length > 0) {
          variantsData.map(
            async (variant) =>
              await VendorProductService.editProduct(
                variant.id,
                {
                  ...variant,
                  product_uuid: product.product_uuid,
                },
                imagesUpdated
              )
          );
        } else {
          await VendorProductService.addProduct(productData);
          if (variantsData.length > 0) {
            variantsData.map(
              async (variant) =>
                await VendorProductService.addProductVariant({
                  ...variant,
                  product_uuid: product.product_uuid,
                })
            );
          }
        }
      }
      // Refresh global store data
      await fetchAnalytics();

      // Navigate back to list
      navigate("/vendor/dashboard/products");
    } catch (error) {
      console.error("Error submitting product:", error);
      alert("Failed to save product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {isEditMode ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-orange-100 mt-1 text-sm">
              {isEditMode
                ? "Update product details below"
                : "Fill in the details to create a new product"}
            </p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition text-sm font-semibold"
          >
            Cancel
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Main Product Form */}
            <ProductForm
              data={productData}
              handler={handleProduct}
              variant={variantsData.length > 0}
            />

            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Variants</h3>
                <button
                  type="button"
                  onClick={() => {
                    setVariantsData((prev) => [
                      ...prev,
                      {
                        ...productData,
                      },
                    ]);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-bold transition-all"
                >
                  <span className="flex items-center gap-2">
                    <i className="fas fa-plus"></i>
                    Add Variant
                  </span>
                </button>
              </div>

              <div className="space-y-8">
                {variantsData.length > 0 &&
                  variantsData.map((variant, idx) => {
                    // Create a wrapper handler for this specific index
                    // This ensures the Generic ProductForm triggers the correct index updates
                    const variantHandler = {
                      handleInputChange: (e) =>
                        handleProductVariant.handleInputChange(e, idx),
                      handleImageChange: (e) =>
                        handleProductVariant.handleImageChange(e, idx),
                      handleDeleteImage: (imgIdx) =>
                        handleProductVariant.handleDeleteImage(imgIdx, idx),
                    };

                    return (
                      <div
                        key={idx}
                        className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative"
                      >
                        <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
                          <h4 className="font-bold text-gray-600">
                            Variant #{idx + 1}
                          </h4>
                          <button
                            type="button"
                            onClick={() =>
                              handleProductVariant.handleRemoveVariant(idx)
                            }
                            className="text-red-500 hover:text-red-700 text-sm font-semibold"
                          >
                            <i className="fas fa-trash mr-1"></i> Remove Variant
                          </button>
                        </div>
                        <ProductForm
                          data={{
                            ...variant,
                            category: productData.category,
                            attribute_type: productData.attribute_type,
                          }}
                          handler={variantHandler}
                          variant={true}
                          base={false}
                        />
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 mt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg transition-all transform hover:scale-105 hover:shadow-xl ${
                  loading ? "opacity-70 cursor-not-allowed" : ""
                }`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <i className="fas fa-spinner fa-spin"></i> Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <i
                      className={`fas ${isEditMode ? "fa-save" : "fa-plus"}`}
                    ></i>
                    {isEditMode ? "Update Product" : "Create Product"}
                  </span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorProductForm;
