import React, { useEffect, useState } from "react";
import { AdminBlogService } from "../../../services/admin/adminBlogService";
import { useData } from "../../../context/dataContext";
import BrandIdentityCard from "../../../components/landing/card";

function BlogPage() {
  const [formData, setFormData] = useState({
    vendor_id: "",
    title: "",
    subtitle: "",
    description: "",
    brand_logo: "",
    rating: "",
    sections: [{ title: "", icon: "", content: "" }],
  });
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(false);
  const [loading, setLoading] = useState(false);

  const { blogs, fetchBlogs } = useData();
  const { editBlog, addBlog, deleteBlog } = AdminBlogService;

  const handleEdit = async (brand) => {
    setEditingBlog(true);
    setShowBlogForm(true);

    setFormData({ ...brand.blog, vendor_id: brand.id, brand_logo: null });
  };

  const handleDelete = async (brand) => {
    if (
      window.confirm(`Are you sure you want to delete "${brand.blog.title}"?`)
    ) {
      setLoading(true);
      await deleteBlog(brand.blog.id, brand.id);
      await fetchBlogs();
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

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

    if (editingBlog) {
      setLoading(true);
      await editBlog(formData.id, formData);
      await fetchBlogs();
      setEditingBlog(false);
    } else {
      setLoading(true);
      await addBlog(formData);
      await fetchBlogs();
    }

    setFormData({
      vendor_id: "",
      title: "",
      subtitle: "",
      description: "",
      brand_logo: "",
      rating: "",
      sections: [{ title: "", icon: "", content: "" }],
    });
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
              {blogs.filter((b) => b.blog).length} blog
              {blogs.filter((b) => b.blog).length !== 1 ? "s" : ""} available
            </p>
          </div>

          <button
            onClick={() => {
              setShowBlogForm((prev) => !prev);
              setEditingBlog(false);
              setFormData({
                vendor_id: "",
                title: "",
                subtitle: "",
                description: "",
                brand_logo: "",
                rating: "",
                sections: [{ title: "", icon: "", content: "" }],
              });
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
          {blogs &&
            !showBlogForm &&
            blogs.map((brand) => {
              if (brand.blog) {
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
                {editingBlog ? "Edit Blog" : "Create New Blog"}
              </h2>
              <button
                onClick={() => {
                  setShowBlogForm(false);
                  setEditingBlog(false);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Vendor id
                  </label>
                  <input
                    name="vendor_id"
                    value={formData.vendor_id}
                    onChange={handleChange}
                    placeholder="Vendor Id"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Title *
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                  onChange={handleChange}
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
                    onChange={handleChange}
                    placeholder="Rating (0-5)"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all`}
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2 font-medium">
                    Logo/Image
                  </label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setFormData({ ...formData, brand_logo: file });
                      }
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
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
                  {editingBlog
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

        {blogs?.length === 0 && !showBlogForm && (
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

export default BlogPage;
