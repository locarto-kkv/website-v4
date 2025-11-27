import db from "../../lib/db.js";
import { env } from "../../lib/env.js";
import logger from "../../lib/logger.js";

import { getFileUploadUrl, deleteFolder } from "../../services/file.service.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const addBlog = async (req, res) => {
  try {
    const { vendor_name, ...blogData } = req.body;

    const { data: vendorId, vendorError } = await db
      .from("vendors")
      .select("id")
      .eq("name", vendor_name)
      .single();

    if (vendorError) {
      logger({
        level: "error",
        message: error.message,
        location: __filename,
        func: "addBlog",
      });
      res.status(500).json({ message: "Vendor Not Found" });
    }

    blogData.vendor_id = vendorId;

    console.log(blogData);

    const { data: newBlog, error } = await db
      .from("blogs")
      .insert(blogData)
      .select()
      .single();

    if (error) throw error;

    if (blogData.brand_logo) {
      const imgUploadUrl = await getFileUploadUrl(
        newBlog.id,
        "brand_logo",
        blogData.brand_logo,
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
    const { vendor_id, ...blogData } = req.body;

    let imgUploadUrl = null;

    if (blogData.brand_logo) {
      imgUploadUrl = await getFileUploadUrl(
        blogId,
        "brand_logo",
        blogData.brand_logo,
        "brand-logos"
      );

      const imgPublicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${imgUploadUrl.filePath}`;

      blogData.brand_logo = imgPublicUrl;
    }

    const { data: updatedBlog, error } = await db
      .from("blogs")
      .update(blogData)
      .eq("id", blogId)
      .select()
      .single();

    console.log(error);

    res.status(200).json({ blog: updatedBlog, imgUploadUrl });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "editBlog",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { data, error } = await db.from("blogs").delete().eq("id", blogId);

    res.status(200).json({ message: "Blog Deleted Successfully" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "deleteBlog",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
