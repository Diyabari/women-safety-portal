import { useEffect, useState } from "react";
import { Phone, Star, Trash2, Plus, Loader2 } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const emptyForm = { name: "", phone: "", relation: "", email: "", isPrimary: false };

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  const loadContacts = () => {
    setFetching(true);
    api
      .get("/contacts")
      .then((res) => setContacts(res.data.data))
      .catch(() => setError("Failed to load contacts"))
      .finally(() => setFetching(false));
  };

  useEffect(loadContacts, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await api.post("/contacts", form);
      setContacts((prev) => [res.data.data, ...prev.map((c) => (form.isPrimary ? { ...c, isPrimary: false } : c))]);
      setForm(emptyForm);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add contact");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/contacts/${id}`);
    setContacts((prev) => prev.filter((c) => c._id !== id));
  };

  const handleMakePrimary = async (id) => {
    await api.put(`/contacts/${id}`, { isPrimary: true });
    setContacts((prev) => prev.map((c) => ({ ...c, isPrimary: c._id === id })));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="page-title">Emergency Contacts</h1>
        <p className="mt-1 text-slate-500">
          These trusted people will be notified when you trigger an SOS alert.
        </p>

        <form onSubmit={handleSubmit} className="card mt-6 grid gap-4 sm:grid-cols-2">
          {error && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 sm:col-span-2">{error}</div>
          )}
          <input
            required
            placeholder="Full name"
            className="input-field"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            required
            placeholder="Phone number"
            className="input-field"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <input
            placeholder="Relation (e.g. Mother, Friend)"
            className="input-field"
            value={form.relation}
            onChange={(e) => setForm({ ...form, relation: e.target.value })}
          />
          <input
            placeholder="Email (optional)"
            className="input-field"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.isPrimary}
              onChange={(e) => setForm({ ...form, isPrimary: e.target.checked })}
            />
            Set as primary contact
          </label>
          <button type="submit" disabled={loading} className="btn-primary sm:col-span-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add Contact
          </button>
        </form>

        <div className="mt-8 space-y-3">
          {fetching ? (
            <p className="text-sm text-slate-500">Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <p className="card text-sm text-slate-500">No emergency contacts added yet.</p>
          ) : (
            contacts.map((c) => (
              <div key={c._id} className="card flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-brand-50 p-2 text-brand-600">
                    <Phone className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="flex items-center gap-2 font-semibold text-slate-800">
                      {c.name}
                      {c.isPrimary && <Star className="h-4 w-4 fill-amber-400 text-amber-400" />}
                    </p>
                    <p className="text-sm text-slate-500">
                      {c.phone} {c.relation && `· ${c.relation}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {!c.isPrimary && (
                    <button
                      onClick={() => handleMakePrimary(c._id)}
                      className="text-xs font-medium text-brand-600 hover:underline"
                    >
                      Make primary
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
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

export default EmergencyContacts;
