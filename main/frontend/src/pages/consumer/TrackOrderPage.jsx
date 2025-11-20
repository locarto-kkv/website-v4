// Modified OrderPlacedPage for navigate (`/consumer/track-order/${currOrderId}`)

import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { formatCurrency, formatDate } from "../../lib/utils";
import { useConsumerDataStore } from "../../store/consumer/consumerDataStore";
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService";

// Order Stepper for per-item order status
const OrderTracker = ({ status }) => {
  const steps = ["pending", "confirmed", "shipped", "delivered"];
  const currentStepIndex = steps.indexOf((status || "").toLowerCase());

  return (
    <div className="flex items-center justify-between w-full max-w-2xl mx-auto my-6">
      {steps.map((step, index) => {
        const isActive = currentStepIndex !== -1 && index <= currentStepIndex;
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
                      : step === "confirmed"
                      ? "fa-cog"
                      : step === "shipped"
                      ? "fa-shipping-fast"
                      : "fa-check-circle"
                  } ${isActive ? "text-white" : "text-gray-500"}`}
                />
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
                }
                `}
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

  // Derived booleans
  const allCancelled = order?.items?.length
    ? order.items.every(
        (it) => (it.order_status || "").toLowerCase() === "cancelled"
      )
    : false;

  const refundInProcess = order?.items?.some(
    (it) => (it.payment_status || "").toLowerCase() === "refunding"
  );

  const allDelivered = order?.items?.length
    ? order.items.every(
        (it) => (it.order_status || "").toLowerCase() === "delivered"
      )
    : false;

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
      const updatedOrders = await ConsumerOrderService.cancelOrderItem(itemId);

      useConsumerDataStore.setState((state) => ({
        ...state,
        orders: updatedOrders,
      }));
      toast.dismiss();
      toast.success("Item cancelled successfully.");
    } catch (error) {
      console.log(error);
      toast.dismiss();
      toast.error("Failed to cancel item.");
    }
  };

  // Overall order status for header badge
  const firstStatus = (order.items[0]?.order_status || "pending").toLowerCase();

  let statusLabel = "Pending";
  let statusClasses = "bg-yellow-100 text-yellow-800 border-yellow-200";
  let statusIcon = "fa-clock";

  if (allCancelled) {
    statusLabel = "Cancelled";
    statusClasses = "bg-red-100 text-red-800 border-red-200";
    statusIcon = "fa-times-circle";
  } else if (allDelivered) {
    statusLabel = "Delivered";
    statusClasses = "bg-green-100 text-green-800 border-green-200";
    statusIcon = "fa-check-circle";
  } else if (refundInProcess) {
    statusLabel = "Refund in Process";
    statusClasses = "bg-blue-100 text-blue-800 border-blue-200";
    statusIcon = "fa-hourglass-half";
  } else {
    switch (firstStatus) {
      case "confirmed":
        statusLabel = "Confirmed";
        statusClasses = "bg-blue-100 text-blue-800 border-blue-200";
        statusIcon = "fa-cog";
        break;
      case "shipped":
        statusLabel = "Shipped";
        statusClasses = "bg-purple-100 text-purple-800 border-purple-200";
        statusIcon = "fa-shipping-fast";
        break;
      case "delivered":
        statusLabel = "Delivered";
        statusClasses = "bg-green-100 text-green-800 border-green-200";
        statusIcon = "fa-check-circle";
        break;
      default:
        break;
    }
  }

  // Icon + circle styling for header (blue hourglass for processing/refunding)
  const headerCircleClasses = allCancelled
    ? "bg-red-100 border-red-300"
    : refundInProcess || !allDelivered
    ? "bg-blue-100 border-blue-300"
    : "bg-gradient-to-br from-green-500 to-emerald-500 border-emerald-200";

  const headerIconClasses = allCancelled
    ? "fa-times text-red-600"
    : refundInProcess || !allDelivered
    ? "fa-hourglass-half text-blue-600"
    : "fa-check text-white";

  const renderPaymentStatusBadge = (paymentStatusRaw) => {
    const key = (paymentStatusRaw || "").toLowerCase();
    let label = paymentStatusRaw || "Unknown";
    let classes = "bg-gray-100 text-gray-700 border-gray-200";

    switch (key) {
      case "pending":
        label = "Pending";
        classes = "bg-yellow-100 text-yellow-800 border-yellow-200";
        break;
      case "paid":
        label = "Paid";
        classes = "bg-green-100 text-green-800 border-green-200";
        break;
      case "cancelled":
        label = "Cancelled";
        classes = "bg-gray-100 text-gray-700 border-gray-200";
        break;
      case "refunded":
        label = "Refunded";
        classes = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      case "refunding":
        label = "Refund in process";
        classes = "bg-blue-100 text-blue-800 border-blue-200";
        break;
      default:
        break;
    }

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${classes}`}
      >
        {label}
      </span>
    );
  };

  const canCancelStatus = (status) => {
    const s = (status || "").toLowerCase();
    return s === "pending" || s === "confirmed";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg border-4 ${headerCircleClasses}`}
            >
              <i className={`fas text-4xl ${headerIconClasses}`} />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-1">
              {allCancelled
                ? "Order Cancelled"
                : allDelivered
                ? "Order Delivered"
                : refundInProcess
                ? "Refund in Process"
                : "Your Order is being Processed"}
            </h1>
            <p className="text-gray-600 text-sm">Order ID #{order.id}</p>
            <p className="text-gray-600 text-sm">
              Placed on: {formatDate(order.created_at)}
            </p>
            <p className="mt-2 text-sm">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${statusClasses}`}
              >
                <i className={`fas ${statusIcon} mr-1.5`} />
                {statusLabel}
              </span>
            </p>
          </div>

          {/* Items + Delivery Date */}
          <section className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
              <h2 className="text-xl font-bold text-gray-800">Items Ordered</h2>
              {order.delivery_date && (
                <p className="text-lg font-semibold text-gray-800">
                  Expected Delivery: {formatDate(order.delivery_date)}
                </p>
              )}
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
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <span className="uppercase tracking-wide">
                          Payment:
                        </span>
                        {renderPaymentStatusBadge(item.payment_status)}
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <p className="font-semibold text-gray-800">
                        {formatCurrency(item.price)}
                      </p>
                    </div>
                  </div>

                  {/* Tracker per item */}
                  <OrderTracker status={item.order_status} />

                  {/* Actions under each item */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    {canCancelStatus(item.order_status) && (
                      <button
                        onClick={() => handleCancelOrder(item.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 shadow"
                      >
                        <i className="fas fa-times-circle" /> Cancel Order
                      </button>
                    )}

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
    </div>
  );
};

export default OrderPlacedPage;
