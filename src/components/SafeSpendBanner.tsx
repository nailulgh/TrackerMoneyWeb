import React, { useMemo } from 'react';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { calculateDailySafeSpend, formatCurrency, getMonthExpenseSummary, getLastSixMonths, getWeekExpenseSummary, getWeekStartEnd } from '../lib/stats';

export const SafeSpendBanner: React.FC = () => {
  const { budget, transactions, setBudgetModalOpen } = useTransactionStore();
  const recentMonths = useMemo(() => getLastSixMonths(), []);
  const currentMonth = recentMonths[0].value;
  
  const isWeekly = budget.period === 'weekly';

  const monthlySummary = getMonthExpenseSummary(transactions, currentMonth);
  const weeklySummary = getWeekExpenseSummary(transactions, new Date());
  
  const totalExpense = isWeekly ? weeklySummary.totalExpense : monthlySummary.totalExpense;
  const currentBudget = isWeekly ? (budget.weeklyBudget || 2000000) : budget.monthlyBudget;

  const now = new Date();
  const currentDay = now.getDate();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  
  const { end: weekEnd } = getWeekStartEnd(now);
  const daysLeftInWeek = Math.max(1, Math.ceil((weekEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  
  const safeSpendInfo = isWeekly ? {
    remainingBudget: Math.max(0, currentBudget - totalExpense),
    dailySafeSpend: Math.round(Math.max(0, currentBudget - totalExpense) / daysLeftInWeek),
    remainingDays: daysLeftInWeek,
    percentUsed: Math.min(100, Math.round((totalExpense / currentBudget) * 100))
  } : calculateDailySafeSpend(
    currentBudget,
    totalExpense,
    currentDay,
    daysInMonth
  );

  return (
    <div className="bg-gradient-to-r from-[#4343d5] to-[#5d5fef] rounded-3xl p-5 text-white shadow-[0_10px_25px_rgba(93,95,239,0.25)] relative overflow-hidden my-2">
      <div className="absolute right-[-10px] top-[-10px] w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />
      
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-white/20 rounded-xl backdrop-blur-xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-white/90">
            Batas Aman Harian ({isWeekly ? 'Mingguan' : 'Bulanan'})
          </span>
        </div>
        <button
          onClick={() => setBudgetModalOpen(true)}
          className="text-xs font-semibold underline underline-offset-2 text-white/80 hover:text-white transition-colors flex items-center space-x-1"
        >
          <span>Pengaturan Anggaran</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex items-baseline justify-between mt-1">
        <div>
          <div className="text-2xl font-black tracking-tight">
            {formatCurrency(safeSpendInfo.dailySafeSpend)} <span className="text-sm font-normal text-white/80">/ hari</span>
          </div>
          <p className="text-xs font-medium text-white/80 mt-1">
            Tersisa {formatCurrency(safeSpendInfo.remainingBudget)} untuk {safeSpendInfo.remainingDays} hari {isWeekly ? 'minggu' : 'bulan'} ini
          </p>
        </div>

        <div className="text-right">
          <span className="text-xs font-extrabold bg-white/20 px-2.5 py-1 rounded-full border border-white/20">
            {safeSpendInfo.percentUsed}% Anggaran Terpakai
          </span>
        </div>
      </div>
    </div>
  );
};
