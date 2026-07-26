import { Transaction, Category } from '../types';

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
  color: string;
}

export const CATEGORY_COLORS: Record<string, string> = {
  'Belanja': '#5d5fef', // Deep vibrant purple / indigo
  'Kebutuhan Harian': '#ffab69',  // Warm orange/peach
  'Kopi': '#84cc16',    // Lime green
  'Gaji': '#10b981',   // Emerald green
  'Freelance': '#06b6d4', // Cyan
  'Hiburan': '#ec4899', // Pink
  'Tagihan': '#f43f5e',    // Rose
  'Transportasi': '#3b82f6', // Blue
  'Makanan': '#f97316',     // Orange
  'Kesehatan': '#14b8a6',   // Teal
  'Lainnya': '#8b5cf6',    // Violet
};

export function getLastSixMonths() {
  const months = [];
  const formatter = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' });
  const now = new Date();
  
  for (let i = 0; i < 6; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const monthStr = String(d.getMonth() + 1).padStart(2, '0');
    months.push({
      value: `${year}-${monthStr}`,
      label: formatter.format(d)
    });
  }
  return months;
}

export function getMonthExpenseSummary(
  transactions: Transaction[],
  targetYearMonth: string = '2021-03'
): {
  totalExpense: number;
  categories: CategorySummary[];
} {
  const monthTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(targetYearMonth)
  );

  const totalExpense = monthTransactions.reduce((acc, t) => acc + t.amount, 0);

  if (totalExpense === 0) {
    return { totalExpense: 0, categories: [] };
  }

  const categoryMap: Partial<Record<Category, number>> = {};
  monthTransactions.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const categories: CategorySummary[] = Object.entries(categoryMap).map(
    ([cat, amount]) => {
      const percentage = Math.round((amount / totalExpense) * 100);
      return {
        category: cat as Category,
        amount,
        percentage,
        color: CATEGORY_COLORS[cat] || '#8b5cf6',
      };
    }
  );

  // Sort descending by amount
  categories.sort((a, b) => b.amount - a.amount);

  return { totalExpense, categories };
}

export function getWeekStartEnd(date: Date = new Date()) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
  const start = new Date(d.setDate(diff));
  start.setHours(0,0,0,0);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  end.setHours(23,59,59,999);
  return { start, end };
}

export function getWeekExpenseSummary(
  transactions: Transaction[],
  date: Date = new Date()
): {
  totalExpense: number;
  categories: CategorySummary[];
} {
  const { start, end } = getWeekStartEnd(date);
  
  const weekTransactions = transactions.filter(t => {
    if (t.type !== 'expense') return false;
    const txDate = new Date(t.date);
    return txDate >= start && txDate <= end;
  });

  const totalExpense = weekTransactions.reduce((acc, t) => acc + t.amount, 0);

  if (totalExpense === 0) {
    return { totalExpense: 0, categories: [] };
  }

  const categoryMap: Partial<Record<Category, number>> = {};
  weekTransactions.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  const categories: CategorySummary[] = Object.entries(categoryMap).map(
    ([cat, amount]) => {
      const percentage = Math.round((amount / totalExpense) * 100);
      return {
        category: cat as Category,
        amount,
        percentage,
        color: CATEGORY_COLORS[cat] || '#8b5cf6',
      };
    }
  );

  categories.sort((a, b) => b.amount - a.amount);
  return { totalExpense, categories };
}

export function getTodaySummary(
  transactions: Transaction[],
  todayDateStr: string = '2021-03-20'
) {
  const todayTxs = transactions.filter((t) => t.date.startsWith(todayDateStr));

  const income = todayTxs
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = todayTxs
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  return { income, expenses };
}

