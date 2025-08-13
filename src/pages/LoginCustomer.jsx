import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Reusable Password input with conditional show/hide
const PasswordInput = ({ value, onChange, showPassword, setShowPassword, isLogin }) => (
  <div>
    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
      {isLogin ? 'Password' : 'Create Password'}
    </label>
    <div className="relative">
      <input
        id="password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        required
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        value={value}
        onChange={onChange}
        placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
      />
      {value.length > 0 && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      )}
    </div>
  </div>
);

const LoginCustomer = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', address: '', phone: '', age: '', sex: '', country: ''
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login('customer');
    navigate('/customer/dashboard');
  };

  // Dynamic text based on state
  const getTitle = () => isLogin ? 'Customer Login' : 'Customer Sign Up';
  const getSubtitle = () => isLogin 
    ? 'Welcome back! Please enter your details' 
    : 'Create your account to get started';
  const getButtonText = () => isLogin ? 'Sign in' : 'Create Account';
  const getToggleText = () => isLogin 
    ? "Don't have an account? " 
    : "Already have an account? ";
  const getToggleLinkText = () => isLogin ? 'Sign up' : 'Sign in';

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white py-6 px-4 shadow rounded-lg sm:px-6">
          <div className="flex justify-center mb-4">
            <div className="text-xl font-bold text-primary">Locarto</div>
          </div>

          <div className="text-center mb-5">
            <h1 className="text-xl font-bold text-gray-800">{getTitle()}</h1>
            <p className="text-gray-600 text-sm mt-1">{getSubtitle()}</p>
          </div>

          <div className="flex mb-4">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-1.5 px-1 text-center font-medium rounded-l text-xs ${isLogin ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-1.5 px-1 text-center font-medium rounded-r text-xs ${!isLogin ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-xs font-medium text-gray-700">Full Name</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-xs font-medium text-gray-700">
                {isLogin ? 'Email Address' : 'Email'}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                value={formData.email}
                onChange={handleChange}
                placeholder={isLogin ? 'Enter your email' : 'Enter your email address'}
              />
            </div>

            <PasswordInput 
              value={formData.password}
              onChange={handleChange}
              showPassword={showPassword}
              setShowPassword={setShowPassword}
              isLogin={isLogin}
            />

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="phone" className="block text-xs font-medium text-gray-700">Phone Number</label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-xs font-medium text-gray-700">Address</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-1.5 px-2 text-sm focus:outline-none focus:ring-primary focus:border-primary"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter your full address"
                  />
                </div>

                {/* Age (narrow) + Sex (fills rest) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-[100px,1fr]">
                  <div>
                    <label htmlFor="age" className="block text-xs font-medium text-gray-700">Age</label>
                    <div className="mt-1 relative">
                      <select
                        id="age"
                        name="age"
                        required
                        className="block w-full h-8 px-2 pr-5 border border-gray-300 rounded text-xs leading-4 bg-white appearance-none focus:outline-none focus:ring-primary focus:border-primary"
                        value={formData.age}
                        onChange={handleChange}
                      >
                        <option value="">Age</option>
                        {Array.from({ length: 101 }, (_, i) => (
                          <option key={i} value={i}>{i}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-gray-500 text-xs">▾</span>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="sex" className="block text-xs font-medium text-gray-700">Sex</label>
                    <div className="mt-1 relative">
                      <select
                        id="sex"
                        name="sex"
                        required
                        className="block w-full h-8 px-2 pr-5 border border-gray-300 rounded text-xs leading-4 bg-white appearance-none focus:outline-none focus:ring-primary focus:border-primary"
                        value={formData.sex}
                        onChange={handleChange}
                      >
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                      <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-gray-500 text-xs">▾</span>
                    </div>
                  </div>
                </div>

                {/* Country (match height) */}
                <div>
                  <label htmlFor="country" className="block text-xs font-medium text-gray-700">Country</label>
                  <div className="mt-1 relative">
                    <select
                      id="country"
                      name="country"
                      required
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
                    <span className="pointer-events-none absolute inset-y-0 right-1 flex items-center text-gray-500 text-xs">▾</span>
                  </div>
                </div>
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
                  <span className="ml-1.5 text-xs text-gray-900">Remember me</span>
                </label>
                <div className="text-xs">
                  <a href="#" className="font-medium text-primary hover:text-orange-600">Forgot password?</a>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-1.5 px-3 rounded-md shadow-sm text-xs font-medium text-white bg-primary hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
              >
                {getButtonText()}
              </button>
            </div>
          </form>

          {isLogin && (
            <div className="mt-3">
              <button
                type="button"
                onClick={() => console.log('Sign in with Google')}
                className="w-full flex justify-center items-center py-1.5 px-3 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-300"
              >
                <i className="fab fa-google mr-1.5 text-sm"></i> Sign in with Google
              </button>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-600">
              {getToggleText()}
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-medium text-primary hover:text-orange-600 ml-1"
              >
                {getToggleLinkText()}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginCustomer;