import { useBusiness } from '../../contexts/BusinessContext';

export function TaxCalendarPage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Tax Calendar</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Tax obligations for ${activeBusiness.name}` : 'Track tax filing deadlines and obligations'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Tax calendar coming soon. Track VAT, income tax, PAYE, and withholding tax deadlines.</p>
      </div>
    </div>
  );
}
