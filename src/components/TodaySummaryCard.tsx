import React from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { getTodaySummary, formatCurrency } from '../lib/stats';

export const TodaySummaryCard: React.FC = () => {
  const { transactions } = useTransactionStore();
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  const todayStats = getTodaySummary(transactions, todayStr);

  // Fallback to 0 if no transactions
  const income = todayStats.income > 0 ? todayStats.income : 0;
  const expenses = todayStats.expenses > 0 ? todayStats.expenses : 0;

  return (
    <div className="bg-white rounded-3xl p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-white/60">
      <h2 className="text-xl font-bold text-[#1b1c1c] tracking-tight mb-4">
        Hari Ini
      </h2>

      <div className="flex items-center justify-between gap-3">
        {/* Income Column */}
        <div className="flex-1">
          <span className="text-xs font-semibold text-[#767586] block mb-1">
            Pemasukan
          </span>
          <div className="text-base font-extrabold text-[#5d5fef] mb-2">
            + {formatCurrency(income)}
          </div>
          {/* Income Progress Bar */}
          <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#5d5fef] h-full rounded-full transition-all duration-500"
              style={{ width: '70%' }}
            />
          </div>
        </div>

        {/* Slash Separator */}
        <div className="text-lg font-bold text-[#767586] px-1 self-center">
          /
        </div>

        {/* Expenses Column */}
        <div className="flex-1">
          <span className="text-xs font-semibold text-[#767586] block mb-1">
            Pengeluaran
          </span>
          <div className="text-base font-extrabold text-[#ff914d] mb-2">
            - {formatCurrency(expenses)}
          </div>
          {/* Expenses Progress Bar */}
          <div className="w-full bg-[#f0eded] h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#ffab69] h-full rounded-full transition-all duration-500"
              style={{ width: '85%' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
