import React, { useState } from 'react';
import { X, Target, DollarSign, Save } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { formatCurrency } from '../lib/stats';

export const BudgetModal: React.FC = () => {
  const { isBudgetModalOpen, setBudgetModalOpen, budget, updateBudget } = useTransactionStore();

  const [period, setPeriod] = useState<'monthly'|'weekly'>(budget.period || 'monthly');
  const [monthlyBudget, setMonthlyBudget] = useState(budget.monthlyBudget.toString());
  const [weeklyBudget, setWeeklyBudget] = useState((budget.weeklyBudget || 2000000).toString());
  const [targetDailyLimit, setTargetDailyLimit] = useState(budget.targetDailyLimit.toString());

  if (!isBudgetModalOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const mb = parseFloat(monthlyBudget);
    const wb = parseFloat(weeklyBudget);
    const dl = parseFloat(targetDailyLimit);

    if (!isNaN(mb) && mb > 0 && !isNaN(wb) && wb > 0) {
      updateBudget({
        period,
        monthlyBudget: mb,
        weeklyBudget: wb,
        targetDailyLimit: !isNaN(dl) && dl > 0 ? dl : Math.round((period === 'monthly' ? mb : wb) / (period === 'monthly' ? 30 : 7)),
      });
    }

    setBudgetModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/80">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0eded]">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-[#5d5fef]" />
            <h2 className="text-xl font-bold text-[#1b1c1c]">Anggaran & Target Harian</h2>
          </div>
          <button
            onClick={() => setBudgetModalOpen(false)}
            className="w-9 h-9 bg-[#f0eded] rounded-full flex items-center justify-center text-[#767586] hover:text-[#1b1c1c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-4">
          <div className="flex space-x-2 bg-[#f0eded] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setPeriod('monthly')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${period === 'monthly' ? 'bg-white shadow-sm text-[#1b1c1c]' : 'text-[#767586] hover:text-[#1b1c1c]'}`}
            >
              Bulanan
            </button>
            <button
              type="button"
              onClick={() => setPeriod('weekly')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${period === 'weekly' ? 'bg-white shadow-sm text-[#1b1c1c]' : 'text-[#767586] hover:text-[#1b1c1c]'}`}
            >
              Mingguan
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-[#767586] uppercase tracking-wider block mb-1">
              Total Anggaran Pengeluaran {period === 'monthly' ? 'Bulanan' : 'Mingguan'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-sm font-extrabold text-[#767586]">
                Rp
              </span>
              <input
                type="number"
                value={period === 'monthly' ? monthlyBudget : weeklyBudget}
                onChange={(e) => period === 'monthly' ? setMonthlyBudget(e.target.value) : setWeeklyBudget(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#f6f3f2] rounded-2xl text-lg font-extrabold text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#5d5fef]"
              />
            </div>
            <p className="text-[11px] text-[#767586] mt-1">
              Pengaturan saat ini: {formatCurrency(period === 'monthly' ? budget.monthlyBudget : (budget.weeklyBudget || 2000000))}
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-[#767586] uppercase tracking-wider block mb-1">
              Batas Aman Pengeluaran Harian Target
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-3.5 text-sm font-extrabold text-[#767586]">
                Rp
              </span>
              <input
                type="number"
                value={targetDailyLimit}
                onChange={(e) => setTargetDailyLimit(e.target.value)}
                className="w-full pl-9 pr-4 py-3 bg-[#f6f3f2] rounded-2xl text-lg font-extrabold text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#5d5fef]"
              />
            </div>
            <p className="text-[11px] text-[#767586] mt-1">
              Target maksimal pengeluaran per hari
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#5d5fef] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#4343d5] transition-colors flex items-center justify-center space-x-2 mt-4"
          >
            <Save className="w-4 h-4" />
            <span>Perbarui Target Anggaran</span>
          </button>
        </form>
      </div>
    </div>
  );
};
