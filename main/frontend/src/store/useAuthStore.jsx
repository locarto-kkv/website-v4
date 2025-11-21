// src/store/useAuthStore.jsx

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";

const BACKEND_URL =
  import.meta.env.MODE === "development"
    ? import.meta.env.VITE_BACKEND_URL
    : window.location.origin;

export const useAuthStore = create(
  persist((set, get) => ({
    currentUser: null,
    sentOtp: false,
    // Loading states
    authLoading: true,
    loginLoading: false,
    signupLoading: false,
    logoutLoading: false,
    otpLoading: false,

    cooldown: 0,

    // ---- Auth functions ----
    sendVerification: async (data, type) => {
      if (get().cooldown > 0) {
        toast.error("Wait for cooldown");
        return;
      }
      set({ otpLoading: true });
      try {
        const res = await axiosInstance.post(`/${type}/auth/verify`, data);
        set({ cooldown: 10 });
        toast.success(res.data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || "OTP failed");
        console.error("Error in sendVerification:", error);
      } finally {
        set({ otpLoading: false });
      }
    },

    login: async (data, type) => {
      set({ loginLoading: true });
      try {
        const res = await axiosInstance.post(`/${type}/auth/login`, data);
        set({ currentUser: res.data, cooldown: 0, sentOtp: false });
        toast.success("Login Successful");
      } catch (error) {
        toast.error(error.response?.data?.message || "Login failed");
        console.error("Error in login:", error.response?.data?.message);
      } finally {
        set({ loginLoading: false });
      }
    },

    signup: async (data, type) => {
      set({ signupLoading: true });
      try {
        const res = await axiosInstance.post(`/${type}/auth/signup`, data);

        set({ currentUser: res.data, cooldown: 0, sentOtp: false });
        toast.success("Signup Successful");
      } catch (error) {
        toast.error(error.response?.data?.message || "Signup failed");
        console.error("Error in signup:", error.response?.data?.message);
      } finally {
        set({ signupLoading: false });
      }
    },

    googleLogin: (type) => {
      set({ authLoading: true });
      try {
        window.location.href = BACKEND_URL + `/api/${type}/auth/login-google`;
      } catch (error) {
        toast.error(error.response?.data?.message || "Google failed");
        console.error("Error in googleLogin:", error.response?.data?.message);
      } finally {
        set({ authLoading: false });
      }
    },

    logout: async (type) => {
      set({ logoutLoading: true });
      try {
        await axiosInstance.post(`/${type}/auth/logout`);
        set({ currentUser: null });

        toast.success("Logout Successful");
      } catch (error) {
        toast.error(error.response?.data?.message || "Logout failed");
        console.error("Error in logout:", error);
      } finally {
        set({ logoutLoading: false });
      }
    },

    checkAuth: async () => {
      set({ authLoading: true });
      try {
        const res = await axiosInstance.get("/auth/check");
        set({ currentUser: res.data });
      } catch (error) {
        set({ currentUser: null });
        console.error("Error in checkAuth:", error.response?.data?.message);
      } finally {
        set({ authLoading: false });
      }
    },
    clearAuthData: () => {
      set({ authLoading: true });
      try {
        set({
          currentUser: null,
        });
      } catch (error) {
        console.error("Error in clearAuthData: ", error);
      } finally {
        set({ authLoading: false });
      }
    },
  }))
);
