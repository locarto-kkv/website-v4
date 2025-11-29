import db from "../../lib/db.js";
import { env } from "../../lib/env.js";
import logger from "../../lib/logger.js";

import { getFileUploadUrl, deleteFolder } from "../../services/file.service.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const addBlog = async (req, res) => {
  try {
    const blogData = req.body;

    const { data: newBlog, error } = await db
      .from("blogs")
      .insert(blogData)
      .select()
      .single();

    if (error) throw error;

    console.log(blogData);

    if (blogData.blog_image) {
      const imgUploadUrl = await getFileUploadUrl(
        blogData.vendor_id,
        "blog_image",
        blogData.blog_image,
        "brand-logos"
      );
      const imgPublicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${imgUploadUrl.filePath}`;

      const { data: updatedBlog, error } = await db
        .from("blogs")
        .update({ blog_image: imgPublicUrl })
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
    const { blogData, imageUpdated } = req.body;

    let imgUploadUrl = null;

    if (imageUpdated) {
      const image = blogData.blog_image;

      if (image && typeof image === "object" && image.name) {
        console.log("CASE 1: New image uploaded:", image);

        const fileName = `${blogData.vendor_id}_${image.name}`;
        const filePath = `${blogData.vendor_id}/${fileName}`;

        const removeResp = await db.storage
          .from("brand-logos")
          .remove([filePath]);

        console.log("Old image removed:", removeResp.data, removeResp.error);

        const uploadResponse = await getFileUploadUrl(
          blogData.vendor_id,
          image.name,
          image,
          "brand-logos"
        );

        imgUploadUrl = uploadResponse;

        const publicUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/brand-logos/${uploadResponse.filePath}`;

        blogData.blog_image = publicUrl;
      } else if (!image) {
        console.log("CASE 2: Blog image removed by user");
        blogData.blog_image = null;
      }
    }

    const { data: updatedBlog, error } = await db
      .from("blogs")
      .update(blogData)
      .eq("id", blogId)
      .select()
      .single();

    if (error) {
      console.error("DB update error:", error);
      return res.status(500).json({ message: "Database update failed" });
    }

    return res.status(200).json({
      blog: updatedBlog,
      imgUploadUrl,
    });
  } catch (error) {
    console.error("editBlog Error:", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { data, error } = await db
      .from("blogs")
      .delete()
      .eq("id", blogId)
      .select()
      .single();

    const fileName = `${data.vendor_id}_blog_image`;
    const filePath = `${data.vendor_id}/${fileName}`;

    await db.storage.from("brand-logos").remove([filePath]);

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
