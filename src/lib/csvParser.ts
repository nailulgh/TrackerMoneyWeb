import Papa from 'papaparse';
import { Transaction, Category, TransactionType, PaymentMethod } from '../types';

export interface RawCsvRow {
  [key: string]: string;
}

export function parseCsvContent(fileContent: string): Promise<RawCsvRow[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawCsvRow>(fileContent, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error: Error) => {
        reject(error);
      },
    });
  });
}

function parseBankDate(dateStr: string): string {
  // Try to parse YYYY-MM-DD HH:MM:SS by replacing space with T for better cross-browser support
  const normalized = dateStr.replace(' ', 'T');
  const parsed = new Date(normalized);
  if (!isNaN(parsed.getTime())) {
    return parsed.toISOString();
  }
  return new Date().toISOString();
}

export function autoMapBankCsvRow(row: RawCsvRow): Omit<Transaction, 'id'> | null {
  // Check if it's the specific bank format by looking for MUTASI_DEBET or MUTASI_KREDIT
  if ('MUTASI_DEBET' in row && 'MUTASI_KREDIT' in row) {
    const debetStr = row['MUTASI_DEBET']?.replace(/[^0-9.]/g, '');
    const debet = parseFloat(debetStr) || 0;
    
    const kreditStr = row['MUTASI_KREDIT']?.replace(/[^0-9.]/g, '');
    const kredit = parseFloat(kreditStr) || 0;

    if (debet === 0 && kredit === 0) return null;

    const type: TransactionType = kredit > 0 ? 'income' : 'expense';
    const amount = type === 'income' ? kredit : debet;
    
    const title = row['REMARK_CUSTOM']?.trim() || row['DESK_TRAN']?.trim() || 'Transaksi Bank';
    const rawDate = row['TGL_TRAN']?.trim() || row['TGL_EFEKTIF']?.trim() || '';
    const dateIso = rawDate ? parseBankDate(rawDate) : new Date().toISOString();

    return {
      title,
      amount,
      type,
      category: 'Lainnya', // Default category for bank imports
      date: dateIso,
      paymentMethod: 'non-cash',
      notes: title,
    };
  }
  
  return null;
}

export function mapRawRowToTransaction(
  row: RawCsvRow,
  titleKey: string,
  amountKey: string,
  typeKey: string,
  categoryKey: string,
  dateKey: string
): Omit<Transaction, 'id'> | null {
  // Try to auto-map specific bank formats first
  const bankMapped = autoMapBankCsvRow(row);
  if (bankMapped) return bankMapped;

  const title = row[titleKey]?.trim() || 'Transaksi Impor';

  const amountStr = row[amountKey]?.replace(/[^0-9.]/g, '');
  const amount = parseFloat(amountStr) || 0;

  if (amount <= 0) return null;

  const rawType = (row[typeKey] || '').toLowerCase();
  const type: TransactionType =
    rawType.includes('inc') || rawType.includes('in') ? 'income' : 'expense';

  const rawCategory = row[categoryKey]?.trim();
  const validCategories: Category[] = [
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

  const category: Category = validCategories.find(
    (c) => c.toLowerCase() === rawCategory?.toLowerCase()
  ) || 'Lainnya';

  const rawDate = row[dateKey]?.trim();
  let dateIso = new Date().toISOString();
  if (rawDate) {
    const parsed = new Date(rawDate);
    if (!isNaN(parsed.getTime())) {
      dateIso = parsed.toISOString();
    }
  }

  return {
    title,
    amount,
    type,
    category,
    date: dateIso,
    paymentMethod: 'non-cash',
    notes: 'Diimpor via CSV',
  };
}

export function exportTransactionsToCsv(transactions: Transaction[]): string {
  const exportData = transactions.map((t) => ({
    Date: t.date,
    Title: t.title,
    Category: t.category,
    Type: t.type,
    Amount: t.amount,
    PaymentMethod: t.paymentMethod,
    Notes: t.notes || '',
  }));

  return Papa.unparse(exportData);
}

export function downloadCsvFile(csvContent: string, filename: string = 'duitrack-export.csv') {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
