// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import TestMap from "./components/TestMap";

// Public Pages
import Homepage from "./pages/homepage";
import LandingPage from "./pages/landingpage";
import MapView from "./components/MapView";

// Vendor Pages
import VendorRoutes from "./pages/vendor/vendorRoutes";

import ConsumerRoutes from "./pages/consumer/consumerRoutes";

function App() {
  const { authLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Homepage />} />
        <Route path="/landing" element={<LandingPage />} />
        
        {/* --- VENDOR ROUTES --- */}
        <Route path="vendor/*" element={<VendorRoutes />} />
        
        {/* --- CONSUMER ROUTES --- */}
        <Route path="consumer/*" element={<ConsumerRoutes />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;