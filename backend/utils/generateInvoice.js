const generateInvoice = (type, count) => {
  const prefix = type === "PURCHASE" ? "PUR" : "SAL";
  const number = String(count + 1).padStart(4, "0");

  return `${prefix}-${number}`;
};

module.exports = generateInvoice;