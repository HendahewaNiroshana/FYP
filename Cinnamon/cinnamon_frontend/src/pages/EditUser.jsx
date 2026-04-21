import React, { useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";
import "./css/EditUser.css";

export default function EditUser() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChangePasswordClick = () => {
  const userDataString = localStorage.getItem('user'); 

  if (userDataString) {
    try {
      const userData = JSON.parse(userDataString);

      const userEmail = userData.email;

      if (userEmail) {
        localStorage.setItem('resetEmail', userEmail);
        
        navigate('/reset-password');
      } else {
        alert("E-mail Not Found.");
      }

    } catch (error) {
      console.error("Error parsing user data:", error);
      alert("Error. Please Login again.");
      navigate('/login');
    }
  } else {
    alert("User data not found. Please Login again.");
    navigate('/login');
  }
};

  const [form, setForm] = useState({
    accountType: user?.accountType || "user",
    name: user?.name || "",
    email: user?.email || "",
    contact: user?.contact || "",
    address: user?.address || "",
    userProfilePic: user?.userProfilePic || "",
    businessName: user?.businessName || "",
    businessLocation: user?.businessLocation || "",
    businessContact: user?.businessContact || "",
    website: user?.website || "",
    link1: user?.link1 || "",
    link2: user?.link2 || "",
    link3: user?.link3 || "",
  });

  const [file, setFile] = useState(null);
  const [brFile, setBrFile] = useState(null); 
  const [preview, setPreview] = useState(null);
  const [showBusinessForm, setShowBusinessForm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    if (selectedFile) setPreview(URL.createObjectURL(selectedFile));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append("userProfilePic", file);

    try {
      const res = await fetch(`http://localhost:5000/api/auth/update/${user._id}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        alert("Profile updated successfully!");
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  const handleBusinessRequest = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("businessName", form.businessName);
    formData.append("businessLocation", form.businessLocation);
    formData.append("businessContact", form.businessContact);
    formData.append("website", form.website);
    formData.append("link1", form.link1);
    formData.append("link2", form.link2);
    formData.append("link3", form.link3);
    if (brFile) formData.append("businessBR", brFile);

    try {
      const res = await fetch(`http://localhost:5000/api/auth/request-business/${user._id}`, {
        method: "PUT",
        body: formData, 
      });
      const data = await res.json();
      if (data.success) {
        login(data.user);
        alert("Business request submitted with documents!");
        setShowBusinessForm(false);
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="edit-profile-wrapper">
      <div className="edit-card-premium">
        <header className="edit-header">
          <div className="header-top">
            <span className="account-tag">{user?.accountType} Account</span>
            <h2>Settings & <span>Profile</span></h2>
          </div>
          {user?.accountType === "pending" && (
            <div className="pending-alert">
              <span className="icon">⏳</span>
              <p>Admin request is pending. Your account currently works as a Normal User.</p>
            </div>
          )}
        </header>

        <div className="profile-layout">
          <div className="photo-section">
            <div className="image-preview-container">
              <img
                src={preview || `http://localhost:5000${user.userProfilePic}`}
                alt="Profile"
                className="profile-preview-img"
              />
              <label htmlFor="file-upload" className="upload-label">
                <span className="cam-icon">📷</span>
                <input id="file-upload" type="file" onChange={handleFileChange} accept="image/*" />
              </label>
            </div>
            <h3>{form.name}</h3>
            <p className="user-email-text">{form.email}</p>
          </div>

          <div className="details-section">
            <form onSubmit={handleUpdate} className="modern-edit-form">
              <div className="input-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange} required />
                </div>
              </div>
              <div className="input-row">
                <div className="input-group">
                  <label>Contact Number</label>
                  <input type="text" name="contact" value={form.contact} onChange={handleChange} required />
                </div>
                <div className="input-group">
                  <label>Address</label>
                  <input type="text" name="address" value={form.address} onChange={handleChange} required />
                </div>
              </div>

              <div className="settings-section">
              <p>Security Settings</p>
              <button 
                  onClick={handleChangePasswordClick} 
                  style={{ color: 'red', cursor: 'pointer', background: 'none', border: 'none', textDecoration: 'none' }}
              >
                Change Password?
              </button>
              </div>

              <button type="submit" className="btn-gold-save">Save Profile Changes</button>
            </form>

            <div className="divider"></div>

            {user?.accountType === "user" && (
              <div className="business-upgrade-area">
                {!showBusinessForm ? (
                  <div className="upgrade-prompt">
                    <h4>Do you want to sell products?</h4>
                    <button className="btn-outline-gold" onClick={() => setShowBusinessForm(true)}>
                      Switch to Business Account
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleBusinessRequest} className="business-request-form">
                    <h4>Register Your Business</h4>
                    <div className="input-row">
                      <div className="input-group">
                        <input type="text" name="businessName" value={form.businessName} onChange={handleChange} placeholder="Shop Name" required />
                      </div>
                      <div className="input-group">
                        <input type="text" name="businessContact" value={form.businessContact} onChange={handleChange} placeholder="Business Phone" required />
                      </div>
                    </div>
                    <div className="input-group">
                      <input type="text" name="businessLocation" value={form.businessLocation} onChange={handleChange} placeholder="Business Address" required />
                    </div>
                    <div className="input-group">
                      <input type="url" name="website" value={form.website} onChange={handleChange} placeholder="Website Link (Optional)" />
                    </div>
                    <div className="input-group">
                      <input type="text" name="link1" value={form.link1} onChange={handleChange} placeholder="Additional Link 1" />
                      <input type="text" name="link2" value={form.link2} onChange={handleChange} placeholder="Additional Link 2" />
                    </div>
                    
                    <div className="br-upload-group">
                      <label>Upload Business Registration (BR Copy)</label>
                      <input type="file" onChange={(e) => setBrFile(e.target.files[0])} accept="image/*" required />
                    </div>

                    <div className="btn-row">
                      <button type="submit" className="btn-gold-save">Submit Request</button>
                      <button type="button" className="btn-cancel" onClick={() => setShowBusinessForm(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}