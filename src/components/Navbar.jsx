import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Navbar = () => {
  const [nav, setNav] = useState(false);
  const [scrolled, setScrolled] = useState(false); 
  const location = useLocation(); // Get current location/path

  const handleNav = () => setNav(!nav);

  const closeMobileMenu = () => {
    setNav(false);
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

  // Check if the current path matches the nav item path
  // Don't apply active effect to home page
  const isActive = (path) => {
    if (path === "/") {
      return false; // Never show underline for home
    }
    return location.pathname === path;
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 flex justify-between items-center px-10 h-24 z-50 ${scrolled ? 'bg-black' : 'bg-transparent'}`}
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

          {/* <ul>
            <li className="hidden md:flex">
              <Link 
                to="/login"
                className="text-[#fff] hover:text-[#cec1b0] cursor-pointer border-2 border-[#aa8453] rounded bg-[#aa8453] px-2"
              >
                LOGIN
              </Link>
            </li>
          </ul> */}
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
          {/* <ul className="mt-4">
            <li>
              <Link 
                to="/login"
                className="text-[#fff] hover:text-[#cec1b0] cursor-pointer border-2 border-[#aa8453] rounded bg-[#aa8453] px-2"
              >
                LOGIN
              </Link>
            </li>
          </ul> */}
        </div>
      </div>
    </>
  );
};

export default Navbar;