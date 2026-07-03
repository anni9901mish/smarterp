import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  ShoppingCart,
  Receipt,
  BarChart3,
  History,
  ReceiptText,
  X,
} from "lucide-react";

const links = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Company", path: "/company", icon: Building2 },
  { name: "Ledger", path: "/ledger", icon: Users },
  { name: "Items", path: "/items", icon: Package },
  { name: "Purchase", path: "/purchase", icon: ShoppingCart },
  { name: "Purchase History", path: "/purchase-history", icon: History },
  { name: "Sales", path: "/sales", icon: Receipt },
  { name: "Sales History", path: "/sales-history", icon: ReceiptText },
  { name: "Reports", path: "/reports", icon: BarChart3 },
];

const Sidebar = ({ open, onClose }) => {
  return (
    <aside
      className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-violet-500/10 bg-gradient-to-b from-[#111633] via-[#0b1023] to-[#060914] transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between rounded-3xl border border-violet-500/10 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 p-4 shadow-2xl shadow-black/30">
          <div>
            <h2 className="text-2xl font-bold">
              Smart
              <span className="bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-transparent">
                ERP
              </span>
            </h2>
            <p className="mt-1 text-sm text-slate-400">Tally-inspired ERP</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-violet-500/10 p-2 text-violet-300 lg:hidden"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-5 pb-5">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <NavLink
              key={link.path}
              to={link.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition ${
                  isActive
                    ? "bg-gradient-to-r from-violet-500 to-cyan-500 font-semibold text-white shadow-lg shadow-violet-500/30"
                    : "text-slate-300 hover:bg-violet-500/10 hover:text-white"
                }`
              }
            >
              <Icon size={18} className="shrink-0" />
              <span className="truncate">{link.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;