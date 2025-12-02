import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore.jsx";
import { useDataStore } from "../store/useDataStore.jsx";
import { useConsumerDataStore } from "../store/consumer/consumerDataStore.jsx";
import { useVendorDataStore } from "../store/vendor/vendorDataStore.jsx";
import { ConsumerSearchService } from "../services/consumer/consumerSearchService.js";
import { getGreeting } from "../lib/utils.js";
import { getRandomMsg } from "../services/welcomeMsgs.js";
import { submitBeta } from "../services/betaService.js";

import SearchIcon from "../components/SearchIcon.jsx";
import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";
import InteractiveGrid from "../components/landing/InteractiveGrid.jsx";

// Background Assets - Now using public folder paths
const asset1 = "/assets/1.png";
const asset2 = "/assets/2.png";
const asset3 = "/assets/3.png";
const asset4 = "/assets/4.png";
const asset5 = "/assets/5.png";

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({
    products: [],
    vendors: [],
  });
  const [showDropdown, setShowDropdown] = useState(false);
  const [showError, setShowError] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState("");
  const [name, setName] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [betaForm, setBetaForm] = useState({ name: "", email: "" });

  const navigate = useNavigate();
  const currentUser = useAuthStore((s) => s.currentUser);
  const recommends = useDataStore((s) => s.recommends);
  const consumerProfile = useConsumerDataStore((s) => s.profile);
  const vendorProfile = useVendorDataStore((s) => s.profile);

  const availableCategories = ["personal care", "accessories"];

  // Function to handle email submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitBeta(betaForm);
    setBetaForm({ name: "", email: "" });
  };

  // handle live search input + API call
  const handleInputChange = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (showError) setShowError(false);

    if (query.trim().length === 0) {
      setShowDropdown(false);
      setSearchResults({ products: [], vendors: [] });
      return;
    }

    try {
      const results = await ConsumerSearchService.getSearchResults(query);
      if (
        results &&
        (results.products.length > 0 || results.vendors.length > 0)
      ) {
        setSearchResults(results);
        setShowDropdown(true);
      } else {
        setSearchResults({ products: [], vendors: [] });
        setShowDropdown(false);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (category) => {
    navigate(`/map?category=${category.replace(" ", "%20")}`);
    closeError();
  };

  const closeError = () => {
    setShowError(false);
    setSearchQuery("");
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.product_uuid}`);
    setShowDropdown(false);
  };

  const handleVendorClick = (vendor) => {
    navigate(`/vendor/${vendor.id}/products/all`);
    setShowDropdown(false);
  };

  // --- UPDATED SEARCH HANDLER ---
  const handleSearch = (e) => {
    e.preventDefault();
    // Redirect to search results page if query is not empty
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  // ------------------------------

  useEffect(() => {
    if (currentUser?.type === "consumer") {
      setName(consumerProfile.name);
    } else if (currentUser?.type === "vendor") {
      setName(vendorProfile.name);
    } else {
      setName("");
    }
  }, [currentUser]);

  useEffect(() => {
    setWelcomeMessage(getRandomMsg());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden">
      <Navbar pageType="landing" />
      {/* Background Assets */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <img
          src={asset1}
          alt=""
          className="absolute top-[-5%] left-[-5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] opacity-[0.15] animate-[spin_40s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset4}
          alt=""
          className="absolute top-[5%] right-[-5%] w-[300px] h-[300px] md:w-[450px] md:h-[450px] opacity-[0.12] animate-[spin_50s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset2}
          alt=""
          className="absolute top-[30%] left-[5%] w-[280px] h-[280px] md:w-[450px] md:h-[450px] opacity-[0.18] animate-[spin_45s_linear_infinite]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset5}
          alt=""
          className="absolute top-[50%] right-[5%] w-[310px] h-[310px] md:w-[490px] md:h-[490px] opacity-[0.14] animate-[spin_55s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
        <img
          src={asset3}
          alt=""
          className="absolute top-[70%] left-[-8%] w-[290px] h-[290px] md:w-[460px] md:h-[460px] opacity-[0.16] animate-[spin_42s_linear_infinite_reverse]"
          style={{ filter: "blur(1px)" }}
        />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-3 sm:px-4 py-6 sm:py-8 pt-20 sm:pt-24 pb-24 sm:pb-8 relative z-10">
        <div className="max-w-6xl w-full mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16 sm:mb-20">
            {/* Multi-Logo Gallery */}
            <div className="relative mx-auto mb-6 sm:mb-8 mt-6 sm:mt-8">
              <div className="w-full max-w-5xl mx-auto">
                {/* Background effects */}
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
                            src={`/assets/${logoNumber}.png`}
                            alt={`Locarto Logo ${logoNumber}`}
                            className="relative z-10 w-14 h-14 object-contain transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110"
                            style={{
                              filter:
                                "drop-shadow(0 15px 35px rgba(255,100,50,0.4)) drop-shadow(0 5px 15px rgba(255,120,60,0.3))",
                            }}
                          />
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
                            src={`/assets/${logoNumber}.png`}
                            alt={`Locarto Logo ${logoNumber}`}
                            className="relative z-10 w-14 h-14 object-contain transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110"
                            style={{
                              filter:
                                "drop-shadow(0 15px 35px rgba(255,100,50,0.4)) drop-shadow(0 5px 15px rgba(255,120,60,0.3))",
                            }}
                          />
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
                  {[1, 2, 3, 4, 5].map((logoNumber, index) => (
                    <div
                      key={logoNumber}
                      className="relative transform hover:scale-110 transition-all duration-700 cursor-pointer group"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animation: "float 4s ease-in-out infinite",
                      }}
                    >
                      <div className="w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 flex items-center justify-center relative">
                        <img
                          src={`/assets/${logoNumber}.png`}
                          alt={`Locarto Logo ${logoNumber}`}
                          className="relative z-10 w-16 h-16 md:w-20 md:h-20 lg:w-22 lg:h-22 xl:w-24 xl:h-24 object-contain transition-all duration-700 transform group-hover:rotate-12 group-hover:scale-110"
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

                {/* Floating particles */}
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
              </div>
            </div>

            {/* Enhanced Main Heading */}
            <div className="relative mb-4 sm:mb-6 px-2">
              <div className="text-center space-y-2 sm:space-y-3">
                <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl font-black relative">
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent relative z-10 block animate-pulse leading-tight sm:leading-normal">
                    {getGreeting(name)}
                  </span>
                </h1>

                <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl font-extrabold relative">
                  <span className="bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent relative z-10 block leading-tight sm:leading-normal">
                    {welcomeMessage}
                  </span>
                </h2>

                <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200 blur-3xl opacity-10 scale-110"></div>
              </div>
            </div>

            {/* Subtitle */}
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

            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="relative inline-block group w-full max-w-3xl mx-auto px-2 sm:px-0"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-full blur-lg sm:blur-xl opacity-20 scale-105 group-hover:opacity-30 transition-all duration-500"></div>
                <div className="relative bg-white rounded-full shadow-xl sm:shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-gray-100 group-hover:border-orange-200 flex items-center p-1.5">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search for a product, or brand...."
                    className="flex-grow px-3 sm:px-6 md:px-8 py-2.5 sm:py-4 md:py-4 rounded-l-full focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent text-xs sm:text-base md:text-lg font-medium min-w-0"
                  />
                  
                  {/* --- DISCOVER BUTTON (Map) --- */}
                  <Link
                    to="/map"
                    className="flex items-center gap-2 mx-1.5 px-3 sm:px-5 py-2 sm:py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm font-bold whitespace-nowrap"
                    title="View on Map"
                  >
                     <i className="fas fa-map-marked-alt text-white"></i>
                     <span className="hidden sm:inline">Discover</span>
                  </Link>

                  {/* --- SEARCH BUTTON --- */}
                  <div className="pr-1">
                    <button
                      type="submit"
                      className="flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 text-xs sm:text-sm font-bold whitespace-nowrap"
                    >
                      <div className="w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center">
                          <SearchIcon />
                      </div>
                      <span>Search</span>
                    </button>
                  </div>
                </div>

                {/* Dropdown Results */}
                {showDropdown && (
                  <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-72 overflow-y-auto z-50 text-left">
                    {searchResults.products.length === 0 &&
                    searchResults.vendors.length === 0 ? (
                      <div className="p-4 text-gray-500 text-sm">
                        No results found.
                      </div>
                    ) : (
                      <>
                        {searchResults.products.map((product) => (
                          <div
                            key={`product-${product.id}`}
                            onClick={() => handleProductClick(product)}
                            className="flex justify-between items-center px-5 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none transition"
                          >
                            <span className="font-medium text-gray-800">
                              {product.name}
                            </span>
                            <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              Product
                            </span>
                          </div>
                        ))}

                        {searchResults.vendors.map((vendor) => (
                          <div
                            key={`vendor-${vendor.id}`}
                            onClick={() => handleVendorClick(vendor)}
                            className="flex justify-between items-center px-5 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-none transition"
                          >
                            <span className="font-medium text-gray-800">
                              {vendor.name}
                            </span>
                            <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                              Vendor
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
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
          `}</style>

          {/* --- REPLACED VendorsSlider WITH InteractiveGrid --- */}
          <InteractiveGrid
            title="Brands Handpicked for you"
            subtitle="Meet the innovative brands shaping tomorrow's marketplace"
            data={recommends.vendors || []}
            type="vendor"
          />
          {/* --- END REPLACEMENT --- */}

          {/* --- REPLACED ProductsSlider WITH InteractiveGrid --- */}
          <InteractiveGrid
            title="Recommended Products"
            subtitle="Curated collections from emerging brands you'll love"
            data={recommends.products || []}
            type="product"
          />
          {/* --- END REPLACEMENT --- */}

          {/* Beta Signup Section */}
          <section className="bg-gradient-to-br from-[#353695] via-[#4a4db5] to-[#5b5fc7] rounded-2xl sm:rounded-3xl p-6 sm:p-8 md:p-12 text-center text-white shadow-2xl mb-6 sm:mb-8 relative overflow-hidden mx-2 sm:mx-0">
            {/* Background effects */}
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
              <form
                onSubmit={handleSubmit}
                className="max-w-lg mx-auto space-y-3 sm:space-y-4"
              >
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Your full name"
                    name="name"
                    value={betaForm.name}
                    onChange={(e) =>
                      setBetaForm((prev) => ({ ...prev, name: e.target.value }))
                    }
                    required
                    className="w-full px-4 sm:px-6 py-3 sm:py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white text-sm sm:text-base"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <div className="relative group">
                  <input
                    type="email"
                    name="email"
                    placeholder="Your email address"
                    value={betaForm.email}
                    onChange={(e) =>
                      setBetaForm((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    required
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
        </div>
      </main>
      {/* Footer */}
      <Footer />
      {/* Error Message Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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

export default LandingPage;