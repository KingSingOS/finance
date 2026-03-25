import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, ResultCardsGrid } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculatePayroll } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const DEFAULTS = { grossSalary: 100_000 }

export default function PayrollKenyaOps() {
  const [grossSalary, setGrossSalary] = useState(DEFAULTS.grossSalary)
  const result = useMemo(() => calculatePayroll({ grossSalary }), [grossSalary])

  const deductionRows = [
    { label: 'PAYE', amount: result.paye, pct: result.paye / grossSalary * 100, statusColor: 'text-red-700 dark:text-red-300' },
    { label: 'NHIF', amount: result.nhif, pct: result.nhif / grossSalary * 100, statusColor: 'text-blue-700 dark:text-blue-300' },
    { label: 'NSSF', amount: result.nssf, pct: result.nssf / grossSalary * 100, statusColor: 'text-purple-700 dark:text-purple-300' },
    { label: 'Housing Levy', amount: result.housingLevy, pct: result.housingLevy / grossSalary * 100, statusColor: 'text-orange-700 dark:text-orange-300' },
  ]

  return (
    <OpsLayout
      title="Payroll Kenya"
      subtitle="2024 statutory deductions — KRA / NHIF / NSSF / Housing Levy"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setGrossSalary(DEFAULTS.grossSalary), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      <QuickInputRow className="max-w-xs">
        <FormInput
          label="Gross Salary (Monthly)"
          value={grossSalary}
          onChange={v => setGrossSalary(parseFloat(v) || 0)}
          format="currency"
          prefix="KES"
        />
      </QuickInputRow>

      {/* Big net pay display */}
      <div className="rounded-xl border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-5">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 items-center">
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide font-semibold">Gross Salary</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatKES(result.grossSalary)}</p>
          </div>
          <div className="hidden sm:flex items-center justify-center text-3xl text-gray-300 dark:text-gray-600">→</div>
          <div>
            <p className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide font-bold">NET PAY</p>
            <p className="text-3xl font-black text-green-700 dark:text-green-300">{formatKES(result.netPay)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Take-home: {formatPct(result.takeHomePercentage)} of gross
            </p>
          </div>
        </div>
      </div>

      {/* Deduction cards */}
      <ResultCardsGrid cols={4}>
        <MetricCard
          label="PAYE"
          value={formatKES(result.paye)}
          subtitle={`${formatPct(result.effectiveTaxRate)} of gross`}
          icon="🏛️"
          status="error"
        />
        <MetricCard
          label="NHIF"
          value={formatKES(result.nhif)}
          subtitle={`${formatPct(result.nhif / grossSalary * 100)} of gross`}
          icon="🏥"
          status="neutral"
        />
        <MetricCard
          label="NSSF"
          value={formatKES(result.nssf)}
          subtitle={`${formatPct(result.nssf / grossSalary * 100)} of gross`}
          icon="🏦"
          status="neutral"
        />
        <MetricCard
          label="Housing Levy"
          value={formatKES(result.housingLevy)}
          subtitle={`1.5% of gross`}
          icon="🏠"
          status="neutral"
        />
      </ResultCardsGrid>

      {/* Deduction breakdown table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-4 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Deduction</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Amount</th>
              <th className="px-4 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">% of Gross</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
            {deductionRows.map(row => (
              <tr key={row.label}>
                <td className="px-4 py-2.5 text-gray-700 dark:text-gray-300">{row.label}</td>
                <td className={`px-4 py-2.5 text-right font-medium ${row.statusColor}`}>{formatKES(row.amount)}</td>
                <td className="px-4 py-2.5 text-right text-gray-500 dark:text-gray-400">{formatPct(row.pct)}</td>
              </tr>
            ))}
            <tr className="bg-gray-50 dark:bg-gray-800 font-bold border-t-2 border-gray-200 dark:border-gray-700">
              <td className="px-4 py-2.5 text-gray-900 dark:text-white">Total Deductions</td>
              <td className="px-4 py-2.5 text-right text-red-700 dark:text-red-300">{formatKES(result.totalDeductions)}</td>
              <td className="px-4 py-2.5 text-right text-red-700 dark:text-red-300">{formatPct(result.totalDeductions / grossSalary * 100)}</td>
            </tr>
            <tr className="bg-green-50 dark:bg-green-900/10 font-bold">
              <td className="px-4 py-2.5 text-green-700 dark:text-green-300">NET PAY</td>
              <td className="px-4 py-2.5 text-right text-green-700 dark:text-green-300 text-base">{formatKES(result.netPay)}</td>
              <td className="px-4 py-2.5 text-right text-green-700 dark:text-green-300">{formatPct(result.takeHomePercentage)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Employer cost */}
      <ResultDisplay
        title="Employer Cost Summary"
        subtitle="Total cost of employment to the company"
        status="neutral"
        sections={[{
          rows: [
            { label: 'Gross Salary', value: formatKES(result.grossSalary) },
            { label: 'Employer NSSF', value: formatKES(result.employerNSSF), sublabel: 'Matching employee contribution' },
            { label: 'Employer Housing Levy', value: formatKES(result.employerHousingLevy), sublabel: '1.5% of gross' },
            { label: 'Total Cost to Employer', value: formatKES(result.totalEmployerCost), highlight: true },
          ],
        }]}
        footer={`Hiring at KES ${formatKES(grossSalary)}/month gross costs the company KES ${formatKES(result.totalEmployerCost)}/month (${formatPct((result.totalEmployerCost / grossSalary - 1) * 100)} above gross).`}
      />
    </OpsLayout>
  )
}
