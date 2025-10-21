// src/pages/vendor/dashboard/VendorSettings.jsx
import React, { useState } from "react";

const VendorSettings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [activeSection, setActiveSection] = useState("account");

  // Removed unused state variables:
  // const [isEditingBusinessInfo, setIsEditingBusinessInfo] = useState(false);
  // const [isManagingPaymentDetails, setIsManagingPaymentDetails] = useState(false);
  // const [isUpdatingTaxInfo, setIsUpdatingTaxInfo] = useState(false);
  // const [isUploadingDocuments, setIsUploadingDocuments] = useState(false);

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  const toggleSetting = (setting, setter) => {
    setter(!setting);
  };

  const sections = [
    { id: "account", title: "Account", icon: "fas fa-user-circle", color: "text-blue-600", bgColor: "bg-blue-50" },
    { id: "business", title: "Business", icon: "fas fa-building", color: "text-green-600", bgColor: "bg-green-50" },
    { id: "notifications", title: "Notifications", icon: "fas fa-bell", color: "text-purple-600", bgColor: "bg-purple-50" },
    { id: "privacy", title: "Privacy & Security", icon: "fas fa-shield-alt", color: "text-red-600", bgColor: "bg-red-50" }
  ];

  // Reusable Toggle Switch Component
  const ToggleSwitch = ({ enabled, onChange, color = "orange" }) => (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0"> {/* Added flex-shrink-0 */}
      <input
        type="checkbox"
        checked={enabled}
        onChange={onChange}
        className="sr-only peer"
      />
      {/* Adjusted size slightly for better touch target */}
      <div className={`w-12 h-6 bg-gray-300 peer-checked:bg-${color}-500 rounded-full transition-colors duration-300 relative peer-focus:ring-2 peer-focus:ring-${color}-300`}>
        <div className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : ''} shadow`}></div>
      </div>
    </label>
  );

  // --- Account Settings Section ---
  const renderAccountSettings = () => (
    <div className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-user text-white text-sm sm:text-base"></i>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Manage your account details</p> {/* Shortened text */}
          </div>
        </div>

        {/* Settings Items */}
        <div className="space-y-4">
          {/* Change Password */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-key text-blue-600 text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Change Password</h3>
                <p className="text-xs sm:text-sm text-gray-600">Update your account password</p> {/* Shortened */}
              </div>
            </div>
            <button className="px-4 py-2 sm:px-6 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm text-xs sm:text-sm w-full sm:w-auto">
              Change
            </button>
          </div>

          {/* Update Email & Phone */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-envelope text-green-600 text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Update Email & Phone</h3>
                <p className="text-xs sm:text-sm text-gray-600">Manage contact info</p> {/* Shortened */}
              </div>
            </div>
            <button className="px-4 py-2 sm:px-6 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm text-xs sm:text-sm w-full sm:w-auto">
              Update
            </button>
          </div>

          {/* Two-Factor Authentication */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-mobile-alt text-orange-600 text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Two-Factor Authentication</h3>
                <p className="text-xs sm:text-sm text-gray-600">Add extra security</p> {/* Shortened */}
                <span className={`inline-flex items-center px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium mt-1 sm:mt-2 ${is2FAEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {is2FAEnabled ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
            </div>
            <ToggleSwitch enabled={is2FAEnabled} onChange={handleToggle2FA} />
          </div>

          {/* Delete Account */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3 sm:p-4 bg-red-50 rounded-xl border border-red-200">
             <div className="flex items-center gap-3 sm:gap-4">
               <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                 <i className="fas fa-trash text-red-600 text-base sm:text-lg"></i>
               </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Delete Account</h3>
                <p className="text-xs sm:text-sm text-gray-600">Permanently remove account</p> {/* Shortened */}
              </div>
            </div>
            <button className="px-4 py-2 sm:px-6 sm:py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm text-xs sm:text-sm w-full sm:w-auto">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Business Settings Section ---
  const renderBusinessSettings = () => (
    <div className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-building text-white text-sm sm:text-base"></i>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Business Information</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Manage business details</p> {/* Shortened */}
          </div>
        </div>

        {/* Business Options Grid - Stacks on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company Details */}
          <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100"> {/* Added border */}
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-info-circle text-blue-600 text-sm sm:text-base"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Company Details</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Update company info & branding</p>
            <button className="w-full py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm">
              Edit Details
            </button>
          </div>

          {/* Payment Methods */}
          <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-credit-card text-green-600 text-sm sm:text-base"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Payment Methods</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Manage how you receive payments</p>
            <button className="w-full py-2 sm:py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm">
              Manage
            </button>
          </div>

          {/* Tax Information */}
          <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-file-invoice text-yellow-600 text-sm sm:text-base"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Tax Information</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Update tax forms & compliance</p>
            <button className="w-full py-2 sm:py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-xs sm:text-sm">
              Update
            </button>
          </div>

          {/* Verification */}
          <div className="p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100">
            <div className="flex items-center gap-3 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-certificate text-purple-600 text-sm sm:text-base"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Verification</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Upload documents for verification</p>
            <button className="w-full py-2 sm:py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-xs sm:text-sm">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Notification Settings Section ---
  const renderNotificationSettings = () => (
    <div className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-bell text-white text-sm sm:text-base"></i>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Notification Preferences</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Control how you get notified</p> {/* Shortened */}
          </div>
        </div>

        {/* Notification Toggles */}
        <div className="space-y-3 sm:space-y-4">
          {/* Email Notifications */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-envelope text-blue-600 text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email Notifications</h3>
                <p className="text-xs sm:text-sm text-gray-600">Receive updates via email</p>
              </div>
            </div>
            <ToggleSwitch enabled={emailNotifications} onChange={() => toggleSetting(emailNotifications, setEmailNotifications)} color="blue"/>
          </div>

          {/* SMS Notifications */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-sms text-green-600 text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">SMS Notifications</h3>
                <p className="text-xs sm:text-sm text-gray-600">Get alerts via text</p>
              </div>
            </div>
            <ToggleSwitch enabled={smsNotifications} onChange={() => toggleSetting(smsNotifications, setSmsNotifications)} color="green"/>
          </div>

          {/* Marketing Emails */}
          <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-bullhorn text-orange-600 text-base sm:text-lg"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Marketing Emails</h3>
                <p className="text-xs sm:text-sm text-gray-600">Receive promotions & tips</p>
              </div>
            </div>
            <ToggleSwitch enabled={marketingEmails} onChange={() => toggleSetting(marketingEmails, setMarketingEmails)} color="orange"/>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Privacy Settings Section ---
  const renderPrivacySettings = () => (
    <div className="space-y-4 sm:space-y-6"> {/* Adjusted spacing */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            <i className="fas fa-shield-alt text-white text-sm sm:text-base"></i>
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">Privacy & Security</h2>
            <p className="text-gray-600 text-xs sm:text-sm">Manage privacy & data</p> {/* Shortened */}
          </div>
        </div>

        <div className="space-y-4">
          {/* Profile Visibility */}
          <div className="p-3 sm:p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-eye text-red-600 text-sm sm:text-base"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Profile Visibility</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Control who sees your profile</p>
            <select className="w-full p-2.5 sm:p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-sm sm:text-base bg-white"> {/* Added bg-white */}
              <option>Public - Anyone can view</option>
              <option>Customers only</option>
              <option>Private</option>
            </select>
          </div>

          {/* Data Usage */}
          <div className="p-3 sm:p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-database text-yellow-600 text-sm sm:text-base"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Data Usage</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Manage how your data is used</p>
            <div className="space-y-2">
              <label className="flex items-center gap-2 sm:gap-3">
                <input type="checkbox" className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4" defaultChecked />
                <span className="text-xs sm:text-sm text-gray-700">Allow analytics data collection</span>
              </label>
              <label className="flex items-center gap-2 sm:gap-3">
                <input type="checkbox" className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500 h-4 w-4" />
                <span className="text-xs sm:text-sm text-gray-700">Share data with partners</span> {/* Shortened */}
              </label>
            </div>
          </div>

          {/* Data Export */}
          <div className="p-3 sm:p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <i className="fas fa-download text-green-600 text-sm sm:text-base"></i>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Data Export</h3>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Download a copy of your data</p>
            <button className="px-4 py-2 sm:px-6 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm">
              Request Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // --- Render Correct Section Based on State ---
  const renderContent = () => {
    switch(activeSection) {
      case "account": return renderAccountSettings();
      case "business": return renderBusinessSettings();
      case "notifications": return renderNotificationSettings();
      case "privacy": return renderPrivacySettings();
      default: return renderAccountSettings();
    }
  };

  // --- Main Component Return ---
  return (
    // Adjusted outer padding for responsiveness
    <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Title removed - handled by layout */}

      {/* Responsive Grid: Stacks on mobile, sidebar on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
           {/* Make sidebar content scrollable if needed on small screens, adjust sticky */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:sticky lg:top-[86px]"> {/* Adjusted top offset for sticky */}
            <div className="space-y-1.5 sm:space-y-2"> {/* Reduced spacing */}
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl transition-all duration-200 text-sm sm:text-base ${
                    activeSection === section.id
                      ? `${section.bgColor} ${section.color} font-bold shadow-sm` // Simplified active state
                      : "text-gray-600 hover:bg-gray-50 font-medium" // Simplified inactive state
                  }`}
                >
                  <i className={`${section.icon} text-base sm:text-lg w-5 text-center`}></i> {/* Fixed width icon */}
                  <span>{section.title}</span> {/* Removed font-semibold */}
                </button>
              ))}
            </div>

            {/* Quick Support - Simplified */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
              <div className="p-3 sm:p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-life-ring text-white text-xs sm:text-sm"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Need Help?</h3>
                </div>
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Get support from our team</p>
                <button
                  // Make sure this navigation works with your router setup
                  onClick={() => window.location.href = "/vendor/support"} // Simplified navigation
                  className="w-full py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium text-xs sm:text-sm"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VendorSettings;