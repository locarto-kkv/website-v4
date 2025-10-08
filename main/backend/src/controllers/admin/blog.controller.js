import db from "../../lib/db.js";
import { env } from "../../lib/env.js";
import logger from "../../lib/logger.js";

import { getFileUploadUrl, deleteFolder } from "../../services/file.service.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

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
      const imgUploadUrl = await getFileUploadUrl(
        newBlog.id,
        brand_logo_metadata,
        "brand-logos"
      );
      const imgPublicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${imgUploadUrl.filePath}`;

      const { data: updatedBlog, error } = await db
        .from("blogs")
        .update({ brand_logo: imgPublicUrl })
        .eq("id", newBlog.id)
        .select()
        .single();

      if (error) throw error;

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
    const { blogId } = req.params;
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

    let imgUploadUrl = null;

    if (brand_logo_metadata) {
      imgUploadUrl = await getFileUploadUrl(
        blogId,
        brand_logo_metadata,
        "brand_logos"
      );

      const imgPublicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${imgUploadUrl.filePath}`;

      blogData.brand_logo = imgPublicUrl;
    }

    const { data: updatedBlog } = await db
      .from("blogs")
      .update(blogData)
      .eq("id", blogId)
      .select()
      .single();

    res.status(200).json({ blog: updatedBlog, imgUploadUrl });
  } catch (error) {
    console.log("Error in editBlog controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    await db.from("blogs").delete().eq("id", blogId);
    await deleteFolder(blogId, "brand-logos");
    res.status(200);
  } catch (error) {
    console.log("Error in deleteBlog controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
