// Modified OrderPlacedPage for navigate (`/consumer/track-order/${currOrderId}`)

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useConsumerDataStore } from "../../store/consumer/consumerDataStore";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService";

// Order Stepper
const OrderTracker = ({ status }) => {
  const steps = ["pending", "processing", "shipped", "delivered"];
  const currentStepIndex = steps.indexOf((status || "").toLowerCase());

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto my-6">
      {steps.map((step, index) => {
        const isActive =
          currentStepIndex !== -1 ? index <= currentStepIndex : false;
        const isCurrent = index === currentStepIndex;

        return (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center text-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300
                  ${
                    isActive
                      ? "bg-orange-500 border-orange-200"
                      : "bg-gray-200 border-gray-300"
                  }
                  ${isCurrent ? "ring-4 ring-orange-500 ring-opacity-50" : ""}
                `}
              >
                <i
                  className={`fas ${
                    step === "pending"
                      ? "fa-clock"
                      : step === "processing"
                      ? "fa-cog"
                      : step === "shipped"
                      ? "fa-shipping-fast"
                      : "fa-check-circle"
                  } ${isActive ? "text-white" : "text-gray-500"}`}
                ></i>
              </div>
              <p
                className={`mt-2 text-xs font-semibold uppercase ${
                  isActive ? "text-orange-600" : "text-gray-500"
                }`}
              >
                {step}
              </p>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1.5 mx-2 rounded-full ${
                  isActive ? "bg-orange-500" : "bg-gray-300"
                }`}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const OrderPlacedPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const orders = useConsumerDataStore((s) => s.orders);
  const profile = useConsumerDataStore((s) => s.profile);

  const order = orders?.find((o) => String(o.id) === String(orderId));

  const address = profile?.address?.find(
    (a) => String(a.id) === String(order?.consumer_address_id)
  );

  useEffect(() => {
    if (orders.length > 0 && !order) {
      navigate("/consumer/dashboard/orders");
    }
  }, [orders, order, navigate]);

  if (!order) return null;

  // Build ordered items directly from order object
  const orderedItems = order.items.map((item) => ({
    ...item,
    name: item.product?.name,
    price: item.product?.price,
    image: item.product?.product_images?.[0]?.url,
  }));

  const handleCancelOrder = async (itemId) => {
    if (!window.confirm("Are you sure you want to cancel this item?")) return;

    try {
      toast.loading("Cancelling item...");
      // await ConsumerOrderService.cancelOrder(order.id);
      toast.dismiss();
      toast.success("Item cancelled successfully.");
    } catch (error) {
      toast.dismiss();
      toast.error("Failed to cancel item.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <i className="fas fa-check text-white text-4xl"></i>
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
              Order #{order.id}
            </h1>
            <p className="text-gray-600 text-sm">
              Placed on: {formatDate(order.created_at)}
            </p>
          </div>

          {/* Items + Delivery Date */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
              <h2 className="text-xl font-bold text-gray-800">Items Ordered</h2>
              <p className="text-lg font-semibold text-gray-800">
                Expected Delivery:{" "}
                {order.delivery_date
                  ? formatDate(order.delivery_date)
                  : "To be updated"}
              </p>
            </div>

            <div className="space-y-6">
              {orderedItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 border rounded-xl bg-gray-50 space-y-4"
                >
                  {/* Item summary row */}
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        item.image ||
                        "https://placehold.co/80x80/e2e8f0/e2e8f0?text=IMG"
                      }
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-lg border"
                    />

                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(item.price)}
                      </p>

                      {item.order_status?.toLowerCase() === "pending" && (
                        <button
                          onClick={() => handleCancelOrder(item.id)}
                          className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-red-700 shadow"
                        >
                          <i className="fas fa-times-circle" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Tracker per item */}
                  <OrderTracker status={item.order_status} />

                  {/* Actions under each item */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={() => handleCancelOrder(item.id)}
                      className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 shadow"
                    >
                      <i className="fas fa-times-circle" /> Cancel Order
                    </button>

                    <button
                      onClick={() => navigate("/consumer/dashboard/support")}
                      className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow"
                    >
                      <i className="fas fa-headset" /> Contact Support
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Delivery Address */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Delivery Address
            </h2>
            <div className="p-5 bg-gray-50 border rounded-xl space-y-1">
              <p className="font-semibold text-gray-800">{address?.label}</p>
              <p className="text-gray-700">{address?.address_line_1}</p>
              <p className="text-gray-700">{address?.address_line_2}</p>
              <p className="text-gray-700">
                {address?.state}, {address?.country} - {address?.pincode}
              </p>
              <p className="text-gray-700">Phone: {address?.phone_no}</p>
            </div>
          </section>

          {/* Payment Details */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Payment Details
            </h2>
            <div className="p-5 bg-gray-50 border rounded-xl space-y-2">
              <div className="flex justify-between">
                <span>Payment Mode</span>
                <span className="font-medium">
                  {order.payment_mode.toUpperCase()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Items total</span>
                <span className="font-medium">
                  {formatCurrency(order.amount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium">
                  {formatCurrency(order.delivery_fee)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-xl text-gray-900">
                <span>Total</span>
                <span className="text-orange-600">
                  {formatCurrency(order.amount + order.delivery_fee)}
                </span>
              </div>
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
