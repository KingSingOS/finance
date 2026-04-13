import { useBusiness } from '../../contexts/BusinessContext';

export function WorkingCapitalPage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Working Capital</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Working capital analysis for ${activeBusiness.name}` : 'Analyse current assets vs liabilities'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Working capital calculator coming soon. Measure liquidity and short-term financial health.</p>
      </div>
    </div>
  );
}
