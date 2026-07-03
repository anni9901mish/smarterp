import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Pencil,
  Trash2,
  BadgeIndianRupee,
  FileText,
} from "lucide-react";

const ItemCard = ({ item, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const stock = Number(item.stock || 0);
  const minimum = Number(item.minimumStock || 0);

  let status = "Healthy";
  let textColor = "text-violet-400";
  let bgColor = "bg-violet-500/15";
  let borderColor = "border-violet-500/30";
  let dotColor = "bg-violet-400";

  if (stock <= 0) {
    status = "Out of Stock";
    textColor = "text-red-400";
    bgColor = "bg-red-500/15";
    borderColor = "border-red-500/30";
    dotColor = "bg-red-400";
  } else if (stock <= minimum) {
    status = "Low Stock";
    textColor = "text-yellow-400";
    bgColor = "bg-yellow-500/15";
    borderColor = "border-yellow-500/30";
    dotColor = "bg-yellow-400";
  }

  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -4 }}
      className="flex h-full flex-col rounded-3xl border border-white/10 bg-gradient-to-br from-[#11142A] to-[#171A3A] p-6 shadow-2xl transition-all duration-300 hover:border-violet-400/40"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
            <Package size={22} />
          </div>

          <div className="min-w-0">
            <h2
              title={item.name}
              className="truncate text-xl font-bold leading-tight"
            >
              {item.name}
            </h2>

            <p className="mt-1 truncate text-sm text-slate-400">
              {item.code || "No Code"}
            </p>
          </div>
        </div>

        <div
          className={`inline-flex shrink-0 items-center gap-2 rounded-full border ${borderColor} ${bgColor} px-3 py-2`}
        >
          <span className={`h-2 w-2 shrink-0 rounded-full ${dotColor}`} />
          <span
            className={`whitespace-nowrap text-xs font-semibold leading-none ${textColor}`}
          >
            {status}
          </span>
        </div>
      </div>

      <div className="mt-6 space-y-2 text-sm text-slate-200">
        <p>
          <span className="text-slate-400">HSN :</span> {item.hsnCode || "-"}
        </p>

        <p>
          <span className="text-slate-400">Unit :</span> {item.unit}
        </p>

        <p>
          <span className="text-slate-400">GST :</span> {item.gstPercent}%
        </p>

        <div className="flex items-center gap-2">
          <BadgeIndianRupee size={15} className="text-slate-400" />
          <span className="text-slate-400">Purchase :</span>
          <span>
            ₹{Number(item.purchasePrice || 0).toLocaleString("en-IN")}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <BadgeIndianRupee size={15} className="text-slate-400" />
          <span className="text-slate-400">Selling :</span>
          <span>
            ₹{Number(item.sellingPrice || 0).toLocaleString("en-IN")}
          </span>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
        <div className="flex justify-between gap-3">
          <span className="text-slate-400">Current Stock</span>
          <span className="text-right text-lg font-bold text-white">
            {item.stock} {item.unit}
          </span>
        </div>

        <div className="mt-3 flex justify-between gap-3">
          <span className="text-slate-400">Minimum Stock</span>
          <span className="text-right font-semibold text-orange-400">
            {item.minimumStock} {item.unit}
          </span>
        </div>
      </div>

      <div className="mt-auto grid grid-cols-3 gap-2 pt-5">
        <button
          onClick={() => navigate(`/items/${item.id}/stock-ledger`)}
          className="flex items-center justify-center gap-2 rounded-xl border border-cyan-500/20 bg-cyan-500/10 py-2.5 text-sm text-cyan-300 hover:bg-cyan-500/20"
        >
          <FileText size={15} />
          <span className="hidden xl:inline">Ledger</span>
        </button>

        <button
          onClick={() => onEdit(item)}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm hover:bg-white/10"
        >
          <Pencil size={15} />
          Edit
        </button>

        <button
          onClick={() => onDelete(item.id)}
          className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 py-2.5 text-sm text-red-400 hover:bg-red-500/20"
        >
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default ItemCard;