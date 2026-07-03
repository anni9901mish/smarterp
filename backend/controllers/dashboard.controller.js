const prisma = require("../config/prisma");

exports.getDashboard = async (req, res) => {
  try {
    const companyId = Number(req.query.companyId);
    const chartType = req.query.chartType || "monthly";

    if (!companyId) {
      return res.status(400).json({ message: "Company Id is required" });
    }

    const [
      customers,
      suppliers,
      itemsCount,
      purchases,
      sales,
      items,
      vouchers,
    ] = await Promise.all([
      prisma.ledger.count({ where: { companyId, type: "CUSTOMER" } }),
      prisma.ledger.count({ where: { companyId, type: "SUPPLIER" } }),
      prisma.item.count({ where: { companyId } }),

      prisma.voucher.aggregate({
        _sum: { totalAmount: true },
        where: { companyId, type: "PURCHASE" },
      }),

      prisma.voucher.aggregate({
        _sum: { totalAmount: true },
        where: { companyId, type: "SALES" },
      }),

      prisma.item.findMany({
        where: { companyId },
        orderBy: { stock: "asc" },
        select: {
          id: true,
          name: true,
          stock: true,
          minimumStock: true,
          unit: true,
          purchasePrice: true,
        },
      }),

      prisma.voucher.findMany({
        where: { companyId, type: "SALES" },
        select: {
          totalAmount: true,
          createdAt: true,
        },
        orderBy: { createdAt: "asc" },
      }),
    ]);

    const inventoryValue = items.reduce((sum, item) => {
      return sum + Number(item.stock || 0) * Number(item.purchasePrice || 0);
    }, 0);

    const lowStock = items.filter((item) => {
      return Number(item.stock || 0) <= Number(item.minimumStock || 0);
    }).length;

    const inventory = items.map((item) => {
      const stock = Number(item.stock || 0);
      const minimumStock = Number(item.minimumStock || 0);

      let status = "Healthy";

      if (stock <= 0 || stock <= minimumStock / 2) {
        status = "Critical";
      } else if (stock <= minimumStock) {
        status = "Low";
      }

      return {
        id: item.id,
        name: item.name,
        stock,
        minimumStock,
        unit: item.unit,
        status,
      };
    });

    const salesMap = {};

    vouchers.forEach((voucher) => {
      const date = new Date(voucher.createdAt);
      let label = "";

      if (chartType === "daily") {
        label = date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        });
      } else if (chartType === "yearly") {
        label = String(date.getFullYear());
      } else {
        label = date.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
      }

      if (!salesMap[label]) {
        salesMap[label] = 0;
      }

      salesMap[label] += Number(voucher.totalAmount || 0);
    });

    const salesChart = Object.keys(salesMap).map((label) => ({
      period: label,
      sales: salesMap[label],
    }));

    res.json({
      customers,
      suppliers,
      items: itemsCount,
      purchase: purchases._sum.totalAmount || 0,
      sales: sales._sum.totalAmount || 0,
      inventoryValue,
      lowStock,
      inventory,
      salesChart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};