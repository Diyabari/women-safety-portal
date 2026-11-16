import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import api from "../../api/axios";

const statusOptions = ["pending", "under_review", "verified", "resolved", "rejected"];

const statusColors = {
  pending: "bg-amber-100 text-amber-700",
  under_review: "bg-blue-100 text-blue-700",
  verified: "bg-purple-100 text-purple-700",
  resolved: "bg-green-100 text-green-700",
  rejected: "bg-slate-100 text-slate-600",
};

const AdminIncidents = () => {
  const [incidents, setIncidents] = useState([]);
  const [filter, setFilter] = useState("");
  const [notesDraft, setNotesDraft] = useState({});

  const load = () => {
    api.get("/admin/incidents", { params: { status: filter || undefined } }).then((res) => setIncidents(res.data.data));
  };

  useEffect(load, [filter]);

  const handleStatusChange = async (id, status) => {
    const res = await api.put(`/admin/incidents/${id}`, { status });
    setIncidents((prev) => prev.map((i) => (i._id === id ? res.data.data : i)));
  };

  const handleSaveNotes = async (id) => {
    const res = await api.put(`/admin/incidents/${id}`, { adminNotes: notesDraft[id] });
    setIncidents((prev) => prev.map((i) => (i._id === id ? res.data.data : i)));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-5xl px-4 py-8">
        <h1 className="page-title">Manage Incident Reports</h1>
        <p className="mt-1 text-slate-500">Review, verify, and resolve reported incidents.</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setFilter("")}
            className={`rounded-full px-3 py-1.5 text-sm font-medium ${
              filter === "" ? "bg-brand-500 text-white" : "bg-white text-slate-600"
            }`}
          >
            All
          </button>
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium capitalize ${
                filter === s ? "bg-brand-500 text-white" : "bg-white text-slate-600"
              }`}
            >
              {s.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {incidents.length === 0 ? (
            <p className="card text-sm text-slate-500">No incidents found.</p>
          ) : (
            incidents.map((inc) => (
              <div key={inc._id} className="card">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-800">{inc.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{inc.description}</p>
                    <p className="mt-1 text-xs text-slate-400">
                      Reported by: {inc.isAnonymous ? "Anonymous" : inc.reportedBy?.name} ·{" "}
                      {new Date(inc.createdAt).toLocaleString()}
                    </p>
                    {inc.evidenceFiles?.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {inc.evidenceFiles.map((f) => (
                          <a
                            key={f}
                            href={f}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-medium text-brand-600 underline"
                          >
                            Evidence file
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                  <span className={`badge shrink-0 ${statusColors[inc.status]}`}>{inc.status.replace("_", " ")}</span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <select
                    value={inc.status}
                    onChange={(e) => handleStatusChange(inc._id, e.target.value)}
                    className="input-field w-auto"
                  >
                    {statusOptions.map((s) => (
                      <option key={s} value={s}>
                        {s.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mt-3 flex gap-2">
                  <input
                    placeholder="Admin notes..."
                    className="input-field"
                    defaultValue={inc.adminNotes || ""}
                    onChange={(e) => setNotesDraft({ ...notesDraft, [inc._id]: e.target.value })}
                  />
                  <button onClick={() => handleSaveNotes(inc._id)} className="btn-secondary whitespace-nowrap">
                    Save Notes
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminIncidents;
