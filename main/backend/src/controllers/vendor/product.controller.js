import db from "../../lib/db.js";
import fs from "fs";

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
    const { name, quantity, price } = req.body;
    const userId = req.user.id;
    const newProduct = { name, quantity, price, vendor_id: userId };

    const { data: product, error } = await db
      .from("products")
      .insert(newProduct)
      .select()
      .single();

    if (error) {
      console.log(error);
      return res.status(400).json({ message: "Product already exists" });
    }

    fs.mkdirSync(`./uploads/products/${product.id}`);

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in addProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const productId = req.body.id;
    const files = req.files;
    const product_images = [];

    // console.log(files);

    files.forEach((file, index) => {
      product_images.push(file.backend_filepath);
    });

    const { data: product } = await db
      .from("products")
      .update({ product_images })
      .eq("id", productId)
      .select()
      .single();

    res.status(201).json(product);
  } catch (error) {
    console.log("Error in uploadImages controller: ", error.message);
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

    res.status(200).json({ message: "Product Removed Successfully" });
  } catch (error) {
    console.log("Error in removeProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { name, price, quantity } = req.body;

    const { data: product } = await db
      .from("products")
      .update({ name, price, quantity })
      .eq("id", productId)
      .select()
      .single();

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in editProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
