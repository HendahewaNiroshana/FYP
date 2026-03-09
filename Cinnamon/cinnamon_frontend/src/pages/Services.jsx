import React from "react";
import "./css/Services.css";
import { FaShippingFast, FaLeaf, FaHandsHelping, FaStar } from "react-icons/fa";

export default function Services() {
  const services = [
    {
      id: 1,
      title: "Express Logistics",
      desc: "Experience ultra-fast and secure shipping, ensuring your premium spices reach you in peak condition.",
      icon: <FaShippingFast />,
    },
    {
      id: 2,
      title: "Purely Organic",
      desc: "Sourced directly from certified gardens. No chemicals, just the authentic essence of nature.",
      icon: <FaLeaf />,
    },
    {
      id: 3,
      title: "Dedicated Support",
      desc: "Our specialists are available 24/7 to provide expert guidance on our spice collections.",
      icon: <FaHandsHelping />,
    },
    {
      id: 4,
      title: "Elite Quality",
      desc: "Every product undergoes rigorous quality checks to meet global export standards.",
      icon: <FaStar />,
    },
  ];

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