import { useBusiness } from '../../contexts/BusinessContext';

export function WeeklyReviewPage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Weekly Review</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Weekly financial review for ${activeBusiness.name}` : 'Weekly financial health check'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Weekly review coming soon. Score your business health across revenue, costs, cash, and KPIs each week.</p>
      </div>
    </div>
  );
}
