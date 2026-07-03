const CompanyForm = ({ form, setForm, onSubmit, loading }) => {
  const inputClass =
    "w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-violet-400";

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        className={inputClass}
        placeholder="Company Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        className={inputClass}
        placeholder="GST Number"
        value={form.gstNumber}
        onChange={(e) => setForm({ ...form, gstNumber: e.target.value })}
      />

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-violet-500 py-3 font-semibold text-slate-950 transition hover:bg-violet-400 disabled:opacity-60"
      >
        {loading ? "Creating..." : "Create Company"}
      </button>
    </form>
  );
};

export default CompanyForm;