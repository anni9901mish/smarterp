import { Building2 } from "lucide-react";

const EmptyState = ({ onCreate }) => {
  return (
    <div className="flex min-h-[350px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-10 text-center">
      <div className="rounded-3xl bg-emerald-500/15 p-5 text-emerald-400">
        <Building2 size={42} />
      </div>

      <h2 className="mt-5 text-2xl font-bold">No Company Found</h2>

      <p className="mt-2 max-w-md text-slate-400">
        Create your first company to start managing ledger, stock, purchase and
        sales.
      </p>

      <button
        onClick={onCreate}
        className="mt-6 rounded-2xl bg-emerald-500 px-6 py-3 font-semibold text-slate-950 hover:bg-emerald-400"
      >
        Create Company
      </button>
    </div>
  );
};

export default EmptyState;