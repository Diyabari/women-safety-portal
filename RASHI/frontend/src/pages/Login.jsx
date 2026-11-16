import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      navigate(user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      // Safely falls back if err.response is undefined (e.g., native fetch instead of Axios)
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-50 via-white to-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="rounded-full bg-brand-500 p-3 text-white">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">RASHI</h1>
          <p className="text-sm text-slate-500">Sign in to access emergency assistance and safety tools</p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-4">
          {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              required
              className="input-field w-full"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                className="input-field w-full pr-10"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <p className="text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-brand-600 hover:underline">
              Register
            </Link>
          </p>
        </form>

        <p className="mt-4 text-center text-xs text-slate-400">
          Admin demo login: admin@safetyportal.com / Admin@123 (after running the seed script)
        </p>
      </div>
    </div>
  );
};

export default Login;