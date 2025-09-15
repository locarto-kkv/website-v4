// src/pages/Homepage.jsx
import React from "react";
import SearchIcon from "../components/SearchIcon";
import CharacterIcon from "../components/CharacterIcon";
import { Link } from "react-router-dom";

const Homepage = () => {
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = React.useState(false);

  const toggleLoginDropdown = () => {
    setIsLoginDropdownOpen(!isLoginDropdownOpen);
  };

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (isLoginDropdownOpen && !event.target.closest('.login-dropdown')) {
        setIsLoginDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isLoginDropdownOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="py-6 px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-900">Locarto</div>
        <nav className="flex space-x-4">
          <Link 
            to="/landing"
            className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            About Us
          </Link>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLoginDropdown();
              }}
              className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors relative"
            >
              Log in
            </button>
            
            {/* Login Dropdown */}
            {isLoginDropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 login-dropdown"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="py-1">
                  <Link
                    to="/consumer/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login as Customer
                  </Link>
                  <Link
                    to="/vendor/login"
                    onClick={() => setIsLoginDropdownOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Login as Vendor
                  </Link>
                </div>
              </div>
            )}
          </div>
          <Link 
            to="/consumer/login" 
            className="px-3 py-1 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
          >
            Start Shopping
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="max-w-4xl w-full mx-auto text-center">
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-12">
            {/* Left Side - Character */}
            <div className="w-32 h-32 flex-shrink-0">
              <CharacterIcon />
            </div>
            
            {/* Right Side - Text and Search */}
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                What are you in the mood for today?
              </h1>
              
              <div className="relative inline-block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-80 md:w-96 px-4 py-3 rounded-full border-2 border-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-600"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <SearchIcon />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Homepage;