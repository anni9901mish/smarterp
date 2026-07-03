import { Package, BadgeIndianRupee, Boxes } from "lucide-react";

const Field = ({ label, helper, children, required }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-slate-300">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
    {helper && <p className="mt-1 text-xs text-slate-500">{helper}</p>}
  </div>
);

const SectionTitle = ({ icon: Icon, title }) => (
  <div className="flex items-center gap-2 border-b border-white/10 pb-2">
    <Icon size={18} className="text-emerald-400" />
    <h3 className="font-semibold">{title}</h3>
  </div>
);

const ItemForm = ({ form, setForm, onSubmit, loading, editMode }) => {
  const input =
    "w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 outline-none placeholder:text-slate-600 focus:border-emerald-400";

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm({
      ...form,
      [name]: [
        "purchasePrice",
        "sellingPrice",
        "gstPercent",
        "stock",
        "minimumStock",
      ].includes(name)
        ? Number(value)
        : value,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-7">
      <div className="space-y-4">
        <SectionTitle icon={Package} title="Item Information" />

        <Field
          label="Item Name"
          required
          helper="Name that will appear on purchase and sales invoices."
        >
          <input
            className={input}
            name="name"
            placeholder="e.g. Paracetamol 650mg"
            value={form.name}
            onChange={handleChange}
          />
        </Field>

        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Item Code" helper="Short internal code for quick search.">
            <input
              className={input}
              name="code"
              placeholder="e.g. PARA-650"
              value={form.code}
              onChange={handleChange}
            />
          </Field>

          <Field label="HSN Code" helper="GST classification code.">
            <input
              className={input}
              name="hsnCode"
              placeholder="e.g. 3004"
              value={form.hsnCode}
              onChange={handleChange}
            />
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle icon={BadgeIndianRupee} title="Pricing & GST" />

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Purchase Price" helper="Price at which you buy this item.">
            <input
              className={input}
              type="number"
              name="purchasePrice"
              placeholder="e.g. 82"
              value={form.purchasePrice}
              onChange={handleChange}
            />
          </Field>

          <Field label="Selling Price" helper="Price charged to customer.">
            <input
              className={input}
              type="number"
              name="sellingPrice"
              placeholder="e.g. 120"
              value={form.sellingPrice}
              onChange={handleChange}
            />
          </Field>

          <Field label="GST %" helper="Tax rate applied on this item.">
            <select
              className={input}
              name="gstPercent"
              value={form.gstPercent}
              onChange={handleChange}
            >
              <option value={0}>0%</option>
              <option value={5}>5%</option>
              <option value={12}>12%</option>
              <option value={18}>18%</option>
              <option value={28}>28%</option>
            </select>
          </Field>
        </div>
      </div>

      <div className="space-y-4">
        <SectionTitle icon={Boxes} title="Inventory" />

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Unit" helper="How this item is measured.">
            <select
              className={input}
              name="unit"
              value={form.unit}
              onChange={handleChange}
            >
              <option value="PCS">PCS</option>
              <option value="BOX">BOX</option>
              <option value="KG">KG</option>
              <option value="LTR">LTR</option>
              <option value="STRIP">STRIP</option>
              <option value="PACK">PACK</option>
              <option value="DOZEN">DOZEN</option>
            </select>
          </Field>

          <Field label="Opening Stock" helper="Current available quantity.">
            <input
              className={input}
              type="number"
              name="stock"
              placeholder="e.g. 100"
              value={form.stock}
              onChange={handleChange}
            />
          </Field>

          <Field
            label="Minimum Stock"
            helper="Low stock alert will show below this quantity."
          >
            <input
              className={input}
              type="number"
              name="minimumStock"
              placeholder="e.g. 20"
              value={form.minimumStock}
              onChange={handleChange}
            />
          </Field>
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full rounded-xl bg-emerald-500 py-3 font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Saving..." : editMode ? "Update Item" : "Create Item"}
      </button>
    </form>
  );
};

export default ItemForm;