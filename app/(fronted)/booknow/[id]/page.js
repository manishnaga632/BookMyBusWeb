// // "use client";

// // import { useEffect, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import { toast } from "react-hot-toast";
// // import { useUser } from "@/context/UserContext";
// // import getStripe from "@/lib/getStripe";
// // import Link from "next/link";

// // const BusBookingPage = () => {
// //     const { id } = useParams();
// //     const router = useRouter();
// //     const { userInfo, loading: userLoading } = useUser();
// //     const [bus, setBus] = useState(null);
// //     const [seats, setSeats] = useState(1);
// //     const [totalPrice, setTotalPrice] = useState(0);
// //     const [loading, setLoading] = useState(false);
// //     const [token, setToken] = useState(null);

// //     useEffect(() => {
// //         if (!userLoading && !userInfo) {
// //             router.push("/login");
// //         }

// //         if (typeof window !== 'undefined') {
// //             const storedToken = localStorage.getItem('token');
// //             if (storedToken) {
// //                 setToken(storedToken);
// //             }
// //         }
// //     }, [userInfo, userLoading, router]);

// //     useEffect(() => {
// //         const fetchBusDetails = async () => {
// //             try {
// //                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travels/${id}`);
// //                 if (!res.ok) throw new Error("Failed to fetch bus details");
// //                 const data = await res.json();
// //                 setBus(data);
// //                 setTotalPrice(data.price_per_seat);

// //                 if (data.available_seats === 0) {
// //                     toast.error("No seats available for this bus!");
// //                 }
// //             } catch (error) {
// //                 console.error(error);
// //                 toast.error("Failed to load bus details.");
// //             }
// //         };

// //         if (id) {
// //             fetchBusDetails();
// //         }
// //     }, [id]);

// //     const handleSeatsChange = (e) => {
// //         const seatCount = parseInt(e.target.value);
// //         setSeats(seatCount);
// //         setTotalPrice(seatCount * bus.price_per_seat);
// //     };

// //     const handleConfirmBooking = async () => {
// //         if (!userInfo) {
// //             toast.error("Please login to complete booking");
// //             return router.push("/login");
// //         }

// //         if (!bus || bus.available_seats < seats || seats < 1) {
// //             toast.error("Invalid seat selection");
// //             return;
// //         }

// //         setLoading(true);
// //         const toastId = toast.loading("Processing your payment...");

// //         try {
// //             const bookingData = {
// //                 price: totalPrice,
// //                 user_id: userInfo.id,
// //                 travel_id: bus.id,
// //                 seats: seats,
// //                 from_location: bus.from_location,
// //                 to_location: bus.to_location
// //             };

// //             const response = await fetch("/api/stripe", {
// //                 method: "POST",
// //                 headers: {
// //                     "Content-Type": "application/json",
// //                     ...(token && { "Authorization": `Bearer ${token}` })
// //                 },
// //                 body: JSON.stringify(bookingData)
// //             });

// //             const responseData = await response.json();

// //             if (!response.ok) {
// //                 const errorMsg = responseData?.error ||
// //                     responseData?.message ||
// //                     `Payment failed (Status: ${response.status})`;
// //                 throw new Error(errorMsg);
// //             }

// //             // Validate the Stripe URL
// //             if (!responseData.url) {
// //                 throw new Error("No payment URL received from server");
// //             }

// //             // Ensure URL has proper protocol
// //             let paymentUrl = responseData.url;
// //             if (!paymentUrl.startsWith('http')) {
// //                 paymentUrl = `https://${paymentUrl}`;
// //             }

// //             // Final URL validation
// //             try {
// //                 new URL(paymentUrl);
// //             } catch (e) {
// //                 throw new Error("Invalid payment URL format");
// //             }

// //             toast.dismiss(toastId);
// //             window.location.href = paymentUrl;

// //         } catch (error) {
// //             console.error("Booking Error:", error);
// //             toast.dismiss(toastId);
// //             toast.error(error.message || "Payment processing failed");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     if (!bus) {
// //         return <p className="text-center mt-10">Loading bus details...</p>;
// //     }
// //     return (
// //         <div className="booking-page">
// //             <h1 className="booking-title">Confirm Your Booking</h1>
// //             <div className="booking-card">
// //                 <img src={bus.bus_image} alt="Bus Image" className="bus-image" />
// //                 <h2>{bus.from_location} ➔ {bus.to_location}</h2>
// //                 <p>Departure Time: {bus.time}</p>
// //                 <p>Available Seats: {bus.available_seats}</p>
// //                 <p className="price-label">Price per seat: ₹ {bus.price_per_seat}</p>

// //                 <div className="input-wrapper">
// //                     <label className="input-label">Select Seats:</label>
// //                     <input
// //                         type="number"
// //                         value={seats}
// //                         min="1"
// //                         max={bus.available_seats}
// //                         onChange={handleSeatsChange}
// //                         className="input-field"
// //                         disabled={bus.available_seats === 0}
// //                     />
// //                 </div>

// //                 <div className="total-price">Total Price: ₹ {totalPrice}</div>

// //                 <button
// //                     onClick={handleConfirmBooking}
// //                     disabled={loading || bus.available_seats === 0}
// //                     className="confirm-button"
// //                 >
// //                     {loading ? "Processing..." :
// //                         bus.available_seats === 0 ? "No Seats Available" : "Confirm Booking"}
// //                 </button>

