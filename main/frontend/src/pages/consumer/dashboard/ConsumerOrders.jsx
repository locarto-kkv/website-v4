// src/pages/consumer/dashboard/ConsumerOrders.jsx
import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useConsumerDataStore } from "../../../store/consumer/consumerDataStore.jsx";
import { formatCurrency, formatDate } from "../../../lib/utils.js";

const CustomerOrders = () => {
  const orders = useConsumerDataStore((s) => s.orders);
  const navigate = useNavigate();

  console.log(orders);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");

  const safeOrders = orders || [];

  // Flatten items across all orders
  const flattenedItems = useMemo(() => {
    return safeOrders.flatMap((order) =>
      order.items.map((item) => ({ order, item }))
    );
  }, [safeOrders]);

  // Filtering + sorting FOR ITEMS (not orders)
  const filteredAndSortedItems = useMemo(() => {
    let result = flattenedItems.filter(({ order, item }) => {
      const lowerSearch = searchQuery.toLowerCase();

      const matchesStatus =
        filterStatus === "all" ||
        item.order_status?.toLowerCase() === filterStatus;

      const matchesSearch =
        `ORD${order.id}`.toLowerCase().includes(lowerSearch) ||
        item.product?.name?.toLowerCase().includes(lowerSearch) ||
        order.payment_mode?.toLowerCase().includes(lowerSearch);

      return matchesStatus && matchesSearch;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "amount_high":
          return (
            (b.item.product.price * b.item.quantity || 0) -
            (a.item.product.price * a.item.quantity || 0)
          );
        case "amount_low":
          return (
            (a.item.product.price * a.item.quantity || 0) -
            (b.item.product.price * b.item.quantity || 0)
          );
        case "oldest":
          return new Date(a.order.created_at) - new Date(b.order.created_at);
        default:
          return new Date(b.order.created_at) - new Date(a.order.created_at);
      }
    });

    return result;
  }, [flattenedItems, searchQuery, filterStatus, sortBy]);

  const statusFilters = [
    "all",
    "pending",
    "delivered",
    "cancelled",
    "shipped",
    "confirmed",
  ];

  // Button logic (now uses ITEM)
  const showButton = (item) => {
    const status = item.order_status?.toLowerCase();
    const hasReview = item.review;

    if (status === "cancelled") return null;

    if (status !== "delivered") {
      return (
        <button className="flex-1 px-3 py-2 md:px-4 bg-white hover:bg-gray-100 rounded-lg font-semibold text-sm transition-colors border border-gray-200 text-gray-700">
          Track Order
        </button>
      );
    }

    if (status === "delivered" && !hasReview) {
      return (
        <button
          onClick={() => navigate(`/consumer/add-review/${item.id}`)}
          className="flex-1 px-3 py-2 md:px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
        >
          Write Review
        </button>
      );
    }

    if (status === "delivered" && hasReview) {
      return (
        <button
          onClick={() =>
            navigate(`/consumer/dashboard/reviews`, {
              state: { scrollToId: item.review.id },
            })
          }
          className="flex-1 px-3 py-2 md:px-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all"
        >
          View Review
        </button>
      );
    }
  };

  return (
    <div className="space-y-4 md:space-y-5 lg:space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-3 md:p-4 lg:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 md:gap-4">
          <div className="md:col-span-2 relative">
            <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
            >
              {statusFilters.map((s) => (
                <option key={s} value={s}>
                  {s === "all"
                    ? "All Statuses"
                    : s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Value</option>
              <option value="amount_low">Lowest Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-3 md:p-4 lg:p-6">
        {filteredAndSortedItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-box-open text-3xl text-gray-300 mb-3"></i>
            <p>No orders found matching your filters.</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredAndSortedItems.map(({ order, item }) => {
              const status = item.order_status?.toLowerCase();

              const statusColorMap = {
                delivered: "bg-green-100 text-green-800",
                pending: "bg-yellow-100 text-yellow-800",
                cancelled: "bg-red-100 text-red-800",
                shipped: "bg-blue-100 text-blue-800",
                confirmed: "bg-blue-100 text-blue-800",
              };

              const statusClass =
                statusColorMap[status] || "bg-gray-100 text-gray-700";

              return (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl border border-gray-200 p-3 md:p-4 hover:border-orange-300 transition-all"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-2">
                    <div>
                      <p className="font-bold text-sm text-gray-900">
                        Order #ORD{order.id}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(order.created_at)}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-bold ${statusClass}`}
                    >
                      {item.order_status
                        ? item.order_status.charAt(0).toUpperCase() +
                          item.order_status.slice(1)
                        : "Unknown"}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mx-auto sm:mx-0">
                      <img
                        src={
                          item.product?.product_images?.[0]?.url ||
                          "https://placehold.co/150x150/e2e8f0/e2e8f0?text=Product"
                        }
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-bold text-sm text-gray-900 mb-1">
                        {item.product?.name}
                      </h3>

                      <p className="text-gray-600 text-xs mb-1">
                        Qty: {item.quantity}
                      </p>

                      <p className="text-gray-600 text-xs mb-1 capitalize">
                        Payment Mode: {order.payment_mode}
                      </p>

                      <p className="text-base font-bold text-gray-900">
                        Total:{" "}
                        {formatCurrency(item.product?.price * item.quantity)}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-3 pt-3 border-t border-gray-200">
                    {showButton(item)}
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

export default CustomerOrders;