export function calculateDailySafeSpend(
  monthlyBudget: number,
  totalMonthExpense: number,
  currentDay: number = 20,
  totalDaysInMonth: number = 31
) {
  const remainingDays = Math.max(1, totalDaysInMonth - currentDay + 1);
  const remainingBudget = Math.max(0, monthlyBudget - totalMonthExpense);
  const dailySafeSpend = Math.round(remainingBudget / remainingDays);
  const percentUsed = Math.min(100, Math.round((totalMonthExpense / monthlyBudget) * 100));

  return {
    remainingBudget,
    dailySafeSpend,
    remainingDays,
    percentUsed,
  };
}

export interface SpendSpike {
  category: Category;
  amount: number;
  averageAmount: number;
  percentageIncrease: number;
}

export function detectUnusualSpendSpikes(
  transactions: Transaction[],
  targetYearMonth: string = '2021-03'
): SpendSpike[] {
  const expenses = transactions.filter((t) => t.type === 'expense');
  const monthlyCategoryTotals: Record<string, Record<string, number>> = {};

  expenses.forEach((t) => {
    const month = t.date.substring(0, 7);
    if (!monthlyCategoryTotals[month]) {
      monthlyCategoryTotals[month] = {};
    }
    monthlyCategoryTotals[month][t.category] =
      (monthlyCategoryTotals[month][t.category] || 0) + t.amount;
  });

  const currentMonthTotals = monthlyCategoryTotals[targetYearMonth] || {};
  const otherMonths = Object.keys(monthlyCategoryTotals).filter(
    (m) => m < targetYearMonth
  );

  const spikes: SpendSpike[] = [];

  if (otherMonths.length === 0) {
    return spikes;
  }

  const historicalAverages: Record<string, number> = {};
  otherMonths.forEach((month) => {
    Object.entries(monthlyCategoryTotals[month]).forEach(([cat, amount]) => {
      historicalAverages[cat] = (historicalAverages[cat] || 0) + amount;
    });
  });

  Object.keys(historicalAverages).forEach((cat) => {
    historicalAverages[cat] = historicalAverages[cat] / otherMonths.length;
  });

  Object.entries(currentMonthTotals).forEach(([cat, amount]) => {
    const avg = historicalAverages[cat] || 0;
    // Consider it a spike if it's > 20% higher than average and the difference is at least 20,000
    if (avg > 0 && amount > avg * 1.2 && (amount - avg) > 20000) {
      spikes.push({
        category: cat as Category,
        amount,
        averageAmount: avg,
        percentageIncrease: Math.round(((amount - avg) / avg) * 100),
      });
    }
  });

  return spikes.sort((a, b) => b.percentageIncrease - a.percentageIncrease);
}

export function calculateMonthProjection(
  transactions: Transaction[],
  targetYearMonth: string = '2021-03'
) {
  const monthTransactions = transactions.filter(
    (t) => t.type === 'expense' && t.date.startsWith(targetYearMonth)
  );

  const totalExpense = monthTransactions.reduce((acc, t) => acc + t.amount, 0);

  if (totalExpense === 0) {
    return { currentTotal: 0, projectedTotal: 0, dailyAverage: 0, daysInMonth: 30, daysPassed: 1 };
  }

  let maxDay = 1;
  monthTransactions.forEach((t) => {
    const day = parseInt(t.date.substring(8, 10), 10);
    if (!isNaN(day) && day > maxDay) {
      maxDay = day;
    }
  });

  const parts = targetYearMonth.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10);
  const daysInMonth = new Date(year, month, 0).getDate();

  const dailyAverage = totalExpense / maxDay;
  const projectedTotal = Math.round(dailyAverage * daysInMonth);

  return {
    currentTotal: totalExpense,
    projectedTotal,
    dailyAverage: Math.round(dailyAverage),
    daysInMonth,
    daysPassed: maxDay,
  };
}

export function formatCurrency(num: number): string {
  // Matches "$39.309" or "$10.000" dot separator format as shown in design image ($39.309)
  const formatted = num.toLocaleString('id-ID'); // uses dot for thousands e.g. 39.309 or 10.000
  return `Rp ${formatted}`;
}
