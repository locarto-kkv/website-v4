// src/components/DashboardNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom"; // Make sure Link is imported
import { useAuthStore } from "../store/useAuthStore.jsx";
import { useConsumerData } from "../context/consumer/consumerDataContext.jsx";
import locartoImg from "../assets/locarto.png";

const DashboardNavbar = ({ onMenuClick }) => {
  const { currentUser, logout, logoutLoading } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const navigate = useNavigate();

  const isConsumer = currentUser?.type === "consumer"; //
  // Safely access consumer data context only if the user is a consumer
  const consumerDataContext = isConsumer ? useConsumerData() : null; //
  const lists = consumerDataContext?.lists; //
  const cartCount = isConsumer ? (lists?.cart?.length || 0) : 0; //

  const handleLogout = async (e) => {
    e.preventDefault(); //
    if (currentUser?.type) { //
      await logout(currentUser.type); //
    }
    setDropdownOpen(false); //
    // Keep mobileMenuOpen state if it exists, otherwise remove this line
    // setMobileMenuOpen(false);
  };

  const navbarTitle = () => {
    //
    // ... (navbarTitle function remains the same) ...
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
    //
     // ... (profileLink function remains the same) ...
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
        dropdownOpen && //
        dropdownRef.current && //
        !dropdownRef.current.contains(event.target) && //
        buttonRef.current && //
        !buttonRef.current.contains(event.target) //
      ) {
        setDropdownOpen(false); //
      }
    };
    document.addEventListener("mousedown", handleClickOutside); //
    return () => document.removeEventListener("mousedown", handleClickOutside); //
  }, [dropdownOpen]); //

  const handleCartClick = () => {
    //
    if (currentUser?.type === "consumer") { //
      navigate("/consumer/dashboard/lists"); //
    }
  };

  return (
    <>
      {/* DESKTOP & MOBILE NAVBAR - Fixed Top */}
      <nav className="flex bg-white shadow-md h-[70px] px-3 sm:px-4 md:px-6 items-center justify-between fixed top-0 left-0 w-full z-50 border-b border-gray-100">
        {/* ... (Left Section remains the same) ... */}
         {/* Left Section: Hamburger (mobile) / Logo (desktop) */}
        <div className="flex items-center flex-shrink-0">
          {/* Hamburger Menu - Visible only on mobile/tablet (hidden on lg and up) */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-2 mr-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            <i className="fas fa-bars text-lg sm:text-xl text-gray-700"></i>
          </button>
          {/* Logo - Hidden on mobile/tablet (visible on lg and up) */}
          <Link
            to="/"
            className="hidden lg:flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={locartoImg}
              alt="Locarto"
              className="h-12 sm:h-14 w-auto object-contain scale-110 sm:scale-125 translate-y-[2px]"
            />
          </Link>
           {/* Logo - Visible only on mobile/tablet (hidden on lg and up) */}
           <Link to="/" className="lg:hidden flex items-center hover:opacity-80 transition-opacity">
               <img
                 src={locartoImg}
                 alt="Locarto"
                 className="h-10 w-auto object-contain scale-110"
               />
            </Link>
        </div>
        {/* ... (Center Section remains the same) ... */}
        {/* Center Section: Title */}
        <div className="absolute left-1/2 transform -translate-x-1/2 lg:static lg:transform-none lg:translate-x-0 lg:flex-1 lg:ml-4 flex items-center justify-center lg:justify-start">
          {/* Dashboard Title - Hidden on mobile */}
          <span className="bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 text-sm font-semibold px-3 py-1.5 rounded-full border border-orange-100 hidden lg:inline-block shadow-sm">
            {navbarTitle()}
          </span>
        </div>

        {/* ... (Right Section remains the same - Alerts icon is already a Link here) ... */}
         {/* Right side: Actions - ALERTS FIRST */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 flex-shrink-0">
           {/* Notifications Link */}
          <Link
            to="/alerts"
            className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0 text-gray-700 hover:text-orange-500"
            aria-label="View Notifications"
          >
            <i className="fas fa-bell text-lg sm:text-xl"></i>
             {/* Add notification count badge here if needed */}
          </Link>

          {/* Cart Button (Consumer Only) */}
          {isConsumer && (
            <button
              onClick={handleCartClick}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
              aria-label={`View Cart (${cartCount} items)`}
            >
              <i className="fas fa-shopping-cart text-lg sm:text-xl text-gray-700"></i>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>
          )}

          {/* Profile Dropdown */}
          <div className="relative flex-shrink-0">
             {/* Profile button and dropdown content */}
             <button
              ref={buttonRef}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-2 sm:px-3 py-2 rounded-lg hover:bg-gray-200 transition ring-1 ring-gray-200 hover:ring-orange-300"
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

            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-100 overflow-hidden"
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="user-menu-button"
              >
                <Link
                  to={profileLink()}
                  className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  onClick={() => setDropdownOpen(false)}
                  role="menuitem"
                >
                  <i
                    className={`fas ${
                      currentUser?.type === "consumer" ? "fa-cog" : "fa-user"
                    } w-4 text-center text-gray-500`}
                  ></i>
                  {currentUser?.type === "consumer" ? "Settings" : "Profile"}
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  disabled={logoutLoading}
                  role="menuitem"
                >
                  <i className="fas fa-sign-out-alt w-4 text-center text-gray-500"></i>
                  {logoutLoading ? "Logging Out..." : "Logout"}
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* --- MOBILE BOTTOM NAVIGATION BAR --- */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg safe-area-bottom">
        <div className="flex items-stretch justify-around px-2">
          {/* Menu Button */}
          {/* ... (Menu button remains the same) ... */}
           <button
            onClick={() => {
              if (onMenuClick) onMenuClick();
            }}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i className={`fas fa-bars text-xl mb-1`}></i>
            <span className="text-xs font-medium leading-tight">Menu</span>
          </button>

          {/* Cart Button (Consumer Only) */}
          {/* ... (Cart button remains the same) ... */}
           {isConsumer && (
            <button
              onClick={handleCartClick}
              className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors relative active:scale-95 min-h-[64px]"
            >
              <div className="relative mb-1">
                <i className="fas fa-shopping-cart text-xl"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold shadow-md">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="text-xs font-medium leading-tight">Cart</span>
            </button>
          )}

          {/* Notifications Link - REPLACED BUTTON WITH LINK */}
          <Link
            to="/alerts" // <-- Link to the new page
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]" // Apply styles to Link
          >
            <i className="fas fa-bell text-xl mb-1"></i> {/* Icon */}
            <span className="text-xs font-medium leading-tight">Alerts</span> {/* Label */}
          </Link>
          {/* END REPLACEMENT */}

          {/* Profile Button */}
          {/* ... (Profile button remains the same) ... */}
           <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i className="fas fa-user-circle text-xl mb-1"></i>
            <span className="text-xs font-medium leading-tight">Account</span>
          </button>
        </div>
      </div>

      {/* MOBILE PROFILE DROPDOWN OVERLAY (Bottom Sheet - Keep as is) */}
      {/* ... (profile overlay remains the same) ... */}
      {dropdownOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in" onClick={() => setDropdownOpen(false)}>
            <div className="absolute bottom-16 left-0 w-full bg-white rounded-t-2xl shadow-xl animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 space-y-2">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {(currentUser?.name?.charAt(0) || currentUser?.email?.charAt(0) || "U").toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {currentUser?.name?.split(" ")[0] || currentUser?.email?.split("@")[0] || "Account"}
                    </h3>
                    <p className="text-xs text-gray-500">{navbarTitle()}</p>
                  </div>
                </div>
                <button onClick={() => setDropdownOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <i className="fas fa-times text-xl"></i>
                </button>
              </div>

              <Link
                to={profileLink()}
                className="flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                onClick={() => setDropdownOpen(false)}
              >
                <i className={`fas ${currentUser?.type === "consumer" ? "fa-cog" : "fa-user"} w-5 text-center text-gray-500`}></i>
                {currentUser?.type === "consumer" ? "Settings" : "Profile"}
              </Link>

              <button
                onClick={handleLogout}
                disabled={logoutLoading}
                className="w-full flex items-center gap-3 py-3 px-4 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium text-left disabled:opacity-50"
              >
                <i className="fas fa-sign-out-alt w-5 text-center text-gray-500"></i>
                {logoutLoading ? "Logging Out..." : "Logout"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add animation styles */}
      {/* ... (styles remain the same) ... */}
       <style>{`
        /* ... (keep existing animation styles) ... */
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }

        /* Safe area padding */
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }
      `}</style>
    </>
  );
};

export default DashboardNavbar;