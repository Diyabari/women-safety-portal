import { useEffect, useState } from "react";
import { BookOpen, Siren } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const categories = [
  { value: "", label: "All" },
  { value: "self_defense", label: "Self-Defense" },
  { value: "travel", label: "Travel" },
  { value: "digital_safety", label: "Digital Safety" },
  { value: "workplace", label: "Workplace" },
  { value: "general", label: "General" },
];

const emergencyNumbers = [
  { label: "Police", number: "100" },
  { label: "Women Helpline", number: "1091" },
  { label: "Ambulance", number: "108" },
  { label: "National Emergency Number", number: "112" },
];

const defaultTips = [
  {
    _id: "default-1",
    title: "Stay Aware of Your Surroundings",
    content: "Keep your phone away when walking alone, especially at night. Stay alert to people, vehicles, exits and well-lit routes around you.",
    category: "general",
  },
  {
    _id: "default-2",
    title: "Share Your Live Location",
    content: "When travelling alone, share your live location and route with a trusted person. Tell them when you expect to arrive.",
    category: "travel",
  },
  {
    _id: "default-3",
    title: "Use Well-Lit Routes",
    content: "Prefer busy, well-lit roads and public areas. Avoid isolated shortcuts when travelling alone.",
    category: "travel",
  },
  {
    _id: "default-4",
    title: "Basic Self-Defense",
    content: "Learn practical self-defense skills from a qualified trainer. Focus on creating distance, escaping and getting help rather than confronting an attacker.",
    category: "self_defense",
  },
  {
    _id: "default-5",
    title: "Protect Your Digital Privacy",
    content: "Use strong passwords, enable two-factor authentication and review app permissions. Do not publicly share your live location or sensitive personal details.",
    category: "digital_safety",
  },
  {
    _id: "default-6",
    title: "Save Emergency Contacts",
    content: "Keep trusted contacts and emergency numbers saved on your phone. Make sure you know how to reach local emergency services quickly.",
    category: "general",
  },
  {
    _id: "default-7",
    title: "Workplace Safety",
    content: "Know your organization's complaint and support process. Keep relevant messages or documents if you need to report inappropriate behaviour.",
    category: "workplace",
  },
  {
    _id: "default-8",
    title: "Check Your Ride",
    content: "Before entering a cab or auto, verify the vehicle details and share the trip information with someone you trust.",
    category: "travel",
  },
];

const SafetyTips = () => {
  const [tips, setTips] = useState([]);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api
      .get("/safety-tips", { params: { category: category || undefined } })
      .then((res) => {
        const apiTips = Array.isArray(res.data?.data) ? res.data.data : [];
        const filteredDefaults = category
          ? defaultTips.filter((tip) => tip.category === category)
          : defaultTips;

        // Show database tips first. If the database is empty, the page
        // still contains useful safety tips instead of showing a blank page.
        setTips(apiTips.length ? apiTips : filteredDefaults);
      })
      .catch(() => {
        const filteredDefaults = category
          ? defaultTips.filter((tip) => tip.category === category)
          : defaultTips;
        setTips(filteredDefaults);
      })
      .finally(() => setLoading(false));
  }, [category]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="page-title">Safety Tips</h1>
        <p className="mt-1 text-slate-500">
          Practical safety advice and important emergency numbers.
        </p>

        <div className="card mt-6">
          <div className="mb-3 flex items-center gap-2 font-semibold text-slate-800">
            <Siren className="h-5 w-5 text-brand-600" /> Emergency Numbers
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {emergencyNumbers.map((n) => (
              <a
                key={n.number}
                href={`tel:${n.number}`}
                className="rounded-lg border border-slate-200 p-3 text-center transition hover:border-brand-300 hover:bg-brand-50"
              >
                <p className="text-lg font-bold text-brand-600">{n.number}</p>
                <p className="text-xs text-slate-500">{n.label}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategory(c.value)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                category === c.value
                  ? "bg-brand-500 text-white"
                  : "bg-white text-slate-600 hover:bg-slate-100"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="card text-sm text-slate-500">Loading safety tips...</div>
          ) : tips.length === 0 ? (
            <p className="card text-sm text-slate-500">
              No safety tips found for this category.
            </p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {tips.map((tip) => (
                <div key={tip._id} className="card">
                  <div className="mb-2 flex items-center gap-2 text-brand-600">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-xs font-semibold uppercase tracking-wide">
                      {tip.category.replace("_", " ")}
                    </span>
                  </div>
                  <p className="font-semibold text-slate-800">{tip.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {tip.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SafetyTips;
