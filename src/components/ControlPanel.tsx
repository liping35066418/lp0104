import { Sparkles, Settings2, RotateCcw } from 'lucide-react';
import { useProductStore } from '../store/productStore';
import { useCalculation } from '../hooks/useCalculation';

export function ControlPanel() {
  const { minComboSize, maxComboSize, setComboSize, reset, isCalculating, result } =
    useProductStore();
  const { calculate, realtimeCalculate } = useCalculation();

  const handleMinChange = (value: number) => {
    if (value <= maxComboSize && value >= 2) {
      setComboSize(value, maxComboSize);
      realtimeCalculate();
    }
  };

  const handleMaxChange = (value: number) => {
    if (value >= minComboSize && value <= 10) {
      setComboSize(minComboSize, value);
      realtimeCalculate();
    }
  };

  const displayedHighCount = result?.highProfit.length ?? 0;
  const displayedLowCount = result?.lowProfit.length ?? 0;
  const displayedTotalCount = displayedHighCount + displayedLowCount;

  return (
    <div className="bg-gradient-to-r from-primary-700 to-primary-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold flex items-center gap-2 mb-3">
            <Settings2 className="w-5 h-5" />
            AI推演配置
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-primary-200 mb-1">
                最小组合商品数
              </label>
              <input
                type="range"
                min="2"
                max={maxComboSize}
                value={minComboSize}
                onChange={(e) => handleMinChange(Number(e.target.value))}
                className="w-full h-2 bg-primary-600 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="text-center text-sm font-semibold mt-1">
                {minComboSize} 件
              </div>
            </div>
            <div>
              <label className="block text-xs text-primary-200 mb-1">
                最大组合商品数
              </label>
              <input
                type="range"
                min={minComboSize}
                max="10"
                value={maxComboSize}
                onChange={(e) => handleMaxChange(Number(e.target.value))}
                className="w-full h-2 bg-primary-600 rounded-lg appearance-none cursor-pointer accent-white"
              />
              <div className="text-center text-sm font-semibold mt-1">
                {maxComboSize} 件
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button
            onClick={calculate}
            disabled={isCalculating}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-lg hover:shadow-accent-500/30"
          >
            <Sparkles className={`w-5 h-5 ${isCalculating ? 'animate-spin' : ''}`} />
            {isCalculating ? 'AI推演中...' : '开始AI推演'}
          </button>

          <button
            onClick={reset}
            className="flex items-center justify-center gap-2 px-8 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-lg transition-all duration-200"
          >
            <RotateCcw className="w-4 h-4" />
            重置数据
          </button>
        </div>
      </div>

      {result && (
        <div className="mt-4 pt-4 border-t border-primary-600/50 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-accent-300">
              {displayedTotalCount}
            </div>
            <div className="text-xs text-primary-200">总组合数</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-300">
              {displayedHighCount}
            </div>
            <div className="text-xs text-primary-200">高收益组合</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-300">
              {displayedLowCount}
            </div>
            <div className="text-xs text-primary-200">低收益组合</div>
          </div>
        </div>
      )}
    </div>
  );
}
