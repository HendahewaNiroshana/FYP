import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/adminreport.css";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0 });

  useEffect(() => { fetchReports(); }, []);

  const fetchReports = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/all");
      setReports(res.data.reports);
      setStats({
        total: res.data.reports.length,
        pending: res.data.reports.filter(r => r.status === 'unread').length
      });
    } catch (err) {
      console.error("Error fetching reports", err);
    }
  };

  const handleSuspend = async (userId) => {
    if (window.confirm("Are you sure you want to suspend this account? This action cannot be undone easily.")) {
      const res = await axios.put(`http://localhost:5000/api/reports/suspend/${userId}`);
      if (res.data.success) {
        alert("Account Suspended!");
        fetchReports();
      }
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:5000/api/reports/status/${id}`, { status });
    fetchReports();
  };

  return (
    <div className="admin-reports">
      <div className="admin-header">
        <div className="header-title">
          <h2>User Reports Management</h2>
          <p>Review and act on flagged business accounts</p>
        </div>
        <div className="stats-container">
          <div className="stat-card">
            <span>Total Reports</span>
            <strong>{stats.total}</strong>
          </div>
          <div className="stat-card pending">
            <span>Unread</span>
            <strong>{stats.pending}</strong>
          </div>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="modern-report-table">
          <thead>
            <tr>
              <th>Flagged Account</th>
              <th>Reason for Report</th>
              <th>Review Status</th>
              <th className="text-center">Security Action</th>
            </tr>
          </thead>
          <tbody>
            {reports.map(r => (
              <tr key={r._id}>
                <td className="account-cell" onClick={() => alert(`Email: ${r.reportedAccount?.email}`)}>
                  <div className="account-info">
                    <span className="name">{r.reportedAccount?.name || "Unknown User"}</span>
                    <span className="email-sub">{r.reportedAccount?.email}</span>
                  </div>
                </td>
                <td>
                  <span className={`reason-pill ${r.reason.toLowerCase().replace(/\s/g, '-')}`}>
                    {r.reason}
                  </span>
                </td>
                <td>
                  <select 
                    className={`status-dropdown ${r.status}`}
                    value={r.status} 
                    onChange={(e) => updateStatus(r._id, e.target.value)}
                  >
                    <option value="unread">⏳ Unread</option>
                    <option value="accept">✅ Accepted</option>
                    <option value="reject">❌ Rejected</option>
                  </select>
                </td>
                <td className="text-center">
                  <button 
                    className="suspend-btn"
                    onClick={() => handleSuspend(r.reportedAccount?._id)}
                  >
                    🚫 Suspend
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}