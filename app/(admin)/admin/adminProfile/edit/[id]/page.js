"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ;
const API = `${API_BASE}/admin_profile`;

const initialForm = {
  address: "",
  mobile_number: "",
  email: "",
  twitter_link: "",
  linkedin_link: "",
  facebook_link: "",
  insta_link: "",
  youtube_link: "",
  experience_in_year: 0,
  total_trainers: 0,
  complete_project_number: 0,
  happy_clients_number: 0,
};

export default function EditProfilePage() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const router = useRouter();
  const { id } = useParams();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          router.push("/admin/login");
          return;
        }

        const res = await fetch(`${API}/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setFormData({
          address: data.address || "",
          mobile_number: data.mobile_number || "",
          email: data.email || "",
          twitter_link: data.twitter_link || "",
          linkedin_link: data.linkedin_link || "",
          facebook_link: data.facebook_link || "",
          insta_link: data.insta_link || "",
          youtube_link: data.youtube_link || "",
          experience_in_year: data.experience_in_year || 0,
          total_trainers: data.total_trainers || 0,
          complete_project_number: data.complete_project_number || 0,
          happy_clients_number: data.happy_clients_number || 0,
        });
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(err.message || "Failed to fetch profile");
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [id, router]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Invalid email format";

    if (!formData.mobile_number.trim()) newErrors.mobile_number = "Mobile number is required";
    else if (!/^[0-9]{10,15}$/.test(formData.mobile_number))
      newErrors.mobile_number = "Invalid mobile number";

    if (!formData.address.trim()) newErrors.address = "Address is required";

    const numericFields = [
      "experience_in_year",
      "total_trainers",
      "complete_project_number",
      "happy_clients_number"
    ];

    numericFields.forEach(field => {
      if (isNaN(formData[field])) {
        newErrors[field] = "Must be a number";
      } else if (formData[field] < 0) {
        newErrors[field] = "Cannot be negative";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      if (!token) {
        router.push("/admin/login");
        return;
      }

      const response = await fetch(`${API}/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          experience_in_year: Number(formData.experience_in_year),
          total_trainers: Number(formData.total_trainers),
          complete_project_number: Number(formData.complete_project_number),
          happy_clients_number: Number(formData.happy_clients_number),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Operation failed");
      }

      toast.success("Profile updated successfully");
      router.push("/admin/adminProfile");
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="admin-profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <ToastContainer position="top-right" autoClose={5000} />

      <div className="profile-header">
        <h1 className="profile-title">Edit Profile</h1>
        <button
          onClick={() => router.push("/admin/adminProfile")}
          className="btn btn-back"
        >
          ← Back to Profiles
        </button>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-grid">
          {/* Contact Information */}
          <div className="form-section">
            <h4 className="section-title">Contact Information</h4>

            <div className="form-group">
              <label>Email*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="admin@example.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Mobile Number*</label>
              <input
                type="text"
                name="mobile_number"
                value={formData.mobile_number}
                onChange={handleInputChange}
                className={`form-control ${errors.mobile_number ? "is-invalid" : ""}`}
                placeholder="9876543210"
              />
              {errors.mobile_number && <span className="error-message">{errors.mobile_number}</span>}
            </div>

            <div className="form-group">
              <label>Address*</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className={`form-control ${errors.address ? "is-invalid" : ""}`}
                placeholder="123 Gym Street"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>
          </div>

          {/* Social Links */}
          <div className="form-section">
            <h4 className="section-title">Social Links</h4>

            <div className="form-group">
              <label>Twitter</label>
              <input
                type="url"
                name="twitter_link"
                value={formData.twitter_link}
                onChange={handleInputChange}
                className="form-control"
                placeholder="https://twitter.com/username"
              />
            </div>

            <div className="form-group">
              <label>LinkedIn</label>
              <input
                type="url"
                name="linkedin_link"
                value={formData.linkedin_link}
                onChange={handleInputChange}
                className="form-control"
                placeholder="https://linkedin.com/in/username"
              />
            </div>

            <div className="form-group">
              <label>Facebook</label>
              <input
                type="url"
                name="facebook_link"
                value={formData.facebook_link}
                onChange={handleInputChange}
                className="form-control"
                placeholder="https://facebook.com/username"
              />
            </div>

            <div className="form-group">
              <label>Instagram</label>
              <input
                type="url"
                name="insta_link"
                value={formData.insta_link}
                onChange={handleInputChange}
                className="form-control"
                placeholder="https://instagram.com/username"
              />
            </div>

            <div className="form-group">
              <label>YouTube</label>
              <input
                type="url"
                name="youtube_link"
                value={formData.youtube_link}
                onChange={handleInputChange}
                className="form-control"
                placeholder="https://youtube.com/username"
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="form-section">
          <h4 className="section-title">Gym Statistics</h4>
          <div className="form-grid">
            <div className="form-group">
              <label>Experience (Years)*</label>
              <input
                type="number"
                name="experience_in_year"
                value={formData.experience_in_year}
                onChange={handleInputChange}
                className={`form-control ${errors.experience_in_year ? "is-invalid" : ""}`}
                min="0"
              />
              {errors.experience_in_year && <span className="error-message">{errors.experience_in_year}</span>}
            </div>

            <div className="form-group">
              <label>Total Trainers*</label>
              <input
                type="number"
                name="total_trainers"
                value={formData.total_trainers}
                onChange={handleInputChange}
                className={`form-control ${errors.total_trainers ? "is-invalid" : ""}`}
                min="0"
              />
              {errors.total_trainers && <span className="error-message">{errors.total_trainers}</span>}
            </div>

            <div className="form-group">
              <label>Completed Projects*</label>
              <input
                type="number"
                name="complete_project_number"
                value={formData.complete_project_number}
                onChange={handleInputChange}
                className={`form-control ${errors.complete_project_number ? "is-invalid" : ""}`}
                min="0"
              />
              {errors.complete_project_number && <span className="error-message">{errors.complete_project_number}</span>}
            </div>

            <div className="form-group">
              <label>Happy Clients*</label>
              <input
                type="number"
                name="happy_clients_number"
                value={formData.happy_clients_number}
                onChange={handleInputChange}
                className={`form-control ${errors.happy_clients_number ? "is-invalid" : ""}`}
                min="0"
              />
              {errors.happy_clients_number && <span className="error-message">{errors.happy_clients_number}</span>}
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => router.push("/admin/adminProfile")}
            className="btn btn-cancel"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-submit"
          >
            {loading ? "Processing..." : "Update Profile"}
          </button>
        </div>
      </form>
    </div>
  );
}