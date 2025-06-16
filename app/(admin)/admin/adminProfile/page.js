"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const AdminProfileManager = () => {
  const [profile, setProfile] = useState({
    address: '',
    mobile_number: '',
    email: '',
    since: 0,
    happy_travelers: 0,
    destinations_covered: 0,
    travel_partners: 0
  });
  const [errors, setErrors] = useState({});
  const [hasProfile, setHasProfile] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin_profile/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.length > 0) {
        setProfile(response.data[0]);
        setHasProfile(true);
      }
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'mobile_number' && !/^\d{10}$/.test(value)) {
      error = 'Mobile number must be 10 digits';
    }
    else if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      error = 'Invalid email format';
    }
    else if ((name === 'since' && (value < 1900 || value > new Date().getFullYear())) ||
             (name === 'happy_travelers' && value < 0) ||
             (name === 'destinations_covered' && value < 0) ||
             (name === 'travel_partners' && value < 0)) {
      error = 'Value cannot be negative';
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // For number fields, convert to integer and prevent negative values
    if (name === 'since' || name === 'happy_travelers' || 
        name === 'destinations_covered' || name === 'travel_partners') {
      processedValue = Math.max(0, parseInt(value) || 0);
    }
    
    setProfile(prev => ({
      ...prev,
      [name]: processedValue
    }));
    
    // Validate the field
    const error = validateField(name, processedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Required fields
    if (!profile.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }
    
    if (!profile.mobile_number.trim()) {
      newErrors.mobile_number = 'Mobile number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(profile.mobile_number)) {
      newErrors.mobile_number = 'Mobile number must be 10 digits';
      isValid = false;
    }
    
    if (!profile.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }
    
    // Numeric fields validation
    if (profile.since < 1900 || profile.since > new Date().getFullYear()) {
      newErrors.since = `Year must be between 1900 and ${new Date().getFullYear()}`;
      isValid = false;
    }
    
    if (profile.happy_travelers < 0) {
      newErrors.happy_travelers = 'Cannot be negative';
      isValid = false;
    }
    
    if (profile.destinations_covered < 0) {
      newErrors.destinations_covered = 'Cannot be negative';
      isValid = false;
    }
    
    if (profile.travel_partners < 0) {
      newErrors.travel_partners = 'Cannot be negative';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }
    
    try {
      const token = localStorage.getItem('admin_token');
      
      if (hasProfile) {
        // Update existing profile
        await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin_profile/update/${profile.id}`, profile, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Profile updated successfully');
      } else {
        // Create new profile
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/admin_profile/add`, profile, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProfile(response.data);
        setHasProfile(true);
        toast.success('Profile created successfully');
      }
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this profile?')) return;
    
    try {
      const token = localStorage.getItem('admin_token');
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin_profile/delete/${profile.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Profile deleted successfully');
      
      // Reset form after deletion
      setProfile({
        address: '',
        mobile_number: '',
        email: '',
        since: 0,
        happy_travelers: 0,
        destinations_covered: 0,
        travel_partners: 0
      });
      setHasProfile(false);
      setErrors({});
    } catch (error) {
      toast.error('Failed to delete profile');
    }
  };

  return (
    <div className="admin-profile-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="admin-profile-header">
        <button onClick={() => router.back()} className="btn btn-back">
          🔙 Back
        </button>
        <h2>Admin Profile Manager</h2>
        <div className="profile-status">
          {hasProfile ? (
            <span className="status-badge status-active">Profile Exists</span>
          ) : (
            <span className="status-badge status-inactive">No Profile Found</span>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="admin-profile-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Address *</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              className={`form-input ${errors.address ? 'input-error' : ''}`}
            />
            {errors.address && <span className="error-message">{errors.address}</span>}
          </div>

          <div className="form-group">
            <label>Mobile Number *</label>
            <input
              type="text"
              name="mobile_number"
              value={profile.mobile_number}
              onChange={handleChange}
              maxLength="10"
              className={`form-input ${errors.mobile_number ? 'input-error' : ''}`}
            />
            {errors.mobile_number && <span className="error-message">{errors.mobile_number}</span>}
          </div>

          <div className="form-group">
            <label>Email *</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Since (Year)</label>
            <input
              type="number"
              name="since"
              value={profile.since}
              onChange={handleChange}
              min="1900"
              max={new Date().getFullYear()}
              className={`form-input ${errors.since ? 'input-error' : ''}`}
            />
            {errors.since && <span className="error-message">{errors.since}</span>}
          </div>

          <div className="form-group">
            <label>Happy Travelers</label>
            <input
              type="number"
              name="happy_travelers"
              value={profile.happy_travelers}
              onChange={handleChange}
              min="0"
              className={`form-input ${errors.happy_travelers ? 'input-error' : ''}`}
            />
            {errors.happy_travelers && <span className="error-message">{errors.happy_travelers}</span>}
          </div>

          <div className="form-group">
            <label>Destinations Covered</label>
            <input
              type="number"
              name="destinations_covered"
              value={profile.destinations_covered}
              onChange={handleChange}
              min="0"
              className={`form-input ${errors.destinations_covered ? 'input-error' : ''}`}
            />
            {errors.destinations_covered && <span className="error-message">{errors.destinations_covered}</span>}
          </div>

          <div className="form-group">
            <label>Travel Partners</label>
            <input
              type="number"
              name="travel_partners"
              value={profile.travel_partners}
              onChange={handleChange}
              min="0"
              className={`form-input ${errors.travel_partners ? 'input-error' : ''}`}
            />
            {errors.travel_partners && <span className="error-message">{errors.travel_partners}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save">
            {hasProfile ? 'Update Profile' : 'Create Profile'}
          </button>
          
          {hasProfile && (
            <button 
              type="button" 
              onClick={handleDelete} 
              className="btn btn-delete"
            >
              Delete Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminProfileManager;