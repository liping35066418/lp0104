import { create } from 'zustand';
import type { Product, CalculationResult } from '../../shared/types';

interface ProductState {
  products: Product[];
  result: CalculationResult | null;
  isCalculating: boolean;
  error: string | null;
  minComboSize: number;
  maxComboSize: number;
  addProduct: (product: Omit<Product, 'id'>) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, field: keyof Product, value: string | number) => void;
  setResult: (result: CalculationResult | null) => void;
  setCalculating: (isCalculating: boolean) => void;
  setError: (error: string | null) => void;
  setComboSize: (min: number, max: number) => void;
  reset: () => void;
}

const generateId = () => `prod-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

const defaultProducts: Product[] = [
  { id: generateId(), name: '薯片', cost: 2.5, price: 5.9 },
  { id: generateId(), name: '可乐', cost: 1.8, price: 4.5 },
  { id: generateId(), name: '巧克力', cost: 3.2, price: 8.9 },
  { id: generateId(), name: '坚果', cost: 5.5, price: 12.9 },
  { id: generateId(), name: '饼干', cost: 2.0, price: 5.5 },
];

export const useProductStore = create<ProductState>((set) => ({
  products: defaultProducts,
  result: null,
  isCalculating: false,
  error: null,
  minComboSize: 2,
  maxComboSize: 4,

  addProduct: (product) =>
    set((state) => ({
      products: [...state.products, { ...product, id: generateId() }],
    })),

  removeProduct: (id) =>
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    })),

  updateProduct: (id, field, value) =>
    set((state) => ({
      products: state.products.map((p) =>
        p.id === id
          ? {
              ...p,
              [field]: field === 'name' ? value : Number(value) || 0,
            }
          : p
      ),
    })),

  setResult: (result) => set({ result }),
  setCalculating: (isCalculating) => set({ isCalculating }),
  setError: (error) => set({ error }),
  setComboSize: (min, max) => set({ minComboSize: min, maxComboSize: max }),

  reset: () =>
    set({
      products: defaultProducts.map((p) => ({ ...p, id: generateId() })),
      result: null,
      isCalculating: false,
      error: null,
    }),
}));
