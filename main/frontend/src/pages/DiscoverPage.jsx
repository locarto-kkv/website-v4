// src/pages/DiscoverPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import locartoImg from "../assets/locarto.png"; // Import the images
import snabbitImg from "../assets/snabbitimage.png";
import Insta from "../assets/insta.png";
import Youtube from "../assets/yt.png";
import Whatsapp from "../assets/whatsapp.png";
// import backgroundImg from "../assets/landing_background.png"; // No longer needed
import BrandIdentityCard from "../components/landing/card.jsx";

// Import the brand data
import brandData from "../branddata.js"; // Adjust the path if needed

const DiscoverPage = () => {
  const [email, setEmail] = useState("");
  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Define your logos array here
  const logos = [
    { src: snabbitImg, alt: "Snabbit" },
    { src: locartoImg, alt: "Locarto" },
  ];

  useEffect(() => {
    if (logos.length <= 1) {
      console.log("Only one or no logos provided, rotation disabled.");
      return;
    }

    const intervalId = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logos.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [logos.length]);

  // Assign images to the brand data based on ID
  const brandsWithImages = brandData.map((brand) => {
    if (brand.id === "snabbit") return { ...brand, image: snabbitImg };
    if (brand.id === "locarto") return { ...brand, image: locartoImg };
    // Add more conditions if you have other brands
    return brand;
  });

  // Use the brandsWithImages array instead of the hardcoded one
  // You can display all of them or a specific subset
  // For example, if you want to repeat the available brands to fill 9 cards:
  const brandCards = [];
  for (let i = 0; i < 9; i++) {
    brandCards.push(brandsWithImages[i % brandsWithImages.length]);
  }

  const handleReadMore = (brandId) => {
    console.log("Read More clicked for brand ID:", brandId);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    alert(`Subscribed with: ${email}`);
    setEmail("");
  };

  return (
    // Changed text color to #0D1539 and background to white
    <div
      className="font-sans flex flex-col text-[#0D1539] min-h-screen bg-white" // Updated classes
      // Removed the background image style
    >
      {/* Navbar */}
      <Navbar pageType="discover" />

        {/* Main Content */}
        <main className="flex-1 pt-24 pb-16 px-4 md:px-8">
        {/* Logo Box */}
        {/* Updated background and border colors for the logo box */}
        <div className="mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg 
                        border-2 border-[#0D1539]/40 overflow-hidden flex justify-center items-center 
                        max-w-3xl mx-auto h-56 md:h-72 relative">
            {logos.map((logo, index) => {
            const opacity = index === currentLogoIndex ? 1 : 0;
            const zIndex = index === currentLogoIndex ? 10 : 0;

            return (
                <img
                key={logo.alt}
                src={logo.src}
                alt={logo.alt}
                className="absolute inset-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out"
                style={{ opacity, zIndex }}
                />
            );
            })}
        </div>
        {/* Header with back arrow */}
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link 
              to="/landing" // Fixed: Changed from "/discover" to "/landing"
              className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-lg" // Updated button style
              aria-label="Go back to home"
            >
              <svg 
                className="w-6 h-6 text-[#0D1539]" // Updated icon color
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15 19l-7-7 7-7" 
                />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">Brands You've Been Searching For</h1>
          </div>
          <button className="text-xl p-2 hover:text-orange-400 transition-colors">
            <i className="fas fa-filter"></i>
          </button>
        </div>

        {/* Grid of BrandIdentityCard Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {brandCards.map((cardData, index) => (
            <BrandIdentityCard
              key={`${cardData.id}-${index}`} // Use ID and index for unique key
              brand={cardData} // Use the data from branddata.js with images assigned
              showContent={true}
              onReadMore={handleReadMore}
            />
          ))}
        </div>


        {/* New Banner Section */}
        {/* Removed background color, text color is inherited */}
        <div className="mt-24 py-12 md:py-16 px-4 text-center">
            <h2 className="text-4xl md:text-6xl text-[#0D1539] mb-4"> {/* Applied blue color */}
            This is just the Beginning
            </h2>
            <p className="text-xl md:text-2xl text-[#0D1539] opacity-90"> {/* Applied blue color */}
            The best it yet to come!
            </p>
        </div>

        {/* Email Subscription Section */}
        {/* Removed background color, text color is inherited */}
        <div className="py-8 px-4 text-center">
            <div className="max-w-xl mx-auto">
            <div className="flex items-stretch border border-[#0D1539]/30 rounded-full overflow-hidden"> {/* Updated border color */}
                <input
                type="email"
                placeholder="emailaddress@gmail.com"
                className="flex-1 px-4 py-2 text-sm text-[#0D1539] bg-transparent focus:outline-none placeholder:text-[#0D1539]/70" /* Applied blue text and placeholder color */
                />
                <button className="px-4 py-2 text-sm font-medium bg-[#0D1539] text-white hover:bg-[#1A244C] transition-colors duration-200 whitespace-nowrap rounded-full"> {/* Changed button colors for visibility */}
                Plug into the rhythm
                </button>
            </div>
            </div>
        </div>

        {/* Social Media Buttons */}
        {/* Removed background color, text color is inherited */}
        <div className="py-8 px-4 text-center">
            <div className="max-w-xl mx-auto flex justify-center gap-1">
            <a href="https://instagram.com      " target="_blank" rel="noopener noreferrer" className="group">
                <img
                src={Insta}
                alt="Instagram"
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                />
            </a>

            <a href="https://youtube.com      " target="_blank" rel="noopener noreferrer" className="group">
                <img
                src={Youtube}
                alt="YouTube"
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                />
            </a>

            <a href="https://wa.me/yournumber      " target="_blank" rel="noopener noreferrer" className="group">
                <img
                src={Whatsapp}
                alt="WhatsApp"
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                />
            </a>
            </div>
        </div>

        {/* Removed background color, text color is inherited */}
        <div className="-mt-8 py-6 px-4 text-center">
            <h3 className="text-lg md:text-xl font-light text-[#0D1539]/70 inline-block"> {/* Applied blue color with opacity */}
            Making it worthwhile.
            </h3>
        </div>
      </main>

      {/* Locarto Logo Banner - Bottom */}
      {/* Removed background color */}
      <div className=" w-full overflow-hidden">
        <div className="relative w-full h-48 md:h-64 lg:h-80">
          <img
            src={locartoImg}
            alt="Locarto"
            className="absolute inset-0 w-full h-auto object-contain object-center -translate-y-[10%]"
          />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DiscoverPage;