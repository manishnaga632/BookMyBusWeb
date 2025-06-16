'use client';

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

const products = [
  {
    id: 1,
    name: "Luxury Bus Ticket",
    price: "₹999",
    image: "https://www.shutterstock.com/image-photo/nuremberg-germany-september-19-2019-260nw-1569125212.jpg",
    description: "Travel in luxury and comfort with our top-class buses featuring premium amenities.",
    highlights: ["Reclining seats", "Onboard WiFi", "Charging ports", "Personal entertainment"]
  },
  {
    id: 2,
    name: "Economy Bus Ticket",
    price: "₹499",
    image: "https://narraholidays.com/wp-content/uploads/2024/07/WhatsApp-Image-2024-09-24-at-6.28.57-PM.jpeg",
    description: "Affordable travel options without compromising comfort.",
    highlights: ["Comfortable seats", "AC cabins", "On-time service", "Affordable pricing"]
  },
  {
    id: 3,
    name: "Premium Bus Package",
    price: "₹1599",
    image: "https://thumbs.dreamstime.com/b/luxury-interior-modern-premium-bus-plush-seating-ambient-lighting-experience-opulence-designed-ultimate-370595310.jpg",
    description: "Travel in style with premium services and amenities.",
    highlights: ["Luxury seating", "Gourmet meals", "Extra legroom", "Priority boarding"]
  },
];

const ProductSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => 
        prevIndex === products.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleBookNow = () => {
    router.push("/booknow");
  };

  return (
    <section className="product-slider">
      <div className="slider-container">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="slider-title"
        >
          Premium Bus Travel Packages
        </motion.h2>

        <div className="slider-wrapper">
          <motion.div
            key={currentIndex}
            initial={{ x: direction > 0 ? 100 : -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -100 : 100, opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="slide"
          >
            <div className="image-container">
              <img 
                src={products[currentIndex].image} 
                alt={products[currentIndex].name}
                className="slider-image"
              />
              <div className="image-overlay"></div>
            </div>

            <div className="product-content">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="product-info"
              >
                <h3 className="product-title">{products[currentIndex].name}</h3>
                <p className="product-description">{products[currentIndex].description}</p>
                
                <ul className="highlights-list">
                  {products[currentIndex].highlights.map((item, i) => (
                    <li key={i} className="highlight-item">
                      <span className="highlight-icon">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="price-container">
                  <span className="price-label">Starting from</span>
                  <span className="product-price">{products[currentIndex].price}</span>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="button-container"
              >
                <Button onClick={handleBookNow} className="book-now-btn">
                  Book Now <ArrowRight className="ml-2" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div className="slider-controls">
          <button onClick={handlePrev} className="slider-arrow left-arrow">
            <ChevronLeft size={32} />
          </button>
          
          <div className="dots-container">
            {products.map((_, index) => (
              <button
                key={index}
                className={`dot ${currentIndex === index ? 'active' : ''}`}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
              />
            ))}
          </div>
          
          <button onClick={handleNext} className="slider-arrow right-arrow">
            <ChevronRight size={32} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductSlider;