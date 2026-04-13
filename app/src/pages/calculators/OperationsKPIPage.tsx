import { useBusiness } from '../../contexts/BusinessContext';

export function OperationsKPIPage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Operations KPIs</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Operational metrics for ${activeBusiness.name}` : 'Track key operational performance indicators'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Operations KPI tracker coming soon. Monitor CAC, LTV, churn, conversion, and delivery metrics.</p>
      </div>
    </div>
  );
}
