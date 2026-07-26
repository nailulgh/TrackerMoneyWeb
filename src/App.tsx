import React from 'react';
import { useTransactionStore } from './store/useTransactionStore';
import { Header } from './components/Header';
import { BalanceSummaryCard } from './components/BalanceSummaryCard';
import { ExpensesDonutCard } from './components/ExpensesDonutCard';
import { TodaySummaryCard } from './components/TodaySummaryCard';
import { SafeSpendBanner } from './components/SafeSpendBanner';
import { RecentActivity } from './components/RecentActivity';
import { StatisticsView } from './components/StatisticsView';
import { HistoryView } from './components/HistoryView';
import { ReportsView } from './components/ReportsView';
import { BottomNav } from './components/BottomNav';
import { AddTransactionModal } from './components/AddTransactionModal';
import { CsvImportModal } from './components/CsvImportModal';
import { BudgetModal } from './components/BudgetModal';
import { NotificationModal } from './components/NotificationModal';

export default function App() {
  const { currentTab } = useTransactionStore();

  return (
    <div className="min-h-screen bg-[#F0F0FA] text-[#1b1c1c] antialiased selection:bg-[#5d5fef] selection:text-white font-['Manrope']">
      {/* Centered Mobile Container */}
      <main className="max-w-md mx-auto px-4 pt-3 pb-24 min-h-screen flex flex-col justify-between">
        <div className="space-y-4">
          {/* Header */}
          <Header />

          {/* Tab Views */}
          {currentTab === 'home' && (
            <div className="space-y-4 animate-fade-in">
              <BalanceSummaryCard />
              <ExpensesDonutCard />
              <SafeSpendBanner />
              <TodaySummaryCard />
              <RecentActivity />
            </div>
          )}

          {currentTab === 'statistic' && <StatisticsView />}
          {currentTab === 'history' && <HistoryView />}
          {currentTab === 'reports' && <ReportsView />}
        </div>

        {/* Modals & Overlays */}
        <AddTransactionModal />
        <CsvImportModal />
        <BudgetModal />
        <NotificationModal />

        {/* Fixed Floating Bottom Navigation */}
        <BottomNav />
      </main>
    </div>
  );
}
