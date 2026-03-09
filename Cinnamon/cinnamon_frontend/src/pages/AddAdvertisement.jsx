import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import "./css/Advertisement.css";

export default function AddAdvertisement() {
  const { user } = useContext(AuthContext);
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", image: null });
  const [newAdId, setNewAdId] = useState(null);

  useEffect(() => {
    if (user) {
      fetch(`http://localhost:5000/api/ads/user/${user._id}`)
        .then((res) => res.json())
        .then((data) => setAds(data));
    }
  }, [user]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("userId", user._id);
    if (form.image) formData.append("image", form.image);

    try {
      const res = await fetch("http://localhost:5000/api/ads", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setAds((prev) => [...prev, data.ad]);
        setNewAdId(data.ad._id);
        setForm({ title: "", description: "", image: null });
        document.querySelector('input[name="image"]').value = "";
        setTimeout(() => setNewAdId(null), 1200);
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  if (!user) return <div className="not-login-box"><p className="not-login">Please login to manage advertisements.</p></div>;

  return (
    <div className="add-ad-container">
      <div className="form-section">
        <h1 className="main-title">Create New Advertisement</h1>
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="input-group">
            <label>Advertisement Title</label>
            <input type="text" name="title" placeholder="e.g. Special Summer Sale" value={form.title} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label>Description</label>
            <textarea name="description" placeholder="Write something catchy..." value={form.description} onChange={handleChange} required />
          </div>
          <div className="input-group">
            <label className="file-label">Upload Image</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="file-input-field" />
          </div>
          <button type="submit" className="submit-btn">Publish Advertisement</button>
        </form>
      </div>

      <hr className="divider" />

      <h2 className="sub-title">Your Current Advertisements</h2>
      <div className="add-grid">
        {ads.map((ad) => (
          <div key={ad._id} className={`add-card ${ad._id === newAdId ? "new-card-pop" : "slide-up"}`}>
            <div className="add-img-box">
              {ad.imageUrl && <img src={`http://localhost:5000${ad.imageUrl}`} alt={ad.title} />}
            </div>
            <div className="add-card-content">
              <div className="add-info-top">
                <h2 className="add-card-h2">{ad.title}</h2>
                <p className="add-card-p">{ad.description.substring(0, 80)}...</p>
              </div>
              <div className="add-action-area">
                <Link to={`/edit-advertisement/${ad._id}`} className="edit-btn-link">
                  <button className="edit-btn-modern">Edit Advertisement</button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}