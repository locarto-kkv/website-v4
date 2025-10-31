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
      .select("*, product: reviews_product_id_fkey(*)")
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
    const { content, rating, review_images = null } = req.body;

    const userId = req.user.id;
    const { productId } = req.params;

    const imgUploadUrls = [];
    const imgPublicUrls = [];

    const reviewData = {
      content,
      rating,
      consumer_id: userId,
      product_id: productId,
    };

    const { data: newReview } = await db
      .from("reviews")
      .insert(reviewData)
      .select()
      .single();

    console.log(newReview);

    if (review_images) {
      if (review_images.length > 0) {
        for (const image of review_images) {
          const imgUploadUrl = await getFileUploadUrl(
            newReview.id,
            image.name,
            image,
            "review-images"
          );

          imgPublicUrls.push(
            `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/review-images/${imgUploadUrl.filePath}`
          );
          imgUploadUrls.push(imgUploadUrl);
        }
      }

      const { data: updatedReview, error } = await db
        .from("reviews")
        .update({ review_images: imgPublicUrls })
        .eq("id", newReview.id)
        .select()
        .single();

      if (error) throw error;

      res.status(201).json({ review: updatedReview, imgUploadUrls });
    } else {
      res.status(201).json({ review: newReview });
    }
  } catch (error) {
    logger({
      level: "error",
      message: error,
      location: __filename,
      func: "addReview",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const editReview = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const { reviewData, imagesUpdated } = req.body;

    const userId = req.user.id;

    const imgUploadUrls = [];
    const imgPublicUrls = [];

    reviewData.consumer_id = userId;

    if (imagesUpdated) {
      for (const image of reviewData.review_images) {
        // ✅ Case 1: URL already matches expected file naming convention
        if (image.url && image.url.includes(image.name)) {
          console.log("CASE 1: ", image);

          imgPublicUrls.push(image);
          continue;
        }

        // ✅ Case 2: URL exists but name doesn’t match → move it
        if (image.url && !image.url.includes(image.name)) {
          console.log("CASE 2: ", image);

          try {
            // Extract current file path from full public URL
            const currentPath = image.url.split("/review-images/")[1];
            const newFilePath = `${reviewId}/${reviewId}_${image.name}`;

            console.log(currentPath, newFilePath);
            const resp = await db.storage
              .from("review-images")
              .remove([newFilePath]);
            console.log(resp.data, resp.error);

            const { data: moveData, error: moveError } = await db.storage
              .from("review-images")
              .move(currentPath, newFilePath);

            if (moveError) throw moveError;

            const newUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/review-images/${newFilePath}`;

            imgPublicUrls.push({
              name: image.name,
              url: newUrl,
            });

            continue;
          } catch (moveErr) {
            logger({
              level: "error",
              message: `Failed to move image ${image.name}: ${moveErr.message}`,
              location: __filename,
              func: "editReview",
            });
          }
        }

        // ✅ Case 3: No URL — upload file
        if (!image.url) {
          console.log("CASE 3: ", image);
          // remove the file if it exists
          const newFilePath = `${reviewId}/${reviewId}_${image.name}`;

          console.log(newFilePath);
          const resp = await db.storage
            .from("review-images")
            .remove([newFilePath]);
          console.log(resp.data, resp.error);

          const imgUploadUrl = await getFileUploadUrl(
            reviewId,
            image.name,
            image,
            "review-images"
          );
          console.log(imgUploadUrl);

          const filePath = imgUploadUrl.filePath;
          const newUrl = `${env.SUPABASE_PROJECT_URL}/storage/v1/object/public/review-images/${filePath}`;

          imgPublicUrls.push({
            name: image.name,
            url: newUrl,
          });

          imgUploadUrls.push(imgUploadUrl);
        }
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

export const deleteReview = async (req, res) => {
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
      func: "deleteReview",
    });
    res.status(500).json({ message: "Internal Server Error" });
  }
};
