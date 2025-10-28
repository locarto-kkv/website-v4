// src/pages/consumer/dashboard/ConsumerSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useConsumerDataStore } from "../../../store/consumer/consumerDataStore";

const ToggleSwitch = ({ enabled, onChange, color = "orange" }) => (
  <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
    <input
      type="checkbox"
      checked={enabled}
      onChange={onChange}
      className="sr-only peer"
    />
    <div
      className={`w-11 h-6 bg-gray-300 peer-checked:bg-${color}-500 rounded-full transition-colors duration-300 relative peer-focus:ring-2 peer-focus:ring-${color}-300`}
    >
      <div
        className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${
          enabled ? "translate-x-5" : ""
        } shadow`}
      ></div>
    </div>
  </label>
);

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
          : "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
      }`}
    />
  </div>
);

const CustomerSettings = () => {
  const [profileData, setProfileData] = useState({
    name: "Jane Doe",
    email: "jane.doe@example.com",
    phone: "555-1234",
    addressLine1: "123 Main St",
    addressLine2: "Apt 4B",
    city: "Anytown",
    state: "Anystate",
    pincode: "12345",
  });
  const [loading, setLoading] = useState(false);
  const [isEditingAccountInfo, setIsEditingAccountInfo] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

  const navigate = useNavigate();
  const { orders } = useConsumerDataStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Saving Profile Data:", profileData);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditingAccountInfo(false);
      alert("Settings saved successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (setter) => {
    setter((prev) => !prev);
  };

  const totalOrders = orders?.length || 0;
  const loyaltyPoints = 1250;

  const displayAddress = `${profileData.addressLine1}${
    profileData.addressLine2 ? ", " + profileData.addressLine2 : ""
  }, ${profileData.city || ""}, ${profileData.state || ""} ${
    profileData.pincode || ""
  }`.replace(/ ,|, $/g, "");

  return (
    // Reduced gap on mobile: gap-3 instead of gap-4
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      <div className="xl:col-span-3">
        {/* Reduced spacing on mobile: space-y-3 instead of space-y-4 */}
        <form
          onSubmit={handleSaveChanges}
          className="space-y-3 md:space-y-4 lg:space-y-6"
        >
          {/* Reduced padding on mobile: p-3 instead of p-4 */}
          <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 border border-gray-100">
            {/* Reduced gap and margin on mobile */}
            <div className="flex items-center justify-between gap-2 md:gap-3 mb-3 md:mb-4 lg:mb-6">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-user-edit text-white text-sm md:text-base"></i>
                </div>
                <div>
                  <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                    Account Information
                  </h2>
                  <p className="text-gray-600 text-xs sm:text-sm">
                    Update your personal details
                  </p>
                </div>
              </div>
              {!isEditingAccountInfo && (
                <button
                  type="button"
                  onClick={() => setIsEditingAccountInfo(true)}
                  className="px-2.5 py-1.5 md:px-3 md:py-1.5 lg:px-4 lg:py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm font-semibold flex items-center gap-1.5 md:gap-2"
                >
                  <i className="fas fa-pencil-alt text-xs"></i> Edit
                </button>
              )}
            </div>

            {/* Reduced spacing: space-y-3 instead of space-y-4 */}
            <div className="space-y-3 md:space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <EditableInput
                  label="Full Name"
                  id="name"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  isEditing={isEditingAccountInfo}
                />
                <EditableInput
                  label="Email"
                  id="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  isEditing={isEditingAccountInfo}
                  type="email"
                />
                <EditableInput
                  label="Phone"
                  id="phone"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  isEditing={isEditingAccountInfo}
                  type="tel"
                />
              </div>
              {/* Reduced padding and margin */}
              <h3 className="text-sm md:text-md font-semibold text-gray-800 pt-3 md:pt-4 border-t mt-3 md:mt-4">
                Shipping Address
              </h3>
              <EditableInput
                label="Address Line 1"
                id="addressLine1"
                name="addressLine1"
                value={profileData.addressLine1}
                onChange={handleInputChange}
                isEditing={isEditingAccountInfo}
              />
              <EditableInput
                label="Address Line 2 (Optional)"
                id="addressLine2"
                name="addressLine2"
                value={profileData.addressLine2}
                onChange={handleInputChange}
                isEditing={isEditingAccountInfo}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
                <EditableInput
                  label="City"
                  id="city"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                  isEditing={isEditingAccountInfo}
                />
                <EditableInput
                  label="State"
                  id="state"
                  name="state"
                  value={profileData.state}
                  onChange={handleInputChange}
                  isEditing={isEditingAccountInfo}
                />
                <EditableInput
                  label="Pincode"
                  id="pincode"
                  name="pincode"
                  value={profileData.pincode}
                  onChange={handleInputChange}
                  isEditing={isEditingAccountInfo}
                />
              </div>
              {isEditingAccountInfo && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setIsEditingAccountInfo(false)}
                    className="px-3 py-1.5 md:px-4 md:py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Notifications Section - reduced padding */}
          <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 border border-gray-100">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 lg:mb-6">
              <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-bell text-white text-sm md:text-base"></i>
              </div>
              <div>
                <h2 className="text-base md:text-lg lg:text-xl font-bold text-gray-900">
                  Notifications
                </h2>
                <p className="text-gray-600 text-xs sm:text-sm">
                  Choose how you want to be notified
                </p>
              </div>
            </div>
            {/* Reduced spacing: space-y-2 instead of space-y-3 */}
            <div className="space-y-2 md:space-y-3">
              <div className="flex items-center justify-between p-2.5 md:p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium text-sm">
                  Order updates via Email
                </span>
                <ToggleSwitch
                  enabled={emailNotifications}
                  onChange={() => toggleSetting(setEmailNotifications)}
                  color="purple"
                />
              </div>
              <div className="flex items-center justify-between p-2.5 md:p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium text-sm">
                  Order updates via SMS
                </span>
                <ToggleSwitch
                  enabled={smsNotifications}
                  onChange={() => toggleSetting(setSmsNotifications)}
                  color="purple"
                />
              </div>
              <div className="flex items-center justify-between p-2.5 md:p-3 bg-gray-50 rounded-lg">
                <span className="text-gray-700 font-medium text-sm">
                  Promotional & Marketing Emails
                </span>
                <ToggleSwitch
                  enabled={marketingEmails}
                  onChange={() => toggleSetting(setMarketingEmails)}
                  color="purple"
                />
              </div>
            </div>
          </div>

          {/* Save Button - reduced padding */}
          <div className="bg-white rounded-2xl shadow-lg p-3 md:p-4 lg:p-6 border border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading || !isEditingAccountInfo}
              className={`py-2.5 px-5 md:py-3 md:px-6 text-sm sm:text-base bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 ${
                loading || !isEditingAccountInfo
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Saving...
                </>
              ) : (
                <>
                  <i className="fas fa-save"></i> Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Sidebar Area - reduced spacing */}
      <div className="xl:col-span-1 space-y-3 md:space-y-4 lg:space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-3 md:p-4 lg:p-6">
          <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:items-center gap-3 md:gap-4 mb-3 md:mb-4">
            <div className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xl md:text-2xl font-bold shadow-md flex-shrink-0">
              {profileData.name
                ? profileData.name.charAt(0).toUpperCase()
                : "?"}
            </div>
            <div>
              <h3 className="font-bold text-base md:text-lg text-gray-900">
                {profileData.name || "User"}
              </h3>
              <p className="text-sm text-gray-500 truncate">
                {profileData.email || "No email"}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 text-sm text-center sm:text-left">
              Address:
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
          {/* Reduced spacing: space-y-2 instead of space-y-3 */}
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
          {/* Reduced spacing: space-y-1.5 instead of space-y-2 */}
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
