import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaUserFriends, FaStore, FaFileInvoice, FaSearch, FaBan, FaEye, FaTimes } from "react-icons/fa";
import "./css/Accounts.css";
import SearchUserModal from "../Component/SearchUser";

export default function Accounts() {
  const [counts, setCounts] = useState({ userCount: 0, businessCount: 0 });
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Profile Popup State
  const [selectedUser, setSelectedUser] = useState(null);
  const [showProfilePopup, setShowProfilePopup] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("http://localhost:5000/api/users/counts")
      .then((res) => res.json())
      .then((data) => setCounts(data))
      .catch((err) => console.error(err));

    fetch("http://localhost:5000/api/users/all")
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error(err));
  };

  const openProfile = (user) => {
    setSelectedUser(user);
    setShowProfilePopup(true);
  };

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/users/approve/${id}`, {
        method: "PUT",
      });
      const data = await res.json();
      if (data.success) {
        alert("Account Approved!");
        setShowProfilePopup(false);
        fetchData(); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="accounts-wrapper">
      <header className="accounts-header">
        <div>
          <h1>Accounts <span>Overview</span></h1>
          <p>Manage and monitor all platform participants in one place.</p>
        </div>
      </header>

      <div className="stats-grid">
        <motion.div whileHover={{ y: -5 }} className="stat-card-glass blue">
          <div className="stat-icon"><FaUserFriends /></div>
          <div className="stat-text">
            <h3>Total Users</h3>
            <h2>{counts.userCount}</h2>
          </div>
        </motion.div>
        
        <motion.div whileHover={{ y: -5 }} className="stat-card-glass green">
          <div className="stat-icon"><FaStore /></div>
          <div className="stat-text">
            <h3>Businesses</h3>
            <h2>{counts.businessCount}</h2>
          </div>
        </motion.div>
      </div>

      <div className="action-bar">
        <button className="action-btn req" onClick={() => navigate("/business-requests")}>
          <FaFileInvoice /> Business Requests
        </button>
        <button className="action-btn search" onClick={() => setIsModalOpen(true)}>
          <FaSearch /> Find Accounts
        </button>
        <button className="action-btn ban" onClick={() => navigate("/viewreport")}>
          <FaBan /> Ban Reports
        </button>
      </div>

      <SearchUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Table Section */}
      <div className="table-container-glass">
        <div className="table-header">
          <h2>All Registered Users</h2>
          <span>Showing {users.length} Records</span>
        </div>
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Profile</th>
                <th>Name</th>
                <th>Email Address</th>
                <th>Contact</th>
                <th>Account Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="table-avatar">
                      {u.userProfilePic ? (
                         <img src={`http://localhost:5000${u.userProfilePic}`} alt="" className="mini-avatar" />
                      ) : (
                        u.name?.charAt(0) || u.businessName?.charAt(0)
                      )}
                    </div>
                  </td>
                  <td className="bold-text">{u.name || u.businessName}</td>
                  <td>{u.email}</td>
                  <td>{u.contact || "N/A"}</td>
                  <td>
                    <span className={`badge ${u.accountType}`}>
                      {u.accountType}
                    </span>
                  </td>
                  <td>
                    <button className="view-link" onClick={() => openProfile(u)}>
                      <FaEye /> View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Profile Quick View Modal --- */}
      <AnimatePresence>
        {showProfilePopup && selectedUser && (
          <div className="modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="quick-profile-card"
            >
              <button className="close-popup" onClick={() => setShowProfilePopup(false)}><FaTimes /></button>
              
              <div className="popup-header">
                <img src={`http://localhost:5000${selectedUser.userProfilePic}`} alt="" className="popup-avatar" />
                <h2>{selectedUser.name}</h2>
                <p>{selectedUser.email}</p>
                <span className={`badge ${selectedUser.accountType}`}>{selectedUser.accountType}</span>
              </div>

              <div className="popup-body">
                <div className="info-row"><span>Contact:</span> <strong>{selectedUser.contact}</strong></div>
                <div className="info-row"><span>Address:</span> <strong>{selectedUser.address}</strong></div>
                
                {selectedUser.businessName && (
                  <div className="business-box">
                    <h4>Business Info</h4>
                    <p><strong>Shop:</strong> {selectedUser.businessName}</p>
                    <p><strong>Location:</strong> {selectedUser.businessLocation}</p>
                  </div>
                )}
              </div>

              <div className="popup-footer">
                {selectedUser.accountType === "pending" && (
                  <button className="approve-btn" onClick={() => handleApprove(selectedUser._id)}>Approve Now</button>
                )}
                <button className="full-view-btn" onClick={() => navigate(`/profile/${selectedUser._id}`)}>Go to Full Profile</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}