"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter } from 'next/navigation';

const EditTravel = ({ params }) => {
  const { id } = params;
  const [travel, setTravel] = useState({
    bus_image: '',
    from_location: '',
    to_location: '',
    time: '',
    available_seats: 0,
    price_per_seat: 0
  });
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    fetchTravel();
  }, [id]);

  const fetchTravel = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await axios.get(`http://127.0.0.1:8000/travels/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTravel(response.data);
    } catch (error) {
      toast.error('Failed to fetch travel details');
      router.push('/admin/travels');
    }
  };

  const validateField = (name, value) => {
    let error = '';
    
    if (name === 'bus_image' && !value) {
      error = 'Bus image URL is required';
    }
    else if ((name === 'from_location' || name === 'to_location') && !value.trim()) {
      error = 'Location is required';
    }
    else if (name === 'time' && !/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(value)) {
      error = 'Invalid time format (HH:MM)';
    }
    else if ((name === 'available_seats' || name === 'price_per_seat') && value < 0) {
      error = 'Cannot be negative';
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    // For number fields, convert to integer and prevent negative values
    if (name === 'available_seats' || name === 'price_per_seat') {
      processedValue = Math.max(0, parseInt(value) || 0);
    }
    
    setTravel(prev => ({
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
    if (!travel.bus_image.trim()) {
      newErrors.bus_image = 'Bus image URL is required';
      isValid = false;
    }
    
    if (!travel.from_location.trim()) {
      newErrors.from_location = 'From location is required';
      isValid = false;
    }
    
    if (!travel.to_location.trim()) {
      newErrors.to_location = 'To location is required';
      isValid = false;
    }
    
    if (!travel.time.trim()) {
      newErrors.time = 'Time is required';
      isValid = false;
    } else if (!/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(travel.time)) {
      newErrors.time = 'Invalid time format (HH:MM)';
      isValid = false;
    }
    
    // Numeric fields validation
    if (travel.available_seats < 0) {
      newErrors.available_seats = 'Cannot be negative';
      isValid = false;
    }
    
    if (travel.price_per_seat < 0) {
      newErrors.price_per_seat = 'Cannot be negative';
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
      await axios.put(`http://127.0.0.1:8000/travels/update/${id}`, travel, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Travel updated successfully');
      router.push('/admin/travels');
    } catch (error) {
      toast.error('Failed to update travel');
    }
  };

  return (
    <div className="travel-edit-container">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className="travel-edit-header">
        <button onClick={() => router.push('/admin/travels')} className="btn btn-back">
          🔙 Back to Travels
        </button>
        <h2>Edit Travel #{id}</h2>
      </div>

      <form onSubmit={handleSubmit} className="travel-edit-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Bus Image URL *</label>
            <input
              type="url"
              name="bus_image"
              value={travel.bus_image}
              onChange={handleChange}
              className={`form-input ${errors.bus_image ? 'input-error' : ''}`}
            />
            {errors.bus_image && <span className="error-message">{errors.bus_image}</span>}
            {travel.bus_image && (
              <div className="image-preview">
                <img 
                  src={travel.bus_image} 
                  alt="Bus Preview" 
                  className="preview-image"
                  onError={(e) => {
                    e.target.onerror = null; 
                    e.target.src = 'https://via.placeholder.com/300x150?text=Invalid+Image+URL';
                  }}
                />
              </div>
            )}
          </div>

          <div className="form-group">
            <label>From Location *</label>
            <input
              type="text"
              name="from_location"
              value={travel.from_location}
              onChange={handleChange}
              className={`form-input ${errors.from_location ? 'input-error' : ''}`}
            />
            {errors.from_location && <span className="error-message">{errors.from_location}</span>}
          </div>

          <div className="form-group">
            <label>To Location *</label>
            <input
              type="text"
              name="to_location"
              value={travel.to_location}
              onChange={handleChange}
              className={`form-input ${errors.to_location ? 'input-error' : ''}`}
            />
            {errors.to_location && <span className="error-message">{errors.to_location}</span>}
          </div>

          <div className="form-group">
            <label>Time (HH:MM) *</label>
            <input
              type="text"
              name="time"
              value={travel.time}
              onChange={handleChange}
              placeholder="14:30"
              className={`form-input ${errors.time ? 'input-error' : ''}`}
            />
            {errors.time && <span className="error-message">{errors.time}</span>}
          </div>

          <div className="form-group">
            <label>Available Seats</label>
            <input
              type="number"
              name="available_seats"
              value={travel.available_seats}
              onChange={handleChange}
              min="0"
              className={`form-input ${errors.available_seats ? 'input-error' : ''}`}
            />
            {errors.available_seats && <span className="error-message">{errors.available_seats}</span>}
          </div>

          <div className="form-group">
            <label>Price Per Seat (₹)</label>
            <input
              type="number"
              name="price_per_seat"
              value={travel.price_per_seat}
              onChange={handleChange}
              min="0"
              className={`form-input ${errors.price_per_seat ? 'input-error' : ''}`}
            />
            {errors.price_per_seat && <span className="error-message">{errors.price_per_seat}</span>}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-save">
            Save Changes
          </button>
          <button 
            type="button" 
            onClick={() => router.push('/admin/travels')} 
            className="btn btn-cancel"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditTravel;