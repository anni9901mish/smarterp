import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useKeyboardShortcuts();

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,#1b1f4b_0%,#0b1020_35%,#070b16_100%)] text-slate-100">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <button
          className="fixed inset-0 z-30 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="min-h-screen lg:pl-72">
        <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-violet-500/10 bg-[#0B1020]/70 px-4 py-3 backdrop-blur-2xl lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="rounded-xl border border-violet-500/20 bg-violet-500/10 p-2 text-violet-300"
          >
            <Menu size={22} />
          </button>

          <h1 className="font-bold">
            Smart
            <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
              ERP
            </span>
          </h1>
        </div>

        <Navbar />

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;