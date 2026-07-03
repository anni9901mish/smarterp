const prisma = require("../config/prisma");

const calculateTotal = require("../utils/calculateTotal");
const generateInvoice = require("../utils/generateInvoice");

class VoucherService {
  async createPurchaseVoucher(data) {
    const { companyId, ledgerId, items } = data;

    if (!companyId || !ledgerId || !items || items.length === 0) {
      throw new Error("Company, supplier and items are required");
    }

    const totals = calculateTotal(items);

    const voucherCount = await prisma.voucher.count({
      where: {
        companyId: Number(companyId),
        type: "PURCHASE",
      },
    });

    const invoiceNo = generateInvoice("PURCHASE", voucherCount);

    const result = await prisma.$transaction(async (tx) => {
      const voucher = await tx.voucher.create({
        data: {
          companyId: Number(companyId),
          ledgerId: Number(ledgerId),
          type: "PURCHASE",
          invoiceNo,
          subtotal: totals.subtotal,
          gstAmount: totals.gstAmount,
          totalAmount: totals.totalAmount,
        },
      });

      for (const item of totals.items) {
        await tx.voucherItem.create({
          data: {
            voucherId: voucher.id,
            itemId: Number(item.itemId),
            quantity: item.quantity,
            rate: item.rate,
            gstAmount: item.gstAmount,
            amount: item.amount,
          },
        });

        await tx.item.update({
          where: {
            id: Number(item.itemId),
          },
          data: {
            stock: {
              increment: item.quantity,
            },
          },
        });
      }

      await tx.ledger.update({
        where: {
          id: Number(ledgerId),
        },
        data: {
          currentBalance: {
            increment: totals.totalAmount,
          },
        },
      });

      return voucher;
    });

    return {
      message: "Purchase voucher created successfully",
      voucher: result,
    };
  }

  async createSalesVoucher(data) {
    const { companyId, ledgerId, items } = data;

    if (!companyId || !ledgerId || !items || items.length === 0) {
      throw new Error("Company, customer and items are required");
    }

    const totals = calculateTotal(items);

    const voucherCount = await prisma.voucher.count({
      where: {
        companyId: Number(companyId),
        type: "SALES",
      },
    });

    const invoiceNo = generateInvoice("SALES", voucherCount);

    const result = await prisma.$transaction(async (tx) => {
      const voucher = await tx.voucher.create({
        data: {
          companyId: Number(companyId),
          ledgerId: Number(ledgerId),
          type: "SALES",
          invoiceNo,
          subtotal: totals.subtotal,
          gstAmount: totals.gstAmount,
          totalAmount: totals.totalAmount,
        },
      });

      for (const item of totals.items) {
        const dbItem = await tx.item.findUnique({
          where: {
            id: Number(item.itemId),
          },
        });

        if (!dbItem) {
          throw new Error(`Item with ID ${item.itemId} not found`);
        }

        if (dbItem.stock < item.quantity) {
          throw new Error(
            `Insufficient stock for ${dbItem.name}. Available: ${dbItem.stock}`
          );
        }

        await tx.voucherItem.create({
          data: {
            voucherId: voucher.id,
            itemId: Number(item.itemId),
            quantity: item.quantity,
            rate: item.rate,
            gstAmount: item.gstAmount,
            amount: item.amount,
          },
        });

        await tx.item.update({
          where: {
            id: Number(item.itemId),
          },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      await tx.ledger.update({
        where: {
          id: Number(ledgerId),
        },
        data: {
          currentBalance: {
            increment: totals.totalAmount,
          },
        },
      });

      return voucher;
    });

    return {
      message: "Sales voucher created successfully",
      voucher: result,
    };
  }

  async getPurchaseHistory(companyId) {
    if (!companyId) {
      throw new Error("Company Id is required");
    }

    return prisma.voucher.findMany({
      where: {
        companyId,
        type: "PURCHASE",
      },
      include: {
        ledger: true,
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getSalesHistory(companyId) {
    if (!companyId) {
      throw new Error("Company Id is required");
    }

    return prisma.voucher.findMany({
      where: {
        companyId,
        type: "SALES",
      },
      include: {
        ledger: true,
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async getVoucherById(id) {
    if (!id) {
      throw new Error("Voucher Id is required");
    }

    const voucher = await prisma.voucher.findUnique({
      where: {
        id,
      },
      include: {
        ledger: true,
        company: true,
        items: {
          include: {
            item: true,
          },
        },
      },
    });

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    return voucher;
  }

  async deleteVoucher(id) {
    if (!id) {
      throw new Error("Voucher Id is required");
    }

    const voucher = await prisma.voucher.findUnique({
      where: {
        id,
      },
      include: {
        items: true,
      },
    });

    if (!voucher) {
      throw new Error("Voucher not found");
    }

    await prisma.$transaction(async (tx) => {
      for (const voucherItem of voucher.items) {
        if (voucher.type === "PURCHASE") {
          await tx.item.update({
            where: {
              id: voucherItem.itemId,
            },
            data: {
              stock: {
                decrement: voucherItem.quantity,
              },
            },
          });
        }

        if (voucher.type === "SALES") {
          await tx.item.update({
            where: {
              id: voucherItem.itemId,
            },
            data: {
              stock: {
                increment: voucherItem.quantity,
              },
            },
          });
        }
      }

      await tx.ledger.update({
        where: {
          id: voucher.ledgerId,
        },
        data: {
          currentBalance: {
            decrement: voucher.totalAmount,
          },
        },
      });

      await tx.voucherItem.deleteMany({
        where: {
          voucherId: id,
        },
      });

      await tx.voucher.delete({
        where: {
          id,
        },
      });
    });

    return true;
  }
}

module.exports = new VoucherService();