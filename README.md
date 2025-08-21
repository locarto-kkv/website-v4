# Backend

- Work with frontend to implement supabase file storage
- Create cart/wishlist table
- Add vendorId authorization in products

#### 1. Consumers table

- Users can add multiple contacts, addresses, payment_info

#### 2. Order status can be updated by vendors and admins

- _order_status_ : confirmed, shipped, delivered, returned, cancelled

#### 3. Payment status will be updated automatically or by admins

- _payment_status_ : incomplete, complete, refund

#### 4. Determine the time period within which an order is:

- _support_status_ : refundable, returnable, cancellable, replacable, none
<hr>

# User Permissions

#### 1. Profile

- _Consumer_
  - getProfile, updateProfile, deleteProfile
- _Vendor_
  - consumer + uploadDocs
- _Admin_
  - vendor + banProfile, restrictProfile

#### 2. Products

- _Consumer_
  - getTrending, getByCategory, getById, getByVendorId, addToCart/Wishlist
  - Integrate AI in search
- _Vendor_
  - consumer + addProduct, deleteProduct, editProduct, uploadImages
- _Admin_
  - vendor + banProduct, restrictProduct

#### 3. Reviews

- _Consumer_
  - getReviews, writeReview, deleteReview
- _Vendor_
  - getReviews, replyToReview
- _Admin_
  - getReviews, deleteReviewById

#### 4. Orders

- _Consumer_
  - getOrders, cancelOrder
- _Vendor_
  - getOrders, confirmOrder, updateOrderStatus
- _Admin_
  - getOrders, updateOrderStatus, cancelOrder, updateSupportStatus

#### 5. Transactions

- _Consumer_
  - getTransactions
- _Vendor_
  - getTransactions
- _Admin_
  - getTransactions, updatePaymentStatus

#### 6. Cart/Wishlist

- _Consumer_
  - getList, addToList, removeFromList
- _Vendor_
  - none
- _Admin_
  - getList
