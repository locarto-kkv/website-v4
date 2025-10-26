// src/pages/vendor/dashboard/VendorProfile.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useVendorData } from "../../../context/vendor/vendorDataContext";
import { useData } from "../../../context/dataContext";

const VendorProfile = () => {
  const { blogs } = useData(); //
  const { vendor, profile, dataLoading } = useVendorData(); //
  const navigate = useNavigate(); //

  const [profileData, setProfileData] = useState(null); //
  const [metrics, setMetrics] = useState({}); //
  const [documents, setDocuments] = useState([]); //

  useEffect(() => {
    if (vendor && profile) { //
      setProfileData({ //
        companyName: profile?.name || vendor?.vendor_name || "N/A", //
        email: profile?.email || "N/A", //
        phone: profile?.phone_no || "N/A", //
        address: profile?.address?.[profile.address.length - 1] || {}, //
        brandLogo: profile?.brand_logo_1 || "", //
        established: profile?.created_at //
          ? new Date(profile.created_at).getFullYear() //
          : "N/A", //
        description:
          blogs?.find((b) => b.id === profile.blog_id)?.blog?.description || //
          "No description available.", //
      });

      setMetrics({ //
        totalOrders: vendor?.orders_count || 0, //
        totalRevenue: vendor?.total_amount || 0, //
        averageRating:
          blogs?.find((b) => b.id === profile.blog_id)?.blog?.rating || 0, //
        categoryCount: vendor?.category_count || {}, //
        productsCount: vendor?.products_count || 0, //
      });

      // Ensure profile.documents is treated as an array
      setDocuments(Array.isArray(profile?.documents) ? profile.documents : []); //
    }
  }, [vendor, profile, blogs]); //

  const openSetup = () => navigate("/vendor/dashboard/setup"); //
  const openEditProfile = () => navigate("/vendor/dashboard/profile/edit"); // Add navigation function //
  const goToSettings = () => navigate("/vendor/dashboard/settings"); //
  const goToSupport = () => navigate("/vendor/dashboard/support"); //

  // Unified document status handler
  const getDocumentStatus = (status) => { //
    switch (
      status?.toLowerCase() // Added safety check and toLowerCase //
    ) {
      case "verified": //
        return { //
          color: "bg-green-100 text-green-800", //
          icon: "fas fa-check-circle text-green-600", //
          label: "Verified", //
        };
      case "pending": //
        return { //
          color: "bg-yellow-100 text-yellow-800", //
          icon: "fas fa-clock text-yellow-600", //
          label: "Pending", //
        };
      case "rejected": //
        return { //
          color: "bg-red-100 text-red-800", //
          icon: "fas fa-times-circle text-red-600", //
          label: "Rejected", //
        };
      default: //
        return { //
          color: "bg-gray-100 text-gray-800", //
          icon: "fas fa-file text-gray-500", //
          label: "Unknown", //
        };
    }
  };

  // Account status logic
  const getAccountStatus = (status) => { //
    switch (
      status?.toLowerCase() // Added safety check and toLowerCase //
    ) {
      case "pending": //
        return { //
          label: "Setup Incomplete", //
          color: "bg-yellow-50 border-yellow-200 text-yellow-800", //
          icon: "fas fa-clock text-yellow-600", //
          desc: "Please complete your setup to access all facilities.", //
        };
      case "complete": // Assuming 'complete' means submitted but not verified //
        return { //
          label: "Waiting for Verification", //
          color: "bg-orange-50 border-orange-200 text-orange-800", //
          icon: "fas fa-hourglass-half text-orange-600", //
          desc: "Please wait, our admins will contact you shortly to verify your identity.", //
        };
      case "verified": //
        return { //
          label: "Account Verified", //
          color: "bg-green-50 border-green-200 text-green-800", //
          icon: "fas fa-check-circle text-green-600", //
          desc: "Your account is verified! You can now access all facilities. Visit the Member's Hub to learn more.", //
        };
      default: //
        return { //
          label: "Unknown Status", //
          color: "bg-gray-50 border-gray-200 text-gray-700", //
          icon: "fas fa-question-circle text-gray-500", //
          desc: "Account status could not be determined.", //
        };
    }
  };

  const accountStatus = getAccountStatus(profile?.status); //

  // Safer address display - format address lines, city, state, pincode
  const displayAddress = profileData?.address //
    ? [ //
        profileData.address.address_line_1, //
        profileData.address.address_line_2, //
        profileData.address.city, //
        profileData.address.state, //
        profileData.address.pincode, //
      ]
        .filter(Boolean) // Remove empty parts //
        .join(", ") // Join with comma and space //
    : "N/A"; //

  if (dataLoading && !profileData) { //
    // Show loading only if profileData is not yet set
    return ( //
      // Consistent loading indicator
      <div className="flex items-center justify-center min-h-[calc(100vh-150px)]"> //
        {" "}
        {/* Centered loading */}
        <div className="text-center"> {/* */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div> {/* */}
          <p className="text-gray-600">Loading Profile...</p> {/* */}
        </div>
      </div>
    );
  }

  // Handle case where profile data might still be loading or null after fetch attempt
  if (!profileData) { //
    return ( //
      <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen text-center"> {/* */}
        <p className="text-gray-600"> {/* */}
          Could not load profile data. Please try again later. {/* */}
        </p>
        {/* Optionally add a refresh button */}
      </div>
    );
  }

  return ( //
    // Removed outer padding (p-6) - assuming layout provides it
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen"> {/* */}
      {/* Responsive Grid Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6"> {/* */}
        {/* Main Profile Information */}
        <div className="xl:col-span-3"> {/* */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden"> {/* */}
            {/* Profile Header - Responsive adjustments */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 sm:p-8 text-white relative overflow-hidden"> {/* */}
              {/* Decorative Background Elements */}
              <div className="absolute inset-0 opacity-10"> {/* */}
                <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-white rounded-full -mr-16 sm:-mr-32 -mt-16 sm:-mt-32"></div> {/* */}
                <div className="absolute bottom-0 left-0 w-24 h-24 sm:w-48 sm:h-48 bg-white rounded-full -ml-12 sm:-ml-24 -mb-12 sm:-mb-24"></div> {/* */}
              </div>

              {/* Flex container for logo and details - stack on mobile */}
              <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6"> {/* */}
                {/* Logo */}
                {profileData.brandLogo ? ( //
                  <img //
                    src={profileData.brandLogo} //
                    alt="Brand Logo" //
                    className="w-20 h-20 sm:w-28 sm:h-28 rounded-xl sm:rounded-2xl object-cover border-2 sm:border-4 border-white/30 shadow-lg sm:shadow-2xl flex-shrink-0" // Adjusted size, border, shadow //
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 sm:border-4 border-white/30 backdrop-blur-sm shadow-lg sm:shadow-2xl flex-shrink-0"> {/* */}
                    <i className="fas fa-building text-3xl sm:text-4xl text-white"></i> {/* */}
                  </div>
                )}

                {/* Details */}
                <div className="flex-1 text-center sm:text-left"> {/* */}
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 sm:mb-3 drop-shadow-lg"> {/* */}
                    {profileData.companyName} {/* */}
                  </h2>
                  {/* Contact Info - wrap items */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-white/90 text-xs sm:text-sm"> {/* */}
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-sm whitespace-nowrap"> {/* */}
                      <i className="fas fa-envelope"></i> {/* */}
                      <span className="font-medium">{profileData.email}</span> {/* */}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-sm whitespace-nowrap"> {/* */}
                      <i className="fas fa-phone"></i> {/* */}
                      <span className="font-medium">{profileData.phone}</span> {/* */}
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg backdrop-blur-sm whitespace-nowrap"> {/* */}
                      <i className="fas fa-calendar-alt"></i> {/* */}
                      <span className="font-medium"> {/* */}
                        Est. {profileData.established} {/* */}
                      </span>
                    </div>
                  </div>
                  {/* Rating */}
                  <div className="flex items-center justify-center sm:justify-start gap-2 mt-3 sm:mt-4"> {/* */}
                    <div className="flex items-center gap-0.5 sm:gap-1"> {/* */}
                      {[...Array(5)].map((_, i) => ( //
                        <i //
                          key={i} //
                          className={`fas fa-star text-base sm:text-lg ${ //
                            i < Math.floor(metrics.averageRating || 0) //
                              ? "text-yellow-300" //
                              : "text-white/30" //
                          }`}
                        ></i>
                      ))}
                    </div>
                    <span className="ml-1 sm:ml-2 font-bold text-lg sm:text-xl bg-white/20 px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg backdrop-blur-sm"> {/* */}
                      {(metrics.averageRating || 0).toFixed(1)} {/* */}
                    </span>
                  </div>
                </div>

                {/* Edit Button - Positioned top right on larger screens */}
                <div className="absolute top-0 right-0 mt-4 mr-4 sm:relative sm:mt-0 sm:mr-0"> {/* */}
                  <button //
                    onClick={openEditProfile} //
                    className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-2 px-4 rounded-lg font-semibold transition-all hover:shadow-md text-xs sm:text-sm" //
                  >
                    <i className="fas fa-edit"></i> {/* */}
                    Edit {/* */}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Content - Responsive padding */}
            <div className="p-6 sm:p-8"> {/* */}
              {/* Business Details & Overview - Stack on mobile */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"> {/* */}
                {/* Business Information */}
                <div> {/* */}
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg"> {/* */}
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0"> {/* */}
                      <i className="fas fa-info-circle text-blue-600"></i> {/* */}
                    </div>
                    Business Information {/* */}
                  </h3>
                  <div className="space-y-3"> {/* */}
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"> {/* */}
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1"> {/* */}
                        Products Listed {/* */}
                      </p>
                      <p className="font-bold text-gray-900 text-lg sm:text-xl"> {/* */}
                        {metrics.productsCount || 0} {/* */}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"> {/* */}
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1"> {/* */}
                        Primary Address {/* */}
                      </p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base"> {/* */}
                        {displayAddress} {/* */}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Business Overview */}
                <div> {/* */}
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg"> {/* */}
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0"> {/* */}
                      <i className="fas fa-chart-line text-green-600"></i> {/* */}
                    </div>
                    Business Overview {/* */}
                  </h3>
                  <div className="space-y-3"> {/* */}
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100"> {/* */}
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1"> {/* */}
                        Description {/* */}
                      </p>
                      <p className="font-medium text-gray-900 leading-relaxed line-clamp-3 text-sm sm:text-base"> {/* */}
                        {profileData.description} {/* */}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100"> {/* */}
                      <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1"> {/* */}
                        Categories {/* */}
                      </p>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2"> {/* */}
                        {Object.keys(metrics.categoryCount || {}).length > 0 ? ( //
                          Object.keys(metrics.categoryCount).map( //
                            (category, index) => ( //
                              <span //
                                key={index} //
                                className="px-2 py-0.5 sm:px-3 sm:py-1 bg-white rounded-full text-[10px] sm:text-xs font-semibold text-gray-700 border border-gray-200 whitespace-nowrap" //
                              >
                                {category} {/* */}
                              </span>
                            )
                          )
                        ) : (
                          <span className="text-xs sm:text-sm text-gray-500"> {/* */}
                            No categories {/* */}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Removed Edit/Setup buttons from here */} {/* */}

              {/* Documents Section - Responsive grid and adjustments */}
              {/* Only show if verified */}
              {(accountStatus.label === "Account Verified" || //
                documents.length > 0) && ( // Show even if not verified but documents exist //
                <div className="border-t pt-6 sm:pt-8"> {/* */}
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6"> {/* */}
                    <h3 className="font-bold text-gray-900 flex items-center gap-2 text-base sm:text-lg"> {/* */}
                      <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0"> {/* */}
                        <i className="fas fa-folder text-amber-600"></i> {/* */}
                      </div>
                      Business Documents {/* */}
                    </h3>
                    <button //
                      onClick={openSetup} // Link to setup page for uploading //
                      className="flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all font-bold shadow-lg hover:shadow-xl transform hover:scale-105 text-xs sm:text-sm w-full sm:w-auto" //
                    >
                      <i className="fas fa-upload"></i> {/* */}
                      <span>Upload / Manage</span> {/* */}
                    </button>
                  </div>

                  {/* Document List/Empty State */}
                  {documents.length > 0 ? ( //
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* */}
                      {documents.map((doc, index) => { //
                        const statusInfo = getDocumentStatus(doc.status); //
                        return ( //
                          <div //
                            key={index} //
                            className="flex items-center justify-between p-4 sm:p-5 bg-gray-50 rounded-xl border border-gray-200 hover:border-orange-300 hover:shadow-sm transition-all" //
                          >
                            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden"> {/* */}
                              {" "}
                              {/* Added overflow */}
                              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-lg sm:rounded-xl flex items-center justify-center shadow-sm border border-gray-200 flex-shrink-0"> {/* */}
                                {/* Use a generic file icon or determine based on type if available */}
                                <i className="fas fa-file-alt text-gray-500 text-lg sm:text-xl"></i> {/* */}
                              </div>
                              <div className="overflow-hidden"> {/* */}
                                {" "}
                                {/* Added overflow */}
                                <p className="font-bold text-gray-900 text-sm sm:text-base truncate"> {/* */}
                                  {" "}
                                  {/* Added truncate */}
                                  {doc.name || `Document ${index + 1}`}{" "} {/* */}
                                  {/* Fallback name */}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500"> {/* */}
                                  {/* Add file type if available, e.g., PDF */}
                                  {doc.type || "File"} {/* */}
                                </p>
                              </div>
                            </div>
                            <span //
                              className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1 sm:gap-1.5 whitespace-nowrap flex-shrink-0 ${statusInfo.color}`} //
                            >
                              <i //
                                className={`${statusInfo.icon} text-xs sm:text-sm`} //
                              ></i>
                              {statusInfo.label} {/* */}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    // Empty state for documents
                    <div className="text-center py-10 sm:py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300"> {/* */}
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4"> {/* */}
                        <i className="fas fa-folder-open text-gray-400 text-xl sm:text-2xl"></i> {/* */}
                      </div>
                      <p className="text-gray-500 font-medium text-sm sm:text-base"> {/* */}
                        No documents uploaded yet. {/* */}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-400 mt-1"> {/* */}
                        Upload documents via the Setup page. {/* */}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Account Status, Quick Stats, Actions - Adjusted spacing */}
        <div className="space-y-6"> {/* */}
          {/* Account Status Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"> {/* */}
            <div className="flex items-center gap-3 mb-4 sm:mb-6"> {/* */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0"> {/* */}
                <i className="fas fa-id-badge text-orange-600 text-base sm:text-lg"></i> {/* */}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900"> {/* */}
                Account Status {/* */}
              </h2>
            </div>
            {/* Status Badge */}
            <div //
              className={`p-4 sm:p-5 border-2 rounded-xl flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-2 ${accountStatus.color} transition-all`} //
            >
              <span className="font-bold text-base sm:text-lg"> {/* */}
                {accountStatus.label} {/* */}
              </span>
              <i className={`${accountStatus.icon} text-xl sm:text-2xl`}></i> {/* */}
            </div>
            {/* Description */}
            <p className="mt-4 text-xs sm:text-sm text-gray-700 leading-relaxed"> {/* */}
              {accountStatus.desc} {/* */}
            </p>
            {/* Member Hub Button */}
            {accountStatus.label === "Account Verified" && ( //
              <button //
                onClick={() => navigate("/vendor/members-hub")} //
                className="w-full mt-5 sm:mt-6 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-xl font-bold hover:from-green-600 hover:to-emerald-600 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base" //
              >
                <i className="fas fa-users mr-2"></i> {/* */}
                Visit Member's Hub {/* */}
              </button>
            )}
            {/* Show setup button if incomplete */}
            {accountStatus.label === "Setup Incomplete" && ( //
              <button //
                onClick={openSetup} //
                className="w-full mt-5 sm:mt-6 px-4 py-2.5 sm:px-6 sm:py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl text-sm sm:text-base" //
              >
                <i className="fas fa-cog mr-2"></i> {/* */}
                Complete Setup Now {/* */}
              </button>
            )}
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"> {/* */}
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-base sm:text-lg"> {/* */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0"> {/* */}
                <i className="fas fa-chart-bar text-blue-600 text-base sm:text-lg"></i> {/* */}
              </div>
              Quick Stats {/* */}
            </h3>
            <div className="space-y-3"> {/* */}
              <div className="p-3 sm:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100"> {/* */}
                <p className="text-xs sm:text-sm text-gray-600 font-medium"> {/* */}
                  Total Orders {/* */}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900"> {/* */}
                  {metrics.totalOrders} {/* */}
                </p>
              </div>
              <div className="p-3 sm:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100"> {/* */}
                <p className="text-xs sm:text-sm text-gray-600 font-medium"> {/* */}
                  Total Revenue {/* */}
                </p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900"> {/* */}
                  {new Intl.NumberFormat("en-IN", { //
                    style: "currency", //
                    currency: "INR", //
                    minimumFractionDigits: 0, //
                  }).format(metrics.totalRevenue || 0)} {/* */}
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons: Settings & Support */}
          <div className="space-y-3"> {/* */}
            <button //
              onClick={goToSettings} //
              className="w-full group flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-200 hover:border-orange-300 font-medium text-sm sm:text-base" //
            >
              <i className="fas fa-cog text-gray-500 group-hover:text-orange-500 transition-colors group-hover:rotate-90 duration-300 text-sm sm:text-base"></i> {/* */}
              <span>Settings</span> {/* */}
            </button>
            <button //
              onClick={goToSupport} //
              className="w-full group flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl transition-all shadow-md hover:shadow-lg border border-gray-200 hover:border-orange-300 font-medium text-sm sm:text-base" //
            >
              <i className="fas fa-headset text-gray-500 group-hover:text-orange-500 transition-colors text-sm sm:text-base"></i> {/* */}
              <span>Support</span> {/* */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorProfile; //