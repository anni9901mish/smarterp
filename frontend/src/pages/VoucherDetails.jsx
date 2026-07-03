import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Download, Printer } from "lucide-react";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api/axiosInstance";

const VoucherDetails = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState(null);

  const fetchVoucher = async () => {
    try {
      const res = await api.get(`/vouchers/${id}`);
      setVoucher(res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load voucher");
    }
  };

  useEffect(() => {
    fetchVoucher();
  }, [id]);

  const formatMoney = (value) =>
  `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const generatePDF = (print = false) => {
  if (!voucher) return;

  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();

  const companyName = voucher.company?.name || "SmartERP";
  const companyGst = voucher.company?.gstNumber || "Not Added";
  const partyName = voucher.ledger?.name || "Not Added";
  const partyGst = voucher.ledger?.gstNumber || "Not Added";
  const partyMobile = voucher.ledger?.mobile || "Not Added";
  const partyAddress = voucher.ledger?.address || "Not Added";

  const isSales = voucher.type === "SALES";
  const title = isSales ? "TAX INVOICE" : "PURCHASE BILL";

  doc.setDrawColor(15, 23, 42);
  doc.setLineWidth(0.4);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text(companyName.toUpperCase(), 14, 18);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`GSTIN: ${companyGst}`, 14, 26);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(title, pageWidth - 14, 18, { align: "right" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`Invoice No: ${voucher.invoiceNo}`, pageWidth - 14, 27, {
    align: "right",
  });
  doc.text(
    `Date: ${new Date(voucher.date || voucher.createdAt).toLocaleDateString(
      "en-IN"
    )}`,
    pageWidth - 14,
    34,
    { align: "right" }
  );

  doc.line(14, 42, pageWidth - 14, 42);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(isSales ? "Bill To" : "Supplier", 14, 53);

  doc.setFontSize(14);
  doc.text(partyName.toUpperCase(), 14, 62);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(`GSTIN: ${partyGst}`, 14, 70);
  doc.text(`Mobile: ${partyMobile}`, 14, 77);

  const addressLines = doc.splitTextToSize(`Address: ${partyAddress}`, 120);
  doc.text(addressLines, 14, 84);

  const rows =
    voucher.items?.map((row, index) => [
      index + 1,
      row.item?.name || "-",
      row.quantity,
      formatMoney(row.rate),
      formatMoney(row.gstAmount),
      formatMoney(row.amount),
    ]) || [];

  autoTable(doc, {
    startY: 105,
    head: [["#", "Item", "Qty", "Rate", "GST", "Amount"]],
    body: rows,
    theme: "grid",
    margin: { left: 14, right: 14 },
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: 255,
      fontStyle: "bold",
      halign: "center",
    },
    bodyStyles: {
      textColor: [45, 45, 45],
    },
    styles: {
      fontSize: 9,
      cellPadding: 3.2,
      lineColor: [210, 210, 210],
      lineWidth: 0.2,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 66 },
      2: { cellWidth: 18, halign: "right" },
      3: { cellWidth: 30, halign: "right" },
      4: { cellWidth: 30, halign: "right" },
      5: { cellWidth: 38, halign: "right" },
    },
  });

  const finalY = doc.lastAutoTable.finalY + 12;

  const boxX = 118;
  const labelX = 124;
  const valueX = pageWidth - 16;

  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(boxX, finalY - 6, 78, 38, 3, 3);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  doc.text("Subtotal", labelX, finalY + 2);
  doc.text(formatMoney(voucher.subtotal), valueX, finalY + 2, {
    align: "right",
  });

  doc.text("GST", labelX, finalY + 11);
  doc.text(formatMoney(voucher.gstAmount), valueX, finalY + 11, {
    align: "right",
  });

  doc.setDrawColor(15, 23, 42);
  doc.line(labelX, finalY + 17, valueX, finalY + 17);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Grand Total", labelX, finalY + 27);
  doc.text(formatMoney(voucher.totalAmount), valueX, finalY + 27, {
    align: "right",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text("Thank you for your business.", 14, 280);

  doc.setFont("helvetica", "bold");
  doc.text("Authorized Signatory", pageWidth - 14, 280, {
    align: "right",
  });

  if (print) {
    doc.autoPrint();
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save(`${voucher.invoiceNo}.pdf`);
  }
};

  if (!voucher) {
    return <p className="text-slate-400">Loading voucher...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            {voucher.type === "SALES" ? "Sales Invoice" : "Purchase Invoice"}
          </h1>
          <p className="text-slate-400">{voucher.invoiceNo}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => generatePDF(true)}
            className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-5 py-3 font-semibold text-slate-950"
          >
            <Printer size={18} />
            Print
          </button>

          <button
            onClick={() => generatePDF(false)}
            className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-xl font-semibold">Invoice Preview</h2>
        <p className="mt-2 text-slate-400">
          Click Download PDF or Print to generate a professional A4 invoice.
        </p>
      </div>
    </div>
  );
};

export default VoucherDetails;