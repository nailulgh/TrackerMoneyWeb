import React from 'react';
import { X, Bell, AlertTriangle, TrendingUp, ShieldAlert, Sparkles } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';

export const NotificationModal: React.FC = () => {
  const { isNotificationOpen, setNotificationOpen } = useTransactionStore();

  if (!isNotificationOpen) return null;

  const notifications = [
    {
      id: 1,
      title: 'Peringatan Batas Aman Harian',
      desc: 'Anda menghabiskan Rp 200.000 hari ini. Sisa batas harian Anda untuk bulan ini adalah Rp 28.760/hari.',
      icon: <ShieldAlert className="w-5 h-5 text-[#ffab69]" />,
      time: '10m lalu',
      bg: 'bg-[#fff7ed]',
    },
    {
      id: 2,
      title: 'Lonjakan Pengeluaran Tak Wajar',
      desc: 'Pengeluaran belanja (Rp 100.000) 35% lebih tinggi dari rata-rata pengeluaran belanja mingguan Anda.',
      icon: <AlertTriangle className="w-5 h-5 text-[#ba1a1a]" />,
      time: '1j lalu',
      bg: 'bg-[#ffdad6]/40',
    },
    {
      id: 3,
      title: 'Pemasukan Tercatat',
      desc: 'Pemasukan proyek freelance (+Rp 100.000) berhasil dicatat.',
      icon: <Sparkles className="w-5 h-5 text-[#5d5fef]" />,
      time: '3j lalu',
      bg: 'bg-[#f0f0fa]',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/80">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0eded]">
          <div className="flex items-center space-x-2">
            <Bell className="w-5 h-5 text-[#5d5fef]" />
            <h2 className="text-xl font-bold text-[#1b1c1c]">Notifikasi</h2>
          </div>
          <button
            onClick={() => setNotificationOpen(false)}
            className="w-9 h-9 bg-[#f0eded] rounded-full flex items-center justify-center text-[#767586] hover:text-[#1b1c1c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl ${n.bg} flex items-start space-x-3 transition-all`}
            >
              <div className="p-2 bg-white rounded-xl shadow-xs shrink-0">{n.icon}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1b1c1c]">{n.title}</h3>
                  <span className="text-[10px] text-[#767586] font-medium">{n.time}</span>
                </div>
                <p className="text-xs text-[#464555] mt-1 leading-snug">{n.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
