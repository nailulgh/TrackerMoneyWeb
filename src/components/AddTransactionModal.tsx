import React, { useState } from 'react';
import { X, Plus, Minus, Calendar, Tag, CreditCard, DollarSign } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { Category, PaymentMethod, TransactionType } from '../types';

const CATEGORIES: Category[] = [
  'Belanja',
  'Kebutuhan Harian',
  'Kopi',
  'Gaji',
  'Freelance',
  'Hiburan',
  'Tagihan',
  'Transportasi',
  'Makanan',
  'Kesehatan',
  'Lainnya',
];

export const AddTransactionModal: React.FC = () => {
  const { isAddModalOpen, setAddModalOpen, addTransaction } = useTransactionStore();

  const [type, setType] = useState<TransactionType>('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('Belanja');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('non-cash');
  const [notes, setNotes] = useState('');

  if (!isAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) return;

    addTransaction({
      type,
      title: title.trim() || category,
      amount: numericAmount,
      category,
      date: new Date().toISOString(),
      paymentMethod,
      notes,
    });

    // Reset & close
    setTitle('');
    setAmount('');
    setNotes('');
    setAddModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs transition-opacity animate-fade-in">
      <div className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl border border-white/80 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#f0eded]">
          <h2 className="text-xl font-bold text-[#1b1c1c]">Tambah Transaksi</h2>
          <button
            onClick={() => setAddModalOpen(false)}
            className="w-9 h-9 bg-[#f0eded] rounded-full flex items-center justify-center text-[#767586] hover:text-[#1b1c1c] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Type Toggle: Expense / Income */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#f0eded] rounded-2xl">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Gaji' || category === 'Freelance') setCategory('Belanja');
              }}
              className={`py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-1.5 ${
                type === 'expense'
                  ? 'bg-[#ffab69] text-white shadow-sm'
                  : 'text-[#767586] hover:text-[#1b1c1c]'
              }`}
            >
              <Minus className="w-4 h-4" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('Gaji');
              }}
              className={`py-2.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-1.5 ${
                type === 'income'
                  ? 'bg-[#5d5fef] text-white shadow-sm'
                  : 'text-[#767586] hover:text-[#1b1c1c]'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Pemasukan</span>
            </button>
          </div>

          {/* Amount Input */}
          <div>
            <label className="text-xs font-bold text-[#767586] uppercase tracking-wider block mb-1">
              Jumlah
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#767586] font-bold">
                Rp
              </div>
              <input
                type="number"
                step="any"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-[#f6f3f2] rounded-2xl text-lg font-extrabold text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#5d5fef]"
              />
            </div>
          </div>

          {/* Title Input */}
          <div>
            <label className="text-xs font-bold text-[#767586] uppercase tracking-wider block mb-1">
              Judul / Deskripsi
            </label>
            <input
              type="text"
              placeholder={type === 'expense' ? 'misal: Belanja di Toko' : 'misal: Pembayaran Klien Freelance'}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-[#f6f3f2] rounded-2xl font-semibold text-sm text-[#1b1c1c] focus:outline-none focus:ring-2 focus:ring-[#5d5fef]"
            />
          </div>

          {/* Category Select */}
          <div>
            <label className="text-xs font-bold text-[#767586] uppercase tracking-wider block mb-1">
              Kategori
            </label>
            <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border ${
                    category === cat
                      ? 'bg-[#5d5fef] text-white border-[#5d5fef] shadow-xs'
                      : 'bg-white text-[#464555] border-[#f0eded] hover:bg-[#f6f3f2]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div>
            <label className="text-xs font-bold text-[#767586] uppercase tracking-wider block mb-1">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  paymentMethod === 'cash'
                    ? 'bg-[#1b1c1c] text-white border-[#1b1c1c]'
                    : 'bg-white text-[#464555] border-[#f0eded]'
                }`}
              >
                Tunai
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('non-cash')}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all border ${
                  paymentMethod === 'non-cash'
                    ? 'bg-[#1b1c1c] text-white border-[#1b1c1c]'
                    : 'bg-white text-[#464555] border-[#f0eded]'
                }`}
              >
                Kartu / Digital
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-[#5d5fef] text-white rounded-2xl font-extrabold text-base shadow-[0_10px_20px_rgba(93,95,239,0.3)] hover:bg-[#4343d5] active:scale-[0.99] transition-all mt-4"
          >
            Simpan Transaksi
          </button>
        </form>
      </div>
    </div>
  );
};
