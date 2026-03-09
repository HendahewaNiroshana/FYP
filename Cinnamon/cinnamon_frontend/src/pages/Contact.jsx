import "./css/Contact.css";
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaPaperPlane } from "react-icons/fa";

export default function Contact() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?._id) {
      setStatus("Please login to send a message.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, message }),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Message sent successfully!");
        setMessage("");
      } else {
        setStatus("⚠️ " + data.message);
      }
    } catch (err) {
      setStatus("❌ Server error");
    }
  };

  return (
    <div className="contact-page-wrapper">
      <div className="contact-header">
        <h1>Get in Touch</h1>
        <p>Have questions about our premium cinnamon? We're here to help.</p>
        <div className="header-bar"></div>
      </div>

      <div className="contact-main-grid">
        <div className="contact-info-panel">
          <div className="info-box">
            <div className="info-icon"><FaMapMarkerAlt /></div>
            <div>
              <h3>Visit Us</h3>
              <p>123 Cinnamon Street, Spice City, Sri Lanka</p>
            </div>
          </div>

          <div className="info-box">
            <div className="info-icon"><FaEnvelope /></div>
            <div>
              <h3>Email Us</h3>
              <p>support@cinnamonbridge.com</p>
            </div>
          </div>

          <div className="info-box">
            <div className="info-icon"><FaPhoneAlt /></div>
            <div>
              <h3>Call Us</h3>
              <p>+94 77 123 4567</p>
            </div>
          </div>
        </div>

        <div className="contact-form-panel">
          <div className="form-card-modern">
            <h2>Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <textarea
                  placeholder="How can we help you today?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="submit-btn-modern">
                <span>Send Message</span> <FaPaperPlane />
              </button>
            </form>
            {status && <div className={`status-msg ${status.includes('✅') ? 'success' : 'error'}`}>{status}</div>}
          </div>
        </div>
      </div>
    </div>
  );
}