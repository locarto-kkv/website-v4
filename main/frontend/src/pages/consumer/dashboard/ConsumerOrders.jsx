// src/pages/consumer/dashboard/CustomerOrders.jsx
import { useConsumerData } from "../../../context/consumer/consumerDataContext.jsx";
import { formatCurrency, formatDate } from "../../../lib/utils.js";

const CustomerOrders = () => {
  const { orders } = useConsumerData(); // Get orders data from context

  return (
    // Main container with responsive padding
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-100">
      {/* Title is handled by the layout */}

      {/* Empty state check */}
      {!(orders?.length > 0) ? (
        <div className="text-center py-12 text-gray-500">
          <i className="fas fa-box-open text-4xl mb-4 text-gray-300"></i>
          <p className="text-sm sm:text-base">You haven't placed any orders yet.</p>
        </div>
      ) : (
        // Orders list
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = {
              delivered: "bg-green-100 text-green-800",
              shipped: "bg-blue-100 text-blue-800",
              default: "bg-yellow-100 text-yellow-800",
            };
            const statusClass = statusConfig[order.status] || statusConfig.default;

            return (
              <div
                key={order.id}
                className="bg-gray-50/50 rounded-xl border border-gray-200 p-4 hover:border-orange-300 transition-colors"
              >
                {/* Header: Order Info & Status */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-200 mb-3">
                  <div>
                    <p className="font-bold text-sm text-gray-900">Order #{order.id}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
                  </div>
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${statusClass}`}
                  >
                    {order.status
                      ? order.status.charAt(0).toUpperCase() + order.status.slice(1)
                      : "Status Unknown"}
                  </span>
                </div>

                {/* Body: Image, Product Details, Price */}
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 sm:w-20 sm:h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 mx-auto sm:mx-0">
                    <img
                      src={order.product?.image || "https://placehold.co/150x150/e2e8f0/e2e8f0?text=Image"}
                      alt={order.product?.name || "Product Image"}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details & Price */}
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="font-bold text-base text-gray-900 leading-tight mb-1">
                      {order.product?.name || "Product Name"}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Qty: {order.quantity || 1}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      {formatCurrency(
                        (order.product?.price || 0) * (order.quantity || 1)
                      )}
                    </p>
                  </div>
                </div>

                {/* Footer: Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button className="flex-1 px-4 py-2 bg-white hover:bg-gray-100 rounded-lg font-semibold text-sm transition-colors border border-gray-200 text-gray-700">
                    Track Order
                  </button>
                  {order.status === "delivered" && (
                    <button className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                      Write Review
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;

