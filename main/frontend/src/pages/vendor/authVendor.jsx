import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { Link } from "react-router-dom";

const PasswordInput = ({
  value,
  onChange,
  showPassword,
  setShowPassword,
  id = "password",
}) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      Password
    </label>
    <div className="relative">
      <input
        id={id}
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
        tabIndex={-1}
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  </div>
);

const AuthVendor = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { login, signup, loginLoading, signupLoading } = useAuthStore();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isLogin
      ? await login(formData, "vendor")
      : await signup(formData, "vendor");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-2xl font-bold text-primary text-center">
        <Link to="/">Locarto</Link>
      </div>

      <div className="flex justify-center mb-6"></div>
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-gray-800">
              {isLogin ? "Vendor Login" : "Vendor Sign Up"}
            </h1>
          </div>

          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg ${
                isLogin
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg ${
                !isLogin
                  ? "bg-orange-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isLogin ? (
              <>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <PasswordInput
                  value={formData.password}
                  onChange={handleChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  id="password"
                />
              </>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Business Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <PasswordInput
                  value={formData.password}
                  onChange={handleChange}
                  showPassword={showPassword}
                  setShowPassword={setShowPassword}
                  id="password"
                />
              </>
            )}
            {isLogin && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-3.5 w-3.5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="ml-1.5 text-xs text-gray-900">
                    Remember me
                  </span>
                </label>
                <div className="text-xs">
                  <a
                    href="#"
                    className="font-medium text-primary hover:text-orange-600"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
            )}
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isLogin && (!loginLoading ? "Login" : "Logging in.....")}
                {!isLogin &&
                  (!signupLoading ? "Create Account" : "Signing up.....")}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin
                ? "Don't have an account ? "
                : "Already have an account ? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary hover:text-orange-600"
                type="button"
              >
                {isLogin ? "Create Account" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthVendor;
