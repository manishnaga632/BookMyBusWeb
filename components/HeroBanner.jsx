'use client';

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bus, ShieldCheck, Ticket, Clock, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

const HeroBanner = () => {
  const router = useRouter();

  const handleBookNow = () => router.push('/booknow');

  // Features data
  const features = [
    { icon: <ShieldCheck size={20} />, text: "Safe & Secure Travel" },
    { icon: <Ticket size={20} />, text: "Easy Booking" },
    { icon: <Clock size={20} />, text: "On-Time Service" },
    { icon: <MapPin size={20} />, text: "500+ Destinations" }
  ];

  return (
    <section className="hero-banner">
      {/* Background Image with Gradient Overlay */}
      <div className="hero-bg-overlay"></div>
      <div className="hero-bg-image"></div>

      {/* Content */}
      <div className="hero-container">
        <div className="hero-content">
          {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="hero-tagline"
          >
            <Bus className="tagline-icon" size={18} />
            <span className="tagline-text">India's Most Trusted Bus Service</span>
          </motion.div>

          {/* Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            <span className="title-highlight">Comfortable</span>{" "}
            Journeys Start Here
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-subtitle"
          >
            Book bus tickets to 500+ destinations across India with guaranteed seats, 
            lowest prices, and 24/7 customer support.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 120, delay: 0.6 }}
            className="hero-btn-wrapper"
          >
            <Button 
              onClick={handleBookNow}
              className="px-8 py-6 text-lg font-semibold transition-all duration-300 bg-orange-500 hover:bg-orange-600 hover:shadow-lg hover:shadow-orange-500/30"
            >
              Book Your Seat <ArrowRight className="ml-2" size={20} />
            </Button>
            
            <Button 
              variant="outline" 
              className="px-8 py-6 text-lg font-semibold text-white border-white hover:bg-white/10 hover:text-white"
            >
              View Offers
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="hero-features"
          >
            {features.map((feature, index) => (
              <div key={index} className="hero-feature-item">
                <div className="feature-icon">{feature.icon}</div>
                <span className="feature-text">{feature.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Scrolling Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="hero-scroll-indicator"
      >
        <div className="scroll-arrow">
          <div className="arrow-inner"></div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroBanner;