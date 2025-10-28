// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Ensure Navigate is imported if used
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useDataStore } from "./store/useDataStore";
import { useConsumerDataStore } from "./store/consumer/consumerDataStore";
import { useVendorDataStore } from "./store/vendor/vendorDataStore";

// Public Pages
import Homepage from "./pages/Homepage";
import LandingPage from "./pages/Landingpage";
import MapView from "./components/MapView";
import DiscoverPage from "./pages/DiscoverPage";
import BrandInfoPage from "./pages/BrandInfoPage";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage";
import ShopProducts from "./pages/consumer/ShopProducts";
import ProductViewPage from "./pages/consumer/ProductViewPage";
import AlertsPage from "./pages/AlertsPage";

// Other Routes
import VendorRoutes from "./pages/vendor/vendorRoutes";
import ConsumerRoutes from "./pages/consumer/consumerRoutes";
import AdminRoutes from "./pages/admin/adminRoutes";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  const authLoading = useAuthStore((s) => s.authLoading);
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const currentUser = useAuthStore((s) => s.currentUser);

  const dataLoading = useDataStore((s) => s.dataLoading);
  const loadBlogs = useDataStore((s) => s.loadBlogs);

  const consumerLoading = useConsumerDataStore((s) => s.dataLoading);
  const loadConsumerData = useConsumerDataStore((s) => s.loadConsumerData);
  const clearConsumerData = useConsumerDataStore((s) => s.clearConsumerData);

  const vendorLoading = useVendorDataStore((s) => s.dataLoading);
  const loadVendorData = useVendorDataStore((s) => s.loadVendorData);
  const clearVendorData = useVendorDataStore((s) => s.clearVendorData);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    loadBlogs();
  }, []);

  useEffect(() => {
    if (currentUser?.type === "consumer") {
      clearVendorData();
      loadConsumerData();
    } else if (currentUser?.type === "vendor") {
      clearConsumerData();
      loadVendorData();
    }
  }, [currentUser]);

  if (authLoading || dataLoading || consumerLoading || vendorLoading) {
    // console.log(authLoading, dataLoading, consumerLoading, vendorLoading);

    return (
      <div className="flex items-center justify-center min-h-screen pt-[70px]">
        {" "}
        {/* Adjusted min-height */}
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Homepage />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="/brand-info/:brandTitle" element={<BrandInfoPage />} />
        <Route
          path="/shops/:vendorId/products/:category"
          element={<ShopProducts />}
        />
        <Route path="/product/:productId" element={<ProductViewPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        {/* --- MAKE SURE THIS LINE IS CORRECT --- */}
        <Route
          path="/terms-and-conditions"
          element={<TermsAndConditionsPage />}
        />
        {/* -------------------------------------- */}
        <Route path="/alerts" element={<AlertsPage />} />

        {/* --- ADMIN ROUTES --- */}
        <Route path="admin/*" element={<AdminRoutes />} />

        {/* --- VENDOR ROUTES --- */}
        <Route path="vendor/*" element={<VendorRoutes />} />

        {/* --- CONSUMER ROUTES --- */}
        <Route path="consumer/*" element={<ConsumerRoutes />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
