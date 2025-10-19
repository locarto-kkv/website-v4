import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVendorData } from "../../../context/vendor/vendorDataContext";
import { useData } from "../../../context/dataContext";

const VendorProfile = () => {
  const { blogs } = useData();
  const { vendor, profile } = useVendorData();
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({});
  const [metrics, setMetrics] = useState({});
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    if (vendor && profile) {
      // Build profile info dynamically from vendor + profile
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

      // Setup metrics from vendor data
      setMetrics({
        totalOrders: vendor?.orders_count || 0,
        totalRevenue: vendor?.total_amount || 0,
        averageRating:
          blogs?.find((b) => b.id === profile.blog_id)?.blog?.rating || 0,
        categoryCount: vendor?.category_count || {},
      });

      // Documents
      setDocuments(
        profile?.documents && Array.isArray(profile.documents)
          ? profile.documents
          : []
      );
    }
  }, [vendor, profile, blogs]);

  const openSetup = () => navigate("/vendor/setup");

  const getDocumentStatusColor = (status) => {
    switch (status) {
      case "verified":
        return {
          color: "bg-green-100 text-green-800",
          icon: "fas fa-check-circle",
        };
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDocumentIcon = (status) => {
    switch (status) {
      case "verified":
        return "fas fa-check-circle";
      case "pending":
        return "fas fa-clock";
      case "rejected":
        return "fas fa-times-circle";
      default:
        return "fas fa-file";
    }
  };

  const getAccountStatus = (status) => {};

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        {profileData.brandLogo ? (
          <img
            src={profileData.brandLogo}
            alt="Brand Logo"
            className="w-12 h-12 rounded-xl object-cover shadow-sm"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
            <i className="fas fa-user-tie text-white text-xl"></i>
          </div>
        )}
        <div>
          <h1 className="text-3xl font-black text-gray-900">Vendor Profile</h1>
          <p className="text-gray-600">
            Manage your business profile and documentation
          </p>
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
                {profileData.brandLogo ? (
                  <img
                    src={profileData.brandLogo}
                    alt="Brand Logo"
                    className="w-24 h-24 rounded-2xl object-cover border border-white/30 shadow-sm"
                  />
                ) : (
                  <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30">
                    <i className="fas fa-building text-3xl text-white"></i>
                  </div>
                )}

                <div className="flex-1">
                  <h2 className="text-3xl font-bold mb-2">
                    {profileData.companyName}
                  </h2>
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
                      <i
                        key={i}
                        className={`fas fa-star text-sm ${
                          i < Math.floor(metrics.averageRating)
                            ? "text-yellow-300"
                            : "text-white/30"
                        }`}
                      ></i>
                    ))}
                    <span className="ml-2 font-bold">
                      {metrics.averageRating}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="p-6">
              {/* Business Details */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-info-circle text-blue-600"></i>
                    Business Information
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Products</p>
                      <p className="font-medium text-gray-900">
                        {vendor?.products_count || 0} total
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium text-gray-900">
                        {profileData.address}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <i className="fas fa-link text-green-600"></i>
                    Overview
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Description</p>
                      <p className="font-medium text-gray-900">
                        {profileData.description}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Categories</p>
                      <p className="font-medium text-gray-900">
                        {Object.keys(vendor?.category_count || {}).join(", ") ||
                          "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <button
                  onClick={openSetup}
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <i className="fas fa-cog mr-2"></i> Complete Setup
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  <i className="fas fa-edit mr-2"></i> Edit Profile
                </button>
                <button className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors">
                  <i className="fas fa-download mr-2"></i> Export Data
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

                {documents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                        onClick={() => handleDownloadDocument(doc.url)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                            <i className="fas fa-file-pdf text-red-500 text-xl"></i>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {doc.name}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getDocumentStatusColor(
                            doc.status
                          )}`}
                        >
                          <i
                            className={`${getDocumentIcon(doc.status)} mr-1`}
                          ></i>
                          {doc.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    No documents uploaded yet.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-check-circle text-green-600"></i>
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Account Status
              </h2>
            </div>
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex justify-between items-center">
              <span className="font-medium text-green-800">Active Vendor</span>
              <i className="fas fa-check text-green-600"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
