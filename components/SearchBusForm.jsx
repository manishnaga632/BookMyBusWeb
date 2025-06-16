'use client';
import React, { useState } from "react";
import { useStateContext } from "@/context/StateContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, CalendarDays, ArrowRight, RefreshCw } from "lucide-react";

const cityOptions = [
  "Jaipur", "Jobner", "Jodhpur", "Udaipur",
  "Kota", "Ajmer", "Delhi", "Mumbai", "Bikaner"
];

const SearchBusForm = () => {
  const {
    source,
    setSource,
    destination,
    setDestination,
    journeyDate,
    setJourneyDate,
    setSelectedBus
  } = useStateContext();

  const router = useRouter();
  const [buses, setBuses] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [returnDate, setReturnDate] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    if (!source || !destination) {
      alert("Please select both source and destination.");
      setIsSearching(false);
      return;
    }

    if (source === destination) {
      alert("Source and destination cannot be the same.");
      setIsSearching(false);
      return;
    }

    try {
      // Step 1: Search for buses
      const searchUrl = new URL(`${process.env.NEXT_PUBLIC_API_URL}/travels/search`);
      searchUrl.searchParams.append('from_location', source.toLowerCase());
      searchUrl.searchParams.append('to_location', destination.toLowerCase());
      searchUrl.searchParams.append('skip', '0');
      searchUrl.searchParams.append('limit', '10');

      const searchRes = await fetch(searchUrl);
      
      if (!searchRes.ok) {
        throw new Error(`Search failed with status: ${searchRes.status}`);
      }
      
      const searchData = await searchRes.json();

      if (searchData.length === 0) {
        setBuses([]);
        alert("No buses found for this route.");
        return;
      }

      // Step 2: Fetch complete details for each bus
      const busesWithDetails = await Promise.all(
        searchData.map(async (bus) => {
          try {
            const detailsUrl = `${process.env.NEXT_PUBLIC_API_URL}/travels/${bus.id}`;
            const detailsRes = await fetch(detailsUrl);
            
            if (!detailsRes.ok) {
              console.error(`Failed to fetch details for bus ${bus.id}`);
              return bus; // Return the original bus data if details fetch fails
            }
            
            return await detailsRes.json();
          } catch (error) {
            console.error(`Error fetching details for bus ${bus.id}:`, error);
            return bus;
          }
        })
      );

      setBuses(busesWithDetails);
      
    } catch (error) {
      console.error("Search Error:", error);
      alert("Failed to search buses. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleBusClick = (bus) => {
    setSelectedBus(bus);
    router.push(`/booknow/${bus.id}`);
  };

  const swapLocations = () => {
    const temp = source;
    setSource(destination);
    setDestination(temp);
  };

  const clearForm = () => {
    setSource("");
    setDestination("");
    setJourneyDate("");
    setReturnDate("");
    setBuses([]);
  };

  // Calculate arrival time based on departure time
  const calculateArrivalTime = (departureTime) => {
    if (!departureTime) return "N/A";
    
    const [hours, minutes] = departureTime.split(':').map(Number);
    const durationHours = 6; // Assuming 6 hours journey by default
    const arrivalHours = (hours + durationHours) % 24;
    
    return `${arrivalHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="search-container">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="search-card"
      >
        <div className="search-header">
          <h2 className="search-title">
            <Search className="title-icon" size={24} />
            Find Your Perfect Bus Journey
          </h2>
          <div className="trip-toggle">
            <button
              type="button"
              className={`trip-option ${!isRoundTrip ? 'active' : ''}`}
              onClick={() => setIsRoundTrip(false)}
            >
              One Way
            </button>
            <button
              type="button"
              className={`trip-option ${isRoundTrip ? 'active' : ''}`}
              onClick={() => setIsRoundTrip(true)}
            >
              Round Trip
            </button>
          </div>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <div className="input-group">
            <div className="input-field">
              <label htmlFor="source" className="input-label">
                <MapPin className="input-icon" size={18} />
                From
              </label>
              <select
                id="source"
                value={source}
                onChange={(e) => setSource(e.target.value.toLowerCase())}
                className="search-input"
                required
              >
                <option value="">Select Source City</option>
                {cityOptions.map((city) => (
                  <option key={`src-${city}`} value={city.toLowerCase()}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              className="swap-btn"
              onClick={swapLocations}
              aria-label="Swap locations"
            >
              <RefreshCw size={20} />
            </button>

            <div className="input-field">
              <label htmlFor="destination" className="input-label">
                <MapPin className="input-icon" size={18} />
                To
              </label>
              <select
                id="destination"
                value={destination}
                onChange={(e) => setDestination(e.target.value.toLowerCase())}
                className="search-input"
                required
              >
                <option value="">Select Destination City</option>
                {cityOptions.map((city) => (
                  <option key={`dest-${city}`} value={city.toLowerCase()}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="date-group">
            <div className="input-field">
              <label htmlFor="departure" className="input-label">
                <CalendarDays className="input-icon" size={18} />
                Departure
              </label>
              <input
                id="departure"
                type="date"
                value={journeyDate}
                onChange={(e) => setJourneyDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="search-input"
                required
              />
            </div>

            {isRoundTrip && (
              <div className="input-field">
                <label htmlFor="return" className="input-label">
                  <CalendarDays className="input-icon" size={18} />
                  Return
                </label>
                <input
                  id="return"
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  min={journeyDate || new Date().toISOString().split('T')[0]}
                  className="search-input"
                />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="clear-btn"
              onClick={clearForm}
            >
              Clear All
            </button>
            <motion.button
              type="submit"
              className="search-btn"
              disabled={isSearching}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {isSearching ? (
                <span className="loading">
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                  <span className="loading-dot"></span>
                </span>
              ) : (
                <>
                  Search Buses <ArrowRight className="btn-icon" size={18} />
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>

      {buses.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="results-container"
        >
          <div className="results-header">
            <h3 className="results-title">
              {buses.length} Buses Found from {source.charAt(0).toUpperCase() + source.slice(1)} to {destination.charAt(0).toUpperCase() + destination.slice(1)}
            </h3>
            <div className="results-filter">
              <span>Sort by:</span>
              <select className="filter-select">
                <option>Departure Time</option>
                <option>Price (Low to High)</option>
                <option>Price (High to Low)</option>
                <option>Ratings</option>
              </select>
            </div>
          </div>

          <div className="bus-grid">
            {buses.map((bus) => (
              <motion.div
                key={bus.id}
                className="bus-card"
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleBusClick(bus)}
              >
                <div className="bus-header">
                  <img 
                    src={bus.bus_image} 
                    alt="Bus" 
                    className="bus-image"
                    onError={(e) => {
                      e.target.src = '/default-bus.jpg';
                      e.target.onerror = null;
                    }}
                  />
                  <div className="bus-rating">4.5 ★</div>
                </div>

                <div className="bus-body">
                  <div className="bus-timing">
                    <div className="departure">
                      <div className="time">{bus.time || '08:00'}</div>
                      <div className="location">
                        {bus.from_location?.charAt(0).toUpperCase() + bus.from_location?.slice(1) || 
                         source.charAt(0).toUpperCase() + source.slice(1)}
                      </div>
                    </div>

                    <div className="duration">
                      <div className="duration-line"></div>
                      <div className="duration-text">6h 30m</div>
                    </div>

                    <div className="arrival">
                      <div className="time">{calculateArrivalTime(bus.time)}</div>
                      <div className="location">
                        {bus.to_location?.charAt(0).toUpperCase() + bus.to_location?.slice(1) || 
                         destination.charAt(0).toUpperCase() + destination.slice(1)}
                      </div>
                    </div>
                  </div>

                  <div className="bus-details">
                    <div className="bus-name">{bus.name || 'Deluxe Travels'}</div>
                    <div className="bus-amenities">
                      <span className="amenity">AC</span>
                      <span className="amenity">Charging</span>
                      <span className="amenity">Water</span>
                      <span className="amenity">WiFi</span>
                    </div>
                  </div>
                </div>

                <div className="bus-footer">
                  <div className="bus-price">₹{bus.price_per_seat || '270'}</div>
                  <div className="seats-available">{bus.available_seats || 50} seats left</div>
                  <button className="book-btn">
                    Select Seats <ArrowRight size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default SearchBusForm;