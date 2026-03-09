import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./css/Auth.css";

export default function Register() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    accountType: "user",
    name: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    businessName: "",
    businessLocation: ""
  });
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append("userProfilePic", file);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-glass-card register-wide">
        <div className="auth-brand">
          <h1>Create <span>Account</span></h1>
          <p>Join the Cinnamon Bridge network today</p>
        </div>

        <form onSubmit={handleRegister} className="premium-auth-form">
          <div className="premium-radio-row">
            <label className={`radio-tile ${form.accountType === 'user' ? 'active' : ''}`}>
              <input type="radio" name="accountType" value="user" checked={form.accountType === "user"} onChange={handleChange} />
              <div className="tile-content"><span>👤</span> Normal User</div>
            </label>
            <label className={`radio-tile ${form.accountType === 'pending' ? 'active' : ''}`}>
              <input type="radio" name="accountType" value="pending" checked={form.accountType === "pending"} onChange={handleChange} />
              <div className="tile-content"><span>💼</span> Business Owner</div>
            </label>
          </div>

          <div className="auth-grid">
            <div className="auth-input-group">
              <label>Full Name</label>
              <input type="text" name="name" placeholder="John Doe" onChange={handleChange} required />
            </div>
            <div className="auth-input-group">
              <label>Email Address</label>
              <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} required />
            </div>
            <div className="auth-input-group">
              <label>Contact Number</label>
              <input type="text" name="contact" placeholder="+94 7x xxx xxxx" onChange={handleChange} required />
            </div>
            <div className="auth-input-group">
              <label>Password</label>
              <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
            </div>
          </div>

          <div className="auth-input-group full-width">
            <label>Living Address</label>
            <input type="text" name="address" placeholder="No 123, Galle Rd, Colombo" onChange={handleChange} required />
          </div>

          <div className="file-upload-section">
             <div className="avatar-preview">
                {preview ? <img src={preview} alt="Avatar" /> : <div className="placeholder">Photo</div>}
             </div>
             <label className="custom-file-btn">
                Choose Profile Picture
                <input type="file" onChange={handleFileChange} accept="image/*" />
             </label>
          </div>

          {form.accountType === "pending" && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="business-extra-fields">
              <div className="auth-grid">
                <div className="auth-input-group">
                  <label>Registered Business Name</label>
                  <input type="text" name="businessName" placeholder="Cinnamon Ltd" onChange={handleChange} required />
                </div>
                <div className="auth-input-group">
                  <label>Store Location</label>
                  <input type="text" name="businessLocation" placeholder="Kandy, Sri Lanka" onChange={handleChange} required />
                </div>
              </div>
            </motion.div>
          )}

          <button type="submit" className="btn-auth-primary">Create My Account</button>
        </form>

        <p className="auth-footer-text">
          Already a member? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}