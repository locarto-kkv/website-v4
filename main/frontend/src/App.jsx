import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/homepage";
import LandingPage from "./pages/landingpage"; // Make sure this import is correct
import AuthConsumer from "./pages/consumer/authConsumer";
import AuthVendor from "./pages/vendor/authVendor";
import Dashboard from "./pages/dashboard";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { currentUser, authLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route
          path="/consumer/login"
          element={!currentUser ? <AuthConsumer /> : <Navigate to="/" />}
        />
        <Route
          path="/vendor/login"
          element={!currentUser ? <AuthVendor /> : <Navigate to="/" />}
        />
        <Route
          path="/dashboard"
          element={currentUser ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;