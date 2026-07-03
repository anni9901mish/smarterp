const prisma = require("../config/prisma");

exports.createItem = async (req, res) => {
  try {
    const {
      companyId,
      name,
      code,
      hsnCode,
      unit,
      purchasePrice,
      sellingPrice,
      gstPercent,
      stock,
      minimumStock,
    } = req.body;

    if (!companyId || !name) {
      return res.status(400).json({
        message: "Company and item name are required",
      });
    }

    const item = await prisma.item.create({
      data: {
        companyId: Number(companyId),
        name,
        code,
        hsnCode,
        unit: unit || "PCS",
        purchasePrice: Number(purchasePrice || 0),
        sellingPrice: Number(sellingPrice || 0),
        gstPercent: Number(gstPercent || 0),
        stock: Number(stock || 0),
        minimumStock: Number(minimumStock || 0),
      },
    });

    res.status(201).json({
      message: "Item created successfully",
      item,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create item",
      error: error.message,
    });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { companyId } = req.query;

    const items = await prisma.item.findMany({
      where: {
        companyId: Number(companyId),
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedItem = await prisma.item.update({
      where: {
        id: Number(id),
      },
      data: {
        ...req.body,
        purchasePrice: Number(req.body.purchasePrice || 0),
        sellingPrice: Number(req.body.sellingPrice || 0),
        gstPercent: Number(req.body.gstPercent || 0),
        stock: Number(req.body.stock || 0),
        minimumStock: Number(req.body.minimumStock || 0),
      },
    });

    res.json({
      message: "Item updated successfully",
      item: updatedItem,
    });
  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.item.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Item deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};