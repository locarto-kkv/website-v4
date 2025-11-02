// src/pages/consumer/dashboard/ConsumerOrders.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useConsumerDataStore } from "../../../store/consumer/consumerDataStore.jsx"; //
import { formatCurrency, formatDate } from "../../../lib/utils.js"; //

const CustomerOrders = () => {
  const { orders = [] } = useConsumerDataStore(); //
  const navigate = useNavigate(); // Initialize navigate

  const [filterStatus, setFilterStatus] = useState("all"); //
  const [searchQuery, setSearchQuery] = useState(""); //
  const [sortBy, setSortBy] = useState("recent"); //

  const safeOrders = orders || []; //

  const filteredAndSortedOrders = useMemo(() => {
    let result = safeOrders.filter((order) => {
      //
      const matchesStatus =
        filterStatus === "all" ||
        order.order_status?.toLowerCase() === filterStatus; //

      const lowerSearch = searchQuery.toLowerCase(); //

      const matchesSearch =
        `ORD${order.id}`.toLowerCase().includes(lowerSearch) || //
        order.product?.name?.toLowerCase().includes(lowerSearch) || //
        order.payment_mode?.toLowerCase().includes(lowerSearch); //

      return matchesStatus && matchesSearch; //
    });

    result.sort((a, b) => {
      //
      switch (
        sortBy //
      ) {
        case "amount_high":
          return (b.amount || 0) - (a.amount || 0); //
        case "amount_low":
          return (a.amount || 0) - (b.amount || 0); //
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at); //
        default: // Default case handles 'recent' //
          return new Date(b.created_at) - new Date(a.created_at); //
      }
    });

    return result; //
  }, [filterStatus, searchQuery, sortBy, safeOrders]); //

  const statusFilters = ["all", "pending", "delivered", "cancelled", "shipped"]; //

  const showButton = (order) => {
    const isDelivered = order.order_status?.toLowerCase() === "delivered";
    const hasReview = order.review;
    const isCancelled = order.order_status?.toLowerCase() === "cancelled";

    if (isCancelled) return;
    if (!isDelivered) {
      return (
        <button className="flex-1 px-3 py-2 md:px-4 bg-white hover:bg-gray-100 rounded-lg font-semibold text-sm transition-colors border border-gray-200 text-gray-700">
          Track Order
        </button>
      );
    } else if (isDelivered && !hasReview) {
      return (
        <button
          onClick={() => navigate(`/consumer/add-review/${order.id}`)} // Navigate to AddReviewPage with order ID //
          className="flex-1 px-3 py-2 md:px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all" //
        >
          Write Review
        </button>
      );
    } else if (isDelivered && hasReview)
      return (
        <button
          onClick={() =>
            navigate(`/consumer/dashboard/reviews`, {
              state: { scrollToId: order.review.id },
            })
          }
          className="flex-1 px-3 py-2 md:px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all" //
        >
          View Review
        </button>
      );
  };

  return (
    // Reduced spacing on mobile: space-y-4 instead of space-y-6
    <div className="space-y-4 md:space-y-5 lg:space-y-6">
      {/* Controls - reduced padding on mobile */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>

            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery} //
              onChange={(e) => setSearchQuery(e.target.value)} //
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm" //
            />
          </div>
          {/* Filter */}
          <div>
            <select
              value={filterStatus} //
              onChange={(e) => setFilterStatus(e.target.value)} //
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" //
            >
              {statusFilters.map(
                (
                  s //
                ) => (
                  <option key={s} value={s}>
                    {s === "all"
                      ? "All Statuses"
                      : s.charAt(0).toUpperCase() + s.slice(1)}
                  </option>
                )
              )}
            </select>
          </div>
          {/* Sort */}
          <div>
            <select
              value={sortBy} //
              onChange={(e) => setSortBy(e.target.value)} //
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm" //
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Value</option>
              <option value="amount_low">Lowest Value</option>
            </select>
          </div>
        </div>
      </div>
      {/* Orders List - reduced padding on mobile */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3 md:p-4 lg:p-6">
        {filteredAndSortedOrders.length === 0 ? ( //
          <div className="text-center py-8 md:py-12 text-gray-500">
            <i className="fas fa-box-open text-3xl md:text-4xl mb-3 md:mb-4 text-gray-300"></i>

            <p className="text-sm sm:text-base">
              No orders found matching your filters.
            </p>
          </div>
        ) : (
          // Reduced spacing on mobile: space-y-3 instead of space-y-4
          <div className="space-y-3 md:space-y-4">
            {filteredAndSortedOrders.map((order) => {
              //
              const statusColorMap = {
                //
                delivered: "bg-green-100 text-green-800", //
                pending: "bg-yellow-100 text-yellow-800", //
                cancelled: "bg-red-100 text-red-800", //
                shipped: "bg-blue-100 text-blue-800", //
              };
              const statusClass =
                statusColorMap[order.order_status?.toLowerCase()] || //
                "bg-gray-100 text-gray-700"; //

              return (
                <div
                  key={order.id} //
                  className="bg-gray-50 rounded-xl border border-gray-200 p-3 md:p-4 hover:border-orange-300 transition-all" //
                >
                  {/* Header - reduced padding and margin on mobile */}
                  <div className="flex justify-between items-center pb-2 md:pb-3 border-b border-gray-200 mb-2 md:mb-3">
                    <div>
                      <p className="font-bold text-sm text-gray-900">
                        Order #ORD{order.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 md:px-3 md:py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${statusClass}`} //
                    >
                      {order.order_status
                        ? order.order_status.charAt(0).toUpperCase() + //
                          order.order_status.slice(1) //
                        : "Unknown"}
                    </span>
                  </div>

                  {/* Body - reduced gap on mobile */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                      <img
                        src={
                          order.product?.product_images || //
                          "https://placehold.co/150x150/e2e8f0/e2e8f0?text=Product" //
                        }
                        alt={order.product?.name} //
                        className="w-full h-full object-cover" //
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-sm md:text-base text-gray-900 leading-tight mb-1">
                        {order.product?.name}
                      </h3>
                      <p className="text-gray-600 text-xs md:text-sm mb-0.5 md:mb-1 capitalize">
                        Payment Mode: {order.payment_mode || "N/A"}
                      </p>
                      <p className="text-gray-600 text-xs md:text-sm mb-0.5 md:mb-1 capitalize">
                        Payment Status: {order.payment_status || "N/A"}
                      </p>
                      <p className="text-base md:text-lg font-bold text-gray-900">
                        {formatCurrency(order.amount)}
                      </p>
                    </div>
                  </div>

                  {/* Footer - reduced margin and padding on mobile */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                    {showButton(order)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerOrders; //
