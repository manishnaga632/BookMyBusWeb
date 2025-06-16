'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminContext } from '@/context/AdminContext';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

const BookingManagerPage = () => {
  const { token } = useAdminContext();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const bookingsPerPage = 10;

  // Fetch all bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [token]);

  // Filter bookings based on search term
  const filteredBookings = bookings.filter(booking => 
    booking.id.toString().includes(searchTerm) ||
    booking.user_id.toString().includes(searchTerm) ||
    booking.travel_id.toString().includes(searchTerm)
  );

  // Pagination logic
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  // Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredBookings);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
    XLSX.writeFile(workbook, "bookings.xlsx");
  };

  // Export to PDF
  const exportToPDF = () => {
    const table = document.getElementById('bookings-table');
    const html = table.outerHTML;
    const blob = new Blob([html], { type: 'application/pdf' });
    saveAs(blob, 'bookings.pdf');
  };

  // Update booking seats
  const updateSeats = async (bookingId, newSeats) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/booking/update/${bookingId}?updated_seats=${newSeats}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh bookings after update
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);
    } catch (err) {
      console.error('Error updating booking:', err);
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/booking/cancel/${bookingId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Refresh bookings after cancellation
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking/all`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (err) {
        console.error('Error cancelling booking:', err);
      }
    }
  };

  return (
    <div className="cyber-admin-container">
      <h1 className="cyber-title">BOOKING MANAGER</h1>
      
      {/* Search and Export Controls */}
      <div className="cyber-controls">
        <div className="cyber-search">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span className="cyber-search-icon">🔍</span>
        </div>
        
        <div className="cyber-export">
          <button onClick={exportToExcel} className="cyber-btn">
            Export Excel
          </button>
          <button onClick={exportToPDF} className="cyber-btn">
            Export PDF
          </button>
        </div>
      </div>

      {/* Bookings Table */}
      {loading ? (
        <div className="cyber-loading">Loading bookings...</div>
      ) : (
        <>
          <table id="bookings-table" className="cyber-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>User ID</th>
                <th>Travel ID</th>
                <th>Seats</th>
                <th>Price/Seat</th>
                <th>Total</th>
                <th>Booked At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.user_id}</td>
                  <td>{booking.travel_id}</td>
                  <td>
                    <input 
                      type="number" 
                      defaultValue={booking.book_seats}
                      onBlur={(e) => updateSeats(booking.id, e.target.value)}
                      className="cyber-input"
                    />
                  </td>
                  <td>₹{booking.price_per_seat}</td>
                  <td>₹{booking.total_price}</td>
                  <td>{new Date(booking.created_at).toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => cancelBooking(booking.id)}
                      className="cyber-btn cyber-delete"
                    >
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="cyber-pagination">
              <button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={currentPage === i + 1 ? 'active' : ''}
                >
                  {i + 1}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingManagerPage;