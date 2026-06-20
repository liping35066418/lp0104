import { useEffect } from 'react';
import { Brain, Zap, AlertTriangle } from 'lucide-react';
import { ProductForm } from '../components/ProductForm';
import { ControlPanel } from '../components/ControlPanel';
import { ProfitTable } from '../components/ProfitTable';
import { useProductStore } from '../store/productStore';
import { useCalculation } from '../hooks/useCalculation';

export default function Home() {
  const { result, error, isCalculating } = useProductStore();
  const { calculate } = useCalculation();

  useEffect(() => {
    const timer = setTimeout(() => {
      calculate();
    }, 500);
    return () => clearTimeout(timer);
  }, [calculate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-primary-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
                <Brain className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary-800">
                  商品组合收益 AI 推演系统
                </h1>
                <p className="text-xs text-gray-500">
                  智能分析捆绑销售策略，最大化零售收益
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
              <Zap className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-700">
                {isCalculating ? '实时计算中' : '实时连接'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 animate-fade-in-up">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="mb-8">
          <ControlPanel />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-5">
            <div className="sticky top-24">
              <ProductForm />
            </div>
          </div>

          <div className="xl:col-span-7 space-y-8">
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <ProfitTable
                type="high"
                combinations={result?.highProfit || []}
              />
            </div>
            <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <ProfitTable
                type="low"
                combinations={result?.lowProfit || []}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 py-6 border-t border-gray-200 bg-white/50">
        <div className="container mx-auto px-4 text-center text-xs text-gray-500">
          <p>商品组合收益 AI 推演系统 · 后端服务端口 8874 · 前端配置端口 3871</p>
          <p className="mt-1">修改任意单品定价后自动重算全部收益数据 · 无需摄像收音设备</p>
        </div>
      </footer>
    </div>
  );
}
