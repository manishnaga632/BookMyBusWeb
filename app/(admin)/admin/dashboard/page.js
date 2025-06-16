




'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAdminContext } from '@/context/AdminContext';

const AdminDashboard = () => {
  const { token } = useAdminContext();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTravels: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
    adminProfile: [] // Changed to array to match API response
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          usersRes, 
          travelsRes, 
          bookingsRes,
          adminRes
        ] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/all_users`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/travels/all`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/booking/all`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin_profile/all`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        // Calculate total revenue from bookings
        const totalRevenue = bookingsRes.data?.reduce((sum, booking) => 
          sum + (booking.total_price || 0), 0) || 0;

        setStats({
          totalUsers: usersRes.data?.length || 0,
          totalTravels: travelsRes.data?.length || 0,
          totalBookings: bookingsRes.data?.length || 0,
          totalRevenue,
          recentBookings: bookingsRes.data?.slice(0, 5) || [],
          adminProfile: adminRes.data || [] // Now properly handles array response
        });
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  return (
    <div className="cyber-dashboard">
      {/* Header with Admin Profile */}
      <div className="cyber-header">
        <h1>
          <span className="cyber-text-glitch">ADMIN</span> DASHBOARD
          {stats.adminProfile.length > 0 && (
            <span className="cyber-admin-name">
              {/* | {stats.adminProfile[0].email?.split('@')[0].toUpperCase() || 'ADMIN'} */}
              {stats.adminProfile[0].email?.split('@')[0].replace(/[0-9]/g, '').toUpperCase() || 'ADMIN'}

            </span>
          )}
        </h1>
        <div className="cyber-date">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="cyber-stats-grid">
        <CyberCard 
          title="TOTAL USERS"
          value={stats.totalUsers}
          icon="👥"
          color="pink"
        />
        <CyberCard
          title="ACTIVE TRAVELS"
          value={stats.totalTravels}
          icon="🚌"
          color="cyan"
        />
        <CyberCard
          title="TOTAL BOOKINGS"
          value={stats.totalBookings}
          icon="🎫"
          color="purple"
        />
        <CyberCard
          title="TOTAL REVENUE"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="yellow"
        />
      </div>

      {/* Recent Bookings Table */}
      <div className="cyber-section">
        <h2 className="cyber-section-title">RECENT BOOKINGS</h2>
        <div className="cyber-table-container">
          <table className="cyber-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER ID</th>
                <th>TRAVEL ID</th>
                <th>SEATS</th>
                <th>TOTAL</th>
                <th>DATE</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.user_id}</td>
                  <td>{booking.travel_id}</td>
                  <td>{booking.book_seats}</td>
                  <td>₹{booking.total_price}</td>
                  <td>{new Date(booking.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="cyber-quick-stats">
        <div className="cyber-stat">
          <h3>DAILY AVERAGE</h3>
          <p>{(stats.totalBookings / 30).toFixed(1)} bookings/day</p>
        </div>
        <div className="cyber-stat">
          <h3>OCCUPANCY RATE</h3>
          <p>{((stats.totalBookings / (stats.totalTravels * 30)) * 100 || 0).toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

// CyberCard Component
const CyberCard = ({ title, value, icon, color }) => (
  <div className={`cyber-card cyber-${color}`}>
    <div className="cyber-card-icon">{icon}</div>
    <div className="cyber-card-content">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  </div>
);

export default AdminDashboard;