import React from "react";
import { useAuth } from "../context/authContext";
import { Link } from "react-router-dom";

const Navbar = ({ onAddProductClick, showAddProduct, cartItems = [] }) => {
  const { currentUser, logout, logoutLoading } = useAuth();

  const handleLogout = (e) => {
    e.preventDefault();
    logout(currentUser?.type);
  };

  const isVendor = currentUser?.type === "vendor";

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Left side: Brand + Dashboard type */}
      <div className="flex items-center">
        <div className="text-2xl font-bold text-secondary">
          <Link to="/">Locarto</Link>
        </div>
        <span className="ml-4 bg-orange-100 text-secondary text-sm font-medium px-3 py-1 rounded-full">
          {isVendor ? "Vendor Dashboard" : "Customer Dashboard"}
        </span>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Customer-only cart */}
        {!isVendor && (
          <div className="relative">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
              <i className="fas fa-shopping-cart mr-2"></i> Cart
            </button>
            <span className="notification-badge">{cartItems.length}</span>
          </div>
        )}

        {/* Notifications (both) */}
        <div className="relative">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            <i className="fas fa-bell mr-2"></i> Notifications
          </button>
          <span className="notification-badge">2</span>
        </div>

        {/* Vendor-only Add Product */}
        {isVendor && (
          <button
            onClick={onAddProductClick}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            <i className="fas fa-plus mr-2"></i>
            {showAddProduct ? "Close Form" : "Add Product"}
          </button>
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <i className="fas fa-sign-out-alt mr-2"></i>
          {!logoutLoading ? "Logout" : "Logging Out....."}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
