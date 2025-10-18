// src/pages/consumer/dashboard/CustomerOrders.jsx
import React from "react";
import { useConsumerData } from "../../../context/consumer/consumerDataContext"; // Adjust path if needed
// Import utility functions if needed (assuming they are in lib/utils.js)
// import { formatCurrency, formatDate } from "../../../lib/utils"; // Uncomment if used

const CustomerOrders = () => {
  const { orders } = useConsumerData(); // Get orders data from context

  // Helper to format currency (or import from utils)
  const formatCurrency = (amount) => {
     if (amount === undefined || amount === null) return '₹ N/A';
     return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        minimumFractionDigits: 0, // Adjust as needed
        maximumFractionDigits: 0, // Adjust as needed
     }).format(amount);
  };

   // Helper to format date (or import from utils)
   const formatDate = (dateString) => {
     if (!dateString) return 'N/A';
     try {
         return new Date(dateString).toLocaleDateString('en-IN', {
             day: 'numeric',
             month: 'short',
             year: 'numeric'
         });
     } catch (e) {
         console.error("Error formatting date:", dateString, e);
         return 'Invalid Date';
     }
  };


  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      {/* Title is handled by the layout, so we don't repeat it here */}
      {/* <h2 className="text-2xl font-bold text-gray-900 mb-6">All Orders</h2> */}

      {!(orders?.length > 0) ? (
         <div className="text-center py-12 text-gray-500">
            <i className="fas fa-box-open text-4xl mb-4 text-gray-300"></i>
            <p>You haven't placed any orders yet.</p>
         </div>
      ) : (
         <div className="space-y-4">
           {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
              <div className="flex items-start gap-4 flex-col sm:flex-row"> {/* Make flex column on small screens */}
                <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 self-center sm:self-start"> {/* Center image on small screens */}
                  <img
                    src={order.product?.image || 'https://via.placeholder.com/100'}
                    alt={order.product?.name || 'Product Image'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 w-full"> {/* Ensure text takes full width */}
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-2">
                    <div className="mb-2 sm:mb-0">
                      <h3 className="font-bold text-lg text-gray-900">{order.product?.name || 'Product Name'}</h3>
                      <p className="text-sm text-gray-500">Order #{order.id} • {formatDate(order.date)}</p>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                      order.status === "delivered" ? "bg-green-100 text-green-800" :
                      order.status === "shipped" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }`}>
                      {order.status ? (order.status.charAt(0).toUpperCase() + order.status.slice(1)) : 'Status Unknown'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
                    <div className="mb-3 sm:mb-0">
                      <p className="text-gray-600">Quantity: {order.quantity || 1}</p>
                      <p className="text-xl font-bold text-gray-900">{formatCurrency((order.product?.price || 0) * (order.quantity || 1))}</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto"> {/* Buttons stack on small screens */}
                      <button className="flex-1 sm:flex-none px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-sm transition-colors">
                        Track Order
                      </button>
                      {order.status === "delivered" && (
                        <button className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                          Write Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
           ))}
         </div>
      )}
    </div>
  );
};

export default CustomerOrders;