import { useBusiness } from '../../contexts/BusinessContext';

export function ActionPlanPage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Action Plan</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Financial action plan for ${activeBusiness.name}` : 'Prioritised financial improvement actions'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Action plan coming soon. Create, prioritise, and track financial improvement actions with impact scoring.</p>
      </div>
    </div>
  );
}
