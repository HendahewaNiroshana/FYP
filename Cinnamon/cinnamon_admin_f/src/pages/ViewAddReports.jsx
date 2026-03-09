import React, { useEffect, useState } from "react";
import "./css/AdminReports.css";

export default function AddReports() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    const res = await fetch("http://localhost:5000/api/adsreport/reports/all");
    const data = await res.json();
    if (data.success) setReports(data.reports);
  };

  const deleteAd = async (adId) => {
    if (window.confirm("Are you sure you want to delete this advertisement?")) {
      const res = await fetch(`http://localhost:5000/api/ads/${adId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        alert("Advertisement deleted successfully!");
        fetchReports(); 
      } else {
        alert(data.message);
      }
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-main-content">
        <header className="admin-page-header">
          <div className="header-left">
            <h2>🚨 Reported <span>Content</span></h2>
            <p>Review and moderate advertisements reported by users</p>
          </div>
          <div className="report-count-badge">
            {reports.length} Reports Found
          </div>
        </header>

        <div className="content-card">
          <table className="modern-admin-table">
            <thead>
              <tr>
                <th>Ad Preview</th>
                <th>Ad Title</th>
                <th>Reported By</th>
                <th>Reason</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report._id}>
                  <td className="ad-preview-td">
                    {report.adId ? (
                      <img src={`http://localhost:5000${report.adId.imageUrl}`} alt="Ad" className="ad-thumbnail" />
                    ) : (
                      <span className="status-badge danger">Deleted</span>
                    )}
                  </td>
                  <td className="ad-title-td">
                    <strong>{report.adId ? report.adId.title : "N/A"}</strong>
                  </td>
                  <td className="reporter-td">
                    <div className="user-info">
                      <span>{report.userId?.name}</span>
                      <small>{report.userId?.email}</small>
                    </div>
                  </td>
                  <td className="reason-td">
                    <div className="reason-bubble">{report.description}</div>
                  </td>
                  <td className="text-right">
                    {report.adId && (
                      <button className="delete-action-btn" onClick={() => deleteAd(report.adId._id)}>
                        🗑️ Remove Ad
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && (
            <div className="empty-state">All clear! No pending reports.</div>
          )}
        </div>
      </div>
    </div>
  );
}