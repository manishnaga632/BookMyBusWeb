"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import getStripe from "@/lib/getStripe";
import Link from "next/link";

const BusBookingPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { userInfo, loading: userLoading } = useUser();
    const [bus, setBus] = useState(null);
    const [seats, setSeats] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState(null);

    useEffect(() => {
        if (!userLoading && !userInfo) {
            router.push("/login");
        }
        
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        }
    }, [userInfo, userLoading, router]);

    useEffect(() => {
        const fetchBusDetails = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travels/${id}`);
                if (!res.ok) throw new Error("Failed to fetch bus details");
                const data = await res.json();
                setBus(data);
                setTotalPrice(data.price_per_seat);
                
                // Show alert if no seats available
                if (data.available_seats === 0) {
                    toast.error("No seats available for this bus!");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load bus details.");
            }
        };

        if (id) {
            fetchBusDetails();
        }
    }, [id]);

    const handleSeatsChange = (e) => {
        const seatCount = parseInt(e.target.value);
        setSeats(seatCount);
        setTotalPrice(seatCount * bus.price_per_seat);
    };

    const handleConfirmBooking = async () => {
        if (!userInfo) {
            toast.error("Please login to complete booking");
            return router.push("/login");
        }

        if (!bus || bus.available_seats < seats || seats < 1) {
            toast.error("Invalid seat selection");
            return;
        }

        setLoading(true);
        const toastId = toast.loading("Processing your payment...");

        try {
            const bookingData = {
                price: totalPrice,
                user_id: userInfo.id,
                travel_id: bus.id,
                seats: seats,
                from_location: bus.from_location,
                to_location: bus.to_location
            };

            const response = await fetch("/api/stripe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(token && { "Authorization": `Bearer ${token}` })
                },
                body: JSON.stringify(bookingData)
            });

            if (response.status === 204) {
                throw new Error("Server returned empty response");
            }

            const responseText = await response.text();
            let responseData;

            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                console.error("Failed to parse response:", responseText);
                throw new Error(`Server response: ${responseText.slice(0, 200)}`);
            }

            if (!response.ok) {
                const errorMsg = responseData?.error ||
                    responseData?.message ||
                    `Payment failed (Status: ${response.status})`;
                throw new Error(errorMsg);
            }

            if (!responseData.url) {
                throw new Error("No payment URL received from server");
            }

            try {
                new URL(responseData.url);
                toast.dismiss(toastId);
                window.location.href = responseData.url;
            } catch (urlError) {
                throw new Error("Invalid payment gateway URL");
            }

        } catch (error) {
            console.error("Booking Error:", error);
            toast.dismiss(toastId);
            toast.error(error.message || "Payment processing failed");
        } finally {
            setLoading(false);
        }
    };

    if (!bus) {
        return <p className="text-center mt-10">Loading bus details...</p>;
    }

    return (
        <div className="booking-page">
            <h1 className="booking-title">Confirm Your Booking</h1>
            <div className="booking-card">
                <img src={bus.bus_image} alt="Bus Image" className="bus-image" />
                <h2>{bus.from_location} ➔ {bus.to_location}</h2>
                <p>Departure Time: {bus.time}</p>
                <p>Available Seats: {bus.available_seats}</p>
                <p className="price-label">Price per seat: ₹ {bus.price_per_seat}</p>

                <div className="input-wrapper">
                    <label className="input-label">Select Seats:</label>
                    <input
                        type="number"
                        value={seats}
                        min="1"
                        max={bus.available_seats}
                        onChange={handleSeatsChange}
                        className="input-field"
                        disabled={bus.available_seats === 0}
                    />
                </div>

                <div className="total-price">Total Price: ₹ {totalPrice}</div>

                <button
                    onClick={handleConfirmBooking}
                    disabled={loading || bus.available_seats === 0}
                    className="confirm-button"
                >
                    {loading ? "Processing..." : 
                     bus.available_seats === 0 ? "No Seats Available" : "Confirm Booking"}
                </button>

                <Link href="/booknow" className="back-link">
                    ← Back to All Buses
                </Link>
            </div>
        </div>
    );
};

export default BusBookingPage;
