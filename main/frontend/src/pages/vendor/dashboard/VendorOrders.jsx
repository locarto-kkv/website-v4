import React, { useState, useMemo } from "react";
import { useVendorDataStore } from "../../../store/vendor/vendorDataStore";
import {
  formatCurrency,
  formatDate,
  getOrderStatusConfig,
} from "../../../lib/utils";

// ✅ Status badge component (unchanged)
const StatusBadge = ({ status }) => {
  const config = getOrderStatusConfig(status || "unknown");
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${config.color}`}
    >
      <i className={`${config.icon} text-[10px] sm:text-xs`}></i>
      {config.label}
    </span>
  );
};

const VendorOrders = () => {
  const { orders } = useVendorDataStore(); // ✅ Real order data from context
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("table");

  const statusFilters = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  // ✅ Safe default if context not loaded
  const safeOrders = Array.isArray(orders) ? orders : [];

  // ✅ Filter + Sort
  const filteredAndSortedOrders = useMemo(() => {
    let result = safeOrders.filter((order) => {
      const matchesStatus =
        filterStatus === "all" ||
        order.order_status?.toLowerCase() === filterStatus;

      const lowerSearch = searchQuery.toLowerCase();
      const matchesSearch =
        `ORD${order.id}`.toLowerCase().includes(lowerSearch) ||
        order.product?.name?.toLowerCase().includes(lowerSearch) ||
        order.payment_mode?.toLowerCase().includes(lowerSearch);

      return matchesStatus && matchesSearch;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "amount_high":
          return (b.amount || 0) - (a.amount || 0);
        case "amount_low":
          return (a.amount || 0) - (b.amount || 0);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return result;
  }, [filterStatus, searchQuery, sortBy, safeOrders]);

  // ✅ Order stats
  const getOrderStats = () => {
    const total = safeOrders.length;
    const pending = safeOrders.filter(
      (o) => o.order_status === "pending"
    ).length;
    const cancelled = safeOrders.filter(
      (o) => o.order_status === "cancelled"
    ).length;
    const delivered = safeOrders.filter(
      (o) => o.order_status === "delivered"
    ).length;
    return { total, pending, cancelled, delivered };
  };

  const stats = getOrderStats();

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ✅ Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Total Orders",
            value: stats.total,
            icon: "fas fa-shopping-bag",
            color: "from-blue-500 to-cyan-500",
          },
          {
            label: "Pending",
            value: stats.pending,
            icon: "fas fa-clock",
            color: "from-yellow-500 to-orange-500",
          },
          {
            label: "Cancelled",
            value: stats.cancelled,
            icon: "fas fa-times-circle",
            color: "from-red-500 to-pink-500",
          },
          {
            label: "Delivered",
            value: stats.delivered,
            icon: "fas fa-check-circle",
            color: "from-green-500 to-emerald-500",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium uppercase">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-1.5">
                  {stat.value}
                </p>
              </div>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md`}
              >
                <i
                  className={`${stat.icon} text-white text-sm sm:text-base`}
                ></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative order-2 sm:order-1">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search Orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg order-1 sm:order-2 self-start sm:self-center">
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 rounded-lg ${
                viewMode === "table"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-table text-base"></i>
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 rounded-lg ${
                viewMode === "card"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <i className="fas fa-th text-base"></i>
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white text-sm"
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status === "all"
                    ? "All Status"
                    : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 mb-1 block">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white text-sm"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Value</option>
              <option value="amount_low">Lowest Value</option>
            </select>
          </div>
        </div>
      </div>

      {/* ✅ Orders Display */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredAndSortedOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No orders found
              </div>
            ) : (
              <table className="w-full min-w-[800px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Payment
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Shipping Label
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-orange-50 transition"
                    >
                      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                        ORD #{order.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">
                        {order.product?.name || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-sm font-bold text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 capitalize">
                        {order.payment_mode || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.order_status} />
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {order.shipping_label ? (
                          <a
                            href={order.shipping_label}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                          >
                            Download Shipping Label
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        // ✅ Card view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-900">ORD #{order.id}</p>
                <StatusBadge status={order.order_status} />
              </div>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Product:</strong> {order.product?.name}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Amount:</strong> {formatCurrency(order.amount)}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Payment:</strong> {order.payment_mode || "N/A"}
              </p>
              <p className="text-sm text-gray-700 mb-1">
                <strong>Date:</strong> {formatDate(order.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
