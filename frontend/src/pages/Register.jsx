import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosInstance";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      setLoading(true);

      await api.post("/auth/register", form);

      toast.success("Account created successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] px-4 text-white">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-400">
            <ShieldCheck size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Create Account</h1>
            <p className="text-slate-400">Start using SmartERP</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
            <User size={18} className="text-violet-400" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
            <Mail size={18} className="text-violet-400" />
            <input
              className="w-full bg-transparent outline-none"
              placeholder="Email address"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
            <Lock size={18} className="text-violet-400" />
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
            className="w-full rounded-2xl bg-violet-500 py-3 font-semibold text-slate-950 hover:bg-violet-400 disabled:opacity-60"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-violet-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;