import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./css/Advertisement.css";

export default function EditAdvertisement() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: null,
  });

  useEffect(() => {
    fetch(`http://localhost:5000/api/ads/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({ title: data.title, description: data.description, image: null });
      });
  }, [id]);

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
    if (form.image) formData.append("image", form.image);

    const res = await fetch(`http://localhost:5000/api/ads/${id}`, {
      method: "PUT",
      body: formData,
    });

    const data = await res.json();
    if (data.success) {
      alert("Advertisement updated successfully!");
      navigate("/add-advertisement"); 
    } else {
      alert(data.message);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this advertisement?")) return;

    const res = await fetch(`http://localhost:5000/api/ads/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    if (data.success) {
      alert("Advertisement deleted!");
      navigate("/add-advertisement"); 
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="add-ad-container fade-in">
      <div className="form-section">
        <h1 className="main-title">Edit Your Advertisement</h1>
        <p className="sub-text">Update the details of your advertisement below.</p>
        
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="input-group">
            <label>Advertisement Title</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter title"
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              required
            />
          </div>

          <div className="input-group">
            <label className="file-label">Change Image (Optional)</label>
            <input type="file" name="image" accept="image/*" onChange={handleChange} className="file-input-field" />
          </div>

          <div className="edit-action-btns">
            <button type="submit" className="update-btn">Save Changes</button>
            <button type="button" className="delete-btn-modern" onClick={handleDelete}>
              Delete Advertisement
            </button>
          </div>
          
          <button type="button" className="back-btn" onClick={() => navigate(-1)}>
            Cancel & Go Back
          </button>
        </form>
      </div>
    </div>
  );
}