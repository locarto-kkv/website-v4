import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { formatCurrency, formatDate } from '../../lib/utils';
import { ConsumerOrderService } from '../../services/consumer/consumerOrderService';
import toast from 'react-hot-toast';

// Reusable Status Badge Component
const StatusBadge = ({ status }) => {
  let config = { color: 'bg-gray-100 text-gray-800', icon: 'fas fa-question-circle', label: 'Unknown' };
  switch (status?.toLowerCase()) {
    case 'pending':
      config = { color: 'bg-yellow-100 text-yellow-800', icon: 'fas fa-clock', label: 'Pending' };
      break;
    case 'processing':
      config = { color: 'bg-blue-100 text-blue-800', icon: 'fas fa-cog', label: 'Processing' };
      break;
    case 'shipped':
      config = { color: 'bg-purple-100 text-purple-800', icon: 'fas fa-shipping-fast', label: 'Shipped' };
      break;
    case 'delivered':
      config = { color: 'bg-green-100 text-green-800', icon: 'fas fa-check-circle', label: 'Delivered' };
      break;
    case 'cancelled':
      config = { color: 'bg-red-100 text-red-800', icon: 'fas fa-times-circle', label: 'Cancelled' };
      break;
  }
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${config.color}`}
    >
      <i className={`${config.icon} text-xs`}></i>
      {config.label}
    </span>
  );
};

// Order Tracking Stepper
const OrderTracker = ({ status }) => {
  const steps = ['pending', 'processing', 'shipped', 'delivered'];
  const currentStepIndex = steps.indexOf(status?.toLowerCase());

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto my-6">
      {steps.map((step, index) => {
        const isActive = index <= currentStepIndex;
        const isCurrent = index === currentStepIndex;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300
                  ${isActive ? 'bg-orange-500 border-orange-200' : 'bg-gray-200 border-gray-300'}
                  ${isCurrent ? 'ring-4 ring-orange-500 ring-opacity-50' : ''}
                `}
              >
                <i
                  className={`fas ${
                    step === 'pending' ? 'fa-clock' :
                    step === 'processing' ? 'fa-cog' :
                    step === 'shipped' ? 'fa-shipping-fast' :
                    'fa-check-circle'
                  } ${isActive ? 'text-white' : 'text-gray-500'}`}
                ></i>
              </div>
              <p
                className={`mt-2 text-xs font-semibold uppercase ${
                  isActive ? 'text-orange-600' : 'text-gray-500'
                }`}
              >
                {step}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1.5 mx-2 rounded-full ${
                  isActive ? 'bg-orange-500' : 'bg-gray-300'
                }`}
              ></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const OrderPlacedPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    window.scrollTo(0, 0);
    // If no order data is passed, redirect to homepage or orders page
    if (!order) {
      navigate('/consumer/dashboard/orders');
    }
  }, [order, navigate]);

  if (!order) {
    return null; // Render nothing while redirecting
  }

  // Handle order cancellation
  const handleCancelOrder = async () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      try {
        toast.loading('Cancelling order...');
        await ConsumerOrderService.cancelOrder(order.id);
        toast.dismiss();
        toast.success('Order cancelled successfully.');
        // Navigate to the main orders page after cancellation
        navigate('/consumer/dashboard/orders');
      } catch (error) {
        toast.dismiss();
        toast.error(error.response?.data?.message || 'Failed to cancel order.');
      }
    }
  };

  // Handle contact support
  const handleContactSupport = () => {
    navigate('/consumer/dashboard/support');
  };

  const {
    subtotal,
    deliveryFee,
    platformFee,
    gstAndRestaurantCharges,
    discountAmount,
    total
  } = order.billDetails || {};

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
          
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-check text-white text-4xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              Order Placed Successfully!
            </h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order is being processed.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Order ID: <span className="font-semibold text-gray-700">#ORD{order.id}</span>
            </p>
            <p className="text-sm text-gray-500">
              Placed On: <span className="font-semibold text-gray-700">{formatDate(order.created_at)}</span>
            </p>
          </div>

          {/* Order Tracking */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">Order Status</h2>
            <OrderTracker status={order.order_status} />
          </section>

          {/* Items Ordered */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Items Ordered</h2>
            <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 border rounded-lg p-3 bg-gray-50/50">
              {order.products.map((item) => (
                <div key={item.product_id || item.id} className="flex items-center gap-4">
                  <img
                    src={item.product_images?.[0]?.url || "https://placehold.co/80x80/e2e8f0/e2e8f0?text=IMG"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0 border"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatCurrency(item.price * item.quantity)}</p>
                    <p className="text-xs text-gray-500">({formatCurrency(item.price)} ea.)</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Order Bill */}
          {order.billDetails && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Bill Details</h2>
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-gray-800">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-gray-800">{formatCurrency(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee</span>
                  <span className="font-medium text-gray-800">{formatCurrency(platformFee)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST & Restaurant Charges</span>
                  <span className="font-medium text-gray-800">{formatCurrency(gstAndRestaurantCharges)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">- {formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-xl text-gray-900">
                    <span>Total Paid</span>
                    <span className="text-orange-600">{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <section className="border-t pt-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleContactSupport}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
              >
                <i className="fas fa-headset"></i> Contact Support
              </button>
              {order.order_status?.toLowerCase() === 'pending' && (
                <button
                  onClick={handleCancelOrder}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  <i className="fas fa-times-circle"></i> Cancel Order
                </button>
              )}
            </div>
          </section>

        </div>
      </main>
      <Footer />
      <style>{`
        .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; border: 1px solid #f8fafc; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
      `}</style>
    </div>
  );
};

export default OrderPlacedPage;