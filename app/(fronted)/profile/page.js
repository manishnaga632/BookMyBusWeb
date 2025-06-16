

'use client';
import React, { useContext, useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';


export default function ProfilePage() {
  const { userInfo, token, loading, setUserInfo } = useUser();
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: ''
  });
  const [errors, setErrors] = useState({
    first_name: '',
    last_name: ''
  });
  const [message, setMessage] = useState('');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    if (!loading && !userInfo && authChecked) {
      router.push('/join');
    }
    if (!loading) {
      setAuthChecked(true);
    }
  }, [userInfo, loading, router, authChecked]);

  useEffect(() => {
    if (userInfo) {
      setFormData({
        first_name: userInfo.first_name || '',
        last_name: userInfo.last_name || ''
      });
    }
  }, [userInfo]);

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      first_name: '',
      last_name: ''
    };

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
      valid = false;
    } else if (formData.first_name.length > 50) {
      newErrors.first_name = 'First name must be less than 50 characters';
      valid = false;
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
      valid = false;
    } else if (formData.last_name.length > 50) {
      newErrors.last_name = 'Last name must be less than 50 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        mobile: userInfo.mobile || null, // Keep existing mobile
        new_password: null,
        confirm_password: null
      };

      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/users/profile_update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setUserInfo(response.data);
      setMessage('✅ Profile updated successfully!');
      setShowForm(false);

      setTimeout(() => setMessage(''), 5000);
    } catch (error) {
      console.error('Error updating profile:', error);
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to update profile';
      setMessage(`❌ ${errorMessage}`);
      setTimeout(() => setMessage(''), 5000);
    }
  };

  if (loading || !authChecked) {
    return (
      <div className="loading-screen">
        <div className="skeleton-loader">
          <div className="skeleton-header"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
          <div className="skeleton-line"></div>
        </div>
      </div>
    );
  }

  if (!userInfo) return null;

  return (
    <div className="profile-container">
      <h2 className="profile-heading">👤 User Profile</h2>

      <div className="profile-info">
        <p><strong>First Name:</strong> {userInfo.first_name || 'Not provided'}</p>
        <p><strong>Last Name:</strong> {userInfo.last_name || 'Not provided'}</p>
        <p><strong>Email:</strong> {userInfo.email}</p>
        <p><strong>Mobile:</strong> {userInfo.mobile || 'Not provided'}</p>
        <p><strong>Age:</strong> {userInfo.age || 'Not provided'}</p>
        <p><strong>Gender:</strong> {userInfo.gender || 'Not provided'}</p>
      </div>

      <button
        className="profile-toggle-btn"
        onClick={() => setShowForm(!showForm)}
        aria-expanded={showForm}
        aria-controls="profile-form"
      >
        {showForm ? 'Close Update Form' : 'Update Profile'}
      </button>

      {showForm && (
        <form onSubmit={handleProfileUpdate} className="profile-form" id="profile-form" noValidate>
          <div className="form-group">
            <label htmlFor="first_name">First Name *</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              required
              maxLength={50}
              aria-required="true"
              className={errors.first_name ? 'error' : ''}
            />
            {errors.first_name && <span className="error-message">{errors.first_name}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="last_name">Last Name *</label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              required
              maxLength={50}
              aria-required="true"
              className={errors.last_name ? 'error' : ''}
            />
            {errors.last_name && <span className="error-message">{errors.last_name}</span>}
          </div>

          <button type="submit" className="profile-submit-btn">
            Save Changes
          </button>
        </form>
      )}

      {message && (
        <p className={`profile-message ${message.includes('✅') ? 'success' : 'error'}`}>
          {message}
        </p>
      )}
    </div>
  );
}