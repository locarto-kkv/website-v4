// src/pages/vendor/dashboard/VendorOrders.jsx
import React, { useState, useMemo } from "react";
// Import hooks/services if using context or API instead of mock data
// import { useVendorData } from '../../../context/vendor/vendorDataContext';
// Import utils - Assuming they are correctly defined
import {
  formatCurrency,
  formatDate,
  getOrderStatusConfig,
} from "../../../lib/utils"; // Make sure path is correct

// Mock data for demonstration (Keep as is or replace with real data)
const mockOrders = [
  {
    id: "ORD001",
    product: { name: "Wireless Headphones" },
    customer: { name: "Rajesh Kumar", email: "rajesh@example.com" },
    quantity: 2,
    amount: 4999,
    order_status: "delivered",
    created_at: "2025-10-15",
    deliveryNote: true,
    order_invoice: "https://example.com/invoice/ORD001.pdf",
  },
  {
    id: "ORD002",
    product: { name: "Smart Watch Pro" },
    customer: { name: "Priya Singh", email: "priya@example.com" },
    quantity: 1,
    amount: 12999,
    order_status: "shipped",
    created_at: "2025-10-18",
    deliveryNote: false,
    order_invoice: null,
  },
  {
    id: "ORD003",
    product: { name: "USB-C Cable" },
    customer: { name: "Amit Patel", email: "amit@example.com" },
    quantity: 5,
    amount: 999,
    order_status: "processing",
    created_at: "2025-10-19",
    deliveryNote: false,
    order_invoice: "https://example.com/invoice/ORD003.pdf",
  },
  {
    id: "ORD004",
    product: { name: "Phone Stand" },
    customer: { name: "Neha Verma", email: "neha@example.com" },
    quantity: 3,
    amount: 1499,
    order_status: "pending",
    created_at: "2025-10-20",
    deliveryNote: false,
    order_invoice: null,
  },
  {
    id: "ORD005",
    product: { name: "Laptop Bag" },
    customer: { name: "Vikram Sharma", email: "vikram@example.com" },
    quantity: 1,
    amount: 3499,
    order_status: "cancelled",
    created_at: "2025-10-12",
    deliveryNote: true,
    order_invoice: "https://example.com/invoice/ORD005.pdf",
  },
];

