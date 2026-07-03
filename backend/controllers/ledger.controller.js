const prisma = require("../config/prisma");

exports.createLedger = async (req, res) => {
  try {
    const {
      companyId,
      name,
      type,
      mobile,
      email,
      gstNumber,
      address,
      openingBalance,
    } = req.body;

    if (!companyId || !name || !type) {
      return res.status(400).json({
        message: "Company, Name and Type are required",
      });
    }

    const ledger = await prisma.ledger.create({
      data: {
        companyId: Number(companyId),
        name,
        type,
        mobile,
        email,
        gstNumber,
        address,
        openingBalance: Number(openingBalance || 0),
        currentBalance: Number(openingBalance || 0),
      },
    });

    res.status(201).json({
      message: "Ledger created successfully",
      ledger,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ledger",
      error: error.message,
    });
  }
};

exports.getLedgers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const ledgers = await prisma.ledger.findMany({
      where: {
        companyId: Number(companyId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(ledgers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getLedgerStatement = async (req, res) => {
  try {
    const { id } = req.params;

    const ledger = await prisma.ledger.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        vouchers: {
          orderBy: {
            createdAt: "asc",
          },
          include: {
            items: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    });

    if (!ledger) {
      return res.status(404).json({
        message: "Ledger not found",
      });
    }

    let runningBalance = Number(ledger.openingBalance || 0);

    const transactions = ledger.vouchers.map((voucher) => {
      const amount = Number(voucher.totalAmount || 0);

      let debit = 0;
      let credit = 0;

      if (ledger.type === "CUSTOMER") {
        debit = voucher.type === "SALES" ? amount : 0;
        credit = voucher.type === "PURCHASE" ? amount : 0;
      }

      if (ledger.type === "SUPPLIER") {
        debit = voucher.type === "PURCHASE" ? amount : 0;
        credit = voucher.type === "SALES" ? amount : 0;
      }

      runningBalance = runningBalance + debit - credit;

      return {
        id: voucher.id,
        date: voucher.date || voucher.createdAt,
        invoiceNo: voucher.invoiceNo,
        voucherType: voucher.type,
        debit,
        credit,
        balance: runningBalance,
        totalAmount: amount,
        items: voucher.items,
      };
    });

    res.json({
      ledger: {
        id: ledger.id,
        name: ledger.name,
        type: ledger.type,
        mobile: ledger.mobile,
        email: ledger.email,
        gstNumber: ledger.gstNumber,
        address: ledger.address,
        openingBalance: ledger.openingBalance,
        currentBalance: ledger.currentBalance,
      },
      transactions,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, mobile, email, gstNumber, address, openingBalance } = req.body;

    const ledger = await prisma.ledger.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!ledger) {
      return res.status(404).json({
        message: "Ledger not found",
      });
    }

    const updatedLedger = await prisma.ledger.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        mobile,
        email,
        gstNumber,
        address,
        openingBalance: Number(openingBalance || 0),
      },
    });

    res.json({
      message: "Ledger updated successfully",
      ledger: updatedLedger,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteLedger = async (req, res) => {
  try {
    const { id } = req.params;

    const ledger = await prisma.ledger.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!ledger) {
      return res.status(404).json({
        message: "Ledger not found",
      });
    }

    await prisma.ledger.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Ledger deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const customers = await prisma.ledger.findMany({
      where: {
        companyId: Number(companyId),
        type: "CUSTOMER",
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(customers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getSuppliers = async (req, res) => {
  try {
    const { companyId } = req.query;

    const suppliers = await prisma.ledger.findMany({
      where: {
        companyId: Number(companyId),
        type: "SUPPLIER",
      },
      orderBy: {
        name: "asc",
      },
    });

    res.json(suppliers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};