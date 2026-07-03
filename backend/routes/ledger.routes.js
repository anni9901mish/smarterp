const express = require("express");

const authMiddleware = require("../middleware/auth.middleware");

const {
  createLedger,
  getLedgers,
  updateLedger,
  deleteLedger,
  getCustomers,
  getSuppliers,
} = require("../controllers/ledger.controller");

const router = express.Router();

router.post("/", authMiddleware, createLedger);

router.get("/", authMiddleware, getLedgers);

router.get("/customers", authMiddleware, getCustomers);

router.get("/suppliers", authMiddleware, getSuppliers);

router.put("/:id", authMiddleware, updateLedger);

router.delete("/:id", authMiddleware, deleteLedger);

module.exports = router;