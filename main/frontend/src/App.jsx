import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Home from "./pages/Home";
import AuthConsumer from "./pages/authConsumer";
import AuthVendor from "./pages/authVendor";
import VendorDashboard from "./pages/vendorDashboard";
import CustomerDashboard from "./pages/customerDashboard";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { currentUser, checkAuth } = useAuth();

  useEffect(() => {
    checkAuth();
  }, []);
  // console.log("App: ", currentUser);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/consumer/login"
          element={
            !currentUser ? (
              <AuthConsumer />
            ) : (
              <Navigate to="/consumer/dashboard" />
            )
          }
        />
        <Route
          path="/vendor/login"
          element={
            !currentUser ? <AuthVendor /> : <Navigate to="/vendor/dashboard" />
          }
        />
        <Route
          path="/vendor/dashboard"
          element={
            currentUser ? <VendorDashboard /> : <Navigate to="/vendor/login" />
          }
        />
        <Route
          path="/consumer/dashboard"
          element={
            currentUser ? (
              <CustomerDashboard />
            ) : (
              <Navigate to="/consumer/login" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
