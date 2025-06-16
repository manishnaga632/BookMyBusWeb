"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://gymstar-api-97ix.onrender.com";
const API = `${API_BASE}/admin_profile`;

export default function ProfileDetailsPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setProfile(data);
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error(err.message || "Failed to fetch profile");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id, router]);

  if (loading) {
    return (
      <div className="admin-profile-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="admin-profile-container">
        <div className="empty-state">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="admin-profile-container">
      <div className="profile-header">
        <h1 className="profile-title">Profile Details</h1>
        <button
          onClick={() => router.push("/admin/adminProfile")}
          className="btn btn-back"
        >
          ← Back to Profiles
        </button>
      </div>

      <div className="profile-details">
        <div className="details-section">
          <h3 className="section-title">Contact Information</h3>
          <div className="detail-item">
            <span className="detail-label">Email:</span>
            <span className="detail-value">{profile.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Mobile:</span>
            <span className="detail-value">{profile.mobile_number}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Address:</span>
            <span className="detail-value">{profile.address || '-'}</span>
          </div>
        </div>

        <div className="details-section">
          <h3 className="section-title">Social Links</h3>
          <div className="detail-item">
            <span className="detail-label">Twitter:</span>
            {profile.twitter_link ? (
              <a href={profile.twitter_link} target="_blank" rel="noopener noreferrer" className="social-link">
                View
              </a>
            ) : (
              <span className="detail-value">-</span>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">LinkedIn:</span>
            {profile.linkedin_link ? (
              <a href={profile.linkedin_link} target="_blank" rel="noopener noreferrer" className="social-link">
                View
              </a>
            ) : (
              <span className="detail-value">-</span>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Facebook:</span>
            {profile.facebook_link ? (
              <a href={profile.facebook_link} target="_blank" rel="noopener noreferrer" className="social-link">
                View
              </a>
            ) : (
              <span className="detail-value">-</span>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">Instagram:</span>
            {profile.insta_link ? (
              <a href={profile.insta_link} target="_blank" rel="noopener noreferrer" className="social-link">
                View
              </a>
            ) : (
              <span className="detail-value">-</span>
            )}
          </div>
          <div className="detail-item">
            <span className="detail-label">YouTube:</span>
            {profile.youtube_link ? (
              <a href={profile.youtube_link} target="_blank" rel="noopener noreferrer" className="social-link">
                View
              </a>
            ) : (
              <span className="detail-value">-</span>
            )}
          </div>
        </div>

        <div className="details-section">
          <h3 className="section-title">Gym Statistics</h3>
          <div className="detail-item">
            <span className="detail-label">Experience:</span>
            <span className="detail-value">{profile.experience_in_year} years</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Total Trainers:</span>
            <span className="detail-value">{profile.total_trainers}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Completed Projects:</span>
            <span className="detail-value">{profile.complete_project_number}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Happy Clients:</span>
            <span className="detail-value">{profile.happy_clients_number}</span>
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={() => router.push(`/admin/adminProfile/edit/${id}`)}
            className="btn btn-edit"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}