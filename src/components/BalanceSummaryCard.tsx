import React from 'react';
import { useTransactionStore } from '../store/useTransactionStore';
import { formatCurrency } from '../lib/stats';
import { Wallet } from 'lucide-react';

export const BalanceSummaryCard: React.FC = () => {
  const { transactions, openingBalance } = useTransactionStore();

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;
  const closingBalance = openingBalance + netBalance;

  return (
    <div className="bg-[#1b1c1c] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
        <Wallet className="w-32 h-32 transform rotate-12 translate-x-8 -translate-y-8" />
      </div>

      <div className="relative z-10">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white/70 tracking-wide">
              Total Saldo Akhir
            </h2>
            <div className="text-3xl font-extrabold mt-1">
              {formatCurrency(closingBalance)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-y-4 gap-x-6 pt-4 border-t border-white/10">
          <div>
            <p className="text-xs font-semibold text-white/50 mb-1">Saldo Awal</p>
            <p className="text-sm font-bold text-white">{formatCurrency(openingBalance)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/50 mb-1">Total Saldo Bersih</p>
            <p className="text-sm font-bold text-blue-400">{netBalance >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netBalance))}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/50 mb-1">Total Pemasukan</p>
            <p className="text-sm font-bold text-[#10b981]">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-white/50 mb-1">Total Pengeluaran</p>
            <p className="text-sm font-bold text-[#f43f5e]">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
