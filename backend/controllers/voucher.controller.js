const voucherService = require("../services/voucher.service");

exports.createPurchaseVoucher = async (req, res) => {
  try {
    const result = await voucherService.createPurchaseVoucher(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createSalesVoucher = async (req, res) => {
  try {
    const result = await voucherService.createSalesVoucher(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPurchaseHistory = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await voucherService.getPurchaseHistory(
      Number(companyId)
    );

    res.json(vouchers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getSalesHistory = async (req, res) => {
  try {
    const { companyId } = req.query;

    const vouchers = await voucherService.getSalesHistory(
      Number(companyId)
    );

    res.json(vouchers);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getVoucherById = async (req, res) => {
  try {
    const voucher = await voucherService.getVoucherById(
      Number(req.params.id)
    );

    res.json(voucher);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.deleteVoucher = async (req, res) => {
  try {
    await voucherService.deleteVoucher(
      Number(req.params.id)
    );

    res.json({
      message: "Voucher deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};