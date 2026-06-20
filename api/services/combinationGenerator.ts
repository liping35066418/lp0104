import type { Product, Combination } from '../../shared/types.js';

function generateCombinations(products: Product[], minSize: number, maxSize: number): Product[][] {
  const result: Product[][] = [];
  const n = products.length;

  function backtrack(start: number, current: Product[]) {
    const size = current.length;
    if (size >= minSize && size <= maxSize) {
      result.push([...current]);
    }
    if (size >= maxSize) {
      return;
    }
    for (let i = start; i < n; i++) {
      current.push(products[i]);
      backtrack(i + 1, current);
      current.pop();
    }
  }

  backtrack(0, []);
  return result;
}

function calculateCombinationMetrics(products: Product[]): Omit<Combination, 'id' | 'products' | 'productNames'> {
  const totalCost = products.reduce((sum, p) => sum + p.cost, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.price, 0);
  const totalProfit = totalPrice - totalCost;
  const unitProfit = totalProfit / products.length;
  const profitMargin = totalPrice > 0 ? (totalProfit / totalPrice) * 100 : 0;

  return {
    totalCost: Number(totalCost.toFixed(2)),
    totalPrice: Number(totalPrice.toFixed(2)),
    unitProfit: Number(unitProfit.toFixed(2)),
    totalProfit: Number(totalProfit.toFixed(2)),
    profitMargin: Number(profitMargin.toFixed(2)),
  };
}

function isHighProfit(metrics: { totalProfit: number; profitMargin: number }): boolean {
  return metrics.profitMargin >= 35 || metrics.totalProfit >= 10;
}

function filterTopCombinations(
  combinations: Combination[],
  limit: number
): Combination[] {
  const sorted = [...combinations].sort((a, b) => b.profitMargin - a.profitMargin);
  return sorted.slice(0, limit);
}

export function generateAndCalculate(
  products: Product[],
  minComboSize: number = 2,
  maxComboSize: number = 5
): { highProfit: Combination[]; lowProfit: Combination[]; totalCombinations: number } {
  if (products.length < minComboSize) {
    return { highProfit: [], lowProfit: [], totalCombinations: 0 };
  }

  const productCombinations = generateCombinations(products, minComboSize, maxComboSize);
  
  const allCombinations: Combination[] = productCombinations.map((comboProducts, index) => {
    const metrics = calculateCombinationMetrics(comboProducts);
    return {
      id: `combo-${Date.now()}-${index}`,
      products: comboProducts,
      productNames: comboProducts.map(p => p.name).join(' + '),
      ...metrics,
    };
  });

  const highProfit: Combination[] = [];
  const lowProfit: Combination[] = [];

  for (const combo of allCombinations) {
    if (isHighProfit(combo)) {
      highProfit.push(combo);
    } else {
      lowProfit.push(combo);
    }
  }

  highProfit.sort((a, b) => b.totalProfit - a.totalProfit);
  lowProfit.sort((a, b) => a.totalProfit - b.totalProfit);

  const maxCombinations = 50;
  if (highProfit.length + lowProfit.length > maxCombinations) {
    const filteredHigh = filterTopCombinations(highProfit, Math.ceil(maxCombinations * 0.6));
    const filteredLow = filterTopCombinations(lowProfit, Math.floor(maxCombinations * 0.4));
    return {
      highProfit: filteredHigh,
      lowProfit: filteredLow,
      totalCombinations: allCombinations.length,
    };
  }

  return {
    highProfit,
    lowProfit,
    totalCombinations: allCombinations.length,
  };
}
