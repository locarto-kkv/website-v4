// src/pages/Homepage.jsx
import React, { useState } from "react";
import SearchIcon from "../components/SearchIcon";
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";

const Homepage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showError, setShowError] = useState(false);
  const [suggestedCategory, setSuggestedCategory] = useState('');
  const navigate = useNavigate();

  // Available categories
  const availableCategories = ['wellness', 'lifestyle', 'accessories'];

  // Popular Products Data
  const popularProducts = [
    {
      id: 1,
      name: "Healthy Salad Bowl",
      description: "Fresh greens, quinoa, tomatoes, and avocado",
      price: "$12.99",
      image: "🥗",
      category: "wellness",
      bgColor: "from-green-400 to-emerald-500"
    },
    {
      id: 2,
      name: "Classic Pepperoni Pizza",
      description: "Cheesy, saucy, and perfectly crispy crust",
      price: "$18.50",
      image: "🍕",
      category: "lifestyle",
      bgColor: "from-red-400 to-orange-500"
    },
    {
      id: 3,
      name: "Relaxing Spa Kit",
      description: "Essential oils and bath bombs for the ultimate day of pampering",
      price: "$49.99",
      image: "🧴",
      category: "wellness",
      bgColor: "from-purple-400 to-pink-500"
    },
    {
      id: 4,
      name: "Monthly Gym Pass",
      description: "Access to all facilities and state-of-the-art machines",
      price: "$35.00",
      image: "🏋️",
      category: "wellness",
      bgColor: "from-blue-400 to-indigo-500"
    }
  ];

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

  const handleProductClick = (product) => {
    // Navigate to map with the product's category
    navigate(`/map?category=${product.category}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <Navbar pageType="homepage" />
      
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-6xl w-full mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            {/* Multi-Logo Gallery with Spectacular Animations */}
            <div className="relative mx-auto mb-16">
              <div className="w-full max-w-5xl mx-auto">
                {/* Massive animated background effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-500 via-pink-500 via-purple-500 to-blue-500 rounded-3xl blur-3xl opacity-15 animate-pulse scale-110"></div>
                <div className="absolute inset-8 bg-gradient-to-r from-orange-300 via-pink-400 to-purple-400 rounded-2xl blur-2xl opacity-20 animate-pulse scale-105" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute inset-16 bg-gradient-to-r from-orange-500 via-red-400 to-pink-500 rounded-xl blur-xl opacity-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                
                {/* Horizontal Logo Container */}
                <div className="relative z-10 flex justify-center items-center gap-8 lg:gap-12 py-12 px-4">
                  {/* Logo Images Array */}
                  {[1, 2, 3, 4, 5].map((logoNumber, index) => (
                    <div 
                      key={logoNumber}
                      className="relative transform hover:scale-125 transition-all duration-1000 cursor-pointer group"
                      style={{
                        animationDelay: `${index * 0.2}s`,
                        animation: 'float 4s ease-in-out infinite'
                      }}
                    >
                      {/* Individual logo container with unique effects */}
                      <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 flex items-center justify-center relative">
                        {/* Animated glow behind each logo */}
                        <div 
                          className={`absolute inset-0 bg-gradient-to-r rounded-2xl blur-md opacity-30 group-hover:opacity-60 transition-all duration-700 animate-pulse`}
                          style={{
                            background: `linear-gradient(45deg, 
                              ${index === 0 ? '#ff6b6b, #ff8e53' : 
                                index === 1 ? '#4ecdc4, #44a08d' : 
                                index === 2 ? '#a8edea, #fed6e3' : 
                                index === 3 ? '#ffecd2, #fcb69f' : 
                                '#ff9a9e, #fecfef'})`,
                            animationDelay: `${index * 0.3}s`
                          }}
                        ></div>
                        
                        {/* Rotating ring effect */}
                        <div 
                          className="absolute inset-0 border-2 border-gradient rounded-2xl animate-spin opacity-20"
                          style={{ 
                            borderImage: `linear-gradient(45deg, transparent, ${
                              index === 0 ? '#ff6b6b' : 
                              index === 1 ? '#4ecdc4' : 
                              index === 2 ? '#a8edea' : 
                              index === 3 ? '#ffecd2' : 
                              '#ff9a9e'
                            }, transparent) 1`,
                            animationDuration: `${3 + index}s`,
                            animationDirection: index % 2 === 0 ? 'normal' : 'reverse'
                          }}
                        ></div>
                        
                        {/* Logo Image */}
                        <img 
                          src={`/src/assets/${logoNumber}.png`}
                          alt={`Locarto Logo ${logoNumber}`} 
                          className="relative z-10 w-20 h-auto sm:w-24 md:w-28 lg:w-32 filter drop-shadow-2xl group-hover:drop-shadow-3xl transition-all duration-700 transform group-hover:rotate-6"
                          style={{
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3)) brightness(1.1) contrast(1.1)',
                            backgroundColor: 'transparent',
                            mixBlendMode: 'normal'
                          }}
                        />
                        
                        {/* Animated shine effect overlay */}
                        <div 
                          className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1500 skew-x-12 rounded-2xl overflow-hidden"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        ></div>
                        
                        {/* Pulsating dot indicators */}
                        <div 
                          className={`absolute -top-2 -right-2 w-3 h-3 rounded-full animate-ping`}
                          style={{
                            backgroundColor: index === 0 ? '#ff6b6b' : 
                                           index === 1 ? '#4ecdc4' : 
                                           index === 2 ? '#a8edea' : 
                                           index === 3 ? '#ffecd2' : 
                                           '#ff9a9e',
                            animationDelay: `${index * 0.4}s`
                          }}
                        ></div>
                        
                        {/* Floating micro particles */}
                        <div 
                          className="absolute -top-4 -left-2 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce opacity-70"
                          style={{ animationDelay: `${index * 0.2 + 0.1}s` }}
                        ></div>
                        <div 
                          className="absolute -bottom-3 -right-3 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full animate-bounce opacity-60"
                          style={{ animationDelay: `${index * 0.2 + 0.8}s` }}
                        ></div>
                      </div>
                      
                      {/* Individual orbiting elements */}
                      <div 
                        className="absolute inset-0 animate-spin opacity-40"
                        style={{ 
                          animationDuration: `${15 + index * 2}s`,
                          animationDirection: index % 2 === 0 ? 'normal' : 'reverse'
                        }}
                      >
                        <div 
                          className={`absolute top-0 left-1/2 w-2 h-2 rounded-full transform -translate-x-1/2`}
                          style={{
                            backgroundColor: index === 0 ? '#ff6b6b' : 
                                           index === 1 ? '#4ecdc4' : 
                                           index === 2 ? '#a8edea' : 
                                           index === 3 ? '#ffecd2' : 
                                           '#ff9a9e'
                          }}
                        ></div>
                      </div>
                      
                      {/* Counter-rotating element */}
                      <div 
                        className="absolute inset-0 animate-spin opacity-30"
                        style={{ 
                          animationDuration: `${10 + index}s`,
                          animationDirection: index % 2 === 0 ? 'reverse' : 'normal'
                        }}
                      >
                        <div 
                          className={`absolute bottom-0 left-1/2 w-1.5 h-1.5 rounded-full transform -translate-x-1/2`}
                          style={{
                            backgroundColor: index === 0 ? '#orange' : 
                                           index === 1 ? '#cyan' : 
                                           index === 2 ? '#pink' : 
                                           index === 3 ? '#yellow' : 
                                           '#purple'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Global floating particles with rainbow colors */}
                <div className="absolute -top-8 left-1/4 w-4 h-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '0.2s' }}></div>
                <div className="absolute -bottom-6 right-1/4 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-500 rotate-45 animate-bounce opacity-70" style={{ animationDelay: '0.8s' }}></div>
                <div className="absolute top-1/3 -right-8 w-2 h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full animate-bounce opacity-50" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute top-1/4 -left-6 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce opacity-60" style={{ animationDelay: '1.6s' }}></div>
                <div className="absolute bottom-1/3 left-1/6 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full animate-bounce opacity-40" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 right-1/6 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full animate-bounce opacity-70" style={{ animationDelay: '2.4s' }}></div>
                
                {/* Large orbiting elements */}
                <div className="absolute inset-0 animate-spin opacity-20" style={{ animationDuration: '25s' }}>
                  <div className="absolute top-4 left-1/2 w-3 h-3 bg-gradient-to-r from-orange-400 to-red-500 rounded-full transform -translate-x-1/2"></div>
                </div>
                <div className="absolute inset-0 animate-spin opacity-15" style={{ animationDuration: '20s', animationDirection: 'reverse' }}>
                  <div className="absolute bottom-4 left-1/2 w-2.5 h-2.5 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full transform -translate-x-1/2"></div>
                </div>
                <div className="absolute inset-0 animate-spin opacity-25" style={{ animationDuration: '30s' }}>
                  <div className="absolute top-1/2 right-8 w-2 h-2 bg-gradient-to-r from-green-400 to-teal-500 rounded-full transform -translate-y-1/2"></div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Main Heading with Multiple Effects */}
            <div className="relative mb-12">
              <div className="text-center space-y-4">
                <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl font-black relative">
                  <span className="bg-gradient-to-r from-gray-900 via-black to-gray-800 bg-clip-text text-transparent relative z-10 block leading-normal">
                    What are you in the
                  </span>
                </h1>
                <h1 className="text-4xl sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl font-black relative">
                  <span className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent relative z-10 block animate-pulse leading-normal">
                    mood for today?
                  </span>
                </h1>
                
                {/* Subtle background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-200 blur-3xl opacity-10 scale-110"></div>
              </div>
            </div>
            
            {/* Enhanced Subtitle with Animation */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed font-light">
              <span className="inline-block animate-fade-in-up">Discover the </span>{' '}
              <span className="inline-block animate-fade-in-up text-transparent bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text font-semibold" style={{ animationDelay: '0.2s' }}>best emerging brands </span>{' '}
              <span className="inline-block animate-fade-in-up" style={{ animationDelay: '0.4s' }}>across the country</span>{' '}
            </p>
            
            {/* Premium Search Bar */}
            <form onSubmit={handleSearch} className="relative inline-block group w-full max-w-2xl mx-auto">
              <div className="relative">
                {/* Animated background glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-full blur-xl opacity-20 scale-105 group-hover:opacity-30 transition-all duration-500"></div>
                
                {/* Main search input */}
                <div className="relative bg-white rounded-full shadow-2xl group-hover:shadow-3xl transition-all duration-500 border border-gray-100 group-hover:border-orange-200">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleInputChange}
                    placeholder="Search for food, services, products..."
                    className="w-full px-4 sm:px-6 md:px-8 py-4 md:py-5 pr-16 sm:pr-20 md:pr-24 rounded-full focus:outline-none text-gray-900 placeholder-gray-400 bg-transparent text-sm sm:text-base md:text-lg font-medium"
                  />
                  
                  {/* Globe Icon - Always visible, responsive positioning */}
                  <div className="absolute right-12 sm:right-16 md:right-20 top-1/2 transform -translate-y-1/2">
                    <Link 
                      to="/map" 
                      className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full flex items-center justify-center hover:from-blue-600 hover:to-purple-600 transition-all duration-300 hover:scale-110 transform shadow-lg hover:shadow-xl"
                      title="View on Map"
                    >
                      <i className="fas fa-globe text-xs md:text-sm"></i>
                    </Link>
                  </div>
                  
                  {/* Search Icon with Animation */}
                  <div className="absolute right-3 sm:right-4 md:right-6 top-1/2 transform -translate-y-1/2 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                      <SearchIcon />
                    </div>
                  </div>
                </div>
                
                {/* Floating suggestion pills - Hidden on mobile */}
                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 hidden md:flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500">
                  {['Wellness', 'Lifestyle', 'Accessories'].map((category, index) => (
                    <button
                      key={category}
                      onClick={() => navigate(`/map?category=${category.toLowerCase()}`)}
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

          <style jsx>{`
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
          <section className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Featured Products
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {popularProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 overflow-hidden"
                >
                  {/* Product Image/Icon */}
                  <div className={`h-48 bg-gradient-to-br ${product.bgColor} flex items-center justify-center text-6xl relative overflow-hidden`}>
                    <div className="absolute inset-0 bg-black/10"></div>
                    <span className="relative z-10 drop-shadow-lg">{product.image}</span>
                    <div className="absolute top-4 right-4">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <i className="fas fa-heart text-white text-sm opacity-70 hover:opacity-100 transition-opacity"></i>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Info */}
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      {product.description}
                    </p>
                    
                    {/* Price and Action */}
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-orange-600">
                        {product.price}
                      </span>
                      <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Hover Effect Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Beta Signup Section */}
          <section className="bg-gradient-to-br from-[#353695] via-[#4a4db5] to-[#5b5fc7] rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl mb-8 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0">
              <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full blur-lg animate-pulse" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full blur-md animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                Limited Beta Access
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black mb-4 bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                 Reserve your spot, Sign up for our Beta

              </h3>
              
              <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Be one of the first to explore the future of local discovery. Gain exclusive early access and help shape Locarto the way you want it
              </p>
              
              <form className="max-w-lg mx-auto space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    placeholder="Your full name"
                    className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                <div className="relative group">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-6 py-4 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30 bg-white/95 backdrop-blur-sm font-medium shadow-lg transition-all duration-300 group-hover:bg-white"
                  />
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1"
                >
                  <span className="flex items-center justify-center gap-2">
                    <i className="fas fa-rocket"></i>
                    Reserve My Spot
                  </span>
                </button>
              </form>
              
              <div className="mt-6 flex items-center justify-center gap-6 text-sm opacity-80">
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
          <section className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 md:p-12 text-center text-white shadow-2xl mb-16">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Stay Updated
            </h3>
            <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
              Subscribe for the latest updates and promotions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-3 rounded-full text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              <button className="bg-white text-orange-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:scale-105">
                Subscribe
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Locarto Brand Section */}
            <div className="md:col-span-1">
              <Link to="/" className="text-2xl font-bold text-orange-500 mb-4 block hover:text-orange-600 transition-colors">
                Locarto
              </Link>
              <p className="text-gray-600 text-sm leading-relaxed">
                Your one-stop destination for local products and services.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/landing" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-gray-600 hover:text-orange-500 transition-colors text-sm">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Connect With Us */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors"
                >
                  <i className="fab fa-twitter text-sm"></i>
                </a>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
                >
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
                >
                  <i className="fab fa-instagram text-sm"></i>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="font-bold text-gray-800 mb-4">Newsletter</h3>
              <p className="text-gray-600 text-sm mb-4">
                Subscribe for the latest updates and promotions.
              </p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
                <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-gray-600 text-sm">
              © 2025 Locarto. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
      
      {/* Error Message Modal */}
      {showError && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 mx-4 transform animate-in">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-exclamation-triangle text-red-600"></i>
                </div>
                <h3 className="text-xl font-bold text-gray-800">Oops!</h3>
              </div>
              <button 
                onClick={closeError}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <p className="text-gray-700 mb-4">
              The category "<span className="font-semibold text-red-600">{searchQuery}</span>" is not available yet.
            </p>
            <p className="text-gray-600 mb-6">Try one of these popular categories:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {availableCategories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleSuggestionClick(category)}
                  className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
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