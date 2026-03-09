import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaBars, FaTachometerAlt, FaCog, FaUser, FaSignOutAlt, FaChevronLeft } from "react-icons/fa";
import { FaUsersGear, FaMessage, FaFileLines } from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const menus = [
    { name: "Dashboard", path: "/", icon: <FaTachometerAlt /> },
    { name: "Messages", path: "/messagecontact", icon: <FaMessage /> },
    { name: "Report Accounts", path: "/viewreport", icon: <FaFileLines /> },
    { name: "Accounts", path: "/accounts", icon: <FaUser /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> },
  ];

  if (user?.accountType === "superadmin") {
    menus.splice(1, 0, {
      name: "Admin Account Management",
      path: "/adminaccount",
      icon: <FaUsersGear />,
    });
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      navigate("/login");
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header">
        {isOpen && <h2 className="logo-text">Admin<span>Panel</span></h2>}
        <button className="toggle-btn" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FaChevronLeft /> : <FaBars />}
        </button>
      </div>

      {user && (
        <div className="user-section">
          <div className="profile-wrapper">
            <img
              src={`http://localhost:5000${user.profilePic}`}
              alt="Admin"
              className="profile-pic"
            />
            <div className="status-indicator"></div>
          </div>
          {isOpen && (
            <div className="user-info">
              <p className="username">{user.username}</p>
              <p className="role">{user.accountType}</p>
            </div>
          )}
        </div>
      )}

      <nav className="menu-container">
        <ul className="menu-list">
          {menus.map((menu, index) => (
            <li key={index} className={location.pathname === menu.path ? "active" : ""}>
              <Link to={menu.path} className="menu-link">
                <span className="icon">{menu.icon}</span>
                {isOpen && <span className="text">{menu.name}</span>}
                {!isOpen && <div className="tooltip">{menu.name}</div>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-action" onClick={handleLogout}>
          <FaSignOutAlt />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}