import React, { useEffect, useState } from "react";
import { AdminBlogService } from "../../../services/admin/adminBlogService";
import { useBlogs } from "../../../context/blogContext";
import BrandIdentityCard from "../../../components/landing/card";

function BlogPage() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    brand_logo: "",
    rating: "",
    sections: [{ title: "", icon: "", content: "" }],
  });
  const [showBlogForm, setShowBlogForm] = useState(false);
  const [editingBlog, setEditingBlog] = useState(false);
  const [errors, setErrors] = useState({});

  const { blogs } = useBlogs();
  const { editBlog, addBlog, deleteBlog } = AdminBlogService;

  const handleEdit = async (brand) => {
    setEditingBlog(true);
    setShowBlogForm(true);
    setFormData({ ...brand, brand_logo: null });
  };

  const handleDelete = async (brand) => {
    if (window.confirm(`Are you sure you want to delete "${brand.title}"?`)) {
      await deleteBlog(brand.id);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...formData.sections];
    updatedSections[index][name] = value;
    setFormData({ ...formData, sections: updatedSections });
    
    // Clear section error when user starts typing
    if (errors[`section-${index}-${name}`]) {
      setErrors({ ...errors, [`section-${index}-${name}`]: '' });
    }
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: "", icon: "", content: "" }],
    });
  };

  const removeSection = (index) => {
    if (formData.sections.length <= 1) {
      alert("At least one section is required");
      return;
    }
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: updatedSections });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.subtitle.trim()) newErrors.subtitle = "Subtitle is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.rating || formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    
    formData.sections.forEach((section, index) => {
      if (!section.title.trim()) {
        newErrors[`section-${index}-title`] = "Section title is required";
      }
      if (!section.content.trim()) {
        newErrors[`section-${index}-content`] = "Section content is required";
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      if (editingBlog) {
        await editBlog(formData.id, formData);
        setEditingBlog(false);
      } else {
        await addBlog(formData);
      }
      
      setFormData({
        title: "",
        subtitle: "",
        description: "",
        brand_logo: "",
        rating: "",
        sections: [{ title: "", icon: "", content: "" }],
      });
      setShowBlogForm(false);
    } catch (error) {
      console.error("Error saving blog:", error);
      alert("An error occurred while saving the blog. Please try again.");
    }
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
              {blogs?.length || 0} blog{blogs?.length !== 1 ? 's' : ''} available
            </p>
          </div>
          
          <button
            onClick={() => {
              setShowBlogForm((prev) => !prev);
              setEditingBlog(false);
              setFormData({
                title: "",
                subtitle: "",
                description: "",
                brand_logo: "",
                rating: "",
                sections: [{ title: "", icon: "", content: "" }],
              });
              setErrors({});
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
          {blogs && !showBlogForm && (
            blogs.map((brand) => (
              <div key={brand.id} className="flex justify-center">
                <BrandIdentityCard
                  brand={brand}
                  showAdminButtons={true}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  buttonPosition="higher"
                />
              </div>
            ))
          )}
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
                  setErrors({});
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Title *</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Blog Title"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Subtitle *</label>
                  <input
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleChange}
                    placeholder="Blog Subtitle"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                      errors.subtitle ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.subtitle && <p className="text-red-500 text-sm mt-1">{errors.subtitle}</p>}
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Blog Description"
                  rows={4}
                  className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Rating *</label>
                  <input
                    name="rating"
                    value={formData.rating}
                    onChange={handleChange}
                    placeholder="Rating (0-5)"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    className={`w-full border rounded-lg px-4 py-3 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                      errors.rating ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors.rating && <p className="text-red-500 text-sm mt-1">{errors.rating}</p>}
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2 font-medium">Logo/Image</label>
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
                  <h3 className="text-xl font-semibold text-gray-800">Sections</h3>
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
                      <h4 className="font-medium text-gray-700">Section {index + 1}</h4>
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
                          className={`w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                            errors[`section-${index}-title`] ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                        {errors[`section-${index}-title`] && (
                          <p className="text-red-500 text-sm mt-1">{errors[`section-${index}-title`]}</p>
                        )}
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
                      className={`w-full mt-3 border rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all ${
                        errors[`section-${index}-content`] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors[`section-${index}-content`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`section-${index}-content`]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg"
                >
                  {editingBlog ? "Update Blog" : "Create Blog"}
                </button>
              </div>
            </form>
          </div>
        )}

        {blogs?.length === 0 && !showBlogForm && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-sm border border-gray-200 max-w-2xl mx-auto">
            <div className="text-6xl mb-6 text-gray-300">📝</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No blogs yet</h3>
            <p className="text-gray-600 mb-6">Create your first blog to get started</p>
            <button
              onClick={() => {
                setShowBlogForm(true);
                setFormData({
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