import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import "./css/MyOrders.css";

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/orders/userget/${user._id}`);
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Error fetching my orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  if (loading) return <div className="loader-center">Loading your orders...</div>;

  return (
    <div className="my-orders-wrapper">
      <div className="orders-header">
        <h2>My <span>Orders</span> History</h2>
        <p>Track your purchases and delivery status</p>
      </div>

      {orders.length === 0 ? (
        <div className="empty-cart-msg">
          <div className="empty-icon">🛍️</div>
          <h3>No orders found.</h3>
          <p>It looks like you haven't placed any orders yet.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card-premium">
              <div className="order-card-header">
                <span className="order-id">ID: #{order._id.slice(-6)}</span>
                <span className={`status-badge ${order.status.replace(/\s+/g, '')}`}>
                  {order.status}
                </span>
              </div>

              <div className="order-item-detail">
                <img 
                  src={`https://cdn-icons-png.flaticon.com/512/1356/1356594.png`} 
                  alt="icon" 
                  className="order-prod-img" 
                />
                <div className="order-prod-info">
                  <h4>{order.productId?.title || "Product Removed"}</h4>
                  <p>Qty: {order.quantity}</p>
                  <p className="order-price">LKR {order.totalPrice.toLocaleString()}</p>
                </div>
              </div>

              <div className="order-card-footer">
                <div className="footer-info">
                  <small>Payment: <b>{order.paymentType}</b></small>
                  <small>Date: {new Date(order.createdAt).toLocaleDateString()}</small>
                </div>
                {order.status === "Delivered" && (
                   <button className="review-btn">Write a Review</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}