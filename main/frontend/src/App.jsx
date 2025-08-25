import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authContext";
import Home from "./pages/Home";
import AuthConsumer from "./pages/consumer/authConsumer";
import AuthVendor from "./pages/vendor/authVendor";
import Dashboard from "./pages/dashboard";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

function App() {
  const { currentUser, authLoading } = useAuth();

  console.log("App: ", authLoading);

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
