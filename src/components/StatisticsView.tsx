import React, { useState, useMemo } from 'react';
import { PieChart, BarChart2, TrendingUp, Calendar, Filter, AlertTriangle } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { getMonthExpenseSummary, formatCurrency, CATEGORY_COLORS, detectUnusualSpendSpikes, calculateMonthProjection, getLastSixMonths } from '../lib/stats';

export const StatisticsView: React.FC = () => {
  const { transactions } = useTransactionStore();
  const recentMonths = useMemo(() => getLastSixMonths(), []);
  const [month, setMonth] = useState(recentMonths[0].value);

  const summary = getMonthExpenseSummary(transactions, month);
  const spikes = detectUnusualSpendSpikes(transactions, month);
  const projection = calculateMonthProjection(transactions, month);

  // Calculate total income and total expenses for month
  const monthTxs = transactions.filter((t) => t.date.startsWith(month));
  const totalIncome = monthTxs
    .filter((t) => t.type === 'income')
    .reduce((a, b) => a + b.amount, 0);
  const totalExpense = summary.totalExpense;

  const categories = summary.categories;

  return (
    <div className="space-y-4 pb-28 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#1b1c1c]">Analitik Keuangan</h1>
        <div className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-2xl shadow-xs border border-white">
          <Calendar className="w-4 h-4 text-[#5d5fef]" />
          <select
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="text-xs font-bold text-[#1b1c1c] bg-transparent focus:outline-none"
          >
            {recentMonths.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-3xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <span className="text-xs font-semibold text-[#767586]">Total Pemasukan</span>
          <div className="text-xl font-extrabold text-[#5d5fef] mt-1">
            + {formatCurrency(totalIncome || 0)}
          </div>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
          <span className="text-xs font-semibold text-[#767586]">Total Pengeluaran</span>
          <div className="text-xl font-extrabold text-[#ff914d] mt-1">
            - {formatCurrency(totalExpense || 0)}
          </div>
        </div>
      </div>

      {/* End-of-month Projection */}
      {projection.currentTotal > 0 && (
        <div className="bg-gradient-to-r from-[#5d5fef] to-[#7f81f5] rounded-3xl p-5 shadow-[0_10px_30px_rgba(93,95,239,0.2)] text-white">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-white/80" />
            <h2 className="text-sm font-bold text-white/90">Proyeksi Pengeluaran Akhir Bulan</h2>
          </div>
          <div className="flex items-baseline space-x-1 mb-3">
            <span className="text-2xl font-extrabold">{formatCurrency(projection.projectedTotal)}</span>
          </div>
          <div className="bg-white/10 rounded-2xl p-3 flex justify-between items-center text-xs">
            <div className="flex flex-col">
              <span className="text-white/70 mb-1">Rata-rata harian</span>
              <span className="font-semibold">{formatCurrency(projection.dailyAverage)} / hari</span>
            </div>
            <div className="h-8 w-px bg-white/20 mx-2"></div>
            <div className="flex flex-col text-right">
              <span className="text-white/70 mb-1">Hari tercatat</span>
              <span className="font-semibold">{projection.daysPassed} / {projection.daysInMonth} hari</span>
            </div>
          </div>
        </div>
      )}

      {/* Unusual Spend Spikes */}
      {spikes.length > 0 && (
        <div className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] border-l-4 border-l-[#ff914d]">
          <h2 className="text-base font-bold text-[#1b1c1c] mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-[#ff914d]" />
            <span>Lonjakan Pengeluaran Tak Wajar</span>
          </h2>
          <div className="space-y-3">
            {spikes.map((spike) => (
              <div key={spike.category} className="bg-[#fff6f0] p-3 rounded-2xl flex flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#1b1c1c]">{spike.category}</span>
                  <span className="text-sm font-bold text-[#f43f5e]">+{spike.percentageIncrease}%</span>
                </div>
                <div className="text-xs text-[#767586] flex justify-between">
                  <span>Bulan ini: <span className="font-semibold text-[#1b1c1c]">{formatCurrency(spike.amount)}</span></span>
                  <span>Rata-rata: {formatCurrency(spike.averageAmount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Distribution Bar List */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <h2 className="text-base font-bold text-[#1b1c1c] mb-4 flex items-center space-x-2">
          <PieChart className="w-4 h-4 text-[#5d5fef]" />
          <span>Rincian Kategori</span>
        </h2>

        <div className="space-y-4">
          {categories.map((cat) => (
            <div key={cat.category}>
              <div className="flex items-center justify-between text-xs font-bold text-[#1b1c1c] mb-1">
                <span>{cat.category}</span>
                <span>{formatCurrency(cat.amount)} ({cat.percentage}%)</span>
              </div>
              <div className="w-full bg-[#f0eded] h-2.5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color || '#5d5fef',
                  }}
                />
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <p className="text-xs text-[#767586] text-center py-4">
              Belum ada pengeluaran tercatat untuk bulan ini.
            </p>
          )}
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-[#f0f0fa] to-[#e4e2e1] rounded-3xl p-5 border border-white">
        <h3 className="text-sm font-bold text-[#1b1c1c] flex items-center space-x-2 mb-2">
          <TrendingUp className="w-4 h-4 text-[#5d5fef]" />
          <span>Wawasan Cerdas</span>
        </h3>
        <p className="text-xs text-[#464555] leading-relaxed">
          {(() => {
            if (categories.length === 0) {
              return 'Belum ada data pengeluaran yang cukup untuk memberikan wawasan bulan ini. Terus catat pengeluaran Anda untuk melihat tren!';
            }

            const topCategories = categories.slice(0, 2);
            const topNames = topCategories.map(c => `${c.category} (${formatCurrency(c.amount)})`).join(' & ');
            const topPercentage = topCategories.reduce((acc, c) => acc + c.percentage, 0).toFixed(0);
            
            const warningText = projection.projectedTotal > totalIncome && totalIncome > 0 
              ? 'Waspada, laju pengeluaran Anda berpotensi melebihi pemasukan bulan ini.' 
              : 'Laju pengeluaran Anda saat ini masih terpantau aman.';

            return `${topNames} mencakup ${topPercentage}% dari total pengeluaran Anda bulan ini. ${warningText}`;
          })()}
        </p>
      </div>
    </div>
  );
};
