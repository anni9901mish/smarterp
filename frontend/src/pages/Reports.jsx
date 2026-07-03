import { useEffect, useState } from "react";
import {
  BarChart3,
  Receipt,
  ShoppingCart,
  Package,
  Users,
  Search,
  TrendingUp,
  Percent,
  CalendarDays,
} from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosInstance";

const tabs = [
  { key: "sales", label: "Sales Report", icon: Receipt },
  { key: "purchase", label: "Purchase Report", icon: ShoppingCart },
  { key: "stock", label: "Stock Report", icon: Package },
  { key: "ledger", label: "Ledger Report", icon: Users },
  { key: "profit", label: "Profit & Loss", icon: TrendingUp },
  { key: "gst", label: "GST Summary", icon: Percent },
  { key: "daybook", label: "Day Book", icon: CalendarDays },
  { key: "trial", label: "Trial Balance", icon: BarChart3 },
];

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

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
      setStock(
        Array.isArray(stockRes.data) ? stockRes.data : stockRes.data.items || []
      );
      setLedger(
        Array.isArray(ledgerRes.data)
          ? ledgerRes.data
          : ledgerRes.data.ledgers || []
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reports");
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const totalSales = sales.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const totalPurchase = purchase.reduce(
    (sum, item) => sum + Number(item.totalAmount || 0),
    0
  );

  const salesGST = sales.reduce(
    (sum, item) => sum + Number(item.gstAmount || 0),
    0
  );

  const purchaseGST = purchase.reduce(
    (sum, item) => sum + Number(item.gstAmount || 0),
    0
  );

  const grossProfit = totalSales - totalPurchase;
  const netGST = salesGST - purchaseGST;

  const hsnSummary = stock.map((item) => ({
    id: item.id,
    hsnCode: item.hsnCode || "-",
    itemName: item.name,
    gstPercent: item.gstPercent || 0,
    stock: item.stock || 0,
    stockValue: Number(item.stock || 0) * Number(item.purchasePrice || 0),
  }));

  const dayBook = [...sales, ...purchase].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const trialBalance = ledger.map((item) => {
    const balance = Number(item.currentBalance || 0);

    return {
      ...item,
      debit: balance >= 0 ? balance : 0,
      credit: balance < 0 ? Math.abs(balance) : 0,
    };
  });

  const data =
    activeTab === "sales"
      ? sales
      : activeTab === "purchase"
      ? purchase
      : activeTab === "stock"
      ? stock
      : activeTab === "ledger"
      ? ledger
      : activeTab === "gst"
      ? hsnSummary
      : activeTab === "daybook"
      ? dayBook
      : activeTab === "trial"
      ? trialBalance
      : [];

  const filteredData = data.filter((item) => {
    const text = JSON.stringify(item).toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalAmount =
    activeTab === "sales" || activeTab === "purchase" || activeTab === "daybook"
      ? data.reduce((sum, item) => sum + Number(item.totalAmount || 0), 0)
      : 0;

  const trialDebit = trialBalance.reduce(
    (sum, item) => sum + Number(item.debit || 0),
    0
  );

  const trialCredit = trialBalance.reduce(
    (sum, item) => sum + Number(item.credit || 0),
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
          <BarChart3 size={28} />
        </div>

        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-slate-400">
            Analyze sales, purchases, inventory, GST and ledger balances.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-4 text-left transition ${
                isActive
                  ? "border-violet-400/50 bg-gradient-to-r from-violet-500 to-cyan-500 text-white"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Icon size={22} className="shrink-0" />
              <span className="truncate font-semibold">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {activeTab === "profit" ? (
        <>
          <div className="grid gap-5 md:grid-cols-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">Total Sales</p>
              <h2 className="mt-2 truncate text-2xl font-bold text-violet-400">
                {formatMoney(totalSales)}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">Total Purchase</p>
              <h2 className="mt-2 truncate text-2xl font-bold text-cyan-400">
                {formatMoney(totalPurchase)}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">Gross Profit</p>
              <h2
                className={`mt-2 truncate text-2xl font-bold ${
                  grossProfit >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {formatMoney(grossProfit)}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">Profit Margin</p>
              <h2 className="mt-2 text-2xl font-bold text-amber-400">
                {totalSales > 0
                  ? `${((grossProfit / totalSales) * 100).toFixed(2)}%`
                  : "0%"}
              </h2>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-xl font-bold">Profit & Loss Summary</h2>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Sales Revenue</span>
                <span className="font-bold">{formatMoney(totalSales)}</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Purchase Cost</span>
                <span className="font-bold">{formatMoney(totalPurchase)}</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Output GST</span>
                <span className="font-bold">{formatMoney(salesGST)}</span>
              </div>

              <div className="flex justify-between border-b border-white/10 pb-3">
                <span className="text-slate-400">Input GST</span>
                <span className="font-bold">{formatMoney(purchaseGST)}</span>
              </div>

              <div className="flex justify-between pt-3 text-lg font-bold">
                <span>Estimated Gross Profit</span>
                <span
                  className={
                    grossProfit >= 0 ? "text-emerald-400" : "text-red-400"
                  }
                >
                  {formatMoney(grossProfit)}
                </span>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
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
                  : activeTab === "gst"
                  ? "Net GST"
                  : activeTab === "daybook"
                  ? "Voucher Total"
                  : activeTab === "trial"
                  ? "Debit Total"
                  : "Total Ledgers"}
              </p>

              <h2 className="mt-2 truncate text-3xl font-bold text-violet-400">
                {activeTab === "sales" ||
                activeTab === "purchase" ||
                activeTab === "daybook"
                  ? formatMoney(totalAmount)
                  : activeTab === "stock"
                  ? stock.reduce((sum, item) => sum + Number(item.stock || 0), 0)
                  : activeTab === "gst"
                  ? formatMoney(netGST)
                  : activeTab === "trial"
                  ? formatMoney(trialDebit)
                  : ledger.length}
              </h2>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm text-slate-400">Current View</p>
              <h2 className="mt-2 truncate text-2xl font-bold">
                {tabs.find((tab) => tab.key === activeTab)?.label}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <Search size={18} className="text-violet-400" />
            <input
              placeholder="Search report..."
              className="w-full bg-transparent outline-none placeholder:text-slate-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-white/5">
            {activeTab === "sales" ||
            activeTab === "purchase" ||
            activeTab === "daybook" ? (
              <div className="min-w-[850px]">
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
                    <span className="font-semibold text-violet-400">
                      {item.invoiceNo}
                    </span>
                    <span>{item.ledger?.name || "-"}</span>
                    <span className="text-slate-400">
                      {new Date(item.createdAt).toLocaleDateString("en-GB")}
                    </span>
                    <span className="font-bold">
                      {formatMoney(item.totalAmount)}
                    </span>
                    <span>{item.type}</span>
                  </div>
                ))}
              </div>
            ) : activeTab === "stock" ? (
              <div className="min-w-[850px]">
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
                    <span>
                      {item.stock} {item.unit}
                    </span>
                    <span>{item.minimumStock}</span>
                    <span className="font-bold text-violet-400">
                      {formatMoney(item.stock * item.purchasePrice)}
                    </span>
                  </div>
                ))}
              </div>
            ) : activeTab === "gst" ? (
              <div className="min-w-[850px]">
                <div className="grid grid-cols-5 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-400">
                  <span>HSN</span>
                  <span>Item</span>
                  <span>GST %</span>
                  <span>Stock</span>
                  <span>Stock Value</span>
                </div>

                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-5 border-t border-white/10 px-5 py-4 text-sm"
                  >
                    <span>{item.hsnCode}</span>
                    <span className="font-semibold">{item.itemName}</span>
                    <span>{item.gstPercent}%</span>
                    <span>{item.stock}</span>
                    <span className="font-bold text-violet-400">
                      {formatMoney(item.stockValue)}
                    </span>
                  </div>
                ))}
              </div>
            ) : activeTab === "trial" ? (
              <div className="min-w-[850px]">
                <div className="grid grid-cols-5 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-400">
                  <span>Ledger</span>
                  <span>Type</span>
                  <span>Mobile</span>
                  <span>Debit</span>
                  <span>Credit</span>
                </div>

                {filteredData.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-5 border-t border-white/10 px-5 py-4 text-sm"
                  >
                    <span className="font-semibold">{item.name}</span>
                    <span>{item.type}</span>
                    <span>{item.mobile || "-"}</span>
                    <span className="font-bold text-emerald-400">
                      {item.debit ? formatMoney(item.debit) : "-"}
                    </span>
                    <span className="font-bold text-amber-400">
                      {item.credit ? formatMoney(item.credit) : "-"}
                    </span>
                  </div>
                ))}

                <div className="grid grid-cols-5 border-t border-white/10 bg-white/5 px-5 py-4 text-sm font-bold">
                  <span>Total</span>
                  <span></span>
                  <span></span>
                  <span className="text-emerald-400">
                    {formatMoney(trialDebit)}
                  </span>
                  <span className="text-amber-400">
                    {formatMoney(trialCredit)}
                  </span>
                </div>
              </div>
            ) : (
              <div className="min-w-[850px]">
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
                    <span className="font-bold text-violet-400">
                      {formatMoney(item.currentBalance)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {filteredData.length === 0 && (
              <div className="flex h-52 items-center justify-center text-slate-500">
                No report data found.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Reports;