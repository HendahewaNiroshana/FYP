import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./css/Advertisement.css";

export default function Advertisement() {
  const { user } = useContext(AuthContext); 
  const [ads, setAds] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/ads")
      .then((res) => res.json())
      .then((data) => setAds(data))
      .catch((err) => console.error("Error fetching ads:", err));
  }, []);

  return (
    <div className="add-container">
      <header className="add-header">
        <h1 className="add-title">Latest Advertisements</h1>
        {user && (
          <Link to="/add-advertisement" className="add-main-btn">
            <span>➕</span> Add Advertisement
          </Link>
        )}
      </header>

      <div className="add-grid">
        {ads.map((ad) => (
          <div key={ad._id} className="add-card fade-in">
            <div className="add-img-box">
              <img src={`http://localhost:5000${ad.imageUrl}`} alt={ad.title} />
            </div>

            <div className="add-card-content">
              <div className="add-info-top">
                <h2 className="add-card-h2">{ad.title}</h2>
                <p className="add-card-p">{ad.description.substring(0, 80)}...</p>
              </div>
              
              <div className="add-action-area">
                <Link to={`/view-advertisement/${ad._id}`}>
                  <button className="read-btn">View Advertisement</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}