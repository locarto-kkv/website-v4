// src/pages/admin/dashboard/AdminOrders.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import toast from "react-hot-toast";
import { AdminOrderService } from "../../../services/admin/adminOrderService";
import { ConsumerSearchService } from "../../../services/consumer/consumerSearchService";
import { AdminSearchService } from "../../../services/admin/adminSearchService";
import {
  formatCurrency,
  formatDate,
  getOrderStatusConfig,
} from "../../../lib/utils";

// --- Helper Components ---

const StatusBadge = ({ status }) => {
  const config = getOrderStatusConfig(status || "pending");
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${config.color}`}
    >
      <i className={`${config.icon} text-xs`}></i>
      {config.label}
    </span>
  );
};

const SearchDropdown = ({
  label,
  placeholder,
  serviceCall,
  onSelect,
  displayKey = "name",
  icon = "fa-search",
}) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const val = e.target.value;
    setQuery(val);

    if (val.trim().length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    setShowDropdown(true);
    try {
      const res = await serviceCall(val);
      const list = res.vendors || res.products || res.consumers || res || [];
      setResults(list);
    } catch (err) {
      console.error("Search error:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (item) => {
    setQuery(item[displayKey] || item.name || "Selected");
    setResults([]);
    setShowDropdown(false);
    onSelect(item);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <i
          className={`fas ${icon} absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm`}
        ></i>
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder={placeholder}
          className="w-full pl-9 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm transition-shadow"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              onSelect(null);
              setResults([]);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <i className="fas fa-times text-xs"></i>
          </button>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-xl border border-gray-100 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="p-3 text-center text-xs text-gray-500">
              Loading...
            </div>
          ) : results.length > 0 ? (
            results.map((item, idx) => (
              <div
                key={item.id || idx}
                onClick={() => handleSelect(item)}
                className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-50 last:border-none flex items-center justify-between"
              >
                <span className="text-sm font-medium text-gray-700 truncate">
                  {item[displayKey] || item.name}
                </span>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                  #{item.id}
                </span>
              </div>
            ))
          ) : (
            <div className="p-3 text-center text-xs text-gray-500">
              No results found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Bulk Update Form Component ---
const BulkOrderUpdateForm = ({ onClose, onUpdate }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Filter out empty values
    const cleanedData = Object.fromEntries(
      Object.entries(formData).filter(([_, v]) => v !== "" && v !== null && v !== undefined)
    );

    if (Object.keys(cleanedData).length === 0) {
      toast.error("No changes to update");
      return;
    }

    console.log("Bulk Update FormData:", cleanedData);
    toast.success("Bulk update initiated (Check console)");
    onUpdate(cleanedData); // Pass data back to parent if needed for API logic later
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-layer-group text-orange-500"></i>
            Bulk Update Orders
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <div className="p-6 bg-gray-50 space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Only filled fields will be updated for the selected orders.
          </p>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Order Status</label>
            <select
              onChange={(e) => handleChange("order_status", e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500"
              defaultValue=""
            >
              <option value="">No Change</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Payment Status</label>
            <select
              onChange={(e) => handleChange("payment_status", e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500"
              defaultValue=""
            >
              <option value="">No Change</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Support Status</label>
            <select
              onChange={(e) => handleChange("support_status", e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500"
              defaultValue=""
            >
              <option value="">No Change</option>
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
          
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">Shipping Label / Note</label>
            <input 
              type="text" 
              placeholder="Enter text to apply to all..."
              onChange={(e) => handleChange("shipping_label", e.target.value)}
              className="w-full p-2.5 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-orange-500"
            />
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

// --- Edit Form Component (Single Item) ---

const OrderEditForm = ({ orderData, onClose, onUpdate }) => {
  const [orderUpdate, setOrderUpdate] = useState(false);
  const [itemUpdate, setItemUpdate] = useState(false);

  const [formData, setFormData] = useState(
    JSON.parse(JSON.stringify(orderData))
  );

  const handleUpdate = async () => {
    const { order: updateOrderData, ...updateItemData } = formData;

    try {
      if (orderUpdate) {
        await AdminOrderService.updateOrder(
          updateOrderData.id,
          updateOrderData
        );
      }
      if (itemUpdate) {
        await AdminOrderService.updateOrderItem(
          updateItemData.id,
          updateItemData
        );
      }
      toast.success("Order data updated successfully");
      onUpdate();
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update order");
    }
  };

  const handleChange = (section, field, value) => {
    setFormData((prev) => {
      if (section === "root") {
        setItemUpdate(true);
        return { ...prev, [field]: value };
      }
      if (section === "product") {
        setItemUpdate(true);
        return { ...prev, product: { ...prev.product, [field]: value } };
      }
      if (section === "order") {
        setOrderUpdate(true);
        return { ...prev, order: { ...prev.order, [field]: value } };
      }
      if (section === "consumer_address") {
        setOrderUpdate(true);
        return {
          ...prev,
          order: {
            ...prev.order,
            consumer_address: {
              ...prev.order.consumer_address,
              [field]: value,
            },
          },
        };
      }
      if (section === "vendor_address") {
        setOrderUpdate(true);
        return {
          ...prev,
          order: {
            ...prev.order,
            vendor_address: { ...prev.order.vendor_address, [field]: value },
          },
        };
      }
      return prev;
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-edit text-orange-500"></i>
              Edit Order Details
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Item ID: #{formData.id} • Order ID: #{formData.order_id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Item & Product Details */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-box text-blue-500"></i> Item & Product
                Details
              </h3>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-32 h-32 bg-gray-100 rounded-lg shrink-0 overflow-hidden border relative group">
                  <img
                    src={
                      formData.product?.product_images?.[0]?.url ||
                      "https://placehold.co/150"
                    }
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-gray-500 block mb-1">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={formData.product?.name || ""}
                      onChange={(e) =>
                        handleChange("product", "name", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.product?.category || ""}
                      onChange={(e) =>
                        handleChange("product", "category", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">
                      Weight (g)
                    </label>
                    <input
                      type="number"
                      value={formData.product?.weight || 0}
                      onChange={(e) =>
                        handleChange("product", "weight", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">
                      Unit Price
                    </label>
                    <input
                      type="number"
                      value={formData.product?.price || 0}
                      onChange={(e) =>
                        handleChange("product", "price", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 block mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.quantity || 0}
                      onChange={(e) =>
                        handleChange("root", "quantity", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg text-sm bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Order Summary & Status */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-file-invoice-dollar text-green-500"></i>{" "}
                Order Summary
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Order Status
                  </label>
                  <select
                    value={formData.order_status}
                    onChange={(e) =>
                      handleChange("root", "order_status", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Payment Status
                  </label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) =>
                      handleChange("root", "payment_status", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Support Status
                  </label>
                  <select
                    value={formData.support_status || "open"}
                    onChange={(e) =>
                      handleChange("root", "support_status", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm bg-white focus:ring-2 focus:ring-green-500"
                  >
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Shipping Label (Tracking / Text)
                  </label>
                  <input
                    type="text"
                    value={formData.order?.shipping_label || ""}
                    onChange={(e) =>
                      handleChange("order", "shipping_label", e.target.value)
                    }
                    placeholder="Enter shipping details or tracking ID"
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Payment Mode
                  </label>
                  <input
                    type="text"
                    value={formData.order?.payment_mode || ""}
                    onChange={(e) =>
                      handleChange("order", "payment_mode", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Delivery Fee
                  </label>
                  <input
                    type="number"
                    value={formData.order?.delivery_fee || 0}
                    onChange={(e) =>
                      handleChange("order", "delivery_fee", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-500 block mb-1">
                    Total Amount (Order Level)
                  </label>
                  <input
                    type="number"
                    value={formData.order?.amount || 0}
                    onChange={(e) =>
                      handleChange("order", "amount", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm font-bold text-gray-800"
                  />
                </div>
              </div>
            </div>

            {/* 3. Consumer Details */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-user text-purple-500"></i> Consumer Details
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Label (e.g. Home)"
                    value={formData.order?.consumer_address?.label || ""}
                    onChange={(e) =>
                      handleChange("consumer_address", "label", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm col-span-2"
                  />
                </div>
                <input
                  placeholder="Address Line 1"
                  value={formData.order?.consumer_address?.address_line_1 || ""}
                  onChange={(e) =>
                    handleChange(
                      "consumer_address",
                      "address_line_1",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <input
                  placeholder="Address Line 2"
                  value={formData.order?.consumer_address?.address_line_2 || ""}
                  onChange={(e) =>
                    handleChange(
                      "consumer_address",
                      "address_line_2",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="State"
                    value={formData.order?.consumer_address?.state || ""}
                    onChange={(e) =>
                      handleChange("consumer_address", "state", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  <input
                    placeholder="Pincode"
                    value={formData.order?.consumer_address?.pincode || ""}
                    onChange={(e) =>
                      handleChange(
                        "consumer_address",
                        "pincode",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>
                <input
                  placeholder="Country"
                  value={formData.order?.consumer_address?.country || ""}
                  onChange={(e) =>
                    handleChange("consumer_address", "country", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Contact Phone"
                    value={formData.order?.consumer_address?.phone_no || ""}
                    onChange={(e) =>
                      handleChange(
                        "consumer_address",
                        "phone_no",
                        e.target.value
                      )
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  <input
                    placeholder="Email"
                    value={formData.order?.consumer_address?.email || ""}
                    onChange={(e) =>
                      handleChange("consumer_address", "email", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* 4. Vendor Address Details */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-store text-orange-500"></i> Vendor Details
              </h3>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Label (e.g. Main)"
                    value={formData.order?.vendor_address?.label || ""}
                    onChange={(e) =>
                      handleChange("vendor_address", "label", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm col-span-2"
                  />
                </div>
                <input
                  placeholder="Address Line 1"
                  value={formData.order?.vendor_address?.address_line_1 || ""}
                  onChange={(e) =>
                    handleChange(
                      "vendor_address",
                      "address_line_1",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <input
                  placeholder="Address Line 2"
                  value={formData.order?.vendor_address?.address_line_2 || ""}
                  onChange={(e) =>
                    handleChange(
                      "vendor_address",
                      "address_line_2",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="State"
                    value={formData.order?.vendor_address?.state || ""}
                    onChange={(e) =>
                      handleChange("vendor_address", "state", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  <input
                    placeholder="Pincode"
                    value={formData.order?.vendor_address?.pincode || ""}
                    onChange={(e) =>
                      handleChange("vendor_address", "pincode", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>
                <input
                  placeholder="Country"
                  value={formData.order?.vendor_address?.country || ""}
                  onChange={(e) =>
                    handleChange("vendor_address", "country", e.target.value)
                  }
                  className="w-full p-2 border rounded-lg text-sm"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    placeholder="Contact Phone"
                    value={formData.order?.vendor_address?.phone_no || ""}
                    onChange={(e) =>
                      handleChange("vendor_address", "phone_no", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                  <input
                    placeholder="Email"
                    value={formData.order?.vendor_address?.email || ""}
                    onChange={(e) =>
                      handleChange("vendor_address", "email", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-white transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
          >
            Update Order
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    consumer_id: null,
    vendor_id: null,
    product_id: null,
    date: "all",
  });

  // UI States
  const [viewMode, setViewMode] = useState("table");
  const [sortBy, setSortBy] = useState("recent");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [refresh, setRefresh] = useState(false);

  // --- NEW: Selection States ---
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const payload = {};
      if (filters.consumer_id) payload.consumer_id = filters.consumer_id;
      if (filters.vendor_id) payload.vendor_id = filters.vendor_id;
      if (filters.product_id) payload.product_id = filters.product_id;
      if (filters.date && filters.date !== "all") payload.date = filters.date;

      const response = await AdminOrderService.getOrderByFilter(payload);

      setOrders(response.data || []);
    } catch (error) {
      console.error("Error fetching admin orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters, refresh]);

  // Derived filtered & sorted list
  const filteredAndSortedOrders = useMemo(() => {
    let res = [...orders];

    // Status Filter (Client-side)
    if (statusFilter !== "all") {
      res = res.filter(
        (item) => item.order_status?.toLowerCase() === statusFilter
      );
    }

    // Sort
    res.sort((a, b) => {
      switch (sortBy) {
        case "amount_high":
          return (b.order?.amount || 0) - (a.order?.amount || 0);
        case "amount_low":
          return (a.order?.amount || 0) - (b.order?.amount || 0);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        default: // recent
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return res;
  }, [orders, statusFilter, sortBy]);

  // --- Selection Handlers ---
  const handleRowClick = (item) => {
    if (selectionMode) {
      // Toggle selection
      const newSelected = new Set(selectedIds);
      if (newSelected.has(item.id)) {
        newSelected.delete(item.id);
      } else {
        newSelected.add(item.id);
      }
      setSelectedIds(newSelected);
    } else {
      // Start selection mode and select this item
      setSelectionMode(true);
      setSelectedIds(new Set([item.id]));
    }
  };

  const handleEditClick = (e, item) => {
    e.stopPropagation(); // Prevent row click event
    setSelectedOrder(item);
  };

  const handleSelectAll = () => {
    const allIds = new Set(filteredAndSortedOrders.map((o) => o.id));
    setSelectedIds(allIds);
  };

  const handleUnselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleCancelSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  const handleBulkUpdateSubmit = (updatedData) => {
    // Here we console log as requested
    console.log("Submitting bulk update for IDs:", [...selectedIds]);
    console.log("Data:", updatedData);
    
    // Cleanup
    setShowBulkModal(false);
    handleCancelSelection();
    
    // In a real app, you would call an API here and then:
    setRefresh(prev => !prev);
  };

  const statusOptions = [
    "all",
    "pending",
    "confirmed",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  return (
    <div className="space-y-6">
      {/* Stats Header */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Orders",
            value: orders.length,
            icon: "fas fa-box",
            color: "from-blue-500 to-indigo-500",
          },
          {
            label: "Pending",
            value: orders.filter((o) => o.order_status === "pending").length,
            icon: "fas fa-clock",
            color: "from-yellow-400 to-orange-500",
          },
          {
            label: "Delivered",
            value: orders.filter((o) => o.order_status === "delivered").length,
            icon: "fas fa-check-circle",
            color: "from-green-500 to-emerald-500",
          },
          {
            label: "Cancelled",
            value: orders.filter((o) => o.order_status === "cancelled").length,
            icon: "fas fa-times-circle",
            color: "from-red-500 to-pink-500",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-500 uppercase font-semibold">
                {stat.label}
              </p>
              <p className="text-xl font-bold text-gray-800">{stat.value}</p>
            </div>
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-md`}
            >
              <i className={stat.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* --- Search & Filter Bar --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col gap-5">
          {/* Row 1: Search Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SearchDropdown
              label="Filter by Vendor"
              placeholder="Search Vendor..."
              icon="fa-store"
              serviceCall={(q) =>
                ConsumerSearchService.getSearchResults(q, "vendor")
              }
              onSelect={(item) =>
                setFilters((prev) => ({ ...prev, vendor_id: item?.id || null }))
              }
            />
            <SearchDropdown
              label="Filter by Product"
              placeholder="Search Product..."
              icon="fa-box-open"
              serviceCall={(q) =>
                ConsumerSearchService.getSearchResults(q, "product")
              }
              onSelect={(item) =>
                setFilters((prev) => ({
                  ...prev,
                  product_id: item?.id || null,
                }))
              }
            />
            <SearchDropdown
              label="Filter by Consumer"
              placeholder="Search Consumer..."
              icon="fa-user"
              serviceCall={(q) => AdminSearchService.searchConsumers(q)}
              onSelect={(item) =>
                setFilters((prev) => ({
                  ...prev,
                  consumer_id: item?.id || null,
                }))
              }
            />
          </div>

          {/* Row 2: Controls (Date, Status, Sort, View) */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                Date Range
              </label>
              <select
                value={filters.date}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, date: e.target.value }))
                }
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="this_week">This Week</option>
                <option value="this_month">This Month</option>
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm capitalize"
              >
                {statusOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt === "all" ? "All Statuses" : opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="amount_high">Highest Amount</option>
                <option value="amount_low">Lowest Amount</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode("table")}
                className={`p-2.5 rounded-md transition-all ${
                  viewMode === "table"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-list"></i>
              </button>
              <button
                onClick={() => setViewMode("card")}
                className={`p-2.5 rounded-md transition-all ${
                  viewMode === "card"
                    ? "bg-white text-orange-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <i className="fas fa-th-large"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- Bulk Selection Action Bar --- */}
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

      {/* --- Results Section --- */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Fetching orders...</p>
        </div>
      ) : filteredAndSortedOrders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
          <i className="fas fa-inbox text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-bold text-gray-700">No Orders Found</h3>
          <p className="text-gray-500">Try adjusting your search filters.</p>
        </div>
      ) : viewMode === "table" ? (
        // TABLE VIEW
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {selectionMode && (
                    <th className="w-12 px-6 py-4 text-center">
                      <i className="fas fa-check-square text-gray-400"></i>
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Item ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Order Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredAndSortedOrders.map((item) => {
                  const isSelected = selectedIds.has(item.id);
                  return (
                    <tr
                      key={item.id}
                      onClick={() => handleRowClick(item)}
                      className={`transition-colors cursor-pointer group ${
                        isSelected ? "bg-orange-50/70" : "hover:bg-gray-50"
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
                            {isSelected && <i className="fas fa-check text-xs"></i>}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-800">
                          #{item.id}
                        </span>
                        <div className="text-xs text-gray-500 mt-0.5">
                          ORD #{item.order_id}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              item.product?.product_images?.[0]?.url ||
                              "https://placehold.co/40"
                            }
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200"
                          />
                          <div>
                            <p
                              className="font-medium text-gray-900 text-sm truncate max-w-[150px]"
                              title={item.product?.name}
                            >
                              {item.product?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-bold text-gray-800">
                          {formatCurrency(item.order?.amount)}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {item.order?.payment_mode}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 items-start">
                          <StatusBadge status={item.order_status} />
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border ${
                              item.payment_status === "paid"
                                ? "border-green-200 text-green-700 bg-green-50"
                                : "border-yellow-200 text-yellow-700 bg-yellow-50"
                            }`}
                          >
                            Pay: {item.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors group-hover:shadow-sm"
                          onClick={(e) => handleEditClick(e, item)}
                        >
                          <i className="fas fa-edit mr-1"></i> Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // GRID VIEW (Adapted to handle clicks for selection)
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedOrders.map((item) => {
            const isSelected = selectedIds.has(item.id);
            return (
              <div
                key={item.id}
                onClick={() => handleRowClick(item)}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all cursor-pointer flex flex-col group relative ${
                  isSelected ? "border-orange-500 ring-2 ring-orange-200" : "border-gray-200 hover:border-orange-300 hover:shadow-md"
                }`}
              >
                {selectionMode && (
                  <div className={`absolute top-4 right-4 w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? "bg-orange-500 border-orange-500 text-white" : "bg-white border-gray-300"
                  }`}>
                    {isSelected && <i className="fas fa-check text-xs"></i>}
                  </div>
                )}

                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-xl">
                      <img
                        src={
                          item.product?.product_images?.[0]?.url ||
                          "https://placehold.co/50"
                        }
                        alt=""
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm line-clamp-1">
                        {item.product?.name}
                      </h4>
                      <p className="text-xs text-gray-500">Item #{item.id}</p>
                    </div>
                  </div>
                  {!selectionMode && <StatusBadge status={item.order_status} />}
                </div>

                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Order ID</span>
                    <span className="font-medium">#{item.order_id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Amount</span>
                    <span className="font-bold text-gray-900">
                      {formatCurrency(item.order?.amount)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Payment</span>
                    <span className="capitalize">
                      {item.payment_status} ({item.order?.payment_mode})
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Date</span>
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-end">
                  <button 
                    onClick={(e) => handleEditClick(e, item)}
                    className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
                  >
                    <i className="fas fa-edit"></i> Edit Order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Form Overlay (Single Item) */}
      {selectedOrder && (
        <OrderEditForm
          orderData={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={() => {
            setSelectedOrder(null);
            setRefresh((prev) => !prev);
          }}
        />
      )}

      {/* Bulk Update Modal */}
      {showBulkModal && (
        <BulkOrderUpdateForm 
          onClose={() => setShowBulkModal(false)}
          onUpdate={handleBulkUpdateSubmit}
        />
      )}
    </div>
  );
};

export default AdminOrders;