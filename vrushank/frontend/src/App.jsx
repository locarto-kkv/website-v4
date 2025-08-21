import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Home from "./pages/Home";
import AuthConsumer from "./pages/authConsumer";
import AuthVendor from "./pages/authVendor";
import VendorDashboard from "./pages/vendorDashboard";
import CustomerDashboard from "./pages/customerDashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const { currentUser } = useAuth();
  // console.log("App: ", currentUser);

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login/customer"
          element={
            !currentUser ? (
              <AuthConsumer />
            ) : (
              <Navigate to="/customer/dashboard" />
            )
          }
        />
        <Route
          path="/login/vendor"
          element={
            !currentUser ? <AuthVendor /> : <Navigate to="/vendor/dashboard" />
          }
        />
        <Route
          path="/vendor/dashboard"
          element={
            currentUser ? (
              <VendorDashboard />
            ) : (
              <Navigate to="/vendor/dashboard" />
            )
          }
        />
        <Route
          path="/customer/dashboard"
          element={
            currentUser ? (
              <CustomerDashboard />
            ) : (
              <Navigate to="/customer/dashboard" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
