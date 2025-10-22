// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.jsx"; // Added .jsx
import SideCart from "../components/consumer/SideCart.jsx"; // Added .jsx
import { ConsumerListService } from "../services/consumer/consumerListService.js";
import locartoImg from "../assets/locarto.png";

const Navbar = ({ pageType = "landing" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false); // State to control SideCart visibility
  const [cartItemsCount, setCartItemsCount] = useState(0); // State for cart count
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, logout } = useAuthStore();
  const { getLists } = ConsumerListService; // Changed from getList

  // Load cart count
  useEffect(() => {
    const loadCart = async () => {
      // Only fetch if user is a consumer
      if (currentUser?.type === 'consumer') {
        try {
          const res = await getLists();
          setCartItemsCount(res?.cart?.length || 0); // Safely get cart length
        } catch (error) {
          console.log("Error loading cart items count:", error);
          setCartItemsCount(0); // Reset count on error
        }
      } else {
        setCartItemsCount(0); // Reset count if not a consumer
      }
    };
    loadCart();
    // Re-fetch when user changes or cart opens (to ensure it's up-to-date)
  }, [currentUser, getLists, isCartOpen]);

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
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Toggle cart open/close
  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Handle navigation to sections (only used for non-category items now)
  const handleSectionNavigation = (sectionId) => {
    setMobileMenuOpen(false);

    // If already on landing page, scroll to section
    if (location.pathname === "/landing" || location.pathname === "/") {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // Navigate to landing page with hash
      navigate(`/landing#${sectionId}`);
    }
  };

  // Handle dashboard navigation based on user role with auto-scroll to top
  const handleDashboardNavigation = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (currentUser?.type === "vendor") {
      navigate("/vendor/dashboard/overview");
    } else if (currentUser?.type === "consumer") {
      navigate("/consumer/dashboard/overview");
    } else if (currentUser?.type === "admin") {
      navigate("/admin/dashboard");
    } else {
      navigate("/consumer/login");
    }
  };

  const handleLogout = () => {
    if (currentUser?.type) {
      logout(currentUser.type);
    }
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    // Added pt-[70px] to body/main container where App is rendered if navbar is fixed
    <nav className="bg-white shadow-md h-[70px] px-4 flex justify-between items-center fixed top-0 left-0 w-full z-50 border-b border-gray-100">
      {/* --- RESPONSIVE 3-COLUMN LAYOUT --- */}
      {/* Left Column (Logo) */}
      <div className="flex-1 flex justify-start">
        <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-12 sm:h-14 w-auto object-contain scale-110 sm:scale-125 translate-y-[2px]" // Adjusted scale and position slightly
          />
        </Link>
      </div>

      {/* Center Column (Nav Links on Desktop, Hamburger on Mobile) */}
      <div className="flex-1 flex justify-center items-center">
        {/* Mobile Hamburger Menu Button */}
        <button
          className="md:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors" // Added padding and hover effect
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <i
            className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
          ></i>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-6 lg:space-x-8"> {/* Increased spacing slightly */}
          <Link
            to={pageType === "homepage" ? "/landing" : "/"}
            className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base nav-link" // Added nav-link class
          >
            {pageType === "homepage" ? "About Us" : "Home"}
          </Link>
          <Link
            to="/map"
            className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base nav-link" // Added nav-link class
          >
            Categories
          </Link>
          <button
            onClick={() => handleSectionNavigation("how-it-works")}
            className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base nav-link" // Added nav-link class
          >
            How It Works
          </button>
          <button
            onClick={() => handleSectionNavigation("testimonials")}
            className="text-gray-700 hover:text-orange-500 font-medium transition-colors text-sm lg:text-base nav-link" // Added nav-link class
          >
            Testimonials
          </button>
        </div>
      </div>

      {/* Right Column (Cart & Profile) */}
      <div className="flex-1 flex justify-end items-center space-x-3 sm:space-x-4">
         {/* Cart Button */}
        <button
          onClick={toggleCart} // <-- Opens the SideCart
          className="text-gray-700 hover:text-orange-500 transition-colors relative p-2 hover:bg-gray-100 rounded-lg" // Added padding and hover
          aria-label={`View Cart (${cartItemsCount} items)`}
        >
          <i className="fas fa-shopping-cart text-lg sm:text-xl"></i>
          {cartItemsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-md">
              {cartItemsCount}
            </span>
          )}
        </button>

        {/* Profile Dropdown */}
        <div className="relative"> {/* Removed hidden md:block to show on mobile too */}
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-100 text-gray-700 rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center hover:bg-gray-200 transition ring-1 ring-gray-200 hover:ring-orange-300" // Adjusted size and added ring
            aria-label="User menu"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
          >
            {currentUser ? (
              <i className="fas fa-user text-sm sm:text-base"></i>
            ) : (
              <i className="fas fa-user-plus text-sm sm:text-base"></i> // Icon for logged out state
            )}
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 border border-gray-100 overflow-hidden"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="user-menu-button"
            >
              {currentUser ? (
                <>
                  <button
                    onClick={handleDashboardNavigation}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors flex items-center gap-2" // Added flex items-center gap-2
                    role="menuitem"
                  >
                    <i className="fas fa-th-large w-4 text-center text-gray-500"></i>{" "}
                    Dashboard
                  </button>
                  <button
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2" // Added flex items-center gap-2
                    onClick={handleLogout}
                    role="menuitem"
                  >
                    <i className="fas fa-sign-out-alt w-4 text-center text-gray-500"></i>{" "}
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/consumer/login"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors flex items-center gap-2" // Added flex items-center gap-2
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    <i className="fas fa-user w-4 text-center text-gray-500"></i> Login as Customer
                  </Link>
                  <Link
                    to="/vendor/login"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2" // Added flex items-center gap-2
                    onClick={() => setDropdownOpen(false)}
                    role="menuitem"
                  >
                    <i className="fas fa-store w-4 text-center text-gray-500"></i> Login as Vendor
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* --- Mobile Menu Overlay --- */}
      <div
        className={`absolute md:hidden top-[70px] left-0 w-full bg-white shadow-lg z-40 transition-transform duration-300 ease-in-out ${
          mobileMenuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0 overflow-hidden" // Smooth transition
        }`}
      >
        <div className="flex flex-col p-4 space-y-1"> {/* Reduced spacing */}
          <Link
            to={pageType === "homepage" ? "/landing" : "/"}
            className="py-3 px-3 text-gray-700 hover:text-orange-500 font-medium transition-colors rounded-lg hover:bg-gray-50" // Added padding and hover bg
            onClick={() => setMobileMenuOpen(false)}
          >
            {pageType === "homepage" ? "About Us" : "Home"}
          </Link>
          <Link
            to="/map"
            className="py-3 px-3 text-gray-700 hover:text-orange-500 font-medium transition-colors rounded-lg hover:bg-gray-50" // Added padding and hover bg
            onClick={() => setMobileMenuOpen(false)}
          >
            Categories
          </Link>
          <button
            onClick={() => handleSectionNavigation("how-it-works")}
            className="py-3 px-3 text-gray-700 hover:text-orange-500 font-medium transition-colors text-left rounded-lg hover:bg-gray-50" // Added padding and hover bg
          >
            How It Works
          </button>
          <button
            onClick={() => handleSectionNavigation("testimonials")}
            className="py-3 px-3 text-gray-700 hover:text-orange-500 font-medium transition-colors text-left rounded-lg hover:bg-gray-50" // Added padding and hover bg
          >
            Testimonials
          </button>
          {/* Divider and Auth links for mobile */}
          <div className="mt-4 pt-4 border-t border-gray-100 space-y-1">
             {/* Profile button already exists outside, no need to duplicate here */}
          </div>
        </div>
      </div>

      {/* Side Cart - State managed here */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Add styles for nav-link underline effect if not already present */}
      <style>{`
        .nav-link { position: relative; padding-bottom: 4px; }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 0;
          height: 2px;
          background-color: #f97316; /* Orange color */
          transition: width 0.3s ease-out;
        }
        .nav-link:hover::after { width: 100%; }
      `}</style>
    </nav>
  );
};

export default Navbar;
