import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import { motion } from "framer-motion";
import { 
    FaChartLine, FaBoxOpen, FaClipboardList, 
    FaAdversal, FaRobot, FaArrowRight, 
    FaFileInvoiceDollar
} from "react-icons/fa";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

import "./css/BusinessTools.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function BusinessTools() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const [chartData, setChartData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
    if (!user?._id) return;

    try {
        const res = await axios.get(`http://localhost:5000/api/orders/seller-stats/${user._id}`);
        
        if (res.data.success) {
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            
            const dynamicLabels = [];
            const dynamicData = [];
            
            const today = new Date();

            for (let i = 11; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthName = monthNames[d.getMonth()];
                const yearShort = d.getFullYear(); 
                
                dynamicLabels.push(`${monthName} ${yearShort}`);

                const match = res.data.monthlySales.find(s => 
                    s._id.month === (d.getMonth() + 1) && s._id.year === d.getFullYear()
                );

                dynamicData.push(match ? match.totalAmount : 0);
            }

            setChartData({
                bar: {
                    labels: dynamicLabels,
                    datasets: [{
                        label: 'Revenue (LKR)',
                        data: dynamicData,
                        backgroundColor: '#b36b00',
                        borderRadius: 8,
                    }]
                },
                pie: {
                    labels: res.data.productSales.map(d => d._id),
                    datasets: [{
                        data: res.data.productSales.map(d => d.count),
                        backgroundColor: ['#b36b00', '#f6c23e', '#1a202c', '#718096', '#cbd5e0'],
                    }]
                }
            });
        }
    } catch (err) {
        console.error("Error:", err);
    } finally {
        setLoading(false);
    }
};

        fetchStats();
    }, [user]);

    const tools = [
        { title: "Sales Dashboard", desc: "Overall Sale Analysis & Predictions", icon: <FaChartLine />, path: "/overallsaleprediction", color: "#4e73df" },
        { title: "Product Analytics", desc: "Deep dive into product performance", icon: <FaBoxOpen />, path: "/predictanalitics", color: "#1cc88a" },
        { title: "Order Manager", desc: "Efficiently handle customer orders", icon: <FaClipboardList />, path: "/sallerordermanagement", color: "#f6c23e" },
        { title: "Ad Manager", desc: "Boost sales with targeted promotions", icon: <FaAdversal />, path: "/add-advertisement", color: "#e74a3b" },
        { title: "AI Assistant", desc: "Smart business insights & help", icon: <FaRobot />, path: "/chatbot", color: "#6f42c1" },
        { title: "Sales Report", desc: "All of sales reports ", icon: <FaFileInvoiceDollar />, path: "/salereport", color: "#4292c1" },
    ];

    return (
        <div className="bt-page-wrapper">
            <header className="bt-header">
                <span className="bt-badge">Seller Central</span>
                <h1 className="bt-main-title">Business <span>Growth</span> Tools</h1>
                <p className="bt-sub-text">Everything you need to manage and scale your business.</p>
            </header>

            <div className="dashboard-charts-container">
                {loading ? (
                    <div className="loading-spinner">Analyzing Data...</div>
                ) : chartData ? (
                    <div className="charts-grid">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chart-card">
                            <h3>Monthly Revenue Performance</h3>
                            <div style={{ height: '350px' }}>
                                <Bar 
                                    data={chartData.bar} 
                                    options={{ 
                                        indexAxis: 'y', 
                                        responsive: true, 
                                        maintainAspectRatio: false,
                                        plugins: { legend: { display: false } }
                                    }} 
                                />
                            </div>
                        </motion.div>

                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="chart-card">
                            <h3>Top Selling Products</h3>
                            <div className="pie-box">
                                <Pie data={chartData.pie} options={{ responsive: true, maintainAspectRatio: false }} />
                            </div>
                        </motion.div>
                    </div>
                ) : (
                    <div className="no-data-msg">No sales data available.</div>
                )}
            </div>

            <div className="bt-grid-modern">
                {tools.map((tool, index) => (
                    <div 
                        key={index} 
                        className="bt-card-modern" 
                        onClick={() => navigate(tool.path)}
                        style={{ "--accent-color": tool.color }}
                    >
                        <div className="bt-icon-container">{tool.icon}</div>
                        <div className="bt-card-content">
                            <h3>{tool.title}</h3>
                            <p>{tool.desc}</p>
                        </div>
                        <div className="bt-card-footer">
                            <span className="bt-action-text">Launch Tool</span>
                            <div className="bt-arrow"><FaArrowRight /></div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}