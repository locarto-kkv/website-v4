import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DashboardNavbar from "../../components/DashboardNavbar";
import { VendorOrderService } from "../../services/vendor/vendorOrderService";

const VendorDashboard = () => {
  const location = useLocation();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showVendorSetup, setShowVendorSetup] = useState(
    location.state?.fromSignup || false
  );

  // State for the confirmation popup
  const [showConfirmationPopup, setShowConfirmationPopup] = useState(false);

  const navigate = useNavigate();

  const { getOrders } = VendorOrderService;
  useEffect(() => {
    async function fetchData() {
      const res = await getOrders();
      // console.log("Vendor Dashboard: getOrders: ", res.data);
    }

    fetchData();
  });

  const handleNavigation = (path) => {
    setShowVendorSetup(false);
    navigate(path);
  };

  const handleSetupClick = () => {
    setShowVendorSetup(!showVendorSetup);
    if (!showVendorSetup) {
      setShowAddProduct(false);
    }
  };

  // Handler for the "Next Step" button
  const handleNextStep = () => {
    // Here you would typically submit the form data
    // For now, we just show the confirmation popup
    setShowConfirmationPopup(true);
  };

  // Handler to close the confirmation popup
  const closeConfirmationPopup = () => {
    setShowConfirmationPopup(false);
    // Optionally, you might want to close the setup wizard here as well
    // setShowVendorSetup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <DashboardNavbar
        onAddProductClick={() => setShowAddProduct(!showAddProduct)}
        showAddProduct={showAddProduct}
      />

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Sidebar - hugging the left border */}
        <div className="w-64 bg-white shadow-md p-4 h-screen sticky top-0">
          <ul className="space-y-3 pt-4">
            <li>
              <button
                onClick={handleSetupClick}
                className={`w-full text-left py-3 px-4 rounded-lg transition font-medium ${
                  showVendorSetup
                    ? "bg-primary text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                Setup
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/vendor/analytics")}
                className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition font-medium"
              >
                Analytics
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/vendor/settings")}
                className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition font-medium"
              >
                Settings
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation("/vendor/profile")}
                className="w-full text-left bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-lg transition font-medium"
              >
                Profile
              </button>
            </li>
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Conditional rendering for Vendor Setup Wizard */}
          {showVendorSetup ? (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-secondary">
                  Vendor Setup Wizard
                </h2>
                <button
                  onClick={() => setShowVendorSetup(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <i className="fas fa-times"></i> Close
                </button>
              </div>

              <div className="space-y-6">
                <div className="border-b pb-4">
                  <h3 className="text-lg font-semibold text-primary">
                    Step 1: Business Info
                  </h3>
                  <p className="text-gray-600">
                    Please provide your business details.
                  </p>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Legal Business Name *
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter legal business name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Doing Business As
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter DBA (if applicable)"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Business Type *
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Select Business Type</option>
                        <option value="sole-prop">Sole Proprietorship</option>
                        <option value="partnership">Partnership</option>
                        <option value="llc">LLC</option>
                        <option value="corp">Corporation</option>
                        <option value="non-profit">Non-Profit</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Tax ID (TIN/EIN) *
                      </label>
                      <input
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="Enter Tax ID"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Country *
                      </label>
                      <select
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      >
                        <option value="">Select Country</option>
                        <option value="us">United States</option>
                        <option value="ca">Canada</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="https://example.com  "
                      />
                    </div>
                  </div>

                  <div className="border-t pt-4 mt-6">
                    <h4 className="text-md font-semibold text-secondary mb-3">
                      Primary Contact
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1">
                        <label className="block text-gray-700 mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="Full Name"
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="contact@example.com"
                          required
                        />
                      </div>
                      <div className="md:col-span-1">
                        <label className="block text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                          placeholder="+1 (555) 123-4567"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowVendorSetup(false)}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleNextStep} // Use the new handler
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition"
                    >
                      Next Step
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-primary">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Total Products</p>
                      <h3 className="text-3xl font-bold mt-2">24</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-box text-primary text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-primary">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Total Orders</p>
                      <h3 className="text-3xl font-bold mt-2">18</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-shopping-cart text-primary text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-md dashboard-card border-l-4 border-primary">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600">Total Revenue</p>
                      <h3 className="text-3xl font-bold mt-2">$2,450</h3>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                      <i className="fas fa-dollar-sign text-primary text-xl"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orders and Right Column Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold text-secondary">
                        Recent Orders
                      </h2>
                      <a href="#" className="text-primary hover:underline">
                        View All
                      </a>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-3 text-gray-600 font-medium">
                              Order ID
                            </th>
                            <th className="text-left py-3 text-gray-600 font-medium">
                              Product
                            </th>
                            <th className="text-left py-3 text-gray-600 font-medium">
                              Customer
                            </th>
                            <th className="text-left py-3 text-gray-600 font-medium">
                              Status
                            </th>
                            <th className="text-left py-3 text-gray-600 font-medium">
                              Amount
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-4">#ORD-7841</td>
                            <td className="py-4">Wireless Headphones</td>
                            <td className="py-4">John Smith</td>
                            <td className="py-4">
                              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Delivered
                              </span>
                            </td>
                            <td className="py-4">$89.99</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-4">#ORD-7839</td>
                            <td className="py-4">Smart Watch</td>
                            <td className="py-4">Emma Johnson</td>
                            <td className="py-4">
                              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Shipped
                              </span>
                            </td>
                            <td className="py-4">$149.99</td>
                          </tr>
                          <tr className="border-b hover:bg-gray-50">
                            <td className="py-4">#ORD-7835</td>
                            <td className="py-4">Bluetooth Speaker</td>
                            <td className="py-4">Michael Brown</td>
                            <td className="py-4">
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                Processing
                              </span>
                            </td>
                            <td className="py-4">$59.99</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
                <div>
                  {showAddProduct && (
                    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
                      <h2 className="text-xl font-bold text-secondary mb-6">
                        Add New Product
                      </h2>
                      <form className="space-y-4">
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Product Name
                          </label>
                          <input
                            type="text"
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Enter product name"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Category
                          </label>
                          <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent">
                            <option value="">Select Category</option>
                            <option value="electronics">Electronics</option>
                            <option value="fashion">Fashion</option>
                            <option value="home">Home & Garden</option>
                            <option value="beauty">Health & Beauty</option>
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 mb-2">
                              Price (Rs)
                            </label>
                            <input
                              type="number"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="0.00"
                            />
                          </div>
                          <div>
                            <label className="block text-gray-700 mb-2">
                              Quantity
                            </label>
                            <input
                              type="number"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                              placeholder="0"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">
                            Product Images
                          </label>
                          <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                                <p className="mb-2 text-sm text-gray-500">
                                  <span className="font-semibold">
                                    Click to upload
                                  </span>{" "}
                                  or drag and drop
                                </p>
                                <p className="text-xs text-gray-500">
                                  JPG, PNG (MAX. 5MB)
                                </p>
                              </div>
                              <input type="file" className="hidden" multiple />
                            </label>
                          </div>
                        </div>
                        <button
                          type="submit"
                          className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition"
                        >
                          Add Product
                        </button>
                      </form>
                    </div>
                  )}
                  <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-xl font-bold text-secondary mb-6">
                      Top Selling Products
                    </h2>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                        <div>
                          <h3 className="font-medium">Wireless Headphones</h3>
                          <p className="text-gray-600 text-sm">120 sold</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                        <div>
                          <h3 className="font-medium">Smart Watch</h3>
                          <p className="text-gray-600 text-sm">98 sold</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mr-4"></div>
                        <div>
                          <h3 className="font-medium">Bluetooth Speaker</h3>
                          <p className="text-gray-600 text-sm">76 sold</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Popup Modal */}
      {showConfirmationPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <i className="fas fa-check text-green-600 text-xl"></i>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mt-4">
                Submitted for Review
              </h3>
              <p className="text-gray-600 mt-2">
                Thanks! Sit tight while we verify your details. You'll be
                notified once accepted.
              </p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={closeConfirmationPopup}
                  className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-orange-600 transition"
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDashboard;
