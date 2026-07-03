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
      className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-white/10 bg-[#111827] transition-transform duration-300 lg:translate-x-0 ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-5">
        <div className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 p-4">
          <div>
            <h2 className="text-2xl font-bold">
              Smart<span className="text-emerald-400">ERP</span>
            </h2>
            <p className="mt-1 text-sm text-slate-400">
              Tally-inspired ERP
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-white/10 p-2 lg:hidden"
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
                    ? "bg-emerald-500 font-semibold text-slate-950"
                    : "text-slate-300 hover:bg-white/10 hover:text-white"
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