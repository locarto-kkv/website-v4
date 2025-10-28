// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // Ensure Navigate is imported if used
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useDataStore } from "./store/useDataStore";
import { ConsumerDataProvider } from "./context/consumer/consumerDataContext";
import { VendorDataProvider } from "./context/vendor/vendorDataContext";

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
  const { authLoading, checkAuth } = useAuthStore();
  const { loadBlogs } = useDataStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  /** --------------------------
   * Effect: Load blogs on mount
   * -------------------------- */
  useEffect(() => {
    loadBlogs();
  }, []);

  /** --------------------------
   * Effect: Load data on user change
   * -------------------------- */
  // useEffect(() => {
  //   if (currentUser?.type === "consumer") {
  //     loadConsumerData();
  //   } else if (currentUser?.type === "vendor" ){
  //     loadVendorData();
  //   }
  // }, [currentUser]);

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
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
