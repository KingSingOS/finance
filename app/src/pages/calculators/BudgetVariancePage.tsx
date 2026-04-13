import { useBusiness } from '../../contexts/BusinessContext';

export function BudgetVariancePage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Budget Variance</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Budget vs actuals for ${activeBusiness.name}` : 'Compare budgeted vs actual figures'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Budget variance calculator coming soon. Track planned vs actual spend across categories.</p>
      </div>
    </div>
  );
}
