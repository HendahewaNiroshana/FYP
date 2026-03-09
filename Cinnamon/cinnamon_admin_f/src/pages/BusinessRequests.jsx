import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./css/BusinessRequests.css";

export default function BusinessRequests() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [processingId, setProcessingId] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/users/pending")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setPendingUsers(data.users);
      })
      .catch((err) => console.error("Error fetching pending users:", err));
  }, []);

  const approveUser = async (id) => {
    setProcessingId(id); 
    try {
      const res = await fetch(`http://localhost:5000/api/users/approve/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        
      });

      const data = await res.json();

      if (data.success) {
        setPendingUsers((prev) => prev.filter((u) => u._id !== id));
        
        fetch("http://localhost:5000/api/email/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: data.user?.email,
            subject: "Business Account Approved ✅",
            message: `Hello ${data.user?.name || "User"},\n\nYour account is approved!`,
          }),
        }).catch(e => console.error("Email failed", e));
      }
    } catch (err) {
      console.error("Error approving user:", err);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="requests-container">
      <header className="requests-header">
        <h1>Business Requests</h1>
        <span className="count-badge">{pendingUsers.length} Pending</span>
      </header>

      <div className="table-wrapper">
        <table className="modern-table">
          <thead>
            <tr>
              <th>Business Info</th>
              <th>Contact Details</th>
              <th>Location</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingUsers.length > 0 ? (
              pendingUsers.map((user) => (
                <tr key={user._id}>
                  <td>
                    <div className="user-info">
                      <div className="user-avatar">{user.name?.charAt(0) || "B"}</div>
                      <div>
                        <p className="user-name">{user.name || "Unnamed Business"}</p>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className="user-contact">{user.contact || "N/A"}</p>
                  </td>
                  <td>
                    <p className="user-address">{user.address || "No address provided"}</p>
                  </td>
                  <td className="text-right">
                    <div className="action-group">
                      <button
                        className="btn-view"
                        onClick={() => navigate(`/profile/${user._id}`)}
                      >
                        Details
                      </button>
                      <button
                        className={`btn-approve ${processingId === user._id ? 'loading' : ''}`}
                        onClick={() => approveUser(user._id)}
                        disabled={processingId === user._id}
                      >
                        {processingId === user._id ? "..." : "Approve"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="empty-state">
                  🎉 All caught up! No pending requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}