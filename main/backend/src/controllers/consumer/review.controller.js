import logger from "../../lib/logger.js";
import db from "../../lib/db.js";
import { env } from "../../lib/env.js";
import { getFileUploadUrl, deleteFolder } from "../../services/file.service.js";

import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);

export const getReviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data: reviews } = await db
      .from("reviews")
      .select()
      .eq("consumer_id", userId);

    res.status(200).json(reviews);
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "getReviewsByProduct",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

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
      func: "getReviewsByProduct",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const addReview = async (req, res) => {
  try {
    const { stars, title, content, review_images = null } = req.body;

    const userId = req.user.id;
    const { productId } = req.params;

    const imgUploadUrls = [];
    const imgPublicUrls = [];

    const reviewData = {
      consumer_id: userId,
      product_id: productId,
      stars,
      title,
      content,
    };

    const { data: newReview } = await db
      .from("review")
      .insert(reviewData)
      .select()
      .single();

    if (review_images) {
      for (const image of review_images) {
        const imgUploadUrl = await getFileUploadUrl(
          newReview.id,
          image,
          "review-images"
        );

        imgPublicUrls.push(
          `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/review-images/${imgUploadUrl.filePath}`
        );
        imgUploadUrls.push(imgUploadUrl);
      }

      const { data: updatedReview, error } = await db
        .from("products")
        .update({ review_images: imgPublicUrls })
        .eq("id", newReview.id)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ product: updatedReview, imgUploadUrls });
    } else {
      res.status(201).json({ product: newReview });
    }
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
    const { reviewId } = req.params;

    const { stars, title, content, review_images = null } = req.body;

    const imgUploadUrls = [];
    const imgPublicUrls = [];

    const reviewData = {
      stars,
      title,
      content,
    };

    if (review_images) {
      for (const image of review_images) {
        const imgUploadUrl = await getFileUploadUrl(
          reviewId,
          image,
          "review-images"
        );

        imgPublicUrls.push(
          `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/review-images/${imgUploadUrl.filePath}`
        );
        imgUploadUrls.push(imgUploadUrl);
      }
      reviewData.review_images = imgPublicUrls;
    }

    const { data: updatedReview } = await db
      .from("reviews")
      .update(reviewData)
      .eq("id", reviewId)
      .select()
      .single();

    res.status(200).json({ review: updatedReview, imgUploadUrls });
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

export const removeReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    await db.from("reviews").delete().eq("id", reviewId);

    await deleteFolder(reviewId, "review-images");

    res.status(200).json({ message: "Review Removed Successfully" });
  } catch (error) {
    logger({
      level: "error",
      message: error.message,
      location: __filename,
      func: "removeReview",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
