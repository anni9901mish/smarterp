const authRoutes = require("./routes/auth.routes");
const companyRoutes = require("./routes/company.routes");
const ledgerRoutes = require("./routes/ledger.routes");
const itemRoutes = require("./routes/item.routes");
const voucherRoutes = require("./routes/voucher.routes");
const express = require("express");
const cors = require("cors");
const dashboardRoutes = require("./routes/dashboard.routes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/ledger", ledgerRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/vouchers", voucherRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req,res)=>{
    res.send("SMART_ERP is RUNNING ON BACKEND");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
});
