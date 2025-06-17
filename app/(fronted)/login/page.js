


'use client';

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useUser } from '@/context/UserContext';
import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { FaBus, FaRoute, FaTicketAlt, FaClock, FaUsers, FaToggleOn, FaToggleOff, FaSpinner } from "react-icons/fa";

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

const travelQuotes = [
  { quote: "The journey of a thousand miles begins with a single step.", author: "Lao Tzu" },
  { quote: "Travel makes one modest. You see what a tiny place you occupy in the world.", author: "Gustave Flaubert" },
  { quote: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { quote: "The world is a book, and those who do not travel read only one page.", author: "Saint Augustine" },
  { quote: "Traveling - it leaves you speechless, then turns you into a storyteller.", author: "Ibn Battuta" },
  { quote: "Adventure is worthwhile in itself.", author: "Amelia Earhart" },
  { quote: "To travel is to live.", author: "Hans Christian Andersen" },
  { quote: "Travel far enough, you meet yourself.", author: "David Mitchell" },
];

const travelTips = [
  "Book your tickets at least 2 weeks in advance for the best prices.",
  "Check-in online to save time at the boarding point.",
  "Always carry a water bottle and some snacks for long journeys.",
  "Pack light - you'll thank yourself later!",
  "Arrive at least 30 minutes before departure time.",
  "Download offline maps of your destination.",
  "Keep your valuables in your carry-on bag.",
  "Check the weather forecast before packing.",
];

const successStories = [
  {
    name: "Rahul S.",
    achievement: "50+ trips booked with us",
    quote: "SwiftJourney made my business travels hassle-free with their reliable service."
  },
  {
    name: "Priya M.",
    achievement: "Saved ₹15,000 with monthly passes",
    quote: "Their loyalty program helps me save on my regular commute to college."
  },
  {
    name: "Amit K.",
    achievement: "Perfect on-time record",
    quote: "I've never missed a connection thanks to their punctual service."
  }
];

export default function LoginPage() {
  const router = useRouter();
  const { userInfo, login, loading: contextLoading, loginLoading } = useUser();

  const [currentContent, setCurrentContent] = useState({});
  const [showQuotes, setShowQuotes] = useState(true);
  const [showSuccessStory, setShowSuccessStory] = useState(false);
  const [travelStats, setTravelStats] = useState({ travelers: 0, trips: 0 });

  const updateContent = useCallback(() => {
    if (showQuotes) {
      const randomQuote = travelQuotes[Math.floor(Math.random() * travelQuotes.length)];
      setCurrentContent({ type: 'quote', data: randomQuote });
    } else {
      const randomTip = travelTips[Math.floor(Math.random() * travelTips.length)];
      setCurrentContent({ type: 'tip', data: randomTip });
    }

    if (Math.random() > 0.7) {
      setShowSuccessStory(true);
      setTimeout(() => setShowSuccessStory(false), 8000);
    }
  }, [showQuotes]);

  useEffect(() => {
    if (userInfo && !contextLoading) {
      router.push('/');
      return;
    }

    setTravelStats({
      travelers: Math.floor(Math.random() * 50000) + 10000,
      trips: Math.floor(Math.random() * 20000) + 5000,
    });

    updateContent();

    const interval = setInterval(updateContent, 8000);
    return () => clearInterval(interval);
  }, [userInfo, contextLoading, router, updateContent]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data) => {
    try {
      const result = await login(data.email, data.password);
      if (!result.success) {
        setError("root", {
          type: "manual",
          message: result.message || "Login failed",
        });
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "An unexpected error occurred. Please try again.",
      });
    }
  };

  if (contextLoading) {
    return (
      <div className="bus-auth-container">
        <div className="text-center">
          <div className="spinner">
            <FaSpinner className="animate-spin" size={24} />
          </div>
          <p>Checking authentication status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bus-auth-layout">
      <div className="bus-sidebar">
        <div className="bus-brand-header">
          <FaBus className="brand-icon" size={32} />
          <h2>SwiftJourney</h2>
          <p>Travel with Comfort</p>
        </div>

        <div className="content-toggle-container">
          <button
            onClick={() => setShowQuotes(!showQuotes)}
            className="content-toggle-btn"
            disabled={loginLoading}
          >
            {showQuotes ? (
              <><FaToggleOn /> Show Travel Tips</>
            ) : (
              <><FaToggleOff /> Show Quotes</>
            )}
          </button>
        </div>

        <div className="dynamic-content-container">
          {showSuccessStory ? (
            <div className="success-story-card">
              <h3><FaUsers /> Happy Traveler</h3>
              <div className="success-story-content">
                <p className="story-quote">&quot;{successStories[0].quote}&quot;</p>
                <div className="story-author">
                  <span className="story-name">{successStories[0].name}</span>
                  <span className="story-achievement">{successStories[0].achievement}</span>
                </div>
              </div>
            </div>
          ) : currentContent.type === 'quote' ? (
            <div className="travel-quote-card">
              <h3><FaRoute /> Travel Inspiration</h3>
              <p className="travel-quote">{currentContent.data.quote}</p>
              <p className="quote-author">— {currentContent.data.author}</p>
            </div>
          ) : (
            <div className="travel-tip-card">
              <h3><FaTicketAlt /> Travel Tip</h3>
              <p className="travel-tip">{currentContent.data}</p>
            </div>
          )}
        </div>

        <div className="bus-stats-container">
          <div className="stat-card">
            <div className="stat-icon"><FaUsers /></div>
            <div className="stat-content">
              <h4>Happy Travelers</h4>
              <p>{travelStats.travelers.toLocaleString()}+</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon"><FaBus /></div>
            <div className="stat-content">
              <h4>Trips Daily</h4>
              <p>{travelStats.trips.toLocaleString()}+</p>
            </div>
          </div>
        </div>

        <div className="upcoming-trips-card">
          <h3><FaClock /> Popular Routes</h3>
          <ul>
            <li><span className="trip-day">Delhi</span><span className="trip-details">to Jaipur (5hrs, ₹499)</span></li>
            <li><span className="trip-day">Mumbai</span><span className="trip-details">to Pune (3hrs, ₹399)</span></li>
            <li><span className="trip-day">Bangalore</span><span className="trip-details">to Chennai (6hrs, ₹599)</span></li>
          </ul>
        </div>
      </div>

      <div className="bus-auth-container">
        <div className="bus-auth-header">
          <h1>Welcome Back!</h1>
          <p>Sign in to manage your bookings</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bus-auth-form">
          <div className="bus-form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={errors.email ? 'bus-input-error' : 'bus-input'}
              disabled={loginLoading}
            />
            {errors.email && <span className="bus-error-message">{errors.email.message}</span>}
          </div>

          <div className="bus-form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
              className={errors.password ? 'bus-input-error' : 'bus-input'}
              disabled={loginLoading}
            />
            {errors.password && <span className="bus-error-message">{errors.password.message}</span>}
          </div>

          <div className="form-options">
            <Link href="/forgot-password" className="bus-auth-link">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="bus-auth-button"
            disabled={loginLoading}
          >
            {loginLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                Authenticating...
              </>
            ) : (
              'Sign in to Your Account'
            )}
          </button>

          {errors.root && (
            <p className="bus-root-error">
              {errors.root.message}
            </p>
          )}

          <div className="bus-auth-footer">
            <p>New to SwiftJourney? <Link href="/signup" className="bus-auth-link">Create an account</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
}





 
