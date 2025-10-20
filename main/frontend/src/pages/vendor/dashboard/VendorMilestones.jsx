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
        return quantityMilestones[quantityMilestones.length - 1]; // Fallback
    };

    const nextQuantityMilestoneTarget = findNextMilestone(currentQuantitySold);
    // --- End Quantity Milestone Logic ---


    // Sample data for other milestones
    const otherMilestones = [
        { id: 2, title: '10 Products Listed', achieved: (vendor?.products_count || 0) >= 10, icon: 'fas fa-box-open', description: 'You have successfully listed 10 products.' }, //
        { id: 3, title: 'Profile Verified', achieved: vendor?.status === 'verified', icon: 'fas fa-check-circle', description: 'Your business profile and documents are verified.' }, //
        { id: 5, title: 'First 5-Star Review', achieved: false, icon: 'fas fa-medal', description: 'Receive your first 5-star review from a customer.' }, //
        { id: 6, title: 'Premium Member', achieved: true, icon: 'fas fa-crown', description: 'You are a valued Premium Member.' }, //
         // Add more milestones as needed
    ];

    // Combine quantity milestones into the list dynamically
    const allMilestones = [
        ...quantityMilestones.map((quantity, index) => ({
            id: `quantity-${index}`,
            title: `${quantity.toLocaleString()} Items Sold`, // Updated title
            achieved: currentQuantitySold >= quantity,
            icon: 'fas fa-shopping-cart', // Changed icon
            description: `Sell a total of ${quantity.toLocaleString()} items.` // Updated description
        })),
        ...otherMilestones
    ].sort((a, b) => (a.achieved === b.achieved) ? 0 : a.achieved ? 1 : -1); // Optional sort


    return (
        <div className="space-y-6">

            {/* **UPDATED: Sales Progress Bar Section using Quantity** */}
            {nextQuantityMilestoneTarget !== null && (
                 <SalesProgressBar
                    currentQuantity={currentQuantitySold} // Pass quantity
                    nextMilestoneQuantity={nextQuantityMilestoneTarget} // Pass quantity target
                />
            )}
            {/* **END UPDATED SECTION** */}


            {/* Existing Milestones Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <i className="fas fa-flag-checkered text-orange-500"></i>
                All Milestones
              </h2>
              <p className="text-gray-600 mb-6 text-sm">Track your progress and achievements on Locarto. Unlock new milestones as your business grows!</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allMilestones.map((milestone) => ( // Use the combined list
                  <div
                    key={milestone.id}
                    className={`flex flex-col items-center text-center gap-4 p-6 rounded-xl transition-all border-2 ${
                      milestone.achieved
                        ? 'bg-green-50 border-green-200 shadow-md'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-3 ${
                      milestone.achieved
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg'
                        : 'bg-gray-300'
                    }`}>
                      <i className={`${milestone.icon} text-white text-2xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-lg text-gray-900 mb-1">{milestone.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
                      {milestone.achieved && (
                          <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-bold text-green-700 border border-green-200">
                            <i className="fas fa-check"></i> Achieved!
                          </span>
                      )}
                       {!milestone.achieved && (
                          <span className="inline-flex items-center gap-1 bg-white px-3 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200">
                             <i className="fas fa-spinner fa-spin text-xs"></i> In Progress
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