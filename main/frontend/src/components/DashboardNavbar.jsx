// src/components/DashboardNavbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.jsx";
import { useConsumerData } from "../context/consumer/consumerDataContext.jsx";
import locartoImg from "../assets/locarto.png";

const DashboardNavbar = ({ onMenuClick }) => {
  const { currentUser, logout, logoutLoading } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const isConsumer = currentUser?.type === "consumer";
  const consumerDataContext = isConsumer ? useConsumerData() : null;
  const lists = consumerDataContext?.lists;
  const cartCount = isConsumer ? (lists?.cart?.length || 0) : 0;

  const handleLogout = async (e) => {
    e.preventDefault();
    if (currentUser?.type) {
      await logout(currentUser.type);
    }
    setDropdownOpen(false);
  };

  const navbarTitle = () => {
    switch (currentUser?.type) {
      case "vendor": return "Vendor Dashboard";
      case "consumer": return "Customer Dashboard";
      case "admin": return "Admin Dashboard";
      default: return "Dashboard";
    }
  };

  const profileLink = () => {
    switch (currentUser?.type) {
      case "vendor": return "/vendor/dashboard/profile";
      case "consumer": return "/consumer/dashboard/settings";
      case "admin": return "/admin/dashboard";
      default: return "/";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
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
    <>
      {/* TOP NAVBAR */}
      <nav className="flex bg-white shadow-md h-[70px] px-3 sm:px-4 md:px-6 items-center justify-start fixed top-0 left-0 w-full z-50 border-b border-gray-100">
        {/* Logo ONLY */}
        <div className="flex items-center flex-shrink-0">
          <Link
            to="/"
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <img
              src={locartoImg}
              alt="Locarto"
              className="h-10 lg:h-12 w-auto object-contain scale-110 lg:scale-125 lg:translate-y-[2px]"
            />
          </Link>
        </div>
      </nav>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <div className="sm:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 z-50 shadow-lg safe-area-bottom">
        <div className="flex items-stretch justify-around px-2">
          {/* Menu Button */}
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

          {/* Notifications Link */}
          <Link
            to="/alerts"
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i className="fas fa-bell text-xl mb-1"></i>
            <span className="text-xs font-medium leading-tight">Alerts</span>
          </Link>

          {/* Profile Button */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex flex-col items-center justify-center flex-1 py-2 text-gray-600 hover:text-orange-500 transition-colors active:scale-95 min-h-[64px]"
          >
            <i className="fas fa-user-circle text-xl mb-1"></i>
            <span className="text-xs font-medium leading-tight">Account</span>
          </button>
        </div>
      </div>

      {/* MOBILE PROFILE DROPDOWN OVERLAY (Bottom Sheet) */}
      {dropdownOpen && (
        <div className="sm:hidden fixed inset-0 bg-black bg-opacity-50 z-40 animate-fade-in" onClick={() => setDropdownOpen(false)}>
          <div className="absolute bottom-16 left-0 w-full bg-white rounded-t-2xl shadow-xl animate-slide-up" ref={dropdownRef} onClick={(e) => e.stopPropagation()}>
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

      {/* Animation styles with bottom padding spacer */}
      <style>{`
        @keyframes slide-up { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }

        /* Safe area padding for notched devices */
        .safe-area-bottom {
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* Add bottom padding to body when mobile navbar is present in dashboard */
        @media (max-width: 639px) {
          body {
            padding-bottom: calc(80px + env(safe-area-inset-bottom));
          }
        }
      `}</style>
    </>
  );
};

export default DashboardNavbar;