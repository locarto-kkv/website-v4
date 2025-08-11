import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorDashboard = () => {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Function to handle navigation for new buttons
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Enhanced Sidebar */}
      <div className="w-64 bg-gradient-to-b from-primary to-orange-700 text-white shadow-xl">
        <div className="p-5 border-b border-orange-600/30">
        <h2 className="text-xl font-bold flex items-center text-black">
            <i className="fas fa-store mr-3"></i>
            <span>Vendor Panel</span>
          </h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleNavigation('/vendor/setup')}
                className="bg-orange-600 w-full flex items-center p-3 rounded-lg hover:bg-orange-600/30 transition-all duration-200 group"
              >
                <i className="fas fa-cog mr-3 text-orange-200 group-hover:text-white"></i>
                <span className="font-medium">Setup</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/vendor/analytics')}
                className="bg-orange-600 w-full flex items-center p-3 rounded-lg hover:bg-orange-600/30 transition-all duration-200 group"
              >
                <i className="fas fa-chart-line mr-3 text-orange-200 group-hover:text-white"></i>
                <span className="font-medium">Analytics</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/vendor/settings')}
                className="bg-orange-600 w-full flex items-center p-3 rounded-lg hover:bg-orange-600/30 transition-all duration-200 group"
              >
                <i className="fas fa-sliders-h mr-3 text-orange-200 group-hover:text-white"></i>
                <span className="font-medium">Settings</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/vendor/profile')}
                className="bg-orange-600 w-full flex items-center p-3 rounded-lg hover:bg-orange-600/30 transition-all duration-200 group"
              >
                <i className="fas fa-user-circle mr-3 text-orange-200 group-hover:text-white"></i>
                <span className="font-medium">Profile</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        {/* Navigation */}
        <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="text-2xl font-bold text-primary">Locarto</div>
            <span className="ml-4 bg-orange-100 text-primary text-sm font-medium px-3 py-1 rounded-full">Vendor Dashboard</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
                <i className="fas fa-bell mr-2"></i> Notifications
              </button>
              <span className="notification-badge">3</span>
            </div>
            <button 
              onClick={() => setShowAddProduct(!showAddProduct)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              <i className="fas fa-plus mr-2"></i> Add Product
            </button>
            <button 
              onClick={handleLogout}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
            >
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </div>
        </nav>
        <div className="max-w-6xl mx-auto py-8 px-6">
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-secondary">Recent Orders</h2>
                  <a href="#" className="text-primary hover:underline">View All</a>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 text-gray-600 font-medium">Order ID</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Product</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Customer</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Status</th>
                        <th className="text-left py-3 text-gray-600 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-4">#ORD-7841</td>
                        <td className="py-4">Wireless Headphones</td>
                        <td className="py-4">John Smith</td>
                        <td className="py-4"><span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Delivered</span></td>
                        <td className="py-4">$89.99</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-4">#ORD-7839</td>
                        <td className="py-4">Smart Watch</td>
                        <td className="py-4">Emma Johnson</td>
                        <td className="py-4"><span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Shipped</span></td>
                        <td className="py-4">$149.99</td>
                      </tr>
                      <tr className="border-b hover:bg-gray-50">
                        <td className="py-4">#ORD-7835</td>
                        <td className="py-4">Bluetooth Speaker</td>
                        <td className="py-4">Michael Brown</td>
                        <td className="py-4"><span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Processing</span></td>
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
                  <h2 className="text-xl font-bold text-secondary mb-6">Add New Product</h2>
                  <form className="space-y-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Product Name</label>
                      <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="Enter product name" />
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Category</label>
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
                        <label className="block text-gray-700 mb-2">Price ($)</label>
                        <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="0.00" />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Quantity</label>
                        <input type="number" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" placeholder="0" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-700 mb-2">Product Images</label>
                      <div className="flex items-center justify-center w-full">
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <i className="fas fa-cloud-upload-alt text-3xl text-gray-400 mb-2"></i>
                            <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-gray-500">JPG, PNG (MAX. 5MB)</p>
                          </div>
                          <input type="file" className="hidden" multiple />
                        </label>
                      </div>
                    </div>
                    <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">Add Product</button>
                  </form>
                </div>
              )}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-secondary mb-6">Top Selling Products</h2>
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
      </div>
    </div>
  );
};

export default VendorDashboard;