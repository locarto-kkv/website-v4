// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import SearchIcon from "../components/SearchIcon";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getGreeting } from "../lib/utils.js";
import { getRandomMsg } from "../services/welcomeMsgs.js";
import { useAuthStore } from "../store/useAuthStore.jsx";
import { ConsumerProfileService } from "../services/consumer/consumerProfileService.js";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showError, setShowError] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [name, setName] = useState("");

  const navigate = useNavigate();

  // Available categories (Only these will be searchable/navigable)
  const availableCategories = ["personal care", "accessories"]; // [cite: src/pages/Homepage.jsx]

  // Popular Products Data
  const popularProducts = [
    // [cite: src/pages/Homepage.jsx]
    {
      // [cite: src/pages/Homepage.jsx]
      id: 1, // [cite: src/pages/Homepage.jsx]
      name: "Healthy Salad Bowl", // [cite: src/pages/Homepage.jsx]
      description: "Fresh greens, quinoa, tomatoes, and avocado", // [cite: src/pages/Homepage.jsx]
      price: "$12.99", // [cite: src/pages/Homepage.jsx]
      image: "🥗", // [cite: src/pages/Homepage.jsx]
      category: "wellness", // [cite: src/pages/Homepage.jsx]
      bgColor: "from-green-400 to-emerald-500", // [cite: src/pages/Homepage.jsx]
    },
    {
      // [cite: src/pages/Homepage.jsx]
      id: 2, // [cite: src/pages/Homepage.jsx]
      name: "Classic Pepperoni Pizza", // [cite: src/pages/Homepage.jsx]
      description: "Cheesy, saucy, and perfectly crispy crust", // [cite: src/pages/Homepage.jsx]
      price: "$18.50", // [cite: src/pages/Homepage.jsx]
      image: "🍕", // [cite: src/pages/Homepage.jsx]
      category: "lifestyle", // [cite: src/pages/Homepage.jsx]
      bgColor: "from-red-400 to-orange-500", // [cite: src/pages/Homepage.jsx]
    },
    {
      // [cite: src/pages/Homepage.jsx]
      id: 3, // [cite: src/pages/Homepage.jsx]
      name: "Relaxing Spa Kit", // [cite: src/pages/Homepage.jsx]
      // [cite: src/pages/Homepage.jsx]
      description:
        "Essential oils and bath bombs for the ultimate day of pampering", // [cite: src/pages/Homepage.jsx]
      price: "$49.99", // [cite: src/pages/Homepage.jsx]
      image: "🧴", // [cite: src/pages/Homepage.jsx]
      category: "personal care", // [cite: src/pages/Homepage.jsx]
      bgColor: "from-purple-400 to-pink-500", // [cite: src/pages/Homepage.jsx]
    },
    {
      // [cite: src/pages/Homepage.jsx]
      id: 4, // [cite: src/pages/Homepage.jsx]
      name: "Stylish Watch", // [cite: src/pages/Homepage.jsx]
      description: "Elegant timepiece for everyday wear.", // [cite: src/pages/Homepage.jsx]
      price: "$150.00", // [cite: src/pages/Homepage.jsx]
      image: "⌚️", // [cite: src/pages/Homepage.jsx]
      category: "accessories", // [cite: src/pages/Homepage.jsx]
      bgColor: "from-blue-400 to-indigo-500", // [cite: src/pages/Homepage.jsx]
    },
  ];

  const handleSearch = (e) => {
    // [cite: src/pages/Homepage.jsx]
    e.preventDefault(); // [cite: src/pages/Homepage.jsx]

    if (searchQuery.trim() === "") {
      // [cite: src/pages/Homepage.jsx]
      return; // [cite: src/pages/Homepage.jsx]
    }

    const normalizedQuery = searchQuery.toLowerCase().trim(); // [cite: src/pages/Homepage.jsx]
    const foundCategory = availableCategories.find(
      (
        category // [cite: src/pages/Homepage.jsx]
      ) => category.includes(normalizedQuery) // [cite: src/pages/Homepage.jsx]
    );

    if (foundCategory) {
      // [cite: src/pages/Homepage.jsx]
      // Redirect to map with selected category
      navigate(`/map?category=${foundCategory.replace(" ", "%20")}`); // [cite: src/pages/Homepage.jsx]
    } else {
      // Show error message with suggestion
      setShowError(true); // [cite: src/pages/Homepage.jsx]
      setSuggestedCategory(availableCategories[0]); // [cite: src/pages/Homepage.jsx]
    }
  };

  const handleInputChange = (e) => {
    // [cite: src/pages/Homepage.jsx]
    setSearchQuery(e.target.value); // [cite: src/pages/Homepage.jsx]
    // Clear error when typing
    if (showError) {
      // [cite: src/pages/Homepage.jsx]
      setShowError(false); // [cite: src/pages/Homepage.jsx]
    }
  };

  const handleSuggestionClick = (category) => {
    // [cite: src/pages/Homepage.jsx]
    navigate(`/map?category=${category.replace(" ", "%20")}`); // [cite: src/pages/Homepage.jsx]
    closeError(); // [cite: src/pages/Homepage.jsx]
  };

  const closeError = () => {
    // [cite: src/pages/Homepage.jsx]
    setShowError(false); // [cite: src/pages/Homepage.jsx]
    setSearchQuery(""); // [cite: src/pages/Homepage.jsx]
  };

  const handleProductClick = (product) => {
    // [cite: src/pages/Homepage.jsx]
    // Check if the product's category is one of the allowed ones before navigating
    if (availableCategories.includes(product.category.toLowerCase())) {
      // [cite: src/pages/Homepage.jsx]
      navigate(`/map?category=${product.category.replace(" ", "%20")}`); // [cite: src/pages/Homepage.jsx]
    } else {
      console.log(
        `Category "${product.category}" is not directly navigable via suggestions.`
      );
    }
  };

  useEffect(() => {
    const func = async () => {
      const profile = await ConsumerProfileService.getProfile();
      setName(profile.name);
    };
    func();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {" "}
      {/* [cite: src/pages/Homepage.jsx] */}
      <Navbar pageType="homepage" /> {/* [cite: src/pages/Homepage.jsx] */}
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8 pt-16 sm:pt-20">
        {" "}
        {/* [cite: src/pages/Homepage.jsx] */}
        <div className="max-w-6xl w-full mx-auto">
          {" "}
          {/* [cite: src/pages/Homepage.jsx] */}
          {/* Hero Section */}
          <div className="text-center mb-16 sm:mb-20">
            {" "}
            {/* [cite: src/pages/Homepage.jsx] */}
            {/* Multi-Logo Gallery */}
            <div className="relative mx-auto mb-6 sm:mb-8 mt-6 sm:mt-8">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              <div className="w-full max-w-5xl mx-auto">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                {/* Massive animated background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 via-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl sm:blur-3xl opacity-10 sm:opacity-15 animate-pulse scale-110"></div>{" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                <div
                  className="absolute inset-8 bg-gradient-to-r from-orange-300 via-pink-400 to-purple-400 rounded-2xl blur-xl sm:blur-2xl opacity-15 sm:opacity-20 animate-pulse scale-105" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDelay: "0.5s" }} // [cite: src/pages/Homepage.jsx]
                ></div>
                <div
                  className="absolute inset-16 bg-gradient-to-r from-orange-500 via-red-400 to-pink-500 rounded-xl blur-lg sm:blur-xl opacity-10 animate-pulse" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDelay: "1s" }} // [cite: src/pages/Homepage.jsx]
                ></div>
                {/* Horizontal Logo Container */}
                <div className="relative z-10 flex justify-center items-center gap-4 sm:gap-6 lg:gap-12 py-6 sm:py-8 px-3 sm:px-4">
                  {" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  {/* Logo Images Array */}
                  {(window.innerWidth <= 640
                    ? [1, 2, 3, 4]
                    : [1, 2, 3, 4, 5]
                  ).map((logoNumber, index) => (
                    <div
                      key={logoNumber} // [cite: src/pages/Homepage.jsx]
                      className="relative transform hover:scale-110 transition-all duration-700 cursor-pointer group" // [cite: src/pages/Homepage.jsx]
                      style={{
                        // [cite: src/pages/Homepage.jsx]
                        animationDelay: `${index * 0.2}s`, // [cite: src/pages/Homepage.jsx]
                        animation: "float 4s ease-in-out infinite", // [cite: src/pages/Homepage.jsx]
                      }}
                    >
                      {/* Logo container */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center relative">
                        {" "}
                        {/* [cite: src/pages/Homepage.jsx] */}
                        {/* Logo Image */}
                        <img
                          src={`/src/assets/${logoNumber}.png`} // [cite: src/pages/Homepage.jsx]
                          alt={`Locarto Logo ${logoNumber}`} // [cite: src/pages/Homepage.jsx]
                          className="relative z-10 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 object-contain transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110" // [cite: src/pages/Homepage.jsx]
                          style={{
                            // [cite: src/pages/Homepage.jsx]
                            // [cite: src/pages/Homepage.jsx]
                            filter:
                              "drop-shadow(0 15px 35px rgba(255,100,50,0.4)) drop-shadow(0 5px 15px rgba(255,120,60,0.3))", // [cite: src/pages/Homepage.jsx]
                          }}
                        />
                        {/* Orbiting animated dots */}
                        <div
                          className="absolute inset-0 animate-spin" // [cite: src/pages/Homepage.jsx]
                          style={{
                            // [cite: src/pages/Homepage.jsx]
                            animationDuration: `${18 + index * 2}s`, // [cite: src/pages/Homepage.jsx]
                            // [cite: src/pages/Homepage.jsx]
                            animationDirection:
                              index % 2 === 0 ? "normal" : "reverse", // [cite: src/pages/Homepage.jsx]
                          }}
                        >
                          <div className="absolute top-0 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-orange-400 rounded-full transform -translate-x-1/2 shadow-lg shadow-orange-300"></div>{" "}
                          {/* [cite: src/pages/Homepage.jsx] */}
                        </div>
                        <div
                          className="absolute inset-0 animate-spin" // [cite: src/pages/Homepage.jsx]
                          style={{
                            // [cite: src/pages/Homepage.jsx]
                            animationDuration: `${14 + index * 2}s`, // [cite: src/pages/Homepage.jsx]
                            // [cite: src/pages/Homepage.jsx]
                            animationDirection:
                              index % 2 === 0 ? "reverse" : "normal", // [cite: src/pages/Homepage.jsx]
                          }}
                        >
                          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full transform -translate-x-1/2 shadow-lg shadow-red-300"></div>{" "}
                          {/* [cite: src/pages/Homepage.jsx] */}
                        </div>
                        <div
                          className="absolute inset-0 animate-spin" // [cite: src/pages/Homepage.jsx]
                          style={{
                            // [cite: src/pages/Homepage.jsx]
                            animationDuration: `${22 + index * 2}s`, // [cite: src/pages/Homepage.jsx]
                            animationDirection: "normal", // [cite: src/pages/Homepage.jsx]
                          }}
                        >
                          <div className="absolute top-1/2 right-0 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-orange-300 rounded-full transform -translate-y-1/2 shadow-lg shadow-orange-200"></div>{" "}
                          {/* [cite: src/pages/Homepage.jsx] */}
                        </div>
                        <div
                          className="absolute inset-0 animate-spin" // [cite: src/pages/Homepage.jsx]
                          style={{
                            // [cite: src/pages/Homepage.jsx]
                            animationDuration: `${16 + index * 2}s`, // [cite: src/pages/Homepage.jsx]
                            animationDirection: "reverse", // [cite: src/pages/Homepage.jsx]
                          }}
                        >
                          <div className="absolute top-1/2 left-0 w-1 h-1 sm:w-1.5 sm:h-1.5 bg-red-300 rounded-full transform -translate-y-1/2 shadow-lg shadow-red-200"></div>{" "}
                          {/* [cite: src/pages/Homepage.jsx] */}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Global floating particles */}
                <div
                  className="absolute -top-6 sm:-top-8 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce opacity-60" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDelay: "0.2s" }} // [cite: src/pages/Homepage.jsx]
                ></div>
                <div
                  className="absolute -bottom-4 sm:-bottom-6 right-1/4 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-500 to-red-600 rotate-45 animate-bounce opacity-70" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDelay: "0.8s" }} // [cite: src/pages/Homepage.jsx]
                ></div>
                <div
                  className="absolute top-1/3 -right-6 sm:-right-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full animate-bounce opacity-50" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDelay: "1.2s" }} // [cite: src/pages/Homepage.jsx]
                ></div>
                <div
                  className="absolute top-1/4 -left-4 sm:-left-6 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-bounce opacity-60" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDelay: "1.6s" }} // [cite: src/pages/Homepage.jsx]
                ></div>
                <div
                  className="absolute bottom-1/3 left-1/6 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce opacity-40" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDelay: "2s" }} // [cite: src/pages/Homepage.jsx]
                ></div>
                <div
                  className="absolute top-1/2 right-1/6 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce opacity-70" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDelay: "2.4s" }} // [cite: src/pages/Homepage.jsx]
                ></div>
                {/* Large orbiting elements */}
                <div
                  className="absolute inset-0 animate-spin opacity-20" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDuration: "25s" }} // [cite: src/pages/Homepage.jsx]
                >
                  <div className="absolute top-4 left-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full transform -translate-x-1/2"></div>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                </div>
                <div
                  className="absolute inset-0 animate-spin opacity-15" // [cite: src/pages/Homepage.jsx]
                  style={{
                    // [cite: src/pages/Homepage.jsx]
                    animationDuration: "20s", // [cite: src/pages/Homepage.jsx]
                    animationDirection: "reverse", // [cite: src/pages/Homepage.jsx]
                  }}
                >
                  <div className="absolute bottom-4 left-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-red-400 to-orange-500 rounded-full transform -translate-x-1/2"></div>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                </div>
                <div
                  className="absolute inset-0 animate-spin opacity-25" // [cite: src/pages/Homepage.jsx]
                  style={{ animationDuration: "30s" }} // [cite: src/pages/Homepage.jsx]
                >
                  <div className="absolute top-1/2 right-6 sm:right-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-orange-300 to-red-400 rounded-full transform -translate-y-1/2"></div>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                </div>
              </div>
            </div>
            {/* Enhanced Main Heading */}
            <div className="relative mb-4 sm:mb-6 px-2">
              <div className="text-center space-y-2 sm:space-y-3">
                {/* Larger gradient headline */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-black relative">
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent relative z-10 block animate-pulse leading-tight sm:leading-normal">
                    {getGreeting(name)}
                  </span>
                </h1>

                {/* Slightly smaller secondary text */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-extrabold relative">
                  <span className="bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent relative z-10 block leading-tight sm:leading-normal">
                    {getRandomMsg()}
                  </span>
                </h2>

                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200 blur-3xl opacity-10 scale-110"></div>
              </div>
            </div>
            {/* Enhanced Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-light px-2">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              <span className="inline-block animate-fade-in-up">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                Discover the {/* [cite: src/pages/Homepage.jsx] */}
              </span>{" "}
              <span
                className="inline-block animate-fade-in-up text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text font-semibold" // [cite: src/pages/Homepage.jsx]
                style={{ animationDelay: "0.2s" }} // [cite: src/pages/Homepage.jsx]
              >
                best emerging brands {/* [cite: src/pages/Homepage.jsx] */}
              </span>{" "}
              <span
                className="inline-block animate-fade-in-up" // [cite: src/pages/Homepage.jsx]
                style={{ animationDelay: "0.4s" }} // [cite: src/pages/Homepage.jsx]
              >
                across the country {/* [cite: src/pages/Homepage.jsx] */}
              </span>{" "}
            </p>
            {/* Premium Search Bar */}
            <form
              onSubmit={handleSearch} // [cite: src/pages/Homepage.jsx]
              className="relative inline-block group w-full max-w-2xl mx-auto px-2 sm:px-0" // [cite: src/pages/Homepage.jsx]
            >
              <div className="relative">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-full blur-lg sm:blur-xl opacity-20 scale-105 group-hover:opacity-30 transition-all duration-500"></div>{" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                <div className="relative bg-white rounded-full shadow-xl sm:shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-gray-100 group-hover:border-orange-200 flex items-center">
                  {" "}
                  {/* Added flex items-center */}
                  <input
                    type="text" // [cite: src/pages/Homepage.jsx]
                    value={searchQuery} // [cite: src/pages/Homepage.jsx]
                    onChange={handleInputChange} // [cite: src/pages/Homepage.jsx]
                    placeholder="Search for food, services, products..." // [cite: src/pages/Homepage.jsx]
                    className="flex-grow px-4 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 pr-4 rounded-l-full focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent text-sm sm:text-base md:text-lg font-medium" // Adjusted padding and added flex-grow
                  />
                  {/* Explore Button */}
                  <Link
                    to="/map" // [cite: src/pages/Homepage.jsx]
                    className="mx-2 sm:mx-3 h-8 sm:h-9 md:h-10 px-4 sm:px-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl text-xs sm:text-sm font-semibold whitespace-nowrap" // Adjusted styles for text button
                    title="Explore Map" // [cite: src/pages/Homepage.jsx]
                  >
                    Explore {/* Changed from icon to text */}
                  </Link>
                  {/* Search Button */}
                  <div className="pr-2 sm:pr-3 md:pr-4 group-hover:scale-110 transition-transform duration-300">
                    {" "}
                    {/* Added padding right */}
                    <button
                      type="submit"
                      className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg focus:outline-none"
                    >
                      {" "}
                      {/* [cite: src/pages/Homepage.jsx] */}
                      <SearchIcon /> {/* [cite: src/pages/Homepage.jsx] */}
                    </button>
                  </div>
                </div>
                {/* Floating suggestion pills */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 hidden md:flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  {["Personal Care", "Accessories"].map(
                    // [cite: src/pages/Homepage.jsx]
                    (category, index) => (
                      <button
                        key={category} // [cite: src/pages/Homepage.jsx]
                        type="button" // [cite: src/pages/Homepage.jsx]
                        onClick={
                          () =>
                            // [cite: src/pages/Homepage.jsx]
                            navigate(
                              `/map?category=${category
                                .toLowerCase()
                                .replace(" ", "%20")}`
                            ) // [cite: src/pages/Homepage.jsx]
                        }
                        className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-600 text-sm rounded-full shadow-lg border border-gray-200 animate-fade-in-up hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer" // [cite: src/pages/Homepage.jsx]
                        style={{ animationDelay: `${index * 0.1}s` }} // [cite: src/pages/Homepage.jsx]
                      >
                        {category} {/* [cite: src/pages/Homepage.jsx] */}
                      </button>
                    )
                  )}
                </div>
              </div>
            </form>
          </div>
          <style>{`
            @keyframes fade-in-up {
              from {
                opacity: 0;
                transform: translateY(20px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            @keyframes float {
              0%, 100% {
                transform: translateY(0px) rotate(0deg);
              }
              25% {
                transform: translateY(-10px) rotate(2deg);
              }
              50% {
                transform: translateY(-5px) rotate(0deg);
              }
              75% {
                transform: translateY(-15px) rotate(-2deg);
              }
            }

            .animate-fade-in-up {
              animation: fade-in-up 0.8s ease-out forwards;
              opacity: 0;
            }

            .shadow-3xl {
              box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 10px 30px -10px rgba(0, 0, 0, 0.1);
            }
          `}</style>{" "}
          {/* [cite: src/pages/Homepage.jsx] */}
          {/* Popular Products Section */}
          <section className="mb-12 sm:mb-16 px-2 sm:px-0">
            {" "}
            {/* [cite: src/pages/Homepage.jsx] */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              Featured Products {/* [cite: src/pages/Homepage.jsx] */}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              {popularProducts.map(
                (
                  product // [cite: src/pages/Homepage.jsx]
                ) => (
                  <div
                    key={product.id} // [cite: src/pages/Homepage.jsx]
                    onClick={() => handleProductClick(product)} // [cite: src/pages/Homepage.jsx]
                    className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden" // [cite: src/pages/Homepage.jsx]
                  >
                    <div
                      className={`h-40 sm:h-48 bg-gradient-to-br ${product.bgColor} flex items-center justify-center text-5xl sm:text-6xl relative overflow-hidden`} // [cite: src/pages/Homepage.jsx]
                    >
                      <div className="absolute inset-0 bg-black/10"></div>{" "}
                      {/* [cite: src/pages/Homepage.jsx] */}
                      <span className="relative z-10 drop-shadow-lg">
                        {" "}
                        {/* [cite: src/pages/Homepage.jsx] */}
                        {product.image} {/* [cite: src/pages/Homepage.jsx] */}
                      </span>
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                        {" "}
                        {/* [cite: src/pages/Homepage.jsx] */}
                        <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                          {" "}
                          {/* [cite: src/pages/Homepage.jsx] */}
                          <i className="fas fa-heart text-white text-xs sm:text-sm opacity-70 hover:opacity-100 transition-opacity"></i>{" "}
                          {/* [cite: src/pages/Homepage.jsx] */}
                        </div>
                      </div>
                    </div>
                    <div className="p-5 sm:p-6">
                      {" "}
                      {/* [cite: src/pages/Homepage.jsx] */}
                      <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-1.5 sm:mb-2 group-hover:text-orange-600 transition-colors">
                        {" "}
                        {/* [cite: src/pages/Homepage.jsx] */}
                        {product.name} {/* [cite: src/pages/Homepage.jsx] */}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3 sm:mb-4 leading-relaxed">
                        {" "}
                        {/* [cite: src/pages/Homepage.jsx] */}
                        {product.description}{" "}
                        {/* [cite: src/pages/Homepage.jsx] */}
                      </p>
                      <div className="flex items-center justify-between">
                        {" "}
                        {/* [cite: src/pages/Homepage.jsx] */}
                        <span className="text-xl sm:text-2xl font-bold text-orange-600">
                          {" "}
                          {/* [cite: src/pages/Homepage.jsx] */}
                          {product.price} {/* [cite: src/pages/Homepage.jsx] */}
                        </span>
                        <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                          {" "}
                          {/* [cite: src/pages/Homepage.jsx] */}
                          Add to Cart {/* [cite: src/pages/Homepage.jsx] */}
                        </button>
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>{" "}
                    {/* [cite: src/pages/Homepage.jsx] */}
                  </div>
                )
              )}
            </div>
          </section>
          {/* Beta Signup Section */}
          <section className="bg-gradient-to-br from-[#353695] via-[#4a4db5] to-[#5b5fc7] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl mb-6 sm:mb-8 relative overflow-hidden mx-2 sm:mx-0">
            {" "}
            {/* [cite: src/pages/Homepage.jsx] */}
            <div className="absolute inset-0">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>{" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              <div
                className="absolute bottom-10 right-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-lg animate-pulse" // [cite: src/pages/Homepage.jsx]
                style={{ animationDelay: "0.5s" }} // [cite: src/pages/Homepage.jsx]
              ></div>
              <div
                className="absolute top-1/2 left-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full blur-md animate-pulse" // [cite: src/pages/Homepage.jsx]
                style={{ animationDelay: "1s" }} // [cite: src/pages/Homepage.jsx]
              ></div>
            </div>
            <div className="relative z-10">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>{" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                Limited Beta Access {/* [cite: src/pages/Homepage.jsx] */}
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent px-2">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                Reserve your spot, Sign up for our Beta{" "}
                {/* [cite: src/pages/Homepage.jsx] */}
              </h3>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed px-2">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                Be one of the first to explore the future of local discovery.{" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                Gain exclusive early access and help shape Locarto the way you{" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                want it {/* [cite: src/pages/Homepage.jsx] */}
              </p>
              <form className="max-w-lg mx-auto space-y-3 sm:space-y-4">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                <div className="relative group">
                  {" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  <input
                    type="text" // [cite: src/pages/Homepage.jsx]
                    placeholder="Your full name" // [cite: src/pages/Homepage.jsx]
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white text-sm sm:text-base" // [cite: src/pages/Homepage.jsx]
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                </div>
                <div className="relative group">
                  {" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  <input
                    type="email" // [cite: src/pages/Homepage.jsx]
                    placeholder="Your email address" // [cite: src/pages/Homepage.jsx]
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white text-sm sm:text-base" // [cite: src/pages/Homepage.jsx]
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                </div>
                <button
                  type="submit" // [cite: src/pages/Homepage.jsx]
                  className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1" // [cite: src/pages/Homepage.jsx]
                >
                  <span className="flex items-center justify-center gap-2">
                    {" "}
                    {/* [cite: src/pages/Homepage.jsx] */}
                    <i className="fas fa-rocket"></i>{" "}
                    {/* [cite: src/pages/Homepage.jsx] */}
                    Reserve My Spot {/* [cite: src/pages/Homepage.jsx] */}
                  </span>
                </button>
              </form>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm opacity-80">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                <div className="flex items-center gap-2">
                  {" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  <i className="fas fa-check text-green-300"></i>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  <span>No spam, ever</span>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                </div>
                <div className="flex items-center gap-2">
                  {" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  <i className="fas fa-users text-blue-300"></i>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  <span>Join 1,000+ early adopters</span>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                </div>
              </div>
            </div>
          </section>
          {/* Newsletter Section */}
          <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl mb-12 sm:mb-16 mx-2 sm:mx-0">
            {" "}
            {/* [cite: src/pages/Homepage.jsx] */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              Stay Updated {/* [cite: src/pages/Homepage.jsx] */}
            </h3>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-2">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              Subscribe for the latest updates and promotions.{" "}
              {/* [cite: src/pages/Homepage.jsx] */}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              <input
                type="email" // [cite: src/pages/Homepage.jsx]
                placeholder="Your email" // [cite: src/pages/Homepage.jsx]
                className="flex-1 px-4 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base" // [cite: src/pages/Homepage.jsx]
              />
              <button className="bg-white text-orange-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                Subscribe {/* [cite: src/pages/Homepage.jsx] */}
              </button>
            </div>
          </section>
        </div>
      </main>
      {/* Footer - Using the same Footer component as Landing Page */}
      <Footer /> {/* [cite: src/pages/Homepage.jsx] */}
      {/* Error Message Modal */}
      {showError && ( // [cite: src/pages/Homepage.jsx]
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {" "}
          {/* [cite: src/pages/Homepage.jsx] */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 mx-4 transform animate-in">
            {" "}
            {/* [cite: src/pages/Homepage.jsx] */}
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              <div className="flex items-center gap-3">
                {" "}
                {/* [cite: src/pages/Homepage.jsx] */}
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  {" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                  <i className="fas fa-exclamation-triangle text-red-600 text-sm sm:text-base"></i>{" "}
                  {/* [cite: src/pages/Homepage.jsx] */}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Oops!
                </h3>{" "}
                {/* [cite: src/pages/Homepage.jsx] */}
              </div>
              <button
                onClick={closeError} // [cite: src/pages/Homepage.jsx]
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors" // [cite: src/pages/Homepage.jsx]
              >
                <i className="fas fa-times"></i>{" "}
                {/* [cite: src/pages/Homepage.jsx] */}
              </button>
            </div>
            <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              The category " {/* [cite: src/pages/Homepage.jsx] */}
              <span className="font-semibold text-red-600">
                {searchQuery}
              </span>" {/* [cite: src/pages/Homepage.jsx] */}
              is not available yet. {/* [cite: src/pages/Homepage.jsx] */}
            </p>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              Try one of these available categories:{" "}
              {/* [cite: src/pages/Homepage.jsx] */}
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {" "}
              {/* [cite: src/pages/Homepage.jsx] */}
              {availableCategories.map(
                (
                  category // [cite: src/pages/Homepage.jsx]
                ) => (
                  <button
                    key={category} // [cite: src/pages/Homepage.jsx]
                    onClick={() => handleSuggestionClick(category)} // [cite: src/pages/Homepage.jsx]
                    className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 text-sm sm:text-base" // [cite: src/pages/Homepage.jsx]
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}{" "}
                    {/* [cite: src/pages/Homepage.jsx] */}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Homepage; // [cite: src/pages/Homepage.jsx]
