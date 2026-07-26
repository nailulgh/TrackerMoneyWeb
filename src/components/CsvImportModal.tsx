import React, { useState } from 'react';
import { X, Upload, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { useTransactionStore } from '../store/useTransactionStore';
import { parseCsvContent, RawCsvRow, mapRawRowToTransaction } from '../lib/csvParser';

export const CsvImportModal: React.FC = () => {
  const { isCsvModalOpen, setCsvModalOpen, importTransactions } = useTransactionStore();

  const [rawRows, setRawRows] = useState<RawCsvRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');
  const [isBankFormat, setIsBankFormat] = useState(false);

  // Column Mappings
  const [titleKey, setTitleKey] = useState('');
  const [amountKey, setAmountKey] = useState('');
  const [typeKey, setTypeKey] = useState('');
  const [categoryKey, setCategoryKey] = useState('');
  const [dateKey, setDateKey] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isCsvModalOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg('');
    setSuccessCount(null);
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    try {
      const text = await file.text();
      const rows = await parseCsvContent(text);
      if (rows.length === 0) {
        setErrorMsg('File CSV tampaknya kosong.');
        return;
      }

      setRawRows(rows);
      const cols = Object.keys(rows[0] || {});
      setColumns(cols);

      const isBankFormat = cols.includes('MUTASI_DEBET') && cols.includes('MUTASI_KREDIT');
      setIsBankFormat(isBankFormat);

      if (isBankFormat) {
        setAmountKey('MUTASI_DEBET'); // just to bypass the amountKey validation
        setTitleKey('REMARK_CUSTOM');
        setDateKey('TGL_TRAN');
      } else {
        // Auto detect columns
        setTitleKey(cols.find((c) => /title|desc|name/i.test(c)) || cols[0] || '');
        setAmountKey(cols.find((c) => /amount|price|val/i.test(c)) || cols[1] || '');
        setTypeKey(cols.find((c) => /type|kind/i.test(c)) || '');
        setCategoryKey(cols.find((c) => /cat/i.test(c)) || '');
        setDateKey(cols.find((c) => /date|time/i.test(c)) || '');
      }
    } catch (err: any) {
      setErrorMsg('Gagal mengurai file CSV: ' + err.message);
    }
  };

  const handleImport = () => {
    if (!amountKey) {
      setErrorMsg('Silakan pilih setidaknya kolom Jumlah (Amount).');
      return;
    }

    const imported = rawRows
      .map((row) =>
        mapRawRowToTransaction(
          row,
          titleKey,
          amountKey,
          typeKey,
          categoryKey,
          dateKey
        )
      )
      .filter((t): t is NonNullable<typeof t> => t !== null);

    if (imported.length === 0) {
      setErrorMsg('Tidak ada transaksi valid yang dapat diurai dari baris CSV.');
      return;
    }

    if (isBankFormat && rawRows.length > 0 && 'SALDO_AWAL_MUTASI' in rawRows[0]) {
      const openingBalStr = rawRows[0]['SALDO_AWAL_MUTASI']?.replace(/[^0-9.-]/g, '');
      const initialBal = parseFloat(openingBalStr || '');
      if (!isNaN(initialBal)) {
        useTransactionStore.getState().setOpeningBalance(initialBal);
      }
    }

    importTransactions(imported);
    setSuccessCount(imported.length);
    setTimeout(() => {
      setCsvModalOpen(false);
      setSuccessCount(null);
      setRawRows([]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/80 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-[#f0eded]">
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-[#5d5fef]" />
            <h2 className="text-xl font-bold text-[#1b1c1c]">Impor CSV</h2>
          </div>
          <button
            onClick={() => setCsvModalOpen(false)}
            className="w-9 h-9 bg-[#f0eded] rounded-full flex items-center justify-center text-[#767586] hover:text-[#1b1c1c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="mt-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-2xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successCount !== null && (
          <div className="mt-4 p-3 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>Berhasil mengimpor {successCount} transaksi!</span>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-[#c7c4d7] hover:border-[#5d5fef] rounded-2xl p-6 text-center bg-[#f0f0fa]/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <Upload className="w-8 h-8 text-[#5d5fef] mx-auto mb-2" />
            <p className="text-sm font-bold text-[#1b1c1c]">
              {fileName ? fileName : 'Klik atau letakkan file CSV Anda di sini'}
            </p>
            <p className="text-xs text-[#767586] mt-1">Mendukung ekspor transaksi CSV standar</p>
          </div>

          {isBankFormat && (
            <div className="mt-2 p-3 bg-blue-50 text-blue-700 text-xs font-bold rounded-2xl flex items-center space-x-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>Format mutasi bank terdeteksi. Data akan dipetakan secara otomatis.</span>
            </div>
          )}

          {/* Column Mapping Options */}
          {columns.length > 0 && !isBankFormat && (
            <div className="space-y-3 pt-2">
              <h3 className="text-xs font-extrabold text-[#1b1c1c] uppercase tracking-wider">
                Petakan Kolom CSV ({rawRows.length} baris)
              </h3>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[#767586] block mb-1">Kolom Judul</label>
                  <select
                    value={titleKey}
                    onChange={(e) => setTitleKey(e.target.value)}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl font-bold text-[#1b1c1c]"
                  >
                    <option value="">Tidak Ada / Default</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#767586] block mb-1">Kolom Jumlah *</label>
                  <select
                    value={amountKey}
                    onChange={(e) => setAmountKey(e.target.value)}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl font-bold text-[#1b1c1c]"
                  >
                    <option value="">Pilih kolom</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#767586] block mb-1">Kolom Kategori</label>
                  <select
                    value={categoryKey}
                    onChange={(e) => setCategoryKey(e.target.value)}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl font-bold text-[#1b1c1c]"
                  >
                    <option value="">Tidak Ada / Otomatis</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-[#767586] block mb-1">Kolom Tanggal</label>
                  <select
                    value={dateKey}
                    onChange={(e) => setDateKey(e.target.value)}
                    className="w-full p-2.5 bg-[#f6f3f2] rounded-xl font-bold text-[#1b1c1c]"
                  >
                    <option value="">Tidak Ada / Hari Ini</option>
                    {columns.map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {columns.length > 0 && (
            <button
              type="button"
              onClick={handleImport}
              className="w-full mt-4 py-3 bg-[#5d5fef] text-white rounded-2xl font-bold text-sm shadow-md hover:bg-[#4343d5] transition-colors"
            >
              Selesaikan Impor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
