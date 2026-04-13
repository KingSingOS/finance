import React, { useState } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { FounderSalaryCalculator } from '../../library/financial-toolkit/calculators/FounderSalaryCalculator';
import type { FounderSalaryCalc } from '../../library/financial-toolkit/types';

function fmt(n: number, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

const EXPENSE_FIELDS = [
  { key: 'rent', label: 'Rent / housing' },
  { key: 'food', label: 'Food & groceries' },
  { key: 'school', label: 'School fees' },
  { key: 'transport', label: 'Transport' },
  { key: 'insurance', label: 'Insurance' },
  { key: 'savings', label: 'Savings target' },
  { key: 'other', label: 'Other personal' },
];

export function FounderSalaryPage() {
  const { activeBusiness } = useBusiness();
  const [expenses, setExpenses] = useState<Record<string, string>>(
    Object.fromEntries(EXPENSE_FIELDS.map(f => [f.key, '']))
  );
  const [businessProfit, setBusinessProfit] = useState('');
  const [businessCash, setBusinessCash] = useState('');
  const [result, setResult] = useState<FounderSalaryCalc | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currency = activeBusiness?.currency ?? 'KES';

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const r = FounderSalaryCalculator.calculate({
        companyId: activeBusiness?.id ?? 'demo',
        currency: currency as 'KES',
        rent: Number(expenses.rent),
        food: Number(expenses.food),
        school: Number(expenses.school),
        transport: Number(expenses.transport),
        insurance: Number(expenses.insurance),
        savings: Number(expenses.savings),
        other: Number(expenses.other),
        businessProfit: Number(businessProfit),
        businessCash: Number(businessCash),
      });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Founder Salary</h1>
      <p className="text-sm text-gray-500 mb-6">Calculate what you can sustainably pay yourself</p>

      <form onSubmit={handleCalc} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Personal expenses</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {EXPENSE_FIELDS.map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input
                type="number"
                min="0"
                value={expenses[f.key]}
                onChange={e => setExpenses(prev => ({ ...prev, [f.key]: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 pt-2">Business health</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Monthly profit</label>
            <input type="number" min="0" value={businessProfit} onChange={e => setBusinessProfit(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Cash balance</label>
            <input type="number" min="0" value={businessCash} onChange={e => setBusinessCash(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="0" />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
          Calculate
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Result</h2>
          {[
            { label: 'Total personal expenses', value: fmt(result.personalExpenses.total, currency) },
            { label: 'Minimum salary needed', value: fmt(result.minimumSalary, currency) },
            { label: 'Recommended salary', value: fmt(result.decision.recommendedSalary, currency) },
            { label: 'Can the business afford it?', value: result.decision.canAfford ? 'Yes' : 'Not yet' },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
              <span className="text-gray-600">{row.label}</span>
              <span className="font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
          <p className="text-sm text-gray-700 pt-2">{result.decision.reasoning}</p>
        </div>
      )}
    </div>
  );
}
