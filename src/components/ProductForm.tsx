import { Plus, Trash2, Package } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCalculation } from '../hooks/useCalculation';

export function ProductForm() {
  const { products, addProduct, removeProduct, updateProduct } = useProductStore();
  const { realtimeCalculate } = useCalculation();

  const handleAdd = () => {
    addProduct({ name: '', cost: 0, price: 0 });
  };

  const handleUpdate = (id: string, field: 'name' | 'cost' | 'price', value: string) => {
    updateProduct(id, field, value);
    realtimeCalculate();
  };

  const handleRemove = (id: string) => {
    removeProduct(id);
    realtimeCalculate();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-primary-800 flex items-center gap-2">
          <Package className="w-5 h-5" />
          商品参数配置
        </h2>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1 px-3 py-1.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 hover:scale-105 active:scale-95 text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          添加商品
        </button>
      </div>

      <div className="space-y-3">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary-200 transition-all duration-300 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-4">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  商品名称
                </label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => handleUpdate(product.id, 'name', e.target.value)}
                  placeholder="如：薯片"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  成本价 (元)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.cost || ''}
                  onChange={(e) => handleUpdate(product.id, 'cost', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  售价 (元)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.price || ''}
                  onChange={(e) => handleUpdate(product.id, 'price', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
                />
              </div>
              <div className="col-span-2 flex justify-end">
                <button
                  onClick={() => handleRemove(product.id)}
                  disabled={products.length <= 1}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                  title="删除商品"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {product.cost > 0 && product.price > 0 && (
              <div className="mt-2 flex items-center gap-4 text-xs">
                <span className="text-gray-500">
                  单件毛利: <span className="text-primary-600 font-semibold">¥{(product.price - product.cost).toFixed(2)}</span>
                </span>
                <span className="text-gray-500">
                  毛利率: <span className="text-accent-600 font-semibold">{(((product.price - product.cost) / product.price) * 100).toFixed(1)}%</span>
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
        <p>💡 提示：修改任意商品的成本或售价后，系统将自动重新计算所有组合的收益数据。</p>
      </div>
    </div>
  );
}
