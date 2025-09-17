// src/pages/Homepage.jsx
import React from "react";
import SearchIcon from "../components/SearchIcon";
import CharacterIcon from "../components/CharacterIcon";
import Navbar from "../components/Navbar";
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
      <Navbar pageType="homepage" />
      
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
              {/* Make this clickable to go to map */}
              <Link to="/map" className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight hover:text-orange-500 transition-colors cursor-pointer block">
                What are you in the mood for today?
              </Link>
              
              <div className="relative inline-block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-80 md:w-96 px-4 py-3 rounded-full border-2 border-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 placeholder-gray-600"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <SearchIcon />
                </div>
                {/* Globe Icon - Also links to map */}
                <div className="absolute right-12 top-1/2 transform -translate-y-1/2">
                  <Link to="/map" className="text-gray-600 hover:text-orange-500 transition">
                    <i className="fas fa-globe text-xl"></i>
                  </Link>
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