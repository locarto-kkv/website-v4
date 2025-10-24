// src/pages/consumer/CheckoutPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useConsumerData } from '../../context/consumer/consumerDataContext';
import { formatCurrency } from '../../lib/utils';
import { ConsumerListService } from '../../services/consumer/consumerListService'; // Import list service
import toast from 'react-hot-toast'; // Import toast for notifications

// --- Mock Data for Saved Addresses (Keep as is) ---
const mockSavedAddresses = [
  {
    id: 'addr1', label: 'Home', fullName: 'Jane Doe', addressLine1: '123 Main St', addressLine2: 'Apt 4B', city: 'Mumbai', state: 'Maharashtra', pincode: '400001', phone: '555-1234', isDefault: true,
  },
  {
    id: 'addr2', label: 'Work', fullName: 'Jane Doe', addressLine1: '456 Business Ave', addressLine2: 'Suite 100', city: 'Mumbai', state: 'Maharashtra', pincode: '400050', phone: '555-5678', isDefault: false,
  },
];
// --- End Mock Data ---


const CheckoutPage = () => {
  // Use fetchLists from context to refresh cart data
  const { lists, fetchLists } = useConsumerData();
  const { updateList, removeFromList } = ConsumerListService; // Destructure service methods
  const navigate = useNavigate();

  // State for form data (can be used for 'Add New Address' or editing)
  const [formData, setFormData] = useState({
    fullName: '', email: '', phone: '', addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', label: '',
    cardNumber: '', cardName: '', expiryDate: '', cvv: ''
  });

  const [savedAddresses] = useState(mockSavedAddresses);
  const [selectedAddressId, setSelectedAddressId] = useState(
    mockSavedAddresses.find(addr => addr.isDefault)?.id || mockSavedAddresses[0]?.id || null
  );
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);

  // --- State for Promo Code ---
  const [promoCode, setPromoCode] = useState('');
  const [promoMessage, setPromoMessage] = useState({ text: '', type: '' }); // type: 'success' or 'error'
  const [discountAmount, setDiscountAmount] = useState(0);
  // --- End State for Promo Code ---

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const cartItems = lists?.cart || [];

  // --- Recalculate Totals (including discount) ---
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 0),
    0
  );
  const deliveryFee = subtotal > 0 && subtotal < 500 ? 49 : 0;
  const platformFee = subtotal > 0 ? 5 : 0;
  const gstAndRestaurantCharges = subtotal * 0.18;
  // Apply discount *before* calculating the final total
  const totalBeforeDiscount = subtotal + deliveryFee + platformFee + gstAndRestaurantCharges;
  const total = Math.max(0, totalBeforeDiscount - discountAmount); // Ensure total doesn't go below 0
  // --- End Recalculate Totals ---


  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSelect = (addressId) => {
    setSelectedAddressId(addressId);
    setShowNewAddressForm(false);
  };

  const handleAddNewAddress = () => {
    setFormData(prev => ({
        ...prev, addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', label: ''
    }));
    setSelectedAddressId(null);
    setShowNewAddressForm(true);
  };

  const handleSaveNewAddress = (e) => {
      e.preventDefault();
      console.log("Saving new address:", formData);
      const newAddress = {
          id: `addr${Date.now()}`, label: formData.label || 'Other', fullName: formData.fullName, addressLine1: formData.addressLine1, addressLine2: formData.addressLine2, city: formData.city, state: formData.state, pincode: formData.pincode, phone: formData.phone, isDefault: false
      };
      mockSavedAddresses.push(newAddress);
      setSelectedAddressId(newAddress.id);
      setShowNewAddressForm(false);
      alert('New address saved (mock)!');
  };

  // --- Cart Item Interaction Handlers ---
  const handleQuantityChange = async (productId, delta) => {
    const currentItem = cartItems.find(item => (item.id || item.product_id) === productId);
    if (!currentItem) return;

    const currentQty = Number(currentItem.quantity) || 0;
    const newQty = Math.max(0, currentQty + delta); // Ensure quantity doesn't go below 0

    try {
        if (newQty === 0) {
            // If new quantity is 0, remove the item
            await removeFromList('cart', productId);
            toast.success(`${currentItem.name || 'Item'} removed from cart`);
        } else {
            // Otherwise, update the quantity
            await updateList('cart', newQty, productId);
        }
        await fetchLists(); // Refresh cart data from context
    } catch (err) {
        console.error("Error updating cart quantity:", err);
        toast.error("Could not update cart quantity.");
    }
  };

  const handleRemoveItem = async (productId, productName) => {
    if (window.confirm(`Remove ${productName || 'this item'} from your cart?`)) {
        try {
            await removeFromList('cart', productId);
            await fetchLists(); // Refresh cart data
            toast.success(`${productName || 'Item'} removed from cart`);
        } catch (err) {
            console.error("Error removing item from cart:", err);
            toast.error("Could not remove item from cart.");
        }
    }
  };
  // --- End Cart Item Handlers ---

  // --- Promo Code Handler ---
  const handleApplyPromo = () => {
      // --- Placeholder Promo Logic ---
      const code = promoCode.trim().toUpperCase();
      if (code === 'LOCARTO10') {
          const calculatedDiscount = subtotal * 0.10; // 10% discount
          setDiscountAmount(calculatedDiscount);
          setPromoMessage({ text: `Applied! You saved ${formatCurrency(calculatedDiscount)}.`, type: 'success' });
          toast.success('Promo code applied!');
      } else if (code) {
          setDiscountAmount(0); // Reset discount if code is invalid
          setPromoMessage({ text: 'Invalid promo code.', type: 'error' });
          toast.error('Invalid promo code.');
      } else {
          setDiscountAmount(0); // Reset discount if input is empty
          setPromoMessage({ text: '', type: '' });
      }
      // --- End Placeholder Promo Logic ---
  };
   // --- End Promo Code Handler ---

  const handleSubmitOrder = (e) => {
    e.preventDefault();
     if (!selectedAddressId && !showNewAddressForm) {
         alert("Please select or add a delivery address.");
         return;
     }
     if (showNewAddressForm) {
         alert("Please save the new address before placing the order.");
         return;
     }
    alert('Order placement functionality coming soon!');
    console.log("Order Data:", {
        addressId: selectedAddressId, cartItems: cartItems, total: total, discount: discountAmount, promoCode: discountAmount > 0 ? promoCode : '',
    });
  };

  const selectedAddress = savedAddresses.find(addr => addr.id === selectedAddressId);
  const displayAddressString = selectedAddress
    ? `${selectedAddress.addressLine1}${selectedAddress.addressLine2 ? ', '+selectedAddress.addressLine2 : ''}, ${selectedAddress.city}, ${selectedAddress.state} - ${selectedAddress.pincode}`
    : "No address selected";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-20 sm:pt-24 max-w-7xl">

         <div className="mb-4 sm:mb-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors">
                 <i className="fas fa-arrow-left text-sm"></i>
                 <span className="font-medium text-sm">Back</span>
             </button>
         </div>

        {cartItems.length === 0 ? (
          // Empty Cart Message (Keep as is)
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-8 sm:p-12 text-center max-w-2xl mx-auto mt-10">
            {/* ... empty cart content ... */}
             <div className="relative inline-block mb-6"> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto"> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
                <i className="fas fa-shopping-cart text-4xl sm:text-5xl text-orange-500"></i> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
                <i className="fas fa-exclamation text-white text-sm"></i> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">Your Cart is Empty</h2> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-md mx-auto"> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
              Looks like you haven't added any items yet. Start shopping! {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
            </p>
            <Link
              to="/map" // Link to map page or wherever shopping starts // [cite: src/pages/consumer/CheckoutPage.jsx]
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300" // [cite: src/pages/consumer/CheckoutPage.jsx]
            >
              <i className="fas fa-store"></i> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
              Browse Stores {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
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
                     <h2 className="text-lg sm:text-xl font-bold text-gray-800">Order Summary</h2>
                 </div>
                 <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    {/* Items List (Interactive) */}
                    <div className="flex-shrink-0 md:max-w-md lg:max-w-lg w-full"> {/* Adjusted max-width */}
                        <h4 className="font-semibold text-gray-800 mb-3 text-base">Items in Cart ({cartItems.length})</h4>
                        {/* Make this section taller and scrollable */}
                        <div className="space-y-4 max-h-60 overflow-y-auto custom-scrollbar pr-2 border rounded-lg p-3 bg-gray-50/50">
                            {cartItems.map(item => {
                                const itemId = item.id || item.product_id; // Handle potential differences in ID field name
                                return (
                                    <div key={itemId} className="flex items-center gap-3 text-xs border-b pb-3 last:border-b-0">
                                        <img
                                            src={item.product_images?.[0]?.url || 'https://placehold.co/60x60/e2e8f0/e2e8f0?text=IMG'}
                                            alt={item.name}
                                            className="w-12 h-12 object-cover rounded flex-shrink-0 border"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-gray-700 truncate text-sm">{item.name}</p>
                                            <p className="text-gray-500 text-xs">{formatCurrency(item.price)} ea.</p>
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
                                                <span className="w-5 text-center font-semibold text-gray-800 text-sm">{item.quantity}</span>
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
                                            <p className="font-semibold text-gray-800 text-sm">{formatCurrency((item.price || 0) * (item.quantity || 0))}</p>
                                             {/* --- Remove Button --- */}
                                             <button
                                                onClick={() => handleRemoveItem(itemId, item.name)}
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
                        <h4 className="font-semibold text-gray-800 mb-3 text-base">Bill Details</h4>
                        <div className="space-y-2 text-sm">
                            {/* ... existing bill details ... */}
                             <div className="flex justify-between text-gray-600">
                                <span>Item Total</span>
                                <span>{formatCurrency(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Delivery Fee</span>
                                <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : <span className="text-green-600 font-medium">FREE</span>}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Platform Fee</span>
                                <span>{formatCurrency(platformFee)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>GST & Restaurant Charges</span>
                                <span>{formatCurrency(gstAndRestaurantCharges)}</span>
                            </div>

                            {/* --- Promo Code Input --- */}
                            <div className="pt-3 border-t">
                                <label htmlFor="promoCode" className="block text-xs font-medium text-gray-500 mb-1">Apply Promo Code</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="promoCode"
                                        value={promoCode}
                                        onChange={(e) => setPromoCode(e.target.value)}
                                        placeholder="Enter code"
                                        className="flex-1 checkout-input !py-1.5 !text-xs" // Smaller input
                                    />
                                    <button
                                        type="button"
                                        onClick={handleApplyPromo}
                                        className="px-3 py-1.5 bg-orange-500 text-white rounded-lg font-semibold text-xs hover:bg-orange-600 transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoMessage.text && (
                                    <p className={`mt-1 text-xs font-medium ${promoMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
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
                                <span className="text-gray-900">To Pay</span>
                                <span className="text-lg text-orange-600">
                                    {formatCurrency(total)} {/* Total now includes discount */}
                                </span>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
             {/* --- END: Order Summary Section --- */}


            {/* --- BOTTOM: Address and Payment Side-by-Side (Keep as is) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"> {/* Grid for bottom sections */}
                 {/* --- Address Section (Keep as is) --- */}
                 <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 h-fit"> {/* Added h-fit */}
                     {/* ... Address content ... */}
                     <div className="flex items-center justify-between gap-3 mb-5">
                         <div className="flex items-center gap-3">
                              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                 <i className="fas fa-map-marker-alt text-white text-sm sm:text-base"></i>
                             </div>
                             <h2 className="text-lg sm:text-xl font-bold text-gray-800">Delivery Address</h2>
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

                     {!showNewAddressForm && savedAddresses.length > 0 && (
                        <div className="space-y-3 mb-5">
                            {savedAddresses.map(addr => (
                                <div
                                    key={addr.id}
                                    onClick={() => handleAddressSelect(addr.id)}
                                    className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-200 flex items-start gap-3 ${selectedAddressId === addr.id ? 'border-orange-500 bg-orange-50 ring-2 ring-orange-200 shadow-md' : 'border-gray-200 hover:bg-gray-50 hover:border-gray-300'}`}
                                >
                                    <input
                                        type="radio"
                                        name="addressSelection"
                                        id={`addr-radio-${addr.id}`}
                                        checked={selectedAddressId === addr.id}
                                        onChange={() => handleAddressSelect(addr.id)}
                                        className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500 mt-1 flex-shrink-0"
                                    />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <label htmlFor={`addr-radio-${addr.id}`} className="font-semibold text-gray-800 text-sm cursor-pointer">{addr.label || 'Address'}</label>
                                            {addr.isDefault && <span className="text-[10px] bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded font-medium">Default</span>}
                                        </div>
                                        <p className="text-gray-600 text-xs">{`${addr.addressLine1}${addr.addressLine2 ? ', '+addr.addressLine2 : ''}, ${addr.city}, ${addr.pincode}`}</p>
                                        <p className="text-gray-600 text-xs mt-1">Contact: {addr.phone}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                     )}

                      {!showNewAddressForm && selectedAddress && (
                         <div className="p-3 sm:p-4 bg-green-50 border border-green-200 rounded-lg">
                             <p className="text-sm font-medium text-green-800">Delivering to:</p>
                             <p className="text-xs text-gray-700 mt-1">{displayAddressString}</p>
                         </div>
                     )}


                     {showNewAddressForm && (
                        <form onSubmit={handleSaveNewAddress} className="space-y-4 border-t border-gray-200 pt-5">
                             <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">Enter New Address Details</h3>
                             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                 <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name *" required className="checkout-input" />
                                 <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Phone Number *" required className="checkout-input" type="tel"/>
                             </div>
                             <input name="addressLine1" value={formData.addressLine1} onChange={handleInputChange} placeholder="Address Line 1 (House No, Building, Street, Area) *" required className="checkout-input" />
                             <input name="addressLine2" value={formData.addressLine2} onChange={handleInputChange} placeholder="Address Line 2 (Landmark, etc.) (Optional)" className="checkout-input" />
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                 <input name="city" value={formData.city} onChange={handleInputChange} placeholder="City *" required className="checkout-input" />
                                 <input name="state" value={formData.state} onChange={handleInputChange} placeholder="State *" required className="checkout-input" />
                                 <input name="pincode" value={formData.pincode} onChange={handleInputChange} placeholder="Pincode *" required className="checkout-input" />
                             </div>
                              <input name="label" value={formData.label || ''} onChange={handleInputChange} placeholder="Save as (e.g., Home, Work) (Optional)" className="checkout-input" />

                             <div className="flex justify-end gap-3 pt-2">
                                 <button type="button" onClick={() => setShowNewAddressForm(false)} className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">Cancel</button>
                                 <button type="submit" className="px-4 py-2 text-xs sm:text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">Save Address</button>
                             </div>
                        </form>
                     )}
                 </div>
                 {/* --- End Address Section --- */}

                {/* --- Payment Section --- */}
                 <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 h-fit"> {/* Added h-fit */}
                     <div className="flex items-center gap-3 mb-5">
                         <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                             <i className="fas fa-credit-card text-white text-sm sm:text-base"></i>
                         </div>
                       <h2 className="text-lg sm:text-xl font-bold text-gray-800">Payment</h2>
                     </div>
                     <div className="space-y-3">
                        {/* ... payment options ... */}
                          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <input type="radio" name="paymentMethod" id="pay-card" defaultChecked className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"/>
                                 <label htmlFor="pay-card" className="font-medium text-sm text-gray-700">Credit/Debit Card</label>
                              </div>
                              <div className="flex gap-1.5 text-xl text-gray-400">
                                  <i className="fab fa-cc-visa"></i>
                                  <i className="fab fa-cc-mastercard"></i>
                              </div>
                         </div>
                          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                  <input type="radio" name="paymentMethod" id="pay-upi" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"/>
                                  <label htmlFor="pay-upi" className="font-medium text-sm text-gray-700">UPI</label>
                              </div>
                          </div>
                          <div className="p-3 sm:p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                 <input type="radio" name="paymentMethod" id="pay-cod" className="h-4 w-4 text-orange-600 border-gray-300 focus:ring-orange-500"/>
                                 <label htmlFor="pay-cod" className="font-medium text-sm text-gray-700">Cash on Delivery</label>
                              </div>
                          </div>
                     </div>
                      <div className="mt-5 bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-orange-500 p-3 rounded-lg">
                         <div className="flex items-start gap-2">
                             <i className="fas fa-info-circle text-orange-500 mt-1 text-xs"></i>
                             <p className="text-xs text-gray-700">
                                 Payment integration is currently a placeholder. No actual charges will be made.
                             </p>
                         </div>
                     </div>

                     <button
                        onClick={handleSubmitOrder}
                        disabled={!selectedAddressId && !showNewAddressForm}
                        className={`w-full mt-6 bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 text-white py-3 sm:py-3 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                            (!selectedAddressId && !showNewAddressForm)
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:shadow-2xl hover:scale-105'
                        }`}
                        >
                        <i className="fas fa-lock"></i>
                        Place Order
                     </button>
                 </div>
                 {/* --- End Payment Section --- */}

            </div>
            {/* --- END: Bottom Sections --- */}
          </div>
          // --- END NEW LAYOUT ---
        )}
      </main>

      <Footer /> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}

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
       `}</style> {/* [cite: src/pages/consumer/CheckoutPage.jsx] */}
    </div>
  );
};

export default CheckoutPage; // [cite: src/pages/consumer/CheckoutPage.jsx]

