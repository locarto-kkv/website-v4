import React, { useState } from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: 'fas fa-clock', label: 'Pending' },
      processing: { color: 'bg-blue-100 text-blue-800', icon: 'fas fa-cog', label: 'Processing' },
      shipped: { color: 'bg-purple-100 text-purple-800', icon: 'fas fa-shipping-fast', label: 'Shipped' },
      delivered: { color: 'bg-green-100 text-green-800', icon: 'fas fa-check-circle', label: 'Delivered' },
      cancelled: { color: 'bg-red-100 text-red-800', icon: 'fas fa-times-circle', label: 'Cancelled' },
      refunded: { color: 'bg-gray-100 text-gray-800', icon: 'fas fa-undo', label: 'Refunded' }
    };
    return configs[status?.toLowerCase()] || configs.pending;
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}>
      <i className={`${config.icon} text-xs`}></i>
      {config.label}
    </span>
  );
};

const RecentOrdersTable = ({ orders = [] }) => {
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all');

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter orders based on status
  const filteredOrders = orders.filter(order => {
    if (filter === 'all') return true;
    return order.order_status?.toLowerCase() === filter;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'amount') {
      aValue = parseFloat(a.transaction?.amount || 0);
      bValue = parseFloat(b.transaction?.amount || 0);
    }
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const statusFilters = [
    { value: 'all', label: 'All Orders', count: orders.length },
    { value: 'pending', label: 'Pending', count: orders.filter(o => o.order_status?.toLowerCase() === 'pending').length },
    { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.order_status?.toLowerCase() === 'delivered').length },
    { value: 'shipped', label: 'Shipped', count: orders.filter(o => o.order_status?.toLowerCase() === 'shipped').length }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <i className="fas fa-shopping-cart text-orange-500"></i>
              Recent Orders
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {filteredOrders.length} of {orders.length} orders
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Filter:</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              >
                {statusFilters.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label} ({status.count})
                  </option>
                ))}
              </select>
            </div>
            
            <button className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1 hover:underline transition-colors">
              <span>View All</span>
              <i className="fas fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <i className="fas fa-inbox text-gray-300 text-4xl mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
            <p className="text-gray-500">There are no orders matching your current filter.</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('id')}
                >
                  <div className="flex items-center gap-2">
                    Order ID
                    <i className={`fas fa-sort text-xs ${sortField === 'id' ? 'text-orange-500' : 'text-gray-400'}`}></i>
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product Details
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => handleSort('amount')}
                >
                  <div className="flex items-center gap-2">
                    Amount
                    <i className={`fas fa-sort text-xs ${sortField === 'amount' ? 'text-orange-500' : 'text-gray-400'}`}></i>
                  </div>
                </th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedOrders.map((order, index) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 transition-colors duration-150 group"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div>
                        <div className="font-semibold text-gray-900">#{order.id}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg flex items-center justify-center">
                        <i className="fas fa-box text-orange-600 text-sm"></i>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {order.product?.name || 'Product Name'}
                        </div>
                        <div className="text-sm text-gray-500">
                          Qty: {order.quantity || 1}
                        </div>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={order.order_status} />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-bold text-lg text-gray-900">
                      {formatCurrency(order.transaction?.amount)}
                    </div>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button 
                        className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                        title="View Details"
                      >
                        <i className="fas fa-eye text-sm"></i>
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Edit Order"
                      >
                        <i className="fas fa-edit text-sm"></i>
                      </button>
                      <button 
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                        title="Delete Order"
                      >
                        <i className="fas fa-trash text-sm"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      {filteredOrders.length > 0 && (
        <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between text-sm text-gray-600">
          <div>
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <i className="fas fa-download text-xs"></i>
              Export
            </button>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <i className="fas fa-sync-alt text-xs"></i>
              Refresh
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentOrdersTable;