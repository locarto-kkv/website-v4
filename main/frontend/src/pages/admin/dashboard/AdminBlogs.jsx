// src/pages/admin/dashboard/AdminBlogs.jsx
import React, { useEffect, useState, useRef } from "react"; // Added useRef
import { AdminBlogService } from "../../../services/admin/adminBlogService.js";
import { ConsumerSearchService } from "../../../services/consumer/consumerSearchService.js"; // Import Search Service
import { useDataStore } from "../../../store/useDataStore";
import BrandIdentityCard from "../../../components/landing/card";

function BrandPage() {
  const [formData, setFormData] = useState({
    vendor_id: "",
    title: "",
    subtitle: "",
    description: "",
    blog_image: "",
    rating: "",
    sections: [{ title: "", icon: "", content: "" }],
  });
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUpdated, setImageUpdated] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  // --- Search State ---
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");
  const [vendorSearchResults, setVendorSearchResults] = useState([]);
  const [showVendorDropdown, setShowVendorDropdown] = useState(false);
  const searchTimeoutRef = useRef(null);
  // --------------------

  const brands = useDataStore((s) => s.brands);
  const fetchBrands = useDataStore((s) => s.fetchBrands);
  const { editBlog, addBlog, deleteBlog } = AdminBlogService;

  const handleEdit = async (brand) => {
    setEditingBrand(true);
    setShowBlogForm(true);

    // Set form data with ID
    setFormData({ ...brand.blog[0], vendor_id: brand.id });
    // Set search query with Name for display
    setVendorSearchQuery(brand.name);
  };

  const handleDelete = async (brand) => {
    if (
      window.confirm(
        `Are you sure you want to delete "${brand.blog[0].title}"?`
      )
    ) {
      setLoading(true);
      await deleteBlog(brand.blog[0].id);
      await fetchBrands();
      setLoading(false);
    }
  };

  const handleBlog = {
    handleInputChange: (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    },

    handleImageChange: async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const img = new Image();
      img.src = URL.createObjectURL(file);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        // --- 1. Find square crop (center crop) ---
        const size = Math.min(img.width, img.height);
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        // --- 2. Resize target output ---
        canvas.width = 200;
        canvas.height = 200;

        ctx.drawImage(
          img,
          startX,
          startY,
          size,
          size, // crop source
          0,
          0,
          200,
          200 // draw to 200x200
        );

        canvas.toBlob(
          (blob) => {
            const croppedFile = new File([blob], file.name, {
              type: "image/jpeg",
            });

            // --- 3. Save into state ---
            setFormData((prev) => ({
              ...prev,
              blog_image: { file: croppedFile },
            }));
            setPreviewUrl(URL.createObjectURL(croppedFile));

            setImageUpdated(true);
          },
          "image/jpeg",
          0.9
        );
      };

      e.target.value = null;
    },

    handleDeleteImage: () => {
      if (window.confirm("Remove this image?")) {
        setFormData((prev) => ({
          ...prev,
          blog_image: null,
        }));
        if (editingBrand) setImageUpdated(true);
      }
    },
  };

  // --- Vendor Search Handler ---
  const handleVendorSearch = async (e) => {
    const query = e.target.value;
    setVendorSearchQuery(query);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length === 0) {
      setVendorSearchResults([]);
      setShowVendorDropdown(false);
      setFormData((prev) => ({ ...prev, vendor_id: "" }));
      return;
    }

    // Debounce search
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await ConsumerSearchService.getSearchResults(
          query,
          "vendor"
        );
        setVendorSearchResults(results.vendors || []);
        setShowVendorDropdown(true);
      } catch (error) {
        console.error("Error searching vendors:", error);
      }
    }, 300);
  };

  const handleVendorSelect = (vendor) => {
    setVendorSearchQuery(vendor.name);
    setFormData((prev) => ({ ...prev, vendor_id: vendor.id }));
    setShowVendorDropdown(false);
  };
  // ---------------------------

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...formData.sections];
    updatedSections[index][name] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: "", icon: "", content: "" }],
    });
  };

  const removeSection = (index) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);

    setFormData({ ...formData, sections: updatedSections });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editingBrand) {
      setLoading(true);

      await editBlog(formData.id, formData, imageUpdated);
      await fetchBrands();
      setEditingBrand(false);
    } else {
      setLoading(true);
      await addBlog(formData);
      await fetchBrands();
    }

    // Reset Form
    setFormData({
      vendor_id: "",
      title: "",
      subtitle: "",
      description: "",
      blog_image: "",
      rating: "",
      sections: [{ title: "", icon: "", content: "" }],
    });
    setVendorSearchQuery(""); // Reset search query
    setShowBlogForm(false);
    setLoading(false);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Your Blogs
            </h1>
            <p className="text-gray-600 mt-2">
              {brands.filter((b) => b.blog.length > 0).length} blog
              {brands.filter((b) => b.blog.length > 0).length !== 1
                ? "s"
                : ""}{" "}
              available
            </p>
          </div>

          <button
            onClick={() => {
              setShowBlogForm((prev) => !prev);
              setEditingBrand(false);
              setFormData({
                vendor_id: "",
                title: "",
                subtitle: "",
                description: "",
                blog_image: "",
                rating: "",
                sections: [{ title: "", icon: "", content: "" }],
              });
              setVendorSearchQuery(""); // Reset search on close/open
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {showBlogForm ? (
              <>
                <i className="fas fa-times"></i> Close Form
              </>
            ) : (
              <>
                <i className="fas fa-plus"></i> Add Blog
              </>
            )}
          </button>
        </div>

        {/* Grid for cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {brands &&
            !showBlogForm &&
            brands.map((brand) => {
              if (brand.blog.length > 0) {
                return (
                  <div key={brand.id} className="flex justify-center">
                    <BrandIdentityCard
                      brand={brand}
                      showAdminButtons={true}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  </div>
                );
              }
            })}
        </div>

        {/* Blog Form */}
        {showBlogForm && (
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingBrand ? "Edit Blog" : "Create New Blog"}
              </h2>
              <button
                onClick={() => {
                  setShowBlogForm(false);
                  setEditingBrand(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* --- Modified Vendor Name Search Input --- */}
                <div className="relative">
                  <label className="block text-gray-700 mb-2 font-medium">
                    Vendor Name
                  </label>
                  <span className="text-gray-400 text-xs block mb-1">
                    (Search and select a vendor)
                  </span>
                  <div className="relative">
                    <input
                      type="text"
                      value={vendorSearchQuery}
                      onChange={handleVendorSearch}
                      onFocus={() => {
                        if (vendorSearchResults.length > 0)
                          setShowVendorDropdown(true);
                      }}
                      placeholder="Search Vendor..."
                      className="w-full border rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                      required // Ensure user types something
                    />
                    <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  </div>

                  {/* Dropdown Results */}
                  {showVendorDropdown && vendorSearchResults.length > 0 && (
                    <div className="absolute z-50 w-full bg-white mt-1 rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto">
                      {vendorSearchResults.map((vendor) => (
                        <div
                          key={vendor.id}
                          onClick={() => handleVendorSelect(vendor)}
                          className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-none transition-colors flex items-center justify-between"
                        >
                          <span className="font-medium text-gray-800">
                            {vendor.name}
                          </span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            ID: {vendor.id}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {showVendorDropdown &&
                    vendorSearchQuery &&
                    vendorSearchResults.length === 0 && (
                      <div className="absolute z-50 w-full bg-white mt-1 rounded-lg shadow-xl border border-gray-200 p-4 text-center text-gray-500">
                        No vendors found.
                      </div>
                    )}
                </div>
                {/* --------------------------------------- */}

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleBlog.handleInputChange}
                    placeholder="Blog Title"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Subtitle
                  </label>
                  <input
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleBlog.handleInputChange}
                    placeholder="Blog Subtitle"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleBlog.handleInputChange}
                  placeholder="Blog Description"
                  rows={4}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Rating
                  </label>
                  <input
                    name="rating"
                    value={formData.rating}
                    onChange={handleBlog.handleInputChange}
                    placeholder="Rating (0-5)"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    required
                  />
                </div>

                <div className="md:col-span-2 mt-4">
                  <div className="p-3 bg-yellow-100 border border-yellow-300 rounded-lg text-sm text-yellow-800 flex items-center shadow-inner">
                    <i className="fas fa-exclamation-triangle mr-3 text-base"></i>
                    <p>
                      The image will be cropped to a{" "}
                      <strong>1:1 aspect ratio</strong> and displayed at
                      approximately <strong>200x200px</strong> on the card. It
                      will be displayed as previewed.
                    </p>
                  </div>
                </div>

                {/* Blog Image Upload Section */}
                <div className="md:col-span-2 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="block text-sm font-bold text-gray-700 mb-3">
                    Blog Image
                  </label>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                    {/* If image exists — show preview card */}
                    {formData.blog_image && (
                      <div className="relative aspect-square border rounded-lg overflow-hidden group bg-white shadow-sm">
                        <img
                          src={previewUrl || "placeholder.png"}
                          alt="Blog Preview"
                          className="w-full h-full object-cover"
                        />

                        <button
                          type="button"
                          onClick={handleBlog.handleDeleteImage}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full 
                     w-6 h-6 flex items-center justify-center opacity-0 
                     group-hover:opacity-100 transition-all hover:bg-red-700"
                          title="Remove"
                        >
                          <i className="fas fa-times text-xs"></i>
                        </button>
                      </div>
                    )}

                    {/* Upload Button (Only show if no image is selected) */}
                    {!formData.blog_image && (
                      <label
                        className="aspect-square border-2 border-dashed border-gray-300 
                        rounded-lg cursor-pointer hover:bg-white hover:border-orange-500 
                        transition-all flex flex-col items-center justify-center 
                        text-gray-400 hover:text-orange-500 group"
                      >
                        <i className="fas fa-camera text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                        <span className="text-xs font-semibold">Add Photo</span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleBlog.handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                </div>
              </div>

              {/* Sections */}
              <div className="pt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Sections
                  </h3>
                  <button
                    type="button"
                    onClick={addSection}
                    className="flex items-center gap-1 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <i className="fas fa-plus"></i> Add Section
                  </button>
                </div>

                {formData.sections.map((section, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl p-5 mb-4 bg-gradient-to-br from-gray-50 to-white shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-medium text-gray-700">
                        Section {index + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => removeSection(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={formData.sections.length <= 1}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <input
                          name="title"
                          value={section.title}
                          onChange={(e) => handleSectionChange(index, e)}
                          placeholder="Section Title"
                          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                          required
                        />
                      </div>

                      <div>
                        <input
                          name="icon"
                          value={section.icon}
                          onChange={(e) => handleSectionChange(index, e)}
                          placeholder="Icon (emoji)"
                          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <textarea
                      name="content"
                      value={section.content}
                      onChange={(e) => handleSectionChange(index, e)}
                      placeholder="Section Content"
                      rows={3}
                      className={`w-full mt-3 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                >
                  {editingBrand
                    ? loading
                      ? "Loading..."
                      : "Update Blog"
                    : loading
                    ? "Loading..."
                    : "Add Blog"}
                </button>
              </div>
            </form>
          </div>
        )}

        {brands?.length === 0 && !showBlogForm && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <div className="text-6xl mb-6 text-gray-300">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No blogs yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create your first blog to get started
            </p>
            <button
              onClick={() => {
                setShowBlogForm(true);
                setFormData({
                  vendor_id: "",
                  title: "",
                  subtitle: "",
                  description: "",
                  brand_logo: "",
                  rating: "",
                  sections: [{ title: "", icon: "", content: "" }],
                });
                setVendorSearchQuery("");
              }}
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto"
            >
              <i className="fas fa-plus"></i> Create Your First Blog
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default BrandPage;
