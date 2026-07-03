import { motion } from "framer-motion";
import { Package, Boxes, AlertTriangle, IndianRupee } from "lucide-react";

const formatCurrency = (value) => {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
};

const ItemStats = ({ items }) => {
  const totalItems = items.length;

  const totalStock = items.reduce(
    (sum, item) => sum + Number(item.stock || 0),
    0
  );

  const lowStock = items.filter(
    (item) => Number(item.stock || 0) <= Number(item.minimumStock || 0)
  ).length;

  const inventoryValue = items.reduce(
    (sum, item) =>
      sum + Number(item.stock || 0) * Number(item.purchasePrice || 0),
    0
  );

  const stats = [
    {
      title: "Total Items",
      value: totalItems,
      icon: Package,
      color: "text-cyan-400",
      bg: "bg-cyan-500/15",
    },
    {
      title: "Total Stock",
      value: totalStock.toLocaleString("en-IN"),
      icon: Boxes,
      color: "text-violet-400",
      bg: "bg-violet-500/15",
    },
    {
      title: "Low Stock",
      value: lowStock,
      icon: AlertTriangle,
      color: "text-red-400",
      bg: "bg-red-500/15",
    },
    {
      title: "Inventory Value",
      value: formatCurrency(inventoryValue),
      icon: IndianRupee,
      color: "text-yellow-400",
      bg: "bg-yellow-500/15",
    },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            whileHover={{ y: -5 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-xl"
          >
            <div className="flex items-center justify-between gap-5">
              <div className="min-w-0 flex-1">
                <p className="text-sm text-slate-400">{stat.title}</p>

                <h2 className="mt-2 break-words text-2xl font-bold leading-tight xl:text-3xl">
                  {stat.value}
                </h2>
              </div>

              <div
                className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${stat.bg} ${stat.color}`}
              >
                <Icon size={26} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default ItemStats;