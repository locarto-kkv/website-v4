// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Ensure Link is imported
import { useAuthStore } from "../store/useAuthStore";
import SideCart from "../components/consumer/SideCart";
import { ConsumerListService } from "../services/consumer/consumerListService";
import locartoImg from "../assets/locarto.png";

const Navbar = ({ pageType = "landing" }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const { currentUser, logout } = useAuthStore();
  const { getList } = ConsumerListService;

  // Load cart items
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Uncomment if getList is ready and needed on initial load
        // const res = await getList();
        // if (res.cart) {
        //   setCartItems(res.cart);
        // }
      } catch (error) {
        console.log("Error loading cart items");
      }
    };
    // loadCart();
  }, []); // Consider adding getList dependency if it changes

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
    if (location.pathname === "/landing" || location.pathname === "/") { // Added check for root path too
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100); // Small delay might help ensure element is ready
    } else {
      // Navigate to landing page with hash
      navigate(`/landing#${sectionId}`); // Assuming landing is the primary page with sections
    }
  };

  // Handle dashboard navigation based on user role with auto-scroll to top
  const handleDashboardNavigation = () => {
    setDropdownOpen(false);
    setMobileMenuOpen(false); // Close mobile menu too

    // Scroll to top of page
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Navigate to appropriate dashboard
    if (currentUser?.type === "vendor") {
      navigate("/vendor/dashboard");
    } else if (currentUser?.type === "consumer") {
      // Navigate to overview specifically
      navigate("/consumer/dashboard/overview");
    } else if (currentUser?.type === "admin") {
      navigate("/admin/dashboard");
    } else {
      // Fallback if somehow called without user type (shouldn't happen with logic below)
      navigate("/consumer/login");
    }
  };

  const handleLogout = () => {
    if (currentUser?.type) {
        logout(currentUser.type);
    }
    setDropdownOpen(false);
    setMobileMenuOpen(false); // Close mobile menu on logout
  }

  return (
    <nav className="bg-white shadow-md h-[70px] px-4 flex justify-between items-center fixed top-0 left-0 w-full z-50">
      {/* Logo */}
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <img
            src={locartoImg}
            alt="Locarto"
            className="h-14 w-auto object-contain scale-125 translate-y-[2px]"
          /> {/* */}
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-700"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <i
          className={`fas ${mobileMenuOpen ? "fa-times" : "fa-bars"} text-xl`}
        ></i> {/* */}
      </button>

      {/* Navigation Links */}
      <div
        className={`absolute md:static top-[70px] left-0 w-full md:w-auto bg-white md:bg-transparent shadow-md md:shadow-none z-40 ${
          mobileMenuOpen ? "block" : "hidden"
        } md:block`}
      > {/* Adjusted top position for mobile */}
        <div className="flex flex-col md:flex-row md:items-center md:space-x-6 p-4 md:p-0">
          <Link
            to={pageType === "homepage" ? "/landing" : "/"}
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors"
            onClick={() => setMobileMenuOpen(false)}
          >
            {pageType === "homepage" ? "About Us" : "Home"}
          </Link> {/* */}

          {/* **MODIFIED: Categories Link** */}
          <Link
            to="/map" // Link directly to the map view
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors text-left"
            onClick={() => setMobileMenuOpen(false)} // Close mobile menu on click
          >
            Categories
          </Link> {/* */}
          {/* **END MODIFICATION** */}

          {/* How It Works Button (Scrolls or Navigates) */}
          <button
            onClick={() => handleSectionNavigation("how-it-works")} // Ensure 'how-it-works' is an ID on your landing page
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors text-left"
          >
            How It Works
          </button> {/* */}

          {/* Testimonials Button (Scrolls or Navigates) */}
          <button
            onClick={() => handleSectionNavigation("testimonials")} // Ensure 'testimonials' is an ID on your landing page
            className="py-2 md:py-0 text-gray-700 hover:text-orange-500 font-medium transition-colors text-left"
          >
            Testimonials
          </button> {/* */}

          {/* Login/Dashboard/Logout links for mobile */}
           <div className="md:hidden mt-4 pt-4 border-t border-gray-100 space-y-2">
                {currentUser ? (
                    <>
                        <button
                          onClick={handleDashboardNavigation}
                          className="block w-full text-left py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
                        >
                          Dashboard
                        </button>
                        <button
                          className="block w-full text-left py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                          to="/consumer/login"
                          className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login as Customer
                        </Link>
                        <Link
                          to="/vendor/login"
                          className="block py-2 text-gray-700 hover:text-orange-500 font-medium transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          Login as Vendor
                        </Link>
                    </>
                )}
           </div>
        </div>
      </div>

      {/* Right Side Elements (Cart & Profile - Desktop) */}
      <div className="hidden md:flex items-center space-x-3"> {/* Hide on mobile */}
        <button
          onClick={toggleCart}
          className="text-gray-700 hover:text-orange-500 transition-colors relative"
        >
          <i className="fas fa-shopping-cart text-lg"></i>
          {/* Display cart count dynamically - ensure cartItems is updated */}
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"> {/* Made badge bold */}
              {cartItems.length}
            </span>
          )} {/* */}
        </button>

        <div className="relative">
          <button
            ref={buttonRef}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300 transition"
          >
             {/* Show user icon or initial */}
             {currentUser ? <i className="fas fa-user text-sm"></i> : <i className="fas fa-user-plus text-sm"></i>}
          </button> {/* */}

          {dropdownOpen && ( // Dropdown Menu
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg z-50 border border-gray-100" // Added border
            >
              {currentUser ? ( // If logged in
                <>
                  <button
                    onClick={handleDashboardNavigation}
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors"
                  >
                     <i className="fas fa-th-large mr-2 text-gray-500"></i> Dashboard
                  </button>
                  <button
                    className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={handleLogout}
                  >
                     <i className="fas fa-sign-out-alt mr-2 text-gray-500"></i> Logout
                  </button>
                </>
              ) : ( // If logged out
                <>
                  <Link
                    to="/consumer/login"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 border-b border-gray-100 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                     <i className="fas fa-user mr-2 text-gray-500"></i> Login as Customer
                  </Link>
                  <Link
                    to="/vendor/login"
                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    onClick={() => setDropdownOpen(false)}
                  >
                     <i className="fas fa-store mr-2 text-gray-500"></i> Login as Vendor
                  </Link>
                </>
              )} {/* */}
            </div>
          )}
        </div>
      </div>

      {/* Side Cart */}
      <SideCart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} /> {/* */}
    </nav>
  );
};

export default Navbar;