import { useEffect, useState } from "react";
import { Users, FileWarning, AlertTriangle, Clock } from "lucide-react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("/admin/analytics").then((res) => setStats(res.data.data));
  }, []);

  const cards = stats
    ? [
        { label: "Total Users", value: stats.totalUsers, icon: Users, color: "text-blue-600 bg-blue-50" },
        { label: "Total Incidents", value: stats.totalIncidents, icon: FileWarning, color: "text-purple-600 bg-purple-50" },
        { label: "Pending Review", value: stats.pendingIncidents, icon: Clock, color: "text-amber-600 bg-amber-50" },
        { label: "Active SOS Alerts", value: stats.activeSOS, icon: AlertTriangle, color: "text-red-600 bg-red-50" },
      ]
    : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="page-title">Admin Dashboard</h1>
        <p className="mt-1 text-slate-500">Overview of platform activity and reports.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c) => (
            <div key={c.label} className="card flex items-center gap-4">
              <div className={`rounded-lg p-3 ${c.color}`}>
                <c.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{c.value}</p>
                <p className="text-sm text-slate-500">{c.label}</p>
              </div>
            </div>
          ))}
        </div>

        {stats?.incidentsByCategory?.length > 0 && (
          <div className="card mt-6">
            <h2 className="mb-3 font-semibold text-slate-800">Incidents by Category</h2>
            <div className="space-y-2">
              {stats.incidentsByCategory.map((item) => (
                <div key={item._id} className="flex items-center gap-3">
                  <span className="w-32 shrink-0 text-sm capitalize text-slate-600">
                    {item._id.replace("_", " ")}
                  </span>
                  <div className="h-2 flex-1 rounded-full bg-slate-100">
                    <div
                      className="h-2 rounded-full bg-brand-500"
                      style={{
                        width: `${(item.count / stats.totalIncidents) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-6 text-right text-sm font-medium text-slate-700">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
