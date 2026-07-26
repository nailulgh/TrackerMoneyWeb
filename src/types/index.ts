export type TransactionType = 'expense' | 'income';

export type PaymentMethod = 'cash' | 'non-cash';

export type Category = 
  | 'Belanja'
  | 'Kebutuhan Harian'
  | 'Kopi'
  | 'Gaji'
  | 'Freelance'
  | 'Hiburan'
  | 'Tagihan'
  | 'Transportasi'
  | 'Makanan'
  | 'Kesehatan'
  | 'Lainnya';

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  category: Category;
  amount: number; // strictly positive numeric value
  date: string; // ISO string or formatted date string (e.g. 2021-03-20T12:57:00)
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface BudgetConfig {
  period: 'monthly' | 'weekly';
  monthlyBudget: number; // e.g. 8000000
  weeklyBudget: number; // e.g. 2000000
  targetDailyLimit: number; // target daily limit e.g. 250000
}

export type TabType = 'home' | 'statistic' | 'history' | 'reports';
