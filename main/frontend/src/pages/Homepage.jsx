// src/pages/Homepage.jsx
import React, { useState } from "react";
import SearchIcon from "../components/SearchIcon";
import CharacterIcon from "../components/CharacterIcon";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showError, setShowError] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const navigate = useNavigate();

  // Available categories
  const availableCategories = ['wellness', 'lifestyle', 'accessories'];

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim() === '') {
      return;
    }
    
    const normalizedQuery = searchQuery.toLowerCase().trim();
    const foundCategory = availableCategories.find(category => 
      category.includes(normalizedQuery)
    );
    
    if (foundCategory) {
      // Redirect to map with selected category
      navigate(`/map?category=${foundCategory}`);
    } else {
      // Show error message with suggestion
      setShowError(true);
      setSuggestedCategory(availableCategories[0]); // Suggest first available category
    }
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    // Clear error when typing
    if (showError) {
      setShowError(false);
    }
  };

  const handleSuggestionClick = (category) => {
    navigate(`/map?category=${category}`);
    closeError();
  };

  const closeError = () => {
    setShowError(false);
    setSearchQuery('');
  };

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
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
                What are you in the mood for today?
              </h1>
              
              <form onSubmit={handleSearch} className="relative inline-block">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleInputChange}
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
              </form>
            </div>
          </div>
        </div>
      </main>
      
      {/* Error Message Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 mx-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold text-red-600">Oops!</h3>
              <button 
                onClick={closeError}
                className="text-gray-500 hover:text-gray-700"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-gray-700 mb-4">The category "{searchQuery}" is not available yet.</p>
            <p className="text-gray-700 mb-6">Try one of these popular categories:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSuggestionClick(category)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage;