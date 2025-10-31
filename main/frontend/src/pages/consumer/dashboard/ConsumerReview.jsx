// src/pages/consumer/dashboard/ConsumerReview.jsx
import React, { useState, useEffect } from "react";
import { formatDate } from "../../../lib/utils";
import { ConsumerReviewService } from "../../../services/consumer/consumerReviewService";
import toast from "react-hot-toast";

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageIndexes, setImageIndexes] = useState({}); // Track current image index for each review

  // --- Fetch reviews when component mounts ---
  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const fetchedReviews = await ConsumerReviewService.getReviews();

        // Assuming the API returns an array of reviews
        setReviews(fetchedReviews || []);
      } catch (error) {
        toast.error("Failed to load your reviews.");
        console.error("Error fetching reviews:", error);
        setReviews([]); // Set to empty array on error
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // Initialize image indexes when reviews are loaded
  useEffect(() => {
    if (reviews.length > 0) {
      const initialIndexes = {};
      reviews.forEach((review) => {
        initialIndexes[review.id] = 0;
      });
      setImageIndexes(initialIndexes);
    }
  }, [reviews]);

  const nextImage = (reviewId, totalImages) => {
    setImageIndexes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] + 1) % totalImages,
    }));
  };

  const prevImage = (reviewId, totalImages) => {
    setImageIndexes((prev) => ({
      ...prev,
      [reviewId]: (prev[reviewId] - 1 + totalImages) % totalImages,
    }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100 text-center">
        <p className="text-gray-500">Loading your reviews...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 border border-gray-100">
      {reviews.length === 0 ? (
        <div className="text-center py-8 md:py-12 text-gray-500">
          <i className="fas fa-star-half-alt text-3xl md:text-4xl mb-3 md:mb-4 text-gray-300"></i>
          <p>You haven't written any reviews yet.</p>
          <p className="text-sm mt-2">
            Reviews you write after orders are delivered will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4 md:space-y-6">
          {reviews.map((review) => {
            const hasImages =
              review.review_images && review.review_images.length > 0;
            const currentImageIndex = imageIndexes[review.id] || 0;

            return (
              <div
                key={review.id}
                className="border border-gray-200 rounded-2xl overflow-hidden hover:border-orange-300 transition-all hover:shadow-md bg-white"
              >
                {/* Image Carousel Section */}
                {console.log(
                  review.id,
                  review.review_images[currentImageIndex]?.url
                )}

                {hasImages && (
                  <div className="relative bg-gray-100 aspect-video md:aspect-[21/9]">
                    <img
                      src={review.review_images[currentImageIndex]?.url}
                      alt={`Review image ${currentImageIndex + 1}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Navigation Buttons */}
                    {review.review_images.length > 1 && (
                      <>
                        <button
                          onClick={() =>
                            prevImage(review.id, review.review_images.length)
                          }
                          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all backdrop-blur-sm"
                          aria-label="Previous image"
                        >
                          <i className="fas fa-chevron-left text-sm md:text-base"></i>
                        </button>
                        <button
                          onClick={() =>
                            nextImage(review.id, review.review_images.length)
                          }
                          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full w-8 h-8 md:w-10 md:h-10 flex items-center justify-center transition-all backdrop-blur-sm"
                          aria-label="Next image"
                        >
                          <i className="fas fa-chevron-right text-sm md:text-base"></i>
                        </button>

                        {/* Image Counter */}
                        <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs md:text-sm backdrop-blur-sm">
                          {currentImageIndex + 1} /{" "}
                          {review.review_images.length}
                        </div>

                        {/* Dot Indicators */}
                        <div className="absolute bottom-3 md:bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 md:gap-2">
                          {review.review_images.map((_, idx) => (
                            <button
                              key={idx}
                              onClick={() =>
                                setImageIndexes((prev) => ({
                                  ...prev,
                                  [review.id]: idx,
                                }))
                              }
                              className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all ${
                                idx === currentImageIndex
                                  ? "bg-white w-4 md:w-6"
                                  : "bg-white/50 hover:bg-white/75"
                              }`}
                              aria-label={`Go to image ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Review Content */}
                <div className="p-4 md:p-6">
                  {/* Header with Product Name and Rating */}
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-2 mb-3 md:mb-4">
                    <h3 className="font-bold text-lg md:text-xl text-gray-900">
                      {review.product.name || "Product Name"}
                    </h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`fas fa-star text-base md:text-lg ${
                              i < (review.rating || 0) ? "" : "text-gray-300"
                            }`}
                          ></i>
                        ))}
                      </div>
                      <span className="text-sm md:text-base text-gray-600 font-semibold">
                        {review.rating || 0}/5
                      </span>
                    </div>
                  </div>

                  {/* Review Title */}
                  {review.title && (
                    <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                      "{review.title}"
                    </h4>
                  )}

                  {/* Review Content */}
                  {review.content && (
                    <p className="text-gray-700 mb-3 md:mb-4 text-sm md:text-base leading-relaxed">
                      {review.content}
                    </p>
                  )}

                  {/* Footer with Date */}
                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <p className="text-gray-500 text-xs md:text-sm flex items-center gap-2">
                      <i className="far fa-calendar text-gray-400"></i>
                      <span>Reviewed on {formatDate(review.created_at)}</span>
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
