import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";

// Reusable Password input with conditional show/hide
const OtpInput = ({ value, onChange }) => (
  <div>
    <label
      htmlFor="otp"
      className="block text-sm font-medium text-gray-700"
    ></label>
    <div className="relative">
      <input
        id="otp"
        name="otp"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={4}
        placeholder="Enter OTP"
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);

const PasswordInput = ({
  value,
  onChange,
  showPassword,
  setShowPassword,
  isLogin,
}) => (
  <div>
    <label
      htmlFor="password"
      className="block text-sm font-medium text-gray-700"
    >
      {isLogin ? "Password" : "Create Password"}
    </label>
    <div className="relative">
      <input
        id="password"
        name="password"
        type={showPassword ? "text" : "password"}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        value={value}
        onChange={onChange}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  </div>
);

const AuthConsumer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [usePassword, setUsePassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    loginType: "",
  });

  const {
    login,
    signup,
    googleLogin,
    sentOtp,
    sendVerification,
    loginLoading,
    signupLoading,
    otpLoading,
    cooldown,
  } = useAuthStore();

  const setSentOtp = (val) => useAuthStore.setState({ sentOtp: val });

  const getButtonText = () => {
    if (usePassword) return loginLoading ? "Logging in..." : "Login";
    if (!usePassword) {
      if (!sentOtp) return otpLoading ? "Getting OTP..." : "Request OTP";
      if (sentOtp) return signupLoading ? "Verifying OTP..." : "Verify OTP";
    }
  };

  const handleAuthType = () => {
    setUsePassword((prev) => !prev);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (sentOtp || usePassword) {
      isLogin
        ? await login(formData, "consumer")
        : await signup(formData, "consumer");
    } else {
      const otpRes = await sendVerification(formData, "consumer");
      setSentOtp(true);
    }
  };

  const handleGoogleSubmit = async (e) => {
    googleLogin();
  };

  const resendOtp = async () => {
    if (cooldown > 0) return;
    const otpRes = await sendVerification(formData, "consumer");
    console.log(sentOtp);
    setSentOtp(true);
  };

  useEffect(() => {
    if (cooldown === 0) {
      return;
    }
    const interval = setInterval(() => {
      console.log(cooldown);
      useAuthStore.setState((state) => {
        if (state.cooldown <= 1) {
          return { cooldown: 0 };
        }
        return { cooldown: state.cooldown - 1 };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="text-2xl font-bold text-primary text-center">
        <Link to="/">Locarto</Link>
      </div>

      <div className="max-w-md w-full mx-auto">
        <div className="bg-white py-6 px-4 shadow rounded-lg sm:px-6">
          <div className="flex justify-center mb-4"></div>

          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-gray-800">
              {isLogin ? "Customer Login" : "Customer Sign Up"}
            </h1>
          </div>

          <div className="flex mb-4">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setSentOtp(false);
              }}
              className={`flex-1 py-1.5 px-1 text-center font-medium rounded-l text-xs ${
                isLogin
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setSentOtp(false);
              }}
              className={`flex-1 py-1.5 px-1 text-center font-medium rounded-r text-xs ${
                !isLogin
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3" method="POST">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-700"
              >
                {isLogin ? "Email Address" : "Email"}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            {sentOtp && !usePassword && (
              <OtpInput value={formData.otp} onChange={handleChange} />
            )}

            {/* {!isLogin && (
              <>
                            <div>
                <label
                  htmlFor="name"
                  className="block text-xs font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    // required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>

                <div>
                  <label
                    htmlFor="address"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    // required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[100px,1fr]">
                  <div>
                    <label
                      htmlFor="age"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Age
                    </label>
                    <div className="mt-1 relative">
                      <select
                        id="age"
                        name="age"
                        // required
                        className="block w-full h-8 px-2 pr-5 border border-gray-300 rounded text-xs leading-4 bg-white appearance-none focus:outline-none focus:ring-primary focus:border-primary"
                        value={formData.age}
                        onChange={handleChange}
                      >
                        <option value="">Age</option>
                        {Array.from({ length: 101 }, (_, i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-gray-500 text-xs">
                        ▾
                      </span>
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="sex"
                      className="block text-xs font-medium text-gray-700"
                    >
                      Sex
                    </label>
                    <div className="mt-1 relative">
                      <select
                        id="sex"
                        name="sex"
                        // required
                        className="block w-full h-8 px-2 pr-5 border border-gray-300 rounded text-xs leading-4 bg-white appearance-none focus:outline-none focus:ring-primary focus:border-primary"
                        value={formData.sex}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-gray-500 text-xs">
                        ▾
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="block text-xs font-medium text-gray-700"
                  >
                    Country
                  </label>
                  <div className="mt-1 relative">
                    <select
                      id="country"
                      name="country"
                      // required
                      className="block w-full h-8 px-2 pr-5 border border-gray-300 rounded text-xs leading-4 bg-white appearance-none focus:outline-none focus:ring-primary focus:border-primary"
                      value={formData.country}
                      onChange={handleChange}
                    >
                      <option value="">Select Country</option>
                      <option value="us">United States</option>
                      <option value="ca">Canada</option>
                      <option value="uk">United Kingdom</option>
                      <option value="au">Australia</option>
                      <option value="de">Germany</option>
                    </select>
                    <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-gray-500 text-xs">
                      ▾
                    </span>
                  </div>
                </div>
              </>
            )} */}
            {isLogin && usePassword && (
              <PasswordInput
                value={formData.password}
                onChange={handleChange}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                isLogin={isLogin}
              />
            )}

            <div className="flex items-center justify-between text-xs">
              {isLogin && (
                <label className="flex items-center">
                  <a
                    onClick={handleAuthType}
                    className="font-medium text-primary hover:text-orange-600"
                  >
                    {usePassword ? "Use OTP instead" : "Use Password instead"}
                  </a>
                </label>
              )}
              {sentOtp && (
                <div className="">
                  <a
                    onClick={resendOtp}
                    className={
                      cooldown > 0
                        ? "font-medium text-gray-500 hover:text-gray-600 cursor-not-allowed"
                        : "font-medium text-primary hover:text-orange-600 cursor-pointer"
                    }
                  >
                    {cooldown < 1
                      ? "Resend Otp"
                      : `Resend OTP in ${cooldown} seconds`}
                  </a>
                </div>
              )}
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-1.5 px-3 rounded-md shadow-sm text-xs font-medium bg-orange-500 text-gray-700 hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
              >
                {getButtonText()}
              </button>
            </div>
          </form>
          {/* {isLogin && (
            <div>
              <button
                type="submit"
                onClick={handleAuthType}
                className="w-full mt-4 py-1.5 px-3 rounded-md shadow-sm text-xs font-medium bg-gray-200 text-gray-700 hover:bg-orange-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
              >
                {usePassword ? "Use OTP" : "Use Password"}
              </button>
            </div>
          )} */}

          <div className="mt-3">
            <button
              type="button"
              onClick={handleGoogleSubmit}
              className="w-full flex justify-center items-center py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300"
            >
              <i className="fab fa-google mr-1.5 text-sm"></i>{" "}
              {isLogin ? "Login with Google" : "Sign up with Google"}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              {isLogin
                ? "Don't have an account ? "
                : "Already have an account ? "}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary hover:text-orange-600 ml-1"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthConsumer;
