import { useEffect, useState } from "react";
import { Plus, Search, Users } from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosInstance";

import LedgerStats from "../components/ledger/LedgerStats";
import LedgerCard from "../components/ledger/LedgerCard";
import LedgerModal from "../components/ledger/LedgerModal";

const emptyForm = {
  name: "",
  type: "CUSTOMER",
  mobile: "",
  email: "",
  gstNumber: "",
  address: "",
  openingBalance: 0,
};

const Ledger = () => {
  const [ledgers, setLedgers] = useState([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editLedgerId, setEditLedgerId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const companyId = localStorage.getItem("companyId");

  const fetchLedgers = async () => {
    if (!companyId) {
      toast.error("Please select a company first");
      return;
    }

    try {
      const res = await api.get(`/ledger?companyId=${companyId}`);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.ledgers || [];

      setLedgers(data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch ledgers");
    }
  };

  useEffect(() => {
    fetchLedgers();
  }, []);

  const openCreateModal = () => {
    setEditLedgerId(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const openEditModal = (ledger) => {
    setEditLedgerId(ledger.id);
    setForm({
      name: ledger.name || "",
      type: ledger.type || "CUSTOMER",
      mobile: ledger.mobile || "",
      email: ledger.email || "",
      gstNumber: ledger.gstNumber || "",
      address: ledger.address || "",
      openingBalance: Number(ledger.openingBalance || 0),
    });
    setOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!companyId) {
      toast.error("Please select a company first");
      return;
    }

    if (!form.name.trim()) {
      toast.error("Ledger name is required");
      return;
    }

    try {
      setLoading(true);

      if (editLedgerId) {
        await api.put(`/ledger/${editLedgerId}`, form);
        toast.success("Ledger updated successfully");
      } else {
        await api.post("/ledger", {
          ...form,
          companyId: Number(companyId),
        });
        toast.success("Ledger created successfully");
      }

      setOpen(false);
      setEditLedgerId(null);
      setForm(emptyForm);
      fetchLedgers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Ledger operation failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this ledger?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/ledger/${id}`);
      toast.success("Ledger deleted successfully");
      fetchLedgers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredLedgers = ledgers.filter((ledger) =>
    ledger.name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-400">
            <Users size={28} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">Ledger Management</h1>
            <p className="text-slate-400">
              Manage customers, suppliers and outstanding balances.
            </p>
          </div>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 rounded-2xl bg-violet-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-violet-400"
        >
          <Plus size={18} />
          Add Ledger
        </button>
      </div>

      <LedgerStats ledgers={ledgers} />

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <Search size={18} className="text-violet-400" />

        <input
          placeholder="Search customer or supplier..."
          className="w-full bg-transparent outline-none placeholder:text-slate-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredLedgers.length === 0 ? (
        <div className="flex min-h-[280px] flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5">
          <Users size={50} className="mb-4 text-slate-500" />
          <h2 className="text-xl font-semibold">No Ledger Found</h2>
          <p className="mt-2 text-slate-400">
            Add your first customer or supplier.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
          {filteredLedgers.map((ledger) => (
            <LedgerCard
              key={ledger.id}
              ledger={ledger}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <LedgerModal
        open={open}
        onClose={() => setOpen(false)}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        loading={loading}
        editMode={Boolean(editLedgerId)}
      />
    </div>
  );
};

export default Ledger;