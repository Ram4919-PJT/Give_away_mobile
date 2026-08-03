/** NGO warehouse inventory seed — mirrors web mockData.inventory */

export const DEMO_NGO_INVENTORY = [
  {
    id: 'inv-1',
    name: 'Winter Blankets',
    category: 'Shelter/Clothing',
    qty: 45,
    unit: 'pcs',
  },
  {
    id: 'inv-2',
    name: 'First Aid Kits',
    category: 'Medical Supplies',
    qty: 30,
    unit: 'kits',
  },
  {
    id: 'inv-3',
    name: 'Wheelchairs',
    category: 'Medical Equipment',
    qty: 8,
    unit: 'units',
  },
  {
    id: 'inv-4',
    name: 'Canned Vegetables',
    category: 'Food & Rations',
    qty: 250,
    unit: 'cans',
  },
  {
    id: 'inv-5',
    name: 'Hygiene Kits',
    category: 'Medical Supplies',
    qty: 0,
    unit: 'kits',
  },
];

export const INVENTORY_CATEGORY_ICONS = {
  'Shelter/Clothing': 'bed-outline',
  'Medical Supplies': 'medkit-outline',
  'Medical Equipment': 'fitness-outline',
  'Food & Rations': 'restaurant-outline',
};
