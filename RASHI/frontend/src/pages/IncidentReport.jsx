import { useEffect, useState } from "react";
import { FileWarning, Paperclip, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const categories = [
  { value: "harassment", label: "Harassment" },
  { value: "stalking", label: "Stalking" },
  { value: "assault", label: "Assault" },
  { value: "unsafe_area", label: "Unsafe Area" },
  { value: "other", label: "Other" },
];

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  verified: "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-slate-100 text-slate-600",
};

const IncidentReport = () => {
  const [incidents, setIncidents] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "harassment",
    address: "",
    isAnonymous: false,
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadIncidents = () => {
    api
      .get("/incidents/mine")
      .then((res) => setIncidents(res.data.data))
      .catch(() => {});
  };

  useEffect(loadIncidents, []);

  const useCurrentLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setForm((f) => ({
        ...f,
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }));
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      files.forEach((file) => fd.append("evidence", file));

      const res = await api.post("/incidents", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIncidents((prev) => [res.data.data, ...prev]);
      setForm({ title: "", description: "", category: "harassment", address: "", isAnonymous: false });
      setFiles([]);
      setMessage("Incident reported successfully. Our team will review it shortly.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to report incident");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="page-title">Report an Incident</h1>
        <p className="mt-1 text-slate-500">
          Securely report harassment or unsafe situations. You may report anonymously.
        </p>

        <form onSubmit={handleSubmit} className="card mt-6 space-y-4">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{message}</div>}

          <input
            required
            placeholder="Short title (e.g. Harassment near bus stop)"
            className="input-field"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />

          <textarea
            required
            rows={4}
            placeholder="Describe what happened in detail"
            className="input-field"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              className="input-field"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            <div className="flex gap-2">
              <input
                placeholder="Location / address"
                className="input-field"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
              <button type="button" onClick={useCurrentLocation} className="btn-secondary whitespace-nowrap">
                Use GPS
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
              <Paperclip className="h-4 w-4" /> Attach evidence (optional, photos/videos/pdf)
            </label>
            <input
              type="file"
              multiple
              accept="image/*,video/*,application/pdf"
              onChange={(e) => setFiles(Array.from(e.target.files))}
              className="block w-full text-sm text-slate-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.isAnonymous}
              onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })}
            />
            Report anonymously (your identity will be hidden from public view)
          </label>

          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit Report"}
          </button>
        </form>

        <div className="mt-8">
          <h2 className="mb-3 font-semibold text-slate-800">Your Reports</h2>
          <div className="space-y-3">
            {incidents.length === 0 ? (
              <p className="card text-sm text-slate-500">No incidents reported yet.</p>
            ) : (
              incidents.map((inc) => (
                <div key={inc._id} className="card">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
                        <FileWarning className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{inc.title}</p>
                        <p className="mt-1 text-sm text-slate-500">{inc.description}</p>
                        <p className="mt-1 text-xs text-slate-400">
                          {new Date(inc.createdAt).toLocaleString()} · {inc.category.replace("_", " ")}
                        </p>
                      </div>
                    </div>
                    <span className={`badge ${statusColors[inc.status]}`}>{inc.status.replace("_", " ")}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default IncidentReport;
