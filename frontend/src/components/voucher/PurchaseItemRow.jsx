import { Trash2 } from "lucide-react";

const PurchaseItemRow = ({ row, index, items, onChange, onRemove }) => {
  const amount =
    Number(row.quantity || 0) *
    Number(row.rate || 0) *
    (1 + Number(row.gstPercent || 0) / 100);

  const input =
    "w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2 outline-none focus:border-emerald-400";

  return (
    <div className="grid gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 md:grid-cols-6">
      <select
        className={`${input} md:col-span-2`}
        value={row.itemId}
        onChange={(e) => onChange(index, "itemId", e.target.value)}
      >
        <option value="">Select Item</option>
        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name} - Stock {item.stock}
          </option>
        ))}
      </select>

      <input
        className={input}
        type="number"
        placeholder="Qty"
        value={row.quantity}
        onChange={(e) => onChange(index, "quantity", e.target.value)}
      />

      <input
        className={input}
        type="number"
        placeholder="Rate"
        value={row.rate}
        onChange={(e) => onChange(index, "rate", e.target.value)}
      />

      <input
        className={input}
        type="number"
        placeholder="GST %"
        value={row.gstPercent}
        onChange={(e) => onChange(index, "gstPercent", e.target.value)}
      />

      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold text-emerald-400">
          ₹{amount.toLocaleString()}
        </p>

        <button
          type="button"
          onClick={() => onRemove(index)}
          className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default PurchaseItemRow;