"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from '@/context/UserContext';
import Link from "next/link";
import { FaBus, FaRoute, FaTicketAlt, FaMapMarkedAlt, FaUserFriends, FaClock } from "react-icons/fa";

// Bus booking related content
const travelBenefits = [
  "🚌 Comfortable AC coaches with ample legroom",
  "💰 Save up to 40% with early bird bookings",
  "📍 5000+ routes across India",
  "🔒 Secure online payment options",
  "📱 Real-time tracking of your bus",
  "🔄 Easy cancellation & rescheduling",
  "🛡️ Verified drivers and clean vehicles"
];

const travelerStories = [
  { name: "Rahul", achievement: "Traveled 10,000km with us last year" },
  { name: "Priya", achievement: "Saved ₹5000 with our monthly passes" },
  { name: "Amit", achievement: "Never missed a booking with our app" },
  { name: "Neha", achievement: "Completed 50+ safe journeys" }
];

const SignupForm = () => {
  const router = useRouter();
  const { userInfo, loading } = useUser();
  useEffect(() => {
    if (!loading && userInfo) {
      router.push(userInfo.role === "admin" ? "/admin/profile" : "/profile");
    }

    // Rotate benefits every 5 seconds
    const benefitInterval = setInterval(() => {
      setCurrentBenefitIndex((prev) => (prev + 1) % travelBenefits.length);
    }, 5000);

    // Rotate traveler stories every 7 seconds
    const storyInterval = setInterval(() => {
      setCurrentStoryIndex((prev) => (prev + 1) % travelerStories.length);
    }, 7000);

    return () => {
      clearInterval(benefitInterval);
      clearInterval(storyInterval);
    };
  }, [userInfo, loading, router]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    mobile: "",
    age: "",
    gender: "",
  });

  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [currentBenefitIndex, setCurrentBenefitIndex] = useState(0);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "user" }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Sign up failed");
      }

      setMessage("✅ Signup successful! Redirecting to login...");
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        mobile: "",
        age: "",
        gender: "",
      });

      setTimeout(() => router.push("/login"), 1500);
    } catch (error) {
      setMessage(`❌ ${error.message || "Signup failed"}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="auth-layout">
      <div className="travel-content-sidebar">
        <div className="loading-content">
          <h2>Welcome to SwiftJourney!</h2>
          <p>Your travel experience is about to begin...</p>
        </div>
      </div>
      <div className="auth-container">
        <div className="text-center">
          <p>Loading...</p>
        </div>
      </div>
    </div>
  );

  if (userInfo) return null;

  return (
    <div className="auth-layout">
      {/* Travel Content Sidebar */}
      <div className="travel-content-sidebar">
        <div className="travel-content-header">
          <h2>Start Your Journey With Us</h2>
          <p>Join our community of {Math.floor(Math.random() * 50000) + 10000} happy travelers</p>
        </div>

        <div className="travel-benefits">
          <h3><FaBus /> Travel Benefits</h3>
          <ul>
            {travelBenefits.map((benefit, index) => (
              <li key={index} className={index === currentBenefitIndex ? "active" : ""}>
                {benefit}
              </li>
            ))}
          </ul>
        </div>

        <div className="traveler-stories">
          <h3><FaUserFriends /> Traveler Stories</h3>
          <div className="story-card">
            <p className="story-text">
              &quot;{travelerStories[currentStoryIndex].name} {travelerStories[currentStoryIndex].achievement}&quot;
            </p>
          </div>
        </div>

        <div className="travel-features">
          <h3><FaRoute /> Why Choose Us</h3>
          <div className="features-grid">
            <div className="feature-item">
              <span><FaBus /></span>
              <p>Modern Fleet</p>
            </div>
            <div className="feature-item">
              <span><FaMapMarkedAlt /></span>
              <p>Wide Network</p>
            </div>
            <div className="feature-item">
              <span><FaClock /></span>
              <p>On-time Service</p>
            </div>
            <div className="feature-item">
              <span><FaTicketAlt /></span>
              <p>Easy Booking</p>
            </div>
          </div>
        </div>
      </div>

      {/* Signup Form */}
      <div className="auth-container">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Join our travel community today!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="Enter your first name"
              />
            </div>

            <div className="form-group">
              <label>Last Name</label>
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Enter your last name"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={6}
              placeholder="Create a password (min 6 characters)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mobile</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                pattern="[0-9]{10}"
                title="Enter 10 digit mobile number"
                placeholder="10 digit number"
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value.length <= 2) {
                    setFormData((prev) => ({ ...prev, age: value }));
                  }
                }}
                required
                min={1}
                max={99}
                inputMode="numeric"
                placeholder="Your age"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          <button type="submit" className="auth-button" disabled={submitting}>
            {submitting ? "Signing Up..." : "Start My Travel Journey"}
          </button>
        </form>

        {message && (
          <p className={`message ${message.includes("✅") ? "success" : "error"}`}>
            {message}
          </p>
        )}

        <div className="auth-footer">
          <p>Already have an account? <Link href="/login" className="auth-link">Login</Link></p>
          <p className="member-promise">As a member, you get access to exclusive deals and easier bookings!</p>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;