import React, { useEffect, useState } from "react";
import axios from "axios";
import "./css/SellerOrders.css";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const userData = localStorage.getItem("user"); 
  const user = userData ? JSON.parse(userData) : null;
  const sellerId = user ? user._id : null;

  const fetchOrders = () => {
    if (!sellerId || sellerId === "undefined") {
      setLoading(false);
      return;
    }

    axios.get(`http://localhost:5000/api/orders/seller/${sellerId}`)
      .then((res) => {
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      })
      .catch((err) => console.error("Error:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [sellerId]);

  const updateStatus = async (orderId, newStatus) => {
    if (!newStatus) return;
    try {
      const res = await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { 
        status: newStatus 
      });
      if (res.data.success) {
        fetchOrders(); 
      }
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  if (loading) return (
    <div className="order-loader">
      <div className="spinner-gold"></div>
      <p>Fetching your orders...</p>
    </div>
  );

  return (
    <div className="seller-orders-wrapper">
      <header className="orders-header-premium">
        <div className="header-text">
          <span className="order-badge">Sales Manager</span>
          <h2>📦 Incoming <span>Orders</span></h2>
          <p>Managing orders for <b>{user?.businessName || "Cinnamon Bridge Partner"}</b></p>
        </div>
        <div className="stats-mini">
          <div className="stat-box">
            <span className="stat-label">Total Orders</span>
            <span className="stat-count">{orders.length}</span>
          </div>
        </div>
      </header>
      
      {orders.length === 0 ? (
        <div className="empty-orders-card">
          <div className="empty-icon">📂</div>
          <h3>No Orders Yet</h3>
          <p>When customers buy your products, they will appear here.</p>
        </div>
      ) : (
        <div className="premium-table-container">
          <table className="orders-modern-table">
            <thead>
              <tr>
                <th>Customer Details</th>
                <th>Total Revenue</th>
                <th>Current Status</th>
                <th>Manage Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td className="customer-cell">
                    <div className="cust-avatar">{order.userId?.name?.charAt(0)}</div>
                    <div>
                      <span className="cust-name">{order.userId?.name}</span>
                      <span className="cust-phone">{order.phone}</span>
                    </div>
                  </td>
                  
                  <td className="revenue-cell">
                    LKR {order.totalPrice?.toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-pill-modern ${order.status.replace(/\s+/g, '')}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      className="premium-status-dropdown"
                      value={order.status}
                      onChange={(e) => updateStatus(order._id, e.target.value)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Packed">Packed</option>
                      <option value="On Delivery">On Delivery</option>
                      <option value="Delivered">Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}