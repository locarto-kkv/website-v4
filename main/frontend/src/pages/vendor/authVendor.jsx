// src/pages/vendor/authVendor.jsx

import { useState, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import AuthLayout from "../../components/AuthLayout"; // Import the layout
import VendorTOSAcceptance from "./VendorTOSAcceptance";

// --- START: MODIFIED IMPORT ---
import GoogleLogo from "../../assets/Google_Favicon_2025.svg"; // Import the new Google logo
// --- END: MODIFIED IMPORT ---

// Inputs remain mostly the same, maybe adjust styling if needed
const OtpInput = ({ value, onChange }) => (
  <div>
    <label
      htmlFor="otp"
      className="block text-sm font-medium text-gray-700 sr-only" // Hide label visually but keep for accessibility
    >
      OTP
    </label>
    <div className="relative">
      <input
        id="otp"
        name="otp"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        placeholder="Enter 4-digit OTP"
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" // Increased padding
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const PasswordInput = ({ value, onChange, showPassword, setShowPassword }) => (
  <div>
    <label
      htmlFor="password"
      className="block text-sm font-medium text-gray-700"
    >
      Password
    </label>
    <div className="relative mt-1">
      <input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        required
        className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" // Increased padding
        value={value}
        onChange={onChange}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
        tabIndex={-1}
      >
        {showPassword ? (
          <i className="fas fa-eye-slash"></i>
        ) : (
          <i className="fas fa-eye"></i>
        )}
      </button>
    </div>
  </div>
);

const AuthVendor = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [usePassword, setUsePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showTos, setShowTos] = useState(false);
  const [tosAccepted, setTosAccepted] = useState(false);
  const [isGoogleLogin, setGoogleLogin] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    loginType: "", // Keep if used elsewhere, otherwise remove
  });

  const {
    sendVerification,
    login,
    signup,
    googleLogin,
    sentOtp,
    loginLoading,
    signupLoading,
    otpLoading,
    cooldown,
  } = useAuthStore();

  const setSentOtp = (val) => useAuthStore.setState({ sentOtp: val });

  const getButtonText = () => {
    if (usePassword)
      return loginLoading ? "Logging in..." : "Login with Password";
    if (!usePassword) {
      if (!sentOtp) return otpLoading ? "Sending OTP..." : "Get OTP";
      if (sentOtp)
        return signupLoading || loginLoading
          ? "Verifying..."
          : "Login / Sign Up with OTP"; // Combined state
    }
  };

  const handleAuthType = () => {
    setUsePassword((prev) => !prev);
    setFormData((prev) => ({ ...prev, otp: "", password: "" })); // Clear other field on switch
    setSentOtp(false); // Reset OTP state when switching
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sentOtp || usePassword) {
      if (!tosAccepted && !showTos && !isLogin) {
        setShowTos(true);
        return;
      }
      isLogin
        ? await login(formData, "vendor")
        : await signup(formData, "vendor");
      setShowTos(false);
      setSentOtp(false);
    } else {
      await sendVerification(formData, "vendor");
      setSentOtp(true);
    }
  };

  const handleGoogleSubmit = async () => {
    if (!tosAccepted && !showTos && !isLogin) {
      setShowTos(true);
      setGoogleLogin(true);
      return;
    }
    googleLogin("vendor");
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;
    await sendVerification(formData, "vendor");
    setSentOtp(true);
    setFormData({ ...formData, otp: "" });
  };

  // Cooldown timer remains the same
  useEffect(() => {
    if (cooldown === 0) {
      return;
    }
    const interval = setInterval(() => {
      useAuthStore.setState((state) => {
        if (state.cooldown <= 1) {
          clearInterval(interval); // Clear interval when cooldown reaches 0
          return { cooldown: 0 };
        }
        return { cooldown: state.cooldown - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <>
      {/* If TOS is shown, take over the entire screen */}
      {showTos ? (
        !isGoogleLogin ? (
          <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              <VendorTOSAcceptance handleSubmit={handleSubmit} />
            </div>
          </div>
        ) : (
          <div className="fixed inset-0 bg-white z-50 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto p-6">
              <VendorTOSAcceptance handleSubmit={handleGoogleSubmit} />
            </div>
          </div>
        )
      ) : (
        <AuthLayout pageTitle="Vendor Portal">
          {/* Removed redundant Locarto link */}
          <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10 border border-gray-200">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                {isLogin ? "Vendor Login" : "Vendor Sign Up"}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Access your store dashboard
              </p>
            </div>

            {/* New Login/Sign Up Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setUsePassword(false);
                  setSentOtp(false);
                  setFormData((f) => ({ ...f, otp: "", password: "" }));
                }}
                className={`flex-1 py-2.5 px-3 text-center font-semibold rounded-md transition-all duration-300 text-sm ${
                  isLogin
                    ? "bg-white text-orange-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setUsePassword(false);
                  setSentOtp(false);
                  setFormData((f) => ({ ...f, otp: "", password: "" }));
                }}
                className={`flex-1 py-2.5 px-3 text-center font-semibold rounded-md transition-all duration-300 text-sm ${
                  !isLogin
                    ? "bg-white text-orange-600 shadow"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" method="POST">
              <div>
                {!isLogin && (
                  <>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="name"
                      required
                      className="mb-3 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </>
                )}
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {sentOtp && !usePassword && (
                <OtpInput value={formData.otp} onChange={handleChange} />
              )}

              {isLogin && usePassword && (
                <PasswordInput
                  value={formData.password}
                  onChange={handleChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                />
              )}

              {/* Options: Use Password/OTP, Resend */}
              <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                {isLogin && (
                  <button
                    type="button"
                    onClick={handleAuthType}
                    className="font-medium text-orange-600 hover:text-orange-700 focus:outline-none"
                  >
                    {usePassword
                      ? "Login with OTP instead"
                      : "Login with Password instead"}
                  </button>
                )}

                {!isLogin && <div className="flex-1"></div>}

                {sentOtp && !usePassword && (
                  <button
                    type="button"
                    onClick={resendOtp}
                    disabled={cooldown > 0}
                    className={`font-medium focus:outline-none ${
                      cooldown > 0
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-orange-600 hover:text-orange-700"
                    }`}
                  >
                    {cooldown < 1 ? "Resend OTP" : `Resend OTP in ${cooldown}s`}
                  </button>
                )}
              </div>

              <div>
                <button
                  type="submit"
                  disabled={
                    loginLoading ||
                    signupLoading ||
                    otpLoading ||
                    (sentOtp && !usePassword && formData.otp.length !== 4)
                  }
                  className="w-full flex justify-center py-3 px-4 rounded-md shadow-sm text-sm font-semibold bg-orange-500 text-white hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300"
                >
                  {getButtonText()}
                </button>
              </div>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-2 text-xs text-gray-400 uppercase">
                Or
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Google Login Button */}
            <div>
              <button
                type="button"
                onClick={handleGoogleSubmit}
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300 transition-colors"
              >
                {/* --- START: MODIFIED IMG TAG --- */}
                <img
                  src={GoogleLogo}
                  alt="Google"
                  className="w-5 h-5 mr-2"
                />
                {/* --- END: MODIFIED IMG TAG --- */}
                {isLogin ? "Login with Google" : "Sign up with Google"}
              </button>
            </div>

            {/* Toggle between Login/Sign up */}
            <div className="mt-6 text-center text-sm">
              {isLogin ? (
                <p className="text-gray-600">
                  Don't have an account yet?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(false);
                      setUsePassword(false);
                      setSentOtp(false);
                      setFormData((f) => ({ ...f, otp: "", password: "" }));
                    }}
                    className="font-semibold text-orange-600 hover:text-orange-700 underline focus:outline-none"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsLogin(true);
                      setUsePassword(false);
                      setSentOtp(false);
                      setFormData((f) => ({ ...f, otp: "", password: "" }));
                    }}
                    className="font-semibold text-orange-600 hover:text-orange-700 underline focus:outline-none"
                  >
                    Log in
                  </button>
                </p>
              )}
            </div>
          </div>
        </AuthLayout>
      )}
    </>
  );
};

export default AuthVendor;