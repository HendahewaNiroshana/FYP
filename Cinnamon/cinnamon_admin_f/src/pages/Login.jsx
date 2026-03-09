import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaLock, FaEnvelope, FaEye, FaEyeSlash, FaShieldAlt } from "react-icons/fa";
import "./css/Login.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/api/admin-users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (data.success) {
        login({ ...data.user, token: data.token });
        navigate("/");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-container">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="login-card"
      >
        <div className="login-header">
          <div className="brand-logo">
            <FaShieldAlt size={40} color="#b36b00" />
          </div>
          <h2>Admin Control Panel</h2>
          <p>Please enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FaEnvelope className="input-icon" size={18} />
              <input
                type="email"
                name="email"
                placeholder="admin@cinnamonbridge.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FaLock className="input-icon" size={18} />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button 
                type="button" 
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
              </button>
            </div>
          </div>

          <button type="submit" className="login-btn" disabled={isSubmitting}>
            {isSubmitting ? "Authenticating..." : "Sign In to Dashboard"}
          </button>
        </form>

        <div className="login-footer">
          <p>© 2026 Cinnamon Bridge Security System</p>
        </div>
      </motion.div>
    </div>
  );
}