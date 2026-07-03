import { useEffect, useState } from "react";
import { Eye, Trash2, Search, History } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api from "../api/axiosInstance";
import EmptyState from "../components/ui/EmptyState";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const PurchaseHistory = () => {
  const navigate = useNavigate();
  const companyId = localStorage.getItem("companyId");

  const [vouchers, setVouchers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/vouchers/purchase?companyId=${companyId}`);
      setVouchers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch purchases");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this purchase voucher?")) return;

    try {
      await api.delete(`/vouchers/${id}`);
      toast.success("Purchase voucher deleted");
      fetchPurchases();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const filteredVouchers = vouchers.filter((voucher) => {
    const invoice = voucher.invoiceNo?.toLowerCase() || "";
    const supplier = voucher.ledger?.name?.toLowerCase() || "";
    return invoice.includes(search.toLowerCase()) || supplier.includes(search.toLowerCase());
  });

  if (loading) return <LoadingSpinner text="Loading purchase history..." />;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-violet-500/15 p-3 text-violet-400">
          <History size={28} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Purchase History</h1>
          <p className="text-slate-400">View supplier purchase vouchers.</p>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <Search size={18} className="text-violet-400" />
        <input
          placeholder="Search by invoice or supplier..."
          className="w-full bg-transparent outline-none placeholder:text-slate-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredVouchers.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Purchase Vouchers"
          message="Create a purchase voucher to see supplier purchase history here."
        />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
          <div className="min-w-[850px]">
            <div className="grid grid-cols-5 border-b border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-400">
              <span>Invoice</span>
              <span>Supplier</span>
              <span>Date</span>
              <span>Amount</span>
              <span className="text-right">Actions</span>
            </div>

            {filteredVouchers.map((voucher) => (
              <div
                key={voucher.id}
                className="grid grid-cols-5 items-center border-b border-white/10 px-5 py-4 text-sm transition hover:bg-white/5"
              >
                <span className="font-semibold text-violet-400">{voucher.invoiceNo}</span>
                <span className="truncate">{voucher.ledger?.name || "Unknown Supplier"}</span>
                <span className="text-slate-400">
                  {new Date(voucher.createdAt || voucher.date).toLocaleDateString("en-GB")}
                </span>
                <span className="font-bold">
                  ₹{Number(voucher.totalAmount || 0).toLocaleString("en-IN")}
                </span>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => navigate(`/voucher/${voucher.id}`)}
                    className="rounded-xl bg-white/10 p-2 hover:bg-white/20"
                  >
                    <Eye size={16} />
                  </button>

                  <button
                    onClick={() => handleDelete(voucher.id)}
                    className="rounded-xl bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory;