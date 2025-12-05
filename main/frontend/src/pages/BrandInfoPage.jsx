// src/pages/BrandInfoPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDataStore } from "../store/useDataStore.jsx";
import toast from "react-hot-toast";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BrandIdentityCard from "../components/landing/card.jsx";
import locartoImg from "../assets/locarto.png";

// Background Assets
const asset1 = "/assets/1.png";
const asset2 = "/assets/2.png";
const asset3 = "/assets/3.png";
const asset4 = "/assets/4.png";

const BrandInfoPage = () => {
  const { brandName } = useParams();
  const navigate = useNavigate();

  // Store full vendor object and specific blog object separately
  const [vendor, setVendor] = useState(null);
  const [blog, setBlog] = useState(null);

  const brands = useDataStore((s) => s.brands);

  // Filter for related section logic
  const brandData = useMemo(
    () => brands.filter((b) => b.blog && b.blog.length > 0),
    [brands]
  );

  // Scroll to top on mount or change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [brandName]);

  // Find the specific brand data
  useEffect(() => {
    if (!brands || brands.length === 0) return;

    // Find vendor by name
    const foundVendor = brands.find((b) => b.name === brandName);

    if (foundVendor) {
      setVendor(foundVendor);
      // Set the first blog post if available to populate description/images
      if (foundVendor.blog && foundVendor.blog.length > 0) {
        setBlog(foundVendor.blog[0]);
      }
    }
  }, [brandName, brands]);

  // Related brands logic
  const randomBrands = useMemo(() => {
    if (!vendor || !brandData) return [];

    const otherBrands = brandData.filter((b) => b.id !== vendor.id);
    // Fisher-Yates shuffle
    for (let i = otherBrands.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [otherBrands[i], otherBrands[j]] = [otherBrands[j], otherBrands[i]];
    }
    return otherBrands.slice(0, 3);
  }, [vendor, brandData]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: vendor?.name || "Locarto Brand",
        text: `Check out ${vendor?.name} on Locarto!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  if (!vendor && !blog) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading Brand Info...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  } else if (!blog) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Blog Not Created yet</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-sans text-[#0D1539] min-h-screen bg-white relative overflow-hidden">
      <Navbar pageType="brand-info" />

      {/* --- Background Decorative Assets --- */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <img
          src={asset1}
          alt=""
          className="absolute -top-32 -left-32 w-[500px] h-[500px] opacity-[0.1] animate-[spin_40s_linear_infinite] blur-sm"
        />
        <img
          src={asset2}
          alt=""
          className="absolute top-1/4 -right-32 w-[450px] h-[450px] opacity-[0.1] animate-[spin_42s_linear_infinite_reverse] blur-sm"
        />
        <img
          src={asset4}
          alt=""
          className="absolute bottom-0 left-0 w-[480px] h-[480px] opacity-[0.1] animate-[spin_48s_linear_infinite] blur-sm"
        />
        <img
          src={asset3}
          alt=""
          className="absolute top-3/4 right-20 w-[300px] h-[300px] opacity-[0.1] animate-pulse blur-sm"
        />
      </div>

      <main className="relative z-10 pt-24 pb-16">
        {/* --- HERO SECTION WITH LOGO & ACTIONS --- */}
        <div className="max-w-6xl mx-auto px-4 mb-16">
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 overflow-hidden relative">
            {/* Cover / Blog Image Background */}
            <div className="h-48 md:h-64 w-full bg-gray-100 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
              {/* Uses blog_image as cover */}
              <img
                src={blog.blog_image}
                alt="Cover"
                className="w-full h-full object-cover blur-[2px] scale-105"
              />
            </div>

            <div className="px-6 pb-8 md:px-10 relative z-20">
              {/* Layout Fix: 
                  1. 'flex-col md:flex-row' establishes the horizontal layout on desktop.
                  2. 'items-start' aligns everything to the top of the container content area.
                  3. The negative margin is applied ONLY to the logo wrapper, pulling it up over the banner.
                  4. 'pt-4 md:pt-6' adds spacing for the text content so it aligns nicely with the visual center of the logo.
              */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {/* 1. BRAND LOGO TILE (200x200) */}
                {/* Pulls up with negative margin, shrinks 0 to maintain size */}
                <div className="-mt-24 md:-mt-20 w-[200px] h-[200px] bg-white rounded-2xl shadow-2xl p-2 flex-shrink-0 border-4 border-white flex items-center justify-center overflow-hidden z-30 relative">
                  {vendor.brand_logo_1 ? (
                    <img
                      src={vendor.brand_logo_1}
                      alt={`${vendor.name} Logo`}
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    // Fallback if logo is null
                    <div className="text-center text-gray-400 flex flex-col items-center">
                      <i className="fas fa-store text-6xl mb-3 text-orange-200"></i>
                      <p className="text-sm font-bold uppercase text-gray-500 tracking-wide">
                        {vendor.name}
                      </p>
                    </div>
                  )}
                </div>

                {/* Brand Info & Actions Container */}
                <div className="flex-1 w-full pt-2 md:pt-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    {/* Text Details */}
                    <div className="text-center md:text-left w-full md:w-auto">
                      <h1 className="text-3xl md:text-5xl font-black text-gray-900 mb-2 leading-tight uppercase tracking-tight">
                        {vendor.name}
                      </h1>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-2">
                        {/* Rating */}
                        {blog.rating && (
                          <div className="flex items-center gap-2 text-yellow-500">
                            <div className="flex text-lg">
                              {"★".repeat(Math.floor(blog.rating))}
                              {"☆".repeat(5 - Math.floor(blog.rating))}
                            </div>
                            <span className="text-gray-600 font-bold text-sm">
                              ({blog.rating}/5)
                            </span>
                          </div>
                        )}

                        {/* Contact Chips */}
                        {vendor.email && (
                          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm text-gray-600 font-medium">
                            <i className="fas fa-envelope text-orange-500"></i>
                            <span className="truncate max-w-[200px]">
                              {vendor.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 2. ACTION BUTTONS */}
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 w-full md:w-auto">
                      {/* Visit Store */}
                      <Link
                        to={`/vendor/${vendor.id}/products/all`}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#0D1539] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#1a2b6b] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap min-w-[140px]"
                      >
                        <i className="fas fa-shopping-bag"></i> Visit Store
                      </Link>

                      {/* Visit Website */}
                      {vendor.website && (
                        <a
                          href={
                            vendor.website.startsWith("http")
                              ? vendor.website
                              : `https://${vendor.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white text-[#0D1539] border-2 border-[#0D1539] px-6 py-3 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 whitespace-nowrap min-w-[140px]"
                        >
                          <i className="fas fa-globe"></i> Website
                        </a>
                      )}

                      {/* Share Button */}
                      <button
                        onClick={handleShare}
                        className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-100 text-gray-700 hover:bg-orange-100 hover:text-orange-600 transition-colors shadow-sm"
                        title="Share Brand"
                      >
                        <i className="fas fa-share-alt text-lg"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- BLOG / STORY CONTENT --- */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose max-w-none">
            {/* Blog Title Header */}
            <div className="text-center mb-12 animate-[fadeIn_0.5s_ease-out]">
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1539] mb-4">
                {blog.title}
              </h2>
              <h3 className="text-xl md:text-2xl font-medium text-orange-500 italic">
                {blog.subtitle}
              </h3>
            </div>

            {/* Description Card */}
            <div className="bg-orange-50/50 rounded-3xl p-8 mb-12 border border-orange-100 text-lg leading-relaxed text-gray-700 whitespace-pre-line animate-[fadeIn_0.7s_ease-out]">
              {blog.description}
            </div>

            {/* Dynamic Sections */}
            <div className="space-y-12">
              {blog.sections?.map((section, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow animate-[fadeIn_0.9s_ease-out]"
                  style={{ animationDelay: `${idx * 0.1}s` }}
                >
                  <h3 className="text-2xl font-bold mb-4 flex items-center gap-3 text-[#0D1539]">
                    {section.icon && (
                      <span className="w-10 h-10 flex items-center justify-center bg-orange-100 rounded-full text-xl text-orange-600 font-bold">
                        {section.icon}
                      </span>
                    )}
                    {section.title}
                  </h3>
                  <div className="text-gray-600 leading-relaxed text-lg">
                    {Array.isArray(section.content) ? (
                      <ul className="list-disc pl-6 space-y-2">
                        {section.content.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="whitespace-pre-line">{section.content}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <Link
              to="/discover"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-500 font-semibold transition-colors px-6 py-3 rounded-full hover:bg-orange-50"
            >
              <i className="fas fa-arrow-left"></i> Back to All Brands
            </Link>
          </div>
        </div>

        {/* --- RELATED BRANDS --- */}
        {randomBrands.length > 0 && (
          <div className="mt-24 border-t border-gray-200 pt-16 max-w-6xl mx-auto px-4">
            <h3 className="text-2xl font-bold mb-8 text-[#0D1539] text-center">
              You Might Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {randomBrands.map((brand) => (
                <BrandIdentityCard key={brand.id} brand={brand} />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* --- FOOTER BANNER --- */}
      <div className="w-full overflow-hidden relative z-10 bg-white">
        <div className="relative w-full h-40 md:h-56">
          <img
            src={locartoImg}
            alt="Locarto"
            className="absolute inset-0 w-full h-full object-contain opacity-50"
          />
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default BrandInfoPage;
