import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronDown, FaCalendarAlt, FaFileInvoiceDollar } from "react-icons/fa";
import "./css/SalesReport.css";

export default function SalesReport() {
  const { user } = useContext(AuthContext);
  const [reports, setReports] = useState([]);
  const [expandedMonth, setExpandedMonth] = useState(null);
  const [loading, setLoading] = useState(true);

  const monthNames = ["January", "February", "March", "April", "May", "June", 
                      "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    const fetchReports = async () => {
      if (!user?._id) return;
      try {
        const res = await axios.get(`http://localhost:5000/api/sale-reports/seller-detailed-report/${user._id}`);
        if (res.data.success) setReports(res.data.report);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [user]);

  const toggleMonth = (id) => {
    setExpandedMonth(expandedMonth === id ? null : id);
  };

  if (loading) return <div className="sr-loader">Generating Reports...</div>;

  return (
    <div className="sr-container">
      <header className="sr-header">
        <FaFileInvoiceDollar className="sr-main-icon" />
        <h1>Sales Analytics Report</h1>
        <p>Detailed breakdown of your monthly earnings and order history.</p>
      </header>

      <div className="sr-list">
        {reports.map((item) => {
          const monthId = `${item._id.year}-${item._id.month}`;
          const isExpanded = expandedMonth === monthId;

          return (
            <div key={monthId} className={`sr-month-card ${isExpanded ? "active" : ""}`}>
              <div className="sr-month-header" onClick={() => toggleMonth(monthId)}>
                <div className="sr-month-info">
                  <FaCalendarAlt className="sr-cal-icon" />
                  <h3>{monthNames[item._id.month - 1]} {item._id.year}</h3>
                </div>
                <div className="sr-month-stats">
                  <span className="sr-total-label">Total Sales:</span>
                  <span className="sr-total-amount">LKR {item.monthlyTotalSales.toLocaleString()}</span>
                  <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                    <FaChevronDown />
                  </motion.div>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="sr-details-wrapper"
                  >
                    <table className="sr-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Product</th>
                          <th>Customer</th>
                          <th>Qty</th>
                          <th>Price</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.orders.map((order) => (
                          <tr key={order._id}>
                            <td>{new Date(order.date).toLocaleDateString()}</td>
                            <td className="sr-pname">{order.productName}</td>
                            <td>{order.customerName}</td>
                            <td>{order.quantity}</td>
                            <td className="sr-price">LKR {order.totalPrice.toLocaleString()}</td>
                            <td><span className={`sr-badge ${order.status.toLowerCase()}`}>{order.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}