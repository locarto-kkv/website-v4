// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react"; // Import useState and useEffect
import SearchIcon from "../components/SearchIcon";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link, useNavigate } from "react-router-dom";
import { getGreeting } from "../lib/utils.js";
import { getRandomMsg } from "../services/welcomeMsgs.js"; // Make sure this is imported
import { useAuthStore } from "../store/useAuthStore.jsx";
import { ConsumerProfileService } from "../services/consumer/consumerProfileService.js";
import { VendorProfileService } from "../services/vendor/vendorProfileService.js";

// Background Assets
// Import assets as before
import asset1 from "../assets/1.png"; //
import asset2 from "../assets/2.png"; //
import asset3 from "../assets/3.png"; //
import asset4 from "../assets/4.png"; //
import asset5 from "../assets/5.png"; //

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showError, setShowError] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [name, setName] = useState("");
  const { currentUser } = useAuthStore();
  const [welcomeMessage, setWelcomeMessage] = useState(""); // Add state for the welcome message

  const navigate = useNavigate();

  // Available categories (Only these will be searchable/navigable)
  const availableCategories = ["personal care", "accessories"]; //

  // Popular Products Data
  const popularProducts = [
   
  ];

  // Set welcome message once on mount
  useEffect(() => {
    setWelcomeMessage(getRandomMsg()); // Set the message only once on mount
  }, []); // Empty dependency array ensures it runs only once

  // --- Keep handlers (handleSearch, handleInputChange, etc.) as they are ---
  const handleSearch = (e) => {
    //
    e.preventDefault(); //

    if (searchQuery.trim() === "") {
      //
      return; //
    }

    const normalizedQuery = searchQuery.toLowerCase().trim(); //
    const foundCategory = availableCategories.find(
      //
      (category) => category.includes(normalizedQuery) //
    );

    if (foundCategory) {
      //
      // Redirect to map with selected category
      navigate(`/map?category=${foundCategory.replace(" ", "%20")}`); //
    } else {
      // Show error message with suggestion
      setShowError(true); //
      setSuggestedCategory(availableCategories[0]); //
    }
  };

  const handleInputChange = (e) => {
    //
    setSearchQuery(e.target.value); //
    // Clear error when typing
    if (showError) {
      //
      setShowError(false); //
    }
  };

  const handleSuggestionClick = (category) => {
    //
    navigate(`/map?category=${category.replace(" ", "%20")}`); //
    closeError(); //
  };

  const closeError = () => {
    //
    setShowError(false); //
    setSearchQuery(""); //
  };

  const handleProductClick = (product) => {
    //
    // Check if the product's category is one of the allowed ones before navigating
    if (availableCategories.includes(product.category.toLowerCase())) {
      //
      navigate(`/map?category=${product.category.replace(" ", "%20")}`); //
    } else {
      console.log(
        //
        `Category "${product.category}" is not directly navigable via suggestions.`
      );
    }
  };

  useEffect(() => {
    //
    const funcConsumer = async () => {
      //
      const profile = await ConsumerProfileService.getProfile(); //
      setName(profile.name); //
    };
    const funcVendor = async () => {
      //
      const profile = await VendorProfileService.getProfile(); //
      setName(profile.name); //
    };
    if (currentUser?.type === "consumer") {
      //
      funcConsumer(); //
    } else if (currentUser?.type === "vendor") {
      //
      funcVendor(); //
    }
  }, [currentUser]); //
  // --- End handlers ---

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      {" "}
      {/* Added overflow-hidden */}
      <Navbar pageType="homepage" />
      {/* MODIFIED Background Assets - Reduced negative offsets */}
      {/* Use percentages or smaller fixed values to keep within bounds */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        {" "}
        {/* Ensure assets are behind content */}
        <img
          src={asset1} //
          alt=""
          className="absolute top-[-5%] left-[-5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] opacity-[0.15] animate-[spin_40s_linear_infinite]"
          style={{ filter: "blur(1px)" }} //
        />
        <img
          src={asset4} //
          alt=""
          className="absolute top-[5%] right-[-5%] w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-[0.12] animate-[spin_50s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }} //
        />
        <img
          src={asset2} //
          alt=""
          className="absolute top-[30%] left-[5%] w-[280px] h-[280px] md:w-[450px] md:h-[450px] opacity-[0.18] animate-[spin_45s_linear_infinite]"
          style={{ filter: "blur(1px)" }} //
        />
        <img
          src={asset5} //
          alt=""
          className="absolute top-[50%] right-[5%] w-[310px] h-[310px] md:w-[490px] md:h-[490px] opacity-[0.14] animate-[spin_55s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }} //
        />
        <img
          src={asset3} //
          alt=""
          className="absolute top-[70%] left-[-8%] w-[290px] h-[290px] md:w-[460px] md:h-[460px] opacity-[0.16] animate-[spin_42s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }} //
        />
        {/* Add more adjusted assets if needed, keeping offsets small */}
      </div>
      {/* END MODIFIED Background Assets */}
      {/* Main Content - Added pt-16 for top nav and pb-24 for mobile bottom nav */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8 pt-20 sm:pt-24 pb-24 sm:pb-8 relative z-10">
        {" "}
        {/* Ensure main content is above background */}
        <div className="max-w-6xl w-full mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 sm:mb-20">
            {/* Multi-Logo Gallery */}
            <div className="relative mx-auto mb-6 sm:mb-8 mt-6 sm:mt-8">
              {/* ... (Keep the logo gallery structure as is) ... */}
              <div className="w-full max-w-5xl mx-auto">
                {/* Massive animated background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 via-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-2xl sm:blur-3xl opacity-10 sm:opacity-15 animate-pulse scale-110"></div>
                <div
                  className="absolute inset-8 bg-gradient-to-r from-orange-300 via-pink-400 to-purple-400 rounded-2xl blur-xl sm:blur-2xl opacity-15 sm:opacity-20 animate-pulse scale-105"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="absolute inset-16 bg-gradient-to-r from-orange-500 via-red-400 to-pink-500 rounded-xl blur-lg sm:blur-xl opacity-10 animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>

                {/* MOBILE: 3-2 Grid Layout */}
                <div className="sm:hidden relative z-10 py-6 px-3">
                  {/* ... (mobile logo layout) ... */}
                  {/* First Row - 3 Logos (2, 3, 4) */}
                  <div className="flex justify-center items-center gap-4 mb-4">
                    {[2, 3, 4].map((logoNumber, index) => (
                      <div
                        key={logoNumber}
                        className="relative transform hover:scale-110 transition-all duration-700 cursor-pointer group"
                        style={{
                          animationDelay: `${index * 0.2}s`,
                          animation: "float 4s ease-in-out infinite",
                        }}
                      >
                        <div className="w-16 h-16 flex items-center justify-center relative">
                          <img
                            src={`/src/assets/${logoNumber}.png`}
                            alt={`Locarto Logo ${logoNumber}`}
                            className="relative z-10 w-14 h-14 object-contain transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110"
                            style={{
                              filter:
                                "drop-shadow(0 15px 35px rgba(255,100,50,0.4)) drop-shadow(0 5px 15px rgba(255,120,60,0.3))",
                            }}
                          />
                          {/* Orbiting dots */}
                          <div
                            className="absolute inset-0 animate-spin"
                            style={{
                              animationDuration: `${18 + index * 2}s`,
                              animationDirection:
                                index % 2 === 0 ? "normal" : "reverse",
                            }}
                          >
                            <div className="absolute top-0 left-1/2 w-1.5 h-1.5 bg-orange-400 rounded-full transform -translate-x-1/2 shadow-lg shadow-orange-300"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Second Row - 2 Logos (1, 5) */}
                  <div className="flex justify-center items-center gap-4">
                    {[1, 5].map((logoNumber, index) => (
                      <div
                        key={logoNumber}
                        className="relative transform hover:scale-110 transition-all duration-700 cursor-pointer group"
                        style={{
                          animationDelay: `${(index + 3) * 0.2}s`,
                          animation: "float 4s ease-in-out infinite",
                        }}
                      >
                        <div className="w-16 h-16 flex items-center justify-center relative">
                          <img
                            src={`/src/assets/${logoNumber}.png`}
                            alt={`Locarto Logo ${logoNumber}`}
                            className="relative z-10 w-14 h-14 object-contain transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110"
                            style={{
                              filter:
                                "drop-shadow(0 15px 35px rgba(255,100,50,0.4)) drop-shadow(0 5px 15px rgba(255,120,60,0.3))",
                            }}
                          />
                          {/* Orbiting dots */}
                          <div
                            className="absolute inset-0 animate-spin"
                            style={{
                              animationDuration: `${14 + index * 2}s`,
                              animationDirection:
                                index % 2 === 0 ? "reverse" : "normal",
                            }}
                          >
                            <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-red-400 rounded-full transform -translate-x-1/2 shadow-lg shadow-red-300"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DESKTOP: Horizontal Layout */}
                <div className="hidden sm:flex relative z-10 justify-center items-center gap-4 sm:gap-6 lg:gap-12 py-6 sm:py-8 px-3 sm:px-4">
                  {/* ... (desktop logo layout) ... */}
                  {[1, 2, 3, 4, 5].map((logoNumber, index) => (
                    <div
                      key={logoNumber}
                      className="relative transform hover:scale-110 transition-all duration-700 cursor-pointer group"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animation: "float 4s ease-in-out infinite",
                      }}
                    >
                      {/* Logo container */}
                      <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center relative">
                        {/* Logo Image */}
                        <img
                          src={`/src/assets/${logoNumber}.png`}
                          alt={`Locarto Logo ${logoNumber}`}
                          className="relative z-10 w-16 h-16 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 object-contain transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110"
                          style={{
                            filter:
                              "drop-shadow(0 15px 35px rgba(255,100,50,0.4)) drop-shadow(0 5px 15px rgba(255,120,60,0.3))",
                          }}
                        />
                        {/* Orbiting animated dots */}
                        <div
                          className="absolute inset-0 animate-spin"
                          style={{
                            animationDuration: `${18 + index * 2}s`,
                            animationDirection:
                              index % 2 === 0 ? "normal" : "reverse",
                          }}
                        >
                          <div className="absolute top-0 left-1/2 w-2 h-2 bg-orange-400 rounded-full transform -translate-x-1/2 shadow-lg shadow-orange-300"></div>
                        </div>
                        <div
                          className="absolute inset-0 animate-spin"
                          style={{
                            animationDuration: `${14 + index * 2}s`,
                            animationDirection:
                              index % 2 === 0 ? "reverse" : "normal",
                          }}
                        >
                          <div className="absolute bottom-0 left-1/2 w-2 h-2 bg-red-400 rounded-full transform -translate-x-1/2 shadow-lg shadow-red-300"></div>
                        </div>
                        <div
                          className="absolute inset-0 animate-spin"
                          style={{
                            animationDuration: `${22 + index * 2}s`,
                            animationDirection: "normal",
                          }}
                        >
                          <div className="absolute top-1/2 right-0 w-1.5 h-1.5 bg-orange-300 rounded-full transform -translate-y-1/2 shadow-lg shadow-orange-200"></div>
                        </div>
                        <div
                          className="absolute inset-0 animate-spin"
                          style={{
                            animationDuration: `${16 + index * 2}s`,
                            animationDirection: "reverse",
                          }}
                        >
                          <div className="absolute top-1/2 left-0 w-1.5 h-1.5 bg-red-300 rounded-full transform -translate-y-1/2 shadow-lg shadow-red-200"></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Global floating particles */}
                {/* ... (floating particles) ... */}
                <div
                  className="absolute -top-6 sm:-top-8 left-1/4 w-3 h-3 sm:w-4 sm:h-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce opacity-60"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <div
                  className="absolute -bottom-4 sm:-bottom-6 right-1/4 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-500 to-red-600 rotate-45 animate-bounce opacity-70"
                  style={{ animationDelay: "0.8s" }}
                ></div>
                <div
                  className="absolute top-1/3 -right-6 sm:-right-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-orange-300 to-orange-500 rounded-full animate-bounce opacity-50"
                  style={{ animationDelay: "1.2s" }}
                ></div>
                <div
                  className="absolute top-1/4 -left-4 sm:-left-6 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-red-400 to-orange-500 rounded-full animate-bounce opacity-60"
                  style={{ animationDelay: "1.6s" }}
                ></div>
                <div
                  className="absolute bottom-1/3 left-1/6 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-orange-400 to-red-500 rounded-full animate-bounce opacity-40"
                  style={{ animationDelay: "2s" }}
                ></div>
                <div
                  className="absolute top-1/2 right-1/6 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full animate-bounce opacity-70"
                  style={{ animationDelay: "2.4s" }}
                ></div>
                {/* Large orbiting elements */}
                <div
                  className="absolute inset-0 animate-spin opacity-20"
                  style={{ animationDuration: "25s" }}
                >
                  <div className="absolute top-4 left-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full transform -translate-x-1/2"></div>
                </div>
                <div
                  className="absolute inset-0 animate-spin opacity-15"
                  style={{
                    animationDuration: "20s",
                    animationDirection: "reverse",
                  }}
                >
                  <div className="absolute bottom-4 left-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-gradient-to-r from-red-400 to-orange-500 rounded-full transform -translate-x-1/2"></div>
                </div>
                <div
                  className="absolute inset-0 animate-spin opacity-25"
                  style={{ animationDuration: "30s" }}
                >
                  <div className="absolute top-1/2 right-6 sm:right-8 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gradient-to-r from-orange-300 to-red-400 rounded-full transform -translate-y-1/2"></div>
                </div>
              </div>
            </div>

            {/* Enhanced Main Heading */}
            <div className="relative mb-4 sm:mb-6 px-2">
              <div className="text-center space-y-2 sm:space-y-3">
                {/* Greeting */}
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-black relative">
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent relative z-10 block animate-pulse leading-tight sm:leading-normal">
                    {getGreeting(name)}
                  </span>
                </h1>

                {/* Welcome Message */}
                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-extrabold relative">
                  <span className="bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent relative z-10 block leading-tight sm:leading-normal">
                    {welcomeMessage} {/* Use the state variable here */}
                  </span>
                </h2>

                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200 blur-3xl opacity-10 scale-110"></div>
              </div>
            </div>

            {/* Enhanced Subtitle */}
            <p className="text-sm sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed font-light px-2">
              <span className="inline-block animate-fade-in-up">
                Discover the
              </span>{" "}
              <span
                className="inline-block animate-fade-in-up text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text font-semibold"
                style={{ animationDelay: "0.2s" }}
              >
                best emerging brands
              </span>{" "}
              <span
                className="inline-block animate-fade-in-up"
                style={{ animationDelay: "0.4s" }}
              >
                across the country
              </span>
            </p>

            {/* Premium Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative inline-block group w-full max-w-2xl mx-auto px-2 sm:px-0" //
            >
              {/* ... (search bar content) ... */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-full blur-lg sm:blur-xl opacity-20 scale-105 group-hover:opacity-30 transition-all duration-500"></div>
                <div className="relative bg-white rounded-full shadow-xl sm:shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-gray-100 group-hover:border-orange-200 flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search for personal care, accessories..."
                    className="flex-grow px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 md:py-5 pr-2 rounded-l-full focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent text-xs sm:text-base md:text-lg font-medium"
                  />
                  {/* Explore Button */}
                  <Link
                    to="/map"
                    className="mx-1.5 sm:mx-3 h-7 sm:h-9 md:h-10 px-3 sm:px-5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-105 transform shadow-lg hover:shadow-xl text-[10px] sm:text-sm font-semibold whitespace-nowrap"
                    title="Explore Map"
                  >
                    Explore
                  </Link>
                  {/* Search Button */}
                  <div className="pr-1.5 sm:pr-3 md:pr-4 group-hover:scale-110 transition-transform duration-300">
                    <button
                      type="submit"
                      className="w-7 h-7 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg focus:outline-none"
                    >
                      <SearchIcon />
                    </button>
                  </div>
                </div>
                {/* Floating suggestion pills */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 hidden md:flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {["Personal Care", "Accessories"].map((category, index) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() =>
                        navigate(
                          `/map?category=${category
                            .toLowerCase()
                            .replace(" ", "%20")}`
                        )
                      }
                      className="px-4 py-2 bg-white/80 backdrop-blur-sm text-gray-600 text-sm rounded-full shadow-lg border border-gray-200 animate-fade-in-up hover:bg-white hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>

          <style>{`
             /* ... (keep existing keyframes and styles) ... */
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
          `}</style>

          {/* Popular Products Section */}
          <section className="mb-12 sm:mb-16 px-2 sm:px-0">
            {/* ... (keep popular products section as is) ... */}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
                >
                  <div
                    className={`h-40 sm:h-48 bg-gradient-to-br ${product.bgColor} flex items-center justify-center text-5xl sm:text-6xl relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/10"></div>
                    <span className="relative z-10 drop-shadow-lg">
                      {product.image}
                    </span>
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-1.5 sm:p-2">
                        <i className="fas fa-heart text-white text-xs sm:text-sm opacity-70 hover:opacity-100 transition-opacity"></i>
                      </div>
                    </div>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-1.5 sm:mb-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3 sm:mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xl sm:text-2xl font-bold text-orange-600">
                        {product.price}
                      </span>
                      <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Beta Signup Section */}
          <section className="bg-gradient-to-br from-[#353695] via-[#4a4db5] to-[#5b5fc7] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl mb-6 sm:mb-8 relative overflow-hidden mx-2 sm:mx-0">
            {/* ... (keep beta signup section as is) ... */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div
                className="absolute bottom-10 right-10 w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full blur-lg animate-pulse"
                style={{ animationDelay: "0.5s" }}
              ></div>
              <div
                className="absolute top-1/2 left-1/4 w-10 h-10 sm:w-12 sm:h-12 bg-white/5 rounded-full blur-md animate-pulse"
                style={{ animationDelay: "1s" }}
              ></div>
            </div>
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Limited Beta Access
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent px-2">
                Reserve your spot, Sign up for our Beta
              </h3>
              <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed px-2">
                Be one of the first to explore the future of local discovery.
                Gain exclusive early access and help shape Locarto the way you
                want it
              </p>
              <form className="max-w-lg mx-auto space-y-3 sm:space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white text-sm sm:text-base"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white text-sm sm:text-base"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-rocket"></i>
                    Reserve My Spot
                  </span>
                </button>
              </form>
              <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm opacity-80">
                <div className="flex items-center gap-2">
                  <i className="fas fa-check text-green-300"></i>
                  <span>No spam, ever</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-users text-blue-300"></i>
                  <span>Join 1,000+ early adopters</span>
                </div>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl mb-12 sm:mb-16 mx-2 sm:mx-0">
            {/* ... (keep newsletter section as is) ... */}
            <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4">
              Stay Updated
            </h3>
            <p className="text-base sm:text-lg mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-2">
              Subscribe for the latest updates and promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 text-sm sm:text-base"
              />
              <button className="bg-white text-orange-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </section>
        </div>
      </main>
      {/* Footer */}
      <Footer />
      {/* Error Message Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          {/* ... (keep error modal content as is) ... */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 mx-4 transform animate-in">
            <div className="flex justify-between items-start mb-4 sm:mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600 text-sm sm:text-base"></i>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  Oops!
                </h3>
              </div>
              <button
                onClick={closeError}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
              The category "
              <span className="font-semibold text-red-600">{searchQuery}</span>"
              is not available yet.
            </p>
            <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
              Try one of these available categories:
            </p>
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSuggestionClick(category)}
                  className="px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105 text-sm sm:text-base"
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