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
  const orders = useConsumerDataStore((s) => s.orders);

  // Local state for form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    address_line_1: "",
    address_line_2: "",
    state: "",
    pincode: "",
    country: "",
    label: "",
  });

  // Editing states for separate sections
  const [editingSection, setEditingSection] = useState(null); // 'account' or 'address'
  const [editingAddressId, setEditingAddressId] = useState(null); // Track specific address being edited
  const [loading, setLoading] = useState(false);

  // Initialize form data for Account settings only initially
  useEffect(() => {
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
        phone_no: profile.phone_no || "",
      }));
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditAddress = (addr) => {
    // Populate form with specific address data + current profile data
    setFormData({
      name: profile.name || "",
      email: profile.email || "",
      phone_no: profile.phone_no || "",
      address_line_1: addr.address_line_1 || "",
      address_line_2: addr.address_line_2 || "",
      state: addr.state || "",
      pincode: addr.pincode || "",
      country: addr.country || "India",
      label: addr.label || "Home",
    });
    setEditingAddressId(addr.id);
    setEditingSection("address");
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm("Are you sure you want to delete this address?")) return;

    try {
      const response = await ConsumerProfileService.deleteAddress(addressId);
      
      // Update local store
      useConsumerDataStore.setState((state) => ({
        ...state,
        profile: {
          ...state.profile,
          address: state.profile.address.filter((a) => a.id !== addressId),
        },
      }));

      toast.success(response.message || "Address deleted successfully");
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error(error.response?.data?.message || "Failed to delete address");
    }
  };

  const handleSave = async (section) => {
    setLoading(true);
    toast.loading("Saving changes...");

    try {
      let payload = {};

      if (section === "account") {
        payload = {
          profile: {
            name: formData.name,
            email: formData.email,
            phone_no: formData.phone_no,
          },
          // Send existing main address if strictly required by API, otherwise omitting is usually safer if partial updates allowed.
          // Assuming API handles partial updates or we send strict structure. 
          // Based on user request, only specific structure is needed.
        };
        // For account update, we might need a different service call or the same updateProfile but with empty/null address if allowed.
        // Assuming updateProfile handles mixed content:
        const currentAddr = profile.address?.[0] || {};
        payload.address = { ...currentAddr }; // Pass current address to avoid wiping it if backend expects it
      } else if (section === "address") {
        payload = {
          profile: {
            name: formData.name,
            email: formData.email,
            phone_no: formData.phone_no,
          },
          address: {
            id: editingAddressId,
            address_line_1: formData.address_line_1,
            address_line_2: formData.address_line_2,
            state: formData.state,
            pincode: formData.pincode,
            country: formData.country,
            label: formData.label,
          },
        };
      }

      const updatedProfile = await ConsumerProfileService.updateProfile(payload);

      useConsumerDataStore.setState((state) => ({
        ...state,
        profile: updatedProfile,
      }));

      toast.dismiss();
      toast.success(
        `${section === "account" ? "Account" : "Address"} updated successfully!`
      );
      setEditingSection(null);
      setEditingAddressId(null);
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    // Revert to original profile data for account fields
    if (profile) {
      setFormData((prev) => ({
        ...prev,
        name: profile.name || "",
        email: profile.email || "",
        phone_no: profile.phone_no || "",
      }));
    }
    setEditingSection(null);
    setEditingAddressId(null);
  };

  const totalOrders = orders?.length || 0;
  const loyaltyPoints = 1250; // Mock data

  // Helper for sidebar display (shows first address or "No address")
  const primaryAddress = profile?.address?.[0];
  const displayAddress = primaryAddress
    ? [
        primaryAddress.address_line_1,
        primaryAddress.address_line_2,
        primaryAddress.state,
        primaryAddress.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    : "No address provided";

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
            {editingSection !== "account" && (
              <button
                type="button"
                onClick={() => setEditingSection("account")}
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
                isEditing={editingSection === "account"}
              />
              <EditableInput
                label="Email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isEditing={editingSection === "account"}
                type="email"
              />
              <EditableInput
                label="Phone Number"
                id="phone_no"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleInputChange}
                isEditing={editingSection === "account"}
                type="tel"
              />
            </div>

            {/* Save Actions for Account */}
            {editingSection === "account" && (
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
                  onClick={() => handleSave("account")}
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <i className="fas fa-spinner fa-spin"></i>
                  ) : (
                    <i className="fas fa-save"></i>
                  )}
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
                  Address Book
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Manage your delivery locations
                </p>
              </div>
            </div>
            {/* Can add "Add New Address" button here later if needed */}
          </div>

          <div className="space-y-4">
            {profile?.address && profile.address.length > 0 ? (
              profile.address.map((addr, index) => {
                const isEditingThis =
                  editingSection === "address" && editingAddressId === addr.id;

                return (
                  <div
                    key={addr.id || index}
                    className={`border rounded-xl p-4 transition-all ${
                      isEditingThis
                        ? "border-orange-300 bg-orange-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {isEditingThis ? (
                      // --- EDIT FORM FOR SPECIFIC ADDRESS ---
                      <div className="space-y-3">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold text-orange-700">
                            Editing {addr.label || "Address"}
                          </h4>
                        </div>
                        <EditableInput
                          label="Label (e.g., Home, Work)"
                          id={`label_${addr.id}`}
                          name="label"
                          value={formData.label}
                          onChange={handleInputChange}
                          isEditing={true}
                        />
                        <EditableInput
                          label="Address Line 1"
                          id={`address_line_1_${addr.id}`}
                          name="address_line_1"
                          value={formData.address_line_1}
                          onChange={handleInputChange}
                          isEditing={true}
                        />
                        <EditableInput
                          label="Address Line 2 (Optional)"
                          id={`address_line_2_${addr.id}`}
                          name="address_line_2"
                          value={formData.address_line_2}
                          onChange={handleInputChange}
                          isEditing={true}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <EditableInput
                            label="State"
                            id={`state_${addr.id}`}
                            name="state"
                            value={formData.state}
                            onChange={handleInputChange}
                            isEditing={true}
                          />
                          <EditableInput
                            label="Pincode"
                            id={`pincode_${addr.id}`}
                            name="pincode"
                            value={formData.pincode}
                            onChange={handleInputChange}
                            isEditing={true}
                          />
                          <EditableInput
                            label="Country"
                            id={`country_${addr.id}`}
                            name="country"
                            value={formData.country}
                            onChange={handleInputChange}
                            isEditing={true}
                          />
                        </div>

                        <div className="flex justify-end gap-3 pt-2">
                          <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-white transition text-sm font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSave("address")}
                            disabled={loading}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition text-sm font-medium flex items-center gap-2 disabled:opacity-70"
                          >
                            {loading ? (
                              <i className="fas fa-spinner fa-spin"></i>
                            ) : (
                              <i className="fas fa-save"></i>
                            )}
                            Save Address
                          </button>
                        </div>
                      </div>
                    ) : (
                      // --- VIEW MODE ---
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-800 text-sm sm:text-base">
                              {addr.label || `Address #${index + 1}`}
                            </span>
                            {/* <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">Default</span> */}
                          </div>
                          <p className="text-sm text-gray-600">
                            {addr.address_line_1}
                            {addr.address_line_2 && `, ${addr.address_line_2}`}
                          </p>
                          <p className="text-sm text-gray-600">
                            {addr.state}, {addr.country} - {addr.pincode}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 w-full sm:w-auto">
                          <button
                            onClick={() => handleEditAddress(addr)}
                            disabled={editingSection !== null}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex-1 sm:flex-none justify-center flex gap-1 items-center ${
                              editingSection !== null
                                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                            }`}
                          >
                            <i className="fas fa-pencil-alt text-xs"></i> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(addr.id)}
                            disabled={editingSection !== null}
                            className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors flex-1 sm:flex-none justify-center flex gap-1 items-center ${
                              editingSection !== null
                                ? "bg-gray-50 text-gray-400 border-gray-100 cursor-not-allowed"
                                : "bg-white text-red-600 border-red-200 hover:bg-red-50"
                            }`}
                          >
                            <i className="fas fa-trash text-xs"></i> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p>No addresses found.</p>
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
              {profile?.name ? profile.name.charAt(0).toUpperCase() : "?"}
            </div>
            <div className="overflow-hidden w-full">
              <h3 className="font-bold text-base md:text-lg text-gray-900 truncate">
                {profile?.name || "User"}
              </h3>
              <p
                className="text-sm text-gray-500 truncate"
                title={profile?.email}
              >
                {profile?.email || "No email"}
              </p>
            </div>
          </div>
          <div className="pt-3 border-t border-gray-100">
            <h4 className="font-semibold text-gray-800 mb-1 text-sm text-center sm:text-left">
              Primary Address:
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed text-center sm:text-left">
              {displayAddress}
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
              <i className="fas fa-box w-4 text-center text-gray-500"></i> My
              Orders
            </button>
            <button
              onClick={() => navigate("/consumer/dashboard/lists")}
              className="w-full text-left p-2.5 md:p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-3 transition-colors text-sm"
            >
              <i className="fas fa-list w-4 text-center text-gray-500"></i> My
              Lists
            </button>
            <button
              onClick={() => navigate("/consumer/dashboard/support")}
              className="w-full text-left p-2.5 md:p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-3 transition-colors text-sm"
            >
              <i className="fas fa-headset w-4 text-center text-gray-500"></i>{" "}
              Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;