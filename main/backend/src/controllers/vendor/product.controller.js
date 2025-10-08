import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { getFileUploadUrl, deleteFolder } from "../../services/file.service.js";
import { env } from "../../lib/env.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const addProduct = async (req, res) => {
  try {
    const { name, quantity, price, category, product_images = null } = req.body;

    const userId = req.user.id;

    const imgUploadUrls = [];
    const imgPublicUrls = [];

    const productData = {
      name,
      quantity,
      price,
      vendor_id: userId,
      category,
    };

    const { data: newProduct, error } = await db
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error) {
      logger({
        level: "error",
        message: error.message,
        location: __filename,
        func: "addProduct",
      });
      return res.status(400).json({ message: "Product already exists" });
    }

    if (product_images) {
      for (const image of product_images) {
        const imgUploadUrl = await getFileUploadUrl(
          newProduct.id,
          image,
          "product-images"
        );

        imgPublicUrls.push(
          `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/product-images/${imgUploadUrl.filePath}`
        );
        imgUploadUrls.push(imgUploadUrl);
      }

      const { data: updatedProduct, error } = await db
        .from("products")
        .update({ product_images: imgPublicUrls })
        .eq("id", newProduct.id)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ product: updatedProduct, imgUploadUrls });
    } else {
      res.status(201).json({ product: newProduct });
    }
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "addProduct",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const { name, quantity, price, category, product_images = null } = req.body;

    const userId = req.user.id;
    const imgUploadUrls = [];
    const imgPublicUrls = [];

    const productData = {
      name,
      quantity,
      price,
      vendor_id: userId,
      category,
    };

    if (product_images) {
      for (const image of product_images) {
        const imgUploadUrl = await getFileUploadUrl(
          productId,
          image,
          "product-images"
        );

        imgPublicUrls.push(
          `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/product-images/${imgUploadUrl.filePath}`
        );
        imgUploadUrls.push(imgUploadUrl);
      }

      productData.product_images = imgPublicUrls;
    }

    const { data: updatedProduct } = await db
      .from("products")
      .update(productData)
      .eq("id", productId)
      .select()
      .single();

    res.status(200).json({ product: updatedProduct, imgUploadUrls });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "editProduct",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    await db.from("products").delete().eq("id", productId);

    await deleteFolder(productId, "product-images");

    res.status(200).json({ message: "Product Removed Successfully" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "removeProduct",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
