import React, { useState } from "react";
import { Mail, Lock, User } from "lucide-react";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));


    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin) {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required";
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form submitted:", formData);
      alert(isLogin ? "Login successful!" : "Registration successful!");
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1b1b1b] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-black p-8 rounded-lg shadow-xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-[#aa8453] mb-2 font-serif">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-300 text-sm font-serif">
            {isLogin
              ? "Sign in to access your account"
              : "Join us for exclusive benefits"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#aa8453]" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={`pl-10 w-full py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa8453] ${
                    errors.name ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>
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
                className={`pl-10 w-full py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa8453] ${
                  errors.email ? "border-red-500" : ""
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
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`pl-10 w-full py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa8453] ${
                  errors.password ? "border-red-500" : ""
                }`}
              />
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
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`pl-10 w-full py-3 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-[#aa8453] ${
                    errors.confirmPassword ? "border-red-500" : ""
                  }`}
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {isLogin && (
            <div className="flex justify-end">
              <a
                href="#"
                className="text-sm text-[#aa8453] hover:text-[#d5a464]"
              >
                Forgot password?
              </a>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-[#aa8453] hover:bg-[#d5a464] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#aa8453] transition duration-300"
            >
              {isLogin ? "Sign In" : "Register"}
            </button>
          </div>

          <div className="flex items-center justify-center">
            <div className="text-sm">
              <button
                type="button"
                onClick={toggleMode}
                className="font-medium text-gray-300 hover:text-[#aa8453]"
              >
                {isLogin
                  ? "Don't have an account? Register"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </form>

     
      </div>
    </div>
  );
};

export default Login;