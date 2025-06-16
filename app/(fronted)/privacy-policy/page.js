'use client';
import React, { useState, useEffect } from 'react';

const PrivacyPolicy = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="page-content">
      <h1>Privacy Policy</h1>

      <section>
        <h2>Introduction</h2>
        <p>
          At Book My Bus, your privacy is of utmost importance to us. This Privacy Policy outlines the types of personal
          information that we collect, how we use it, and how we protect your information. By using our services, you
          agree to the collection and use of information in accordance with this policy.
        </p>
      </section>

      <section>
        <h2>Data We Collect</h2>
        <p>
          We may collect the following types of information:
        </p>
        <ul>
          <li>Personal identification details (name, email, phone number, etc.)</li>
          <li>Transaction information (booking history, payment details)</li>
          <li>Device and usage information (IP address, browser type, device info, etc.)</li>
          <li>Location data (if enabled by you)</li>
        </ul>
      </section>

      <section>
        <h2>How We Use Your Data</h2>
        <p>
          The information we collect is used for various purposes, including:
        </p>
        <ul>
          <li>To provide and improve our services (e.g., booking process, customer support)</li>
          <li>To personalize your experience on our platform</li>
          <li>To process transactions and send relevant updates regarding your bookings</li>
          <li>To send promotional content and offers (with your consent)</li>
          <li>To monitor and analyze usage patterns to improve the website's performance</li>
        </ul>
      </section>

      <section>
        <h2>How We Protect Your Data</h2>
        <p>
          We take the security of your personal information seriously and implement various security measures to ensure its
          protection, including:
        </p>
        <ul>
          <li>Encryption of sensitive data (e.g., payment information)</li>
          <li>Secure servers and data storage</li>
          <li>Regular security audits to ensure compliance with the best practices</li>
        </ul>
      </section>

      <section>
        <h2>Third-Party Sharing</h2>
        <p>
          We do not sell or rent your personal data to third parties. However, we may share your information with trusted third
          parties to perform services on our behalf, including payment processing, booking management, and customer support.
          These third parties are obligated to keep your information confidential and secure.
        </p>
      </section>

      <section>
        <h2>Your Rights</h2>
        <p>
          You have the following rights regarding your personal data:
        </p>
        <ul>
          <li>Right to access, update, or delete your personal information</li>
          <li>Right to opt-out of receiving promotional emails and communications</li>
          <li>Right to request data portability</li>
        </ul>
      </section>

      <section>
        <h2>Changes to This Privacy Policy</h2>
        <p>
          We reserve the right to update or modify this Privacy Policy at any time. Any changes will be reflected on this page,
          and we encourage you to periodically review it to stay informed about how we protect your information.
        </p>
      </section>

      <section className="contact-info">
        <h2>Contact Us</h2>
        <p>
          If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at:
        </p>
        <p>
          Email: <span className="text-blue-600">support@bookmybus.com</span>
        </p>
        <p>
          Phone: <span className="text-blue-600">+91 6367116164</span>
        </p>
      </section>

      <a 
        href="#" 
        onClick={scrollToTop} 
        className={`back-to-top ${isVisible ? 'visible' : ''}`}
        aria-label="Back to top"
      >
        ↑
      </a>
    </div>
  );
};

export default PrivacyPolicy;