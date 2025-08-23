import db from "../../lib/vendor/db.js";

export const getListItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type: list_type } = req.body;

    const { data: listItems } = await db
      .from("consumer_lists")
      .select()
      .eq("consumer_id", userId)
      .eq("list_type", list_type);

    res.status(200).json(listItems);
  } catch (error) {
    console.log("Error in getListItems controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type: list_type, quantity } = req.body;
    const productId = req.params.id;

    const { data: updatedList } = await db
      .from("consumer_lists")
      .upsert(
        {
          consumer_id: userId,
          list_type,
          product_id: productId,
          quantity,
        },
        { onConflict: ["consumer_id", "list_type", "product_id"] }
      )
      .select()
      .single();

    res.status(200).json(updatedList);
  } catch (error) {
    console.log("Error in updateList controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeFromList = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type: list_type } = req.body;
    const productId = req.params.id;

    const { data } = await db
      .from("consumer_lists")
      .delete()
      .eq("consumer_id", userId)
      .eq("list_type", list_type)
      .eq("product_id", productId);

    res.status(200).json("Item Removed From List");
  } catch (error) {
    console.log("Error in replyToReview controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
