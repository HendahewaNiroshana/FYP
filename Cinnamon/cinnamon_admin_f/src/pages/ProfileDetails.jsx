import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./css/ProfileDetails.css";

export default function ProfileDetails() {
  const { id } = useParams(); 
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:5000/api/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .catch((err) => console.error("Error fetching user details:", err));
  }, [id]);

  const updateAccountType = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/approve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        alert("Account type updated successfully!");
        setUser((prev) => ({ ...prev, accountType: "business" }));

        await fetch("http://localhost:5000/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: user.email,
            subject: "Your Business Account Approval",
            message: `Hello ${user.name},\n\nYour account has been approved as a Business account. You can now enjoy all the business features on our platform.\n\nThank you,\nSupport Team`,
          }),
        });
      }
    } catch (err) {
      console.error("Error updating account type:", err);
    }
  };

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">Profile & Business Review</h1>

      <div className="profile-info">
        {/* Header Section */}
        <div className="profile-header">
          <img
            src={`http://localhost:5000${user.userProfilePic}`}
            alt={user.name}
            className="profile-img"
          />
          <div>
            <h2>{user.name}</h2>
            <p className="email">{user.email}</p>
            <span className={`status-badge ${user.accountType}`}>
              {user.accountType.toUpperCase()}
            </span>
          </div>
        </div>

        <div className="profile-grid">
          {/* Personal Details */}
          <div className="details-card">
            <h3>Personal Information</h3>
            <p><strong>Contact:</strong> {user.contact || "N/A"}</p>
            <p><strong>Address:</strong> {user.address || "N/A"}</p>
          </div>

          {/* Business Details (If available) */}
          {user.businessName && (
            <div className="details-card business-highlight">
              <h3>Business Information</h3>
              <p><strong>Shop Name:</strong> {user.businessName}</p>
              <p><strong>Business Contact:</strong> {user.businessContact || "N/A"}</p>
              <p><strong>Location:</strong> {user.businessLocation}</p>
              <p>
                <strong>Website:</strong>{" "}
                {user.website ? (
                  <a href={user.website} target="_blank" rel="noreferrer" className="weblink">Visit Site</a>
                ) : "N/A"}
              </p>
              
              <div className="links-section">
                <strong>Social/Additional Links:</strong>
                <ul>
                  {user.link1 && <li><a href={user.link1} target="_blank" rel="noreferrer" className="weblink">{user.link1}</a></li>}
                  {user.link2 && <li><a href={user.link2} target="_blank" rel="noreferrer" className="weblink">{user.link2}</a></li>}
                  {user.link3 && <li><a href={user.link3} target="_blank" rel="noreferrer" className="weblink">{user.link3}</a></li>}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Business Document (BR) Section */}
        {user.businessBR && (
          <div className="br-document-section">
            <h3>Business Registration (BR Copy)</h3>
            <div className="br-preview-box">
              <img 
                src={`http://localhost:5000${user.businessBR}`} 
                alt="Business Registration" 
                className="br-img-preview"
              />
              <a 
                href={`http://localhost:5000${user.businessBR}`} 
                target="_blank" 
                rel="noreferrer" 
                className="view-doc-btn"
              >
                View Full Document 📄
              </a>
            </div>
          </div>
        )}

        <div className="profile-actions">
          {user.accountType === "pending" && (
            <button className="approve-btn" onClick={updateAccountType}>
              Confirm & Approve Business
            </button>
          )}
        </div>
      </div>
    </div>
  );
}