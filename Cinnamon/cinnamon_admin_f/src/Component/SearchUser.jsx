import React, { useState } from "react";
import axios from "axios";
import './SearchUser.css';

const FindBusinessModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState(""); 
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return;

    setLoading(true);
    setError("");
    setUserData(null);

    try {
      const res = await axios.get(`http://localhost:5000/api/users/search?query=${query}`);
      
      if (res.data.success) {
        setUserData(res.data.user);
      }
    } catch (err) {
      setError(err.response?.data?.message || "User Not Found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h3>🔍 Find Business Account</h3>
          <button className="close-icon" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Enter Name or Email..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        <hr className="divider" />

        <div className="result-area">
          {error && <p className="error-text">{error}</p>}

          {userData ? (
            <div className="business-card">
              <div className="card-top">
                <img 
                  src={`http://localhost:5000${userData.userProfilePic}` || "https://cdn-icons-png.flaticon.com/512/149/149071.png"} 
                  alt="Profile" 
                />
                <div className="basic-info">
                  <h4>{userData.name}</h4>
                  <span className={`status-pill ${userData.accountType}`}>
                    {userData.accountType}
                  </span>
                </div>
              </div>

              <div className="card-details">
                <p><strong>📧 Email:</strong> {userData.email}</p>
                <p><strong>🏢 Business:</strong> {userData.businessName || "N/A"}</p>
                <p><strong>📍 Location:</strong> {userData.businessLocation || "N/A"}</p>
                <p><strong>📞 Contact:</strong> {userData.contact || "N/A"}</p>
              </div>
            </div>
          ) : (
            !loading && !error && <p className="placeholder-text">Enter details to see business information.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FindBusinessModal;