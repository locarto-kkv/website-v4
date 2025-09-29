// src/pages/BrandInfoPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import brandData from "../branddata.js";
import Insta from "../assets/insta.png";
import Youtube from "../assets/yt.png";
import Whatsapp from "../assets/whatsapp.png";
import locartoImg from "../assets/locarto.png"; // Import the images

// import backgroundImg from "../assets/landing_background.png"; // No longer needed
import BrandIdentityCard from "../components/landing/card.jsx";

const BrandInfoPage = () => {
  const { brandId } = useParams(); // Get brand ID from URL
  const [brand, setBrand] = useState(null);

  useEffect(() => {
    const foundBrand = brandData.find((b) => b.id === brandId);
    if (foundBrand) {
      setBrand(foundBrand);
    }
  }, [brandId]);

  if (!brand) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0D1539] text-white">
        Brand not found.
      </div>
    );
  }

  return (
    // Changed text color to #0D1539 and background to white
    <div className="font-sans text-[#0D1539] min-h-screen bg-white"> {/* Updated classes */}
      {/* Navbar */}
      <Navbar pageType="brand-info" />

      {/* Brand Image Box - Now shows only the image */}
      {/* MODIFICATION:
        - Added mx-4 for left/right padding on mobile, sm:mx-auto to center on larger screens.
        - Changed height to be smaller on mobile (h-48) and scale up (sm:h-56, md:h-72).
      */}
      <div className="mt-16 mb-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg 
                      border-2 border-[#0D1539]/40 overflow-hidden flex justify-center items-center 
                      max-w-3xl mx-4 sm:mx-auto h-48 sm:h-56 md:h-72 relative">
        {brand.image && (
          <img
            src={brand.image}
            alt={brand.title}
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
        {/* The <h1> element has been removed */}
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Back Button */}
        <Link
          to="/discover"
          className="mb-8 inline-flex items-center gap-2 text-[#0D1539] hover:text-orange-400 transition-colors" // Updated text color
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[#0D1539]" // Updated icon color
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Brands
        </Link>

        {/* Title & Subtitle - The title is now only shown here */}
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#0D1539]"> {/* Updated text color */}
          {brand.subtitle || `${brand.title} – The Underrated Space Snake Game That Will Hook You Instantly`}
        </h2>

        {/* Description */}
        {/* Updated text color in prose class, removed prose-invert */}
        <div className="prose max-w-none mb-8 text-[#0D1539]">
          <p>{brand.description}</p>
        </div>

        {/* Sections with Icons */}
        {brand.sections && brand.sections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-[#0D1539]"> {/* Updated text color */}
              {section.icon && (
                <span className="text-orange-400">{section.icon}</span>
              )}
              {section.title}
            </h3>
            {/* Updated text color in prose class, removed prose-invert */}
            <div className="prose max-w-none text-[#0D1539]">
              {typeof section.content === "string" ? (
                <p>{section.content}</p>
              ) : (
                <ul className="list-disc pl-6 space-y-2">
                  {section.content.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ))}

        {/* Rating */}
        {brand.rating && (
          <div className="mt-8 flex items-center gap-2 text-[#0D1539]"> {/* Updated text color */}
            <span>Rating:</span>
            <div className="flex">
              {"★".repeat(Math.floor(brand.rating))}{" "}
              {"☆".repeat(5 - Math.floor(brand.rating))}
            </div>
            <span>({brand.rating}/5)</span>
          </div>
        )}

        {/* Related Cards Section */}
        <div className="mt-12 border-t pt-8 border-[#0D1539]/30"> {/* Updated border color */}
          <h3 className="text-xl font-bold mb-6 text-[#0D1539]"> {/* Updated text color */}
            You Might Also Like
          </h3>
          <div className="px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
            {(() => {
              // Get related brands for the current brand
              const relatedBrands = brand.related || [];
              // Get all available brands from the global data
              const allBrands = brandData;

              // Function to get a random brand object by ID from the global data
              const getRandomBrandById = (id) => {
                return allBrands.find(b => b.id === id) || null;
              };

              // Map the related IDs to full brand objects, filter out nulls
              const relatedBrandObjects = relatedBrands
                .map(relatedItem => getRandomBrandById(relatedItem.id))
                .filter(brandObj => brandObj !== null); // Remove if not found in global data

              // Shuffle the related brand objects array using Fisher-Yates algorithm
              const shuffled = [...relatedBrandObjects];
              for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
              }

              // MODIFICATION: Removed the .slice(0, 3) to show all related brands
              const selectedBrands = shuffled;

              // Render the selected brands using BrandIdentityCard
              return selectedBrands.map((relatedBrandObj, idx) => {
                if (!relatedBrandObj) return null; // Safety check if mapping failed

                return (
                  <div key={idx} className="flex justify-center"> {/* Wrap each card in a flex container */}
                    <BrandIdentityCard
                      brand={relatedBrandObj}
                      showContent={true} // Show content on these cards
                      onReadMore={() => console.log(`Read more for related brand: ${relatedBrandObj.id}`)} // Optional: log or handle read more
                    />
                  </div>
                );
              });
            })()}
          </div>
        </div>
      </main>

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
            <a href="https://instagram.com          " target="_blank" rel="noopener noreferrer" className="group">
                <img
                src={Insta}
                alt="Instagram"
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                />
            </a>

            <a href="https://youtube.com          " target="_blank" rel="noopener noreferrer" className="group">
                <img
                src={Youtube}
                alt="YouTube"
                className="w-16 h-16 object-contain group-hover:scale-110 transition-transform duration-200 cursor-pointer"
                />
            </a>

            <a href="https://wa.me/yournumber          " target="_blank" rel="noopener noreferrer" className="group">
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

export default BrandInfoPage;