// src/pages/vendor/dashboard/VendorsMemberHub.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useVendorData } from "../../../context/vendor/vendorDataContext"; // Import vendor data context
import { formatCurrency } from "../../../lib/utils"; // Import currency formatting

// --- Define Quantity Milestone Logic ---
// Example quantity thresholds (You might fetch these or have them configured elsewhere)
const quantityMilestones = [10, 50, 100, 250, 500, 1000];

// --- Placeholder Data/Config for Premium Features ---
const currentPlan = {
  name: "Locarto Premium",
  status: "Active", // Could be 'Active', 'Expiring Soon', 'Cancelled'
  renewalDate: "2026-10-20", // Example date
  price: 499, // Example price
  currency: "INR",
  keyBenefits: [
    "Enhanced Analytics Suite",
    "Milestone Commission Reductions",
    "Featured Product Listings",
    "Lower Transaction Fees",
    "Custom Storefront Options",
    "Priority Support", // Added another benefit
  ],
};

const premiumStats = {
  featuredViews: 1250, // Example stat
  conversionBoost: "+3.5%", // Example stat
  // Example Milestone/Commission Stats (Replace with actual logic/data)
  currentCommissionRate: "8%", // Placeholder
  nextMilestoneTargetRevenue: 750000, // Placeholder revenue target
  // nextMilestoneTargetItems: 100, // Placeholder item target (if needed elsewhere)
};

const VendorsMemberHub = () => {
  const navigate = useNavigate();
  const { vendor } = useVendorData(); // Get vendor data

  const currentQuantitySold = vendor?.orders_count || 0; // Get current quantity sold

  // --- Handlers ---
  const handleManageSubscription = () => {
    console.log("Navigate to manage subscription");
    // navigate('/vendor/settings/subscription'); // Example navigation
  };

  const handleViewEnhancedAnalytics = () => {
    navigate("/vendor/dashboard/analytics");
  };

  const handleViewMilestonesAndCommissions = () => {
    navigate("/vendor/dashboard/milestones"); // Navigate to the full milestones page
  };

  return (
    <div className="space-y-6"> {/* Consistent gap */}
      {/* Premium Plan Overview */}
      <div className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl shadow-xl p-6 md:p-8 text-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {currentPlan.status}
              </span>
              <h2 className="text-3xl font-bold">{currentPlan.name}</h2>
            </div>
            <p className="text-white/80">
              {currentPlan.status === "Active"
                ? `Renews on ${new Date(
                    currentPlan.renewalDate
                  ).toLocaleDateString()}`
                : "Manage your subscription"}
            </p>
          </div>
          {/* --- MODIFIED Price Display --- */}
          <div className="text-right flex-shrink-0 flex items-baseline gap-2">
            <p className="text-4xl font-black line-through text-white/50"> {/* Added line-through and reduced opacity */}
              ₹{currentPlan.price}
              <span className="text-xl font-medium">/mo</span>
            </p>
            <p className="text-3xl font-extrabold text-green-300 animate-pulse"> {/* Added new 'Free !!' text */}
              Free !!
            </p>
          </div>
          {/* --- END MODIFIED Price Display --- */}
        </div>
        <div className="mt-6 pt-6 border-t border-white/20">
          <h3 className="font-semibold mb-3 text-white/90">
            Key Premium Benefits:
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
            {currentPlan.keyBenefits.slice(0, 6).map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <i className="fas fa-check-circle text-green-300 text-xs"></i>
                <span className="opacity-90">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleManageSubscription}
            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white py-2 px-6 rounded-lg font-semibold transition-all hover:shadow-md"
          >
            Manage Subscription
          </button>
        </div>
      </div>

      {/* Premium Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Enhanced Analytics Card (Keep as is) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
              <i className="fas fa-chart-pie text-purple-600 text-lg"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Enhanced Analytics
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4">
            Unlock deeper insights into customer behavior, sales trends, and
            product performance.
          </p>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">
                Conversion Boost:
              </span>
              <span className="font-bold text-green-600">
                {premiumStats.conversionBoost}
              </span>
            </div>
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">
                Customer Return Rate:
              </span>
              <span className="font-bold text-gray-800">25%</span> {/* Example */}
            </div>
          </div>
          <button
            onClick={handleViewEnhancedAnalytics}
            className="w-full mt-auto py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
          >
            View Full Analytics Suite
          </button>
        </div>

        {/* --- MODIFIED: Milestone Commission Card --- */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-flag-checkered text-orange-600 text-lg"></i>
            </div>
            <h3 className="text-xl font-bold text-gray-900">
              Milestone Commissions
            </h3>
          </div>
          <p className="text-gray-600 text-sm mb-4 flex-grow">
            Reach sales milestones to automatically reduce your commission rates
            with this premium add-on.
          </p>
          {/* Stats Area */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">
                Current Commission:
              </span>
              <span className="font-bold text-gray-800">
                {premiumStats.currentCommissionRate}
              </span>
            </div>
            {/* --- MODIFIED Next Milestone Target --- */}
            <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
              <span className="font-medium text-gray-700">
                Next Milestone Target (Revenue): {/* Changed Label */}
              </span>
              <span className="font-bold text-gray-800 blur-[3px]"> {/* Added blur */}
                 {formatCurrency(premiumStats.nextMilestoneTargetRevenue)} {/* Changed to revenue and formatted */}
              </span>
            </div>
            {/* --- END MODIFIED Next Milestone Target --- */}
          </div>
          {/* Button to view all milestones */}
          <button
            onClick={handleViewMilestonesAndCommissions}
            className="w-full mt-auto py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
          >
            Manage Milestones & Commissions
          </button>
        </div>
        {/* --- END MODIFIED CARD --- */}
      </div>
    </div>
  );
};

export default VendorsMemberHub;