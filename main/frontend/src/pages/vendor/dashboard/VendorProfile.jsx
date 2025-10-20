import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVendorData } from "../../../context/vendor/vendorDataContext";
import { useData } from "../../../context/dataContext";

const VendorProfile = () => {
  const { blogs } = useData();
  const { vendor, profile, dataLoading } = useVendorData();
  const navigate = useNavigate();
  console.log(profile);

  const [profileData, setProfileData] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (vendor && profile) {
      setProfileData({
        companyName: profile?.name || vendor?.vendor_name || "N/A",
        email: profile?.email || "N/A",
        phone: profile?.phone_no || "N/A",
        address: profile?.address || "N/A",
        brandLogo: profile?.brand_logo_1 || "",
        established: new Date(profile?.created_at).getFullYear(),
        description:
          blogs?.find((b) => b.id === profile.blog_id)?.blog?.description ||
          "No description available.",
      });

      setMetrics({
        totalOrders: vendor?.orders_count || 0,
        totalRevenue: vendor?.total_amount || 0,
        averageRating:
          blogs?.find((b) => b.id === profile.blog_id)?.blog?.rating || 0,
        categoryCount: vendor?.category_count || {},
      });

      setDocuments(Array.isArray(profile?.documents) ? profile.documents : []);
    }
  }, [vendor, profile, blogs]);

  const openSetup = () => navigate("/vendor/setup");
  const goToSettings = () => navigate('/vendor/settings');

  // Unified document status handler
  const getDocumentStatus = (status) => {
    switch (status) {
      case "verified":
        return {
          color: "bg-green-100 text-green-800",
          icon: "fas fa-check-circle text-green-600",
          label: "Verified",
        };
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: "fas fa-clock text-yellow-600",
          label: "Pending",
        };
      case "rejected":
        return {
          color: "bg-red-100 text-red-800",
          icon: "fas fa-times-circle text-red-600",
          label: "Rejected",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: "fas fa-file text-gray-500",
          label: "Unknown",
        };
    }
  };

  // Account status logic
  const getAccountStatus = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Setup Incomplete",
          color: "bg-yellow-50 border-yellow-200 text-yellow-800",
          icon: "fas fa-clock text-yellow-600",
          desc: "Please complete your setup to access all facilities.",
        };
      case "complete":
        return {
          label: "Waiting for Verification",
          color: "bg-orange-50 border-orange-200 text-orange-800",
          icon: "fas fa-hourglass-half text-orange-600",
          desc: "Please wait, our admins will contact you shortly to verify your identity.",
        };
      case "verified":
        return {
          label: "Account Verified",
          color: "bg-green-50 border-green-200 text-green-800",
          icon: "fas fa-check-circle text-green-600",
          desc: "Your account is verified! You can now access all facilities. Visit the Member's Hub to learn more.",
        };
      default:
        return {
          label: "Unknown Status",
          color: "bg-gray-50 border-gray-200 text-gray-700",
          icon: "fas fa-question-circle text-gray-500",
          desc: "Account status could not be determined.",
        };
    }
  };

  const accountStatus = getAccountStatus(profile?.status);

  if (!profileData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          {profileData.brandLogo ? (
            <img
              src={profileData.brandLogo}
              alt="Brand Logo"
              className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white"
            />
          ) : (
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <i className="fas fa-user-tie text-white text-2xl"></i>
            </div>
          )}
          <div>
            <h1 className="text-3xl font-black text-gray-900">Vendor Profile</h1>
            <p className="text-gray-600">
              Manage your business profile and documentation
            </p>
          </div>
        </div>

        {/* Settings Button in Header */}
        <button
          onClick={goToSettings}
          className="group relative flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-200 hover:border-orange-300 font-medium"
        >
          <i className="fas fa-cog text-gray-600 group-hover:text-orange-500 transition-colors group-hover:rotate-90 duration-300"></i>
          <span>Settings</span>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Profile Information */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24"></div>
              </div>

              <div className="relative flex items-start gap-6">
                {profileData.brandLogo ? (
                  <img
                    src={profileData.brandLogo}
                    alt="Brand Logo"
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-white/30 shadow-2xl"
                  />
                ) : (
                  <div className="w-28 h-28 bg-white/20 rounded-2xl flex items-center justify-center border-4 border-white/30 backdrop-blur-sm shadow-2xl">
                    <i className="fas fa-building text-4xl text-white"></i>
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="text-4xl font-bold mb-3 drop-shadow-lg">
                    {profileData.companyName}
                  </h2>
                  <div className="flex flex-wrap items-center gap-6 text-white/90">
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <i className="fas fa-envelope"></i>
                      <span className="font-medium">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <i className="fas fa-phone"></i>
                      <span className="font-medium">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                      <i className="fas fa-calendar-alt"></i>
                      <span className="font-medium">Est. {profileData.established}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-lg ${
                            i < Math.floor(metrics.averageRating)
                              ? "text-yellow-300"
                              : "text-white/30"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="ml-2 font-bold text-xl bg-white/20 px-3 py-1 rounded-lg backdrop-blur-sm">
                      {metrics.averageRating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-8">
              {/* Business Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-info-circle text-blue-600"></i>
                    </div>
                    Business Information
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-gray-600 font-medium mb-1">Products</p>
                      <p className="font-bold text-gray-900 text-xl">
                        {vendor?.products_count || 0} total
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-gray-600 font-medium mb-1">Address</p>
                      <p className="font-semibold text-gray-900">
                        {profileData.address[0]?.address_line_1}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <i className="fas fa-chart-line text-green-600"></i>
                    </div>
                    Business Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-sm text-gray-600 font-medium mb-1">Description</p>
                      <p className="font-medium text-gray-900 leading-relaxed">
                        {profileData.description}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-sm text-gray-600 font-medium mb-1">Categories</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {Object.keys(vendor?.category_count || {}).map((category, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-white rounded-full text-sm font-semibold text-gray-700 border border-gray-200"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - only if NOT verified */}
              {accountStatus.label !== "Account Verified" && (
                <div className="flex flex-wrap gap-4 mb-8 pb-8 border-b border-gray-200">
                  <button
                    onClick={openSetup}
                    className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    <i className="fas fa-cog"></i>
                    <span>Complete Setup</span>
                  </button>
                  <button className="flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
                    <i className="fas fa-edit"></i>
                    <span>Edit Profile</span>
                  </button>
                </div>
              )}

              {/* Documents section - only if verified */}
              {accountStatus.label === "Account Verified" && (
                <div className="border-t pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-lg">
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-folder text-amber-600"></i>
                      </div>
                      Business Documents
                    </h3>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105">
                      <i className="fas fa-upload"></i>
                      <span>Upload Document</span>
                    </button>
                  </div>

                  {documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {documents.map((doc, index) => {
                        const statusInfo = getDocumentStatus(doc.status);
                        return (
                          <div
                            key={index}
                            className="flex items-center justify-between p-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer border-2 border-gray-200 hover:border-orange-300 hover:shadow-md"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm border border-gray-200">
                                <i className="fas fa-file-pdf text-red-500 text-2xl"></i>
                              </div>
                              <div>
                                <p className="font-bold text-gray-900">
                                  {doc.name}
                                </p>
                                <p className="text-sm text-gray-500">PDF Document</p>
                              </div>
                            </div>
                            <span
                              className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 ${statusInfo.color}`}
                            >
                              <i className={`${statusInfo.icon} text-sm`}></i>
                              {statusInfo.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <i className="fas fa-folder-open text-gray-400 text-2xl"></i>
                      </div>
                      <p className="text-gray-500 font-medium">No documents uploaded yet.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Account Status */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-id-badge text-orange-600 text-lg"></i>
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                Account Status
              </h2>
            </div>

            <div
              className={`p-5 border-2 rounded-xl flex justify-between items-center ${accountStatus.color} transition-all`}
            >
              <span className="font-bold text-lg">{accountStatus.label}</span>
              <i className={`${accountStatus.icon} text-2xl`}></i>
            </div>

            <p className="mt-4 text-sm text-gray-700 leading-relaxed">
              {accountStatus.desc}
            </p>

            {accountStatus.label === "Account Verified" && (
              <button className="w-full mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl">
                <i className="fas fa-users mr-2"></i>
                Visit Member's Hub
              </button>
            )}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center">
                <i className="fas fa-chart-bar text-blue-600 text-lg"></i>
              </div>
              <span className="text-xl">Quick Stats</span>
            </h3>
            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-sm text-gray-600 font-medium">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{metrics.totalOrders}</p>
              </div>
              <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <p className="text-sm text-gray-600 font-medium">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">₹{metrics.totalRevenue}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;