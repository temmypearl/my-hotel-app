import React, { useState } from "react";
import { Mail, Lock, User, Phone, Eye, EyeOff } from "lucide-react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = ({ onRegistrationSuccess }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) {
      setServerError("");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    // Password (common for login and register)
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else {
      if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters";
      }
      if (!/[A-Z]/.test(formData.password)) {
        newErrors.password = "Password must include at least one uppercase letter";
      }
      if (!/[0-9]/.test(formData.password)) {
        newErrors.password = "Password must include at least one number";
      }
      if (!/[^A-Za-z0-9]/.test(formData.password)) {
        newErrors.password = "Password must include at least one special character";
      }
    }

    if (!isLogin) {
      // First Name: min 6 chars
      if (!formData.firstName.trim()) {
        newErrors.firstName = "First name is required";
      } else if (formData.firstName.trim().length < 6) {
        newErrors.firstName = "First name must be at least 6 characters";
      }

      // Last Name: min 2 chars
      if (!formData.lastName.trim()) {
        newErrors.lastName = "Last name is required";
      } else if (formData.lastName.trim().length < 2) {
        newErrors.lastName = "Last name must be at least 2 characters";
      }

      // Phone Number: max 11 chars
      if (!formData.phoneNumber.trim()) {
        newErrors.phoneNumber = "Phone number is required";
      } else if (formData.phoneNumber.trim().length > 11) {
        newErrors.phoneNumber = "Phone number must be at most 11 characters";
      }

      // Confirm Password matches Password
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }

      // Confirm Password pattern (optional strict check)
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required";
      } else {
        if (formData.confirmPassword.length < 6) {
          newErrors.confirmPassword = "Confirm password must be at least 6 characters";
        }
        if (!/[A-Z]/.test(formData.confirmPassword)) {
          newErrors.confirmPassword = "Confirm password must include at least one uppercase letter";
        }
        if (!/[0-9]/.test(formData.confirmPassword)) {
          newErrors.confirmPassword = "Confirm password must include at least one number";
        }
        if (!/[^A-Za-z0-9]/.test(formData.confirmPassword)) {
          newErrors.confirmPassword = "Confirm password must include at least one special character";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (validateForm()) {
    setLoading(true);
    setServerError("");
    try {
      if (isLogin) {
        const response = await axios.post('http://localhost:4000/api/v1/auth/users/login', {
          email: formData.email,
          password: formData.password,
        });
        console.log('Login successful:', response.data);

        // Extract user data and tokens from response
        const userData = {
          id: response.data.user?.id || 1,
          firstName: response.data.user?.firstName || formData.email.split('@')[0],
          lastName: response.data.user?.lastName || '',
          email: response.data.user?.email || formData.email,
          phoneNumber: response.data.user?.phoneNumber || ''
        };

        // Extract accessToken and refreshToken explicitly
        const accessToken = response.data.token?.accessToken || response.data.accessToken || 'mock-access-token';
        const refreshToken = response.data.token?.refreshToken || 'mock-refresh-token'; // Assuming refreshToken is always nested under 'token'

        // --- Store tokens in user cache (localStorage/sessionStorage) ---
        sessionStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        // ----------------------------------------------------------------

        // Use the auth context login function (if it handles user data only)
        login(userData, accessToken); // Pass accessToken if your context needs it

        // Check if there's a redirect path stored
        const redirectPath = sessionStorage.getItem('redirectAfterLogin');
        if (redirectPath) {
          // Clear the stored redirect path
          sessionStorage.removeItem('redirectAfterLogin');
          // Redirect to the intended page
          navigate(redirectPath);
        } else {
          // Default redirect to home
          navigate('/');
        }
      } else {
        const response = await axios.post('http://localhost:4000/api/v1/auth/users/signin', {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          phoneNumber: formData.phoneNumber,
        });
        console.log('Registration successful, redirecting to OTP page');
        onRegistrationSuccess(formData.email);
      }
    } catch (error) {
      console.error(isLogin ? 'Login failed:' : 'Registration failed:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || error.message || 'An error occurred';
      setServerError(errorMessage);
    } finally {
      setLoading(false);
    }
  }
};

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setServerError("");
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phoneNumber: "",
    });
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b1b1b] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-black p-8 rounded-lg shadow-xl mt-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#aa8453] mb-2 font-serif">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-300 text-sm font-serif">
            {isLogin
              ? "Sign in to access your account"
              : "Join us for exclusive benefits"}
          </p>
          {/* Show redirect message if coming from reservation */}
          {sessionStorage.getItem('redirectAfterLogin') === '/reservation' && (
            <div className="mt-4 p-3 bg-[#aa8453] bg-opacity-20 border border-[#aa8453] rounded-md">
              <p className="text-[#aa8453] text-sm">
                Please log in to make a reservation
              </p>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aa8453]" size={20} />
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name"
                  className={`pl-10 w-full py-3 bg-gray-800 text-white rounded-md ${
                    errors.firstName ? "border border-red-500" : "border border-transparent"
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
              )}

              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aa8453]" size={20} />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name"
                  className={`pl-10 w-full py-3 bg-gray-800 text-white rounded-md ${
                    errors.lastName ? "border border-red-500" : "border border-transparent"
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
              )}

              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aa8453]" size={20} />
                <input
                  type="text"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`pl-10 w-full py-3 bg-gray-800 text-white rounded-md ${
                    errors.phoneNumber ? "border border-red-500" : "border border-transparent"
                  }`}
                />
              </div>
              {errors.phoneNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.phoneNumber}</p>
              )}
            </>
          )}

          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aa8453]" size={20} />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address"
                className={`pl-10 w-full py-3 bg-gray-800 text-white rounded-md ${
                  errors.email ? "border border-red-500" : "border border-transparent"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aa8453]" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`pl-10 pr-10 w-full py-3 bg-gray-800 text-white rounded-md ${
                  errors.password ? "border border-red-500" : "border border-transparent"
                }`}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#aa8453] hover:text-[#d5a464] transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          {!isLogin && (
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aa8453]" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`pl-10 pr-10 w-full py-3 bg-gray-800 text-white rounded-md ${
                    errors.confirmPassword ? "border border-red-500" : "border border-transparent"
                  }`}
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#aa8453] hover:text-[#d5a464] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {serverError && (
            <p className="text-red-500 text-center text-sm mt-2">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#aa8453] text-black font-semibold rounded-md hover:bg-[#d5a464] transition-colors"
          >
            {loading ? (isLogin ? "Logging in..." : "Registering...") : (isLogin ? "Login" : "Register")}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-300 text-sm font-serif">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleMode}
            className="text-[#aa8453] font-semibold hover:underline"
          >
            {isLogin ? "Create Account" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;