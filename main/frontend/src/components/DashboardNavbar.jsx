// src/components/DashboardNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useConsumerData } from "../context/consumer/consumerDataContext";
import locartoImg from "../assets/locarto.png";

const DashboardNavbar = ({ onMenuClick }) => {
  const { currentUser, logout, logoutLoading } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const isConsumer = currentUser?.type === "consumer";
  const consumerData = isConsumer ? useConsumerData() : { lists: null };
  const lists = consumerData.lists;
  const cartCount = lists?.cart ? Object.keys(lists.cart).length : 0;

  const handleLogout = async (e) => {
    e.preventDefault();
    await logout(currentUser?.type);
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
        return "/vendor/profile";
      case "consumer":
        return "/consumer/dashboard/settings";
      default:
        return "/";
    }
  };

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
    if (currentUser?.type === 'consumer') {
        navigate('/consumer/dashboard/lists');
    }
  };

  return (
    <nav className="bg-white shadow-md h-[70px] px-3 sm:px-4 md:px-6 flex items-center fixed top-0 left-0 w-full z-50 border-b border-gray-100">
      {/* Logo - Left most */}
      <div className="flex items-center flex-shrink-0">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-12 sm:h-14 w-auto object-contain scale-110 sm:scale-125 translate-y-[2px]"
          />
        </Link>
      </div>

      {/* Center Section - Hamburger (mobile) / Title (desktop) */}
      <div className="flex-1 flex items-center">
        {/* Mobile Menu Button - Centered on mobile */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 mx-auto"
          aria-label="Toggle menu"
        >
          <i className="fas fa-bars text-lg sm:text-xl text-gray-700"></i>
        </button>

        {/* Title Badge - Hidden on mobile, shown on desktop */}
        <span className="ml-4 bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-orange-100 hidden lg:inline-block">
          {navbarTitle()}
        </span>
      </div>

      {/* Right side: Actions */}
      <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
        {/* Customer-only cart */}
        {currentUser?.type === "consumer" && (
          <button
             onClick={handleCartClick}
             className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
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
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0">
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
          >
            <i className="fas fa-user-circle text-lg sm:text-xl"></i>
            <span className="hidden md:inline text-sm font-medium">
              {currentUser?.name?.split(' ')[0] || currentUser?.email?.split('@')[0]}
            </span>
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-100"
            >
              {currentUser?.type !== "admin" && (
                <Link
                  to={profileLink()}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  onClick={() => setDropdownOpen(false)}
                >
                  <i className="fas fa-user mr-2 text-gray-500"></i>
                  {currentUser?.type === 'consumer' ? 'Settings' : 'Profile'}
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
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