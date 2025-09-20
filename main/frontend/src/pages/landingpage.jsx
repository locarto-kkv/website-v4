// src/pages/LandingPage.jsx
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import backgroundImg from "../assets/landing_background.png"; // Import the background image

const LandingPage = () => {
  return (
    <div className="bg-[#0D1539] text-white min-h-screen flex flex-col">
      <Navbar pageType="landing" />

      {/* Hero Section */}
      <section
        className="flex flex-col justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImg})` }}
      >
        {/* This div is now centered */}
        <div className="flex justify-center py-48 px-8">
          <div className="max-w-3xl text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 whitespace-nowrap">
            THE PLATFORM THAT GETS IT...
          </h1>
            <p className="text-2xl md:text-3xl leading-relaxed text-left">
              <span className="text-orange-500">For brands</span> with something to say and
              <br />
              <span className="text-orange-500">For people</span> who want to listen.
            </p>
          </div>
        </div>

      </section>

      {/* Full-width image */}
      <img
        src={backgroundImg}
        loading="lazy"
        alt="Landing Background"
        className="w-full h-auto"
      />

      <Footer />
    </div>
  );
};

export default LandingPage;

