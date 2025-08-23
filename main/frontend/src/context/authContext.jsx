import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userType, setUserType] = useState(null);

  const login = async (data, type) => {
    try {
      const res = await axiosInstance.post(`/${type}/auth/login`, data);

      setCurrentUser(res.data);
      setUserType(type);
      toast.success("Login Successful");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in login: ", error.response.data.message);
    }
  };

  const signup = async (data, type) => {
    try {
      const res = await axiosInstance.post(`/${type}/auth/signup`, data);

      setCurrentUser(res.data);
      setUserType(type);
      toast.success("Signup Successful");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in signup: ", error.response.data.message);
    }
  };

  const logout = async (type) => {
    try {
      await axiosInstance.post(`/${type}/auth/logout`);

      setCurrentUser(null);
      setUserType(null);
      toast.success("Logout Successful");
    } catch (error) {
      toast.error(error.response.data.message);
      console.log("Error in logout: ", error.response.data.message);
    }
  };

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      setCurrentUser(res.data);
    } catch (error) {
      console.log("Error in checkAuth: ", error.response.data.message);
    }
  };

  const value = {
    currentUser,
    userType,
    login,
    logout,
    signup,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
