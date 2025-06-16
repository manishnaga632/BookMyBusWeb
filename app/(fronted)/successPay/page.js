export const dynamic = 'force-dynamic';
export const revalidate = 0;

"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { useUser } from "@/context/UserContext";

const SuccessPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { userInfo } = useUser();

  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const completeBooking = async () => {
      try {
        if (!sessionId || !sessionId.startsWith("cs_")) {
          throw new Error("Invalid payment session ID");
        }

        const verificationRes = await fetch(`/api/stripe?session_id=${sessionId}`);
        let verificationData = {};

        try {
          verificationData = await verificationRes.json();
        } catch (jsonError) {
          throw new Error("Invalid JSON response from payment verification API");
        }

        if (!verificationRes.ok) {
          throw new Error(verificationData.error || "Payment verification failed");
        }

        const bookingRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/create`,
          {
            user_id: Number(verificationData.metadata.user_id),
            travel_id: Number(verificationData.metadata.travel_id),
            book_seats: Number(verificationData.metadata.seats),
            total_price: Number(verificationData.metadata.price),
          },
          { headers: { "Content-Type": "application/json" } }
        );

        setBookingData(bookingRes.data);
      } catch (err) {
        console.error("Booking completion error:", err);
        setError(err.response?.data?.error || err.message || "Booking failed");

        if (err.message.includes("verification failed") || err.message.includes("Invalid JSON")) {
          setTimeout(() => router.push("/booknow"), 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) completeBooking();
  }, [sessionId, router]);

  if (loading) {
    return null; // Loading state now handled by loading.js
  }
  // if (loading) {
  //   return (
  //     <div style={{
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       minHeight: '300px'
  //     }}>
  //       <div style={{
  //         animation: 'spin 1s linear infinite',
  //         borderRadius: '50%',
  //         height: '48px',
  //         width: '48px',
  //         border: '3px solid #3b82f6',
  //         borderTopColor: 'transparent',
  //         marginBottom: '16px'
  //       }}></div>
  //       <p style={{ color: '#4b5563' }}>Finalizing your booking...</p>
  //       <style jsx>{`
  //         @keyframes spin {
  //           to { transform: rotate(360deg); }
  //         }
  //       `}</style>
  //     </div>
  //   );
  // }

  if (error) {
    return (
      <div style={{
        maxWidth: '28rem',
        margin: '0 auto',
        padding: '1.5rem',
        backgroundColor: '#fef2f2',
        borderRadius: '0.5rem',
        marginTop: '2.5rem'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          color: '#dc2626',
          marginBottom: '0.5rem'
        }}>Booking Error</h2>
        <p style={{ marginBottom: '1rem', color: '#4b5563' }}>{error}</p>
        <button
          onClick={() => router.push("/booknow")}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '0.5rem 1rem',
            borderRadius: '0.375rem',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
        >
          Back to Booking
        </button>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '28rem',
      margin: '0 auto',
      padding: '1.5rem',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginTop: '2.5rem'
    }}>
      <h1 style={{
        fontSize: '1.5rem',
        fontWeight: '700',
        color: '#16a34a',
        marginBottom: '1rem',
        textAlign: 'center'
      }}>Booking Confirmed!</h1>

      {bookingData && (
        <div style={{
          display: 'grid',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}>
          <p style={{ color: '#4b5563' }}>
            <strong style={{ color: '#1f2937' }}>Booking ID:</strong> {bookingData.id}
          </p>
          <p style={{ color: '#4b5563' }}>
            <strong style={{ color: '#1f2937' }}>Seats:</strong> {bookingData.book_seats}
          </p>
          <p style={{ color: '#4b5563' }}>
            <strong style={{ color: '#1f2937' }}>Total Paid:</strong> ₹{bookingData.total_price}
          </p>
        </div>
      )}

      <button
        onClick={() => router.push("/booking")}
        style={{
          width: '100%',
          backgroundColor: '#16a34a',
          color: 'white',
          padding: '0.5rem',
          borderRadius: '0.375rem',
          border: 'none',
          cursor: 'pointer',
          fontWeight: '600',
          transition: 'background-color 0.2s'
        }}
        onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#15803d'}
        onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#16a34a'}
      >
        View My Bookings
      </button>
    </div>
  );
};

export default SuccessPage;