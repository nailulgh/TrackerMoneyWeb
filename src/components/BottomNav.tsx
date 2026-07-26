import React from 'react';
import { Home, TrendingUp, Plus, Clock, ClipboardList } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';

export const BottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, setAddModalOpen } = useTransactionStore();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md z-40 bg-white/95 backdrop-blur-md rounded-full p-2.5 shadow-[0_15px_35px_rgba(0,0,0,0.08)] border border-white/80 flex items-center justify-around">
      {/* Home Tab */}
      <button
        onClick={() => setCurrentTab('home')}
        className={`flex items-center space-x-2 px-4 py-2.5 rounded-full transition-all duration-300 ${
          currentTab === 'home'
            ? 'bg-[#5d5fef] text-white font-bold shadow-md shadow-[#5d5fef]/25'
            : 'text-[#767586] hover:text-[#1b1c1c]'
        }`}
      >
        <Home className="w-5 h-5" />
        {currentTab === 'home' && <span className="text-sm tracking-tight">Beranda</span>}
      </button>

      {/* Statistic Tab */}
      <button
        onClick={() => setCurrentTab('statistic')}
        className={`p-2.5 rounded-full transition-all duration-300 ${
          currentTab === 'statistic'
            ? 'bg-[#5d5fef] text-white font-bold shadow-md shadow-[#5d5fef]/25 px-4 flex items-center space-x-2'
            : 'text-[#767586] hover:text-[#1b1c1c]'
        }`}
        title="Statistics & Analytics"
      >
        <TrendingUp className="w-5 h-5" />
        {currentTab === 'statistic' && <span className="text-sm tracking-tight">Statistik</span>}
      </button>

      {/* Center Floating Plus Button */}
      <button
        onClick={() => setAddModalOpen(true)}
        className="w-12 h-12 bg-[#5d5fef] text-white rounded-full flex items-center justify-center shadow-[0_8px_20px_rgba(93,95,239,0.35)] hover:scale-105 active:scale-95 transition-transform"
        aria-label="Add Transaction"
      >
        <Plus className="w-6 h-6 stroke-[2.5]" />
      </button>

      {/* History Tab */}
      <button
        onClick={() => setCurrentTab('history')}
        className={`p-2.5 rounded-full transition-all duration-300 ${
          currentTab === 'history'
            ? 'bg-[#5d5fef] text-white font-bold shadow-md shadow-[#5d5fef]/25 px-4 flex items-center space-x-2'
            : 'text-[#767586] hover:text-[#1b1c1c]'
        }`}
        title="Transaction History"
      >
        <Clock className="w-5 h-5" />
        {currentTab === 'history' && <span className="text-sm tracking-tight">Riwayat</span>}
      </button>

      {/* Reports / Export Tab */}
      <button
        onClick={() => setCurrentTab('reports')}
        className={`p-2.5 rounded-full transition-all duration-300 ${
          currentTab === 'reports'
            ? 'bg-[#5d5fef] text-white font-bold shadow-md shadow-[#5d5fef]/25 px-4 flex items-center space-x-2'
            : 'text-[#767586] hover:text-[#1b1c1c]'
        }`}
        title="Reports & CSV Backup"
      >
        <ClipboardList className="w-5 h-5" />
        {currentTab === 'reports' && <span className="text-sm tracking-tight">Laporan</span>}
      </button>
    </nav>
  );
};
