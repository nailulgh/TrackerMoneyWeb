import React, { useMemo } from 'react';
import { Download, Upload, RefreshCw, FileText, Database, Shield } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { exportTransactionsToCsv, downloadCsvFile } from '../lib/csvParser';
import { formatCurrency, getMonthExpenseSummary, getLastSixMonths } from '../lib/stats';

export const ReportsView: React.FC = () => {
  const { transactions, setCsvModalOpen, resetAllData } = useTransactionStore();
  const recentMonths = useMemo(() => getLastSixMonths(), []);
  const currentMonth = recentMonths[0];

  const handleExport = () => {
    const csv = exportTransactionsToCsv(transactions);
    downloadCsvFile(csv, `duitrack-backup-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const summary = getMonthExpenseSummary(transactions, currentMonth.value);
  const totalExpense = summary.totalExpense || 0;

  return (
    <div className="space-y-4 pb-28 pt-2">
      <h1 className="text-2xl font-extrabold text-[#1b1c1c]">Data & Cadangan</h1>

      {/* CSV Export & Import Cards */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)] space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-[#f0f0fa] rounded-2xl text-[#5d5fef]">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[#1b1c1c]">Penyimpanan Lokal Offline</h2>
            <p className="text-xs text-[#767586] mt-0.5">
              Semua catatan disimpan dengan aman di penyimpanan lokal browser/perangkat Anda.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleExport}
            className="p-3.5 bg-[#5d5fef] text-white rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 shadow-md hover:bg-[#4343d5] transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={() => setCsvModalOpen(true)}
            className="p-3.5 bg-[#f0f0fa] text-[#5d5fef] rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 border border-[#5d5fef]/20 hover:bg-[#e4e2e1] transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Impor CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Health Summary */}
      <div className="bg-white rounded-3xl p-5 shadow-[0_10px_30px_rgba(0,0,0,0.04)]">
        <h2 className="text-base font-bold text-[#1b1c1c] mb-3 flex items-center space-x-2">
          <FileText className="w-4 h-4 text-[#ff914d]" />
          <span>Ringkasan Kesehatan Keuangan</span>
        </h2>

        <div className="space-y-2 text-xs text-[#464555]">
          <div className="flex justify-between py-1 border-b border-[#f0eded]">
            <span>Total Pengeluaran Bulan ({currentMonth.label})</span>
            <span className="font-bold text-[#ff914d]">{formatCurrency(totalExpense)}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-[#f0eded]">
            <span>Transaksi Tercatat</span>
            <span className="font-bold text-[#1b1c1c]">{transactions.length} catatan</span>
          </div>
          <div className="flex justify-between py-1">
            <span>Status Keamanan</span>
            <span className="font-bold text-emerald-600 flex items-center space-x-1">
              <Shield className="w-3.5 h-3.5" />
              <span>100% Offline & Pribadi</span>
            </span>
          </div>
        </div>
      </div>

      {/* Reset State */}
      <div className="pt-2">
        <button
          onClick={() => {
            if (confirm('Hapus semua data transaksi? Tindakan ini tidak dapat dibatalkan.')) {
              resetAllData();
            }
          }}
          className="w-full py-3 bg-[#ffdad6] text-[#ba1a1a] rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 hover:bg-[#ffdad6]/80 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Hapus Semua Data (Reset)</span>
        </button>
      </div>
    </div>
  );
};
