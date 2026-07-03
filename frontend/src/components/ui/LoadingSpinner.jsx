const LoadingSpinner = ({ text = "Loading data..." }) => {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/5">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-white/10 border-t-emerald-400" />
      <p className="mt-4 text-sm text-slate-400">{text}</p>
    </div>
  );
};

export default LoadingSpinner;