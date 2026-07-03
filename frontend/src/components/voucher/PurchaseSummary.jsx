const PurchaseSummary = ({ rows }) => {
  const subtotal = rows.reduce(
    (sum, row) => sum + Number(row.quantity || 0) * Number(row.rate || 0),
    0
  );

  const gstAmount = rows.reduce((sum, row) => {
    const amount = Number(row.quantity || 0) * Number(row.rate || 0);
    return sum + (amount * Number(row.gstPercent || 0)) / 100;
  }, 0);

  const total = subtotal + gstAmount;

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <h2 className="text-xl font-bold">Purchase Summary</h2>

      <div className="mt-5 space-y-4">
        <div className="flex justify-between text-slate-400">
          <span>Subtotal</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex justify-between text-slate-400">
          <span>GST Amount</span>
          <span>₹{gstAmount.toLocaleString()}</span>
        </div>

        <div className="border-t border-white/10 pt-4">
          <div className="flex justify-between text-xl font-bold text-violet-400">
            <span>Total</span>
            <span>₹{total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseSummary;