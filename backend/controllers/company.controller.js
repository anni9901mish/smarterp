const prisma = require("../config/prisma");

exports.createCompany = async (req, res) => {
  try {
    const { name, gstNumber } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Company name is required",
      });
    }

    const company = await prisma.company.create({
      data: {
        name,
        gstNumber,
        ownerId: req.user.userId,
      },
    });

    res.status(201).json({
      message: "Company created successfully",
      company,
    });
  } catch (error) {
    res.status(500).json({
      message: "Company creation failed",
      error: error.message,
    });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companies = await prisma.company.findMany({
      where: {
        ownerId: req.user.userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      message: "Companies fetched successfully",
      companies,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch companies",
      error: error.message,
    });
  }
};

exports.updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, gstNumber } = req.body;

    const company = await prisma.company.findFirst({
      where: {
        id: Number(id),
        ownerId: req.user.userId,
      },
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    const updatedCompany = await prisma.company.update({
      where: {
        id: Number(id),
      },
      data: {
        name,
        gstNumber,
      },
    });

    res.json({
      message: "Company updated successfully",
      company: updatedCompany,
    });

  } catch (error) {
    res.status(500).json({
      message: "Update failed",
      error: error.message,
    });
  }
};

exports.deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;

    const company = await prisma.company.findFirst({
      where: {
        id: Number(id),
        ownerId: req.user.userId,
      },
    });

    if (!company) {
      return res.status(404).json({
        message: "Company not found",
      });
    }

    await prisma.company.delete({
      where: {
        id: Number(id),
      },
    });

    res.json({
      message: "Company deleted successfully",
    });

  } catch (error) {
    res.status(500).json({
      message: "Delete failed",
      error: error.message,
    });
  }
};