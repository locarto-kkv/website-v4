// src/pages/consumer/dashboard/ConsumerReview.jsx
import React, { useState, useEffect } from "react";
import { formatDate } from "../../../lib/utils";
import { ConsumerReviewService } from "../../../services/consumer/consumerReviewService"; // Import service
import toast from 'react-hot-toast';

const CustomerReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true); // Changed initial state to true

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
  }, []); // Empty dependency array means this runs once on mount


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
        // Reduced spacing on mobile: space-y-3 instead of space-y-4
        <div className="space-y-3 md:space-y-4">
          {reviews.map((review) => (
            <div
              // Use review.id if available, otherwise fallback might be needed
              key={review.id || `review-${review.product_id}-${review.created_at}`}
              className="border border-gray-200 rounded-xl p-4 md:p-5 lg:p-6 hover:border-orange-300 transition-colors hover:shadow-sm bg-gray-50"
            >
              {/* Reduced margin on mobile */}
              <div className="flex flex-col sm:flex-row justify-between items-start mb-2 md:mb-3">
                 {/* Link to product if possible - needs product info in review data */}
                 <h3 className="font-bold text-base md:text-lg text-gray-900 mb-1 sm:mb-0">
                   {review.product_name || "Product Name"} {/* Display product name if available */}
                 </h3>
                <div className="flex text-yellow-400 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`fas fa-star text-sm md:text-base ${
                        // Use review.rating
                        i < (review.rating || 0) ? "" : "text-gray-300"
                      }`}
                    ></i>
                  ))}
                  <span className="ml-2 text-sm text-gray-600 font-medium">
                     {/* Use review.rating */}
                    ({review.rating || 0}/5)
                  </span>
                </div>
              </div>
              {/* Reduced margin on mobile */}
              <p className="text-gray-700 mb-2 md:mb-3 italic text-sm md:text-base">
                 {/* Use review.comment */}
                "{review.comment || "No comment provided."}"
              </p>
              <div className="flex justify-between items-center text-xs md:text-sm">
                <p className="text-gray-500">
                   {/* Use review.created_at */}
                  Reviewed on: {formatDate(review.created_at)}
                </p>
                 {/* Add Edit/Delete functionality later if needed */}
                {/* <button className="text-blue-500 hover:text-blue-700 font-medium text-xs px-2.5 py-1 md:px-3 rounded hover:bg-blue-50 transition-colors">
                  <i className="fas fa-edit mr-1"></i> Edit Review
                </button> */}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;