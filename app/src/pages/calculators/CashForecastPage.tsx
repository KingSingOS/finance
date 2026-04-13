import React, { useState } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { CashForecastCalculator } from '../../library/financial-toolkit/calculators/CashForecastCalculator';
import type { CashForecast } from '../../library/financial-toolkit/types';

function fmt(n: number, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

const STATUS_COLOR: Record<string, string> = {
  healthy: 'text-green-600',
  warning: 'text-yellow-600',
  crisis: 'text-red-600',
};

export function CashForecastPage() {
  const { activeBusiness } = useBusiness();
  const [openingCash, setOpeningCash] = useState('');
  const [weeks, setWeeks] = useState(
    Array.from({ length: 4 }, () => ({ cashIn: '', cashOut: '' }))
  );
  const [result, setResult] = useState<CashForecast | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currency = activeBusiness?.currency ?? 'KES';

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const r = CashForecastCalculator.calculate({
        companyId: activeBusiness?.id ?? 'demo',
        currency: currency as 'KES',
        openingCash: Number(openingCash),
        weeks: weeks.map(w => ({ cashIn: Number(w.cashIn), cashOut: Number(w.cashOut) })),
      });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Cash Forecast</h1>
      <p className="text-sm text-gray-500 mb-6">4-week rolling cash flow forecast</p>

      <form onSubmit={handleCalc} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Opening cash balance</label>
          <input
            type="number"
            min="0"
            value={openingCash}
            onChange={e => setOpeningCash(e.target.value)}
            className="w-48 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="0"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left text-xs font-medium text-gray-500 pb-2 pr-4">Week</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-2 pr-4">Cash In</th>
                <th className="text-left text-xs font-medium text-gray-500 pb-2">Cash Out</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((w, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2 pr-4 text-gray-600">Week {i + 1}</td>
                  <td className="py-2 pr-4">
                    <input
                      type="number"
                      min="0"
                      value={w.cashIn}
                      onChange={e => setWeeks(ws => ws.map((x, j) => j === i ? { ...x, cashIn: e.target.value } : x))}
                      className="w-32 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </td>
                  <td className="py-2">
                    <input
                      type="number"
                      min="0"
                      value={w.cashOut}
                      onChange={e => setWeeks(ws => ws.map((x, j) => j === i ? { ...x, cashOut: e.target.value } : x))}
                      className="w-32 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
          Calculate
        </button>
      </form>

      {result && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-base font-semibold text-gray-900">Forecast</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  {['Week', 'Opening', 'In', 'Out', 'Closing', 'Status'].map(h => (
                    <th key={h} className="text-left text-xs font-medium text-gray-500 pb-2 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.weeks.map(w => (
                  <tr key={w.week} className="border-b border-gray-100">
                    <td className="py-2 pr-4">{w.week}</td>
                    <td className="py-2 pr-4">{fmt(w.openingCash, currency)}</td>
                    <td className="py-2 pr-4 text-green-600">{fmt(w.cashIn, currency)}</td>
                    <td className="py-2 pr-4 text-red-600">{fmt(w.cashOut, currency)}</td>
                    <td className="py-2 pr-4 font-medium">{fmt(w.closingCash, currency)}</td>
                    <td className={`py-2 capitalize font-medium ${STATUS_COLOR[w.status]}`}>{w.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            {[
              { label: 'Avg burn rate', value: fmt(result.metrics.averageBurnRate, currency) },
              { label: 'Net cash flow', value: fmt(result.metrics.netCashFlow, currency) },
            ].map(m => (
              <div key={m.label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">{m.label}</p>
                <p className="text-lg font-semibold text-gray-900 mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
