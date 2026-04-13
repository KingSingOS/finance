import React, { useState } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { BreakEvenCalculator } from '../../library/financial-toolkit/calculators/BreakEvenCalculator';
import type { BreakEvenAnalysis } from '../../library/financial-toolkit/types';

function fmt(n: number) {
  return new Intl.NumberFormat('en-KE', { maximumFractionDigits: 2 }).format(n);
}

export function BreakEvenPage() {
  const { activeBusiness } = useBusiness();
  const [fixedCosts, setFixedCosts] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [variableCost, setVariableCost] = useState('');
  const [currentSales, setCurrentSales] = useState('');
  const [productName, setProductName] = useState('');
  const [result, setResult] = useState<BreakEvenAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const r = BreakEvenCalculator.calculate({
        companyId: activeBusiness?.id ?? 'demo',
        productName,
        fixedCosts: Number(fixedCosts),
        pricePerUnit: Number(pricePerUnit),
        variableCostPerUnit: Number(variableCost),
        currentSales: Number(currentSales),
      });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  };

  const insights = result ? BreakEvenCalculator.getInsights(result) : [];

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Break-Even Analysis</h1>
      <p className="text-sm text-gray-500 mb-6">Find the sales volume where revenue equals total costs</p>

      <form onSubmit={handleCalc} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Product name (optional)', value: productName, set: setProductName, type: 'text' },
            { label: 'Fixed costs', value: fixedCosts, set: setFixedCosts },
            { label: 'Price per unit', value: pricePerUnit, set: setPricePerUnit },
            { label: 'Variable cost per unit', value: variableCost, set: setVariableCost },
            { label: 'Current monthly sales (units)', value: currentSales, set: setCurrentSales },
          ].map(f => (
            <div key={f.label}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input
                type={f.type ?? 'number'}
                min={f.type === 'text' ? undefined : '0'}
                value={f.value}
                onChange={e => f.set(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={f.type === 'text' ? '' : '0'}
              />
            </div>
          ))}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg">
          Calculate
        </button>
      </form>

      {result && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <h2 className="text-base font-semibold text-gray-900">Results</h2>
            {[
              { label: 'Contribution margin', value: fmt(result.results.contributionMargin) },
              { label: 'Contribution margin %', value: `${result.results.contributionMarginPercent.toFixed(1)}%` },
              { label: 'Break-even units', value: fmt(result.results.breakEvenUnits) },
              { label: 'Break-even revenue', value: fmt(result.results.breakEvenRevenue) },
              { label: 'Status', value: result.results.isAboveBreakEven ? 'Above break-even' : 'Below break-even' },
            ].map(row => (
              <div key={row.label} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                <span className="text-gray-600">{row.label}</span>
                <span className="font-medium text-gray-900">{row.value}</span>
              </div>
            ))}
          </div>

          {insights.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-3">Insights</h2>
              <div className="space-y-1">
                {insights.map((line, i) => (
                  <p key={i} className="text-sm text-gray-700">{line}</p>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
