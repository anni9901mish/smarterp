const calculateGST = (amount, gstPercent) => {
  const gstAmount = (Number(amount) * Number(gstPercent || 0)) / 100;

  return {
    taxableAmount: Number(amount),
    gstAmount,
    totalAmount: Number(amount) + gstAmount,
  };
};

module.exports = calculateGST;