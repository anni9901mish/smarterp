const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createPurchaseVoucher,
  createSalesVoucher,
  getPurchaseHistory,
  getSalesHistory,
  getVoucherById,
  deleteVoucher,
} = require("../controllers/voucher.controller");

const router = express.Router();

router.post("/purchase", authMiddleware, createPurchaseVoucher);
router.post("/sales", authMiddleware, createSalesVoucher);

router.get("/purchase", authMiddleware, getPurchaseHistory);
router.get("/sales", authMiddleware, getSalesHistory);
router.get("/:id", authMiddleware, getVoucherById);
router.delete("/:id", authMiddleware, deleteVoucher);

module.exports = router;