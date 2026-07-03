import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, LogOut, UserCircle } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("No company selected");
  const [user, setUser] = useState(null);

  useEffect(() => {
    setCompanyName(localStorage.getItem("companyName") || "No company selected");

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("companyId");
    localStorage.removeItem("companyName");

    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-10 hidden border-b border-violet-500/10 bg-[#0B1020]/60 px-6 py-4 backdrop-blur-2xl lg:block">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-violet-500/10 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-4 py-3 shadow-2xl shadow-black/20">
          <Building2 size={18} className="shrink-0 text-cyan-400" />

          <div className="min-w-0">
            <p className="text-xs text-slate-400">Active Company</p>
            <h2
              title={companyName}
              className="truncate text-sm font-semibold text-white"
            >
              {companyName}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 rounded-2xl border border-violet-500/10 bg-gradient-to-r from-[#141b3a] to-[#1b2148] px-4 py-3 shadow-2xl shadow-black/20 md:flex">
            <UserCircle size={20} className="text-cyan-400" />
            <div>
              <p className="text-xs text-slate-400">Logged in as</p>
              <p className="text-sm font-semibold">
                {user?.name || user?.email || "User"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-2xl border border-rose-500/20 bg-gradient-to-r from-rose-500/20 to-red-500/20 px-4 py-3 text-sm font-semibold text-rose-300 hover:from-rose-500/30 hover:to-red-500/30"
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;