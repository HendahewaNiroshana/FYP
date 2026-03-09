import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import "./css/Notifications.css";

export default function Notifications() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/notifications/${user._id}`);
        const data = await res.json();
        if (data.success) setNotifications(data.notifications);
      } catch (err) {
        console.error(err);
      }
    };
    if (user) fetchNotifications();
  }, [user]);

  return (
    <div className="notif-page-wrapper">
      <div className="notif-header-section">
        <span className="notif-badge-top">Activity Hub</span>
        <h2>System <span>Notifications</span> 🔔</h2>
        <p>Stay updated with your latest business activities</p>
      </div>

      <div className="notif-content-area">
        {notifications.length > 0 ? (
          <div className="notif-list-modern">
            {notifications.map((n, index) => (
              <motion.div
                key={n._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`notif-card-premium ${n.flag ? "is-read" : "is-unread"}`}
                onClick={() => setSelected(n)}
              >
                <div className="notif-status-dot"></div>
                <div className="notif-icon-box">
                  <img src={n.icon || "/default_icon.png"} alt="icon" />
                </div>
                <div className="notif-text-box">
                  <div className="notif-top-row">
                    <h4>{n.title}</h4>
                    <span className="notif-time">{new Date(n.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p>{n.description}</p>
                </div>
                <div className="notif-arrow">❯</div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="empty-notif">
            <div className="empty-icon-ring">🔕</div>
            <h3>All caught up!</h3>
            <p>No new notifications at the moment.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div 
            className="notif-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div 
              className="notif-modal-premium"
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button className="close-notif-btn" onClick={() => setSelected(null)}>×</button>
              <div className="modal-icon-header">
                <img src={selected.icon || "/default_icon.png"} alt="icon" />
              </div>
              <h3>{selected.title}</h3>
              <div className="modal-date">{new Date(selected.createdAt).toLocaleString()}</div>
              <div className="modal-body-text">
                <p>{selected.description}</p>
              </div>
              <button className="notif-action-btn" onClick={() => setSelected(null)}>Understood</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}