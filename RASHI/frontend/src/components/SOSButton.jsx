import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import api from "../api/axios";

const SOSButton = ({ onTriggered }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [confirming, setConfirming] = useState(false);

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser."));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => reject(new Error("Unable to fetch your location. Please allow location access.")),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    });

  const handleTrigger = async () => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const { lat, lng } = await getLocation();
      const res = await api.post("/sos", { lat, lng, message: "Emergency! I need help immediately." });
      setSuccess(res.data.message);
      if (onTriggered) onTriggered(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to trigger SOS");
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {!confirming ? (
        <button
          onClick={() => setConfirming(true)}
          className="flex h-40 w-40 flex-col items-center justify-center gap-2 rounded-full bg-red-600 text-white shadow-lg ring-8 ring-red-100 transition hover:bg-red-700 active:scale-95"
        >
          <AlertTriangle className="h-10 w-10" />
          <span className="text-lg font-bold">SOS</span>
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
          <p className="font-semibold text-red-800">
            This will share your live location with all your emergency contacts.
          </p>
          <div className="flex gap-2">
            <button onClick={handleTrigger} disabled={loading} className="btn-primary bg-red-600 hover:bg-red-700">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirm SOS"}
            </button>
            <button onClick={() => setConfirming(false)} className="btn-secondary">
              Cancel
            </button>
          </div>
        </div>
      )}

      {success && <p className="text-sm font-medium text-green-700">{success}</p>}
      {error && <p className="text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
};

export default SOSButton;
