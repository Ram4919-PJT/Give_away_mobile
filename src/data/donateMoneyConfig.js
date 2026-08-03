export const UPI_APPS = [
  { id: 'gpay', label: 'Google Pay' },
  { id: 'phonepe', label: 'PhonePe' },
  { id: 'paytm', label: 'Paytm' },
  { id: 'bhim', label: 'BHIM' },
];

export const POPULAR_BANKS = [
  { id: 'sbi', label: 'SBI', short: 'SBI' },
  { id: 'hdfc', label: 'HDFC', short: 'HDFC' },
  { id: 'icici', label: 'ICICI', short: 'ICICI' },
  { id: 'axis', label: 'Axis', short: 'Axis' },
  { id: 'kotak', label: 'Kotak', short: 'Kotak' },
];

export const WALLET_OPTIONS = [
  { id: 'paytm', label: 'Paytm' },
  { id: 'amazonpay', label: 'Amazon Pay' },
  { id: 'mobikwik', label: 'Mobikwik' },
  { id: 'freecharge', label: 'Freecharge' },
];

export function getPaymentLabel(paymentId, methods) {
  return methods.find((m) => m.id === paymentId)?.label || paymentId;
}
