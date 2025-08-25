import { createContext, useContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // loading states
  const [authLoading, setAuthLoading] = useState(true);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const login = async (data, type) => {
    setLoginLoading(true);
    try {
      const res = await axiosInstance.post(`/${type}/auth/login`, data);
      setCurrentUser(res.data);
      toast.success("Login Successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      console.log("Error in login:", error.response?.data?.message);
    } finally {
      setLoginLoading(false);
    }
  };

  const signup = async (data, type) => {
    setSignupLoading(true);
    try {
      const res = await axiosInstance.post(`/${type}/auth/signup`, data);
      setCurrentUser(res.data);
      toast.success("Signup Successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      console.log("Error in signup:", error.response?.data?.message);
    } finally {
      setSignupLoading(false);
    }
  };

  const logout = async (type) => {
    setLogoutLoading(true);
    try {
      await axiosInstance.post(`/${type}/auth/logout`);
      setCurrentUser(null);
      toast.success("Logout Successful");
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
      console.log("Error in logout:", error.response?.data?.message);
    } finally {
      setLogoutLoading(false);
    }
  };

  const checkAuth = async () => {
    setAuthLoading(true);
    try {
      const res = await axiosInstance.get("/auth/check");
      setCurrentUser(res.data);
    } catch (error) {
      setCurrentUser(null);
      console.log("Error in checkAuth:", error.response?.data?.message);
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout,
    // expose loading states
    authLoading,
    loginLoading,
    signupLoading,
    logoutLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
