// src/pages/consumer/consumerDashboard.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Outlet, Link } from "react-router-dom";
import { useConsumerData } from "../../context/consumer/consumerDataContext"; //
import { useAuthStore } from "../../store/useAuthStore"; //

// Import the logo image
import locartoImg from "../../../src/assets/locarto.png"; //

// Navbar Component (Modified profile dropdown links)
const Navbar = ({ onCartClick, cartCount }) => {
  const navigate = useNavigate();
  const { currentUser, logout, logoutLoading } = useAuthStore(); //
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const handleLogout = async (e) => { //
    e.preventDefault();
    await logout(currentUser?.type); //
    setDropdownOpen(false);
    // Navigation back to home ('/') is handled within the logout function in useAuthStore
  };

  // Link to consumer settings/profile page
  const profileLink = "/consumer/dashboard/settings"; //

   // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => { //
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) && //
        buttonRef.current &&
        !buttonRef.current.contains(event.target) //
      ) {
        setDropdownOpen(false); //
      }
    };

    document.addEventListener("mousedown", handleClickOutside); //
    return () => {
      document.removeEventListener("mousedown", handleClickOutside); //
    };
  }, [dropdownOpen]);


  return (
    <nav className="fixed top-0 left-0 right-0 h-[70px] bg-white shadow-md z-50 flex items-center px-6 border-b border-gray-100">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
        <img
          src={locartoImg} //
          alt="Locarto Logo"
          className="h-14 w-auto object-contain scale-125 translate-y-[2px]" //
        />
      </Link>

      {/* Right side actions */}
      <div className="ml-auto flex items-center gap-4">
        {/* Notifications */}
        <button className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <i className="fas fa-bell text-xl text-gray-700"></i> {/* */}
          {/* Example notification badge - replace '2' with dynamic count */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"> {/* */}
             2
          </span>
        </button>

        {/* Cart */}
        <button
          onClick={onCartClick}
          className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors" //
        >
          <i className="fas fa-shopping-cart text-xl text-gray-700"></i> {/* */}
          {cartCount > 0 && ( //
            <span className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold shadow-lg"> {/* */}
              {cartCount} {/* */}
            </span>
          )}
        </button>

        {/* User Profile Dropdown - UPDATED */}
        <div className="relative">
          <button
            ref={buttonRef} //
            onClick={() => setDropdownOpen(!dropdownOpen)} //
            className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition" //
          >
            <i className="fas fa-user-circle text-xl"></i> {/* */}
          </button>

           {/* Dropdown Menu - UPDATED */}
           {dropdownOpen && (
            <div
              ref={dropdownRef} //
              className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-50 border border-gray-100" //
            >
              {/* Changed Settings to Profile */}
              <Link
                to={profileLink} // Stays pointing to settings page for now
                className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors" //
                onClick={() => setDropdownOpen(false)} //
              >
                <i className="fas fa-user mr-2 text-gray-500"></i> {/* Changed Icon */}
                 Profile {/* Changed Text */}
              </Link>
              {/* Logout button */}
              <button
                onClick={handleLogout} //
                className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center" //
                disabled={logoutLoading} //
              >
                <i className="fas fa-sign-out-alt mr-2 text-gray-500"></i> {/* Kept Icon */}
                {logoutLoading ? "Logging Out..." : "Logout"} {/* */}
              </button>
            </div>
          )}
        </div>
        {/* --- End User Profile Dropdown --- */}

      </div>
    </nav>
  );
};

