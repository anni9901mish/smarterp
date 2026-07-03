import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle2 } from "lucide-react";

const CompanyCard = ({ company, activeCompanyId, onOpen }) => {
  const isActive = Number(activeCompanyId) === Number(company.id);

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.01 }}
      className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl transition hover:border-emerald-400/50 hover:bg-white/10"
    >
      <div className="flex items-start justify-between">
        <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
          <Building2 size={28} />
        </div>

        {isActive && (
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-3 py-1 text-xs text-emerald-400">
            <CheckCircle2 size={14} />
            Active
          </span>
        )}
      </div>

      <h3 className="mt-5 text-xl font-bold">{company.name}</h3>

      <p className="mt-2 text-sm text-slate-400">
        GSTIN: {company.gstNumber || "Not added"}
      </p>

      <button
        onClick={() => onOpen(company)}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-500 px-4 py-3 font-semibold text-slate-950 transition hover:bg-emerald-400"
      >
        Open Company <ArrowRight size={18} />
      </button>
    </motion.div>
  );
};

export default CompanyCard;