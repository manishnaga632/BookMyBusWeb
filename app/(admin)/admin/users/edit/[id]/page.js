
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useAdminContext } from '@/context/AdminContext';

const EditUserPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAdminContext();

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    mobile: '',
    age: '',
    gender: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!id || !token) return;

    const fetchUser = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/get_user_by_id/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data;
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          password: '',
          mobile: data.mobile || '',
          age: data.age?.toString() || '',
          gender: data.gender || '',
          role: data.role || '',
        });
      } catch (error) {
        console.error('Fetch error:', error.response?.data || error.message);
        alert(error.response?.data?.message || 'Failed to fetch user data. Please try again.');
        router.push('/admin/users');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id, token, router]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.age) {
      newErrors.age = 'Age is required';
    } else if (isNaN(Number(formData.age))) {
      newErrors.age = 'Age must be a number';
    } else if (Number(formData.age) < 0) {
      newErrors.age = 'Age cannot be negative';
    } else if (Number(formData.age) > 120) {
      newErrors.age = 'Please enter a valid age';
    }

    if (!formData.gender) newErrors.gender = 'Gender is required';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    const payload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      ...(formData.password && { password: formData.password }),
      mobile: formData.mobile,
      age: Number(formData.age),
      gender: formData.gender,
      role: formData.role,
    };

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/users/admin_update/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('User updated successfully!');
      router.push('/admin/users');
    } catch (error) {
      console.error('Update error:', error);
      const errorMessage = error.response?.data?.detail ||
        error.response?.data?.message ||
        'Failed to update user. Please try again.';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="edit-user-loading-container">
        <div className="edit-user-loading-spinner"></div>
        <p>Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="cyber-edit-user-container">
      <button
        type="button"
        onClick={() => router.back()}
        className="cyber-back-btn"
        disabled={isSubmitting}
      >
        ← BACK
      </button>

      <div className="cyber-edit-user-form-wrapper">
        <h1 className="cyber-edit-title">EDIT USER PROFILE</h1>

        <form onSubmit={handleSubmit} className="cyber-edit-user-form">
          {/* First Name */}
          <div className="cyber-input-group">
            <input
              type="text"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder=" "
              className={errors.first_name ? 'cyber-input-error' : ''}
            />
            <label className="cyber-input-label">FIRST NAME</label>
            {errors.first_name && <span className="cyber-error-msg">{errors.first_name}</span>}
          </div>

          {/* Last Name */}
          <div className="cyber-input-group">
            <input
              type="text"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder=" "
              className={errors.last_name ? 'cyber-input-error' : ''}
            />
            <label className="cyber-input-label">LAST NAME</label>
            {errors.last_name && <span className="cyber-error-msg">{errors.last_name}</span>}
          </div>

          {/* Email */}
          <div className="cyber-input-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className={errors.email ? 'cyber-input-error' : ''}
            />
            <label className="cyber-input-label">EMAIL</label>
            {errors.email && <span className="cyber-error-msg">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="cyber-input-group">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
            />
            <label className="cyber-input-label">PASSWORD (leave blank to keep current)</label>
            {errors.password && <span className="cyber-error-msg">{errors.password}</span>}
          </div>

          {/* Mobile */}
          <div className="cyber-input-group">
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder=" "
              className={errors.mobile ? 'cyber-input-error' : ''}
            />
            <label className="cyber-input-label">MOBILE NUMBER</label>
            {errors.mobile && <span className="cyber-error-msg">{errors.mobile}</span>}
          </div>

          {/* Age */}
          <div className="cyber-input-group">
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder=" "
              className={errors.age ? 'cyber-input-error' : ''}
            />
            <label className="cyber-input-label">AGE</label>
            {errors.age && <span className="cyber-error-msg">{errors.age}</span>}
          </div>

          {/* Gender Dropdown */}
          <div className="cyber-input-group">
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? 'cyber-input-error' : ''}
            >
              <option value=""></option>
              <option value="male">MALE</option>
              <option value="female">FEMALE</option>
              <option value="other">OTHER</option>
            </select>
            <label className="cyber-input-label">GENDER</label>
            {errors.gender && <span className="cyber-error-msg">{errors.gender}</span>}
          </div>

          {/* Role Dropdown */}
          <div className="cyber-input-group">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'cyber-input-error' : ''}
            >
              <option value=""></option>
              <option value="user">USER</option>
              <option value="manager">MANAGER</option>
              <option value="admin">ADMIN</option>
            </select>
            <label className="cyber-input-label">ROLE</label>
            {errors.role && <span className="cyber-error-msg">{errors.role}</span>}
          </div>

          <button type="submit" className="cyber-submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'UPDATING...' : 'UPDATE USER'}
          </button>
        </form>
      </div>
    </div>
  )
};

export default EditUserPage;