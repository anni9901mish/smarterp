const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");

const {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  getStockLedger,
} = require("../controllers/item.controller");

const router = express.Router();

router.post("/", authMiddleware, createItem);

router.get("/", authMiddleware, getItems);


router.get("/:id/stock-ledger", authMiddleware, getStockLedger);

router.put("/:id", authMiddleware, updateItem);

router.delete("/:id", authMiddleware, deleteItem);

module.exports = router;