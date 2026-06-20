import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import type { Combination } from '../../shared/types';
import { useProductStore } from '../store/productStore';

interface TableSkeletonProps {
  rows?: number;
}

function TableSkeleton({ rows = 5 }: TableSkeletonProps) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-2 py-3">
          <div className="h-4 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-16" />
          <div className="h-4 bg-gray-200 rounded w-20" />
        </div>
      ))}
    </div>
  );
}

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

function AnimatedNumber({ value, prefix = '', suffix = '', className = '' }: AnimatedNumberProps) {
  return (
    <span key={value} className={`inline-block animate-number-scroll ${className}`}>
      {prefix}
      {value.toFixed(2)}
      {suffix}
    </span>
  );
}

interface ProfitTableProps {
  type: 'high' | 'low';
  combinations: Combination[];
}

export function ProfitTable({ type, combinations }: ProfitTableProps) {
  const { isCalculating } = useProductStore();
  const isHigh = type === 'high';

  const config = {
    icon: isHigh ? TrendingUp : TrendingDown,
    title: isHigh ? '高收益组合' : '低收益组合',
    subtitle: isHigh ? '毛利率 ≥ 35% 且 综合收益 ≥ 10元' : '毛利率 < 35% 或 综合收益 < 10元',
    headerBg: isHigh ? 'bg-gradient-to-r from-accent-500 to-accent-600' : 'bg-gradient-to-r from-gray-500 to-gray-600',
    rowHover: isHigh ? 'hover:bg-accent-50' : 'hover:bg-gray-50',
    badge: isHigh ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-600',
    emptyText: isHigh ? '暂无高收益组合，尝试提高商品售价' : '暂无低收益组合，所有组合均为高收益',
  };

  const Icon = config.icon;

  if (isCalculating && combinations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className={`${config.headerBg} text-white px-6 py-4`}>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {config.title}
          </h3>
          <p className="text-xs opacity-80 mt-0.5">{config.subtitle}</p>
        </div>
        <div className="p-4">
          <TableSkeleton />
        </div>
      </div>
    );
  }

  if (combinations.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden opacity-60">
        <div className={`${config.headerBg} text-white px-6 py-4`}>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {config.title}
          </h3>
          <p className="text-xs opacity-80 mt-0.5">{config.subtitle}</p>
        </div>
        <div className="p-8 text-center">
          <AlertCircle className={`w-12 h-12 mx-auto mb-3 ${isHigh ? 'text-accent-300' : 'text-gray-300'}`} />
          <p className="text-gray-500 text-sm">{config.emptyText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className={`${config.headerBg} text-white px-6 py-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Icon className="w-5 h-5" />
              {config.title}
            </h3>
            <p className="text-xs opacity-80 mt-0.5">{config.subtitle}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.badge}`}>
            {combinations.length} 套组合
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-xs font-medium ${isHigh ? 'text-accent-700 bg-accent-50' : 'text-gray-600 bg-gray-50'}`}>
              <th className="px-4 py-3 text-left font-semibold">组合商品</th>
              <th className="px-4 py-3 text-right font-semibold">总成本</th>
              <th className="px-4 py-3 text-right font-semibold">总售价</th>
              <th className="px-4 py-3 text-right font-semibold">单件毛利</th>
              <th className="px-4 py-3 text-right font-semibold">综合收益</th>
              <th className="px-4 py-3 text-right font-semibold">毛利率</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {combinations.map((combo, index) => (
              <tr
                key={combo.id}
                className={`transition-colors duration-200 ${config.rowHover} ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                style={{ animation: 'fade-in-up 0.4s ease-out forwards', animationDelay: `${index * 0.03}s`, opacity: 0 }}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isHigh ? 'bg-accent-100 text-accent-700' : 'bg-gray-100 text-gray-600'}`}>
                      {index + 1}
                    </span>
                    <span className="text-sm text-gray-800 font-medium">{combo.productNames}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-600">
                  ¥<AnimatedNumber value={combo.totalCost} />
                </td>
                <td className="px-4 py-3 text-right text-sm text-gray-800 font-medium">
                  ¥<AnimatedNumber value={combo.totalPrice} />
                </td>
                <td className="px-4 py-3 text-right text-sm text-primary-600 font-semibold">
                  ¥<AnimatedNumber value={combo.unitProfit} />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`text-sm font-bold ${isHigh ? 'text-accent-600' : 'text-gray-500'}`}>
                    ¥<AnimatedNumber value={combo.totalProfit} />
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold ${
                    combo.profitMargin >= 50
                      ? 'bg-green-100 text-green-700'
                      : combo.profitMargin >= 35
                      ? 'bg-accent-100 text-accent-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <AnimatedNumber value={combo.profitMargin} suffix="%" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
