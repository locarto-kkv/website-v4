// src/pages/consumer/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useConsumerDataStore } from "../../store/consumer/consumerDataStore";
import { useDataStore } from "../../store/useDataStore";
import { formatCurrency } from "../../lib/utils";
import { ConsumerListService } from "../../services/consumer/consumerListService"; // Import list service
import { ConsumerOrderService } from "../../services/consumer/consumerOrderService"; // Import order service
import { ConsumerPaymentService } from "../../services/consumer/consumerPaymentService";
import toast from "react-hot-toast"; // Import toast for notifications
import { ConsumerProfileService } from "../../services/consumer/consumerProfileService";

const CheckoutPage = () => {
  const lists = useConsumerDataStore((s) => s.lists);
  const vendorInCart = useConsumerDataStore((s) => s.vendorInCart);

  const profile = useConsumerDataStore((s) => s.profile);

  const brands = useDataStore((s) => s.brands);
  const brand = brands.find((brand) => brand.id === vendorInCart);

  const { updateList, removeFromList, clearList } = ConsumerListService;
  const navigate = useNavigate();

  // State for form data (can be used for 'Add New Address' or editing)
  const [formData, setFormData] = useState({
    email: "",
    phone_no: "",
    address_line_1: "",
    address_line_2: "",
    state: "",
    country: "",
    pincode: "",
    label: "",
  });

  const [orderData, setOrderData] = useState({
    items: "",
    payment_mode: "prepaid",
    amount: "",
    delivery_fee: "",
    delivery_date: null,
    payment_date: null,
    consumer_address_id: null,
    vendor_address_id: null,
  });

  const [bills, setBills] = useState({
    total: "",
    subtotal: "",
    deliveryFee: "",
    platformFee: "",
  });

  const [selectedAddress, setSelectedAddress] = useState(
    // profile?.address?.find((addr) => addr.default)?.id ||
    profile?.address?.[0] ?? null
  );

  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState({ text: "", type: "" }); // type: 'success' or 'error'
  const [discountAmount, setDiscountAmount] = useState(0);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Scroll to top when the component mounts
    window.scrollTo(0, 0);

    const subtotal = lists?.cart?.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
      0
    );

    // const deliveryFee = subtotal > 0 && subtotal < 500 ? 49 : 0;
    // const platformFee = subtotal > 0 ? 5 : 0;
    const deliveryFee = 0;
    const platformFee = 0;

    const totalBeforeDiscount = subtotal + deliveryFee + platformFee;
    const total = Math.max(0, totalBeforeDiscount - discountAmount);
    // const total = subtotal;

    const items = lists?.cart?.map((product) => ({
      product_id: product.id,
      quantity: product.quantity,
    }));

    setOrderData((prev) => ({
      ...prev,
      amount: subtotal,
      items,
      delivery_fee: deliveryFee,
    }));
    setBills((prev) => ({
      ...prev,
      total,
      deliveryFee,
      platformFee,
      subtotal,
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setShowNewAddressForm(false);
  };

  const handleAddNewAddress = () => {
    setFormData((prev) => ({
      ...prev,
      email: "",
      phone_no: "",
      address_line_1: "",
      address_line_2: "",
      country: "",
      state: "",
      pincode: "",
      label: "",
    }));
    setSelectedAddress(null);
    setShowNewAddressForm(true);
  };

  const handleSaveNewAddress = async (e) => {
    e.preventDefault();

    const { address, ...profile2 } = profile;

    toast.loading("Saving Address...");
    const updatedProfile = await ConsumerProfileService.updateProfile({
      profile: profile2,
      address: formData,
    });

    useConsumerDataStore.setState((state) => ({
      ...state,
      profile: updatedProfile,
    }));
    setSelectedAddress(
      updatedProfile.address[updatedProfile.address.length - 1]
    );
    setShowNewAddressForm(false);

    toast.dismiss();
    toast.success("Address Saved");
  };

  const handleQuantityChange = async (productId, delta) => {
    const currentItem = lists?.cart.find(
      (item) => (item.id || item.product_id) === productId
    );
    if (!currentItem) return;

    const currentQty = Number(currentItem.quantity) || 0;
    const newQty = Math.max(0, currentQty + delta); // Ensure quantity doesn't go below 0

    try {
      if (newQty === 0) {
        // If new quantity is 0, remove the item
        const newList = await removeFromList("cart", productId);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
          vendorInCart: newList.cart ? state.vendorInCart : null,
        }));
        toast.success(`${currentItem.name || "Item"} removed from cart`);
      } else {
        // Otherwise, update the quantity
        const newList = await updateList("cart", newQty, productId);
        useConsumerDataStore.setState((state) => ({
          ...state,
          lists: { ...newList },
        }));
      }
    } catch (err) {
      console.error("Error updating cart quantity:", err);
      toast.error("Could not update cart quantity.");
    }
  };

  const handleRemoveItem = async (productId, productName) => {
    try {
      const newList = await removeFromList("cart", productId);
      useConsumerDataStore.setState((state) => ({
        ...state,
        lists: { ...newList },
        vendorInCart: newList.cart ? state.vendorInCart : null,
      }));
      toast.success(`${productName || "Item"} removed from cart`);
    } catch (err) {
      console.error("Error removing item from cart:", err);
      toast.error("Could not remove item from cart.");
    }
  };

  const handleApplyPromo = () => {
    // --- Placeholder Promo Logic ---
    const code = promoCode.trim().toUpperCase();
    if (code === "LOCARTO10") {
      const calculatedDiscount = bills.subtotal * 0.1; // 10% discount
      setDiscountAmount(calculatedDiscount);
      setPromoMessage({
        text: `Applied! You saved ${formatCurrency(calculatedDiscount)}.`,
        type: "success",
      });
      toast.success("Promo code applied!");
    } else if (code) {
      setDiscountAmount(0); // Reset discount if code is invalid
      setPromoMessage({ text: "Invalid promo code.", type: "error" });
      toast.error("Invalid promo code.");
    } else {
      setDiscountAmount(0); // Reset discount if input is empty
      setPromoMessage({ text: "", type: "" });
    }
    // --- End Placeholder Promo Logic ---
  };

  const openRazorpay = (options) => {
    return new Promise((resolve, reject) => {
      const rzp = new window.Razorpay({
        ...options,
        handler: function (response) {
          resolve({ status: "success", response });
        },
        modal: {
          ondismiss: function () {
            reject({ status: "closed" }); // User closed the popup
          },
        },
      });

      rzp.on("payment.failed", function (response) {
        reject(response.error); // Payment failed
      });

      rzp.open();
    });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (!selectedAddress && !showNewAddressForm) {
      toast.error("Please select or add a delivery address.");
      return;
    }
    if (showNewAddressForm) {
      toast.error("Please save the new address before placing the order.");
      return;
    }

    if (orderData.payment_mode === "prepaid") {
      try {
        toast.loading("Redirecting to payment...");

        const options = await ConsumerPaymentService.initiatePayment(
          profile,
          orderData
        );

        try {
          var paymentResponse = await openRazorpay(options);

          if (paymentResponse.status === "success") {
            toast.dismiss();
            toast.loading("Verifying Payment...");
          }
        } catch (err) {
          setLoading(false);
          toast.dismiss();

          setTimeout(() => {
            if (err.status === "closed") {
              toast.error("Payment cancelled.");
            } else if (err.status === "failed") {
              toast.error("Payment failed. Try again.");
            }
          }, 200);
          return;
        }

        const verify = await ConsumerPaymentService.validatePayment(
          paymentResponse.response
        );

        toast.dismiss();

        if (!verify.success) {
          setTimeout(() => {
            toast.error("Payment verification failed.");
          }, 200);
          return;
        }

        setTimeout(() => {
          toast.success("Payment successful!");
        }, 200);

        var date = new Date();

        orderData.payment_date = date.toISOString();
      } catch (error) {
        console.error("Order placement error:", error);
        toast.error("Failed to place order. Please try again.");
        return;
      } finally {
        toast.dismiss();
        setLoading(false);
      }
    }

    const order = {
      ...orderData,
      consumer_address_id: selectedAddress.id,
      vendor_address_id: brand?.address[0]?.id,
      address: selectedAddress,
    };

    console.log(order);

    const updatedOrders = await ConsumerOrderService.placeOrder(order);
    await clearList("cart");

    useConsumerDataStore.setState((state) => ({
      ...state,
      lists: { wishlist: state.lists.wishlist },
      orders: updatedOrders,
    }));

    toast.success("Order placed successfully!");

    const currOrderId = updatedOrders[updatedOrders.length - 1].id;

    navigate(`/consumer/track-order/${currOrderId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24 max-w-7xl">
        <div className="mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
          >
            <i className="fas fa-arrow-left text-sm"></i>
            <span className="font-medium text-sm">Back</span>
          </button>
        </div>
        {!lists?.cart ? (
          // Empty Cart Message (Keep as is)
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center max-w-2xl mx-auto mt-10">
            <div className="relative inline-block mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto">
                <i className="fas fa-shopping-cart text-4xl sm:text-5xl text-orange-500"></i>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation text-white text-sm"></i>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
              Your Cart is Empty
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto">
              Looks like you haven't added any items yet. Start shopping!
            </p>
            <Link
              to="/map" // Link to map page or wherever shopping starts
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
            >
              <i className="fas fa-store"></i>
              Browse Stores
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-6 sm:gap-8">
            {/* --- TOP: Order Summary Section --- */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <i className="fas fa-receipt text-white text-sm sm:text-base"></i>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Order Summary
                </h2>
              </div>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Items List (Interactive) */}
                <div className="flex-shrink-0 md:max-w-md lg:max-w-lg w-full">
                  {/* Adjusted max-width */}
                  <h4 className="font-semibold text-gray-800 mb-3 text-base">
                    Items in Cart ({lists?.cart?.length})
                  </h4>
                  {/* Make this section taller and scrollable */}
                  <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 border rounded-lg p-3 bg-gray-50/50">
                    {lists?.cart?.map((item) => {
                      const itemId = item.id || item.product_id; // Handle potential differences in ID field name
                      return (
                        <div
                          key={itemId}
                          className="flex items-center gap-3 text-xs border-b pb-3 last:border-b-0"
                        >
                          <img
                            src={
                              item.product_images?.[0]?.url ||
                              "https://placehold.co/60x60/e2e8f0/e2e8f0?text=IMG"
                            }
                            alt={item.name}
                            className="w-12 h-12 object-cover rounded flex-shrink-0 border"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-700 truncate text-sm">
                              {item.name}
                            </p>
                            <p className="text-gray-500 text-xs">
                              {formatCurrency(item.price)} ea.
                            </p>
                            {/* --- Interactive Quantity --- */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <button
                                onClick={() => handleQuantityChange(itemId, -1)}
                                className="w-5 h-5 flex items-center justify-center text-xs bg-gray-200 text-gray-700 rounded hover:bg-red-500 hover:text-white transition-colors disabled:opacity-50"
                                disabled={item.quantity <= 0} // Disable if 0, logic handles removal
                                aria-label={`Decrease quantity of ${item.name}`}
                              >
                                <i className="fas fa-minus"></i>
                              </button>
                              <span className="w-5 text-center font-semibold text-gray-800 text-sm">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(itemId, 1)}
                                className="w-5 h-5 flex items-center justify-center text-xs bg-gray-200 text-gray-700 rounded hover:bg-green-500 hover:text-white transition-colors"
                                aria-label={`Increase quantity of ${item.name}`}
                              >
                                <i className="fas fa-plus"></i>
                              </button>
                            </div>
                            {/* --- End Interactive Quantity --- */}
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <p className="font-semibold text-gray-800 text-sm">
                              {formatCurrency(
                                (item.price || 0) * (item.quantity || 0)
                              )}
                            </p>
                            {/* --- Remove Button --- */}
                            <button
                              onClick={() =>
                                handleRemoveItem(itemId, item.name)
                              }
                              className="text-red-500 hover:text-red-700 text-xs font-medium"
                              aria-label={`Remove ${item.name}`}
                            >
                              Remove
                            </button>
                            {/* --- End Remove Button --- */}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="hidden md:block w-px bg-gray-200 self-stretch"></div>

                {/* Bill Details & Promo */}
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 mb-3 text-base">
                    Bill Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    {/* ... existing bill details ... */}
                    <div className="flex justify-between text-gray-600">
                      <span>Item Total</span>
                      <span>{formatCurrency(bills.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Delivery Fee</span>
                      <span>
                        {bills.deliveryFee > 0 ? (
                          formatCurrency(bills.deliveryFee)
                        ) : (
                          <span className="text-green-600 font-medium">
                            FREE
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Platform Fee</span>
                      <span>{formatCurrency(bills.platformFee)}</span>
                    </div>

                    {/* --- Promo Code Input --- */}
                    <div className="pt-3 border-t">
                      <label
                        htmlFor="promoCode"
                        className="block text-xs font-medium text-gray-500 mb-1"
                      >
                        Apply Promo Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          id="promoCode"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value)}
                          placeholder="Enter code"
                          className="flex-1 checkout-input !py-1.5 !text-xs hover:cursor-not-allowed"
                          disabled
                        />
                        <button
                          type="button"
                          onClick={handleApplyPromo}
                          className="px-3 py-1.5 bg-orange-500 text-white rounded-lg font-semibold text-xs transition-colors hover:cursor-not-allowed"
                          disabled
                        >
                          Apply
                        </button>
                      </div>
                      {promoMessage.text && (
                        <p
                          className={`mt-1 text-xs font-medium ${
                            promoMessage.type === "success"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {promoMessage.text}
                        </p>
                      )}
                    </div>
                    {/* --- End Promo Code Input --- */}

                    {/* Discount Line */}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-medium">
                        <span>Discount Applied</span>
                        <span>- {formatCurrency(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-base font-bold pt-3 border-t mt-3">
                      <span className="text-gray-900">Total</span>
                      <span className="text-lg text-orange-600">
                        {formatCurrency(bills.total)}
                        {/* Total now includes discount */}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* --- END: Order Summary Section --- */}

            {/* --- BOTTOM: Address and Payment Side-by-Side (Keep as is) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Grid for bottom sections */}
              {/* --- Address Section (Keep as is) --- */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 h-fit">
                {/* Added h-fit */}
                {/* ... Address content ... */}
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <i className="fas fa-map-marker-alt text-white text-sm sm:text-base"></i>
                    </div>
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                      Delivery Address
                    </h2>
                  </div>
                  {!showNewAddressForm && (
                    <button
                      onClick={handleAddNewAddress}
                      className="text-xs sm:text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
                    >
                      <i className="fas fa-plus text-xs"></i> Add New
                    </button>
                  )}
                </div>
                {!showNewAddressForm && profile.address?.length > 0 && (
                  <div className="space-y-3 mb-5">
                    {profile.address?.map((addr) => {
                      return (
                        <div
                          key={addr.id}
                          onClick={() => handleAddressSelect(addr)}
                          className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-start gap-3 ${
                            selectedAddress.id === addr.id
                              ? "border-orange-500 bg-orange-50 ring-2 ring-orange-200 shadow-md"
                              : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="radio"
                            name="addressSelection"
                            id={`addr-radio-${addr.id}`}
                            checked={selectedAddress.id === addr.id}
                            onChange={() => handleAddressSelect(addr)}
                            className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500 mt-1 flex-shrink-0"
                          />
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                              <label
                                htmlFor={`addr-radio-${addr.id}`}
                                className="font-semibold text-gray-800 text-sm cursor-pointer"
                              >
                                {addr.label || "Address"}
                              </label>
                            </div>
                            <p className="text-gray-600 text-xs">{`${
                              addr.address_line_1
                            }${
                              addr.address_line_2
                                ? ", " + addr.address_line_2
                                : ""
                            }, ${addr.country}, ${addr.pincode}`}</p>
                            <p className="text-gray-600 text-xs mt-1">
                              Contact: {addr.phone_no}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {showNewAddressForm && (
                  <form
                    onSubmit={handleSaveNewAddress}
                    className="space-y-4 border-t border-gray-200 pt-5"
                  >
                    <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                      Enter New Address Details
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <input
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        className="checkout-input"
                        type="email"
                      />
                      <input
                        name="phone_no"
                        value={formData.phone_no}
                        onChange={handleInputChange}
                        placeholder="Phone Number *"
                        required
                        className="checkout-input"
                        type="tel"
                      />
                    </div>
                    <input
                      name="address_line_1"
                      value={formData.address_line_1}
                      onChange={handleInputChange}
                      placeholder="Address Line 1 (House No, Building, Street, Area) *"
                      required
                      className="checkout-input"
                    />
                    <input
                      name="address_line_2"
                      value={formData.address_line_2}
                      onChange={handleInputChange}
                      placeholder="Address Line 2 (Landmark, etc.) (Optional)"
                      className="checkout-input"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <input
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="State *"
                        required
                        className="checkout-input"
                      />
                      <input
                        name="country"
                        value={formData.country}
                        onChange={handleInputChange}
                        placeholder="Country *"
                        required
                        className="checkout-input"
                      />
                      <input
                        type="number"
                        name="pincode"
                        value={formData.pincode}
                        onChange={handleInputChange}
                        placeholder="Pincode *"
                        required
                        className="checkout-input"
                      />
                    </div>
                    <input
                      name="label"
                      value={formData.label || ""}
                      onChange={handleInputChange}
                      placeholder="Save as (e.g., Home, Work)"
                      required
                      className="checkout-input"
                    />

                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowNewAddressForm(false)}
                        className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}
              </div>
              {/* --- End Address Section --- */}
              {/* --- Payment Section --- */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 h-fit">
                {/* Added h-fit */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fas fa-credit-card text-white text-sm sm:text-base"></i>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                    Payment
                  </h2>
                </div>
                <div className="space-y-3">
                  {/* ... payment options ... */}
                  <div className="p-3 sm:p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        id="pay-card"
                        onClick={() =>
                          setOrderData((prev) => ({
                            ...prev,
                            payment_mode: "prepaid",
                          }))
                        }
                        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <label
                        htmlFor="pay-card"
                        className="font-medium text-sm text-gray-700"
                      >
                        Credit/Debit Card
                      </label>
                    </div>
                    <div className="flex gap-1.5 text-xl text-gray-400">
                      <i className="fab fa-cc-visa"></i>
                      <i className="fab fa-cc-mastercard"></i>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        id="pay-upi"
                        onClick={() =>
                          setOrderData((prev) => ({
                            ...prev,
                            payment_mode: "prepaid",
                          }))
                        }
                        defaultChecked
                        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <label
                        htmlFor="pay-upi"
                        className="font-medium text-sm text-gray-700"
                      >
                        UPI
                      </label>
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        id="pay-cod"
                        onClick={() =>
                          setOrderData((prev) => ({
                            ...prev,
                            payment_mode: "cod",
                          }))
                        }
                        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"
                      />
                      <label
                        htmlFor="pay-cod"
                        className="font-medium text-sm text-gray-700"
                      >
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSubmitOrder}
                  disabled={loading}
                  className={`w-full mt-6 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-3 sm:py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    !selectedAddress || showNewAddressForm || loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:shadow-2xl hover:scale-105"
                  }`}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      Placing Order...
                    </>
                  ) : orderData.payment_mode === "cod" ? (
                    <>
                      <i className="fas fa-lock"></i>
                      Place Order
                    </>
                  ) : (
                    <>
                      <i className="fas fa-money-bill"></i>
                      Proceed to Pay
                    </>
                  )}
                </button>
              </div>
              {/* --- End Payment Section --- */}
            </div>
            {/* --- END: Bottom Sections --- */}
          </div>
          // --- END NEW LAYOUT ---
        )}
      </main>
      <Footer />
      {/* Add CSS for input styling and scrollbar */}
      <style>{`
            .checkout-input {
                width: 100%;
                padding: 0.75rem 1rem; /* 12px 16px */
                border: 1px solid #D1D5DB; /* border-gray-300 */
                border-radius: 0.5rem; /* rounded-lg */
                font-size: 0.875rem; /* text-sm */
                line-height: 1.25rem;
                transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
            }
            .checkout-input:focus {
                outline: none;
                border-color: #F97316; /* border-orange-500 */
                box-shadow: 0 0 0 2px rgba(249, 115, 22, 0.3); /* ring-2 ring-orange-200 */
            }
            .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #cbd5e1 #f8fafc; }
            .custom-scrollbar::-webkit-scrollbar { width: 5px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #f8fafc; border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; border: 1px solid #f8fafc; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: #94a3b8; }
       `}</style>
    </div>
  );
};

export default CheckoutPage;
