import { useBusiness } from '../../contexts/BusinessContext';

export function PayrollPage() {
  const { activeBusiness } = useBusiness();
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Payroll</h1>
      <p className="text-sm text-gray-500 mb-6">
        {activeBusiness ? `Payroll management for ${activeBusiness.name}` : 'Manage employee payroll and taxes'}
      </p>
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <p className="text-sm text-gray-500">Payroll calculator coming soon. Compute gross-to-net pay, PAYE, NHIF, NSSF, and payroll summaries.</p>
      </div>
    </div>
  );
}
