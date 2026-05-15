import React, { useState, useEffect } from "react";
import axios from "axios";
import "./css/EditProfile.css";

export default function EditProfile() {
  const [formData, setFormData] = useState({
    username: "",
    contact: "",
    address: "",
    about: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const rawData = localStorage.getItem("user");
    if (rawData) {
      const adminData = JSON.parse(rawData);
      setFormData({
        username: adminData.username || "",
        contact: adminData.contact || "",
        address: adminData.address || "",
        about: adminData.about || "",
        password: "", 
      });
      if (adminData.profilePic) {
        setPreview(`http://localhost:5000${adminData.profilePic}`);
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const rawData = localStorage.getItem("adminUser");
    if (!rawData) {
      alert("Session expired. Please login again.");
      return;
    }

    const adminData = JSON.parse(rawData);
    const adminId = adminData.id || adminData._id;

    if (!adminId) {
      alert("Admin ID not found in local storage.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    data.append("username", formData.username);
    data.append("contact", formData.contact);
    data.append("address", formData.address);
    data.append("about", formData.about);
    if (formData.password) data.append("password", formData.password);
    if (profilePic) data.append("profilePic", profilePic);

    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin-users/edit-profile/${adminId}`, 
        data
      );

      if (res.data.success) {
        alert("✅ Profile Updated Successfully!");
        
        const updatedAdmin = { 
          ...res.data.user, 
          id: res.data.user._id, 
          token: adminData.token 
        };
        localStorage.setItem("adminUser", JSON.stringify(updatedAdmin));
        
        window.location.reload(); 
      }
    } catch (err) {
      console.error(err);
      alert("❌ Update Failed: " + (err.response?.data?.message || "Server Error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-container">
      <div className="edit-profile-card">
        <div className="card-header-gold">
          <h2>⚙️ Admin Profile Settings</h2>
          <p>Update your personal information and profile picture</p>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="profile-preview-section">
            <div className="image-wrapper">
              <img 
                src={preview || "https://via.placeholder.com/150"} 
                alt="Profile" 
                className="profile-image-preview" 
              />
              <label className="upload-icon-label">
                📷
                <input type="file" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
            <p className="account-type-badge">
              {localStorage.getItem("adminUser") ? JSON.parse(localStorage.getItem("adminUser")).accountType : "Admin"}
            </p>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="username" value={formData.username} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Contact Number</label>
              <input type="text" name="contact" value={formData.contact} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea name="address" value={formData.address} onChange={handleChange} rows="2" />
            </div>

            <div className="form-group full-width">
              <label>About Bio</label>
              <textarea name="about" value={formData.about} onChange={handleChange} rows="3" />
            </div>

            <div className="form-group full-width">
              <label>Change Password (Optional)</label>
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="Leave blank to keep current password" 
              />
            </div>
          </div>

          <button type="submit" className="update-btn" disabled={loading}>
            {loading ? "Updating..." : "Save All Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}