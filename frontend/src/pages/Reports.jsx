import { useEffect, useState } from "react";
import {
  BarChart3,
  Receipt,
  ShoppingCart,
  Package,
  Users,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosInstance";

const tabs = [
  { key: "sales", label: "Sales Report", icon: Receipt },
  { key: "purchase", label: "Purchase Report", icon: ShoppingCart },
  { key: "stock", label: "Stock Report", icon: Package },
  { key: "ledger", label: "Ledger Report", icon: Users },
];

const Reports = () => {
  const companyId = localStorage.getItem("companyId");

  const [activeTab, setActiveTab] = useState("sales");
  const [search, setSearch] = useState("");
  const [sales, setSales] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [stock, setStock] = useState([]);
  const [ledger, setLedger] = useState([]);

  const fetchReports = async () => {
    try {
      const [salesRes, purchaseRes, stockRes, ledgerRes] = await Promise.all([
        api.get(`/vouchers/sales?companyId=${companyId}`),
        api.get(`/vouchers/purchase?companyId=${companyId}`),
        api.get(`/items?companyId=${companyId}`),
        api.get(`/ledger?companyId=${companyId}`),
      ]);

      setSales(Array.isArray(salesRes.data) ? salesRes.data : []);
      setPurchase(Array.isArray(purchaseRes.data) ? purchaseRes.data : []);
      setStock(Array.isArray(stockRes.data) ? stockRes.data : stockRes.data.items || []);
      setLedger(Array.isArray(ledgerRes.data) ? ledgerRes.data : ledgerRes.data.ledgers || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const data =
    activeTab === "sales"
      ? sales
      : activeTab === "purchase"
      ? purchase
      : activeTab === "stock"
      ? stock
      : ledger;

  const filteredData = data.filter((item) => {
    const text = JSON.stringify(item).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalAmount =
    activeTab === "sales" || activeTab === "purchase"
      ? data.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-400">
          <BarChart3 size={28} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-slate-400">
            Analyze sales, purchases, inventory and ledger balances in one place.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                isActive
                  ? "border-emerald-400/50 bg-emerald-500 text-slate-950"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon size={22} />
              <span className="font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Total Records</p>
          <h2 className="mt-2 text-3xl font-bold">{data.length}</h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">
            {activeTab === "sales"
              ? "Total Sales"
              : activeTab === "purchase"
              ? "Total Purchase"
              : activeTab === "stock"
              ? "Total Stock"
              : "Total Ledgers"}
          </p>

          <h2 className="mt-2 text-3xl font-bold text-emerald-400">
            {activeTab === "sales" || activeTab === "purchase"
              ? `₹${totalAmount.toLocaleString("en-IN")}`
              : activeTab === "stock"
              ? stock.reduce((sum, item) => sum + Number(item.stock || 0), 0)
              : ledger.length}
          </h2>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-slate-400">Current View</p>
          <h2 className="mt-2 text-2xl font-bold">
            {tabs.find((tab) => tab.key === activeTab)?.label}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
        <Search size={18} className="text-emerald-400" />
        <input
          placeholder="Search report..."
          className="w-full bg-transparent outline-none placeholder:text-slate-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
        {activeTab === "sales" || activeTab === "purchase" ? (
          <>
            <div className="grid grid-cols-5 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-400">
              <span>Invoice</span>
              <span>Party</span>
              <span>Date</span>
              <span>Amount</span>
              <span>Type</span>
            </div>

            {filteredData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 border-t border-white/10 px-5 py-4 text-sm"
              >
                <span className="font-semibold text-emerald-400">
                  {item.invoiceNo}
                </span>
                <span>{item.ledger?.name || "-"}</span>
                <span className="text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString("en-GB")}
                </span>
                <span className="font-bold">
                  ₹{Number(item.totalAmount || 0).toLocaleString("en-IN")}
                </span>
                <span>{item.type}</span>
              </div>
            ))}
          </>
        ) : activeTab === "stock" ? (
          <>
            <div className="grid grid-cols-5 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-400">
              <span>Item</span>
              <span>Code</span>
              <span>Stock</span>
              <span>Min Stock</span>
              <span>Value</span>
            </div>

            {filteredData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 border-t border-white/10 px-5 py-4 text-sm"
              >
                <span className="font-semibold">{item.name}</span>
                <span>{item.code || "-"}</span>
                <span>{item.stock} {item.unit}</span>
                <span>{item.minimumStock}</span>
                <span className="font-bold text-emerald-400">
                  ₹{Number(item.stock * item.purchasePrice || 0).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="grid grid-cols-5 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-400">
              <span>Name</span>
              <span>Type</span>
              <span>Mobile</span>
              <span>GST</span>
              <span>Balance</span>
            </div>

            {filteredData.map((item) => (
              <div
                key={item.id}
                className="grid grid-cols-5 border-t border-white/10 px-5 py-4 text-sm"
              >
                <span className="font-semibold">{item.name}</span>
                <span>{item.type}</span>
                <span>{item.mobile || "-"}</span>
                <span>{item.gstNumber || "-"}</span>
                <span className="font-bold text-emerald-400">
                  ₹{Number(item.currentBalance || 0).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </>
        )}

        {filteredData.length === 0 && (
          <div className="flex h-52 items-center justify-center text-slate-500">
            No report data found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;