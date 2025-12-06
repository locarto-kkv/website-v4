// src/pages/admin/dashboard/AdminVendors.jsx
import React, { useState, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { formatDate } from "../../../lib/utils";
import { useDataStore } from "../../../store/useDataStore";
import { AdminVendorService } from "../../../services/admin/adminVendorService";

// --- Helper Components ---

const StatusBadge = ({ status }) => {
  const configs = {
    incomplete: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: "fas fa-clock",
      label: "Incomplete Setup",
    },
    pending: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: "fas fa-hourglass-half",
      label: "Pending Verification",
    },
    verified: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: "fas fa-check-circle",
      label: "Verified",
    },
    rejected: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: "fas fa-ban",
      label: "Rejected",
    },
  };

  const config = configs[status?.toLowerCase()] || configs.incomplete;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${config.color}`}
    >
      <i className={`${config.icon} text-[10px]`}></i>
      {config.label}
    </span>
  );
};

// --- Bulk Update Modal ---
const BulkVendorUpdateForm = ({ onClose, onUpdate }) => {
  const [status, setStatus] = useState("");

  const handleSubmit = () => {
    if (!status) {
      toast.error("Please select a status");
      return;
    }
    onUpdate(status);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <i className="fas fa-users-cog text-orange-500"></i>
            Bulk Update Vendors
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="p-6 bg-gray-50 space-y-4">
          <p className="text-sm text-gray-600">
            Select a new status to apply to all selected vendors.
          </p>
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block mb-2">
              New Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white"
            >
              <option value="">Select Status</option>
              <option value="incomplete">Incomplete Setup</option>
              <option value="pending">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="bg-gray-100 px-6 py-4 flex justify-end gap-3 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-white transition-all text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all text-sm"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Single Edit Modal ---
const VendorEditForm = ({ vendor, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({ ...vendor });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handleSubmit = () => {
    onUpdate(formData.id, formData.status);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <i className="fas fa-edit text-orange-500"></i>
              Edit Vendor Details
            </h2>
            <p className="text-gray-400 text-xs mt-1">
              Vendor ID: #{formData.id}
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
            {/* Status Section */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm md:col-span-2">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-toggle-on text-blue-500"></i> Account
                Status
              </h3>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-2">
                  Current Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm bg-white"
                >
                  <option value="incomplete">Incomplete Setup</option>
                  <option value="pending">Pending Verification</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
                <p className="text-xs text-gray-500 mt-2">
                  <i className="fas fa-info-circle mr-1"></i>
                  Changing to "Verified" will grant the vendor full access to
                  the platform.
                </p>
              </div>
            </div>

            {/* Basic Info */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-store text-orange-500"></i> Basic
                Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
                <i className="fas fa-map-marker-alt text-green-500"></i> Address
                Details
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Address Line
                  </label>
                  <input
                    type="text"
                    name="address_line_1"
                    value={formData.address?.address_line_1 || ""}
                    onChange={handleAddressChange}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.address?.city || ""}
                      onChange={handleAddressChange}
                      className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.address?.state || ""}
                      onChange={handleAddressChange}
                      className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1">
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.address?.pincode || ""}
                    onChange={handleAddressChange}
                    className="w-full p-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3 shrink-0">
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
            Update Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---

const AdminVendors = () => {
  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [refresh, setRefresh] = useState(false);

  // UI State
  const [viewMode, setViewMode] = useState("table");
  const [selectedVendor, setSelectedVendor] = useState(null);

  // Selection State
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [showBulkModal, setShowBulkModal] = useState(false);

  const vendors = useDataStore((s) => s.brands);
  const fetchBrands = useDataStore((s) => s.fetchBrands);

  useEffect(() => {
    fetchBrands();
  }, [refresh]);

  // --- Filtering & Sorting Logic ---
  const processedVendors = useMemo(() => {
    let result = [...vendors];

    // Status Filter
    if (statusFilter !== "all") {
      result = result.filter((v) => v.status === statusFilter);
    }

    // Search Filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.name.toLowerCase().includes(q) ??
          v.email.toLowerCase().includes(q) ??
          v.phone.includes(q)
      );
    }

    // Date Filter (Mock logic for 'created_at')
    const now = new Date();
    if (dateFilter === "today") {
      result = result.filter(
        (v) => new Date(v.created_at).toDateString() === now.toDateString()
      );
    } else if (dateFilter === "week") {
      const weekAgo = new Date(now.setDate(now.getDate() - 7));
      result = result.filter((v) => new Date(v.created_at) >= weekAgo);
    } else if (dateFilter === "month") {
      const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
      result = result.filter((v) => new Date(v.created_at) >= monthAgo);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "oldest")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "name_asc") return a.name.localeCompare(b.name);
      if (sortBy === "name_desc") return b.name.localeCompare(a.name);
      return 0;
    });

    return result;
  }, [vendors, statusFilter, dateFilter, searchQuery, sortBy]);

  // --- Stats Calculation ---
  const stats = useMemo(
    () => ({
      total: vendors.length,
      incomplete: vendors.filter((v) => v.status === "incomplete").length,
      pending: vendors.filter((v) => v.status === "pending").length,
      verified: vendors.filter((v) => v.status === "verified").length,
    }),
    [vendors]
  );

  // --- Handlers ---

  const handleEditClick = (e, vendor) => {
    e.stopPropagation();
    setSelectedVendor(vendor);
  };

  const handleUpdateVendor = async (vendorId, status) => {
    await AdminVendorService.authoriseVendor({
      vendorIds: [vendorId],
      status,
    });
    toast.success("Vendor Status Updated");
    setSelectedVendor(null);
    setRefresh((prev) => !prev);
  };

  const handleBulkUpdate = async (data) => {
    await AdminVendorService.authoriseVendor({
      vendorIds: Array.from(selectedIds),
      status: data,
    });
    toast.success("Vendor Status Updated");
    setShowBulkModal(false);
    setSelectedIds(new Set());
    setSelectionMode(false);
    setRefresh((prev) => !prev);
  };

  // Selection Logic
  const handleRowClick = (id) => {
    if (selectionMode) {
      const newSelected = new Set(selectedIds);
      if (newSelected.has(id)) newSelected.delete(id);
      else newSelected.add(id);
      setSelectedIds(newSelected);
    } else {
      setSelectionMode(true);
      setSelectedIds(new Set([id]));
    }
  };

  const handleSelectAll = () => {
    const allIds = new Set(processedVendors.map((v) => v.id));
    setSelectedIds(allIds);
  };

  const handleCancelSelection = () => {
    setSelectedIds(new Set());
    setSelectionMode(false);
  };

  return (
    <div className="space-y-6">
      {/* --- Top Stats --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Vendors",
            value: stats.total,
            icon: "fas fa-store",
            color: "from-gray-700 to-gray-900",
          },
          {
            label: "Incomplete Setup",
            value: stats.incomplete,
            icon: "fas fa-clock",
            color: "from-yellow-400 to-orange-500",
          },
          {
            label: "Pending Verification",
            value: stats.pending,
            icon: "fas fa-hourglass-half",
            color: "from-blue-400 to-indigo-500",
          },
          {
            label: "Verified Vendors",
            value: stats.verified,
            icon: "fas fa-check-circle",
            color: "from-green-500 to-emerald-600",
          },
        ].map((stat, idx) => (
          <div
            key={idx}
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-gray-800 mt-1">
                {stat.value}
              </p>
            </div>
            <div
              className={`w-10 h-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-white shadow-md`}
            >
              <i className={stat.icon}></i>
            </div>
          </div>
        ))}
      </div>

      {/* --- Controls Bar --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
        <div className="flex flex-col gap-5">
          {/* Search */}
          <div className="relative">
            <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 outline-none text-sm transition-shadow"
            />
          </div>

          {/* Filters Row */}
          <div className="flex flex-col md:flex-row gap-4 items-end">
            {/* Date Range */}
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                Date Range
              </label>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>

            {/* Status */}
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">
                Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 bg-white text-sm"
              >
                <option value="all">All Statuses</option>
                <option value="incomplete">Incomplete Setup</option>
                <option value="pending">Pending Verification</option>
                <option value="verified">Verified</option>
              </select>
            </div>

            {/* Sort */}
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
                <option value="name_asc">Name (A-Z)</option>
                <option value="name_desc">Name (Z-A)</option>
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg shrink-0">
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

      {/* --- Selection Action Bar --- */}
      {selectionMode && (
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 text-white animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center font-bold">
              {selectedIds.size}
            </div>
            <span className="font-medium">Vendors Selected</span>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleSelectAll}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
            >
              Select All
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
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
              Update Status
            </button>
          </div>
        </div>
      )}

      {/* --- Main Content --- */}
      {viewMode === "table" ? (
        // --- Table View ---
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {selectionMode && <th className="w-12 px-6 py-4"></th>}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Vendor Info
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Date Joined
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {processedVendors.map((vendor) => {
                  const isSelected = selectedIds.has(vendor.id);
                  return (
                    <tr
                      key={vendor.id}
                      onClick={() => handleRowClick(vendor.id)}
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
                            {isSelected && (
                              <i className="fas fa-check text-xs"></i>
                            )}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm text-gray-500 font-mono">
                        #{vendor.id}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={vendor.brand_logo_1}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover border border-gray-200 bg-gray-50"
                          />
                          <div>
                            <p className="font-bold text-gray-900 text-sm">
                              {vendor.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {vendor.address[0]?.state},{" "}
                              {vendor.address[0]?.country}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {vendor.email}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {vendor.phone_no}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={vendor.status} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatDate(vendor.created_at)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => handleEditClick(e, vendor)}
                          className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 font-medium text-sm transition-colors"
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
        // --- Card View ---
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedVendors.map((vendor) => {
            const isSelected = selectedIds.has(vendor.id);
            return (
              <div
                key={vendor.id}
                onClick={() => handleRowClick(vendor.id)}
                className={`bg-white rounded-2xl p-5 border shadow-sm transition-all cursor-pointer relative group ${
                  isSelected
                    ? "border-orange-500 ring-2 ring-orange-200"
                    : "border-gray-200 hover:border-orange-300 hover:shadow-md"
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

                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={vendor.brand_logo_1}
                    alt=""
                    className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900 line-clamp-1">
                      {vendor.name}
                    </h4>
                    <p className="text-xs text-gray-500">ID: #{vendor.id}</p>
                  </div>
                </div>

                <div className="space-y-3 mb-4 border-t border-gray-100 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">Status</span>
                    <StatusBadge status={vendor.status} />
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Email</span>
                    <span
                      className="text-gray-900 font-medium truncate max-w-[150px]"
                      title={vendor.email}
                    >
                      {vendor.email}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Joined</span>
                    <span className="text-gray-900">
                      {formatDate(vendor.created_at)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleEditClick(e, vendor)}
                  className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-blue-600 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-edit"></i> Edit Details
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* --- Modals --- */}
      {showBulkModal && (
        <BulkVendorUpdateForm
          onClose={() => setShowBulkModal(false)}
          onUpdate={handleBulkUpdate}
        />
      )}

      {selectedVendor && (
        <VendorEditForm
          vendor={selectedVendor}
          onClose={() => setSelectedVendor(null)}
          onUpdate={handleUpdateVendor}
        />
      )}
    </div>
  );
};

export default AdminVendors;
