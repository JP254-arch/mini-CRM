import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Leads from "./pages/Leads";
import LeadDetails from "./pages/LeadDetails"; // fixed path
import CreateLead from "./pages/CreateLead";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <BrowserRouter>
      {/* Show navbar ONLY if logged in */}
      {token && (
        <nav
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 20px",
            borderBottom: "1px solid #ccc",
            marginBottom: "20px"
          }}
        >
          <div style={{ display: "flex", gap: "15px" }}>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/leads">Leads</Link>
          </div>

          <button onClick={handleLogout}>Logout</button>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Login />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <Leads />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/new"
          element={
            <ProtectedRoute>
              <CreateLead />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/:id"
          element={
            <ProtectedRoute>
              <LeadDetails />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;