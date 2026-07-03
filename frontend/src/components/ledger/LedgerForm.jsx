const LedgerForm = ({ form, setForm, onSubmit, loading, editMode }) => {
  const input =
    "w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: name === "openingBalance" ? Number(value) : value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <input
        className={input}
        placeholder="Ledger Name"
        name="name"
        value={form.name}
        onChange={handleChange}
      />

      <select
        name="type"
        value={form.type}
        onChange={handleChange}
        className={input}
      >
        <option value="CUSTOMER">Customer</option>
        <option value="SUPPLIER">Supplier</option>
      </select>

      <input
        className={input}
        placeholder="Phone"
        name="mobile"
        value={form.mobile}
        onChange={handleChange}
      />

      <input
        className={input}
        placeholder="Email"
        name="email"
        value={form.email}
        onChange={handleChange}
      />

      <input
        className={input}
        placeholder="GST Number"
        name="gstNumber"
        value={form.gstNumber}
        onChange={handleChange}
      />

      <textarea
        className={input}
        placeholder="Address"
        name="address"
        value={form.address}
        onChange={handleChange}
      />

      <input
        className={input}
        placeholder="Opening Balance"
        type="number"
        name="openingBalance"
        value={form.openingBalance}
        onChange={handleChange}
      />

      <button
        disabled={loading}
        className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Saving..." : editMode ? "Update Ledger" : "Create Ledger"}
      </button>
    </form>
  );
};

export default LedgerForm;