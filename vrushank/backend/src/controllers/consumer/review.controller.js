import db from "../../lib/vendor/db.js";

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
    console.log("Error in addReview controller: ", error.message);
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
    console.log("Error in uploadReviewImages controller: ", error.message);
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
    console.log("Error in deleteReview controller: ", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