// StatusBadge Component (Keep as is)
const StatusBadge = ({ status }) => {
  const config = getOrderStatusConfig(status); // Ensure getOrderStatusConfig handles undefined/null status
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold whitespace-nowrap ${config.color}`}
    >
      {/* Adjusted padding/size */}
      <i className={`${config.icon} text-[10px] sm:text-xs`}></i>
      {/* Adjusted size */}
      {config.label}
    </span>
  );
};

const VendorOrders = () => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("table"); // Default to table or card as preferred

  // Use mock data - replace with context/API call if needed
  const orders = mockOrders; // Using mock data

  const statusFilters = [
    "all",
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  // Memoized filtering and sorting (Keep as is)
  const filteredAndSortedOrders = useMemo(() => {
    let result = (orders || []).filter((order) => {
      // Add safety check for orders array
      const matchesStatus =
        filterStatus === "all" ||
        order.order_status?.toLowerCase() === filterStatus;
      const lowerSearch = searchQuery.toLowerCase();
      const matchesSearch =
        order.id?.toLowerCase().includes(lowerSearch) ||
        order.product?.name?.toLowerCase().includes(lowerSearch) ||
        order.customer?.name?.toLowerCase().includes(lowerSearch);
      return matchesStatus && matchesSearch;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "amount_high":
          return (b.amount || 0) - (a.amount || 0);
        case "amount_low":
          return (a.amount || 0) - (b.amount || 0);
        case "oldest":
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0); // recent
      }
    });

    return result;
  }, [filterStatus, searchQuery, sortBy, orders]);

  // Order Stats Calculation (Keep as is, ensure safety)
  const getOrderStats = () => {
    const safeOrders = orders || [];
    const total = safeOrders.length;
    const pending = safeOrders.filter(
      (o) => o.order_status === "pending"
    ).length;
    const shipped = safeOrders.filter(
      (o) => o.order_status === "shipped"
    ).length;
    const delivered = safeOrders.filter(
      (o) => o.order_status === "delivered"
    ).length;
    return { total, pending, shipped, delivered };
  };

  const stats = getOrderStats();

  return (
    // Removed outer container padding - assuming layout handles it
    <div className="space-y-4 sm:space-y-6">
      {/* Consistent spacing */}
      {/* Stats Cards - Responsive Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {/* Use 2 columns on small screens */}
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
            label: "Shipped",
            value: stats.shipped,
            icon: "fas fa-truck",
            color: "from-purple-500 to-pink-500",
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
            className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-3 sm:p-5 hover:shadow-md transition-shadow"
          >
            {/* Adjusted padding/rounding */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <div>
                <p className="text-gray-600 text-[10px] sm:text-xs font-medium uppercase">
                  {stat.label}
                </p>
                {/* Adjusted size */}
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-1 sm:mt-1.5">
                  {stat.value}
                </p>
                {/* Adjusted size */}
              </div>
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r ${stat.color} rounded-lg sm:rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}
              >
                {/* Adjusted size */}
                <i
                  className={`${stat.icon} text-white text-sm sm:text-base`}
                ></i>
                {/* Adjusted size */}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Controls Section - Responsive stacking and adjustments */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Search and View Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          {/* Search */}
          <div className="flex-1 relative order-2 sm:order-1">
            {/* Search below toggles on mobile */}
            <i className="fas fa-search absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm sm:text-base"></i>
            <input
              type="text"
              placeholder="Search Orders..." // Shorter placeholder
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-11 pr-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all text-sm sm:text-base"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg order-1 sm:order-2 self-start sm:self-center">
            {/* Align left on mobile */}
            <button
              onClick={() => setViewMode("table")}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${
                viewMode === "table"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Table View"
              aria-label="Table View"
            >
              <i className="fas fa-table text-base sm:text-lg"></i>
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`p-2 sm:p-2.5 rounded-lg transition-all ${
                viewMode === "card"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
              title="Card View"
              aria-label="Card View"
            >
              <i className="fas fa-th text-base sm:text-lg"></i>
            </button>
          </div>
        </div>

        {/* Filters and Export - Stack on mobile */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1">
            <label
              htmlFor="statusFilter"
              className="text-xs sm:text-sm font-medium text-gray-700 block mb-1.5 sm:mb-2"
            >
              Status
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm sm:text-base appearance-none" // Added appearance-none
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

          {/* Sort By Filter */}
          <div className="flex-1">
            <label
              htmlFor="sortByFilter"
              className="text-xs sm:text-sm font-medium text-gray-700 block mb-1.5 sm:mb-2"
            >
              Sort By
            </label>
            <select
              id="sortByFilter"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-sm sm:text-base appearance-none" // Added appearance-none
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Value</option>
              <option value="amount_low">Lowest Value</option>
            </select>
          </div>

          {/* Export Button */}
          <div className="flex items-end mt-2 md:mt-0">
            <button className="w-full md:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-md hover:shadow-lg transform hover:scale-105 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base">
              <i className="fas fa-download text-xs sm:text-sm"></i>
              Export
            </button>
          </div>
        </div>
      </div>
      {/* Orders Display */}
      {viewMode === "table" ? (
        // --- Table View ---
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Make container scrollable */}
          <div className="overflow-x-auto">
            {filteredAndSortedOrders.length === 0 ? (
              // Empty state
              <div className="text-center py-12 sm:py-16">
                <i className="fas fa-inbox text-4xl sm:text-5xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-base sm:text-lg font-medium">
                  No orders found
                </p>
                <p className="text-gray-400 text-xs sm:text-sm mt-1">
                  Try adjusting filters or search.
                </p>
              </div>
            ) : (
              <table className="w-full min-w-[800px]">
                {/* Added min-w for horizontal scroll */}
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    {/* Responsive padding and font size */}
                    <th className="text-left px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Order
                    </th>
                    <th className="text-left px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="text-left px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="text-center px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                      Qty
                    </th>
                    {/* Hide Qty on small */}
                    <th className="text-right px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                      Invoice
                    </th>
                    {/* Hide Invoice on smallest */}
                    <th className="text-center px-3 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-orange-50/50 transition-colors duration-150 group"
                    >
                      {/* Lighter hover */}
                      {/* Order Info Cell */}
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* Smaller icon on mobile */}
                          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <i className="fas fa-shopping-bag text-orange-600 text-sm sm:text-base"></i>
                          </div>
                          <div>
                            <p className="text-xs sm:text-sm font-semibold text-gray-900">
                              {order.id}
                            </p>
                            <p className="text-[10px] sm:text-xs text-gray-500">
                              {formatDate(order.created_at)}
                            </p>
                          </div>
                        </div>
                      </td>
                      {/* Product Name Cell */}
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <p className="text-xs sm:text-sm text-gray-700 font-medium truncate max-w-[150px] sm:max-w-xs">
                          {order.product?.name || "N/A"}
                        </p>
                        {/* Truncate */}
                        {/* Show Qty here on small screens */}
                        <p className="text-[10px] text-gray-500 md:hidden mt-0.5">
                          Qty: {order.quantity}
                        </p>
                      </td>
                      {/* Customer Info Cell */}
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <div>
                          <p className="text-xs sm:text-sm text-gray-700 font-medium truncate max-w-[100px] sm:max-w-xs">
                            {order.customer?.name}
                          </p>
                          {/* Hide email on smallest screens */}
                          <p className="text-[10px] sm:text-xs text-gray-500 hidden sm:block truncate max-w-[150px]">
                            {order.customer?.email}
                          </p>
                        </div>
                      </td>
                      {/* Quantity Cell (Hidden on mobile) */}
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-center hidden md:table-cell">
                        <span className="inline-block bg-gray-100 text-gray-700 px-2 sm:px-3 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs sm:text-sm font-semibold">
                          {order.quantity}
                        </span>
                      </td>
                      {/* Amount Cell */}
                      <td className="px-3 py-3 sm:px-6 sm:py-4 text-right">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 whitespace-nowrap">
                          {formatCurrency(order.amount)}
                        </p>
                      </td>
                      {/* Status Cell */}
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <StatusBadge status={order.order_status} />
                      </td>
                      {/* Invoice Cell (Hidden on smallest) */}
                      <td className="px-3 py-3 sm:px-6 sm:py-4 whitespace-nowrap text-xs sm:text-sm text-gray-700 hidden sm:table-cell">
                        {order.order_invoice ? (
                          <a
                            href={order.order_invoice}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                            title="View Invoice"
                          >
                            <i className="fas fa-file-invoice text-[10px] sm:text-xs"></i>
                            View
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      {/* Actions Cell */}
                      <td className="px-3 py-3 sm:px-6 sm:py-4">
                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {/* Smaller buttons */}
                          <button
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md sm:rounded-lg transition-all"
                            title="View Details"
                            aria-label="View Details"
                          >
                            <i className="fas fa-eye text-xs sm:text-sm"></i>
                          </button>
                          <button
                            className="p-1.5 sm:p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-md sm:rounded-lg transition-all"
                            title="More Options"
                            aria-label="More Options"
                          >
                            <i className="fas fa-ellipsis-v text-xs sm:text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        // --- Card View ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredAndSortedOrders.length === 0 ? (
            // Empty state
            <div className="col-span-full text-center py-12 sm:py-16">
              <i className="fas fa-inbox text-4xl sm:text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-base sm:text-lg font-medium">
                No orders found
              </p>
            </div>
          ) : (
            filteredAndSortedOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-lg transition-shadow group flex flex-col"
              >
                {/* Added flex flex-col */}
                {/* Top section: ID, Date, Status */}
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase">
                      {order.id}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400 mt-0.5 sm:mt-1">
                      {formatDate(order.created_at)}
                    </p>
                  </div>
                  <StatusBadge status={order.order_status} />
                </div>
                {/* Product Info */}
                <div className="border-t border-gray-100 pt-3 sm:pt-4 mb-3 sm:mb-4 flex-grow">
                  {/* Added flex-grow */}
                  <p className="text-xs sm:text-sm text-gray-600 mb-1">
                    Product
                  </p>
                  <p className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-2">
                    {order.product?.name || "N/A"}
                  </p>
                  {/* Line clamp */}
                </div>
                {/* Qty & Amount */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">
                      Quantity
                    </p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      {order.quantity}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-3">
                    <p className="text-[10px] sm:text-xs text-gray-600 mb-0.5 sm:mb-1">
                      Amount
                    </p>
                    <p className="text-base sm:text-lg font-bold text-gray-900">
                      {formatCurrency(order.amount)}
                    </p>
                  </div>
                </div>
                {/* Customer Info */}
                <div className="border-t border-gray-100 pt-3 sm:pt-4 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-1.5">
                    Customer
                  </p>
                  <p className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
                    {order.customer?.name}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 truncate">
                    {order.customer?.email}
                  </p>
                </div>
                {/* Invoice Link */}
                <div className="border-t border-gray-100 pt-3 sm:pt-4 mb-3 sm:mb-4">
                  <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-1.5">
                    Invoice
                  </p>
                  {order.order_invoice ? (
                    <a
                      href={order.order_invoice}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1 text-xs sm:text-sm"
                      title="View Invoice"
                    >
                      <i className="fas fa-file-invoice text-[10px] sm:text-xs"></i>
                      View Invoice
                    </a>
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm">
                      N/A
                    </span>
                  )}
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 border-t border-gray-100 pt-3 sm:pt-4 mt-auto">
                  {/* Added mt-auto */}
                  <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-1.5">
                    <i className="fas fa-eye"></i>View
                  </button>
                  <button className="flex-1 p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all text-xs sm:text-sm font-medium flex items-center justify-center gap-1 sm:gap-1.5">
                    <i className="fas fa-ellipsis-v"></i>More
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
