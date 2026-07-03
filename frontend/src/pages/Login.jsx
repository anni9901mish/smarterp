import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, Sun, Moon } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosInstance";

const Login = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(true);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      localStorage.removeItem("companyId");
      localStorage.removeItem("companyName");

      toast.success("Login successful");
      navigate("/company");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-4 transition ${
        darkMode ? "bg-[#0f172a] text-white" : "bg-[#f8fafc] text-slate-900"
      }`}
    >
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute right-6 top-6 rounded-full p-3 border ${
          darkMode ? "border-white/10 bg-white/10" : "border-slate-200 bg-white"
        }`}
      >
        {darkMode ? <Sun size={18} /> : <Moon size={18} />}
      </button>

      <div
        className={`w-full max-w-md rounded-3xl border p-8 shadow-2xl ${
          darkMode
            ? "border-white/10 bg-white/10 backdrop-blur-xl"
            : "border-slate-200 bg-white"
        }`}
      >
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">SmartERP</h1>
            <p className={darkMode ? "text-slate-400" : "text-slate-500"}>
              Login to your ERP dashboard
            </p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
              darkMode
                ? "border-white/10 bg-slate-950/60"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <Mail size={18} className="text-emerald-400" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div
            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 ${
              darkMode
                ? "border-white/10 bg-slate-950/60"
                : "border-slate-200 bg-slate-50"
            }`}
          >
            <Lock size={18} className="text-emerald-400" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-500 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          className={
            darkMode
              ? "mt-6 text-sm text-slate-400"
              : "mt-6 text-sm text-slate-500"
          }
        >
          New user?{" "}
          <Link to="/register" className="font-medium text-emerald-400">
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
