// src/pages/vendor/dashboard/VendorProfile.jsx
import React, { useState, useEffect, useRef } from "react"; // Make sure to import useRef
import { Link, useNavigate } from "react-router-dom";
import { useVendorDataStore } from "../../../store/vendor/vendorDataStore";
import { useDataStore } from "../../../store/useDataStore";
import { formatCurrency } from "../../../lib/utils"; // Import formatCurrency
import { VendorProfileService } from "../../../services/vendor/vendorProfileService"; // Import service
import toast from "react-hot-toast"; // Import toast

const VendorProfile = () => {
  const brands = useDataStore((s) => s.brands);
  const vendor = useVendorDataStore((s) => s.vendor);
  const profile = useVendorDataStore((s) => s.profile);
  const dataLoading = useVendorDataStore((s) => s.dataLoading);
  const navigate = useNavigate();

  const [profileData, setProfileData] = useState(null);
  const [metrics, setMetrics] = useState({});
  const [documents, setDocuments] = useState([]);

  // --- NEW: State for file management ---
  const fileInputRef = useRef(null);
  const [newFiles, setNewFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  // --- END NEW STATE ---

  useEffect(() => {
    if (vendor && profile && brands) {
      // Ensure brands is also loaded
      // Find the brand entry associated with the vendor profile
      // Using String comparison for robustness in case IDs are numbers in one place and strings elsewhere
      const vendorBrand = brands.find(
        (b) => String(b.id) === String(profile.id)
      ); // Assuming profile ID matches brand/vendor ID

      // Ensure rating is treated as a number
      const brandRating = vendorBrand?.blog?.[0]?.rating;
      const profileRating = profile?.average_rating;
      const averageRatingValue = Number(brandRating ?? profileRating ?? 0); // Convert potential rating to number, default to 0

      setProfileData({
        companyName: profile?.name || "N/A", // Use profile name first
        email: profile?.email || "N/A",
        phone: profile?.primary_contact?.phone_no || profile?.phone_no || "N/A", // Check extra data
        address: profile?.address?.[profile.address.length - 1] || {}, // Prefer 'Main' address, fallback to first
        brandLogo: profile?.brand_logo_1 || "",
        established: profile?.created_at
          ? new Date(profile.created_at).getFullYear()
          : "N/A",
        // Get description from the matched brand entry
        description:
          vendorBrand?.blog?.[0]?.description || "No description available.",
      });

      setMetrics({
        // Use data primarily from vendor context if available, fallback to profile/brand
        totalOrders: vendor?.orders_count ?? profile?.orders_count ?? 0,
        totalRevenue: vendor?.total_amount ?? profile?.total_amount ?? 0,
        averageRating: averageRatingValue, // Use the calculated numeric rating
        categoryCount: vendor?.category_count || {}, // Assuming this comes from vendor context
        productsCount: vendor?.products_count ?? profile?.products_count ?? 0,
      });

      // Ensure profile.documents is treated as an array
      setDocuments(Array.isArray(profile?.documents) ? profile.documents : []);
    }
  }, [vendor, profile, brands]); // Added brands dependency

  const openSetup = () => navigate("/vendor/dashboard/setup");
  const openEditProfile = () => navigate("/vendor/dashboard/profile/edit");
  const goToSettings = () => navigate("/vendor/dashboard/settings");
  const goToSupport = () => navigate("/vendor/dashboard/support");

  // --- *** MODIFIED: File handling functions *** ---
  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // This is the correct way to update state based on a previous state
      // to ensure React sees the change.
      setNewFiles((prevFiles) => {
        const newFileArray = Array.from(files);
        return [...prevFiles, ...newFileArray];
      });
    }

    // --- BUG FIX: This line was removed. ---
    // e.target.value = null;
    // --- END BUG FIX ---
  };

  const handleRemoveNewFile = (indexToRemove) => {
    setNewFiles((prevFiles) =>
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
    // After removing, we *can* clear the input to allow re-selection
    if (fileInputRef.current) {
      fileInputRef.current.value = null;
    }
  };

  const handleSaveDocuments = async () => {
    if (newFiles.length === 0) {
      toast.error("No new documents to save.");
      return;
    }

    setIsSaving(true);
    toast.loading("Uploading documents...");

    // Construct a payload similar to EditProfile, but only with documents
    // This ensures other profile data isn't accidentally wiped out
    const existingAddress =
      profile?.address?.find((addr) => addr.label === "Main") ||
      profile?.address?.[0] ||
      {};

    const cleanAddress = {
      label: existingAddress.label || "Main",
      address_line_1: existingAddress.address_line_1,
      address_line_2: existingAddress.address_line_2,
      city: existingAddress.city,
      state: existingAddress.state,
      pincode: existingAddress.pincode,
      country: existingAddress.country,
      coordinates: existingAddress.coordinates,
    };

    const payload = {
      profile: {
        name: profile.name,
      },
      address: cleanAddress,
      extra: {
        primary_contact: {
          phone_no: profile.primary_contact?.phone_no || profile.phone_no,
          email: profile.email,
        },
      },
      brand_logo_1: null, // Not updating logos here
      brand_logo_2: null,
      documents: newFiles, // Send only the new files
    };

    try {
      const newProfile = await VendorProfileService.updateProfile(payload);

      toast.dismiss();
      toast.success("Documents uploaded successfully!");
      setNewFiles([]); // Clear the new files list
    } catch (error) {
      console.error("Error uploading documents:", error);
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "Failed to upload documents."
      );
    } finally {
      setIsSaving(false);
    }
  };
  // --- END NEW Functions ---

  // Unified document status handler
  const getDocumentStatus = (status) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
      case "pending":
        return {
          label: "Setup Incomplete",
          color: "bg-yellow-50 border-yellow-200 text-yellow-800",
          icon: "fas fa-clock text-yellow-600",
          desc: "Please complete your setup to access all facilities.",
        };
      case "complete": // Assuming 'complete' means submitted but not verified
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

  // Safer address display
  const displayAddress = profileData?.address
    ? [
        profileData.address.address_line_1,
        profileData.address.address_line_2,
        profileData.address.city,
        profileData.address.state,
        profileData.address.pincode,
      ]
        .filter(Boolean) // Remove empty parts
        .join(", ") // Join with comma and space
    : "N/A";

  // Loading State
  if (dataLoading || !profileData) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );
  }

  return (
    // Main container uses responsive gaps
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 sm:gap-6">
        {/* Main Profile Information (Takes more columns on large screens) */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Profile Header - Responsive adjustments */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 sm:p-6 md:p-8 text-white relative overflow-hidden">
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div>
              </div>
              {/* Flex container for logo and details - stack on mobile */}
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                {/* Logo */}
                {profileData.brandLogo ? (
                  <img
                    src={profileData.brandLogo}
                    alt="Brand Logo"
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl object-cover border-2 sm:border-4 border-white/30 shadow-lg sm:shadow-2xl flex-shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 sm:border-4 border-white/30 backdrop-blur-sm shadow-lg sm:shadow-2xl flex-shrink-0">
                    <i className="fas fa-building text-3xl sm:text-4xl text-white"></i>
                  </div>
                )}
                {/* Details */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg">
                    {profileData.companyName}
                  </h2>
                  {/* Contact Info - wrap items */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-2 text-white/90 text-xs sm:text-sm">
                    <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-sm whitespace-nowrap">
                      <i className="fas fa-envelope text-xs"></i>
                      <span className="font-medium">{profileData.email}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-sm whitespace-nowrap">
                      <i className="fas fa-phone text-xs"></i>
                      <span className="font-medium">{profileData.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-sm whitespace-nowrap">
                      <i className="fas fa-calendar-alt text-xs"></i>
                      <span className="font-medium">
                        Est. {profileData.established}
                      </span>
                    </div>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center justify-center sm:justify-start gap-1 mt-3 sm:mt-4">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-sm sm:text-base ${
                            i < Math.floor(metrics.averageRating)
                              ? "text-yellow-300"
                              : "text-white/30"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="ml-1 font-bold text-base sm:text-lg bg-white/20 px-2 py-0.5 rounded-lg backdrop-blur-sm">
                      {Number(metrics.averageRating || 0).toFixed(1)}
                    </span>
                  </div>
                </div>
                {/* Edit Button */}
                {profile?.status === "verified" && (
                  <div className="absolute top-2 right-2 sm:relative sm:top-auto sm:right-auto sm:self-start">
                    <button
                      onClick={openEditProfile}
                      className="flex items-center gap-1 bg-white/40 hover:bg-white/60 backdrop-blur-sm border border-white/50 text-black py-1.5 px-3 sm:py-2 sm:px-4 rounded-lg font-semibold transition-all hover:shadow-md text-xs sm:text-sm"
                    >
                      <i className="fas fa-edit text-xs"></i>
                      <span className="hidden sm:inline">Edit Profile</span>
                      <span className="sm:hidden">Edit</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Content - Responsive padding */}
            <div className="p-4 sm:p-6 md:p-8">
              {/* Business Details & Overview - Stack on mobile, responsive gaps */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                {/* Business Information */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-info-circle text-blue-600 text-sm"></i>
                    </div>
                    Business Information
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                        Products Listed
                      </p>
                      <p className="font-bold text-gray-900 text-base sm:text-lg">
                        {metrics.productsCount || 0}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                        Primary Address
                      </p>
                      <p className="font-semibold text-gray-900 text-xs sm:text-sm leading-relaxed">
                        {displayAddress}
                      </p>
                    </div>
                  </div>
                </div>
                {/* Business Overview */}
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-chart-line text-green-600 text-sm"></i>
                    </div>
                    Business Overview
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                        Description
                      </p>
                      <p className="font-medium text-gray-900 leading-relaxed line-clamp-3 text-xs sm:text-sm">
                        {profileData.description}
                      </p>
                    </div>
                    <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">
                        Categories
                      </p>
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mt-1 sm:mt-2">
                        {Object.keys(metrics.categoryCount || {}).length > 0 ? (
                          Object.keys(metrics.categoryCount).map(
                            (category, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-gray-700 border border-gray-200 whitespace-nowrap"
                              >
                                {category}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-500">
                            No categories
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* --- MODIFIED: Documents Section --- */}
              <div className="border-t pt-4 sm:pt-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg">
                    <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-folder text-amber-600 text-sm"></i>
                    </div>
                    Business Documents
                  </h3>
                  {/* Hidden file input */}
                  <input
                    type="file"
                    multiple
                    hidden
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/png, image/jpeg, application/pdf" // Example
                  />
                  <button
                    type="button" // Set type to button
                    onClick={() => fileInputRef.current.click()} // Click hidden input
                    className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm w-full sm:w-auto"
                  >
                    <i className="fas fa-upload text-xs"></i>
                    <span>Upload / Manage</span>
                  </button>
                </div>

                {/* --- SIMPLIFIED DOCUMENT LIST LOGIC --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  {/* Empty State */}
                  {documents.length === 0 && newFiles.length === 0 && (
                    <div className="md:col-span-2 text-center py-8 sm:py-10 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                        <i className="fas fa-folder-open text-gray-400 text-xl sm:text-2xl"></i>
                      </div>
                      <p className="text-gray-500 font-medium text-sm sm:text-base">
                        No documents uploaded yet.
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1">
                        Click "Upload / Manage" to add documents.
                      </p>
                    </div>
                  )}

                  {/* Existing Documents */}
                  {documents.map((doc, index) => {
                    const statusInfo = getDocumentStatus(doc.status);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm border border-gray-200 flex-shrink-0">
                            <i className="fas fa-file-alt text-gray-500 text-base sm:text-lg"></i>
                          </div>
                          <div className="overflow-hidden">
                            <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                              {doc.name || `Document ${index + 1}`}
                            </p>
                            <p className="text-xs text-gray-500">
                              {doc.type || "File"}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 py-1 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap flex-shrink-0 ${statusInfo.color}`}
                        >
                          <i
                            className={`${statusInfo.icon} text-[10px] sm:text-xs`}
                          ></i>
                          {statusInfo.label}
                        </span>
                      </div>
                    );
                  })}

                  {/* New Files to be Uploaded */}
                  {newFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-xl border-2 border-dashed border-blue-200"
                    >
                      <div className="flex items-center gap-2 sm:gap-3 overflow-hidden">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm border border-gray-200 flex-shrink-0">
                          <i className="fas fa-file-upload text-blue-500 text-base sm:text-lg"></i>
                        </div>
                        <div className="overflow-hidden">
                          <p className="font-bold text-gray-900 text-xs sm:text-sm truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {(file.size / 1024).toFixed(1)} KB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewFile(index)}
                        className="text-red-500 hover:text-red-700 flex-shrink-0 ml-2"
                        aria-label="Remove new file"
                      >
                        <i className="fas fa-times-circle"></i>
                      </button>
                    </div>
                  ))}
                </div>
                {/* --- END SIMPLIFIED DOCUMENT LIST --- */}
              </div>

              {/* --- NEW SAVE BUTTON --- */}
              {newFiles.length > 0 && (
                <div className="flex justify-end pt-6">
                  <button
                    type="button"
                    onClick={handleSaveDocuments}
                    disabled={isSaving}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-70"
                  >
                    {isSaving ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>Saving...
                      </>
                    ) : (
                      "Save Documents"
                    )}
                  </button>
                </div>
              )}
              {/* --- END NEW SAVE BUTTON --- */}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Account Status Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-id-badge text-orange-600 text-sm sm:text-base"></i>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">
                Account Status
              </h2>
            </div>
            <div
              className={`p-3 sm:p-4 border-2 rounded-xl flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-2 ${accountStatus.color} transition-all`}
            >
              <span className="font-bold text-sm sm:text-base">
                {accountStatus.label}
              </span>
              <i className={`${accountStatus.icon} text-lg sm:text-xl`}></i>
            </div>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
              {accountStatus.desc}
            </p>
            {accountStatus.label === "Account Verified" && (
              <button
                onClick={() => navigate("/vendor/dashboard/members-hub")}
                className="w-full mt-4 sm:mt-5 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm"
              >
                <i className="fas fa-users mr-1.5 text-xs"></i>
                Visit Member's Hub
              </button>
            )}
            {accountStatus.label === "Setup Incomplete" && (
              <button
                onClick={openSetup}
                className="w-full mt-4 sm:mt-5 px-4 py-2 sm:px-5 sm:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm"
              >
                <i className="fas fa-cog mr-1.5 text-xs"></i>
                Complete Setup Now
              </button>
            )}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 text-base sm:text-lg">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fas fa-chart-bar text-blue-600 text-sm sm:text-base"></i>
              </div>
              Quick Stats
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Total Orders
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {metrics.totalOrders}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                <p className="text-xs sm:text-sm text-gray-600 font-medium">
                  Total Revenue
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900">
                  {formatCurrency(metrics.totalRevenue || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 sm:space-y-3">
            <button
              onClick={goToSettings}
              className="w-full group flex items-center justify-center gap-1.5 sm:gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-200 hover:border-orange-300 font-medium text-xs sm:text-sm"
            >
              <i className="fas fa-cog text-gray-500 group-hover:text-orange-500 transition-colors group-hover:rotate-90 duration-300 text-sm sm:text-base"></i>
              <span>Settings</span>
            </button>
            <button
              onClick={goToSupport}
              className="w-full group flex items-center justify-center gap-1.5 sm:gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-200 hover:border-orange-300 font-medium text-xs sm:text-sm"
            >
              <i className="fas fa-headset text-gray-500 group-hover:text-orange-500 transition-colors text-sm sm:text-base"></i>
              <span>Support</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;
