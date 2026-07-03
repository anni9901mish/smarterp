const calculateTotal = (items) => {
  let subtotal = 0;
  let gstAmount = 0;

  const calculatedItems = items.map((item) => {
    const quantity = Number(item.quantity || item.qty || 0);
    const rate = Number(item.rate || 0);
    const gstPercent = Number(item.gstPercent || 0);

    const amount = quantity * rate;
    const itemGst = (amount * gstPercent) / 100;

    subtotal += amount;
    gstAmount += itemGst;

    return {
      ...item,
      quantity,
      rate,
      gstAmount: itemGst,
      amount: amount + itemGst,
    };
  });

  return {
    items: calculatedItems,
    subtotal,
    gstAmount,
    totalAmount: subtotal + gstAmount,
  };
};

module.exports = calculateTotal;