import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import AuthConsumer from "./pages/consumer/authConsumer";
import AuthVendor from "./pages/vendor/authVendor";
import Dashboard from "./pages/dashboard";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";

function App() {
  const { currentUser, authLoading, checkAuth } = useAuthStore();
  // console.log("App: ", currentUser);

  useEffect(() => {
    checkAuth();
  }, []);

  if (authLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/consumer/login"
          element={
            !currentUser ? <AuthConsumer /> : <Navigate to="/dashboard" />
          }
        />
        <Route
          path="/vendor/login"
          element={!currentUser ? <AuthVendor /> : <Navigate to="/dashboard" />}
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
