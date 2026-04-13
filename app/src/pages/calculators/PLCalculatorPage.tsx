import React, { useState } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { PLCalculator } from '../../library/financial-toolkit/calculators/PLCalculator';
import type { PLStatement } from '../../library/financial-toolkit/types';

const DEFAULT_FORM = {
  businessName: '',
  period: 'monthly' as const,
  startDate: '',
  endDate: '',
  revenue: '',
  cogs: '',
  rent: '',
  salaries: '',
  utilities: '',
  marketing: '',
  transport: '',
  otherExpenses: '',
  founderSalary: '',
  depreciation: '',
  interest: '',
  tax: '',
};

function fmt(n: number, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export function PLCalculatorPage() {
  const { activeBusiness } = useBusiness();
  const [form, setForm] = useState({ ...DEFAULT_FORM, businessName: activeBusiness?.name ?? '' });
  const [result, setResult] = useState<PLStatement | null>(null);
  const [error, setError] = useState<string | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const r = PLCalculator.calculate({
        companyId: activeBusiness?.id ?? 'demo',
        businessName: form.businessName,
        period: form.period,
        startDate: form.startDate,
        endDate: form.endDate,
        currency: (activeBusiness?.currency as 'KES') ?? 'KES',
        revenue: Number(form.revenue),
        cogs: Number(form.cogs),
        rent: Number(form.rent),
        salaries: Number(form.salaries),
        utilities: Number(form.utilities),
        marketing: Number(form.marketing),
        transport: Number(form.transport),
        otherExpenses: Number(form.otherExpenses),
        founderSalary: Number(form.founderSalary),
        depreciation: Number(form.depreciation),
        interest: Number(form.interest),
        tax: Number(form.tax),
      });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  };

  const currency = activeBusiness?.currency ?? 'KES';
  const fields: { key: keyof typeof form; label: string; type?: string; options?: string[] }[] = [
    { key: 'businessName', label: 'Business name', type: 'text' },
    { key: 'period', label: 'Period', options: ['monthly', 'quarterly', 'yearly'] },
    { key: 'startDate', label: 'Start date', type: 'date' },
    { key: 'endDate', label: 'End date', type: 'date' },
    { key: 'revenue', label: 'Revenue' },
    { key: 'cogs', label: 'Cost of goods sold (COGS)' },
    { key: 'rent', label: 'Rent' },
    { key: 'salaries', label: 'Salaries' },
    { key: 'utilities', label: 'Utilities' },
    { key: 'marketing', label: 'Marketing' },
    { key: 'transport', label: 'Transport' },
    { key: 'otherExpenses', label: 'Other expenses' },
    { key: 'founderSalary', label: "Founder's salary" },
    { key: 'depreciation', label: 'Depreciation' },
    { key: 'interest', label: 'Interest' },
    { key: 'tax', label: 'Tax' },
  ];

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">P&L Statement</h1>
      <p className="text-sm text-gray-500 mb-6">Profit & Loss analysis for your business</p>

      <form onSubmit={handleCalc} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              {f.options ? (
                <select
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type ?? 'number'}
                  min={f.type === 'number' || !f.type ? '0' : undefined}
                  value={form[f.key]}
                  onChange={e => set(f.key, e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={f.type === 'text' ? '' : '0'}
                />
              )}
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
          Calculate
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Results</h2>
          {[
            { label: 'Gross Profit', value: fmt(result.metrics.grossProfit, currency) },
            { label: 'Gross Margin', value: `${result.metrics.grossMargin.toFixed(1)}%` },
            { label: 'Operating Income', value: fmt(result.metrics.operatingIncome, currency) },
            { label: 'EBITDA', value: fmt(result.metrics.ebitda, currency) },
            { label: 'Net Income', value: fmt(result.metrics.netIncome, currency) },
            { label: 'Net Margin', value: `${result.metrics.netMargin.toFixed(1)}%` },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
              <span className="text-gray-600">{row.label}</span>
              <span className={`font-medium ${row.value.startsWith('-') ? 'text-red-600' : 'text-gray-900'}`}>{row.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
