import React, { useState, useMemo } from 'react';
// Import hooks/services if using context or API instead of mock data
// import { useVendorData } from '../../../context/vendor/vendorDataContext';
// import { formatCurrency, formatDate, getOrderStatusConfig } from '../../../lib/utils';

// Mock data for demonstration
const mockOrders = [
  {
    id: 'ORD001',
    product: { name: 'Wireless Headphones' },
    customer: { name: 'Rajesh Kumar', email: 'rajesh@example.com' },
    quantity: 2,
    amount: 4999,
    order_status: 'delivered',
    created_at: '2025-10-15',
    deliveryNote: true,
    order_invoice: 'https://example.com/invoice/ORD001.pdf' // Example invoice URL
  },
  {
    id: 'ORD002',
    product: { name: 'Smart Watch Pro' },
    customer: { name: 'Priya Singh', email: 'priya@example.com' },
    quantity: 1,
    amount: 12999,
    order_status: 'shipped',
    created_at: '2025-10-18',
    deliveryNote: false,
    order_invoice: null // Example: No invoice
  },
  {
    id: 'ORD003',
    product: { name: 'USB-C Cable' },
    customer: { name: 'Amit Patel', email: 'amit@example.com' },
    quantity: 5,
    amount: 999,
    order_status: 'processing',
    created_at: '2025-10-19',
    deliveryNote: false,
    order_invoice: 'https://example.com/invoice/ORD003.pdf'
  },
  {
    id: 'ORD004',
    product: { name: 'Phone Stand' },
    customer: { name: 'Neha Verma', email: 'neha@example.com' },
    quantity: 3,
    amount: 1499,
    order_status: 'pending',
    created_at: '2025-10-20',
    deliveryNote: false,
    order_invoice: null
  },
  {
    id: 'ORD005',
    product: { name: 'Laptop Bag' },
    customer: { name: 'Vikram Sharma', email: 'vikram@example.com' },
    quantity: 1,
    amount: 3499,
    order_status: 'cancelled',
    created_at: '2025-10-12',
    deliveryNote: true,
    order_invoice: 'https://example.com/invoice/ORD005.pdf'
  }
];

// Utility functions (as provided in the user's code)
const getOrderStatusConfig = (status) => {
  const configs = {
    pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: 'fas fa-clock', bgDot: 'bg-yellow-400' },
    processing: { label: 'Processing', color: 'bg-blue-100 text-blue-800', icon: 'fas fa-cog', bgDot: 'bg-blue-400' },
    shipped: { label: 'Shipped', color: 'bg-purple-100 text-purple-800', icon: 'fas fa-truck', bgDot: 'bg-purple-400' },
    delivered: { label: 'Delivered', color: 'bg-green-100 text-green-800', icon: 'fas fa-check-circle', bgDot: 'bg-green-400' },
    cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: 'fas fa-times-circle', bgDot: 'bg-red-400' },
    refunded: { label: 'Refunded', color: 'bg-orange-100 text-orange-800', icon: 'fas fa-undo', bgDot: 'bg-orange-400' }
  };
  return configs[status?.toLowerCase()] || configs.pending;
};

const formatCurrency = (value) => `₹${parseFloat(value).toLocaleString('en-IN')}`;
const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' });

