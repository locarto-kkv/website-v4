import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import AuthLayout from "../../components/AuthLayout"; // Import the layout

// Inputs remain mostly the same, maybe adjust styling if needed
const OtpInput = (
  { value, onChange } // [cite: src/pages/consumer/authConsumer.jsx]
) => (
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

const PasswordInput = (
  { value, onChange, showPassword, setShowPassword } // [cite: src/pages/consumer/authConsumer.jsx]
) => (
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
        type={showPassword ? "text" : "password"} // [cite: src/pages/consumer/authConsumer.jsx]
        required
        className="block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 pr-10 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" // Increased padding
        value={value}
        onChange={onChange}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)} // [cite: src/pages/consumer/authConsumer.jsx]
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"} // [cite: src/pages/consumer/authConsumer.jsx]
      >
        {showPassword ? ( // [cite: src/pages/consumer/authConsumer.jsx]
          <i className="fas fa-eye-slash"></i>
        ) : (
          <i className="fas fa-eye"></i>
        )}
      </button>
    </div>
  </div>
);

const AuthConsumer = () => {
  const [isLogin, setIsLogin] = useState(true); // [cite: src/pages/consumer/authConsumer.jsx]
  const [usePassword, setUsePassword] = useState(false); // [cite: src/pages/consumer/authConsumer.jsx]
  const [showPassword, setShowPassword] = useState(false); // [cite: src/pages/consumer/authConsumer.jsx]
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    otp: "",
    password: "",
    loginType: "", // Keep if used elsewhere, otherwise remove
  });

  const {
    sendVerification, // [cite: src/pages/consumer/authConsumer.jsx]
    login, // [cite: src/pages/consumer/authConsumer.jsx]
    signup, // [cite: src/pages/consumer/authConsumer.jsx]
    googleLogin, // [cite: src/pages/consumer/authConsumer.jsx]
    checkAuth, // [cite: src/pages/consumer/authConsumer.jsx]
    sentOtp, // [cite: src/pages/consumer/authConsumer.jsx]
    loginLoading, // [cite: src/pages/consumer/authConsumer.jsx]
    signupLoading, // [cite: src/pages/consumer/authConsumer.jsx]
    otpLoading, // [cite: src/pages/consumer/authConsumer.jsx]
    cooldown, // [cite: src/pages/consumer/authConsumer.jsx]
  } = useAuthStore();

  const setSentOtp = (val) => useAuthStore.setState({ sentOtp: val }); // [cite: src/pages/consumer/authConsumer.jsx]

  const getButtonText = () => {
    // [cite: src/pages/consumer/authConsumer.jsx]
    if (usePassword)
      return loginLoading ? "Logging in..." : "Login with Password"; // [cite: src/pages/consumer/authConsumer.jsx]
    if (!usePassword) {
      // [cite: src/pages/consumer/authConsumer.jsx]
      if (!sentOtp) return otpLoading ? "Sending OTP..." : "Get OTP"; // [cite: src/pages/consumer/authConsumer.jsx]
      if (sentOtp)
        return signupLoading || loginLoading
          ? "Verifying..."
          : "Login / Sign Up with OTP"; // Combined state
    }
  };

  const handleAuthType = () => {
    // [cite: src/pages/consumer/authConsumer.jsx]
    setUsePassword((prev) => !prev); // [cite: src/pages/consumer/authConsumer.jsx]
    setFormData((prev) => ({ ...prev, otp: "", password: "" })); // Clear other field on switch
    setSentOtp(false); // Reset OTP state when switching
  };

  const handleChange = (e) => {
    // [cite: src/pages/consumer/authConsumer.jsx]
    setFormData({ ...formData, [e.target.name]: e.target.value }); // [cite: src/pages/consumer/authConsumer.jsx]
  };

  const handleSubmit = async (e) => {
    // [cite: src/pages/consumer/authConsumer.jsx]
    e.preventDefault(); // [cite: src/pages/consumer/authConsumer.jsx]

    if (sentOtp || usePassword) {
      // [cite: src/pages/consumer/authConsumer.jsx]
      isLogin // [cite: src/pages/consumer/authConsumer.jsx]
        ? await login(formData, "consumer") // [cite: src/pages/consumer/authConsumer.jsx]
        : await signup(formData, "consumer"); // [cite: src/pages/consumer/authConsumer.jsx]
      setSentOtp(false); // [cite: src/pages/consumer/authConsumer.jsx]
    } else {
      await sendVerification(formData, "consumer"); // [cite: src/pages/consumer/authConsumer.jsx]
      setSentOtp(true); // [cite: src/pages/consumer/authConsumer.jsx]
    }
  };

  const handleGoogleSubmit = async () => {
    // Removed 'e' // [cite: src/pages/consumer/authConsumer.jsx]
    googleLogin("consumer"); // [cite: src/pages/consumer/authConsumer.jsx]
    // Removed checkAuth(), as redirection should happen via backend flow
  };

  const resendOtp = async () => {
    // [cite: src/pages/consumer/authConsumer.jsx]
    if (cooldown > 0) return;
    await sendVerification(formData, "consumer"); // [cite: src/pages/consumer/authConsumer.jsx]
    setSentOtp(true); // [cite: src/pages/consumer/authConsumer.jsx]
    setFormData({ ...formData, otp: "" }); // [cite: src/pages/consumer/authConsumer.jsx]
  };

  // Cooldown timer remains the same
  useEffect(() => {
    // [cite: src/pages/consumer/authConsumer.jsx]
    if (cooldown === 0) {
      // [cite: src/pages/consumer/authConsumer.jsx]
      return;
    }
    const interval = setInterval(() => {
      // [cite: src/pages/consumer/authConsumer.jsx]
      useAuthStore.setState((state) => {
        // [cite: src/pages/consumer/authConsumer.jsx]
        if (state.cooldown <= 1) {
          // [cite: src/pages/consumer/authConsumer.jsx]
          clearInterval(interval); // Clear interval when cooldown reaches 0
          return { cooldown: 0 };
        }
        return { cooldown: state.cooldown - 1 }; // [cite: src/pages/consumer/authConsumer.jsx]
      });
    }, 1000);
    return () => clearInterval(interval); // [cite: src/pages/consumer/authConsumer.jsx]
  }, [cooldown]); // [cite: src/pages/consumer/authConsumer.jsx]

  return (
    <AuthLayout pageTitle="Customer Portal">
      {/* Removed redundant Locarto link */}
      <div className="bg-white py-8 px-6 shadow-xl rounded-lg sm:px-10 border border-gray-200">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {isLogin ? "Customer Login" : "Customer Sign Up"}{" "}
            {/* [cite: src/pages/consumer/authConsumer.jsx] */}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Explore local brands and products
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
            }} // Reset state
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
            }} // Reset state
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
                className="mb-3 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" // Increased padding
                value={formData.name}
                onChange={handleChange}
              />
            </>
          )}
          <div>
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm" // Increased padding
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
            {/* Spacer for alignment when not showing Use Password */}
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
            <svg
              className="w-5 h-5 mr-2"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
            >
              <path
                fill="#FFC107"
                d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
              />
              <path
                fill="#FF3D00"
                d="M6.306 14.691c-1.354 2.807-2.13 5.92-2.13 9.179s.776 6.372 2.13 9.179l-5.657 5.657C1.046 34.046 0 29.268 0 24s1.046-10.046 2.649-13.818l5.657 4.509z"
              />
              <path
                fill="#4CAF50"
                d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-5.657-5.657c-1.746 1.166-3.973 1.85-6.309 1.85-4.818 0-8.943-3.08-10.36-7.37H2.649v5.67C6.182 40.023 14.437 44 24 44z"
              />
              <path
                fill="#1976D2"
                d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l5.657 5.657C40.046 36.671 44 30.887 44 24c0-1.341-.138-2.65-.389-3.917z"
              />
            </svg>
            {isLogin ? "Login with Google" : "Sign up with Google"}{" "}
            {/* [cite: src/pages/consumer/authConsumer.jsx] */}
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
                }} // Reset state
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
                }} // Reset state
                className="font-semibold text-orange-600 hover:text-orange-700 underline focus:outline-none"
              >
                Log in
              </button>
            </p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
};

export default AuthConsumer;
