import { motion } from "framer-motion";
import { Users, Truck, IndianRupee, Wallet } from "lucide-react";

const formatMoney = (value) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;

const LedgerStats = ({ ledgers }) => {
  const customers = ledgers.filter((l) => l.type === "CUSTOMER");
  const suppliers = ledgers.filter((l) => l.type === "SUPPLIER");

  const receivable = customers.reduce(
    (sum, l) => sum + Number(l.currentBalance || 0),
    0
  );

  const payable = suppliers.reduce(
    (sum, l) => sum + Number(l.currentBalance || 0),
    0
  );

  const stats = [
    { title: "Customers", value: customers.length, icon: Users, color: "text-violet-400" },
    { title: "Suppliers", value: suppliers.length, icon: Truck, color: "text-amber-400" },
    { title: "Receivable", value: formatMoney(receivable), icon: IndianRupee, color: "text-cyan-400" },
    { title: "Payable", value: formatMoney(payable), icon: Wallet, color: "text-rose-400" },
  ];

  return (
    <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-4">
      {stats.map((item, index) => {
        const Icon = item.icon;

        return (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="min-w-0 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl transition hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/10"
          >
            <div className="flex items-start justify-between gap-4 overflow-hidden">
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-slate-400">{item.title}</p>
                <h3
                  title={String(item.value)}
                  className="mt-2 truncate text-2xl font-bold xl:text-3xl"
                >
                  {item.value}
                </h3>
              </div>

              <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 ${item.color}`}>
                <Icon size={24} />
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default LedgerStats;