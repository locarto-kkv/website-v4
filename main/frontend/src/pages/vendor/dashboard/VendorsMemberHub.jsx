import React, { useState } from 'react';

const VendorsMemberHub = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data
  const milestones = [
    { id: 1, title: 'First Sale', achieved: true, icon: 'fas fa-trophy' },
    { id: 2, title: '100 Products', achieved: true, icon: 'fas fa-box' },
    { id: 3, title: '1000 Sales', achieved: false, icon: 'fas fa-star' }
  ];

  const liveStockBuyers = [
    { id: 1, name: 'John Smith', avatar: 'JS', status: 'online', lastActive: 'Active now' },
    { id: 2, name: 'Sarah Wilson', avatar: 'SW', status: 'online', lastActive: 'Active now' },
    { id: 3, name: 'Mike Johnson', avatar: 'MJ', status: 'away', lastActive: '5 min ago' }
  ];

  const welcomeMessage = {
    title: "Welcome to Members Hub!",
    content: "Connect with buyers, track your milestones, and grow your business."
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
       

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl shadow-lg p-6 mb-6 text-white">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="fas fa-info-circle text-2xl"></i>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2">{welcomeMessage.title}</h2>
              <p className="text-white/90">{welcomeMessage.content}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Membership Plan Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <i className="fas fa-id-card text-orange-500"></i>
                  Membership Plan
                </h2>
                <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                  Upgrade
                </button>
              </div>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Premium Vendor</h3>
                    <p className="text-gray-600">All features included</p>
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                    <i className="fas fa-crown text-white text-2xl"></i>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>Unlimited Products</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>Priority Support</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>Advanced Analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <i className="fas fa-check-circle text-green-500"></i>
                    <span>Featured Listings</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones Section */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <i className="fas fa-flag-checkered text-orange-500"></i>
                Your Milestones
              </h2>
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div 
                    key={milestone.id}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                      milestone.achieved 
                        ? 'bg-green-50 border-2 border-green-200' 
                        : 'bg-gray-50 border-2 border-gray-200'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      milestone.achieved 
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                        : 'bg-gray-300'
                    }`}>
                      <i className={`${milestone.icon} text-white text-xl`}></i>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{milestone.title}</h3>
                      <p className="text-sm text-gray-600">
                        {milestone.achieved ? 'Completed!' : 'In Progress'}
                      </p>
                    </div>
                    {milestone.achieved && (
                      <i className="fas fa-check-circle text-green-500 text-2xl"></i>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Live Stock Buyers */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                Live Stock Buyers
              </h2>
              
              {/* Search */}
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search buyers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                  <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                </div>
              </div>

              {/* Buyers List */}
              <div className="space-y-3">
                {liveStockBuyers.map((buyer) => (
                  <div 
                    key={buyer.id}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-all"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold">
                        {buyer.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        buyer.status === 'online' ? 'bg-green-500' : 'bg-yellow-500'
                      }`}></div>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{buyer.name}</h3>
                      <p className="text-xs text-gray-500">{buyer.lastActive}</p>
                    </div>
                    <button className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center hover:bg-orange-200 transition-colors">
                      <i className="fas fa-comment text-orange-500"></i>
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all">
                View All Buyers
              </button>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-handshake text-blue-500 text-xl"></i>
                    <span className="font-semibold text-gray-700">Active Deals</span>
                  </div>
                  <span className="text-2xl font-bold text-blue-500">12</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-dollar-sign text-green-500 text-xl"></i>
                    <span className="font-semibold text-gray-700">Revenue</span>
                  </div>
                  <span className="text-2xl font-bold text-green-500">$5.2K</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <i className="fas fa-users text-purple-500 text-xl"></i>
                    <span className="font-semibold text-gray-700">Connections</span>
                  </div>
                  <span className="text-2xl font-bold text-purple-500">48</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorsMemberHub;