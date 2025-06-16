'use client';

import React from "react";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube, FaApple, FaGooglePlay } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-bg"></div>

      <div className="footer-container">

        {/* Company Info */}
        <div className="footer-section">
          <h1 className="footer-title">Book My Bus</h1>
          <p className="footer-description">
            India's trusted travel partner — easy, affordable, and unforgettable journeys. Ride safe, ride smart!
          </p>
          <div className="footer-social">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaTwitter /></a>
            <a href="#"><FaYoutube /></a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="footer-section">
          <h3 className="footer-heading">Explore</h3>
          <ul className="footer-links">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/booknow">Book Now</Link></li>
            <li><Link href="/booking">My Bookings</Link></li>
            <li><Link href="/contactus">Contact Us</Link></li>
          </ul>
        </div>

        {/* Services */}
        <div className="footer-section">
          <h3 className="footer-heading">Services</h3>
          <ul className="footer-links">
            <li><Link href="/searchbar">Bus Routes</Link></li>
            <li><Link href="/booknow">Offers & Discounts</Link></li>
            <li><Link href="/contactus">Customer Support</Link></li>
            <li><Link href="/#">Terms & Conditions</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* App Download */}
        <div className="footer-section">
          <h3 className="footer-heading">Download Our App</h3>
          <p className="footer-description">Book faster on mobile! Get our app today:</p>
          <div className="footer-apps">
            <a href="#" className="footer-btn google">
              <FaGooglePlay />
              <span>Google Play</span>
            </a>
            <a href="#" className="footer-btn apple">
              <FaApple />
              <span>App Store</span>
            </a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} <strong>Book My Bus™</strong> — All Rights Reserved | Made with ❤️ in India
      </div>
    </footer>
  );
};

export default Footer;
