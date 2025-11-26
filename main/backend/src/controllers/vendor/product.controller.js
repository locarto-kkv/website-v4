import db from "../../lib/db.js";
import logger from "../../lib/logger.js";
import { getFileUploadUrl, deleteFolder } from "../../services/file.service.js";
import { env } from "../../lib/env.js";
import { v4 as uuidv4 } from "uuid";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      quantity,
      description,
      price,
      weight,
      category,
      product_images = null,
      attribute_type = null,
      attribute_name = null,
    } = req.body;

    const userId = req.user.id;
    const product_uuid = uuidv4();

    const imgUploadUrls = [];
    const imgPublicUrls = [];

    const productData = {
      name,
      quantity,
      price,
      weight,
      description,
      vendor_id: userId,
      category,
      product_uuid,
      base: true,
      attribute_type,
      attribute_name,
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
          image.name,
          image,
          "product-images"
        );
        imgPublicUrls.push({
          name: image.name,
          url: `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/product-images/${imgUploadUrl.filePath}`,
        });
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
      res.status(201).json({ product: "newProduct" });
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

export const addProductVariant = async (req, res) => {
  try {
    const {
      name,
      quantity,
      description,
      price,
      weight,
      category,
      product_images = null,
      attribute_type,
      attribute_name,
      product_uuid,
    } = req.body;

    const userId = req.user.id;

    const imgUploadUrls = [];
    const imgPublicUrls = [];

    const productData = {
      name,
      quantity,
      price,
      weight,
      description,
      category,
      vendor_id: userId,
      product_uuid,
      attribute_type,
      attribute_name,
      base: false,
    };

    const { data: newProductVariant, error } = await db
      .from("products")
      .insert(productData)
      .select()
      .single();

    if (error) throw error;

    if (product_images) {
      for (const image of product_images) {
        const imgUploadUrl = await getFileUploadUrl(
          newProduct.id,
          image.name,
          image,
          "product-images"
        );
        imgPublicUrls.push({
          name: image.name,
          url: `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/product-images/${imgUploadUrl.filePath}`,
        });
        imgUploadUrls.push(imgUploadUrl);
      }

      const { data: updatedProductVariant, error } = await db
        .from("products")
        .update({ product_images: imgPublicUrls })
        .eq("id", newProduct.id)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ product: updatedProductVariant, imgUploadUrls });
    } else {
      res.status(201).json({ product: newProductVariant });
    }
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "addProductVariant",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productData, imagesUpdated } = req.body;
    const userId = req.user.id;

    const imgUploadUrls = [];
    const imgPublicUrls = [];

    productData.vendor_id = userId;

    if (imagesUpdated) {
      for (const image of productData.product_images) {
        // ✅ Case 1: URL already matches expected file naming convention
        if (image.url && image.url.includes(image.name)) {
          console.log("CASE 1: ", image);

          imgPublicUrls.push(image);
          continue;
        }

        // ✅ Case 2: URL exists but name doesn’t match → move it
        if (image.url && !image.url.includes(image.name)) {
          console.log("CASE 2: ", image);

          try {
            // Extract current file path from full public URL
            const currentPath = image.url.split("/product-images/")[1];
            const newFilePath = `${productId}/${productId}_${image.name}`;

            console.log(currentPath, newFilePath);
            const resp = await db.storage
              .from("product-images")
              .remove([newFilePath]);
            console.log(resp.data, resp.error);

            const { data: moveData, error: moveError } = await db.storage
              .from("product-images")
              .move(currentPath, newFilePath);

            if (moveError) throw moveError;

            const newUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/product-images/${newFilePath}`;

            imgPublicUrls.push({
              name: image.name,
              url: newUrl,
            });

            continue;
          } catch (moveErr) {
            logger({
              level: "error",
              message: `Failed to move image ${image.name}: ${moveErr.message}`,
              location: __filename,
              func: "editProduct",
            });
          }
        }

        // ✅ Case 3: No URL — upload file
        if (!image.url) {
          console.log("CASE 3: ", image);
          // remove the file if it exists
          const newFilePath = `${productId}/${productId}_${image.name}`;

          console.log(newFilePath);
          const resp = await db.storage
            .from("product-images")
            .remove([newFilePath]);
          console.log(resp.data, resp.error);

          const imgUploadUrl = await getFileUploadUrl(
            productId,
            image.name,
            image,
            "product-images"
          );
          console.log(imgUploadUrl);

          const filePath = imgUploadUrl.filePath;
          const newUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/product-images/${filePath}`;

          imgPublicUrls.push({
            name: image.name,
            url: newUrl,
          });

          imgUploadUrls.push(imgUploadUrl);
        }
      }

      productData.product_images = imgPublicUrls;
    }

    const { data: updatedProduct, error } = await db
      .from("products")
      .update(productData)
      .eq("id", productId)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ product: updatedProduct, imgUploadUrls });
  } catch (error) {
    console.log(error);

    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "editProduct",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const { data, error } = await db
      .from("products")
      .delete()
      .eq("id", productId);

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
