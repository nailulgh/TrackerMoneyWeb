import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction, BudgetConfig, Category, TransactionType } from '../types';

interface TransactionState {
  transactions: Transaction[];
  budget: BudgetConfig;
  openingBalance: number;
  currentTab: 'home' | 'statistic' | 'history' | 'reports';
  isAddModalOpen: boolean;
  isCsvModalOpen: boolean;
  isBudgetModalOpen: boolean;
  isNotificationOpen: boolean;
  
  // Actions
  setOpeningBalance: (amount: number) => void;
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  editTransaction: (id: string, tx: Partial<Transaction>) => void;
  setCurrentTab: (tab: 'home' | 'statistic' | 'history' | 'reports') => void;
  setAddModalOpen: (isOpen: boolean) => void;
  setCsvModalOpen: (isOpen: boolean) => void;
  setBudgetModalOpen: (isOpen: boolean) => void;
  setNotificationOpen: (isOpen: boolean) => void;
  updateBudget: (config: Partial<BudgetConfig>) => void;
  importTransactions: (txs: Omit<Transaction, 'id'>[]) => void;
  resetAllData: () => void;
}

const initialTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'expense',
    title: 'Belanja Pakaian',
    category: 'Belanja',
    amount: 100000,
    date: '2021-03-20T12:57:00',
    paymentMethod: 'non-cash',
    notes: 'Belanja baju online'
  },
  {
    id: 'tx-2',
    type: 'income',
    title: 'Proyek Freelance',
    category: 'Freelance',
    amount: 1500000,
    date: '2021-03-20T08:00:00',
    paymentMethod: 'non-cash',
    notes: 'Pembayaran desain UI/UX'
  },
  {
    id: 'tx-3',
    type: 'expense',
    title: 'Supermarket',
    category: 'Kebutuhan Harian',
    amount: 123240,
    date: '2021-03-19T15:30:00',
    paymentMethod: 'non-cash' as any,
    notes: 'Sayur & buah mingguan'
  },
  {
    id: 'tx-4',
    type: 'expense',
    title: 'Kedai Kopi',
    category: 'Kopi',
    amount: 135530,
    date: '2021-03-18T09:15:00',
    paymentMethod: 'cash',
    notes: 'Kopi espresso'
  },
  {
    id: 'tx-5',
    type: 'expense',
    title: 'Butik Fashion',
    category: 'Belanja',
    amount: 34320,
    date: '2021-03-15T14:20:00',
    paymentMethod: 'non-cash',
    notes: 'Aksesoris'
  },
  {
    id: 'tx-6',
    type: 'income',
    title: 'Gaji Bulanan',
    category: 'Gaji',
    amount: 6000000,
    date: '2021-03-01T09:00:00',
    paymentMethod: 'non-cash',
    notes: 'Gaji pokok'
  },
  {
    id: 'tx-7',
    type: 'expense',
    title: 'Belanja Pakaian',
    category: 'Belanja',
    amount: 50000,
    date: '2021-02-15T12:00:00',
    paymentMethod: 'non-cash',
    notes: 'Belanja bulan lalu'
  },
  {
    id: 'tx-8',
    type: 'expense',
    title: 'Supermarket',
    category: 'Kebutuhan Harian',
    amount: 110000,
    date: '2021-02-10T10:00:00',
    paymentMethod: 'non-cash',
    notes: 'Belanja bulanan lalu'
  }
];

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: initialTransactions,
      budget: {
        period: 'monthly',
        monthlyBudget: 8000000,
        weeklyBudget: 2000000,
        targetDailyLimit: 250000,
      },
      openingBalance: 0,
      currentTab: 'home',
      isAddModalOpen: false,
      isCsvModalOpen: false,
      isBudgetModalOpen: false,
      isNotificationOpen: false,

      setOpeningBalance: (amount) => set({ openingBalance: amount }),

      addTransaction: (tx) =>
        set((state) => ({
          transactions: [
            {
              ...tx,
              id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            },
            ...state.transactions,
          ],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      editTransaction: (id, updated) =>
        set((state) => ({
          transactions: state.transactions.map((t) =>
            t.id === id ? { ...t, ...updated } : t
          ),
        })),

      setCurrentTab: (tab) => set({ currentTab: tab }),
      setAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),
      setCsvModalOpen: (isOpen) => set({ isCsvModalOpen: isOpen }),
      setBudgetModalOpen: (isOpen) => set({ isBudgetModalOpen: isOpen }),
      setNotificationOpen: (isOpen) => set({ isNotificationOpen: isOpen }),

      updateBudget: (config) =>
        set((state) => ({
          budget: { ...state.budget, ...config },
        })),

      importTransactions: (importedTxs) =>
        set((state) => {
          const newFormatted = importedTxs.map((t) => ({
            ...t,
            id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          }));
          return { transactions: [...newFormatted, ...state.transactions] };
        }),

      resetAllData: () =>
        set({
          transactions: [],
          openingBalance: 0,
          budget: { period: 'monthly', monthlyBudget: 8000000, weeklyBudget: 2000000, targetDailyLimit: 250000 },
        }),
    }),
    {
      name: 'duitrack-storage-v1',
    }
  )
);
