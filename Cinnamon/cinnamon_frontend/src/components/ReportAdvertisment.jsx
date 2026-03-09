import React, { useState } from "react";
import "./css/ReportModal.css";

export default function ReportModal({ isOpen, onClose, onSubmit }) {
  const [description, setDescription] = useState("");

  const handleSend = () => {
    if (description.trim() === "") {
      alert("Please enter a reason.");
      return;
    }
    onSubmit(description);
    setDescription(""); 
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>🚩 Report Advertisement</h2>
        <p>Help us understand what's wrong with this ad.</p>
        <textarea
          placeholder="Describe the issue (e.g. Inappropriate content, Scam, etc.)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="5"
        />
        <div className="modal-actions">
          <button className="cancel-btn" onClick={onClose}>Cancel</button>
          <button className="report-btn" onClick={handleSend}>Submit Report</button>
        </div>
      </div>
    </div>
  );
}