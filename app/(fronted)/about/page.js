'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function AboutUs() {
  const [travelers, setTravelers] = useState(0);
  const [destinations, setDestinations] = useState(0);
  const [partners, setPartners] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adminInfo, setAdminInfo] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  const team = [
    {
      name: 'Mr Manu',
      role: 'Founder & CEO',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTFTKzp6p1CAilW8RK2ksBiwlz9E2QF7xJHg&s',
    },
    {
      name: 'Mr Hemaraj',
      role: 'Head of Operations',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTFTKzp6p1CAilW8RK2ksBiwlz9E2QF7xJHg&s',
    },
    {
      name: 'Mr Rahul',
      role: 'Customer Success Manager',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFT2b06U45jenXLUJ3FFcXjPQZHgW4eURc_w&s',
    },
  ];

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/admin_profile/all`);
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setAdminInfo(data[0]);
          // Set counter targets from API data
          setTravelers(data[0].happy_travelers);
          setDestinations(data[0].destinations_covered);
          setPartners(data[0].travel_partners);
        }
      } catch (err) {
        console.error("Failed to fetch admin info:", err);
      }
    };

    fetchAdminInfo();
  }, [API_URL]);

  // Counter Animation
  useEffect(() => {
    if (!adminInfo) return;
    
    const interval = setInterval(() => {
      setTravelers((prev) => (prev < adminInfo.happy_travelers ? prev + Math.ceil(adminInfo.happy_travelers/100) : adminInfo.happy_travelers));
      setDestinations((prev) => (prev < adminInfo.destinations_covered ? prev + 1 : adminInfo.destinations_covered));
      setPartners((prev) => (prev < adminInfo.travel_partners ? prev + 1 : adminInfo.travel_partners));
    }, 30);
    return () => clearInterval(interval);
  }, [adminInfo]);

  // Carousel Auto-slide
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % team.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [team.length]);

  return (
    <div className="container-fluid p-5">
      {/* Hero Section */}
      <div className="container-fluid bg-primary p-5 bg-hero mb-5">
        <div className="row py-5">
          <div className="col-12 text-center">
            <h1 className="display-2 text-uppercase text-white mb-md-4">About BookMyBus</h1>
            <Link href="/" className="btn btn-primary py-md-3 px-md-5 me-3">Home</Link>
            <Link href="/about" className="btn btn-light py-md-3 px-md-5">About</Link>
          </div>
        </div>
      </div>

      <div className="container-fluid p-5">
        {/* Introduction */}
        <div className="mb-5 text-center">
          <h5 className="text-primary text-uppercase">Our Story</h5>
          <h1 className="display-3 text-uppercase mb-0">Welcome to BookMyBus</h1>
        </div>

        <p className="introduction">
          Welcome to <strong>BookMyBus</strong> — your trusted partner in comfortable and affordable bus travel.
          Since {adminInfo?.since || "2018"}, we have been connecting people across {adminInfo?.destinations_covered || "150"}+ destinations.
        </p>

        {/* Stats Section */}
        <div className="stats-container">
          <div className="d-flex flex-column align-items-center bg-dark rounded text-center py-5 px-3">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
              <i className="fa fa-users fs-4 text-white" />
            </div>
            <motion.h2
              className="stat-item"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {travelers}+
            </motion.h2>
            <p className="stat-description">Happy Travelers</p>
          </div>
          <div className="d-flex flex-column align-items-center bg-dark rounded text-center py-5 px-3">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
              <i className="fa fa-map-marker-alt fs-4 text-white" />
            </div>
            <motion.h2
              className="stat-item"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {destinations}+
            </motion.h2>
            <p className="stat-description">Destinations Covered</p>
          </div>
          <div className="d-flex flex-column align-items-center bg-dark rounded text-center py-5 px-3">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
              <i className="fa fa-handshake fs-4 text-white" />
            </div>
            <motion.h2
              className="stat-item"
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              {partners}+
            </motion.h2>
            <p className="stat-description">Travel Partners</p>
          </div>
        </div>

        {/* Mission Section */}
        <div className="mission-section">
          <h2 className="mission-title">Our Mission</h2>
          <p className="mission-description">
            At BookMyBus, our mission is to make bus travel easy, affordable, and comfortable for everyone.
            We are dedicated to connecting travelers with safe, reliable, and punctual bus services across India.
          </p>
        </div>

        {/* Why Choose Us */}
        <div className="why-choose-us">
          <h2 className="why-choose-us-title">Why Choose BookMyBus?</h2>
          <ul className="why-choose-us-list">
            <li>Fast and easy booking process</li>
            <li>Affordable prices with no hidden charges</li>
            <li>Verified and comfortable buses</li>
            <li>24/7 dedicated customer support</li>
            <li>Safe and secure online payments</li>
            <li>Real-time bus tracking</li>
          </ul>
        </div>

        {/* Team Carousel */}
        <div className="team-section">
          <h2 className="team-title">Meet Our Team</h2>
          <div className="flex justify-center items-center">
            <motion.div
              key={team[currentSlide].name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="team-member-card"
            >
              <div className="team-member-image">
                <img
                  src={team[currentSlide].image}
                  alt={team[currentSlide].name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="team-member-name">{team[currentSlide].name}</h3>
              <p className="team-member-role">{team[currentSlide].role}</p>
            </motion.div>
          </div>
        </div>

        {/* Thank You Message */}
        <div className="thank-you-section text-center">
          <h2 className="thank-you-title">Thank You for Choosing BookMyBus!</h2>
          <p className="thank-you-description">
            We are honored to be your travel partner. Let s journey together across India! 🚌✨
          </p>
          <p className="mt-3">
            <strong>Headquarters:</strong> {adminInfo?.address || "123 Jaipur, India"}
          </p>
        </div>
      </div>
    </div>
  );
}