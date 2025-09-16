// src/components/DashboardNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = ({ onAddProductClick, showAddProduct, cartItems = [], onCartIconClick }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, logout, logoutLoading } = useAuthStore();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleLogout = (e) => {
    e.preventDefault();
    logout(currentUser?.type);
  };

  const isVendor = currentUser?.type === "vendor";

  // Handle dashboard navigation based on user role with auto-scroll to top
  const handleDashboardNavigation = () => {
    setDropdownOpen(false);
    
    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Navigate to appropriate dashboard
    if (currentUser?.type === "vendor") {
      navigate("/vendor/dashboard");
    } else if (currentUser?.type === "consumer") {
      navigate("/consumer/dashboard");
    } else {
      navigate("/consumer/login");
    }
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Left side: Brand + Dashboard type */}
      <div className="flex items-center">
        <div className="text-2xl font-bold text-orange-500">
          <Link to="/">Locarto</Link>
        </div>
        <span className="ml-4 bg-orange-100 text-orange-800 text-sm font-medium px-3 py-1 rounded-full">
          {isVendor ? "Vendor Dashboard" : "Customer Dashboard"}
        </span>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Customer-only cart */}
        {!isVendor && (
          <div className="relative">
            <button 
              onClick={onCartIconClick || (() => navigate("/consumer/dashboard?tab=cart"))}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center"
            >
              <i className="fas fa-shopping-cart mr-2"></i> Cart
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Notifications (both) */}
        <div className="relative">
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition">
            <i className="fas fa-bell mr-2"></i> Notifications
          </button>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            2
          </span>
        </div>

        {/* Circular Login Button */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-300 transition"
          >
            <span className="text-sm">👤</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen &&
            (currentUser ? (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
              >
                <button
                  onClick={handleDashboardNavigation}
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-100 text-gray-700"
                >
                  Dashboard
                </button>
                <button
                  className="block w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-700"
                  onClick={handleLogout}
                  disabled={logoutLoading}
                >
                  {!logoutLoading ? (
                    <>
                      <i className="fas fa-sign-out-alt mr-2"></i>Logout
                    </>
                  ) : (
                    "Logging Out....."
                  )}
                </button>
              </div>
            ) : (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50"
              >
                <Link
                  to="/consumer/login"
                  className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-100 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Login as Customer
                </Link>
                <Link
                  to="/vendor/login"
                  className="block px-4 py-3 hover:bg-gray-100 text-gray-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Login as Vendor
                </Link>
              </div>
            ))}
        </div>

        {/* Vendor-only Add Product */}
        {isVendor && onAddProductClick && (
          <button
            onClick={onAddProductClick}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            {showAddProduct ? (
              <>
                <i className="fas fa-xmark mr-2"></i>Close Form
              </>
            ) : (
              <>
                <i className="fas fa-plus mr-2"></i>Add Product
              </>
            )}
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;