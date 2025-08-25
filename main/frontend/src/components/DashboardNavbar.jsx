import React from "react";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

const Navbar = ({
  onAddProductClick,
  showAddProduct,
  onLogout,
  cartItems = [],
}) => {
  const { userType } = useAuth();

  if (userType === "vendor") {
    return (
      <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-primary">
            <Link to="/">Locarto</Link>
          </div>
          <span className="ml-4 bg-orange-100 text-primary text-sm font-medium px-3 py-1 rounded-full">
            Vendor Dashboard
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              <i className="fas fa-bell mr-2"></i> Notifications
            </button>
            <span className="notification-badge">3</span>
          </div>
          <button
            onClick={onAddProductClick}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            <i className="fas fa-plus mr-2"></i>
            {showAddProduct ? "Close Form" : "Add Product"}
          </button>
          <button
            onClick={onLogout}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
          >
            <i className="fas fa-sign-out-alt mr-2"></i> Logout
          </button>
        </div>
      </nav>
    );
  }

  // ✅ Customer Navbar
  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-2xl font-bold text-primary">
          <Link to="/">Locarto</Link>
        </div>
        <span className="ml-4 bg-orange-100 text-primary text-sm font-medium px-3 py-1 rounded-full">
          Customer Dashboard
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            <i className="fas fa-shopping-cart mr-2"></i> Cart
          </button>
          <span className="notification-badge">{cartItems.length}</span>
        </div>
        <div className="relative">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            <i className="fas fa-bell mr-2"></i> Notifications
          </button>
          <span className="notification-badge">2</span>
        </div>
        <button
          onClick={onLogout}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <i className="fas fa-sign-out-alt mr-2"></i> Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
