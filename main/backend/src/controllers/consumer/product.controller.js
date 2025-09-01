import db from "../../lib/db.js";

export const getAllProducts = async (req, res) => {
  try {
    const { data: products } = await db.from("products").select();

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getAllProducts controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const productId = req.query.id;
    const { data: products } = await db
      .from("products")
      .select()
      .eq("id", productId)
      .single();

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getProductById controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.query.category;
    const { data: products } = await db
      .from("products")
      .select()
      .eq("category", category)
      .single();

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getProductByCategory controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
