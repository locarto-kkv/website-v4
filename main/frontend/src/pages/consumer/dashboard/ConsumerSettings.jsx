// src/pages/consumer/dashboard/ConsumerSettings.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
// Import profile service if you plan to fetch/update data
// import { ConsumerProfileService } from "../../../services/consumer/consumerProfileService"; // Adjust path
// Import auth store if needed to get current user details
// import { useAuthStore } from "../../../store/useAuthStore"; // Adjust path
// Import consumer data context if needed for stats
import { useConsumerData } from "../../../context/consumer/consumerDataContext"; // Adjust path if needed

// Reusable Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, color = "orange" }) => (
  <label className="relative inline-flex items-center cursor-pointer">
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

// Input field component with readOnly state
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
      readOnly={!isEditing} // Make readOnly based on isEditing state
      placeholder={placeholder}
      className={`w-full p-3 border rounded-xl transition-colors focus:outline-none ${
        isEditing
          ? "border-gray-300 focus:border-orange-500 focus:ring-orange-500 bg-white" // Editable style
          : "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed" // Read-only style
      }`}
    />
  </div>
);

const CustomerSettings = () => {
  // --- State for Form Inputs ---
  const [profileData, setProfileData] = useState({
    name: "Jane Doe", // Placeholder
    email: "jane.doe@example.com", // Placeholder
    phone: "555-1234", // Placeholder
    addressLine1: "123 Main St", // Placeholder
    addressLine2: "Apt 4B", // Placeholder
    city: "Anytown", // Placeholder
    state: "Anystate", // Placeholder
    pincode: "12345", // Placeholder
  });
  const [loading, setLoading] = useState(false); // For fetching/saving state
  const [isEditingAccountInfo, setIsEditingAccountInfo] = useState(false); // State for edit mode

  // --- State for Notification Toggles ---
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);

  const navigate = useNavigate(); // Initialize useNavigate
  const { orders } = useConsumerData(); // Get orders for stats

  // --- Example Fetching Logic (Adapt as needed) ---
  // useEffect(() => {
  //     const fetchProfile = async () => {
  //         setLoading(true);
  //         try {
  //             // const data = await ConsumerProfileService.getProfile();
  //             // Simulate fetching data - replace with actual API call
  //             const data = {
  //                 name: "Fetched User",
  //                 email: "fetched@example.com",
  //                 phone: "1234567890",
  //                 // Add address fields from API if available
  //             };
  //             setProfileData(prev => ({...prev, ...data})); // Merge fetched data
  //             // Set notification states based on fetched data if available
  //         } catch (error) {
  //             console.error("Failed to fetch profile:", error);
  //         } finally {
  //             setLoading(false);
  //         }
  //     };
  //     fetchProfile();
  // }, []);
  // --- End Fetching Example ---

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Saving Profile Data:", profileData);
    console.log("Saving Notification Settings:", {
      emailNotifications,
      smsNotifications,
      marketingEmails,
    });
    try {
      // await ConsumerProfileService.updateProfile(profileData);
      // // API calls to update notification preferences might be needed
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      setIsEditingAccountInfo(false); // Exit edit mode after saving
      alert("Settings saved successfully!"); // Replace with toast
    } catch (error) {
      console.error("Failed to save settings:", error);
      alert("Failed to save settings."); // Replace with toast
    } finally {
      setLoading(false);
    }
  };

  const toggleSetting = (setter) => {
    setter((prev) => !prev);
  };

  // Calculate total orders (example stat)
  const totalOrders = orders?.length || 0;

  // Placeholder for Loyalty Points (replace with actual data fetching/calculation)
  const loyaltyPoints = 1250; // Example value

  const displayAddress = `${profileData.addressLine1}${
    profileData.addressLine2 ? ", " + profileData.addressLine2 : ""
  }, ${profileData.city || ""}, ${profileData.state || ""} ${
    profileData.pincode || ""
  }`.replace(/ ,|, $/g, ""); // Basic formatting

  if (loading && !profileData.name) {
    // Show loading only on initial load
    return (
      <div className="flex items-center justify-center h-[calc(100vh-150px)]">
        {" "}
        {/* Centered loading */}
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
      {" "}
      {/* Main Grid Layout */}
      {/* Main Settings Content Area */}
      <div className="xl:col-span-3">
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {" "}
          {/* Form wraps sections */}
          {/* Account Information Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <i className="fas fa-user-edit text-white"></i>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Account Information
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Update your personal details
                  </p>
                </div>
              </div>
              {!isEditingAccountInfo && ( // Show Edit button only when not editing
                <button
                  type="button" // Important: type="button" to prevent form submission
                  onClick={() => setIsEditingAccountInfo(true)}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold flex items-center gap-2"
                >
                  <i className="fas fa-pencil-alt text-xs"></i> Edit
                </button>
              )}
            </div>
            {/* End Header */}

            <div className="space-y-4">
              {/* Use EditableInput component */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              <h3 className="text-md font-semibold text-gray-800 pt-4 border-t mt-4">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              {/* Show Cancel button when editing */}
              {isEditingAccountInfo && (
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingAccountInfo(false);
                      // Optional: Revert changes if needed by refetching data
                      // fetchProfile();
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              )}
              {/* End EditableInput Usage */}
            </div>
          </div>
          {/* Notifications Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <i className="fas fa-bell text-white"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Notifications
                </h2>
                <p className="text-gray-600 text-sm">
                  Choose how you want to be notified
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700 font-medium">
                  Order updates via Email
                </span>
                <ToggleSwitch
                  enabled={emailNotifications}
                  onChange={() => toggleSetting(setEmailNotifications)}
                  color="purple"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700 font-medium">
                  Order updates via SMS
                </span>
                <ToggleSwitch
                  enabled={smsNotifications}
                  onChange={() => toggleSetting(setSmsNotifications)}
                  color="purple"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-gray-700 font-medium">
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
          {/* Save Button */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 flex justify-end">
            <button
              type="submit"
              disabled={loading || !isEditingAccountInfo} // Disable if not editing account info OR if already loading
              className={`bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-8 rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2 ${
                loading || !isEditingAccountInfo
                  ? "opacity-50 cursor-not-allowed"
                  : "" // Style when disabled
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
      {/* Sidebar Area */}
      <div className="xl:col-span-1 space-y-6">
        {/* Profile Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-md">
              {profileData.name
                ? profileData.name.charAt(0).toUpperCase()
                : "?"}
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">
                {profileData.name || "User"}
              </h3>
              <p className="text-sm text-gray-500">
                {profileData.email || "No email"}
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2 text-sm">
              Address:
            </h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {displayAddress || "No address provided"}
            </p>
          </div>
        </div>

        {/* Quick Stats Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-pie text-green-600"></i>
            </div>
            Your Stats
          </h3>
          <div className="space-y-3">
            <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
              <p className="text-sm text-gray-600 font-medium">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
            </div>
            {/* Loyalty Points */}
            <div className="p-3 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-100">
              <p className="text-sm text-gray-600 font-medium">
                Loyalty Points Earned
              </p>
              <p className="text-2xl font-bold text-gray-900 flex items-center gap-1">
                <i className="fas fa-star text-yellow-500 text-xl"></i>
                {loyaltyPoints}
              </p>
            </div>
            {/* End Loyalty Points */}
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-link text-orange-600"></i>
            </div>
            Quick Links
          </h3>
          {/* **MODIFIED: All three links included** */}
          <div className="space-y-2">
            <button
              onClick={() => navigate("/consumer/dashboard/orders")}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-3 transition-colors"
            >
              <i className="fas fa-box w-4 text-center text-gray-500"></i> My
              Orders
            </button>
            <button
              onClick={() => navigate("/consumer/dashboard/lists")}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-3 transition-colors"
            >
              <i className="fas fa-list w-4 text-center text-gray-500"></i> My
              Lists
            </button>
            <button
              onClick={() => navigate("/consumer/dashboard/support")}
              className="w-full text-left p-3 rounded-lg hover:bg-gray-100 text-gray-700 font-medium flex items-center gap-3 transition-colors"
            >
              <i className="fas fa-headset w-4 text-center text-gray-500"></i>{" "}
              Support
            </button>
          </div>
          {/* **END MODIFICATION** */}
        </div>
      </div>
    </div>
  );
};

export default CustomerSettings;
