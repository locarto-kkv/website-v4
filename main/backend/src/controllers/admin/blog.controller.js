import db from "../../lib/db.js";
import logger from "../../lib/logger.js";

import { getImgUploadUrl } from "../../services/admin/imgUpload.service.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getBlogs = async (req, res) => {
  try {
    const { data: blogs } = await db.from("blogs").select();

    res.status(200).json(blogs);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getBlogs",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addBlog = async (req, res) => {
  try {
    const {
      title,
      subtitle,
      description,
      rating,
      sections,
      brand_logo_metadata = null,
    } = req.body;

    const blogData = {
      title,
      subtitle,
      description,
      rating,
      sections,
    };

    const { data: newBlog, error } = await db
      .from("blogs")
      .insert(blogData)
      .select()
      .single();

    if (error) throw error;

    if (brand_logo_metadata) {
      const imgUploadUrl = await getImgUploadUrl(
        newBlog.id,
        brand_logo_metadata
      );
      const imgPublicUrl = `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${imgUploadUrl.filePath}`;

      const { data: updatedBlog } = await db
        .from("blogs")
        .update({ brand_logo: imgPublicUrl })
        .eq("id", newBlog.id)
        .select()
        .single();

      res.status(201).json({ blog: updatedBlog, imgUploadUrl });
    } else {
      res.status(201).json({ blog: newBlog });
    }
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "addBlog",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editBlog = async (req, res) => {
  try {
    const blogId = req.params.id;
    const {
      title,
      subtitle,
      description,
      rating,
      sections,
      brand_logo_metadata = null,
    } = req.body;

    if (brand_logo_metadata) {
      const imgUploadUrl = await getImgUploadUrl(blogId, brand_logo_metadata);

      const imgPublicUrl = `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${imgUploadUrl.filePath}`;

      const blogData = {
        title,
        subtitle,
        description,
        brand_logo: imgPublicUrl,
        rating,
        sections,
      };
      const { data: updatedBlog } = await db
        .from("blogs")
        .update(blogData)
        .eq("id", blogId)
        .select()
        .single();

      res.status(200).json({ blog: updatedBlog, imgUploadUrl });
    } else {
      const blogData = {
        title,
        subtitle,
        description,
        rating,
        sections,
      };

      const { data: updatedBlog } = await db
        .from("blogs")
        .update(blogData)
        .eq("id", blogId)
        .select()
        .single();

      res.status(200).json({ blog: updatedBlog });
    }
  } catch (error) {
    console.log("Error in editBlog controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const blogId = req.params.id;

    const { data: blog } = await db.from("blogs").delete().eq("id", blogId);

    res.status(200);
  } catch (error) {
    console.log("Error in deleteBlog controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
