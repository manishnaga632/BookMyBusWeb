
"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from '@/context/UserContext';
import { FaBus, FaUser, FaChevronDown, FaChevronUp, FaTicketAlt, FaRoute, FaInfoCircle, FaPhone } from "react-icons/fa";

const Navbar = () => {
  const { userInfo, logout } = useUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef(null);

  const navLinks = [
    { name: "Home", href: "/", icon: <FaBus className="mr-2" /> },
    { name: "Book Tickets", href: "/booknow", icon: <FaTicketAlt className="mr-2" /> },
    { name: "Routes", href: "/searchbar", icon: <FaRoute className="mr-2" /> },
    { name: "My Bookings", href: "/booking", icon: <FaTicketAlt className="mr-2" /> },
    { name: "About Us", href: "/about", icon: <FaInfoCircle className="mr-2" /> },
    { name: "Contact", href: "/contactus", icon: <FaPhone className="mr-2" /> },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
  };

  return (
    <div className="navbar-container">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <Link href="/" className="navbar-brand">
            <FaBus className="logo-icon" />
            <div className="logo-text">
              <span className="logo-main">SwiftJourney</span>
              <span className="logo-sub">Travel with Comfort</span>
            </div>
          </Link>

          <button
            className="d-lg-none btn btn-outline-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? "Close" : "Menu"}
          </button>

          <div className={`d-lg-flex ${mobileMenuOpen ? "d-block" : "d-none"}`}>
            <ul className="navbar-links">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className={`navbar-link ${pathname === link.href ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="navbar-actions">
              {userInfo ? (
                <div className="user-dropdown" ref={dropdownRef}>
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="user-button"
                  >
                    <FaUser className="user-avatar" />
                    <span className="user-name">
                      {userInfo.first_name || "User"}
                    </span>
                    {dropdownOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                  </button>

                  <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                    <Link
                      href="/profile"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaUser className="mr-2" /> Profile
                    </Link>
                    <Link
                      href="/update-password"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i className="fas fa-lock mr-2"></i> Update Password
                    </Link>
                    <Link
                      href="/booking"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <FaTicketAlt className="mr-2" /> My Bookings
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="login-button">
                  <FaUser className="mr-2" />
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;