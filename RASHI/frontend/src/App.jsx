import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import EmergencyContacts from "./pages/EmergencyContacts";
import IncidentReport from "./pages/IncidentReport";
import SafePlaceFinder from "./pages/SafePlaceFinder";
import SafetyTips from "./pages/SafetyTips";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminIncidents from "./pages/admin/AdminIncidents";
import AdminUsers from "./pages/admin/AdminUsers";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-slate-500">
        Loading...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate to={user ? (user.role === "admin" ? "/admin" : "/dashboard") : "/login"} replace />
        }
      />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* User routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/contacts"
        element={
          <ProtectedRoute>
            <EmergencyContacts />
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents"
        element={
          <ProtectedRoute>
            <IncidentReport />
          </ProtectedRoute>
        }
      />
      <Route
        path="/safe-places"
        element={
          <ProtectedRoute>
            <SafePlaceFinder />
          </ProtectedRoute>
        }
      />
      <Route
        path="/safety-tips"
        element={
          <ProtectedRoute>
            <SafetyTips />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute adminOnly>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/incidents"
        element={
          <ProtectedRoute adminOnly>
            <AdminIncidents />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute adminOnly>
            <AdminUsers />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
