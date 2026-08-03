export function formatCurrency(amount, currency = '₹') {
  const n = Number(amount);
  if (!n || Number.isNaN(n)) return `${currency}0`;
  return `${currency}${n.toLocaleString('en-IN')}`;
}
