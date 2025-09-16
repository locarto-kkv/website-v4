import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";

// Public Pages
import Homepage from "./pages/homepage";
import LandingPage from "./pages/landingpage";

import VendorRoutes from "./pages/vendor/vendorRoutes";
import ConsumerRoutes from "./pages/consumer/consumerRoutes";

function App() {
  const { currentUser, authLoading, checkAuth } = useAuthStore();

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

        <Route path="vendor/*" element={<VendorRoutes />} />
        <Route path="consumer/*" element={<ConsumerRoutes />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
