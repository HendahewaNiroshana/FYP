import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import "./css/Navbar.css";

import ProfileDrawer from "../components/ProfileDrawer";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const [showProfile, setShowProfile] = useState(false);
  const { user } = useContext(AuthContext);

  const [lastScrollY, setLastScrollY] = useState(0);
  const [navVisible, setNavVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setNavVisible(false); 
      } else {
        setNavVisible(true); 
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <nav className={`navbar ${navVisible ? "show" : "hide"}`}>
      <h1 className="title">Cinnamon Bridge</h1>
        <ul className="nav-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/products">Products</Link></li>
          <li><Link to="/advertisement">Advertisement</Link></li>
          {user?.accountType === "business" && (
            <li><Link to="/businesstool">Business Tools</Link></li>
          )}
          <li><Link to="/services">Services</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/contact">Contact</Link></li>
          <li><Link to="/chatbot">AI Support</Link></li>
        </ul>

        <div className="profile-btn">
          <button onClick={() => setShowProfile(true)}>
            {user && user.userProfilePic ? (
              <img
                src={`http://localhost:5000${user.userProfilePic}`}
                alt="Profile"
                className="nav-profile-img"
              />
            ) : (
              "👤"
            )}
          </button>
        </div>
      </nav>

      {/* Profile Drawer */}
      <ProfileDrawer
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
}
