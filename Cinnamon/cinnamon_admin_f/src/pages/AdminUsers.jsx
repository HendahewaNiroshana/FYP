import React, { useEffect, useState } from "react";
import "./css/AdminUsers.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    username: "", gmail: "", contact: "", address: "", about: "", password: "", accountType: "admin"
  });
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = () => {
    fetch("http://localhost:5000/api/admin-users")
      .then((res) => res.json())
      .then((data) => { if (data.success) setUsers(data.users); });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(form).forEach((key) => formData.append(key, form[key]));
    if (file) formData.append("profilePic", file);

    const url = editingId && editingId !== 'new'
      ? `http://localhost:5000/api/admin-users/${editingId}` 
      : "http://localhost:5000/api/admin-users";
    
    const method = editingId && editingId !== 'new' ? "PUT" : "POST";

    const res = await fetch(url, { method, body: formData });
    const data = await res.json();
    
    if (data.success) {
      fetchUsers();
      closePanel();
    }
  };

  const openEdit = (user) => {
    setEditingId(user._id);
    setForm({ ...user, password: "" });
    setIsPanelOpen(true);
  };

  const closePanel = () => {
    setForm({ username: "", gmail: "", contact: "", address: "", about: "", password: "", accountType: "admin" });
    setFile(null);
    setEditingId(null);
    setIsPanelOpen(false);
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this admin?")) {
      await fetch(`http://localhost:5000/api/admin-users/${id}`, { method: "DELETE" });
      setUsers(users.filter((u) => u._id !== id));
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-main-content">
        <header className="admin-page-header">
          <div className="header-left">
            <h2>🛡️ Admin <span>Management</span></h2>
            <p>Manage system roles and administrator access levels</p>
          </div>
          <button className="primary-action-btn" onClick={() => { setEditingId('new'); setIsPanelOpen(true); }}>
            + Create New Admin
          </button>
        </header>

        <div className="content-card">
          <table className="modern-admin-table">
            <thead>
              <tr>
                <th>Administrator</th>
                <th>Access Level</th>
                <th>Contact</th>
                <th>Address</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id}>
                  <td className="user-profile-td">
                    <img src={`http://localhost:5000${u.profilePic}`} alt="" className="table-avatar" />
                    <div className="user-details">
                      <span className="user-name">{u.username}</span>
                      <span className="user-email">{u.gmail}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`role-badge ${u.accountType}`}>{u.accountType}</span>
                  </td>
                  <td className="contact-td">
                    <span>{u.contact}</span>
                  </td>
                  <td className="contact-td">
                    <span>{u.address}</span>
                  </td>
                  <td><span className="status-dot">Active</span></td>
                  <td className="text-right actions-td">
                    <button className="action-btn edit" onClick={() => openEdit(u)}>✏️</button>
                    <button className="action-btn delete" onClick={() => deleteUser(u._id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={`side-panel-overlay ${isPanelOpen ? 'open' : ''}`} onClick={closePanel}>
        <div className="side-panel-content" onClick={e => e.stopPropagation()}>
          <h3>{editingId === 'new' ? 'New Admin Account' : 'Edit Admin Details'}</h3>
          <form className="side-panel-form" onSubmit={handleSubmit}>
            <div className="form-section">
              <label>Full Name</label>
              <input type="text" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
            </div>
            <div className="form-section">
              <label>Email Address</label>
              <input type="email" value={form.gmail} onChange={e => setForm({...form, gmail: e.target.value})} required />
            </div>
            <div className="form-section">
              <label>Access Role</label>
              <select value={form.accountType} onChange={e => setForm({...form, accountType: e.target.value})}>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </div>
            <div className="form-section">
              <label>Contact Number</label>
              <input type="text" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
            </div>
            <div className="form-section">
              <label>Profile Picture</label>
              <input type="file" onChange={e => setFile(e.target.files[0])} />
            </div>
            <div className="form-section">
              <label>Security Password</label>
              <input type="password" placeholder="••••••••" onChange={e => setForm({...form, password: e.target.value})} />
            </div>
            
            <div className="panel-footer">
              <button type="button" className="btn-secondary" onClick={closePanel}>Cancel</button>
              <button type="submit" className="btn-primary">Save Changes</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}