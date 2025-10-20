import React, { useState } from "react";

const VendorSettings = () => {
  const [is2FAEnabled, setIs2FAEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [activeSection, setActiveSection] = useState("account");
  const [isEditingBusinessInfo, setIsEditingBusinessInfo] = useState(false);
  const [isManagingPaymentDetails, setIsManagingPaymentDetails] = useState(false);
  const [isUpdatingTaxInfo, setIsUpdatingTaxInfo] = useState(false);
  const [isUploadingDocuments, setIsUploadingDocuments] = useState(false);

  const handleToggle2FA = () => {
    setIs2FAEnabled(!is2FAEnabled);
  };

  const toggleSetting = (setting, setter) => {
    setter(!setting);
  };

  const sections = [
    {
      id: "account",
      title: "Account",
      icon: "fas fa-user-circle",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      id: "business", 
      title: "Business",
      icon: "fas fa-building",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      id: "notifications",
      title: "Notifications",
      icon: "fas fa-bell",
      color: "text-purple-600", 
      bgColor: "bg-purple-50"
    },
    {
      id: "privacy",
      title: "Privacy & Security",
      icon: "fas fa-shield-alt",
      color: "text-red-600",
      bgColor: "bg-red-50"
    }
  ];

  const ToggleSwitch = ({ enabled, onChange, color = "orange" }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={enabled}
        onChange={onChange}
        className="sr-only peer"
      />
      <div className={`w-12 h-6 bg-gray-300 peer-checked:bg-${color}-500 rounded-full transition-colors duration-300 relative`}>
        <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${enabled ? 'translate-x-6' : ''} shadow-md`}></div>
      </div>
    </label>
  );

  const renderAccountSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-user text-white"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Personal Information</h2>
            <p className="text-gray-600 text-sm">Manage your account details and preferences</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-key text-blue-600"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Change Password</h3>
                <p className="text-sm text-gray-600">Update your account password for better security</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-sm hover:shadow-md">
              Change
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-envelope text-green-600"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Update Email & Phone</h3>
                <p className="text-sm text-gray-600">Manage your contact information</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md">
              Update
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-mobile-alt text-orange-600"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Two-Factor Authentication</h3>
                <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${
                  is2FAEnabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {is2FAEnabled ? '✓ Enabled' : '✗ Disabled'}
                </span>
              </div>
            </div>
            <ToggleSwitch enabled={is2FAEnabled} onChange={handleToggle2FA} />
          </div>

          <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-trash text-red-600"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Delete Account</h3>
                <p className="text-sm text-gray-600">Permanently delete your account and all data</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm hover:shadow-md">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-building text-white"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Business Information</h2>
            <p className="text-gray-600 text-sm">Manage your business details and verification</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-info-circle text-blue-600"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Company Details</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Update your company information and branding</p>
            <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
              Edit Details
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-credit-card text-green-600"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Payment Methods</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Manage how you receive payments</p>
            <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Manage
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-file-invoice text-yellow-600"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Tax Information</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Update tax forms and compliance details</p>
            <button className="w-full py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium">
              Update
            </button>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-certificate text-purple-600"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Verification</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Upload business documents for verification</p>
            <button className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-bell text-white"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Notification Preferences</h2>
            <p className="text-gray-600 text-sm">Control how and when you receive notifications</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-envelope text-blue-600"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive important updates via email</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={emailNotifications} 
              onChange={() => toggleSetting(emailNotifications, setEmailNotifications)}
              color="blue"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-sms text-green-600"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">SMS Notifications</h3>
                <p className="text-sm text-gray-600">Get urgent alerts via text message</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={smsNotifications} 
              onChange={() => toggleSetting(smsNotifications, setSmsNotifications)}
              color="green"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-bullhorn text-orange-600"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Marketing Emails</h3>
                <p className="text-sm text-gray-600">Receive promotional content and tips</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={marketingEmails} 
              onChange={() => toggleSetting(marketingEmails, setMarketingEmails)}
              color="orange"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <i className="fas fa-shield-alt text-white"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Privacy & Security</h2>
            <p className="text-gray-600 text-sm">Manage your privacy settings and data preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-red-50 rounded-xl border border-red-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-eye text-red-600"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Profile Visibility</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Control who can see your business profile and information</p>
            <select className="w-full p-3 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500">
              <option>Public - Anyone can view</option>
              <option>Customers only</option>
              <option>Private</option>
            </select>
          </div>

          <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-database text-yellow-600"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Data Usage</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Manage how your data is used for analytics and improvements</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500" defaultChecked />
                <span className="text-sm text-gray-700">Allow analytics data collection</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" className="rounded border-yellow-300 text-yellow-600 focus:ring-yellow-500" />
                <span className="text-sm text-gray-700">Share data with partners for improvements</span>
              </label>
            </div>
          </div>

          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-download text-green-600"></i>
              </div>
              <h3 className="font-semibold text-gray-900">Data Export</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Download a copy of all your data</p>
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium">
              Request Export
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch(activeSection) {
      case "account": return renderAccountSettings();
      case "business": return renderBusinessSettings();
      case "notifications": return renderNotificationSettings();
      case "privacy": return renderPrivacySettings();
      default: return renderAccountSettings();
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
     

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl transition-all duration-200 ${
                    activeSection === section.id
                      ? `${section.bgColor} ${section.color} shadow-md`
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <i className={`${section.icon} text-lg`}></i>
                  <span className="font-semibold">{section.title}</span>
                </button>
              ))}
            </div>

            {/* Quick Support */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                    <i className="fas fa-life-ring text-white text-sm"></i>
                  </div>
                  <h3 className="font-semibold text-gray-900">Need Help?</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">Get support from our team</p>
                <button
                  onClick={() => window.location.href = "http://localhost:5173/vendor/support"}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-colors font-medium"
                >
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VendorSettings;