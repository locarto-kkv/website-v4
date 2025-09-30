import React, { useState } from "react";
import { useAnalyticStore } from "../../store/useAnalyticStore";
import {
  formatCurrency,
  formatDate,
  getOrderStatusConfig,
  getProductIcon,
} from "../../lib/utils.js";

const TopSellingProducts = () => {
  const [viewMode, setViewMode] = useState("grid");

  const { products, changeDataRange } = useAnalyticStore();

  const topProducts =
    products.length > 0 ? products.slice(0, 3) : defaultTopProducts;

  const getRankBadge = (index) => {
    const badges = {
      0: {
        color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
        icon: "fas fa-crown",
      },
      1: {
        color: "bg-gradient-to-r from-gray-400 to-gray-600",
        icon: "fas fa-medal",
      },
      2: {
        color: "bg-gradient-to-r from-amber-600 to-amber-800",
        icon: "fas fa-award",
      },
    };
    return (
      badges[index] || {
        color: "bg-gradient-to-r from-blue-500 to-blue-700",
        icon: "fas fa-star",
      }
    );
  };

  const timeRanges = [
    { value: "week", label: "This Week" },
    { value: "month", label: "This Month" },
    { value: "total", label: "Total" },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-trophy text-yellow-500"></i>
              Top Selling Products
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Best performing products by sales volume
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <select
              onChange={(e) => changeDataRange(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded text-xs transition-all ${
                  viewMode === "grid"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 rounded text-xs transition-all ${
                  viewMode === "list"
                    ? "bg-white text-indigo-600 shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                <i className="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {topProducts.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-chart-bar text-gray-300 text-4xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No sales data available
            </h3>
            <p className="text-gray-500">
              Start selling products to see your top performers here.
            </p>
          </div>
        ) : (
          <div
            className={
              viewMode === "grid" ? "grid grid-cols-1 gap-6" : "space-y-4"
            }
          >
            {topProducts.map((product, index) => {
              const rankBadge = getRankBadge(index);

              return (
                <div
                  key={product.id || index}
                  className={`group relative bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-indigo-200 hover:shadow-md transition-all duration-300 p-6 ${
                    viewMode === "grid" ? "" : ""
                  }`}
                >
                  {/* Rank Badge */}
                  <div
                    className={`absolute -top-3 -left-3 w-8 h-8 ${rankBadge.color} rounded-full flex items-center justify-center shadow-lg z-10`}
                  >
                    <i className={`${rankBadge.icon} text-white text-xs`}></i>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Compact Product Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl flex items-center justify-center shadow-sm">
                        <i
                          className={`${getProductIcon(
                            product.category
                          )} text-indigo-600 text-xl`}
                        ></i>
                      </div>
                    </div>

                    {/* Compact Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate leading-tight">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              {product.category}
                            </span>
                            {product.rating && (
                              <div className="flex items-center gap-0.5">
                                <i className="fas fa-star text-yellow-400 text-xs"></i>
                                <span className="text-xs text-gray-600">
                                  {product.rating}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Growth Indicator */}
                        <div
                          className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                            product.growth > 0
                              ? "bg-green-100 text-green-800"
                              : product.growth < 0
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <i
                            className={`fas fa-arrow-${
                              product.growth > 0
                                ? "up"
                                : product.growth < 0
                                ? "down"
                                : "right"
                            } text-xs`}
                          ></i>
                          {Math.abs(product.growth)}%
                        </div>
                      </div>

                      {/* Metrics Row */}
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">
                            {product.orders_count}
                          </div>
                          <div className="text-sm text-gray-500">
                            units sold
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xl font-bold text-gray-900">
                            {formatCurrency(product.total_amount)}
                          </div>
                          <div className="text-sm text-gray-500">revenue</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Action Buttons on Hover */}
                  <div className="flex items-center gap-1 mt-2">
                    <button
                      className="flex-1 px-2 py-1 text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors font-medium"
                      title="View Details"
                    >
                      <i className="fas fa-eye mr-1"></i>View
                    </button>
                    <button
                      className="flex-1 px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium"
                      title="Edit Product"
                    >
                      <i className="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button
                      className="flex-1 px-2 py-1 text-xs text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors font-medium"
                      title="Analytics"
                    >
                      <i className="fas fa-chart-line mr-1"></i>Stats
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
        <div>Showing top {topProducts.length} products</div>
        <button className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors">
          <span>View Full Report</span>
          <i className="fas fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default TopSellingProducts;
