
'use client';

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from 'next/link';

import { ArrowRight, BadgePercent, Sun, Gift, Bus } from "lucide-react";

const offers = [
  {
    id: 1,
    title: "Mega Bus Bonanza",
    description: "Flat 50% off on all routes this weekend",
    discount: "50% OFF",
    icon: <BadgePercent size={24} />,
    bgClass: "offer-card-orange",
    imageUrl: "/assets/Bonanza-travel.jpg", // Corrected path and extension
  },
  {
    id: 2,
    title: "Summer Escape",
    description: "Book hill station trips & get 2 seats for price of 1",
    discount: "1+1 OFFER",
    icon: <Sun size={24} />,
    bgClass: "offer-card-blue",
    imageUrl: "/assets/summer-travel.jpg", // Corrected path and extension
  },
  {
    id: 3,
    title: "Refer & Travel Free",
    description: "Earn ₹200 cashback for every friend who books",
    discount: "₹100 CASHBACK",
    icon: <Gift size={24} />,
    bgClass: "offer-card-green",
    imageUrl: "/assets/Refer-travel.jpg", // Corrected path and extension
  },

];

const OffersBanner = () => {
  return (
    <section className="offers-section">
      <div className="offers-container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="offers-heading"
        >
          Exclusive Bus Travel Offers
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="offers-subheading"
        >
          Unlock special discounts and promotions for your next journey
        </motion.p>

        <div className="offers-grid">
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              viewport={{ once: true }}
              className={`offer-card ${offer.bgClass}`}
            >
              <div className="offer-overlay"></div>
              <Image
                src={offer.imageUrl}
                alt={offer.title}
                width={500}
                height={300}
                className="offer-image"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              />

              <div className="offer-content">
                <div className="offer-icon">
                  {offer.icon}
                </div>

                <div className="offer-details">
                  <span className="offer-discount">
                    {offer.discount}
                  </span>

                  <h3 className="offer-title">
                    {offer.title}
                  </h3>
                  <p className="offer-description">
                    {offer.description}
                  </p>
                  <Link href="/booknow">
                    <button className="main-cta-button">
                      View All Offers
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="offers-footer"
        >
          <button className="main-cta-button">
            View All Offers
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default OffersBanner;





