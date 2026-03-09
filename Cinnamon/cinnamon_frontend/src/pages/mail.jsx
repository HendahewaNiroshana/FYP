
import "./css/Contact.css";
import React, { useState } from "react";

export default function Contact() {

  const [form, setForm] = useState({
    to: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setStatus("✅ Email sent successfully!");
        setForm({ to: "", subject: "", message: "" });
      } else {
        setStatus("❌ Failed: " + data.message);
      }
    } catch (err) {
      setStatus("❌ Error sending email");
    }
  };




  return (
    <div className="contact-container">
      <h1 className="contact-title">Contact Us</h1>
      <p className="contact-subtitle">
        We’d love to hear from you! Fill out the form or reach us through the
        details below.
      </p>

      <div className="contact-grid">
        {/* Contact Form */}
        <div className="send-email">
      <h2>Send Email</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="to"
          placeholder="Recipient Email"
          value={form.to}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="subject"
          placeholder="Subject"
          value={form.subject}
          onChange={handleChange}
          required
        />
        <textarea
          name="message"
          placeholder="Write your message..."
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit">Send Email</button>
      </form>
      {status && <p>{status}</p>}
    </div>

        {/* Contact Info */}
        <div className="contact-info">
          <div className="info-card">
            <h3>📍 Address</h3>
            <p>123 Cinnamon Street, Spice City, Sri Lanka</p>
          </div>
          <div className="info-card">
            <h3>📧 Email</h3>
            <p>support@cinnamon.com</p>
          </div>
          <div className="info-card">
            <h3>📞 Phone</h3>
            <p>+94 77 123 4567</p>
          </div>
        </div>
      </div>
    </div>
  );
}
