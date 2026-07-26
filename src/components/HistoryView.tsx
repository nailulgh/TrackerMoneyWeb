import React, { useState } from 'react';
import { Search, Filter, Trash2, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { formatCurrency } from '../lib/stats';
import { Category, TransactionType } from '../types';

export const HistoryView: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactionStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch =
      tx.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === 'all' || tx.type === filterType;

    const matchesCat = filterCategory === 'all' || tx.category === filterCategory;

    return matchesSearch && matchesType && matchesCat;
  });

  return (
    <div className="space-y-4 pb-28 pt-2">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-extrabold text-[#1b1c1c]">Riwayat Transaksi</h1>
        <span className="text-xs font-bold text-[#767586] bg-white px-3 py-1.5 rounded-full shadow-xs">
          {filteredTransactions.length} item
        </span>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-5 h-5 absolute left-3.5 top-3.5 text-[#767586]" />
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white rounded-2xl text-sm font-semibold text-[#1b1c1c] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#5d5fef]"
        />
      </div>

      {/* Filter Badges */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setFilterType('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterType === 'all'
              ? 'bg-[#1b1c1c] text-white'
              : 'bg-white text-[#767586] border border-[#f0eded]'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilterType('expense')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterType === 'expense'
              ? 'bg-[#ffab69] text-white'
              : 'bg-white text-[#767586] border border-[#f0eded]'
          }`}
        >
          Pengeluaran
        </button>
        <button
          onClick={() => setFilterType('income')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
            filterType === 'income'
              ? 'bg-[#5d5fef] text-white'
              : 'bg-white text-[#767586] border border-[#f0eded]'
          }`}
        >
          Pemasukan
        </button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {filteredTransactions.map((tx) => {
          const isExpense = tx.type === 'expense';
          return (
            <div
              key={tx.id}
              className="bg-white rounded-3xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.03)] flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0 mr-3">
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${
                    isExpense ? 'bg-[#fff7ed] text-[#ff914d]' : 'bg-[#f0f0fa] text-[#5d5fef]'
                  }`}
                >
                  {isExpense ? (
                    <ArrowDownRight className="w-5 h-5" />
                  ) : (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-[#1b1c1c] truncate">{tx.title}</h3>
                  <p className="text-[11px] font-medium text-[#767586] truncate">
                    {tx.category} • {new Date(tx.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <div className="text-right">
                  <div
                    className={`text-sm font-extrabold ${
                      isExpense ? 'text-[#ff914d]' : 'text-[#5d5fef]'
                    }`}
                  >
                    {isExpense ? `- ${formatCurrency(tx.amount)}` : `+ ${formatCurrency(tx.amount)}`}
                  </div>
                  <div className="text-[10px] text-[#767586] uppercase font-bold">
                    {tx.paymentMethod}
                  </div>
                </div>

                <button
                  onClick={() => deleteTransaction(tx.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredTransactions.length === 0 && (
          <div className="bg-white rounded-3xl p-8 text-center text-[#767586] text-sm">
            Tidak ada transaksi yang sesuai dengan filter pencarian Anda.
          </div>
        )}
      </div>
    </div>
  );
};
