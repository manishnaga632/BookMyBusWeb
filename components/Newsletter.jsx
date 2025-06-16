'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000);
    }, 1500);
  };

  return (
    <section className="newsletter-section">
      <div className="newsletter-container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="newsletter-content"
        >
          <div className="newsletter-header">
            <h2 className="newsletter-title">
              Stay Updated with Travel Offers
            </h2>
            <p className="newsletter-description">
              Subscribe to receive exclusive deals, travel tips, and updates on new routes
            </p>
          </div>

          <form onSubmit={handleSubmit} className="newsletter-form">
            <div className="input-group">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="newsletter-input"
                required
              />
              <motion.button
                type="submit"
                className="newsletter-button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="loading-dots">
                    <span>.</span><span>.</span><span>.</span>
                  </span>
                ) : (
                  <>
                    Subscribe <Send size={18} className="icon" />
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {isSuccess && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="success-message"
            >
              Thank you for subscribing! Check your email for confirmation.
            </motion.div>
          )}

          <p className="privacy-note">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;