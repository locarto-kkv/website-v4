import React, { useState } from 'react';

const TopSellingProducts = ({ products = [] }) => {
  const [timeRange, setTimeRange] = useState('week');
  const [viewMode, setViewMode] = useState('grid');

  // Enhanced static data with more details
  const defaultTopProducts = [
    { 
      id: 1,
      name: "Premium Wireless Headphones", 
      sold: 120,
      revenue: 14400,
      growth: 15.2,
      category: "Electronics",
      image: null,
      rating: 4.8,
      inStock: true,
      trend: 'up'
    },
    { 
      id: 2,
      name: "Smart Fitness Watch", 
      sold: 98,
      revenue: 19600,
      growth: 8.7,
      category: "Wearables",
      image: null,
      rating: 4.6,
      inStock: true,
      trend: 'up'
    },
    { 
      id: 3,
      name: "Bluetooth Speaker Pro", 
      sold: 76,
      revenue: 9120,
      growth: -2.1,
      category: "Audio",
      image: null,
      rating: 4.4,
      inStock: false,
      trend: 'down'
    },
    { 
      id: 4,
      name: "USB-C Power Bank", 
      sold: 65,
      revenue: 3250,
      growth: 22.3,
      category: "Accessories",
      image: null,
      rating: 4.5,
      inStock: true,
      trend: 'up'
    }
  ];

  const topProducts = products.length > 0 ? products : defaultTopProducts;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getProductIcon = (category) => {
    const icons = {
      'Electronics': 'fas fa-laptop',
      'Wearables': 'fas fa-clock',
      'Audio': 'fas fa-volume-up',
      'Accessories': 'fas fa-plug',
      'Default': 'fas fa-box'
    };
    return icons[category] || icons['Default'];
  };

  const getRankBadge = (index) => {
    const badges = {
      0: { color: 'bg-gradient-to-br from-yellow-400 to-yellow-500', icon: 'fas fa-crown', shadow: 'shadow-yellow-200' },
      1: { color: 'bg-gradient-to-br from-gray-300 to-gray-400', icon: 'fas fa-medal', shadow: 'shadow-gray-200' },
      2: { color: 'bg-gradient-to-br from-orange-400 to-orange-500', icon: 'fas fa-award', shadow: 'shadow-orange-200' }
    };
    return badges[index] || { color: 'bg-gradient-to-br from-blue-400 to-blue-500', icon: 'fas fa-star', shadow: 'shadow-blue-200' };
  };

  const timeRanges = [
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'quarter', label: 'This Quarter' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      {/* Compact Header */}
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
              <i className="fas fa-trophy text-white text-sm"></i>
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Top Selling Products</h2>
              <p className="text-xs text-gray-500">Best performing by sales volume</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Time Range Selector */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-2 py-1 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 bg-white text-gray-700 font-medium"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded text-xs transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <i className="fas fa-th-large"></i>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded text-xs transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white text-orange-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
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
          <div className="text-center py-8">
            <i className="fas fa-chart-bar text-gray-300 text-3xl mb-3"></i>
            <h3 className="text-sm font-medium text-gray-900 mb-1">No sales data available</h3>
            <p className="text-xs text-gray-500">Start selling to see top performers.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {topProducts.map((product, index) => {
              const rankBadge = getRankBadge(index);
              
              return (
                <div 
                  key={product.id || index}
                  className="group relative bg-white rounded-lg border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all duration-200 p-3"
                >
                  {/* Rank Badge - Smaller and more subtle */}
                  <div className={`absolute -top-2 -left-2 w-7 h-7 ${rankBadge.color} rounded-full flex items-center justify-center ${rankBadge.shadow} shadow-md z-10`}>
                    <i className={`${rankBadge.icon} text-white text-xs`}></i>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Compact Product Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg flex items-center justify-center">
                        <i className={`${getProductIcon(product.category)} text-orange-600 text-lg`}></i>
                      </div>
                      {!product.inStock && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white">
                          <i className="fas fa-exclamation text-white text-xs"></i>
                        </div>
                      )}
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
                                <span className="text-xs text-gray-600 font-medium">{product.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Growth Indicator - Compact */}
                        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${
                          product.growth > 0 
                            ? 'bg-green-50 text-green-700' 
                            : product.growth < 0 
                              ? 'bg-red-50 text-red-700'
                              : 'bg-gray-50 text-gray-700'
                        }`}>
                          <i className={`fas fa-arrow-${product.growth > 0 ? 'up' : product.growth < 0 ? 'down' : 'right'} text-xs`}></i>
                          {Math.abs(product.growth)}%
                        </div>
                      </div>

                      {/* Compact Metrics Row */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-bold text-gray-900">{product.sold}</span>
                          <span className="text-xs text-gray-500">units</span>
                        </div>
                        
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-bold text-gray-900">{formatCurrency(product.revenue)}</span>
                          <span className="text-xs text-gray-500">revenue</span>
                        </div>

                        {/* Compact Stock Status */}
                        <div className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${
                          product.inStock 
                            ? 'bg-green-50 text-green-700'
                            : 'bg-red-50 text-red-700'
                        }`}>
                          {product.inStock ? 'In Stock' : 'Out of Stock'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Compact Action Buttons on Hover */}
                  <div className="flex items-center gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button className="flex-1 px-2 py-1 text-xs text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors font-medium" title="View Details">
                      <i className="fas fa-eye mr-1"></i>View
                    </button>
                    <button className="flex-1 px-2 py-1 text-xs text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors font-medium" title="Edit Product">
                      <i className="fas fa-edit mr-1"></i>Edit
                    </button>
                    <button className="flex-1 px-2 py-1 text-xs text-gray-600 hover:text-green-600 hover:bg-green-50 rounded transition-colors font-medium" title="Analytics">
                      <i className="fas fa-chart-line mr-1"></i>Stats
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Compact Footer */}
      <div className="bg-gray-50 px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600 flex-shrink-0">
        <span>Showing top {topProducts.length} products</span>
        <button className="flex items-center gap-1 text-orange-600 hover:text-orange-700 font-medium hover:underline transition-colors">
          <span>View All</span>
          <i className="fas fa-arrow-right text-xs"></i>
        </button>
      </div>
    </div>
  );
};

export default TopSellingProducts;