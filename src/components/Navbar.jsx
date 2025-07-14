import React, { useState, useEffect } from "react";
import { Menu, X, User, LogOut, ChevronDown } from "lucide-react"; 
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false); 
  const [showUserDropdown, setShowUserDropdown] = useState(false); 
  const location = useLocation();
  const navigate = useNavigate(); 
  const { user, isAuthenticated, logout } = useAuth(); 

  const handleNav = () => setNav(!nav);

  const closeMobileMenu = () => {
    setNav(false);
  };

  // Add logout handler
  const handleLogout = () => {
    logout();
    setShowUserDropdown(false);
    navigate('/');
  };

  const navItems = [
    { label: "HOME", path: "/" },
    { label: "ABOUT", path: "/aboutus" },
    { label: "SERVICES", path: "/service" }, 
    { label: "RESERVATION", path: "/reservation" },
    { label: "CONTACT", path: "/contact" },
  ];

  const handleScroll = () => {
    if (window.scrollY > 0) {
      setScrolled(true);
    } else {
      setScrolled(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };     
  }, []);

  // Add click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setShowUserDropdown(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path) => {
    if (path === "/") {
      return false; // Never show underline for home
    }
    return location.pathname === path;
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-10 h-24 z-50 ${scrolled ? 'bg-[#695233]' : 'bg-transparent'}`}
      >
        <div>
          <Link to="/" className="text-[#aa8453] text-xl lg:text-xl font-semibold">
            UI HOTEL
          </Link>
        </div>

        <div className="flex hover:ease-in-out gap-6">
          <ul className="hidden md:flex gap-6 font-serif">
            {navItems.map((item, index) => (
              <li key={index}>
                <Link 
                  to={item.path}
                  className={`cursor-pointer relative ${
                    item.label === "HOME" ? "text-[#aa8453]" : 
                    isActive(item.path) ? "text-[#aa8453]" : "text-white hover:text-[#aa8453]"
                  }`}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#aa8453] -mb-1"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* Updated Authentication Section */}
          <ul>
            <li className="hidden md:flex">
              {isAuthenticated ? (
                // User Widget Dropdown
                <div className="relative user-dropdown">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 text-white hover:text-[#2b2217] cursor-pointer border-2 border-[#aa8453] rounded-full bg-[#aa8453] px-3 py-1 transition-colors"
                  >
                    <User size={16} />
                    <span className="text-sm">
                      {user?.firstName || 'User'}
                    </span>
                    <ChevronDown size={14} className={`transition-transform ${showUserDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showUserDropdown && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-black border border-[#aa8453] rounded-lg shadow-xl py-2">
                      <div className="px-4 py-2 border-b border-gray-700">
                        <p className="text-[#aa8453] text-sm font-semibold">Welcome!</p>
                        <p className="text-gray-300 text-xs">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-white hover:bg-gray-800 hover:text-[#aa8453] transition-colors flex items-center gap-2"
                      >
                        <LogOut size={16} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Original Login Button
                <Link 
                  to="/login"
                  className="text-[#fff] hover:text-[#cec1b0] cursor-pointer border-2 border-[#aa8453] rounded-full  bg-[#aa8453] px-4 "
                >
                  LOGIN
                </Link>
              )}
            </li>
          </ul>
        </div>

        {/* Mobile Screen Toggle */}
        <div 
          onClick={handleNav} 
          className="block lg:gap-1 md:hidden absolute right-6 top-1/2 transform -translate-y-1/2 z-50"
        >
          {!nav ? <Menu className="text-white" /> : <X className="text-white" />}
        </div>
      </div>
      <div
        className={`
          fixed top-0 w-full h-screen bg-black 
          transform transition-transform duration-500 z-40
          ${nav ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="pt-24 text-center">
          <ul className="space-y-4">
            {navItems.map((item, index) => (
              <li key={index} className="p-2">
                <Link
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`
                    cursor-pointer relative
                    ${item.label === "HOME"
                      ? "text-[#aa8453]"
                      : isActive(item.path) 
                        ? "text-[#aa8453]" 
                        : "text-white hover:text-[#aa8453]"
                    }
                  `}
                >
                  {item.label}
                  {isActive(item.path) && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#aa8453] -mb-1"></span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
          
          {/* Updated Mobile Authentication Section */}
          <ul className="mt-6 px-6">
            <li>
              {isAuthenticated ? (
                <div className="space-y-3">
                  <div className="text-center py-3 bg-gray-800 rounded-lg">
                    <p className="text-[#aa8453] text-sm font-semibold">Welcome!</p>
                    <p className="text-gray-300 text-xs">{user?.firstName} {user?.lastName}</p>
                    <p className="text-gray-400 text-xs">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className=" w-full text-center py-3 bg-red-600 text-white font-semibold rounded-lg border-2 border-red-600 hover:bg-red-700 hover:border-red-700 transition flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  onClick={closeMobileMenu}
                  className="block w-full text-center py-3 bg-[#aa8453] text-white font-semibold rounded-lg border-2 border-[#aa8453] hover:bg-[#d5a464] hover:border-[#d5a464] transition"
                >
                  LOGIN
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Navbar;