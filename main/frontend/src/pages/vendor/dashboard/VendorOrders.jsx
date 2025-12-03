// src/pages/vendor/dashboard/VendorOrders.jsx
import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useVendorDataStore } from "../../../store/vendor/vendorDataStore";
import { VendorOrderService } from "../../../services/vendor/vendorOrderService";
import {
  formatCurrency,
  formatDate,
  getOrderStatusConfig,
} from "../../../lib/utils";

// --- Components ---

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

// --- Bulk Update Modal Component ---
const VendorBulkOrderUpdateForm = ({ onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (value) => {
    setFormData({ order_status: value });
  };

  const handleSubmit = () => {
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "" && v !== null)
    );

    if (Object.keys(cleanedData).length === 0) {
      toast.error("Please select a status to update.");
      return;
    }

    onUpdate(cleanedData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fas fa-layer-group text-white"></i>
            Bulk Update Orders
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 bg-gray-50 space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Update the status for all selected orders.
          </p>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">
              Order Status
            </label>
            <select
              onChange={(e) => handleChange(e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500"
              defaultValue=""
            >
              <option value="">Select Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="ready-for-pickup">Ready for Pickup</option>
              <option value="shipped">Shipped</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-white transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

const VendorOrderEditForm = ({ orderData, onClose, onUpdate }) => {
  const [status, setStatus] = useState(orderData.order_status || "pending");

  const handleSubmit = async () => {
    // Only allow specific updates
    const validStatuses = [
      "confirmed",
      "ready-for-pickup",
      "shipped",
      "cancelled",
    ];

    // Allow saving if status changed, even if it's currently something else,
    // but ensure the *new* status is valid.
    if (!validStatuses.includes(status)) {
      toast.error("Invalid status selection.");
      return;
    }

    try {
      const payload = { order_status: status };
      // Pass payload to onUpdate
      onUpdate(payload);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <i className="fas fa-edit text-white"></i>
              Update Order Status
            </h2>
            <p className="text-white/80 text-xs mt-1">
              Item #{orderData.id} • Order #{orderData.order_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 bg-gray-50 space-y-6">
          {/* Read-Only Info */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 overflow-hidden border">
              <img
                src={
                  orderData.product?.product_images?.[0]?.url ||
                  "https://placehold.co/100"
                }
                alt="Product"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-sm">
                {orderData.product?.name}
              </h3>
              <p className="text-xs text-gray-500">Qty: {orderData.quantity}</p>
              <p className="text-sm font-semibold text-orange-600 mt-1">
                {formatCurrency(orderData.order?.amount)}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-2">
              Select New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border rounded-xl text-sm bg-white focus:ring-2 focus:ring-orange-500"
            >
              <option value="pending" disabled>
                Pending
              </option>
              <option value="confirmed">Confirmed</option>
              <option value="ready-for-pickup">Ready for Pickup</option>
              <option value="shipped">Shipped</option>
              <option value="delivered" disabled>
                Delivered (System Update Only)
              </option>
              <option value="cancelled">Cancelled</option>
            </select>
            <p className="text-xs text-gray-400 mt-2">
              * Note: Delivered status is updated by logistics partners.
            </p>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-white transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Component ---

const VendorOrders = () => {
  const { orders, fetchOrders } = useVendorDataStore();
  const safeOrders = Array.isArray(orders) ? orders : [];

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState("table");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Selection & Modal States
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);

  const statusFilters = [
    "all",
    "pending",
    "confirmed",
    "ready-for-pickup",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  // Flatten all order items
  const flattenedItems = useMemo(() => {
    return safeOrders.flatMap((order) =>
      order.items.map((item) => ({ order, item }))
    );
  }, [safeOrders]);

  // Filter + sort items
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
          return (b.order.amount || 0) - (a.order.amount || 0);
        case "amount_low":
          return (a.order.amount || 0) - (b.order.amount || 0);
        case "oldest":
          return new Date(a.order.created_at) - new Date(b.order.created_at);
        default:
          return new Date(b.order.created_at) - new Date(a.order.created_at);
      }
    });

    return result;
  }, [flattenedItems, filterStatus, searchQuery, sortBy]);

  // --- Handlers ---

  const handleEditClick = (e, itemData) => {
    e.stopPropagation();

    const fullOrderData = {
      ...itemData.item,
      order: itemData.order,
    };
    setSelectedOrder(fullOrderData);
  };

  const handleRowClick = (item) => {
    if (selectionMode) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id);
      } else {
        newSelected.add(item.id);
      }
      setSelectedIds(newSelected);
    } else {
      setSelectionMode(true);
      setSelectedIds(new Set([item.id]));
    }
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredAndSortedItems.map(({ item }) => item.id));
    setSelectedIds(allIds);
  };

  const handleUnselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleCancelSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const performUpdate = async (ids, updateData) => {
    try {
      await VendorOrderService.updateOrderStatus(ids, updateData);

      toast.success("Orders updated successfully");
      await fetchOrders(); // Refresh data
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update some orders.");
    }
  };

  const handleSingleUpdateSubmit = async (updateData) => {
    toast.loading("Updating order...");
    await performUpdate([selectedOrder.id], updateData);

    toast.dismiss();
    setSelectedOrder(null);
  };

  const handleBulkUpdateSubmit = async (updateData) => {
    toast.loading("Updating orders...");
    await performUpdate(Array.from(selectedIds), updateData);

    toast.dismiss();
    setShowBulkModal(false);
    handleCancelSelection();
  };

  // Stats
  const stats = useMemo(() => {
    const allItems = flattenedItems;
    const total = allItems.length;
    const pending = allItems.filter(
      (i) => i.item.order_status === "pending"
    ).length;
    const cancelled = allItems.filter(
      (i) => i.item.order_status === "cancelled"
    ).length;
    const delivered = allItems.filter(
      (i) => i.item.order_status === "delivered"
    ).length;

    return { total, pending, cancelled, delivered };
  }, [flattenedItems]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            label: "Total Items",
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

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative order-2 sm:order-1">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm"></i>
            <input
              type="text"
              placeholder="Search Items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 text-sm"
            />
          </div>

          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg order-1 sm:order-2">
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
              className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 bg-white text-sm capitalize"
            >
              {statusFilters.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Status" : status.replace(/-/g, " ")}
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

      {/* --- Selection Action Bar --- */}
      {selectionMode && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 text-white animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">
              {selectedIds.size}
            </div>
            <span className="font-medium">Items Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Select All
            </button>
            <button
              onClick={handleUnselectAll}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Unselect All
            </button>
            <div className="h-6 w-px bg-gray-600 mx-1 hidden sm:block"></div>
            <button
              onClick={handleCancelSelection}
              className="px-4 py-2 border border-gray-600 hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => setShowBulkModal(true)}
              disabled={selectedIds.size === 0}
              className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-bold shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Update
            </button>
          </div>
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredAndSortedItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No items found
              </div>
            ) : (
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    {selectionMode && (
                      <th className="w-12 px-6 py-4 text-center">
                        <i className="fas fa-check-square text-gray-400"></i>
                      </th>
                    )}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Order ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">
                      Total
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
                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedItems.map(({ order, item }) => {
                    const isSelected = selectedIds.has(item.id);
                    return (
                      <tr
                        key={item.id}
                        onClick={() => handleRowClick(item)}
                        className={`transition cursor-pointer group ${
                          isSelected ? "bg-orange-50/70" : "hover:bg-orange-50"
                        }`}
                      >
                        {selectionMode && (
                          <td className="px-6 py-4 text-center">
                            <div
                              className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                                isSelected
                                  ? "bg-orange-500 border-orange-500 text-white"
                                  : "bg-white border-gray-300"
                              }`}
                            >
                              {isSelected && (
                                <i className="fas fa-check text-xs"></i>
                              )}
                            </div>
                          </td>
                        )}
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                          ORD #{order.id}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {item.product?.name}
                        </td>
                        <td className="px-4 py-3 text-sm">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">
                          {formatCurrency(
                            item.quantity * (item.product?.price || 0)
                          )}
                        </td>
                        <td className="px-4 py-3 text-sm capitalize">
                          {order.payment_mode}
                        </td>
                        <td className="px-4 py-3">
                          <StatusBadge status={item.order_status} />
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {formatDate(order.created_at)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            onClick={(e) => handleEditClick(e, { order, item })}
                            className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-xs transition-colors"
                          >
                            <i className="fas fa-edit mr-1"></i> Edit
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : (
        // Card view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAndSortedItems.map(({ order, item }) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={`bg-white rounded-2xl border shadow-sm p-5 transition cursor-pointer relative ${
                  isSelected
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-gray-100 hover:shadow-md hover:border-orange-300"
                }`}
              >
                {selectionMode && (
                  <div
                    className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                      isSelected
                        ? "bg-orange-500 border-orange-500 text-white"
                        : "bg-white border-gray-300"
                    }`}
                  >
                    {isSelected && <i className="fas fa-check text-xs"></i>}
                  </div>
                )}

                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-gray-900">ORD #{order.id}</p>
                  {!selectionMode && <StatusBadge status={item.order_status} />}
                </div>

                <p className="text-sm text-gray-700 mb-1">
                  <strong>Product:</strong> {item.product?.name}
                </p>

                <p className="text-sm text-gray-700 mb-1">
                  <strong>Qty:</strong> {item.quantity}
                </p>

                <p className="text-sm text-gray-700 mb-1">
                  <strong>Total:</strong>{" "}
                  {formatCurrency(item.quantity * item.product?.price)}
                </p>

                <p className="text-sm text-gray-700 mb-1">
                  <strong>Payment:</strong> {order.payment_mode}
                </p>

                <p className="text-sm text-gray-700 mb-1">
                  <strong>Date:</strong> {formatDate(order.created_at)}
                </p>
                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button
                    onClick={(e) => handleEditClick(e, { order, item })}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-edit"></i> Update Status
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Form Overlay (Single Item) */}
      {selectedOrder && (
        <VendorOrderEditForm
          orderData={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={handleSingleUpdateSubmit}
        />
      )}

      {/* Bulk Update Modal */}
      {showBulkModal && (
        <VendorBulkOrderUpdateForm
          onClose={() => setShowBulkModal(false)}
          onUpdate={handleBulkUpdateSubmit}
        />
      )}
    </div>
  );
};

export default VendorOrders;
