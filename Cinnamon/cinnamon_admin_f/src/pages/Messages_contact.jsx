import React, { useEffect, useState } from "react";
import "./css/Contact.css";

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [replies, setReplies] = useState({});
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/api/contact/all")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setMessages(data.messages);
      })
      .catch(console.error);
  }, []);

  const handleReplyChange = (id, value) => {
    setReplies({ ...replies, [id]: value });
  };

  const handleReplySubmit = async (id) => {
    if (!replies[id]) return alert("Please enter a reply");

    try {
      const res = await fetch(`http://localhost:5000/api/contact/reply/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reply: replies[id] }),
      });
      const data = await res.json();

      if (data.success) {
        setReplies({ ...replies, [id]: "" });
        setMessages((prev) =>
          prev.map((m) => (m._id === id ? { ...m, replied: true } : m))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages.filter(m => 
    filter === "all" ? true : filter === "replied" ? m.replied : !m.replied
  );

  return (
    <div className="admin-inbox-container">
      <div className="inbox-header">
        <div>
          <h2>📬 Message <span>Center</span> </h2>
          <p>Customer inquiries and business support</p>
        </div>
        <div className="filter-tabs">
          <button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>All</button>
          <button className={filter === "pending" ? "active" : ""} onClick={() => setFilter("pending")}>Pending</button>
          <button className={filter === "replied" ? "active" : ""} onClick={() => setFilter("replied")}>Replied</button>
        </div>
      </div>

      <div className="table-card">
        <table className="modern-messages-table">
          <thead>
            <tr>
              <th>User Details</th>
              <th>Inquiry Message</th>
              <th>Admin Response</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredMessages.map((msg) => (
              <tr key={msg._id} className={msg.replied ? "row-replied" : "row-pending"}>
                <td className="user-col">
                  <strong>{msg.userId?.name || "Guest"}</strong>
                  <span className={`type-tag ${msg.userId?.accountType}`}>
                    {msg.userId?.accountType || "User"}
                  </span>
                </td>
                <td className="message-text">
                  <div className="msg-bubble">{msg.message}</div>
                </td>
                <td className="reply-col">
                  {msg.replied ? (
                    <div className="status-badge success">✅ Sent to User</div>
                  ) : (
                    <textarea
                      value={replies[msg._id] || ""}
                      onChange={(e) => handleReplyChange(msg._id, e.target.value)}
                      placeholder="Type your official reply..."
                    />
                  )}
                </td>
                <td className="action-col">
                  {!msg.replied ? (
                    <button className="send-btn" onClick={() => handleReplySubmit(msg._id)}>
                      Reply
                    </button>
                  ) : (
                    <span className="date-replied">Completed</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMessages.length === 0 && (
          <div className="empty-state">No messages found in this category.</div>
        )}
      </div>
    </div>
  );
}