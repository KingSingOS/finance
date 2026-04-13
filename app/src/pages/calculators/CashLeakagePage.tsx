import { useBusiness } from '../../contexts/BusinessContext';

export function CashLeakagePage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Cash Leakage</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Identify cash leaks in ${activeBusiness.name}` : 'Identify and plug cash leaks'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Cash leakage tracker coming soon. Log and score potential cash leaks by impact and frequency.</p>
      </div>
    </div>
  );
}
