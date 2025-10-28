// src/pages/consumer/dashboard/AddReviewPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useConsumerDataStore } from "../../../store/consumer/consumerDataStore";
import { ConsumerReviewService } from "../../../services/consumer/consumerReviewService";
import { formatCurrency } from "../../../lib/utils";

// Star Rating Component
const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => setRating(star)}
          className={`text-3xl transition-colors duration-150 focus:outline-none ${
            star <= rating
              ? "text-yellow-400"
              : "text-gray-300 hover:text-yellow-200"
          }`}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </div>
  );
};

const AddReviewPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { orders } = useConsumerDataStore(); // Get orders from context
  const { addReview } = ConsumerReviewService;

  const [order, setOrder] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Find the specific order from context based on orderId
  useEffect(() => {
    setLoading(true);
    if (orders && orders.length > 0) {
      const foundOrder = orders.find((o) => String(o.id) === String(orderId));
      if (foundOrder) {
        // Check if the order status allows reviewing (e.g., delivered)
        if (foundOrder.order_status?.toLowerCase() === "delivered") {
          setOrder(foundOrder);
        } else {
          toast.error("You can only review delivered orders.");
          navigate("/consumer/dashboard/orders"); // Redirect if not delivered
        }
      } else {
        toast.error("Order not found.");
        navigate("/consumer/dashboard/orders"); // Redirect if order not found
      }
    }
    setLoading(false);
  }, [orderId, orders, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a rating.");
      return;
    }
    if (!comment.trim()) {
      toast.error("Please write a comment.");
      return;
    }
    if (!order || !order.product_id) {
      toast.error("Product information is missing.");
      return;
    }

    setSubmitting(true);
    toast.loading("Submitting review...");

    try {
      await addReview(order.product_id, {
        // Pass productId from the order
        rating: rating,
        comment: comment,
        // You might need to pass order_id as well depending on your backend
        order_id: order.id,
      });

      toast.dismiss();
      toast.success("Review submitted successfully!");
      // Optionally refetch reviews if your ConsumerReview page depends on context
      // await fetchReviews(); // Assuming you add a fetchReviews to consumerDataContext
      navigate("/consumer/dashboard/reviews"); // Navigate to the reviews page
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to submit review.");
      console.error("Error submitting review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !order) {
    return (
      <div className="flex justify-center items-center h-64">
        {loading
          ? "Loading order details..."
          : "Order not found or cannot be reviewed."}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 lg:p-8 border border-gray-100 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4 md:mb-6 pb-4 border-b">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">
          Write a Review
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-gray-500 hover:text-gray-700"
        >
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Order/Product Info */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl border">
        <img
          src={
            order.product?.product_images?.[0]?.url ||
            "https://placehold.co/80x80/e2e8f0/94a3b8?text=IMG"
          }
          alt={order.product?.name || "Product"}
          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg flex-shrink-0 border"
        />
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 text-sm md:text-base">
            {order.product?.name || "Product Name"}
          </h3>
          <p className="text-xs text-gray-500">Order #ORD{order.id}</p>
          <p className="text-sm font-semibold text-orange-600 mt-1">
            {formatCurrency(order.amount)}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Rating Section */}
        <div>
          <label className="block text-base font-semibold text-gray-800 mb-3">
            Your Rating *
          </label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        {/* Comment Section */}
        <div>
          <label
            htmlFor="comment"
            className="block text-base font-semibold text-gray-800 mb-2"
          >
            Your Review *
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="5"
            className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm md:text-base resize-none"
            placeholder="Share your experience with this product..."
            required
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={submitting}
            className={`px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 text-sm md:text-base ${
              submitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {submitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i> Submitting...
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i> Submit Review
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddReviewPage;
