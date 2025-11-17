// src/pages/consumer/dashboard/ConsumerSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConsumerDataStore } from "../../../store/consumer/consumerDataStore";
import { ConsumerProfileService } from "../../../services/consumer/consumerProfileService";
import toast from "react-hot-toast";

const EditableInput = ({
  label,
  id,
  name,
  value,
  onChange,
  isEditing,
  type = "text",
  placeholder = "",
}) => (
  <div>
    <label
      htmlFor={id}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      readOnly={!isEditing}
      placeholder={placeholder}
      className={`w-full p-2.5 md:p-3 text-sm sm:text-base border rounded-xl transition-colors focus:outline-none ${
        isEditing
          ? "border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 bg-white"
          : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
      }`}
    />
  </div>
);

const CustomerSettings = () => {
  const navigate = useNavigate();
  
  // Get data and methods from store
  const profile = useConsumerDataStore((s) => s.profile);
  const fetchProfile = useConsumerDataStore((s) => s.fetchProfile);
  const orders = useConsumerDataStore((s) => s.orders);

  // Local state for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    label: "Home", // Default label
  });

  // Editing states for separate sections
  const [editingSection, setEditingSection] = useState(null); // 'account' or 'address' or null
  const [loading, setLoading] = useState(false);

  // Initialize form data from store profile
  useEffect(() => {
    if (profile) {
      // Get the first address or default to empty
      const currentAddr = profile.address?.[0] || {};
      
      setFormData({
        name: profile.name || "",
        email: profile.email || "",
        phone_no: profile.phone_no || "",
        address_line_1: currentAddr.address_line_1 || "",
        address_line_2: currentAddr.address_line_2 || "",
        city: currentAddr.city || "",
        state: currentAddr.state || "",
        pincode: currentAddr.pincode || "",
        country: currentAddr.country || "India",
        label: currentAddr.label || "Home",
      });
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (section) => {
    setLoading(true);
    toast.loading("Saving changes...");

    try {
      // Construct payload based on backend expectations
      // We send both parts, but updated with new form data
      const payload = {
        profile: {
          name: formData.name,
          email: formData.email,
          phone_no: formData.phone_no,
        },
        address: {
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
          label: formData.label,
        },
      };

      await ConsumerProfileService.updateProfile(payload);
      
      // Refresh store to reflect changes immediately and persist
      await fetchProfile();

      toast.dismiss();
      toast.success(`${section === 'account' ? 'Account' : 'Address'} updated successfully!`);
      setEditingSection(null);
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Revert to original profile data
    if (profile) {
        const currentAddr = profile.address?.[0] || {};
        setFormData({
            name: profile.name || "",
            email: profile.email || "",
            phone_no: profile.phone_no || "",
            address_line_1: currentAddr.address_line_1 || "",
            address_line_2: currentAddr.address_line_2 || "",
            city: currentAddr.city || "",
            state: currentAddr.state || "",
            pincode: currentAddr.pincode || "",
            country: currentAddr.country || "India",
            label: currentAddr.label || "Home",
        });
    }
    setEditingSection(null);
  };

  const totalOrders = orders?.length || 0;
  const loyaltyPoints = 1250; // Mock data

  // Helper to display address cleanly in sidebar
  const displayAddress = [
    formData.address_line_1,
    formData.address_line_2,
    formData.city,
    formData.state,
    formData.pincode
  ].filter(Boolean).join(", ");

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      
      {/* --- MAIN CONTENT COLUMN --- */}
      <div className="xl:col-span-3 space-y-6">
        
        {/* 1. ACCOUNT SETTINGS SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between gap-2 md:gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-user-circle text-white text-sm md:text-base"></i>
              </div>
              <div>
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                  Account Settings
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Personal details & contact info
                </p>
              </div>
            </div>
            {editingSection !== 'account' && (
              <button
                type="button"
                onClick={() => setEditingSection('account')}
                className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-xs sm:text-sm font-semibold flex items-center gap-1.5"
              >
                <i className="fas fa-pencil-alt"></i> Edit
              </button>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <EditableInput
                label="Full Name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                isEditing={editingSection === 'account'}
              />
              <EditableInput
                label="Email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isEditing={editingSection === 'account'}
                type="email"
              />
              <EditableInput
                label="Phone Number"
                id="phone_no"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                isEditing={editingSection === 'account'}
                type="tel"
              />
            </div>

            {/* Save Actions for Account */}
            {editingSection === 'account' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('account')}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                  Save Account Info
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 2. ADDRESS SETTINGS SECTION */}
        <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between gap-2 md:gap-3 mb-4 pb-4 border-b border-gray-100">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <i className="fas fa-map-marker-alt text-white text-sm md:text-base"></i>
              </div>
              <div>
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                  Address Settings
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Shipping & Delivery details
                </p>
              </div>
            </div>
            {editingSection !== 'address' && (
              <button
                type="button"
                onClick={() => setEditingSection('address')}
                className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-xs sm:text-sm font-semibold flex items-center gap-1.5"
              >
                <i className="fas fa-pencil-alt"></i> Edit
              </button>
            )}
          </div>

          <div className="space-y-3 md:space-y-4">
            <EditableInput
              label="Address Line 1"
              id="address_line_1"
              name="address_line_1"
              value={formData.address_line_1}
              onChange={handleInputChange}
              isEditing={editingSection === 'address'}
            />
            <EditableInput
              label="Address Line 2 (Optional)"
              id="address_line_2"
              name="address_line_2"
              value={formData.address_line_2}
              onChange={handleInputChange}
              isEditing={editingSection === 'address'}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <EditableInput
                label="City"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                isEditing={editingSection === 'address'}
              />
              <EditableInput
                label="State"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                isEditing={editingSection === 'address'}
              />
              <EditableInput
                label="Pincode"
                id="pincode"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                isEditing={editingSection === 'address'}
              />
            </div>

             {/* Save Actions for Address */}
             {editingSection === 'address' && (
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleSave('address')}
                  disabled={loading}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium flex items-center gap-2 disabled:opacity-70"
                >
                   {loading ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-save"></i>}
                   Save Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* --- SIDEBAR COLUMN (Read-Only Preview) --- */}
      <div className="xl:col-span-1 space-y-3 md:space-y-4 lg:space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 md:p-4 lg:p-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-md flex-shrink-0">
              {formData.name ? formData.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="overflow-hidden w-full">
              <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">
                {formData.name || "User"}
              </h3>
              <p className="text-sm text-gray-500 truncate" title={formData.email}>
                {formData.email || "No email"}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-1 text-sm text-center sm:text-left">
              Current Address:
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed text-center sm:text-left">
              {displayAddress || "No address provided"}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 md:p-4 lg:p-6">
          <h3 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-base md:text-lg">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-pie text-green-600 text-sm md:text-base"></i>
            </div>
            Your Stats
          </h3>
          <div className="space-y-2 md:space-y-3">
            <div className="p-2.5 md:p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-600 font-medium">Total Orders</p>
              <p className="text-xl md:text-2xl font-bold text-gray-900">
                {totalOrders}
              </p>
            </div>
            <div className="p-2.5 md:p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
              <p className="text-sm text-gray-600 font-medium">
                Loyalty Points
              </p>
              <p className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-1">
                <i className="fas fa-star text-yellow-500 text-lg md:text-xl"></i>
                {loyaltyPoints}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 md:p-4 lg:p-6">
           <h3 className="font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2 text-base md:text-lg">
            <div className="w-7 h-7 md:w-8 md:h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-link text-orange-600 text-sm md:text-base"></i>
            </div>
            Quick Links
          </h3>
          <div className="space-y-1.5 md:space-y-2">
            <button
              onClick={() => navigate("/consumer/dashboard/orders")}
              className="w-full text-left p-2.5 md:p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-3 transition-colors text-sm"
            >
              <i className="fas fa-box w-4 text-center text-gray-500"></i> My Orders
            </button>
            <button
              onClick={() => navigate("/consumer/dashboard/lists")}
              className="w-full text-left p-2.5 md:p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-3 transition-colors text-sm"
            >
              <i className="fas fa-list w-4 text-center text-gray-500"></i> My Lists
            </button>
            <button
              onClick={() => navigate("/consumer/dashboard/support")}
              className="w-full text-left p-2.5 md:p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-3 transition-colors text-sm"
            >
              <i className="fas fa-headset w-4 text-center text-gray-500"></i> Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;