// --- CustomerSidebar and CustomerDashboardLayout remain unchanged ---
// Sidebar Component
const CustomerSidebar = ({ cartCount, wishlistCount }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activePath = location.pathname;

  const menuItems = [
    { id: "overview", label: "Overview", icon: "fas fa-home", badge: null, path: "/consumer/dashboard/overview" }, //
    { id: "orders", label: "Orders", icon: "fas fa-box", badge: null, path: "/consumer/dashboard/orders" }, //
    { id: "lists", label: "Lists", icon: "fas fa-list", badge: cartCount + wishlistCount, path: "/consumer/dashboard/lists" }, //
    { id: "reviews", label: "Reviews", icon: "fas fa-star", badge: null, path: "/consumer/dashboard/reviews" }, //
    { id: "support", label: "Support", icon: "fas fa-headset", badge: null, path: "/consumer/dashboard/support" }, //
    { id: "settings", label: "Settings", icon: "fas fa-cog", badge: null, path: "/consumer/dashboard/settings" }, //
  ];

  const isActive = (itemPath) => { //
    return activePath === itemPath || (activePath === "/consumer/dashboard" && itemPath === "/consumer/dashboard/overview"); //
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 h-[calc(100vh-70px)] flex-shrink-0"> {/* */}
      <div className="p-4"> {/* */}
        <div className="mb-6 p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-100"> {/* */}
          <h3 className="font-bold text-gray-900 mb-1">Customer Portal</h3> {/* */}
          <p className="text-sm text-gray-600">Manage your shopping</p> {/* */}
        </div>

        <ul className="space-y-2"> {/* */}
          {menuItems.map((item) => ( //
            <li key={item.id}> {/* */}
              <button
                onClick={() => navigate(item.path)} //
                className={`group w-full text-left py-3 px-4 rounded-xl transition-all duration-300 font-medium flex items-center gap-3 ${ //
                  isActive(item.path) //
                    ? "bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg transform scale-105" //
                    : "bg-gray-50 hover:bg-gray-100 text-gray-700 hover:text-gray-900 hover:shadow-md hover:scale-105" //
                }`}
              >
                <i
                  className={`${item.icon} text-lg ${ //
                    isActive(item.path) //
                      ? "text-white" //
                      : "text-gray-500 group-hover:text-orange-500" //
                  } transition-colors duration-300`}
                ></i>
                <span className="font-semibold flex-1">{item.label}</span> {/* */}

                {item.badge > 0 && ( //
                  <span className={`text-xs rounded-full h-5 min-w-[20px] px-2 flex items-center justify-center font-bold ${ //
                    isActive(item.path) //
                      ? "bg-white text-orange-500" //
                      : "bg-orange-500 text-white" //
                  }`}>
                    {item.badge} {/* */}
                  </span>
                )}

                {isActive(item.path) && ( <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div> )} {/* */}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

// Main Layout Component
const CustomerDashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { lists } = useConsumerData(); //

  const cartItems = lists?.cart ? Object.values(lists.cart) : []; //
  const wishlistItems = lists?.wishlist ? [...lists.wishlist] : []; //

  const getPageTitle = () => { //
    const path = location.pathname;
    if (path.endsWith("/orders")) return "My Orders"; //
    if (path.endsWith("/lists")) return "My Lists"; //
    if (path.endsWith("/reviews")) return "My Reviews"; //
    if (path.endsWith("/support")) return "Customer Support"; //
    if (path.endsWith("/settings")) return "Account Settings"; //
    return "Dashboard Overview"; // Default title for overview or base path
  };
  const getPageDescription = () => { //
     const path = location.pathname;
    if (path.endsWith("/orders")) return "Track and manage all your orders in one place"; //
    if (path.endsWith("/lists")) return "Manage your cart and wishlist items"; //
    if (path.endsWith("/reviews")) return "Share your feedback on purchased products"; //
    if (path.endsWith("/support")) return "Get help with your orders and account"; //
    if (path.endsWith("/settings")) return "Manage your account preferences and information"; //
    return "Welcome back! Here's what's happening with your orders."; // Default
  }
  const pageTitle = getPageTitle();
  const pageDescription = getPageDescription();

  return (
    <div className="min-h-screen bg-gray-50"> {/* */}
      <Navbar
        onCartClick={() => navigate("/consumer/dashboard/lists")} //
        cartCount={cartItems.length} //
      />
      <div className="flex pt-[70px]"> {/* */}
        <CustomerSidebar
          cartCount={cartItems.length} //
          wishlistCount={wishlistItems.length} //
        />
        <main className="flex-1 h-[calc(100vh-70px)] overflow-y-auto"> {/* */}
          <div className="p-8"> {/* */}
             <div className="mb-8"> {/* */}
               <h1 className="text-3xl font-bold text-gray-900 mb-2">{pageTitle}</h1> {/* */}
               <p className="text-gray-600">{pageDescription}</p> {/* */}
            </div>
            <Outlet /> {/* */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboardLayout; 