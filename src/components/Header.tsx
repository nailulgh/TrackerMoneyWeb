import React from 'react';
import { Bell, Sparkles } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';

export const Header: React.FC = () => {
  const { setNotificationOpen, setBudgetModalOpen } = useTransactionStore();

  const now = new Date();
  const formatter = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  const todayStr = formatter.format(now);

  return (
    <header className="flex items-center justify-between pt-2 pb-4 px-1">
      <div>
        <span className="text-xs font-semibold text-[#767586] tracking-wide block mb-1">
          {todayStr}
        </span>
        <h1 className="text-[28px] leading-tight font-extrabold text-[#1b1c1c] tracking-tight">
          Pelacak Keuangan
        </h1>
        <p className="text-sm font-medium text-[#767586] mt-0.5">
          Hai, selamat datang kembali
        </p>
      </div>

      <div className="flex items-center space-x-3">
        {/* Notification Bell with red indicator */}
        <button
          onClick={() => setNotificationOpen(true)}
          className="relative w-11 h-11 bg-white rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-md transition-all active:scale-95"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-[#1b1c1c]" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#ba1a1a] rounded-full border border-white" />
        </button>

        {/* User Profile Avatar */}
        <button
          onClick={() => setBudgetModalOpen(true)}
          className="relative w-12 h-12 rounded-full p-0.5 bg-gradient-to-tr from-[#5d5fef] to-[#ffab69] shadow-[0_4px_16px_rgba(93,95,239,0.15)] hover:scale-105 transition-transform"
          aria-label="Profile & Budget Settings"
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
            alt="User avatar"
            className="w-full h-full object-cover rounded-full border-2 border-white"
          />
        </button>
      </div>
    </header>
  );
};
