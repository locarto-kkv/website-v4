// LoginVendor.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Make sure to import useNavigate
import { useAuth } from '../context/AuthContext';

// Reusable Password input with conditional show/hide
const PasswordInput = ({ value, onChange, showPassword, setShowPassword, id = "password" }) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">Password</label>
    <div className="relative">
      <input
        id={id}
        name="password"
        type={showPassword ? 'text' : 'password'}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        value={value}
        onChange={onChange}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          tabIndex={-1}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      )}
    </div>
  </div>
);

const LoginVendor = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '', email: '', password: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Fake helpers if you don't have a backend yet
  const fakeApi = {
    login: async ({ email, password }) => {
      await new Promise(r => setTimeout(r, 300));
      // return a token + vendor object as your real API would
      return {
        token: 'fake-login-token',
        vendor: { id: 'v_123', email, businessName: 'My Biz', approved: true }
      };
    },
    signup: async ({ businessName, email, password }) => {
      await new Promise(r => setTimeout(r, 400));
      // immediately "approved" by design OR just ignored
      return {
        token: 'fake-signup-token',
        vendor: { id: 'v_999', email, businessName, approved: true } // Assuming approved for immediate access
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isLogin) {
        // ---- LOGIN ----
        const { token, vendor } = await fakeApi.login({
          email: formData.email,
          password: formData.password
        });
        await login('vendor', { token, vendor });
        // Navigate to dashboard without special state for login
        navigate('/vendor/dashboard');
      } else {
        // ---- SIGNUP (NO PENDING APPROVAL) ----
        const { token, vendor } = await fakeApi.signup({
          businessName: formData.businessName,
          email: formData.email,
          password: formData.password
        });

        const normalizedVendor = { ...vendor, approved: true };

        await login('vendor', { token, vendor: normalizedVendor });
        // Navigate to dashboard and indicate it's after a new signup
        // Pass state to indicate the user just signed up
        navigate('/vendor/dashboard', { state: { fromSignup: true } });
      }
    } catch (err) {
      console.error(err);
      alert(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white py-8 px-4 shadow rounded-lg sm:px-10">
          <div className="flex justify-center mb-6">
            <div className="text-2xl font-bold text-primary">Locarto</div>
          </div>

          <div className="flex mb-6">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-l-lg ${isLogin ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-center font-medium rounded-r-lg ${!isLogin ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Setup
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {isLogin ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    value={formData.businessName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
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
            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                {isLogin ? 'Sign in' : 'Create Account'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "New vendor? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary hover:text-orange-600"
                type="button"
              >
                {isLogin ? 'Create Account' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginVendor;
