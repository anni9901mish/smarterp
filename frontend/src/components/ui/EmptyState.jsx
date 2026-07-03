import { PackageSearch } from "lucide-react";

const EmptyState = ({
  icon: Icon = PackageSearch,
  title = "No Data Found",
  message = "There is nothing to show here yet.",
}) => {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
      <div className="mb-4 rounded-2xl bg-white/10 p-4 text-slate-400">
        <Icon size={42} />
      </div>

      <h2 className="text-xl font-bold text-white">{title}</h2>

      <p className="mt-2 max-w-md text-sm text-slate-400">{message}</p>
    </div>
  );
};

export default EmptyState;