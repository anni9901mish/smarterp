import { useEffect, useState } from "react";
import { Plus, Receipt } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosInstance";

import PurchaseItemRow from "../components/voucher/PurchaseItemRow";
import PurchaseSummary from "../components/voucher/PurchaseSummary";

const emptyRow = {
  itemId: "",
  quantity: 1,
  rate: 0,
  gstPercent: 0,
};

const Sales = () => {
  const companyId = localStorage.getItem("companyId");

  const [customers, setCustomers] = useState([]);
  const [items, setItems] = useState([]);
  const [ledgerId, setLedgerId] = useState("");
  const [rows, setRows] = useState([emptyRow]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    if (!companyId) {
      toast.error("Please select a company first");
      return;
    }

    try {
      const customerRes = await api.get(`/ledger/customers?companyId=${companyId}`);
      const itemRes = await api.get(`/items?companyId=${companyId}`);

      setCustomers(Array.isArray(customerRes.data) ? customerRes.data : []);
      setItems(Array.isArray(itemRes.data) ? itemRes.data : itemRes.data.items || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load sales data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRowChange = (index, field, value) => {
    const updatedRows = [...rows];

    updatedRows[index] = {
      ...updatedRows[index],
      [field]: ["quantity", "rate", "gstPercent"].includes(field)
        ? Number(value)
        : value,
    };

    if (field === "itemId") {
      const selectedItem = items.find((item) => Number(item.id) === Number(value));

      if (selectedItem) {
        updatedRows[index].rate = Number(selectedItem.sellingPrice || 0);
        updatedRows[index].gstPercent = Number(selectedItem.gstPercent || 0);
      }
    }

    setRows(updatedRows);
  };

  const addRow = () => {
    setRows([...rows, { ...emptyRow }]);
  };

  const removeRow = (index) => {
    if (rows.length === 1) {
      toast.error("At least one item is required");
      return;
    }

    setRows(rows.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!ledgerId) {
      toast.error("Please select customer");
      return;
    }

    const validRows = rows.filter(
      (row) => row.itemId && Number(row.quantity) > 0
    );

    if (validRows.length === 0) {
      toast.error("Please add at least one valid item");
      return;
    }

    try {
      setLoading(true);

      await api.post("/vouchers/sales", {
        companyId: Number(companyId),
        ledgerId: Number(ledgerId),
        items: validRows.map((row) => ({
          itemId: Number(row.itemId),
          quantity: Number(row.quantity),
          rate: Number(row.rate),
          gstPercent: Number(row.gstPercent),
        })),
      });

      toast.success("Sales voucher created successfully");

      setLedgerId("");
      setRows([{ ...emptyRow }]);
      fetchData();
   } catch (error) {
  console.log("Sales error:", error.response?.data || error.message);

  toast.error(
    error.response?.data?.error ||
      error.response?.data?.message ||
      "Sales creation failed"
  );
} finally {
  setLoading(false);
}
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-emerald-500/15 p-3 text-emerald-400">
          <Receipt size={28} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Sales Voucher</h1>
          <p className="text-slate-400">
            Create customer bills and reduce stock automatically.
          </p>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <label className="mb-2 block text-sm text-slate-400">
          Select Customer
        </label>

        <select
          className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 outline-none focus:border-emerald-400"
          value={ledgerId}
          onChange={(e) => setLedgerId(e.target.value)}
        >
          <option value="">Choose customer</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {rows.map((row, index) => (
          <PurchaseItemRow
            key={index}
            row={row}
            index={index}
            items={items}
            onChange={handleRowChange}
            onRemove={removeRow}
          />
        ))}

        <button
          onClick={addRow}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 hover:bg-white/10"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <PurchaseSummary rows={rows} />

      <button
        onClick={handleSave}
        disabled={loading}
        className="w-full rounded-2xl bg-emerald-500 py-4 text-lg font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-60"
      >
        {loading ? "Saving Sales..." : "Save Sales Voucher"}
      </button>
    </div>
  );
};

export default Sales;