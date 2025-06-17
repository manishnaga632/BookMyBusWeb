

"use client";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SuccessPage() {
  const router = useRouter();
  const sessionId = useSearchParams().get("session_id");
  const [status, setStatus] = useState("loading");
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);

  useEffect(() => {
    const completeBooking = async () => {
      try {
        if (!sessionId) throw new Error("No session ID");

        const stripeRes = await fetch(`/api/stripe?session_id=${sessionId}`);
        if (!stripeRes.ok) throw new Error("Payment verification failed");
        const stripeData = await stripeRes.json();
        setPayment(stripeData);

        const bookingRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/create`,
          {
            user_id: stripeData.metadata.user_id,
            travel_id: stripeData.metadata.travel_id,
            book_seats: stripeData.metadata.seats,
            total_price: stripeData.metadata.price,
            payment_id: sessionId,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setBooking(bookingRes.data);
        setStatus("success");
      } catch (err) {
        console.error(err);
        setStatus("error");
        toast.error("Something went wrong");
        setTimeout(() => router.push("/booknow"), 3000);
      }
    };

    if (sessionId) completeBooking();
  }, [sessionId, router]);

  if (status === "loading")
    return (
      <div className="flex items-center justify-center h-screen bg-white text-gray-600">
        <div className="animate-spin h-10 w-10 border-4 border-green-500 border-t-transparent rounded-full mr-4" />
        Processing your booking...
      </div>
    );

  if (status === "error")
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-white text-center px-4">
        <h2 className="text-3xl text-red-600 font-bold mb-2">Payment Failed</h2>
        <p className="mb-6 text-gray-500">Redirecting to booking page...</p>
        <button
          onClick={() => router.push("/booknow")}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-full shadow-lg transition-all"
        >
          Retry Booking
        </button>
      </div>
    );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-blue-50 to-green-50 p-4 text-center">
      <h1 className="text-4xl font-extrabold text-green-600 mb-4">🎉 Booking Confirmed!</h1>

      <div className="bg-white border border-green-200 shadow-md rounded-xl p-6 w-full max-w-md mb-6">
        <Detail label="Booking ID" value={booking?.id} />
        <Detail label="From" value={payment?.metadata?.from_location} />
        <Detail label="To" value={payment?.metadata?.to_location} />
        <Detail label="Seats" value={payment?.metadata?.seats} />
        <Detail label="Total Paid" value={`₹${payment?.amount_total / 100}`} />
      </div>

      <button
        onClick={() => router.push("/booking")}
        className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium px-6 py-2 rounded-full shadow-lg transition-all"
      >
        View My Bookings
      </button>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-dashed border-gray-300 text-gray-700">
      <span className="font-medium">{label}:</span>
      <span>{value}</span>
    </div>
  );
}






