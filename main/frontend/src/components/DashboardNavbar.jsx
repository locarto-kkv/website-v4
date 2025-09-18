import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const Navbar = ({ cartItems = [] }) => {
  const { currentUser, logout, logoutLoading } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout(currentUser?.type);
    // Redirect to home page after logout
    navigate('/');
  };

  const isVendor = currentUser?.type === "vendor";

  // Close dropdown when clicking outside
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

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      {/* Left side: Brand + Dashboard type */}
      <div className="flex items-center">
        <div className="text-2xl font-bold text-orange-500">
          <Link to="/">Locarto</Link>
        </div>
        <span className="ml-4 bg-orange-100 text-sm font-medium px-3 py-1 rounded-full">
          {isVendor ? "Vendor Dashboard" : "Customer Dashboard"}
        </span>
      </div>


      {/* Right side: Actions */}
      <div className="flex items-center space-x-4">
        {/* Customer-only cart */}
        {!isVendor && (
          <div className="relative">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center">
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
          <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition flex items-center">
            <i className="fas fa-bell mr-2"></i> Notifications
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <i className="fas fa-user-circle text-xl"></i>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50"
            >
              <Link
                to={isVendor ? "/vendor/profile" : "/consumer/profile"}
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setDropdownOpen(false)}
              >
                <i className="fas fa-user mr-2"></i> Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                disabled={logoutLoading}
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                {logoutLoading ? "Logging Out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;