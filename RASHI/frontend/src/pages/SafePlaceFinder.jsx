import { useState } from "react";
import { MapPin, Phone, Loader2, ShieldCheck, Navigation } from "lucide-react";
import Navbar from "../components/Navbar";
import api from "../api/axios";

const typeLabels = {
  police_station: "Police Station",
  hospital: "Hospital",
  help_center: "Help Center",
  ngo: "NGO",
};

const SafePlaceFinder = () => {
  const [places, setPlaces] = useState([]);
  const [type, setType] = useState("");
  const [radius, setRadius] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const searchNearby = () => {
    setError("");
    setLoading(true);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await api.get("/safe-places", {
            params: {
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              type: type || undefined,
              radius: Number(radius) || 10,
            },
          });

          setPlaces(Array.isArray(res.data?.data) ? res.data.data : []);
          setSearched(true);
        } catch (err) {
          setError(
            err.response?.data?.message ||
              "Could not load safe places. Please make sure the backend is running."
          );
          setPlaces([]);
          setSearched(true);
        } finally {
          setLoading(false);
        }
      },
      (geoError) => {
        setError(
          geoError.code === 1
            ? "Location access was denied. Allow location access in your browser and search again."
            : "Unable to get your current location. Please try again."
        );
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="page-title">Find Safe Places Nearby</h1>
        <p className="mt-1 text-slate-500">
          Search for nearby police stations, hospitals, help centers and NGOs
          using your current location.
        </p>

        <div className="card mt-6">
          <div className="grid gap-3 sm:grid-cols-[1fr_160px_auto] sm:items-end">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Place type
              </label>
              <select
                className="input-field"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="">All safe places</option>
                <option value="police_station">Police Station</option>
                <option value="hospital">Hospital</option>
                <option value="help_center">Help Center</option>
                <option value="ngo">NGO</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Radius (km)
              </label>
              <input
                type="number"
                min={1}
                max={100}
                className="input-field"
                value={radius}
                onChange={(e) => setRadius(e.target.value)}
              />
            </div>

            <button
              onClick={searchNearby}
              disabled={loading}
              className="btn-primary"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              {loading ? "Searching..." : "Search Safe Places"}
            </button>
          </div>

          <p className="mt-3 text-xs text-slate-400">
            Your browser will ask for location permission. Only the location
            coordinates needed for this search are sent to the RASHI API.
          </p>
        </div>

        {error && (
          <div className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-3">
          {searched && places.length === 0 && !error && (
            <div className="card text-sm text-slate-600">
              No safe places are stored within {radius} km. Try increasing the
              radius or adding safe places from the Admin Dashboard.
            </div>
          )}

          {!searched && !loading && (
            <div className="card text-center text-sm text-slate-500">
              Click <b>Search Safe Places</b> to see nearby places.
            </div>
          )}

          {places.map((p) => (
            <div
              key={p._id}
              className="card flex flex-col justify-between gap-4 sm:flex-row sm:items-start"
            >
              <div className="flex items-start gap-3">
                <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{p.name}</p>
                  <p className="text-sm text-slate-500">{p.address}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                    <span className="badge bg-slate-100 text-slate-600">
                      {typeLabels[p.type] || p.type}
                    </span>
                    {p.is24x7 && (
                      <span className="badge bg-green-100 text-green-700">
                        24x7
                      </span>
                    )}
                    <span className="font-medium">{p.distanceKm} km away</span>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 gap-2">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${p.name}, ${p.address}`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn-secondary !px-3 !py-2"
                  title="Open in Google Maps"
                >
                  <MapPin className="h-4 w-4" />
                  Map
                </a>
                {p.phone && (
                  <a
                    href={`tel:${p.phone}`}
                    className="btn-secondary !px-3 !py-2"
                    title={`Call ${p.phone}`}
                  >
                    <Phone className="h-4 w-4" />
                    Call
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default SafePlaceFinder;
