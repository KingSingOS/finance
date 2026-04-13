import { useBusiness } from '../../contexts/BusinessContext';

export function DashboardPage() {
  const { activeBusiness } = useBusiness();

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Financial overview for ${activeBusiness.name}` : 'Select a business to get started'}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Revenue', value: '—' },
          { label: 'Net Income', value: '—' },
          { label: 'Cash Balance', value: '—' },
          { label: 'Runway', value: '—' },
        ].map(stat => (
          <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wide">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-base font-semibold text-gray-900 mb-3">Getting started</h2>
        <p className="text-sm text-gray-600">
          Start by running your P&L Statement, then explore Break-Even and Cash Forecast to get a full picture of your business finances.
        </p>
      </div>
    </div>
  );
}
