import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  IndianRupee,
  ShoppingCart,
  Package,
  Users,
  TriangleAlert,
  CircleCheckBig,
  AlertCircle,
  Truck,
} from "lucide-react";
import { toast } from "sonner";
import api from "../api/axiosInstance";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const getStatusStyle = (status) => {
  if (status === "Critical") {
    return {
      border: "border-l-red-500",
      badge: "bg-red-500/15 text-red-400",
      bar: "bg-red-500",
      icon: TriangleAlert,
    };
  }

  if (status === "Low") {
    return {
      border: "border-l-amber-500",
      badge: "bg-amber-500/15 text-amber-400",
      bar: "bg-amber-400",
      icon: AlertCircle,
    };
  }

  return {
    border: "border-l-violet-500",
    badge: "bg-violet-500/15 text-violet-400",
    bar: "bg-violet-500",
    icon: CircleCheckBig,
  };
};

const compactMoney = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
};

const Dashboard = () => {
  const companyId = localStorage.getItem("companyId");

  const [dashboard, setDashboard] = useState({
    customers: 0,
    suppliers: 0,
    items: 0,
    purchase: 0,
    sales: 0,
    inventoryValue: 0,
    lowStock: 0,
    inventory: [],
    salesChart: [],
  });

  const [chartType, setChartType] = useState("monthly");

  const fetchDashboard = async () => {
    if (!companyId) {
      toast.error("Please select a company first");
      return;
    }

    try {
      const res = await api.get(
        `/dashboard?companyId=${companyId}&chartType=${chartType}`,
      );

      setDashboard({
        customers: res.data.customers || 0,
        suppliers: res.data.suppliers || 0,
        items: res.data.items || 0,
        purchase: res.data.purchase || 0,
        sales: res.data.sales || 0,
        inventoryValue: res.data.inventoryValue || 0,
        lowStock: res.data.lowStock || 0,
        inventory: res.data.inventory || [],
        salesChart: res.data.salesChart || [],
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load dashboard");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, [chartType]);

  const stats = [
    {
      title: "Total Sales",
      value: compactMoney(dashboard.sales),
      icon: IndianRupee,
      change: "Live",
    },
    {
      title: "Total Purchase",
      value: compactMoney(dashboard.purchase),
      icon: ShoppingCart,
      change: "Live",
    },
    {
      title: "Stock Items",
      value: Number(dashboard.items || 0).toLocaleString("en-IN"),
      icon: Package,
      change: `${dashboard.lowStock} Low Stock`,
    },
    {
      title: "Customers",
      value: Number(dashboard.customers || 0).toLocaleString("en-IN"),
      icon: Users,
      change: `${dashboard.suppliers} Suppliers`,
    },
  ];

  const chartData =
    dashboard.salesChart.length > 0
      ? dashboard.salesChart
      : [{ period: "No Sales", sales: 0 }];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-slate-400">
          Live overview of your billing, inventory and accounting.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl transition hover:-translate-y-1 hover:border-violet-400/50 hover:bg-white/10"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm text-slate-400">
                    {item.title}
                  </h2>

                  <p
                    title={String(item.value)}
                    className="mt-2 truncate text-2xl font-bold leading-tight xl:text-3xl"
                  >
                    {item.value}
                  </p>
                </div>

                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-violet-500/15 text-violet-400">
                  <Icon size={24} />
                </div>
              </div>

              <span className="mt-4 inline-block rounded-full bg-violet-500/10 px-3 py-1 text-xs text-violet-400">
                {item.change}
              </span>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/15 text-cyan-400">
              <Truck size={22} />
            </div>

            <div className="min-w-0">
              <h2 className="text-xl font-semibold">Inventory Value</h2>
              <p className="text-slate-400">
                Stock value based on purchase price
              </p>
            </div>
          </div>

          <p
            title={compactMoney(dashboard.inventoryValue)}
            className="mt-6 truncate text-3xl font-bold text-cyan-400 xl:text-4xl"
          >
            {compactMoney(dashboard.inventoryValue)}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/15 text-red-400">
              <TriangleAlert size={22} />
            </div>

            <div>
              <h2 className="text-xl font-semibold">Low Stock Items</h2>
              <p className="text-slate-400">Items below minimum stock level</p>
            </div>
          </div>

          <p className="mt-6 text-4xl font-bold text-red-400">
            {dashboard.lowStock}
          </p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:col-span-2">
          <h2 className="text-xl font-semibold">Sales Analytics</h2>
          <p className="mt-2 text-slate-400">
            Sales performance from real sales vouchers.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {["daily", "monthly", "yearly"].map((type) => (
              <button
                key={type}
                onClick={() => setChartType(type)}
                className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  chartType === type
                    ? "bg-violet-500 text-slate-950"
                    : "bg-white/10 text-slate-300 hover:bg-white/20"
                }`}
              >
                {type.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="mt-6 h-72">
            {dashboard.salesChart.length <= 1 ? (
              <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-slate-950/40 text-center">
                <div className="mb-4 rounded-2xl bg-violet-500/15 p-4 text-violet-400">
                  <IndianRupee size={34} />
                </div>

                <h3 className="text-xl font-bold">Not Enough Sales Data</h3>

                <p className="mt-2 max-w-sm text-sm text-slate-400">
                  Create sales vouchers on different dates/months to generate a
                  proper analytics graph.
                </p>

                <div className="mt-5 rounded-full bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-400">
                  Current Sales: ₹
                  {Number(dashboard.sales || 0).toLocaleString("en-IN")}
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={chartData}
                  margin={{ top: 10, right: 20, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="salesGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#10b981"
                        stopOpacity={0.35}
                      />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="rgba(255,255,255,0.08)"
                  />

                  <XAxis
                    dataKey="period"
                    stroke="#94a3b8"
                    tickLine={false}
                    axisLine={false}
                  />

                  <YAxis
                    stroke="#94a3b8"
                    width={70}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => {
                      if (value >= 10000000)
                        return `${(value / 10000000).toFixed(1)}Cr`;
                      if (value >= 100000)
                        return `${(value / 100000).toFixed(1)}L`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value;
                    }}
                  />

                  <Tooltip
                    formatter={(value) => [
                      `₹${Number(value).toLocaleString("en-IN")}`,
                      "Sales",
                    ]}
                    labelStyle={{ color: "#e2e8f0" }}
                    contentStyle={{
                      background: "#0f172a",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "16px",
                      color: "#fff",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="sales"
                    stroke="#10b981"
                    strokeWidth={3}
                    fill="url(#salesGradient)"
                    dot={{
                      r: 5,
                      strokeWidth: 3,
                      fill: "#10b981",
                      stroke: "#ffffff",
                    }}
                    activeDot={{
                      r: 8,
                      fill: "#10b981",
                      stroke: "#ffffff",
                      strokeWidth: 3,
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">Inventory Health</h2>
              <p className="mt-1 text-sm text-slate-400">
                Stock items requiring attention
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-400">
              {dashboard.inventory.length} Items
            </span>
          </div>

          <div className="max-h-[520px] space-y-3 overflow-y-auto pr-2">
            {dashboard.inventory.length === 0 ? (
              <div className="flex h-48 items-center justify-center text-slate-500">
                No inventory available
              </div>
            ) : (
              dashboard.inventory.map((item) => {
                const style = getStatusStyle(item.status);

                const percentage = Math.min(
                  100,
                  Math.max(
                    8,
                    (Number(item.stock || 0) /
                      Math.max(Number(item.minimumStock || 1), 1)) *
                      100,
                  ),
                );

                return (
                  <motion.div
                    key={item.id}
                    whileHover={{ scale: 1.01 }}
                    className={`rounded-2xl border border-white/10 border-l-4 ${style.border} bg-slate-950/60 p-4 transition hover:bg-slate-900`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3
                          title={item.name}
                          className="truncate text-sm font-semibold text-white"
                        >
                          {item.name}
                        </h3>

                        <div className="mt-3 flex items-center gap-2">
                          <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
                            <div
                              className={`h-full rounded-full ${style.bar}`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>

                          <span className="shrink-0 text-xs text-slate-400">
                            {item.stock}
                          </span>
                        </div>

                        <div className="mt-2 flex justify-between gap-3 text-xs">
                          <span className="truncate text-slate-500">
                            Min: {item.minimumStock}
                          </span>

                          <span className="shrink-0 text-slate-500">
                            {item.unit || "PCS"}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${style.badge}`}
                      >
                        {item.status}
                      </span>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
