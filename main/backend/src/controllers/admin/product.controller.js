import db from "../../lib/db.js";

export const restrictProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { status } = req.body;

    const { data: products } = await db
      .from("products")
      .update({ status })
      .eq("id", productId);

    res.status(200).json(products);
  } catch (error) {
    console.log("Error in restrictProduct controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
