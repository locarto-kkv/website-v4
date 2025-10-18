// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { DataProvider } from "./context/dataContext";

// Public Pages
import Homepage from "./pages/Homepage";
import LandingPage from "./pages/Landingpage";
import MapView from "./components/MapView";
import DiscoverPage from "./pages/DiscoverPage";
import BrandInfoPage from "./pages/BrandInfoPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage"; // <-- Import the new page

import VendorRoutes from "./pages/vendor/vendorRoutes";
import ConsumerRoutes from "./pages/consumer/consumerRoutes";
import AdminRoutes from "./pages/admin/adminRoutes";

import { ConsumerDataProvider } from "./context/consumer/consumerDataContext";
import { VendorDataProvider } from "./context/vendor/vendorDataContext";

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
      <DataProvider>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          <Route path="/" element={<Homepage />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/discover" element={<DiscoverPage />} />
          <Route path="/brand-info/:brandTitle" element={<BrandInfoPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} /> {/* <-- Add this route */}

          {/* --- ADMIN ROUTES --- */}
          <Route path="admin/*" element={<AdminRoutes />} />
          {/* --- VENDOR ROUTES --- */}
          <Route
            path="vendor/*"
            element={
              <VendorDataProvider>
                <VendorRoutes />
              </VendorDataProvider>
            }
          />
          {/* --- CONSUMER ROUTES --- */}
          <Route
            path="consumer/*"
            element={
              <ConsumerDataProvider>
                <ConsumerRoutes />
              </ConsumerDataProvider>
            }
          />
        </Routes>
      </DataProvider>

      <Toaster />
    </div>
  );
}

export default App;