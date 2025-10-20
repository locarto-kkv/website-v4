// src/components/vendor/SalesProgressBar.jsx
import React from 'react';
// Removed formatCurrency import

// Renamed props to reflect quantity
const SalesProgressBar = ({ currentQuantity, nextMilestoneQuantity }) => {
  // Calculate progress percentage based on quantity
  const progress = Math.min(100, Math.max(0, (currentQuantity / nextMilestoneQuantity) * 100));
  // Calculate quantity left
  const quantityLeft = Math.max(0, nextMilestoneQuantity - currentQuantity);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
           {/* Changed Icon */}
           <i className="fas fa-box text-orange-500"></i> Items Sold Milestone
        </h3>
        {/* Display next milestone as a number */}
        <span className="text-sm font-semibold text-orange-600">
          Next: {nextMilestoneQuantity.toLocaleString()} Items
        </span>
      </div>

      {/* Progress Bar (remains the same structurally) */}
      <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-2 shadow-inner">
        <div
          className="bg-gradient-to-r from-orange-400 to-red-500 h-4 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Text Indicators - Updated labels and removed currency formatting */}
      <div className="flex justify-between text-sm text-gray-600">
        <span>{currentQuantity.toLocaleString()} Items Sold</span>
        {quantityLeft > 0 ? (
          <span>{quantityLeft.toLocaleString()} to next milestone</span>
        ) : (
          <span className="font-semibold text-green-600">Milestone Reached! 🎉</span>
        )}
      </div>
       {progress > 0 && progress < 100 && (
          <div className="text-center mt-2 text-xs font-medium text-gray-500">
             {progress.toFixed(1)}% Complete
          </div>
       )}
    </div>
  );
};

export default SalesProgressBar;