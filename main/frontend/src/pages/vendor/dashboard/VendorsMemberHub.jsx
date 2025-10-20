// src/pages/vendor/dashboard/VendorsMemberHub.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// You might need data from your vendor context
// import { useVendorData } from '../../../context/vendor/vendorDataContext';

const VendorsMemberHub = () => {
    const navigate = useNavigate();
    // const { profile, vendor, analyticsData } = useVendorData(); // Example: Get data if needed

    // --- Placeholder Data/Config for Premium Features ---
    const currentPlan = {
        name: "Locarto Premium",
        status: "Active", // Could be 'Active', 'Expiring Soon', 'Cancelled'
        renewalDate: "2026-10-20", // Example date
        price: 499, // Example price
        currency: "INR",
        keyBenefits: [
            "Enhanced Analytics Suite",
            "Featured Product Listings",
            "Priority Support Channel",
            "Lower Transaction Fees",
            "Custom Storefront Options",
        ]
    };

    const premiumStats = {
        featuredViews: 1250, // Example stat
        conversionBoost: "+3.5%", // Example stat
        priorityTicketsResolved: 8, // Example stat
    };

    // --- Handlers ---
    const handleManageSubscription = () => {
        // Navigate to a dedicated subscription management page or open a modal
        console.log("Navigate to manage subscription");
        // navigate('/vendor/settings/subscription'); // Example navigation
    };

    const handleCreatePromotion = () => {
        // Navigate to a promotion creation page/modal
        console.log("Navigate to create promotion");
        // navigate('/vendor/promotions/new'); // Example navigation
    };

     const handleViewEnhancedAnalytics = () => {
        // Navigate to the enhanced analytics section/page
        navigate('/vendor/analytics'); // Navigate to existing analytics, assuming it shows more for premium
    };

     const handleAccessPrioritySupport = () => {
        // Navigate to support page or open dedicated chat
        navigate('/vendor/support'); // Example navigation
    };


    return (
        <div className="space-y-6"> {/* Use space-y for consistent gap */}

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
                            {currentPlan.status === "Active" ? `Renews on ${new Date(currentPlan.renewalDate).toLocaleDateString()}` : "Manage your subscription"}
                        </p>
                    </div>
                     <div className="text-right flex-shrink-0">
                         {/* Placeholder price */}
                         <p className="text-4xl font-black">₹{currentPlan.price}<span className="text-xl font-medium text-white/70">/mo</span></p>
                     </div>
                </div>
                <div className="mt-6 pt-6 border-t border-white/20">
                    <h3 className="font-semibold mb-3 text-white/90">Key Premium Benefits:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm">
                        {currentPlan.keyBenefits.slice(0, 6).map((benefit, index) => ( // Show max 6 benefits here
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {/* Enhanced Analytics Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center">
                            <i className="fas fa-chart-pie text-purple-600 text-lg"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Enhanced Analytics</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Unlock deeper insights into customer behavior, sales trends, and product performance.
                    </p>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                            <span className="font-medium text-gray-700">Conversion Boost:</span>
                            <span className="font-bold text-green-600">{premiumStats.conversionBoost}</span>
                        </div>
                         {/* Add another premium stat example */}
                         <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                            <span className="font-medium text-gray-700">Customer Return Rate:</span>
                            <span className="font-bold text-gray-800">25%</span>
                        </div>
                    </div>
                    <button
                        onClick={handleViewEnhancedAnalytics}
                        className="w-full mt-auto py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm"
                    >
                        View Full Analytics Suite
                    </button>
                </div>

                {/* Promotional Tools Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-xl flex items-center justify-center">
                            <i className="fas fa-bullhorn text-teal-600 text-lg"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Promotional Tools</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Boost visibility with featured listings and create special offers to attract more customers.
                    </p>
                     <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                            <span className="font-medium text-gray-700">Featured Listing Views:</span>
                            <span className="font-bold text-gray-800">{premiumStats.featuredViews}</span>
                        </div>
                         <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                            <span className="font-medium text-gray-700">Active Promotions:</span>
                            <span className="font-bold text-gray-800">2</span>
                        </div>
                    </div>
                    <button
                         onClick={handleCreatePromotion}
                        className="w-full mt-auto py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium text-sm"
                    >
                        Create New Promotion
                    </button>
                </div>

                 {/* Priority Support Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-sky-100 rounded-xl flex items-center justify-center">
                            <i className="fas fa-headset text-blue-600 text-lg"></i>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">Priority Support</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                        Get faster responses and dedicated assistance from our premium support team.
                    </p>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                            <span className="font-medium text-gray-700">Avg. Response Time:</span>
                            <span className="font-bold text-gray-800">&lt; 1 Hour</span>
                        </div>
                         <div className="flex justify-between text-sm p-2 bg-gray-50 rounded">
                            <span className="font-medium text-gray-700">Tickets Resolved (Month):</span>
                            <span className="font-bold text-gray-800">{premiumStats.priorityTicketsResolved}</span>
                        </div>
                    </div>
                    <button
                        onClick={handleAccessPrioritySupport}
                        className="w-full mt-auto py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                    >
                        Access Priority Support
                    </button>
                </div>

                {/* Add more cards for other premium features like: */}
                {/* - Custom Storefront Options */}
                {/* - Exclusive Resources (Webinars/Guides) */}

            </div>
        </div>
    );
};

export default VendorsMemberHub;