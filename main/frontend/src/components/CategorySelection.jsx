// src/components/CategorySelection.jsx
import React from "react";
import { Link } from "react-router-dom";

const CategorySelection = () => {
  const categories = [
    { name: "Bakery", icon: "🍞", link: "/map" },
    { name: "Restaurant", icon: "🍽️", link: "/map" },
    { name: "Cafe", icon: "☕", link: "/map" },
    { name: "Grocery", icon: "🛒", link: "/map" },
    { name: "Fashion", icon: "👕", link: "/map" },
    { name: "Electronics", icon: "📱", link: "/map" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 to-blue-800 flex items-center justify-center">
      <div className="absolute top-4 left-4 text-orange-500 text-xl font-bold">
        LOCARTO
      </div>
      
      <Link 
        to="/" 
        className="absolute top-4 right-4 text-white hover:text-orange-500 transition"
      >
        <i className="fas fa-arrow-left"></i>
      </Link>
      
      <div className="text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-12">What are you looking for?</h1>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105"
            >
              <div className="text-4xl mb-3">{category.icon}</div>
              <div className="text-white text-xl font-semibold">{category.name}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySelection;