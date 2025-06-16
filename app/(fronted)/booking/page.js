
'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function BookingList() {
  const { userInfo, token, authChecked } = useUser();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!authChecked) return;

    if (!userInfo || !token) {
      localStorage.setItem('redirectAfterLogin', '/bookings');
      router.push('/login');
      return;
    }

    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/booking/user/${userInfo.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        // ✅ Filter bookings (only today or future ones)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const filtered = response.data.filter((booking) => {
          const bookingDate = new Date(booking.created_at);
          bookingDate.setHours(0, 0, 0, 0);
          return bookingDate >= today;
        });

        setBookings(filtered);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userInfo, token, authChecked]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!authChecked || loading) {
    return (
      <div className="booking-container">
        <div className="booking-loading">
          <div className="booking-loading-spinner"></div>
          <p>Loading your bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="booking-container">
        <div className="booking-error">
          <h3>Error Loading Bookings</h3>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="booking-btn">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-container">
      <div className="booking-header">
        <div>
          <h1 className="booking-title">Your Bookings</h1>
          {bookings.length > 0 && (
            <p className="booking-subtitle">
              Showing {bookings.length} {bookings.length === 1 ? 'booking' : 'bookings'}
            </p>
          )}
        </div>
        <Link href="/" className="booking-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Booking
        </Link>
      </div>

      {bookings.length === 0 ? (
        <div className="booking-empty-state">
          <h3>No bookings found</h3>
          <p>You have not made any upcoming bookings yet.</p>
          <button onClick={() => router.push('/')} className="booking-btn">Book a Trip</button>
        </div>
      ) : (
        <div className="booking-table-container">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Bus</th>
                <th>Booking ID</th>
                <th>Seats</th>
                <th>Price/Seat</th>
                <th>Total</th>
                <th>Booked On</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>
                    <img
                      src={booking.bus_image || '/default-bus.jpg'}
                      alt="Bus"
                      className="booking-bus-image"
                      onError={(e) => {
                        e.target.src = '/default-bus.jpg';
                      }}
                    />
                  </td>
                  <td>#{booking.id}</td>
                  <td>{booking.book_seats}</td>
                  <td>₹{booking.price_per_seat}</td>
                  <td>₹{booking.total_price}</td>
                  <td>{formatDate(booking.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
