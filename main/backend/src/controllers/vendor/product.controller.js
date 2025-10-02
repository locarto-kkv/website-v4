import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import {
  getImgUploadUrl,
  deleteFolder,
} from "../../services/vendor/file.service.js";

import dotenv from "dotenv";
dotenv.config();

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getProducts = async (req, res) => {
  try {
    const userId = req.params?.id;

    const { data: products } = userId
      ? await db.from("products").select().eq("vendor_id", userId)
      : await db.from("products").select();

    res.status(200).json(products);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getProducts",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      quantity,
      price,
      category,
      images_metadata = null,
    } = req.body;
    const userId = req.user.id;

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
      logger.error(error);
      return res.status(400).json({ message: "Product already exists" });
    }

    if (images_metadata) {
      const imgUploadUrls = await getImgUploadUrl(
        newProduct.id,
        images_metadata
      );
      const imgPublicUrls = imgUploadUrls.map(
        (image) =>
          `${process.env.SUPABASE_PROJECT_URL}/storage/v1/object/public/product-images/${image.filePath}`
      );

      const { data: updatedProduct } = await db
        .from("products")
        .update({ product_images: imgPublicUrls })
        .eq("id", newProduct.id)
        .select()
        .single();

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

export const removeProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;

    const { data: product } = await db
      .from("products")
      .delete()
      .eq("id", productId);

    await deleteFolder("product-images", productId);

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

export const editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const { data: product } = await db
      .from("products")
      .update(productData)
      .eq("id", productId)
      .select()
      .single();

    res.status(200).json(product);
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
