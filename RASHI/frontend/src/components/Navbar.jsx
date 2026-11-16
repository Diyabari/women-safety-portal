import { Link, useNavigate, useLocation } from "react-router-dom";
import { Shield, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

const userLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/contacts", label: "Emergency Contacts" },
  { to: "/incidents", label: "Report Incident" },
  { to: "/safe-places", label: "Safe Places" },
  { to: "/safety-tips", label: "Safety Tips" },
];

const adminLinks = [
  { to: "/admin", label: "Admin Dashboard" },
  { to: "/admin/incidents", label: "Manage Incidents" },
  { to: "/admin/users", label: "Manage Users" },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const links = user?.role === "admin" ? adminLinks : userLinks;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/dashboard" className="flex items-center gap-2 font-bold text-brand-600">
          <Shield className="h-6 w-6" />
          <span>RASHI</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                location.pathname === link.to
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="btn-secondary ml-2">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 px-4 pb-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              {link.label}
            </Link>
          ))}
          <button onClick={handleLogout} className="btn-secondary mt-2 w-full">
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
