import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

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
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "replyToReview",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const removeReply = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const { data } = await db
      .from("reviews")
      .update({ vendor_reply: null })
      .eq("id", reviewId)
      .select()
      .single();

    res.status(200).json({ message: "Reply Deleted" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "deleteReply",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
