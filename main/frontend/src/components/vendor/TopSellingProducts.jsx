import React, { useState } from "react";
import {
  formatCurrency,
  getProductIcon,
} from "../../lib/utils.js";
import { useVendorData } from "../../context/vendor/vendorDataContext";

const TopSellingProducts = () => {
  const [viewMode, setViewMode] = useState("list"); // Default to list for mobile-first
  const { products, changeDataRange } = useVendorData();
  const topProducts = (products || []).slice(0, 3);

  const getRankBadge = (index) => {
    const badges = {
      0: { color: "bg-gradient-to-r from-yellow-400 to-yellow-600", icon: "fas fa-crown" },
      1: { color: "bg-gradient-to-r from-gray-400 to-gray-600", icon: "fas fa-medal" },
      2: { color: "bg-gradient-to-r from-amber-600 to-amber-800", icon: "fas fa-award" },
    };
    return badges[index] || { color: "bg-gradient-to-r from-blue-500 to-blue-700", icon: "fas fa-star" };
  };

  const timeRanges = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "total", label: "Total" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-4 sm:px-6 sm:py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-trophy text-yellow-500"></i>
              Top Selling
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Best performers by sales volume
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 self-start sm:self-center">
            <select
              onChange={(e) => changeDataRange(e.target.value)}
              className="px-2 py-1.5 sm:px-3 sm:py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content area that scrolls if needed */}
      <div className="flex-1 overflow-y-auto p-4">
        {topProducts.length === 0 ? (
          <div className="text-center py-10 sm:py-12 flex flex-col items-center justify-center h-full">
            <i className="fas fa-chart-bar text-gray-300 text-3xl sm:text-4xl mb-4"></i>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No sales data available
            </h3>
            <p className="text-gray-500 text-xs sm:text-sm">Start selling to see top performers.</p>
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {topProducts.map((product, index) => {
              const rankBadge = getRankBadge(index);
              const growth = product.growth || 0; // Placeholder for growth

              return (
                <div
                  key={product.id || index}
                  className="group relative bg-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 p-3 sm:p-4"
                >
                  <div
                    className={`absolute -top-2.5 -left-2.5 w-7 h-7 ${rankBadge.color} rounded-full flex items-center justify-center shadow-lg z-10`}
                  >
                    <i className={`${rankBadge.icon} text-white text-[10px]`}></i>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                        <i className={`${getProductIcon(product.category)} text-indigo-600 text-lg sm:text-xl`}></i>
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate leading-tight">
                          {product.name}
                        </h3>
                        <div
                          className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-xs font-medium flex-shrink-0 ${
                            growth > 0 ? "bg-green-100 text-green-800"
                            : growth < 0 ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <i className={`fas fa-arrow-${growth > 0 ? "up" : growth < 0 ? "down" : "right"} text-[8px] sm:text-[10px]`}></i>
                          {Math.abs(growth)}%
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <div className="text-lg sm:text-xl font-bold text-gray-900">
                            {product.orders_count || 0}
                          </div>
                          <div className="text-xs text-gray-500 -mt-1">
                            units sold
                          </div>
                        </div>
                        <div className="mt-1 sm:mt-0 sm:text-right">
                          <div className="text-base sm:text-lg font-bold text-gray-900">
                            {formatCurrency(product.total_amount)}
                          </div>
                          <div className="text-xs text-gray-500 -mt-1">revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-4 py-2 sm:px-6 sm:py-3 border-t border-gray-200 flex items-center justify-between text-xs sm:text-sm text-gray-600 mt-auto">
        <div>Top {topProducts.length} products</div>
        <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors">
          <span>Full Report</span>
          <i className="fas fa-arrow-right text-[10px]"></i>
        </button>
      </div>
    </div>
  );
};

export default TopSellingProducts;

