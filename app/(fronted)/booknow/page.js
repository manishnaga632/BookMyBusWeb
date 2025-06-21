
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const BookNow = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travels/all`);
        if (!res.ok) throw new Error("Failed to fetch buses");
        const data = await res.json();
        setBuses(data);
      } catch (error) {
        console.error("Error fetching buses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  const handleBookNow = (busId) => {
    router.push(`/booknow/${busId}`);
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  if (loading) {
    return (
      <div className="book-now-container">
        <div className="text-center py-8">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading available buses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="book-now-container">
      <h1 className="heading">Available Buses</h1>

      {/* Carousel Slider */}
      <div className="mb-12">
        <Slider {...sliderSettings}>
          {buses.map((bus) => (
            <div key={bus.id} className="slider-item">
              <div className="bus-card">
                <img
                  src={bus.bus_image || "/default-bus.jpg"}
                  alt={bus.bus_name || "Bus"}
                  className="bus-image"
                  onError={(e) => {
                    e.target.src = "/default-bus.jpg";
                  }}
                />
                <div className="bus-details">
                  <h3>{bus.from_location} to {bus.to_location}</h3>
                  <p className="text-secondary">
                    <strong>Bus:</strong> {bus.bus_name || "Deluxe AC"}
                  </p>
                  <p>
                    <strong>Departure Time: </strong> {bus.time}
                  </p>
                  <p className="text-primary">
                    <strong>Price:</strong> ₹{bus.price_per_seat}
                  </p>
                  <button
                    onClick={() => handleBookNow(bus.id)}
                    className="book-button"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Bus Table */}
      <div className="bus-table-container">
        <h2 className="text-2xl font-bold mb-4 text-primary">All Available Buses</h2>
        <div className="table-wrapper">
          <table className="bus-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>From</th>
                <th>To</th>
                <th>Departure</th>
                <th>Seats</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((bus) => (
                <tr key={bus.id}>
                  <td data-label="Bus">
                    <img
                      src={bus.bus_image || "/default-bus.jpg"}
                      alt={bus.bus_name || "Bus"}
                      className="bus-table-image"
                      onError={(e) => {
                        e.target.src = "/default-bus.jpg";
                      }}
                    />
                    <span className="ml-2">{bus.bus_name || "Deluxe AC"}</span>
                  </td>
                  <td data-label="From">{bus.from_location}</td>
                  <td data-label="To">{bus.to_location}</td>
                  <td data-label="Departure">
                    {bus.time}
                  </td>
                  <td data-label="Seats">{bus.available_seats}</td>
                  <td data-label="Price">₹{bus.price_per_seat}</td>
                  <td data-label="Action">
                    <button
                      onClick={() => handleBookNow(bus.id)}
                      className="book-button"
                    >
                      Book Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BookNow;