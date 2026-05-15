import React from "react";
import "./css/Services.css";
import { FaShippingFast, FaStore, FaRobot, FaChartLine } from "react-icons/fa";

export default function Services() {
  const services = [
  {
    id: 1,
    title: "Smart Marketplace Access",
    desc: "Seamlessly connect buyers and sellers through an intelligent digital marketplace designed for efficient cinnamon trading, secure transactions, and direct business opportunities.",
    icon: <FaStore />,
  },
  {
    id: 2,
    title: "AI-Powered Customer Assistance",
    desc: "Get instant support through an intelligent AI assistant capable of answering cinnamon-related questions, platform guidance, and customer inquiries 24/7.",
    icon: <FaRobot />,
  },
  {
    id: 3,
    title: "Advanced Order Tracking",
    desc: "Track every stage of your order in real time with automated notifications and email updates, ensuring transparency and improved delivery visibility.",
    icon: <FaShippingFast />,
  },
  {
    id: 4,
    title: "Business Analytics & Sales Insights",
    desc: "Empower business growth with AI-driven sales forecasting, product performance analytics, revenue predictions, and market trend insights.",
    icon: <FaChartLine />,
  },
]

  return (
    <div className="services-section">
      <div className="services-header">
        <span className="sub-title">Why Choose Us</span>
        <h1 className="main-title">Excellence in Every Grain</h1>
        <div className="title-underline"></div>
      </div>

      <div className="services-grid1">
        {services.map((service, index) => (
          <div 
            key={service.id} 
            className="service-card-modern" 
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            <div className="card-inner">
              <div className="icon-wrapper">{service.icon}</div>
              <h2>{service.title}</h2>
              <p>{service.desc}</p>
              <div className="card-footer-line"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}