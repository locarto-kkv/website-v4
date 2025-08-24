import db from "../../lib/db.js";

export const getProducts = async (req, res) => {
  try {
    const { data: products } = await db.from("products").select();

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in getProducts controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
