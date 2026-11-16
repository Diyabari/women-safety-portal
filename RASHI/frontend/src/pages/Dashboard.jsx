import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, FileWarning, MapPin, BookOpen, History } from "lucide-react";
import Navbar from "../components/Navbar";
import SOSButton from "../components/SOSButton";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";

const quickLinks = [
  { to: "/contacts", icon: Users, label: "Emergency Contacts", desc: "Manage trusted people who get notified" },
  { to: "/incidents", icon: FileWarning, label: "Report Incident", desc: "File a report about an unsafe situation" },
  { to: "/safe-places", icon: MapPin, label: "Safe Places", desc: "Find nearby police, hospitals & help centers" },
  { to: "/safety-tips", icon: BookOpen, label: "Safety Tips", desc: "Learn self-defense & safety practices" },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [sosHistory, setSosHistory] = useState([]);
  const [contactCount, setContactCount] = useState(0);

  useEffect(() => {
    api.get("/sos").then((res) => setSosHistory(res.data.data)).catch(() => {});
    api.get("/contacts").then((res) => setContactCount(res.data.data.length)).catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="page-title">Welcome, {user?.name?.split(" ")[0]}</h1>
        <p className="mt-1 text-slate-500">Your safety dashboard — quick access to emergency tools.</p>

        {contactCount === 0 && (
          <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You haven't added any emergency contacts yet.{" "}
            <Link to="/contacts" className="font-semibold underline">
              Add one now
            </Link>{" "}
            so SOS alerts have someone to notify.
          </div>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <div className="card flex flex-col items-center justify-center gap-4 md:col-span-1">
            <h2 className="font-semibold text-slate-800">Emergency SOS</h2>
            <SOSButton onTriggered={(alert) => setSosHistory([alert, ...sosHistory])} />
          </div>

          <div className="md:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="card flex items-start gap-3 transition hover:border-brand-300 hover:shadow-md"
                >
                  <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{link.label}</p>
                    <p className="text-sm text-slate-500">{link.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="mb-3 flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Recent SOS Alerts</h2>
          </div>
          {sosHistory.length === 0 ? (
            <p className="card text-sm text-slate-500">No SOS alerts triggered yet.</p>
          ) : (
            <div className="space-y-3">
              {sosHistory.slice(0, 5).map((alert) => (
                <div key={alert._id} className="card flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{alert.message}</p>
                    <p className="text-xs text-slate-500">{new Date(alert.createdAt).toLocaleString()}</p>
                  </div>
                  <span
                    className={`badge ${
                      alert.status === "active"
                        ? "bg-red-100 text-red-700"
                        : alert.status === "resolved"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {alert.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
