import db from "../../lib/db.js";

export const getReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const { data: reviews } = await db
      .from("reviews")
      .select()
      .eq("product_id", productId);

    res.status(200).json(reviews);
  } catch (error) {
    console.log("Error in getReviews controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const replyToReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const { reply: vendor_reply } = req.body;

    const { data: updatedReview } = await db
      .from("reviews")
      .update({ vendor_reply })
      .eq("id", reviewId)
      .select()
      .single();

    res.status(200).json(updatedReview);
  } catch (error) {
    console.log("Error in replyToReview controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteReply = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const { data } = await db
      .from("reviews")
      .update({ vendor_reply: null })
      .eq("id", reviewId)
      .select()
      .single();

    res.status(200).json("Reply Deleted");
  } catch (error) {
    console.log("Error in deleteReply controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
