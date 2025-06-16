
"use client";

import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useUserContext } from "@/context/UserContext";  // ✅ Context import karo

const AllBuses = ({ bus }) => {
    const router = useRouter();
    const { userInfo } = useUserContext(); // ✅ Context se user info lo

    const handleBookNow = () => {
        if (userInfo) {
            router.push(`/booknow/${bus.id}`);
        } else {
            toast.error("Please login first!");
            router.push("/login");
        }
    };

    return (
        <div className="bus-card">
            <img
                src={bus.bus_image}
                alt="Bus"
                className="bus-image"
            />
            <h2 className="bus-title">{bus.from_location} ➔ {bus.to_location}</h2>
            <p className="bus-time">Departure Time: {bus.time}</p>
            <p className="bus-price">Price per Seat: ₹{bus.price_per_seat}</p>
            <button
                onClick={handleBookNow}
                className="book-button"
            >
                Book Now
            </button>
        </div>
    );
};

export default AllBuses;
