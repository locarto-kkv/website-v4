import React, { useState } from "react";
import {
  formatCurrency,
  formatDate,
  getOrderStatusConfig,
} from "../../lib/utils.js";
import { useVendorDataStore } from "../../store/vendor/vendorDataStore.jsx";

const StatusBadge = ({ status }) => {
  const config = getOrderStatusConfig(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${config.color}`}
    >
      <i className={`${config.icon} text-[10px] sm:text-xs`}></i>
      {config.label}
    </span>
  );
};

const RecentOrdersTable = () => {
  const { orders } = useVendorDataStore();

  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("desc");
  const [filter, setFilter] = useState("all");

  const filteredOrders = (orders || []).filter((order) => {
    if (filter === "all") return true;
    return order.order_status?.toLowerCase() === filter;
  });

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "amount") {
      aValue = parseFloat(a.amount || 0);
      bValue = parseFloat(b.amount || 0);
    }

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const statusFilters = [
    { value: "all", label: "All Orders", count: (orders || []).length },
    {
      value: "pending",
      label: "Pending",
      count: (orders || []).filter(
        (o) => o.order_status?.toLowerCase() === "pending"
      ).length,
    },
    {
      value: "delivered",
      label: "Delivered",
      count: (orders || []).filter(
        (o) => o.order_status?.toLowerCase() === "delivered"
      ).length,
    },
    {
      value: "shipped",
      label: "Shipped",
      count: (orders || []).filter(
        (o) => o.order_status?.toLowerCase() === "shipped"
      ).length,
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header with responsive layout */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-4 sm:px-6 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-shopping-cart text-orange-500"></i>
              Recent Orders
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {filteredOrders.length} of {orders.length} orders shown
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="flex-1 sm:flex-none px-2 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            >
              {statusFilters.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label} ({status.count})
                </option>
              ))}
            </select>
            <button className="text-orange-600 hover:text-orange-700 font-medium text-xs sm:text-sm flex items-center gap-1 hover:underline transition-colors whitespace-nowrap">
              <span>View All</span>
              <i className="fas fa-arrow-right text-[10px]"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Table container with horizontal scroll */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No orders found
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">
              There are no orders matching your current filter.
            </p>
          </div>
        ) : (
          // Add min-width to the table to ensure it scrolls when viewport is too narrow
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th
                  className="text-left px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center gap-2">
                    Order
                    <i
                      className={`fas fa-sort text-xs ${
                        sortField === "id" ? "text-orange-500" : "text-gray-400"
                      }`}
                    ></i>
                  </div>
                </th>
                <th className="text-left px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="text-left px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider hidden sm:table-cell">
                  Customer
                </th>
                <th
                  className="text-left px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <i
                      className={`fas fa-sort text-xs ${
                        sortField === "amount"
                          ? "text-orange-500"
                          : "text-gray-400"
                      }`}
                    ></i>
                  </div>
                </th>
                <th className="text-left px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="text-center px-4 py-3 sm:px-6 sm:py-4 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedOrders.slice(0, 5).map((order, index) => (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50 transition-colors group"
                >
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="font-semibold text-gray-900 text-xs sm:text-sm">
                      #{order.id}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500">
                      {formatDate(order.created_at)}
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4">
                    <div className="font-medium text-gray-900 text-xs sm:text-sm">
                      {order.product?.name || "Product Name"}
                    </div>
                    <div className="text-xs text-gray-500">
                      Qty: {order.quantity || 1}
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap hidden sm:table-cell">
                    <div className="font-medium text-gray-900 text-xs sm:text-sm">
                      {order.customer?.name}
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="font-bold text-sm sm:text-base text-gray-900">
                      {formatCurrency(order.amount)}
                    </div>
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <StatusBadge status={order.order_status} />
                  </td>
                  <td className="px-4 py-3 sm:px-6 sm:py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      <button
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                        title="View Details"
                      >
                        <i className="fas fa-eye text-xs sm:text-sm"></i>
                      </button>
                      <button
                        className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Edit Order"
                      >
                        <i className="fas fa-edit text-xs sm:text-sm"></i>
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
  );
};

export default RecentOrdersTable;
