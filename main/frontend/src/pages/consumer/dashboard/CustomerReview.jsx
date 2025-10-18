// src/pages/consumer/dashboard/CustomerReviews.jsx
import React, { useState, useEffect } from 'react';
// Import your review service if you plan to fetch real data
// import { ReviewService } from "../../../services/consumer/consumerReviewService"; // Adjust path

// Helper to format date (or import from utils)
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    } catch (e) {
        console.error("Error formatting date:", dateString, e);
        return 'Invalid Date';
    }
};


const CustomerReviews = () => {
    // --- Mock Data (Replace with data fetching using ReviewService) ---
    const [reviews, setReviews] = useState([
        { id: 1, product: "Mechanical Keyboard", rating: 5, comment: "Excellent product! Very clicky and satisfying to type on. Great build quality.", date: "2024-01-16" },
        { id: 2, product: "Gaming Mouse", rating: 4, comment: "Good quality mouse, comfortable grip, but the software could be better.", date: "2024-01-18" },
        { id: 3, product: "Wireless Headphones", rating: 5, comment: "Amazing sound quality and battery life!", date: "2024-02-01" },
    ]);
    const [loading, setLoading] = useState(false); // Example loading state

    // --- Example Data Fetching (Uncomment and adapt when ready) ---
    // useEffect(() => {
    //     const fetchReviews = async () => {
    //         setLoading(true);
    //         try {
    //             const fetchedReviews = await ReviewService.getReviews(); // Assuming getReviews fetches reviews for the logged-in consumer
    //             setReviews(fetchedReviews);
    //         } catch (error) {
    //             console.error("Failed to fetch reviews:", error);
    //             // Handle error (e.g., show toast notification)
    //         } finally {
    //             setLoading(false);
    //         }
    //     };
    //     fetchReviews();
    // }, []);
    // --- End Example Data Fetching ---

    if (loading) {
        return (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 text-center">
                <p className="text-gray-500">Loading reviews...</p>
            </div>
        );
    }


    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Title handled by layout */}
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">My Reviews</h2> */}

            {reviews.length === 0 ? (
                 <div className="text-center py-12 text-gray-500">
                     <i className="fas fa-star-half-alt text-4xl mb-4 text-gray-300"></i>
                     <p>You haven't written any reviews yet.</p>
                     <p className="text-sm mt-2">Share your thoughts on products you've purchased!</p>
                 </div>
            ) : (
                 <div className="space-y-4">
                     {reviews.map((review) => (
                         <div key={review.id} className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors hover:shadow-sm bg-gray-50">
                             <div className="flex flex-col sm:flex-row justify-between items-start mb-3">
                                 <h3 className="font-bold text-lg text-gray-900 mb-1 sm:mb-0">{review.product || 'Product Name'}</h3>
                                 <div className="flex text-yellow-400 flex-shrink-0">
                                     {[...Array(5)].map((_, i) => (
                                         <i key={i} className={`fas fa-star ${i < review.rating ? "" : "text-gray-300"}`}></i>
                                     ))}
                                     <span className="ml-2 text-sm text-gray-600 font-medium">({review.rating}/5)</span>
                                 </div>
                             </div>
                             <p className="text-gray-700 mb-3 italic">"{review.comment || 'No comment provided.'}"</p>
                             <div className="flex justify-between items-center text-sm">
                                 <p className="text-gray-500">Reviewed on: {formatDate(review.date)}</p>
                                 <button className="text-blue-500 hover:text-blue-700 font-medium text-xs px-3 py-1 rounded hover:bg-blue-50 transition-colors">
                                     <i className="fas fa-edit mr-1"></i> Edit Review
                                 </button>
                             </div>
                         </div>
                     ))}
                 </div>
            )}
        </div>
    );
};

export default CustomerReviews;