import React, { useState } from "react";
import axios from "axios";
import "./css/AddReport.css";

export default function AddReport() {
  const [reportedName, setReportedName] = useState(""); 
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const userData = localStorage.getItem("user");
  const loggedInUser = userData ? JSON.parse(userData) : null;
  const reportingUserEmail = loggedInUser ? loggedInUser.email : "Unknown";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reportData = {
      reportedAccountName: reportedName, 
      reportingUserEmail: reportingUserEmail, 
      reason,
      description
    };

    try {
      const res = await axios.post("http://localhost:5000/api/reports/add", reportData);
      if (res.data.success) {
        alert("Reported successfully!");
        setReportedName("");
        setReason("");
        setDescription("");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error submitting report");
    }
  };

  return (
    <div className="report-container">
      <div className="report-card">
        <h3>🚩 Report Account</h3>
        <form onSubmit={handleSubmit} className="report-form">
          
          <div className="form-group">
            <label>Reporting User (Your Email)</label>
            <input type="text" value={reportingUserEmail} disabled className="disabled-input" />
          </div>

          <div className="form-group">
            <label>Account Name to Report</label>
            <input 
              type="text" 
              placeholder="Enter account name"
              value={reportedName}
              onChange={(e) => setReportedName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label>Reason</label>
            <select value={reason} onChange={(e) => setReason(e.target.value)} required>
              <option value="">Select Reason</option>
              <option value="Spam">Spam</option>
              <option value="Fake">Fake Account</option>
              <option value="Abuse">Abuse</option>
            </select>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              placeholder="Describe the issue..."
              value={description}
              onChange={(e) => setDescription(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="submit-btn">Submit Report</button>
        </form>
      </div>
    </div>
  );
}