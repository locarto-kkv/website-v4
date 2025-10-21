// src/components/DashboardNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
// Import ConsumerDataContext conditionally or ensure safe access
import { useConsumerData } from "../context/consumer/consumerDataContext";
import locartoImg from "../assets/locarto.png";

// Accept onMenuClick prop
const DashboardNavbar = ({ onMenuClick }) => {
  const { currentUser, logout, logoutLoading } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const isConsumer = currentUser?.type === "consumer";
  const consumerDataContext = isConsumer ? useConsumerData() : null;
  const lists = consumerDataContext?.lists;
  const cartCount = lists?.cart ? Object.keys(lists.cart).length : 0;

  const handleLogout = async (e) => {
    e.preventDefault();
    if (currentUser?.type) {
      await logout(currentUser.type);
    }
    setDropdownOpen(false);
  };

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
        return "/vendor/dashboard/profile";
      case "consumer":
        return "/consumer/dashboard/settings";
      case "admin":
        return "/admin/dashboard";
      default:
        return "/";
    }
  };

  // Close dropdown on outside click
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

  const handleCartClick = () => {
    if (currentUser?.type === "consumer") {
      navigate("/consumer/dashboard/lists");
    }
  };

  return (
    <nav className="bg-white shadow-md h-[70px] px-3 sm:px-4 md:px-6 flex items-center justify-between fixed top-0 left-0 w-full z-50 border-b border-gray-100">
      {" "}
      {/* Use justify-between */}
      {/* Logo - Left most */}
      <div className="flex items-center flex-shrink-0">
        {" "}
        {/* Ensure logo doesn't shrink */}
        <Link
          to="/"
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-12 sm:h-14 w-auto object-contain scale-110 sm:scale-125 translate-y-[2px]"
          />
        </Link>
      </div>
      {/* Center Section: Hamburger (mobile) / Title (desktop) */}
      {/* This div now acts as a spacer on large screens and holds the hamburger centrally on mobile */}
      <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none lg:translate-x-0 lg:flex-1 lg:ml-4 flex items-center justify-center lg:justify-start">
        {" "}
        {/* Center hamburger absolutely on mobile, reset for large screens */}
        {/* Mobile Menu Button - Use onMenuClick prop */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0" // Removed margin auto
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars text-lg sm:text-xl text-gray-700"></i>
        </button>
        {/* Title Badge - Hidden on mobile, shown on desktop */}
        <span className="bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-orange-100 hidden lg:inline-block">
          {navbarTitle()}
        </span>
      </div>
      {/* Right side: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
        {" "}
        {/* Ensure right side doesn't shrink */}
        {/* Customer-only cart */}
        {currentUser?.type === "consumer" && (
          <button
            onClick={handleCartClick}
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="View Cart"
          >
            <i className="fas fa-shopping-cart text-lg sm:text-xl text-gray-700"></i>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
                {cartCount}
              </span>
            )}
          </button>
        )}
        {/* Notifications */}
        <button
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
          aria-label="View Notifications"
        >
          <i className="fas fa-bell text-lg sm:text-xl text-gray-700"></i>
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg">
            2
          </span>
        </button>
        {/* User Profile Dropdown */}
        <div className="relative flex-shrink-0">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-200 transition"
            aria-label="User Menu"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            <i className="fas fa-user-circle text-lg sm:text-xl"></i>
            <span className="hidden md:inline text-sm font-medium">
              {currentUser?.name?.split(" ")[0] ||
                currentUser?.email?.split("@")[0] ||
                "Account"}
            </span>
            <i
              className={`fas fa-chevron-down text-xs transition-transform duration-200 ${
                dropdownOpen ? "rotate-180" : ""
              }`}
            ></i>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-100 overflow-hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              {(currentUser?.type === "vendor" ||
                currentUser?.type === "consumer") && (
                <Link
                  to={profileLink()}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                  role="menuitem"
                >
                  <i
                    className={`fas ${
                      currentUser.type === "consumer" ? "fa-cog" : "fa-user"
                    } mr-2 text-gray-500`}
                  ></i>
                  {currentUser.type === "consumer" ? "Settings" : "Profile"}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                disabled={logoutLoading}
                role="menuitem"
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
