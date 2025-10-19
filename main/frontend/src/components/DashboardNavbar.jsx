// src/components/DashboardNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useConsumerData } from "../context/consumer/consumerDataContext"; // Import consumer context
import locartoImg from "../assets/locarto.png";

const DashboardNavbar = () => { // Renamed from Navbar to avoid conflict if exporting both
  const { currentUser, logout, logoutLoading } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  // --- Get consumer data only if the user is a consumer ---
  const isConsumer = currentUser?.type === "consumer";
  const consumerData = isConsumer ? useConsumerData() : { lists: null };
  const lists = consumerData.lists;
  const cartCount = lists?.cart ? Object.keys(lists.cart).length : 0;
  // --- End consumer data logic ---

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout(currentUser?.type);
    setDropdownOpen(false); // Close dropdown on logout
    // Navigation is handled in logout function
  };

  // --- Dynamic Title and Profile Link ---
  const navbarTitle = () => {
    switch (currentUser?.type) {
      case "vendor":
        return "Vendor Dashboard";
      case "consumer":
        return "Customer Dashboard";
      case "admin":
        return "Admin Dashboard";
      default:
        return "Dashboard";
    }
  };

  const profileLink = () => {
    switch (currentUser?.type) {
      case "vendor":
        return "/vendor/profile";
      case "consumer":
        return "/consumer/dashboard/settings"; // Consumer profile/settings link
      // Admin might not have a dedicated profile page in this structure
      default:
        return "/"; // Fallback link
    }
  };
  // --- End Dynamic Logic ---

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  // --- Cart Click Handler (for consumer) ---
  const handleCartClick = () => {
    if (currentUser?.type === 'consumer') {
        navigate('/consumer/dashboard/lists'); // Navigate directly to lists page
    }
  };
  // --- End Cart Click Handler ---

  return (
    <nav className="bg-white shadow-md h-[70px] px-4 sm:px-6 flex justify-between items-center fixed top-0 left-0 w-full z-50 border-b border-gray-100"> {/* Added border */}
      {/* Logo and Title */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-14 w-auto object-contain scale-125 translate-y-[2px]"
          />
        </Link>
        <span className="ml-4 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-orange-100 hidden sm:inline-block"> {/* Improved styling */}
          {navbarTitle()}
        </span>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-3 sm:space-x-4"> {/* Adjusted spacing */}
        {/* Customer-only cart */}
        {currentUser?.type === "consumer" && (
          <button
             onClick={handleCartClick} // Use direct navigation handler
             className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="fas fa-shopping-cart text-xl text-gray-700"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"> {/* Enhanced badge */}
                {cartCount}
              </span>
            )}
          </button>
        )}

        {/* Notifications (Common to all dashboard types) */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i className="fas fa-bell text-xl text-gray-700"></i>
          {/* Example notification badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"> {/* Enhanced badge */}
            2
          </span>
        </button>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
          >
            <i className="fas fa-user-circle text-xl"></i>
            {/* Optional: Show user initial or name on larger screens */}
             <span className="hidden md:inline text-sm font-medium">{currentUser?.name?.split(' ')[0] || currentUser?.email?.split('@')[0]}</span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-100" // Added border
            >
              {/* Dynamic Profile/Settings Link (Hide for Admin if no profile page exists) */}
              {currentUser?.type !== "admin" && (
                <Link
                  to={profileLink()}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors" // Adjusted padding/text size
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fas fa-user mr-2 text-gray-500"></i> {/* Consistent Icon */}
                  {currentUser?.type === 'consumer' ? 'Settings' : 'Profile'} {/* Dynamic Label */}
                </Link>
              )}
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center" // Adjusted padding/text size
                disabled={logoutLoading}
              >
                <i className="fas fa-sign-out-alt mr-2 text-gray-500"></i>
                {logoutLoading ? "Logging Out..." : "Logout"}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;