// src/pages/vendor/dashboard/VendorMilestones.jsx
import React from "react";
import { useVendorDataStore } from "../../../store/vendor/vendorDataStore"; // Import vendor data context
import { formatCurrency } from "../../../lib/utils"; // Import currency formatting

// --- Commission Milestone Configuration ---
const commissionMilestones = [
  //
  { targetRevenue: 0, commissionRate: 15 }, // Base rate //
  { targetRevenue: 750000, commissionRate: 14 }, // M1: 7.5 Lakhs //
  { targetRevenue: 2000000, commissionRate: 12.5 }, // M2: 20 Lakhs //
  { targetRevenue: 4500000, commissionRate: 11 }, // M3: 45 Lakhs //
  { targetRevenue: 6000000, commissionRate: 10 }, // M4: 60 Lakhs //
];

// --- Function to get current commission details based on revenue ---
const getCurrentCommissionDetails = (currentRevenue) => {
  //
  let currentRate = commissionMilestones[0].commissionRate; // Start with base rate //
  let nextMilestone = null; //

  // Find the current applicable rate and the next milestone
  for (let i = 0; i < commissionMilestones.length; i++) {
    //
    if (currentRevenue >= commissionMilestones[i].targetRevenue) {
      //
      currentRate = commissionMilestones[i].commissionRate; //
      // Check if there is a next milestone
      if (i + 1 < commissionMilestones.length) {
        //
        nextMilestone = commissionMilestones[i + 1]; //
      } else {
        nextMilestone = null; // Reached the final milestone //
      }
    } else {
      // If current revenue is less than the first target, the next milestone is the first one
      if (i === 0) {
        //
        nextMilestone = commissionMilestones[i]; //
      }
      break; // Stop checking once revenue is below a target //
    }
  }

  return {
    //
    currentRate, //
    nextMilestone, // This will be null if the last milestone is reached or exceeded //
  };
};
// --- End Commission Logic ---