// //                 <Link href="/booknow" className="back-link">
// //                     ← Back to All Buses
// //                 </Link>
// //             </div>
// //         </div>
// //     );
// // };

// // export default BusBookingPage;


// "use client";
// import { useEffect, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useUser } from "@/context/UserContext";
// import Link from "next/link";

// const BusBookingPage = () => {
//     const { id } = useParams();
//     const router = useRouter();
//     const { userInfo } = useUser();
//     const [bus, setBus] = useState(null);
//     const [seats, setSeats] = useState(1);
//     const [totalPrice, setTotalPrice] = useState(0);
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (!userInfo) router.push("/login");

//         const fetchBus = async () => {
//             try {
//                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travels/${id}`);
//                 const data = await res.json();
//                 setBus(data);
//                 setTotalPrice(data.price_per_seat); // Initialize total price
//             } catch (error) {
//                 toast.error("Failed to load bus details");
//             }
//         };
//         fetchBus();
//     }, [id, userInfo, router]);

//     const handleSeatsChange = (e) => {
//         const seatCount = parseInt(e.target.value) || 1;
//         setSeats(seatCount);
//         setTotalPrice(seatCount * (bus?.price_per_seat || 0));
//     };

//     const handleConfirmBooking = async () => {
//         if (!bus || !userInfo) return;
//         if (bus.available_seats < seats || seats < 1) {
//             return toast.error("Invalid seat selection");
//         }

//         setLoading(true);
//         try {
//             const response = await fetch("/api/stripe", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${localStorage.getItem('token')}`
//                 },
//                 body: JSON.stringify({
//                     price: totalPrice,
//                     user_id: userInfo.id,
//                     travel_id: id,
//                     seats: seats,
//                     from_location: bus.from_location,
//                     to_location: bus.to_location
//                 })
//             });

//             const result = await response.json();
//             if (!response.ok) throw new Error(result.error || "Payment failed");
//             if (!result.url) throw new Error("Payment URL missing");

//             window.location.href = result.url.includes('://')
//                 ? result.url
//                 : `https://${result.url}`;

//         } catch (error) {
//             toast.error(error.message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (!bus) return <div className="loading">Loading bus details...</div>;

//     return (
//         <div className="booking-page">
//             <h1 className="booking-title">Confirm Your Booking</h1>
//             <div className="booking-card">
//                 <img src={bus.bus_image} alt="Bus Image" className="bus-image" />
//                 <h2>{bus.from_location} ➔ {bus.to_location}</h2>
//                 <p>Departure Time: {bus.time}</p>
//                 <p>Available Seats: {bus.available_seats}</p>
//                 <p className="price-label">Price per seat: ₹ {bus.price_per_seat}</p>

//                 <div className="input-wrapper">
//                     <label className="input-label">Select Seats:</label>
//                     <input
//                         type="number"
//                         value={seats}
//                         min="1"
//                         max={bus.available_seats}
//                         onChange={handleSeatsChange}
//                         className="input-field"
//                         disabled={bus.available_seats === 0}
//                     />
//                 </div>

//                 <div className="total-price">Total Price: ₹ {totalPrice}</div>

//                 <button
//                     onClick={handleConfirmBooking}
//                     disabled={loading || bus.available_seats === 0}
//                     className="confirm-button"
//                 >
//                     {loading ? "Processing..." :
//                         bus.available_seats === 0 ? "No Seats Available" : "Confirm Booking"}
//                 </button>

//                 <Link href="/booknow" className="back-link">
//                     ← Back to All Buses
//                 </Link>
//             </div>
//         </div>
//     );
// };

// export default BusBookingPage;




"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUser } from "@/context/UserContext";
import Link from "next/link";

const BusBookingPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { userInfo } = useUser();
    const [bus, setBus] = useState(null);
    const [seats, setSeats] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userInfo) {
            toast.error("Please login to book");
            router.push("/login");
            return;
        }

        const fetchBus = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/travels/${id}`);
                if (!res.ok) throw new Error("Failed to fetch bus");
                const data = await res.json();
                setBus(data);
                setTotalPrice(data.price_per_seat);
            } catch (error) {
                toast.error(error.message);
            }
        };
        fetchBus();
    }, [id, userInfo, router]);

    const handleSeatsChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        const maxSeats = bus?.available_seats || 1;
        const seatCount = Math.max(1, Math.min(value, maxSeats));
        setSeats(seatCount);
        setTotalPrice(seatCount * (bus?.price_per_seat || 0));
    };

    const handleConfirmBooking = async () => {
        if (!bus || !userInfo) return;
        if (seats > bus.available_seats) {
            return toast.error(`Only ${bus.available_seats} seats available`);
        }

        setLoading(true);
        const toastId = toast.loading("Redirecting to payment...");

        try {
            const response = await fetch("/api/stripe", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    price: totalPrice,
                    user_id: userInfo.id,
                    travel_id: id,
                    seats: seats,
                    from_location: bus.from_location,
                    to_location: bus.to_location
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Payment initiation failed");
            }

            if (!data.url) {
                throw new Error("Payment URL not received");
            }

            // Redirect to Stripe
            window.location.href = data.url;

        } catch (error) {
            toast.error(error.message);
            console.error("Payment error:", error);
        } finally {
            toast.dismiss(toastId);
            setLoading(false);
        }
    };

    if (!bus) return <div className="loading">Loading bus details...</div>;

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