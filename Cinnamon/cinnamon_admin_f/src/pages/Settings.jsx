import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FaEnvelopeOpenText, FaAd, FaUserEdit, FaChevronRight } from "react-icons/fa";
import "./css/Setting.css";

export default function Settings() {
  const navigate = useNavigate();

  const settingsOptions = [
    {
      title: "User Messages",
      desc: "View and manage incoming user inquiries",
      icon: <FaEnvelopeOpenText />,
      path: "/messagecontact",
      color: "#6366f1"
    },
    {
      title: "Advertisement Reports",
      desc: "Analyze and review ad performance reports",
      icon: <FaAd />,
      path: "/adminviewaddreports",
      color: "#f59e0b"
    },
    {
      title: "Edit Profile",
      desc: "Update your administrative credentials",
      icon: <FaUserEdit />,
      path: "/admineditprofile",
      color: "#10b981"
    }
  ];

  return (
    <div className="settings-wrapper">
      <header className="settings-header">
        <h1 className="settings-title">System <span>Settings</span></h1>
        <p>Manage your administrative preferences and platform reports</p>
      </header>

      <div className="settings-grid">
        {settingsOptions.map((option, index) => (
          <motion.div 
            key={index}
            whileHover={{ y: -10, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="settings-card"
            onClick={() => navigate(option.path)}
          >
            <div className="card-accent" style={{ backgroundColor: option.color }}></div>
            <div className="card-icon" style={{ color: option.color, backgroundColor: `${option.color}15` }}>
              {option.icon}
            </div>
            <div className="card-content">
              <h4>{option.title}</h4>
              <p>{option.desc}</p>
            </div>
            <div className="card-arrow">
              <FaChevronRight />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}