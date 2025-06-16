"use client";

import React, { useEffect, useState } from "react";
import { toast, Toaster } from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [adminInfo, setAdminInfo] = useState(null);
  const API_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const res = await fetch(`${API_URL}/admin_profile/all`);
        const data = await res.json();
        if (res.ok && data.length > 0) {
          setAdminInfo(data[0]);
        }
      } catch (err) {
        console.error("Failed to fetch admin info:", err);
      }
    };

    fetchAdminInfo();
  }, [API_URL]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateForm = () => {
    const { name, email, subject, message } = formData;
    if (!name || !email || !subject || !message) return false;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    if (message.length < 10) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return;
    if (!validateForm()) {
      toast.error("Please fill all fields correctly.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_URL}/contact/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully! ✅");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        toast.error(data?.detail || "Failed to send message.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      <div className="container-fluid bg-primary p-5 bg-hero mb-5">
        <div className="row py-5">
          <div className="col-12 text-center">
            <h1 className="display-2 text-uppercase text-white mb-md-4">Contact Bus Support</h1>
            <a href="/" className="btn btn-primary py-md-3 px-md-5 me-3">Home</a>
            <a href="/contact" className="btn btn-light py-md-3 px-md-5">Contact</a>
          </div>
        </div>
      </div>

      <div className="container-fluid p-5">
        <div className="mb-5 text-center">
          <h5 className="text-primary text-uppercase">Need Help?</h5>
          <h1 className="display-3 text-uppercase mb-0">Reach Out to BookMyBus Team</h1>
        </div>

        <div className="row g-5 mb-5">
          <div className="col-lg-4">
            <div className="d-flex flex-column align-items-center bg-dark rounded text-center py-5 px-3">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                <i className="fa fa-map-marker-alt fs-4 text-white" />
              </div>
              <h5 className="text-uppercase text-primary">Visit Office</h5>
              <p className="text-secondary mb-0">{adminInfo?.address || "Jaipur, India"}</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column align-items-center bg-dark rounded text-center py-5 px-3">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                <i className="fa fa-envelope fs-4 text-white" />
              </div>
              <h5 className="text-uppercase text-primary">Email Us</h5>
              <p className="text-secondary mb-0">{adminInfo?.email || "bookmybus@gmail.com"}</p>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="d-flex flex-column align-items-center bg-dark rounded text-center py-5 px-3">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center mb-3" style={{ width: 60, height: 60 }}>
                <i className="fa fa-phone fs-4 text-white" />
              </div>
              <h5 className="text-uppercase text-primary">Call Support</h5>
              <p className="text-secondary mb-0">{adminInfo?.mobile_number || "1800-123-456"}</p>
            </div>
          </div>
        </div>

        <div className="row g-0">
          <div className="col-lg-6 order-lg-1 order-2">
            <div className="bg-dark p-5">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-6">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="form-control bg-light border-0 px-4"
                      placeholder="Your Name"
                      required
                      style={{ height: 55 }}
                    />
                  </div>
                  <div className="col-6">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="form-control bg-light border-0 px-4"
                      placeholder="Your Email"
                      required
                      style={{ height: 55 }}
                    />
                  </div>
                  <div className="col-12">
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="form-control bg-light border-0 px-4"
                      style={{ height: 55 }}
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="Booking Inquiry">Booking Inquiry</option>
                      <option value="Cancellation">Cancellation</option>
                      <option value="Refund">Refund</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      className="form-control bg-light border-0 px-4 py-3"
                      rows={4}
                      placeholder="Your Message"
                      required
                      minLength={10}
                    />
                  </div>
                  <div className="col-12">
                    <button
                      className="btn btn-primary w-100 py-3"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          Sending...
                        </>
                      ) : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="col-lg-6 order-lg-2 order-1">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3558.001380579154!2d75.7873!3d26.9124!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396db4e1fc65aecd%3A0x2a4a3c51dd460fe7!2sJaipur!5e0!3m2!1sen!2sin!4v1623861234567"
              width="100%"
              height="457"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="Bus Office Location"
            />
          </div>
        </div>
      </div>
    </>
  );
}