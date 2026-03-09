import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import Sidebar from "./Component/Sidebar";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import Accounts from "./pages/Accounts";
import Management from "./pages/Management";
import BusinessRequests from "./pages/BusinessRequests";
import ProfileDetails from "./pages/ProfileDetails";
import AdminUsers from "./pages/AdminUsers";
import Login from "./pages/Login";
import { AuthContext } from "./context/AuthContext"; 
import AdminMessages from "./pages/Messages_contact";
import AdminReports from "./pages/ViewReport";
import EditProfile from "./pages/EditProfile";
import AddReports from "./pages/ViewAddReports";
import "./App.css";

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader">Authenticating Admin...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {user ? (
          <Route
            path="/*"
            element={
              <div className="app">
                <Sidebar />
                <div className="main-content">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/accounts" element={<Accounts />} />
                    <Route path="/management" element={<Management />} />
                    <Route path="/business-requests" element={<BusinessRequests />} />
                    <Route path="/profile/:id" element={<ProfileDetails />} />
                    <Route path="/adminaccount" element={<AdminUsers />} />
                    <Route path="/messagecontact" element={<AdminMessages />} />
                    <Route path="/viewreport" element={<AdminReports />} />
                    <Route path="/admineditprofile" element={<EditProfile />} />
                    <Route path="/adminviewaddreports" element={<AddReports />} />
                    <Route path="/login" element={<Navigate to="/" />} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </div>
            }
          />
        ) : (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;