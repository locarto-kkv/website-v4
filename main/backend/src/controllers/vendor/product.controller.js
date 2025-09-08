import db from "../../lib/db.js";
import dotenv from "dotenv";
dotenv.config();

export const getProducts = async (req, res) => {
  try {
    const userId = req.params?.id;

    const { data: products } = userId
      ? await db.from("products").select().eq("vendor_id", userId)
      : await db.from("products").select();

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getProducts controller: ", error.message);
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
      console.log("Error in addProduct 1: ", error);
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
    console.log("Error in addProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getImgUploadUrl = async (productId, files) => {
  try {
    const imgUploadUrls = [];

    for (const file of files) {
      const fileType = file.type;
      const fileName = file.name;
      const fileSize = file.size;

      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const formattedFileName = `${productId}_${timestamp}_${fileName}`;

      const filePath = `${productId}/${formattedFileName}`;

      const { data, error } = await db.storage
        .from("product-images")
        .createSignedUploadUrl(filePath);

      if (error) throw error;

      imgUploadUrls.push({
        uploadUrl: data.signedUrl,
        filePath,
        fileType,
        fileSize,
      });
    }

    return imgUploadUrls;
  } catch (err) {
    console.log("Error in getImgUploadUrl:", err);
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

    res.status(200).json({ message: "Product Removed Successfully" });
  } catch (error) {
    console.log("Error in removeProduct controller: ", error.message);
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
    console.log("Error in editProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
