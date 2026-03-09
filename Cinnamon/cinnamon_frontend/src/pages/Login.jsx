import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import "./css/Auth.css";

export default function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
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
      <div className="auth-glass-card">
        <div className="auth-brand">
          <span className="brand-dot"></span>
          <h1>Welcome <span>Back</span></h1>
          <p>Sign in to continue your journey</p>
        </div>

        <form onSubmit={handleLogin} className="premium-auth-form">
          <div className="auth-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="e.g. alex@cinnamon.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="auth-input-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn-auth-primary">Sign In</button>
        </form>

        <p className="auth-footer-text">
          Don’t have an account? <Link to="/register">Create Account</Link>
        </p>
      </div>
    </div>
  );
}