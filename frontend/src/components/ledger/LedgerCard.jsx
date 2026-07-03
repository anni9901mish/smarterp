import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User,
  Truck,
  Phone,
  Mail,
  BadgeIndianRupee,
  Pencil,
  Trash2,
  FileText,
} from "lucide-react";

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const LedgerCard = ({ ledger, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const isCustomer = ledger.type === "CUSTOMER";
  const Icon = isCustomer ? User : Truck;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      className="flex h-full min-w-0 flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl transition hover:border-violet-400/40 hover:bg-white/10"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 gap-3">
          <div
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${
              isCustomer
                ? "bg-violet-500/15 text-violet-400"
                : "bg-amber-500/15 text-amber-400"
            }`}
          >
            <Icon size={24} />
          </div>

          <div className="min-w-0">
            <h3 title={ledger.name} className="truncate text-lg font-bold">
              {ledger.name}
            </h3>

            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                isCustomer
                  ? "bg-violet-500/15 text-violet-400"
                  : "bg-amber-500/15 text-amber-400"
              }`}
            >
              {isCustomer ? "Customer" : "Supplier"}
            </span>
          </div>
        </div>

        <div className="min-w-0 shrink-0 text-right">
          <p className="text-xs text-slate-400">
            {isCustomer ? "Receivable" : "Payable"}
          </p>

          <p
            title={formatMoney(ledger.currentBalance)}
            className="mt-1 max-w-[120px] truncate text-lg font-bold text-violet-400 xl:text-xl"
          >
            {formatMoney(ledger.currentBalance)}
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3 text-sm text-slate-300">
        <p className="flex min-w-0 items-center gap-2">
          <Phone size={15} className="shrink-0 text-slate-500" />
          <span title={ledger.mobile} className="truncate">
            {ledger.mobile || "Phone not added"}
          </span>
        </p>

        <p className="flex min-w-0 items-center gap-2">
          <Mail size={15} className="shrink-0 text-slate-500" />
          <span title={ledger.email} className="truncate">
            {ledger.email || "Email not added"}
          </span>
        </p>

        <p className="flex min-w-0 items-center gap-2">
          <BadgeIndianRupee size={15} className="shrink-0 text-slate-500" />
          <span title={ledger.gstNumber} className="truncate">
            GST: {ledger.gstNumber || "Not added"}
          </span>
        </p>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
        <button
          onClick={() => navigate(`/ledger/${ledger.id}/statement`)}
          className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 py-2.5 text-sm text-violet-300 hover:bg-violet-500/20"
        >
          <FileText size={15} />
          <span className="hidden xl:inline">Statement</span>
        </button>

        <button
          onClick={() => onEdit(ledger)}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm hover:bg-white/10"
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          onClick={() => onDelete(ledger.id)}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm text-red-400 hover:bg-red-500/20"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default LedgerCard;