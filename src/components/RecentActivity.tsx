import React, { useState } from 'react';
import { ShoppingBag, ShoppingCart, Coffee, DollarSign, Briefcase, Film, Receipt, Car, Utensils, HeartPulse, MoreHorizontal, Trash2 } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { formatCurrency } from '../lib/stats';
import { Category, Transaction } from '../types';

const CATEGORY_ICONS: Record<Category, React.ReactNode> = {
  'Belanja': <ShoppingBag className="w-5 h-5 text-white" />,
  'Kebutuhan Harian': <ShoppingCart className="w-5 h-5 text-white" />,
  'Kopi': <Coffee className="w-5 h-5 text-white" />,
  'Gaji': <DollarSign className="w-5 h-5 text-white" />,
  'Freelance': <Briefcase className="w-5 h-5 text-white" />,
  'Hiburan': <Film className="w-5 h-5 text-white" />,
  'Tagihan': <Receipt className="w-5 h-5 text-white" />,
  'Transportasi': <Car className="w-5 h-5 text-white" />,
  'Makanan': <Utensils className="w-5 h-5 text-white" />,
  'Kesehatan': <HeartPulse className="w-5 h-5 text-white" />,
  'Lainnya': <MoreHorizontal className="w-5 h-5 text-white" />,
};

const CATEGORY_BG_COLORS: Record<Category, string> = {
  'Belanja': 'bg-[#5d5fef]',
  'Kebutuhan Harian': 'bg-[#ffab69]',
  'Kopi': 'bg-[#84cc16]',
  'Gaji': 'bg-[#10b981]',
  'Freelance': 'bg-[#06b6d4]',
  'Hiburan': 'bg-[#ec4899]',
  'Tagihan': 'bg-[#f43f5e]',
  'Transportasi': 'bg-[#3b82f6]',
  'Makanan': 'bg-[#f97316]',
  'Kesehatan': 'bg-[#14b8a6]',
  'Lainnya': 'bg-[#8b5cf6]',
};

export const RecentActivity: React.FC = () => {
  const { transactions, deleteTransaction, setCurrentTab } = useTransactionStore();
  const [selectedTxId, setSelectedTxId] = useState<string | null>(null);

  // Get recent 5 transactions
  const recentTransactions = transactions.slice(0, 5);

  const formatDateLabel = (isoDate: string) => {
    try {
      const date = new Date(isoDate);
      if (isNaN(date.getTime())) return '20 March 2021, 12:57';
      const day = date.getDate();
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const month = monthNames[date.getMonth()];
      const year = date.getFullYear();
      const hours = String(date.getHours()).padStart(2, '0');
      const mins = String(date.getMinutes()).padStart(2, '0');
      return `${day} ${month} ${year}, ${hours}:${mins}`;
    } catch {
      return '20 March 2021, 12:57';
    }
  };

  return (
    <div className="mt-4 mb-24">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-bold text-[#1b1c1c] tracking-tight">
          Aktivitas Terkini
        </h2>
        <button
          onClick={() => setCurrentTab('history')}
          className="text-xs font-bold text-[#5d5fef] hover:underline"
        >
          Lihat Semua
        </button>
      </div>

      <div className="space-y-3">
        {recentTransactions.map((tx) => {
          const isExpense = tx.type === 'expense';
          const iconBg = CATEGORY_BG_COLORS[tx.category] || 'bg-[#5d5fef]';

          return (
            <div
              key={tx.id}
              onClick={() => setSelectedTxId(selectedTxId === tx.id ? null : tx.id)}
              className="bg-white rounded-3xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] border border-white/80 flex items-center justify-between transition-all hover:shadow-md cursor-pointer group"
            >
              <div className="flex items-center space-x-3.5 flex-1 min-w-0 mr-3">
                {/* Category Icon */}
                <div
                  className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.08)]`}
                >
                  {CATEGORY_ICONS[tx.category] || <ShoppingBag className="w-5 h-5 text-white" />}
                </div>

                {/* Title & Date */}
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#1b1c1c] group-hover:text-[#5d5fef] transition-colors truncate">
                    {tx.title}
                  </h3>
                  <p className="text-xs font-medium text-[#767586] mt-0.5 truncate">
                    {formatDateLabel(tx.date)}
                  </p>
                </div>
              </div>

              {/* Amount & Type / Action */}
              <div className="text-right flex items-center space-x-2 shrink-0">
                <div>
                  <div className="text-base font-extrabold text-[#1b1c1c]">
                    {isExpense ? `- ${formatCurrency(tx.amount)}` : `+ ${formatCurrency(tx.amount)}`}
                  </div>
                  <div className="text-xs font-semibold text-[#767586] mt-0.5 capitalize">
                    {tx.type === 'expense' ? 'Pengeluaran' : 'Pemasukan'}
                  </div>
                </div>

                {/* Delete button toggle on click */}
                {selectedTxId === tx.id && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTransaction(tx.id);
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors ml-1"
                    title="Delete transaction"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {recentTransactions.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center text-[#767586] text-sm">
            Belum ada aktivitas terkini yang tercatat.
          </div>
        )}
      </div>
    </div>
  );
};
