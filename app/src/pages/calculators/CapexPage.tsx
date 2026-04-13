import { useBusiness } from '../../contexts/BusinessContext';

export function CapexPage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Capex Planner</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Capital expenditure planning for ${activeBusiness.name}` : 'Plan and track capital expenditure'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Capex planner coming soon. Model ROI, payback period, and depreciation for capital investments.</p>
      </div>
    </div>
  );
}
