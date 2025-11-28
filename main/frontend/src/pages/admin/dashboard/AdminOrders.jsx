import React, { useState, useEffect } from "react";
import { AdminOrderService } from "../../../services/admin/adminOrderService";
import {
  formatDate,
  formatCurrency,
  getOrderStatusConfig,
} from "../../../lib/utils";
import toast from "react-hot-toast";

// Reusable Status Badge Component
const StatusBadge = ({ status }) => {
  const config = getOrderStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}
    >
      <i className={`${config.icon} text-xs`}></i>
      {config.label}
    </span>
  );
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // Filter States
  const [filters, setFilters] = useState({
    product: "",
    vendor: "",
    consumer: "",
    dateRange: "all", // default to all or today
  });

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Calling the service with current filters
      const data = await AdminOrderService.getAllOrders(filters);
      setOrders(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchOrders();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all platform orders
          </p>
        </div>

        {/* --- Filters Section --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 mb-6">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
              {/* Product Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Product
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-box text-gray-400"></i>
                  </span>
                  <input
                    type="text"
                    name="product"
                    value={filters.product}
                    onChange={handleInputChange}
                    placeholder="Search product..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-shadow"
                  />
                </div>
              </div>

              {/* Vendor Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Vendor
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-store text-gray-400"></i>
                  </span>
                  <input
                    type="text"
                    name="vendor"
                    value={filters.vendor}
                    onChange={handleInputChange}
                    placeholder="Search vendor..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-shadow"
                  />
                </div>
              </div>

              {/* Consumer Input */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Consumer
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400"></i>
                  </span>
                  <input
                    type="text"
                    name="consumer"
                    value={filters.consumer}
                    onChange={handleInputChange}
                    placeholder="Search consumer..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-shadow"
                  />
                </div>
              </div>

              {/* Date Range Select */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide">
                  Date Range
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-calendar-alt text-gray-400"></i>
                  </span>
                  <select
                    name="dateRange"
                    value={filters.dateRange}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm bg-white appearance-none transition-shadow"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">This Week</option>
                    <option value="month">This Month</option>
                  </select>
                  <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <i className="fas fa-chevron-down text-xs text-gray-400"></i>
                  </span>
                </div>
              </div>

              {/* Search Button */}
              <div>
                <button
                  type="submit"
                  className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm flex items-center justify-center gap-2"
                >
                  <i className="fas fa-search"></i>
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* --- Orders List View --- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full whitespace-nowrap">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-left">
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Vendor
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Consumer
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex justify-center items-center gap-3 text-gray-500">
                        <i className="fas fa-spinner fa-spin text-xl"></i>
                        <span>Loading orders...</span>
                      </div>
                    </td>
                  </tr>
                ) : orders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <i className="fas fa-inbox text-4xl mb-2"></i>
                        <span className="text-lg font-medium text-gray-600">
                          No orders found
                        </span>
                        <span className="text-sm">
                          Try adjusting your search filters
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-orange-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        <div className="flex items-center gap-3">
                          {order.product_image && (
                            <img
                              src={order.product_image}
                              alt=""
                              className="w-8 h-8 rounded object-cover border border-gray-200"
                            />
                          )}
                          <span className="truncate max-w-[150px]" title={order.product_name}>
                            {order.product_name || "Unknown Product"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.vendor_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {order.consumer_name}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(order.created_at)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(order.amount)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50">
                          <i className="fas fa-eye"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination could go here */}
          {!loading && orders.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center text-xs text-gray-500">
              <span>Showing {orders.length} results</span>
              {/* Pagination controls placeholder */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;