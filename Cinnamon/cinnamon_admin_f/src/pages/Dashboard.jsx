import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaUsers, FaBriefcase, FaUserTie, FaUserAlt, 
  FaEnvelopeOpenText, FaBell, FaExclamationTriangle, FaAd, FaArrowUp 
} from "react-icons/fa";
import { Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';

import "./css/Dashboard.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement);

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    totalUsers: 0, businessRequests: 0, businessUsers: 0, normalUsers: 0,
    unreadMessages: 0, newReports: 0, addReports: 0, notifications: 0
  });

  const [chartStats, setChartStats] = useState({
    lineLabels: [],
    lineData: [],
    pieData: [0, 0, 0]
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admindashboard/dashboard-stats");
        if (res.data.success) setData(res.data.stats);
      } catch (err) { console.error("Stats Error:", err); }
    };

    const fetchChartData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admindashboard/dashboard-charts");
        if (res.data.success) {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const labels = res.data.chartData.monthly.map(item => monthNames[item._id - 1]);
          const counts = res.data.chartData.monthly.map(item => item.count);

          setChartStats({
            lineLabels: labels,
            lineData: counts,
            pieData: [
              res.data.chartData.distribution.businessCount,
              res.data.chartData.distribution.normalCount,
              res.data.chartData.distribution.pendingCount
            ]
          });
        }
      } catch (err) { console.error("Chart Data Error:", err); }
    };

    fetchStats();
    fetchChartData();
  }, []);

  const statsCards = [
    { title: "Total Platform Users", value: data.totalUsers, icon: <FaUsers />, color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", path: "/accounts" },
    { title: "Business Requests", value: data.businessRequests, icon: <FaBriefcase />, color: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", path: "/business-requests" },
    { title: "Active Businesses", value: data.businessUsers, icon: <FaUserTie />, color: "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)", path: "/accounts" },
    { title: "Standard Members", value: data.normalUsers, icon: <FaUserAlt />, color: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", path: "/accounts" },
    { title: "Inquiry Inbox", value: data.unreadMessages, icon: <FaEnvelopeOpenText />, color: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)", path: "/messagecontact" },
    { title: "System Alerts", value: data.notifications, icon: <FaBell />, color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", path: "/messagecontact" },
    { title: "Safety Reports", value: data.newReports, icon: <FaExclamationTriangle />, color: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", path: "/viewreport" },
    { title: "Reported Ads", value: data.addReports, icon: <FaAd />, color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", path: "/adminviewaddreports" },
  ];

  const lineChartData = {
    labels: chartStats.lineLabels,
    datasets: [{
      label: "User Growth",
      data: chartStats.lineData,
      borderColor: "#764ba2",
      backgroundColor: "rgba(118, 75, 162, 0.1)",
      fill: true,
      tension: 0.4,
      pointRadius: 5,
    }]
  };

  const pieChartData = {
    labels: ["Business", "Normal", "Pending"],
    datasets: [{
      data: chartStats.pieData,
      backgroundColor: ["#764ba2", "#84fab0", "#f6d365"],
      borderWidth: 0,
      hoverOffset: 15
    }]
  };

  return (
    <div className="db-wrapper">
      <header className="db-welcome">
        <div className="welcome-text">
          <h1>Cinnamon Bridge <span>Command Center</span></h1>
          <p>Real-time Platform Analytics & User Insights</p>
        </div>
        <div className="current-date">{new Date().toDateString()}</div>
      </header>

      <div className="db-grid-v2">
        {statsCards.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass-card stat-item"
            onClick={() => item.path && navigate(item.path)}
          >
            <div className="card-bg-icon">{item.icon}</div>
            <div className="card-main">
              <div className="icon-circle" style={{ background: item.color }}>{item.icon}</div>
              <div className="content">
                <h3>{item.title}</h3>
                <h2>{item.value?.toLocaleString()}</h2>
              </div>
            </div>
            <div className="card-footer-info">
              <FaArrowUp /> Live Tracking Active
            </div>
          </motion.div>
        ))}
      </div>

      <div className="db-visuals">
        <div className="chart-container-main glass-card">
          <div className="chart-header">
            <h3>User Registration Trend</h3>
          </div>
          <div className="chart-wrapper-inner">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="chart-container-side glass-card">
          <div className="chart-header">
            <h3>User Distribution</h3>
          </div>
          <div className="pie-wrapper-inner">
            <Doughnut 
              data={pieChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } } }
              }} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}