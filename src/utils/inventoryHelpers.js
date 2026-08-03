import { INVENTORY_CATEGORY_ICONS } from '../data/demoNgoInventory';

export function getInventoryStockStatus(qty) {
  const n = Number(qty) || 0;
  if (n <= 0) {
    return {
      id: 'out',
      label: 'Out of Stock',
      bg: '#FEF2F2',
      text: '#B91C1C',
    };
  }
  if (n <= 10) {
    return {
      id: 'low',
      label: 'Low Stock',
      bg: '#FFF7ED',
      text: '#C2410C',
    };
  }
  return {
    id: 'available',
    label: 'Available',
    bg: '#ECFDF5',
    text: '#15803D',
  };
}

export function getInventoryCategoryIcon(category) {
  return INVENTORY_CATEGORY_ICONS[category] || 'cube-outline';
}

export function countAvailableItems(inventory = []) {
  return inventory.filter((i) => Number(i.qty) > 0).length;
}

export const INITIAL_INVENTORY_REQUEST_FORM = {
  quantity: '',
  beneficiaries: [],
  beneficiaryCount: '',
  priority: 'Medium',
  deliveryDate: '',
  location: '',
  reason: '',
  specialInstructions: '',
};

export function isInventoryRequestValid(form, maxQty) {
  const qty = Number(form.quantity);
  return (
    form.quantity !== '' &&
    !Number.isNaN(qty) &&
    qty >= 1 &&
    qty <= maxQty &&
    form.beneficiaries.length > 0 &&
    !!form.beneficiaryCount &&
    Number(form.beneficiaryCount) > 0 &&
    !!form.priority &&
    !!form.deliveryDate &&
    !!form.location?.trim() &&
    !!form.reason?.trim()
  );
}
