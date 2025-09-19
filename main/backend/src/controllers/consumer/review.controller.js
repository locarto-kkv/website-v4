import logger from "../../lib/logger.js";
import db from "../../lib/db.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getReviews = async (req, res) => {
  try {
    const productId = req.params.id;
    const { data: reviews } = await db
      .from("reviews")
      .select()
      .eq("product_id", productId);

    res.status(200).json(reviews);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getReviews",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { stars, title, content } = req.body;

    const { data: review } = await db
      .from("reviews")
      .insert({
        consumer_id: userId,
        product_id: productId,
        stars,
        title,
        content,
      })
      .select()
      .single();

    res.status(200).json(review);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "addReview",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const updateContent = req.body;

    const { data: review } = await db
      .from("reviews")
      .update(updateContent)
      .eq("product_id", productId)
      .eq("consumer_id", userId)
      .select()
      .single();

    res.status(200).json(review);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "editReview",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const uploadReviewImages = async (req, res) => {
  try {
    const reviewId = req.body.id;
    const files = req.files;
    const review_images = [];

    // console.log(files);

    files.forEach((file, index) => {
      review_images.push(file.backend_filepath);
    });

    const { data: review } = await db
      .from("reviews")
      .update({ review_images })
      .eq("id", productId)
      .select()
      .single();

    res.status(201).json(review);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "uploadReviewImages",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;

    const { data } = await db
      .from("reviews")
      .delete()
      .eq("id", reviewId)
      .select()
      .single();

    res.status(200).json("Review Deleted");
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "deleteReview",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
