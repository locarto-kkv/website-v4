import React, { useEffect, useState } from "react";
import { AdminBlogService } from "../../../services/admin/adminBlogService";

function BlogForm() {
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    brand_logo: "",
    rating: "",
    sections: [{ title: "", icon: "", content: "" }],
  });

  const { addBlog } = AdminBlogService;

  // Handle top-level field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle section field changes
  const handleSectionChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSections = [...formData.sections];
    updatedSections[index][name] = value;
    setFormData({ ...formData, sections: updatedSections });
  };

  // Add new section
  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { title: "", icon: "", content: "" }],
    });
  };

  // Remove section
  const removeSection = (index) => {
    const updatedSections = formData.sections.filter((_, i) => i !== index);
    setFormData({ ...formData, sections: updatedSections });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addBlog({ ...formData, id: formData.title.toLowerCase() });
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
    <form onSubmit={handleSubmit} className="p-4 max-w-2xl mx-auto space-y-4">
      <h2 className="text-xl font-bold">Brand Blog</h2>

      <input
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full"
      />
      <input
        name="subtitle"
        value={formData.subtitle}
        onChange={handleChange}
        placeholder="Subtitle"
        className="border p-2 w-full"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Description"
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
        placeholder="Rating"
        type="number"
        step="0.1"
        className="border p-2 w-full"
      />

      {/* Sections */}
      <h3 className="text-lg font-semibold">Sections</h3>
      {formData.sections.map((section, index) => (
        <div key={index} className="border p-3 rounded-md mb-2 relative">
          <button
            type="button"
            onClick={() => removeSection(index)}
            className="absolute top-1 right-1 text-red-500 font-bold"
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
        + Add Section
      </button>

      {/* Submit */}
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded block w-full mt-4"
      >
        Submit
      </button>
    </form>
  );
}

export default BlogForm;
