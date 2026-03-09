import React, { useContext } from "react";
import "./css/ProfileDrawer.css";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { FaUserEdit, FaBell, FaSignOutAlt, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaShoppingBag } from "react-icons/fa";

export default function ProfileDrawer({ isOpen, onClose }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className={`drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        className={`drawer-content ${isOpen ? "open" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="drawer-header">
          <h3>Account Profile</h3>
          <button className="close-btn" onClick={onClose}>✖</button>
        </div>

        {user ? (
          <div className="drawer-body">
            <div className="profile-card-top">
              <div className="img-wrapper1">
                <img
                  src={user?.userProfilePic ? `http://localhost:5000${user.userProfilePic}` : "/default-avatar.png"}
                  alt="Profile"
                  className="profile-img1"
                />
              </div>
              <h2>{user.name}</h2>
              <span className="user-role">Verified Member</span>
            </div>

            <div className="profile-contact-info">
              <div className="contact-item">
                <FaEnvelope className="icon" /> <span>{user.email}</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="icon" /> <span>{user.address || "No address set"}</span>
              </div>
              <div className="contact-item">
                <FaPhoneAlt className="icon" /> <span>{user.phone || "No phone set"}</span>
              </div>
            </div>

            <div className="drawer-actions">
              <Link to="/edit-profile" className="action-link" onClick={onClose}>
                <div className="action-icon"><FaUserEdit /></div>
                <span>Edit Profile</span>
              </Link>
              
              <Link to="/Notification" className="action-link" onClick={onClose}>
                <div className="action-icon"><FaBell /></div>
                <span>Notifications</span>
                <span className="badge">New</span>
              </Link>

              <Link to="/myorders" className="action-link" onClick={onClose}>
                <div className="action-icon"><FaShoppingBag /></div>
                <span>My Orders</span>
              </Link>
            </div>

            <div className="drawer-footer">
              <button onClick={logout} className="logout-btn-modern">
                <FaSignOutAlt /> Logout Account
              </button>
            </div>
          </div>
        ) : (
          <div className="drawer-empty-state">
            <div className="empty-icon">👤</div>
            <p>You are not logged in yet.</p>
            <Link to="/login" onClick={onClose}>
              <button className="login-btn-modern">Login to Your Account</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}