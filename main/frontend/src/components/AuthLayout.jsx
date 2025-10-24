import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import locartoImg from '../assets/locarto.png'; // [cite: src/components/AuthLayout.jsx]
import mapBg from '../assets/map_bg.png'; // Import the map background texture [cite: src/components/AuthLayout.jsx]

const AuthLayout = ({ children, pageTitle = "Welcome" }) => { // [cite: src/components/AuthLayout.jsx]
  const mapRef = useRef(null); // [cite: src/components/AuthLayout.jsx]
  const mapInstanceRef = useRef(null); // [cite: src/components/AuthLayout.jsx]

  useEffect(() => { // [cite: src/components/AuthLayout.jsx]
    // Prevent re-initialization if map already exists
    if (mapRef.current && !mapInstanceRef.current) { // [cite: src/components/AuthLayout.jsx]
      // Initialize map without zoom controls or interaction
      mapInstanceRef.current = L.map(mapRef.current, { // [cite: src/components/AuthLayout.jsx]
        center: [19.0760, 72.8777], // Center on Mumbai // [cite: src/components/AuthLayout.jsx]
        zoom: 11, // [cite: src/components/AuthLayout.jsx]
        zoomControl: false, // [cite: src/components/AuthLayout.jsx]
        attributionControl: false, // [cite: src/components/AuthLayout.jsx]
        dragging: false, // [cite: src/components/AuthLayout.jsx]
        touchZoom: false, // [cite: src/components/AuthLayout.jsx]
        doubleClickZoom: false, // [cite: src/components/AuthLayout.jsx]
        scrollWheelZoom: false, // [cite: src/components/AuthLayout.jsx]
        boxZoom: false, // [cite: src/components/AuthLayout.jsx]
        keyboard: false, // [cite: src/components/AuthLayout.jsx]
        tap: false, // [cite: src/components/AuthLayout.jsx]
      });

      // Dark Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', { // [cite: src/components/AuthLayout.jsx]
        attribution: '&copy; <a href="https://carto.com/attributions">CARTO</a>', // [cite: src/components/AuthLayout.jsx]
        maxZoom: 19, // [cite: src/components/AuthLayout.jsx]
        minZoom: 3, // [cite: src/components/AuthLayout.jsx]
      }).addTo(mapInstanceRef.current); // [cite: src/components/AuthLayout.jsx]

      // Add a subtle texture/overlay (Increased opacity)
       L.imageOverlay(mapBg, mapInstanceRef.current.getBounds(), { opacity: 0.3 }).addTo(mapInstanceRef.current); // [cite: src/components/AuthLayout.jsx] // <-- Increased opacity

    }

    // Cleanup function
    return () => { // [cite: src/components/AuthLayout.jsx]
      if (mapInstanceRef.current) { // [cite: src/components/AuthLayout.jsx]
        // mapInstanceRef.current.remove(); // Keep map instance for performance? Or remove if needed.
        // mapInstanceRef.current = null;
      }
    };
  }, []); // Run only once on mount // [cite: src/components/AuthLayout.jsx]

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100"> {/* [cite: src/components/AuthLayout.jsx] */}
      {/* Left Side (Map) - Hidden on mobile */}
      <div className="hidden md:block md:w-1/2 lg:w-3/5 xl:w-2/3 relative overflow-hidden bg-gray-800"> {/* [cite: src/components/AuthLayout.jsx] */}
        {/* Map Container */}
        <div ref={mapRef} className="absolute inset-0 h-full w-full opacity-70"></div> {/* [cite: src/components/AuthLayout.jsx] */}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 lg:p-12 bg-black/30"> {/* [cite: src/components/AuthLayout.jsx] */}
          {/* Logo with Enhanced Styling */}
          <Link to="/" className="mb-8 lg:mb-12 block group"> {/* [cite: src/components/AuthLayout.jsx] */}
            <div className="relative"> {/* [cite: src/components/AuthLayout.jsx] */}
              {/* Glow effect behind logo */}
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-2xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500 scale-110"></div> {/* [cite: src/components/AuthLayout.jsx] */}
              {/* Logo */}
              <img // [cite: src/components/AuthLayout.jsx]
                src={locartoImg} // [cite: src/components/AuthLayout.jsx]
                alt="Locarto" // [cite: src/components/AuthLayout.jsx]
                className="relative h-20 lg:h-28 xl:h-32 w-auto opacity-95 drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" // [cite: src/components/AuthLayout.jsx]
              />
            </div>
          </Link>

          {/* Animated Heading */}
          <div className="relative mb-6 lg:mb-8"> {/* [cite: src/components/AuthLayout.jsx] */}
            <h1 className="text-3xl lg:text-5xl xl:text-6xl font-black text-white text-center leading-tight shadow-text"> {/* [cite: src/components/AuthLayout.jsx] */}
              Discover Local Gems. <br /> {/* [cite: src/components/AuthLayout.jsx] */}
              <span className="bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent"> {/* [cite: src/components/AuthLayout.jsx] */}
                Connect with Brands. {/* [cite: src/components/AuthLayout.jsx] */}
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-lg lg:text-xl xl:text-2xl text-white/90 text-center max-w-2xl mb-8 lg:mb-12 leading-relaxed shadow-text"> {/* [cite: src/components/AuthLayout.jsx] */}
            Join the community of emerging brands and smart customers discovering what's local. {/* [cite: src/components/AuthLayout.jsx] */}
          </p>

          {/* Feature Badges */}
          <div className="flex flex-wrap justify-center gap-4 lg:gap-6"> {/* [cite: src/components/AuthLayout.jsx] */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 lg:px-6 py-2 lg:py-3 rounded-full"> {/* [cite: src/components/AuthLayout.jsx] */}
              <i className="fas fa-map-marked-alt text-orange-400 text-lg lg:text-xl"></i> {/* [cite: src/components/AuthLayout.jsx] */}
              <span className="text-white font-semibold text-sm lg:text-base">Interactive Maps</span> {/* [cite: src/components/AuthLayout.jsx] */}
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 lg:px-6 py-2 lg:py-3 rounded-full"> {/* [cite: src/components/AuthLayout.jsx] */}
              <i className="fas fa-store text-red-400 text-lg lg:text-xl"></i> {/* [cite: src/components/AuthLayout.jsx] */}
              <span className="text-white font-semibold text-sm lg:text-base">Local Brands</span> {/* [cite: src/components/AuthLayout.jsx] */}
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 lg:px-6 py-2 lg:py-3 rounded-full"> {/* [cite: src/components/AuthLayout.jsx] */}
              <i className="fas fa-shipping-fast text-pink-400 text-lg lg:text-xl"></i> {/* [cite: src/components/AuthLayout.jsx] */}
              <span className="text-white font-semibold text-sm lg:text-base">Fast Delivery</span> {/* [cite: src/components/AuthLayout.jsx] */}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side (Form) */}
      <div className="w-full md:w-1/2 lg:w-2/5 xl:w-1/3 flex flex-col items-center justify-center p-4 sm:p-8"> {/* [cite: src/components/AuthLayout.jsx] */}
        {/* Logo for mobile */}
        <Link to="/" className="md:hidden mb-6 block"> {/* [cite: src/components/AuthLayout.jsx] */}
          <img src={locartoImg} alt="Locarto" className="h-12 w-auto" /> {/* [cite: src/components/AuthLayout.jsx] */}
        </Link>

        <div className="w-full max-w-md"> {/* [cite: src/components/AuthLayout.jsx] */}
          {children} {/* [cite: src/components/AuthLayout.jsx] */}
        </div>
      </div>

      <style>{`
        .shadow-text {
          text-shadow: 0 4px 12px rgba(0,0,0,0.6);
        }
      `}</style> {/* [cite: src/components/AuthLayout.jsx] */}
    </div>
  );
};

export default AuthLayout; // [cite: src/components/AuthLayout.jsx]

