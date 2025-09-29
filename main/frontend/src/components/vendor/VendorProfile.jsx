import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const VendorProfile = () => {
  const [profileData, setProfileData] = useState({
    companyName: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    established: "",
    employeeCount: "",
    businessType: ""
  });

  const [documents, setDocuments] = useState([
    { name: "Business_License.pdf", size: "1.2MB", status: "verified", uploadDate: "2024-01-15" },
    { name: "Tax_ID_Verification.pdf", size: "800KB", status: "verified", uploadDate: "2024-01-15" },
    { name: "Insurance_Certificate.pdf", size: "500KB", status: "pending", uploadDate: "2024-02-10" },
    { name: "Bank_Statement.pdf", size: "1.5MB", status: "rejected", uploadDate: "2024-02-01" }
  ]);

  const [milestones] = useState([
    { title: "First Sale", date: "Jan 20, 2022", completed: true },
    { title: "100 Orders", date: "Mar 15, 2022", completed: true },
    { title: "5 Star Rating", date: "May 10, 2022", completed: true },
    { title: "500 Orders", date: "Target: Dec 2024", completed: false }
  ]);

  const [metrics] = useState({
    totalOrders: 250,
    completedOrders: 245,
    cancelledOrders: 5,
    totalRevenue: 125000,
    averageRating: 4.8,
    totalReviews: 128,
    responseTime: "2 hours"
  });

  const navigate = useNavigate();

  const openSetup = () => {
    navigate("/vendor/setup");
  };

  useEffect(() => {
    setProfileData({
      companyName: "Apex Innovations Inc.",
      email: "info@apexinnovations.com",
      phone: "+91 98765 43210",
      address: "123 Tech Park Avenue, Electronic City, Bangalore, Karnataka 560100",
      website: "https://www.apexinnovations.com",
      description: "Leading provider of innovative tech solutions and digital services for businesses worldwide.",
      established: "2018",
      employeeCount: "25-50",
      businessType: "Technology Services"
    });
  }, []);

  const handleDownloadDocument = (fileName) => {
    alert(`Downloading ${fileName}...`);
  };

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDocumentIcon = (status) => {
    switch (status) {
      case 'verified': return 'fas fa-check-circle';
      case 'pending': return 'fas fa-clock';
      case 'rejected': return 'fas fa-times-circle';
      default: return 'fas fa-file';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
          <i className="fas fa-user-tie text-white text-xl"></i>
        </div>
        <div>
          <h1 className="text-3xl font-black text-gray-900">Vendor Profile</h1>
          <p className="text-gray-600">Manage your business profile and documentation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Profile Information */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-start gap-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30">
                  <i className="fas fa-building text-3xl text-white"></i>
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">{profileData.companyName}</h2>
                  <div className="flex flex-wrap items-center gap-4 text-blue-100">
                    <div className="flex items-center gap-2">
                      <i className="fas fa-envelope"></i>
                      <span>{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-phone"></i>
                      <span>{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-calendar-alt"></i>
                      <span>Est. {profileData.established}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`fas fa-star text-sm ${i < Math.floor(metrics.averageRating) ? 'text-yellow-300' : 'text-white/30'}`}></i>
                    ))}
                    <span className="ml-2 font-bold">{metrics.averageRating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Business Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-chart-line text-white"></i>
                    </div>
                    <div>
                      <p className="text-green-800 font-bold text-2xl">{formatCurrency(metrics.totalRevenue)}</p>
                      <p className="text-green-600 text-sm">Total Revenue</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-shopping-cart text-white"></i>
                    </div>
                    <div>
                      <p className="text-blue-800 font-bold text-2xl">{metrics.totalOrders}</p>
                      <p className="text-blue-600 text-sm">Total Orders</p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl border border-purple-200">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                      <i className="fas fa-clock text-white"></i>
                    </div>
                    <div>
                      <p className="text-purple-800 font-bold text-2xl">{metrics.responseTime}</p>
                      <p className="text-purple-600 text-sm">Avg Response</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Business Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-600"></i>
                    Business Information
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Business Type</p>
                      <p className="font-medium text-gray-900">{profileData.businessType}</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Employee Count</p>
                      <p className="font-medium text-gray-900">{profileData.employeeCount} employees</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">{profileData.address}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-link text-green-600"></i>
                    Online Presence
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Website</p>
                      <a
                        href={profileData.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
                      >
                        {profileData.website}
                      </a>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium text-gray-900">{profileData.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={openSetup}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="fas fa-cog mr-2"></i>
                  Complete Setup
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  <i className="fas fa-edit mr-2"></i>
                  Edit Profile
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                  <i className="fas fa-download mr-2"></i>
                  Export Data
                </button>
              </div>

              {/* Documents Section */}
              <div className="border-t pt-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <i className="fas fa-folder text-amber-600"></i>
                    Business Documents
                  </h3>
                  <button className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium">
                    <i className="fas fa-upload mr-2"></i>
                    Upload Document
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {documents.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                      onClick={() => handleDownloadDocument(doc.name)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{doc.name}</p>
                          <p className="text-sm text-gray-500">{doc.size} • {doc.uploadDate}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getDocumentStatusColor(doc.status)}`}>
                          <i className={`${getDocumentIcon(doc.status)} mr-1`}></i>
                          {doc.status.charAt(0).toUpperCase() + doc.status.slice(1)}
                        </span>
                        <i className="fas fa-download text-gray-400 hover:text-blue-600 transition-colors"></i>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Account Status</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-check text-green-600"></i>
                  <span className="font-medium text-green-800">Verified Business</span>
                </div>
                <i className="fas fa-check text-green-600"></i>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <i className="fas fa-star text-blue-600"></i>
                  <span className="font-medium text-blue-800">Premium Member</span>
                </div>
                <i className="fas fa-crown text-blue-600"></i>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2">
                  <i className="fas fa-bolt text-purple-600"></i>
                  <span className="font-medium text-purple-800">Fast Responder</span>
                </div>
                <i className="fas fa-lightning-bolt text-purple-600"></i>
              </div>
            </div>
          </div>

          {/* Progress Milestones */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-trophy text-orange-600"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Milestones</h2>
            </div>

            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${milestone.completed ? 'bg-green-50 border border-green-200' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${milestone.completed ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
                    <i className={`fas ${milestone.completed ? 'fa-check' : 'fa-clock'} text-sm`}></i>
                  </div>
                  <div>
                    <p className={`font-medium ${milestone.completed ? 'text-green-800' : 'text-gray-700'}`}>
                      {milestone.title}
                    </p>
                    <p className="text-xs text-gray-500">{milestone.date}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Progress to Next Level</span>
                <span className="font-medium">75%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full transition-all duration-300" style={{ width: "75%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">125 more orders to reach Gold level</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-bolt text-blue-600"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-bar text-white text-sm"></i>
                </div>
                <span className="font-medium text-gray-800">View Analytics</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-plus text-white text-sm"></i>
                </div>
                <span className="font-medium text-gray-800">Add Product</span>
              </button>

              <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                  <i className="fas fa-headset text-white text-sm"></i>
                </div>
                <span className="font-medium text-gray-800">Contact Support</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;