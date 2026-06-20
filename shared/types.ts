export interface Product {
  id: string;
  name: string;
  cost: number;
  price: number;
}

export interface Combination {
  id: string;
  products: Product[];
  productNames: string;
  totalCost: number;
  totalPrice: number;
  unitProfit: number;
  totalProfit: number;
  profitMargin: number;
}

export interface CalculationResult {
  highProfit: Combination[];
  lowProfit: Combination[];
  timestamp: number;
  totalCombinations: number;
}

export interface CalculateRequest {
  products: Product[];
  minComboSize?: number;
  maxComboSize?: number;
}