const StatusBadge = ({ status }) => {
  const config = getOrderStatusConfig(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${config.color}`}>
      <i className={`${config.icon} text-xs`}></i>
      {config.label}
    </span>
  );
};

const VendorOrders = () => {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [viewMode, setViewMode] = useState('table');

  // Use mock data - replace with context/API call if needed
  // const { orders, dataLoading } = useVendorData();
  const orders = mockOrders;
  const dataLoading = false; // Set to false when using mock data

  const statusFilters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];

  const filteredAndSortedOrders = useMemo(() => {
    let result = orders.filter(order => {
      const matchesStatus = filterStatus === 'all' || order.order_status?.toLowerCase() === filterStatus;
      const matchesSearch =
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.product?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer?.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case 'amount_high':
          return b.amount - a.amount;
        case 'amount_low':
          return a.amount - b.amount;
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        default: // recent
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return result;
  }, [filterStatus, searchQuery, sortBy, orders]); // Added orders dependency

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.order_status === 'pending').length;
    const shipped = orders.filter(o => o.order_status === 'shipped').length;
    const delivered = orders.filter(o => o.order_status === 'delivered').length;
    return { total, pending, shipped, delivered };
  };

  const stats = getOrderStats();

  // Handle loading state if not using mock data
  if (dataLoading) {
     return <div className="p-6 text-center">Loading orders...</div>;
  }

  return (
    // **MODIFIED**: Removed outer padding/bg gradient, assuming layout provides it
    <div className="space-y-6"> {/* Added space-y for gap */}
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"> {/* Removed mb-8 */}
        {[
          { label: 'Total Orders', value: stats.total, icon: 'fas fa-shopping-bag', color: 'from-blue-500 to-cyan-500' },
          { label: 'Pending', value: stats.pending, icon: 'fas fa-clock', color: 'from-yellow-500 to-orange-500' },
          { label: 'Shipped', value: stats.shipped, icon: 'fas fa-truck', color: 'from-purple-500 to-pink-500' },
          { label: 'Delivered', value: stats.delivered, icon: 'fas fa-check-circle', color: 'from-green-500 to-emerald-500' }
        ].map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center shadow-lg`}>
                <i className={`${stat.icon} text-white text-lg`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6"> {/* Removed mb-6 */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Search by Order ID, Product, or Customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              title="Table View"
            >
              <i className="fas fa-table text-lg"></i>
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-2.5 rounded-lg transition-all ${viewMode === 'card' ? 'bg-white text-orange-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
              title="Card View"
            >
              <i className="fas fa-th text-lg"></i>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              {statusFilters.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700 block mb-2">Sort By</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white"
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Highest Value</option>
              <option value="amount_low">Lowest Value</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2">
              <i className="fas fa-download"></i>
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Orders Display */}
      {viewMode === 'table' ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            {filteredAndSortedOrders.length === 0 ? (
              <div className="text-center py-16">
                <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
                <p className="text-gray-500 text-lg font-medium">No orders found</p>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search criteria</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Order</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Product</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Customer</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Qty</th>
                    <th className="text-right px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Amount</th>
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    {/* **NEW**: Invoice Header */}
                    <th className="text-left px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Invoice</th>
                    <th className="text-center px-6 py-4 text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredAndSortedOrders.map((order) => ( // Removed index
                    <tr key={order.id} className="hover:bg-orange-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                            <i className="fas fa-shopping-bag text-orange-600"></i>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{order.id}</p>
                            <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700 font-medium">{order.product?.name || 'N/A'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-gray-700 font-medium">{order.customer?.name}</p>
                          <p className="text-xs text-gray-500">{order.customer?.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-sm font-semibold">{order.quantity}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="text-sm font-bold text-gray-900">{formatCurrency(order.amount)}</p>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.order_status} />
                      </td>
                      {/* **NEW**: Invoice Data Cell */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {order.order_invoice ? ( // Check if order_invoice exists
                          <a
                            href={order.order_invoice} // Link to the invoice URL
                            target="_blank" // Open in new tab
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1"
                            title="View Invoice"
                          >
                            <i className="fas fa-file-invoice text-xs"></i> View
                          </a>
                        ) : (
                          <span className="text-gray-400">N/A</span> // Display N/A if no invoice
                        )}
                      </td>
                      {/* End New Cell */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-2">
                          <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="View Details">
                            <i className="fas fa-eye text-sm"></i>
                          </button>
                          <button className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all" title="More Options">
                            <i className="fas fa-ellipsis-v text-sm"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      ) : ( // Card View
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedOrders.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <i className="fas fa-inbox text-5xl text-gray-300 mb-4"></i>
              <p className="text-gray-500 text-lg font-medium">No orders found</p>
            </div>
          ) : (
            filteredAndSortedOrders.map((order) => {
              // const statusConfig = getOrderStatusConfig(order.order_status); // Already defined StatusBadge
              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-sm font-semibold text-gray-500 uppercase">{order.id}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(order.created_at)}</p>
                    </div>
                    <StatusBadge status={order.order_status} />
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <p className="text-sm text-gray-600 mb-1">Product</p>
                    <p className="font-semibold text-gray-900">{order.product?.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Quantity</p>
                      <p className="text-lg font-bold text-gray-900">{order.quantity}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 mb-1">Amount</p>
                      <p className="text-lg font-bold text-gray-900">{formatCurrency(order.amount)}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4 mb-4">
                    <p className="text-sm text-gray-600 mb-2">Customer</p>
                    <p className="font-semibold text-gray-900 text-sm">{order.customer?.name}</p>
                    <p className="text-xs text-gray-500">{order.customer?.email}</p>
                  </div>

                   {/* **NEW**: Invoice Link in Card View */}
                   <div className="border-t border-gray-100 pt-4 mb-4">
                       <p className="text-sm text-gray-600 mb-2">Invoice</p>
                       {order.order_invoice ? (
                         <a
                           href={order.order_invoice}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="text-blue-600 hover:text-blue-800 hover:underline font-medium flex items-center gap-1 text-sm"
                           title="View Invoice"
                         >
                           <i className="fas fa-file-invoice text-xs"></i> View Invoice
                         </a>
                       ) : (
                         <span className="text-gray-400 text-sm">N/A</span>
                       )}
                   </div>
                   {/* End New Invoice Section */}


                  <div className="flex gap-2 border-t border-gray-100 pt-4 mt-4"> {/* Added border-t and mt-4 */}
                    <button className="flex-1 p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2">
                      <i className="fas fa-eye"></i>View
                    </button>
                    <button className="flex-1 p-2 text-orange-600 hover:bg-orange-50 rounded-lg transition-all text-sm font-medium flex items-center justify-center gap-2">
                      <i className="fas fa-ellipsis-v"></i>More
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;