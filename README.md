<<<<<<< HEAD
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
=======
# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 9bba190e924d2f552150b79717838f5982dd6b1a
