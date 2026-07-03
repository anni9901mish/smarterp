import { useEffect, useState } from "react";
import { Plus, Search, Package } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosInstance";

import ItemStats from "../components/items/ItemStats";
import ItemCard from "../components/items/ItemCard";
import ItemModal from "../components/items/ItemModal";

const emptyForm = {
  name: "",
  code: "",
  hsnCode: "",
  unit: "PCS",
  purchasePrice: 0,
  sellingPrice: 0,
  gstPercent: 0,
  stock: 0,
  minimumStock: 0,
};

const Items = () => {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editItemId, setEditItemId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const companyId = localStorage.getItem("companyId");

  const fetchItems = async () => {
    if (!companyId) {
      toast.error("Please select a company first");
      return;
    }

    try {
      const res = await api.get(`/items?companyId=${companyId}`);
      const data = Array.isArray(res.data) ? res.data : res.data.items || [];
      setItems(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch items");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const openCreateModal = () => {
    setEditItemId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditModal = (item) => {
    setEditItemId(item.id);
    setForm({
      name: item.name || "",
      code: item.code || "",
      hsnCode: item.hsnCode || "",
      unit: item.unit || "PCS",
      purchasePrice: Number(item.purchasePrice || 0),
      sellingPrice: Number(item.sellingPrice || 0),
      gstPercent: Number(item.gstPercent || 0),
      stock: Number(item.stock || 0),
      minimumStock: Number(item.minimumStock || 0),
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      toast.error("Item name is required");
      return;
    }

    try {
      setLoading(true);

      if (editItemId) {
        await api.put(`/items/${editItemId}`, form);
        toast.success("Item updated successfully");
      } else {
        await api.post("/items", {
          ...form,
          companyId: Number(companyId),
        });
        toast.success("Item created successfully");
      }

      setOpen(false);
      setEditItemId(null);
      setForm(emptyForm);
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Item operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await api.delete(`/items/${id}`);
      toast.success("Item deleted successfully");
      fetchItems();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredItems = items.filter((item) =>
    item.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-500/15 p-3 text-cyan-400">
            <Package size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Item / Stock Management</h1>
            <p className="text-slate-400">
              Manage products, GST, pricing and stock levels.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 font-semibold text-slate-950 hover:bg-violet-400"
        >
          <Plus size={18} />
          Add Item
        </button>
      </div>

      <ItemStats items={items} />

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <Search size={18} className="text-violet-400" />
        <input
          placeholder="Search item..."
          className="w-full bg-transparent outline-none placeholder:text-slate-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredItems.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5">
          <Package size={50} className="mb-4 text-slate-500" />
          <h2 className="text-xl font-semibold">No Items Found</h2>
          <p className="mt-2 text-slate-400">
            Add your first stock item.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ItemModal
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={loading}
        editMode={Boolean(editItemId)}
      />
    </div>
  );
};

export default Items;