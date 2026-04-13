import React, { useState } from 'react';
import { useBusiness } from '../../contexts/BusinessContext';
import { PricingCalculator } from '../../library/financial-toolkit/calculators/PricingCalculator';
import type { PricingAnalysis } from '../../library/financial-toolkit/types';

function fmt(n: number, currency = 'KES') {
  return new Intl.NumberFormat('en-KE', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
}

export function PricingPage() {
  const { activeBusiness } = useBusiness();
  const [productName, setProductName] = useState('');
  const [costPerUnit, setCostPerUnit] = useState('');
  const [markup, setMarkup] = useState('50');
  const [comp1, setComp1] = useState('');
  const [comp2, setComp2] = useState('');
  const [comp3, setComp3] = useState('');
  const [problemCost, setProblemCost] = useState('');
  const [solutionPct, setSolutionPct] = useState('50');
  const [result, setResult] = useState<PricingAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const currency = activeBusiness?.currency ?? 'KES';

  const handleCalc = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const r = PricingCalculator.calculate({
        companyId: activeBusiness?.id ?? 'demo',
        productName,
        currency: currency as 'KES',
        costPerUnit: Number(costPerUnit),
        desiredMarkup: Number(markup),
        competitor1: Number(comp1),
        competitor2: Number(comp2),
        competitor3: Number(comp3),
        customerProblemCost: Number(problemCost),
        solutionPercentage: Number(solutionPct),
      });
      setResult(r);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation failed');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Pricing Calculator</h1>
      <p className="text-sm text-gray-500 mb-6">Cost-plus, market, and value-based pricing methods</p>

      <form onSubmit={handleCalc} className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { label: 'Product name', value: productName, set: setProductName, type: 'text' },
            { label: 'Cost per unit', value: costPerUnit, set: setCostPerUnit },
            { label: 'Desired markup %', value: markup, set: setMarkup },
            { label: 'Competitor 1 price', value: comp1, set: setComp1 },
            { label: 'Competitor 2 price', value: comp2, set: setComp2 },
            { label: 'Competitor 3 price', value: comp3, set: setComp3 },
            { label: "Customer's problem cost", value: problemCost, set: setProblemCost },
            { label: 'Solution %', value: solutionPct, set: setSolutionPct },
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
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
          <h2 className="text-base font-semibold text-gray-900">Recommended prices</h2>
          {[
            { label: 'Cost-plus price', value: fmt(result.methods.costPlus, currency) },
            { label: 'Market rate price', value: fmt(result.methods.marketRate, currency) },
            { label: 'Value-based price', value: fmt(result.methods.valueBased, currency) },
            { label: 'Anchor price', value: fmt(result.anchorPrice, currency) },
            { label: 'Minimum price', value: fmt(result.minimumPrice, currency) },
          ].map(row => (
            <div key={row.label} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
              <span className="text-gray-600">{row.label}</span>
              <span className="font-medium text-gray-900">{row.value}</span>
            </div>
          ))}
          <p className="text-sm text-gray-700 pt-2">{result.analysis.recommendation}</p>
        </div>
      )}
    </div>
  );
}
