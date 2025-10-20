// src/pages/vendor/dashboard/VendorOrders.jsx
import React, { useState } from 'react';
import { useVendorData } from '../../../context/vendor/vendorDataContext'; // Import context
import { formatCurrency, formatDate, getOrderStatusConfig } from '../../../lib/utils'; // Import utils

// Status Badge Component (copied from RecentOrdersTable for consistency)
const StatusBadge = ({ status }) => {
  const config = getOrderStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
    >
      <i className={`${config.icon} text-xs`}></i>
      {config.label}
    </span>
  );
};

const VendorOrders = () => {
  const { orders, dataLoading } = useVendorData(); // Get orders from context
  const [filterStatus, setFilterStatus] = useState('all'); // State for filtering

  if (dataLoading) {
    return <div className="p-6 text-center">Loading orders...</div>;
  }

  // Filter orders based on selected status
  const filteredOrders = orders.filter(order =>
    filterStatus === 'all' || order.order_status?.toLowerCase() === filterStatus
  );

  // Status options for filtering
   const statusFilters = ['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];


  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          
          
        </div>
         {/* Add other header actions if needed, e.g., Export button */}
      </div>

      {/* Filter Controls */}
       <div className="mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
         <label htmlFor="statusFilter" className="mr-3 font-medium text-gray-700">Filter by Status:</label>
         <select
           id="statusFilter"
           value={filterStatus}
           onChange={(e) => setFilterStatus(e.target.value)}
           className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
         >
           {statusFilters.map(status => (
             <option key={status} value={status}>
               {status.charAt(0).toUpperCase() + status.slice(1)}
             </option>
           ))}
         </select>
       </div>


      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <i className="fas fa-inbox text-4xl mb-4 text-gray-300"></i>
              <p>No orders found matching this status.</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Sr.No</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Order details</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Customer details</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Qty</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Value</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Delivery Note</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div>#{order.id}</div>
                        <div className='text-xs text-gray-500'>{order.product?.name || 'N/A'}</div>
                        <div className="text-xs text-gray-500">{formatDate(order.created_at)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {/* Assuming customer details are nested or fetched separately */}
                        <div>{order.customer?.name || 'Customer Name'}</div>
                        <div className="text-xs text-gray-500">{order.customer?.email || 'customer@example.com'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.quantity || 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatCurrency(order.amount)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                       <StatusBadge status={order.order_status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {/* Placeholder for Delivery Note - Add logic to display/link file */}
                      {order.deliveryNote ? (
                        <a href={order.deliveryNoteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">View Note</a>
                      ) : (
                        '-'
                      )}
                    </td>
                     <td className="px-6 py-4 whitespace-nowrap">
                        {/* Add action buttons like View Details, Update Status etc. */}
                        <button
                          className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
                          title="View Details"
                          // onClick={() => handleViewDetails(order.id)} // Add handler
                        >
                          <i className="fas fa-eye text-sm"></i>
                        </button>
                         {/* Add more buttons as needed */}
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
         {/* Optional: Add Pagination Controls */}
      </div>
    </div>
  );
};

export default VendorOrders;