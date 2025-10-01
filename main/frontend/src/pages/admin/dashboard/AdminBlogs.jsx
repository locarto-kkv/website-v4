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
      console.log(formData);
      await editBlog(formData.id, formData);

      return;
    }

    await addBlog(formData);
    setFormData({
      title: "",
      subtitle: "",
      description: "",
      brand_logo: "",
      rating: "",
      sections: [{ title: "", icon: "", content: "" }],
    });
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center gap-4 mb-6">
        <p className="text-gray-600 font-semibold text-2xl">
          Manage your blogs
        </p>
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
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {showBlogForm ? (
            <>
              <i className="fas fa-times"></i>Close Form
            </>
          ) : (
            <>
              <i className="fas fa-plus"></i>Add Blog
            </>
          )}
        </button>
      </div>
      {/* Grid for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs &&
          !showBlogForm &&
          blogs.map((brand) => (
            <BrandIdentityCard
              key={brand.id}
              brand={brand}
              showAdminButtons={true}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
      </div>

      {/* Blog Form */}
      {showBlogForm && (
        <form
          onSubmit={handleSubmit}
          className="p-4 max-w-2xl mx-auto space-y-4"
        >
          <h2 className="text-xl font-bold">Brand Blog</h2>

          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Title"
            required
            className="border p-2 w-full"
          />
          <input
            name="subtitle"
            value={formData.subtitle}
            onChange={handleChange}
            placeholder="Subtitle"
            required
            className="border p-2 w-full"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Description"
            required
            className="border p-2 w-full"
          />
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
            className="border p-2 w-full"
          />
          <input
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            required
            placeholder="Rating"
            type="number"
            step="0.1"
            className="border p-2 w-full"
          />

          {/* Sections */}
          <h3 className="text-lg font-semibold">Sections</h3>
          {formData.sections.map((section, index) => (
            <div
              key={index}
              className="border p-5 pt-10 rounded-md mb-2 relative"
            >
              <button
                type="button"
                onClick={() => removeSection(index)}
                className="absolute top-1 right-1 p-1 text-red-500 font-bold"
              >
                ❌
              </button>
              <input
                name="title"
                value={section.title}
                onChange={(e) => handleSectionChange(index, e)}
                placeholder="Section Title"
                className="border p-2 w-full mb-2"
              />
              <input
                name="icon"
                value={section.icon}
                onChange={(e) => handleSectionChange(index, e)}
                placeholder="Icon (emoji)"
                className="border p-2 w-full mb-2"
              />
              <textarea
                name="content"
                value={section.content}
                onChange={(e) => handleSectionChange(index, e)}
                placeholder="Content"
                className="border p-2 w-full"
              />
            </div>
          ))}

          <button
            type="button"
            onClick={addSection}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            <i className="fas fa-plus mr-2"></i>Add Section
          </button>

          <button
            type="submit"
            className="bg-green-600 text-white px-6 py-2 rounded block w-full mt-4"
          >
            {editingBlog ? "Edit Blog" : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}

export default BlogPage;
