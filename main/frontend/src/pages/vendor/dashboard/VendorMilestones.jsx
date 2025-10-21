// src/pages/vendor/dashboard/VendorMilestones.jsx
import React from 'react';
import { useVendorData } from '../../../context/vendor/vendorDataContext'; // Import vendor data context
import SalesProgressBar from '../../../components/vendor/SalesProgressBar'; // Import the updated component

const VendorMilestones = () => {
    const { vendor } = useVendorData(); // Get vendor data

    // --- Define Quantity Milestone Logic ---
    const quantityMilestones = [10, 50, 100, 250, 500, 1000]; // Example quantity thresholds
    // **IMPORTANT**: Use the correct field for total quantity sold.
    // Using 'orders_count' as a placeholder assuming it represents total items sold quantity.
    // Replace 'orders_count' if a more accurate field exists (e.g., vendor.total_quantity_sold).
    const currentQuantitySold = vendor?.orders_count || 0;

    // Find the next quantity milestone
    const findNextMilestone = (currentQuantity) => {
        for (const quantity of quantityMilestones) {
            if (currentQuantity < quantity) {
                return quantity;
            }
        }
        // If all milestones are achieved, return the last one or null/undefined
        // Returning the last one here for progress bar display purposes
        return quantityMilestones[quantityMilestones.length - 1];
    };

    const nextQuantityMilestoneTarget = findNextMilestone(currentQuantitySold);
    // --- End Quantity Milestone Logic ---


    // Sample data for other milestones
    const otherMilestones = [
        { id: 2, title: '10 Products Listed', achieved: (vendor?.products_count || 0) >= 10, icon: 'fas fa-box-open', description: 'List at least 10 products.' },
        { id: 3, title: 'Profile Verified', achieved: vendor?.status === 'verified', icon: 'fas fa-check-circle', description: 'Your business profile is verified.' },
        { id: 5, title: 'First 5-Star Review', achieved: false, icon: 'fas fa-medal', description: 'Receive your first 5-star review.' }, // Placeholder
        { id: 6, title: 'Premium Member', achieved: true, icon: 'fas fa-crown', description: 'You are a valued Premium Member.' }, // Placeholder
         // Add more milestones as needed
    ];

    // Combine quantity milestones into the list dynamically
    const allMilestones = [
        ...quantityMilestones.map((quantity, index) => ({
            id: `quantity-${index}`,
            title: `${quantity.toLocaleString()} Items Sold`,
            achieved: currentQuantitySold >= quantity,
            icon: 'fas fa-shopping-cart',
            description: `Sell a total of ${quantity.toLocaleString()} items.`
        })),
        ...otherMilestones
    ].sort((a, b) => (a.achieved === b.achieved) ? 0 : a.achieved ? 1 : -1); // Optional: Sort achieved to the bottom


    return (
        // Added space-y-4 for consistent spacing between elements
        <div className="space-y-4 sm:space-y-6">

            {/* **UPDATED: Sales Progress Bar Section using Quantity** */}
            {/* Render progress bar only if there's a next target */}
            {nextQuantityMilestoneTarget !== null && currentQuantitySold < nextQuantityMilestoneTarget && (
                 <SalesProgressBar
                    currentQuantity={currentQuantitySold}
                    nextMilestoneQuantity={nextQuantityMilestoneTarget}
                />
            )}
            {/* **END UPDATED SECTION** */}


            {/* Existing Milestones Section */}
            <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
              {/* Responsive Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                 <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-flag-checkered text-orange-600 text-sm sm:text-base"></i>
                 </div>
                 <div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                        All Milestones
                    </h2>
                    <p className="text-gray-600 text-xs sm:text-sm mt-1">Track your progress and achievements on Locarto!</p> {/* Shortened */}
                 </div>
              </div>

              {/* Responsive Milestones Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {allMilestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    // Responsive padding and alignment
                    className={`flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-6 rounded-xl transition-all border-2 ${
                      milestone.achieved
                        ? 'bg-green-50 border-green-200 shadow-sm' // Reduced shadow slightly
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {/* Responsive Icon */}
                    <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-2 sm:mb-3 flex-shrink-0 ${ // Added flex-shrink-0
                      milestone.achieved
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-md' // Reduced shadow
                        : 'bg-gray-300'
                    }`}>
                      <i className={`${milestone.icon} text-white text-xl sm:text-2xl`}></i>
                    </div>
                    {/* Text content */}
                    <div className="flex-1">
                      <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-1">{milestone.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3">{milestone.description}</p>
                      {/* Status Badges */}
                      {milestone.achieved ? ( // Combined achieved/in progress logic
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold text-green-700 border border-green-200">
                            <i className="fas fa-check text-[10px] sm:text-xs"></i> Achieved!
                          </span>
                      ) : (
                          <span className="inline-flex items-center gap-1 bg-white px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium text-gray-500 border border-gray-200">
                             <i className="fas fa-spinner fa-spin text-[10px] sm:text-xs"></i> In Progress
                          </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
        </div>
    );
};

export default VendorMilestones;