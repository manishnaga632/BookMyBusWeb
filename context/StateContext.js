"use client";

import React, { createContext, useContext, useState } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
  // 🚌 Bus Search related States
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [journeyDate, setJourneyDate] = useState("");

  // 👤 Passenger Details
  const [passengers, setPassengers] = useState(1); // Default 1 passenger

  // 🚌 Selected Bus Details (after search)
  const [selectedBus, setSelectedBus] = useState(null);

  // 🧾 Booking Summary / Payment Details
  const [bookingInfo, setBookingInfo] = useState(null);

  return (
    <Context.Provider
      value={{
        source,
        setSource,
        destination,
        setDestination,
        journeyDate,
        setJourneyDate,
        passengers,
        setPassengers,
        selectedBus,
        setSelectedBus,
        bookingInfo,
        setBookingInfo,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