const VendorMilestones = () => {
  const { vendor } = useVendorDataStore(); // Get vendor data

  // --- Calculate Commission Details ---
  const currentTotalRevenue = vendor?.total_amount || 0; //
  const {
    currentRate: currentCommissionRate,
    nextMilestone: nextCommissionMilestone,
  } = getCurrentCommissionDetails(currentTotalRevenue); //
  // --- End Calculate Commission Details ---

  // --- Transform Commission Milestones into Tile Data ---
  const commissionMilestoneTiles = commissionMilestones
    .filter((m) => m.targetRevenue > 0) // Exclude the base rate (target 0) from tiles
    .map((milestone, index) => ({
      id: `commission-M${index + 1}`,
      title: `Reach ${formatCurrency(milestone.targetRevenue)}`,
      achieved: currentTotalRevenue >= milestone.targetRevenue,
      icon: "fas fa-rupee-sign", // Use currency icon
      description: `Unlock ${milestone.commissionRate}% commission rate.`,
    }));
  // --- End Transformation ---

  // Sample data for other non-sales/non-commission milestones
  const otherMilestones = [
    //
    {
      id: 2,
      title: "10 Products Listed",
      achieved: (vendor?.products_count || 0) >= 10,
      icon: "fas fa-box-open",
      description: "List at least 10 products.",
    }, //
    {
      id: 3,
      title: "Profile Verified",
      achieved: vendor?.status === "verified",
      icon: "fas fa-check-circle",
      description: "Your business profile is verified.",
    }, //
    // Add more as needed
  ];

  // Combine ALL milestones into the list dynamically
  const allDisplayMilestones = [
    // Renamed variable //
    ...commissionMilestoneTiles, // Add commission tiles
    ...otherMilestones, //
  ].sort((a, b) => (a.achieved === b.achieved ? 0 : a.achieved ? 1 : -1)); // Optional: Sort achieved to the bottom

  // --- Commission Progress Bar Logic ---
  let commissionProgress = 0; //
  let revenueToNextMilestone = 0; //
  if (nextCommissionMilestone) {
    //
    const previousMilestoneRevenue = commissionMilestones //
      .filter((m) => m.targetRevenue < nextCommissionMilestone.targetRevenue) //
      .reduce((max, m) => Math.max(max, m.targetRevenue), 0); // Find the revenue target of the *previous* milestone //

    const milestoneRange =
      nextCommissionMilestone.targetRevenue - previousMilestoneRevenue; //
    const progressInRange = currentTotalRevenue - previousMilestoneRevenue; //

    commissionProgress = Math.min(
      100,
      Math.max(0, (progressInRange / milestoneRange) * 100)
    ); //
    revenueToNextMilestone = Math.max(
      0,
      nextCommissionMilestone.targetRevenue - currentTotalRevenue
    ); //
  } else {
    // Handle case where the final milestone is reached or exceeded
    commissionProgress = 100; //
    revenueToNextMilestone = 0; //
  }
  // --- End Commission Progress Bar Logic ---

  return (
    // Added space-y-4 for consistent spacing between elements
    <div className="space-y-4 sm:space-y-6">
      {" "}
      {/* */}
      {/* --- Commission Milestone Section (Progress Bar) --- */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        {" "}
        {/* */}
        <div className="flex items-center justify-between mb-3">
          {" "}
          {/* */}
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            {" "}
            {/* */}
            <i className="fas fa-percent text-orange-500"></i> Commission
            Milestone Progress {/* */}
          </h3>
          <span className="text-sm font-semibold text-gray-700">
            {" "}
            {/* */}
            Current Rate:{" "}
            <span className="text-orange-600 font-black">
              {currentCommissionRate}%
            </span>{" "}
            {/* */}
          </span>
        </div>
        {/* Commission Progress Bar */}
        {nextCommissionMilestone ? ( //
          <>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2 shadow-inner">
              {" "}
              {/* */}
              <div
                className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full transition-all duration-500 ease-out" //
                style={{ width: `${commissionProgress}%` }} //
              ></div>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              {" "}
              {/* */}
              <span>{formatCurrency(currentTotalRevenue)} Revenue</span> {/* */}
              <span>
                {formatCurrency(revenueToNextMilestone)} to next rate (
                {nextCommissionMilestone.commissionRate}%)
              </span>{" "}
              {/* */}
            </div>
            {commissionProgress > 0 &&
              commissionProgress < 100 && ( //
                <div className="text-center mt-2 text-xs font-medium text-gray-500">
                  {" "}
                  {/* */}
                  {commissionProgress.toFixed(1)}% to next milestone (
                  {formatCurrency(nextCommissionMilestone.targetRevenue)}){" "}
                  {/* */}
                </div>
              )}
          </>
        ) : (
          // Display when the final milestone is reached
          <>
            <div className="w-full bg-green-500 rounded-full h-4 overflow-hidden mb-2 shadow-inner"></div>{" "}
            {/* */}
            <div className="text-center mt-2 text-sm font-semibold text-green-700">
              {" "}
              {/* */}
              🎉 You've reached the final commission rate of{" "}
              {currentCommissionRate}%! {/* */}
            </div>
            <div className="text-center mt-1 text-xs text-gray-600">
              {" "}
              {/* */}
              Total Revenue: {formatCurrency(currentTotalRevenue)} {/* */}
            </div>
          </>
        )}
      </div>
      {/* --- END Commission Section --- */}
      {/* All Milestones Section (Including Commission Tiles) */}
      <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
        {" "}
        {/* */}
        {/* Responsive Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          {" "}
          {/* */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
            {" "}
            {/* */}
            <i className="fas fa-flag-checkered text-orange-600 text-sm sm:text-base"></i>{" "}
            {/* */}
          </div>
          <div>
            {" "}
            {/* */}
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">
              {" "}
              {/* */}
              All Milestones {/* Updated Title */}
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              Track your progress and achievements on Locarto!
            </p>{" "}
            {/* Shortened */} {/* */}
          </div>
        </div>
        {/* Responsive Milestones Grid */}
        {allDisplayMilestones.length > 0 ? ( // Check if there are milestones to display
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {" "}
            {/* */}
            {allDisplayMilestones.map(
              (
                milestone //
              ) => (
                <div
                  key={milestone.id} //
                  // Responsive padding and alignment
                  className={`flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl transition-all border-2 ${
                    //
                    milestone.achieved //
                      ? "bg-green-50 border-green-200 shadow-sm" // Reduced shadow slightly //
                      : "bg-gray-50 border-gray-200" //
                  }`}
                >
                  {/* Responsive Icon */}
                  <div
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0 ${
                      // Added flex-shrink-0 //
                      milestone.achieved //
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 shadow-md" // Reduced shadow //
                        : "bg-gray-300" //
                    }`}
                  >
                    <i
                      className={`${milestone.icon} text-white text-xl sm:text-2xl`}
                    ></i>{" "}
                    {/* */}
                  </div>
                  {/* Text content */}
                  <div className="flex-1">
                    {" "}
                    {/* */}
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">
                      {milestone.title}
                    </h3>{" "}
                    {/* */}
                    <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">
                      {milestone.description}
                    </p>{" "}
                    {/* */}
                    {/* Status Badges */}
                    {milestone.achieved ? ( // Combined achieved/in progress logic //
                      <span className="inline-flex items-center gap-1 bg-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-green-700 border border-green-200">
                        {" "}
                        {/* */}
                        <i className="fas fa-check text-[10px] sm:text-xs"></i>{" "}
                        Achieved! {/* */}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-gray-500 border border-gray-200">
                        {" "}
                        {/* */}
                        <i className="fas fa-spinner fa-spin text-[10px] sm:text-xs"></i>{" "}
                        In Progress {/* */}
                      </span>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        ) : (
          // Display if only commission milestones exist and no 'other' milestones
          <div className="text-center py-10 text-gray-500">
            No milestones defined yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorMilestones;
