'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const HomeAbout = () => {
  const [travelers, setTravelers] = useState(0);
  const [destinations, setDestinations] = useState(0);
  const [partners, setPartners] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [adminInfo, setAdminInfo] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  // Updated team data with better quality image URLs
  const team = [
    {
      name: 'Mr Manu',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Mr Hemaraj',
      role: 'Head of Operations',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    },
    {
      name: 'Mr Rahul',
      role: 'Customer Success Manager',
      image: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'
    }
  ];

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/admin_profile/all`);
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setAdminInfo(data[0]);
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

  useEffect(() => {
    if (!adminInfo) return;
    const interval = setInterval(() => {
      setTravelers(prev => (prev < adminInfo.happy_travelers ? prev + Math.ceil(adminInfo.happy_travelers/100) : adminInfo.happy_travelers));
      setDestinations(prev => (prev < adminInfo.destinations_covered ? prev + 1 : adminInfo.destinations_covered));
      setPartners(prev => (prev < adminInfo.travel_partners ? prev + 1 : adminInfo.travel_partners));
    }, 30);
    return () => clearInterval(interval);
  }, [adminInfo]);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % team.length);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, [team.length]);

  return (
    <section className="home-about">
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="section-header"
        >
          <h5 className="section-subtitle">Why Choose Us</h5>
          <h2 className="section-title">Trusted By Thousands</h2>
          <p className="section-description">
            Since {adminInfo?.since || "2018"}, we've served {adminInfo?.happy_travelers || "5000"}+ happy travelers across {adminInfo?.destinations_covered || "150"}+ destinations
          </p>
        </motion.div>

        <div className="stats-grid">
          {[
            { icon: 'users', value: travelers, label: 'Happy Travelers' },
            { icon: 'map-marker-alt', value: destinations, label: 'Destinations' },
            { icon: 'bus', value: 250, label: 'Buses' },
            { icon: 'handshake', value: partners, label: 'Partners' }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="stat-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="stat-icon">
                <i className={`fa fa-${stat.icon}`} />
              </div>
              <h3 className="stat-value">{stat.value}+</h3>
              <p className="stat-label">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="about-content">
          <div className="about-text">
            <motion.h3 
              className="about-title"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              Our Mission
            </motion.h3>
            <motion.p
              className="about-description"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              To make bus travel comfortable, affordable and accessible to everyone across India with 
              the highest standards of safety and service.
            </motion.p>
            
            <motion.div
              className="features-list"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {[
                '24/7 Customer Support',
                'Best Price Guarantee',
                'Easy Cancellation',
                'Real-time Tracking',
                'Verified Operators',
                'Secure Payments'
              ].map((feature, index) => (
                <div key={index} className="feature-item">
                  <i className="fa fa-check-circle" />
                  <span>{feature}</span>
                </div>
              ))}
            </motion.div>
          </div>

          <motion.div 
            className="team-card"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="team-member">
              <div className="member-image-container">
                <img 
                  src={team[currentSlide].image} 
                  alt={team[currentSlide].name}
                  className="member-image"
                  onError={(e) => {
                    e.target.src = '/default-profile.jpg';
                    e.target.className = 'member-image default-profile';
                  }}
                />
              </div>
              <div className="member-info">
                <h4 className="member-name">{team[currentSlide].name}</h4>
                <p className="member-role">{team[currentSlide].role}</p>
                <p className="member-quote">"We're committed to your journey"</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;