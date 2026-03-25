import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculateFounderSalary, type FounderSalaryInputs } from './shared'
import { formatKES } from '../../utils/format'

const DEFAULTS: FounderSalaryInputs = {
  currentRevenue: 1_500_000,
  currentProfit: 300_000,
  cashBalance: 2_000_000,
  monthlyBurnRate: 1_200_000,
  foundersCount: 2,
  desiredSalaryPerFounder: 80_000,
  marketSalaryBenchmark: 200_000,
}

const statusConfig = {
  'Affordable': {
    bg: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    text: 'text-green-700 dark:text-green-300',
    alert: 'success' as const,
  },
  'Marginal': {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800',
    text: 'text-yellow-700 dark:text-yellow-300',
    alert: 'warning' as const,
  },
  'Not Affordable': {
    bg: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
    text: 'text-red-700 dark:text-red-300',
    alert: 'error' as const,
  },
}

export default function FounderSalaryOps() {
  const [inputs, setInputs] = useState<FounderSalaryInputs>(DEFAULTS)

  const set = (key: keyof FounderSalaryInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculateFounderSalary(inputs), [inputs])
  const sc = statusConfig[result.affordabilityStatus]

  return (
    <OpsLayout
      title="Founder Salary"
      subtitle="Can you afford to pay yourself?"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      <QuickInputRow>
        <FormInput label="Monthly Revenue" value={inputs.currentRevenue} onChange={set('currentRevenue')} format="currency" prefix="KES" />
        <FormInput label="Monthly Net Profit" value={inputs.currentProfit} onChange={set('currentProfit')} format="currency" prefix="KES" />
        <FormInput label="Cash Balance" value={inputs.cashBalance} onChange={set('cashBalance')} format="currency" prefix="KES" />
        <FormInput label="Monthly Burn Rate" value={inputs.monthlyBurnRate} onChange={set('monthlyBurnRate')} format="currency" prefix="KES" hint="Total monthly costs" />
        <FormInput label="Founders Count" value={inputs.foundersCount} onChange={set('foundersCount')} format="number" min={1} max={10} />
        <FormInput label="Desired Salary / Founder" value={inputs.desiredSalaryPerFounder} onChange={set('desiredSalaryPerFounder')} format="currency" prefix="KES" hint="Per founder, monthly" />
        <FormInput label="Market Salary Benchmark" value={inputs.marketSalaryBenchmark ?? 0} onChange={set('marketSalaryBenchmark')} format="currency" prefix="KES" hint="What role pays externally" />
      </QuickInputRow>

      {/* Big YES / NO status */}
      <div className={`rounded-xl border-2 p-5 ${sc.bg}`}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
              Can you afford KES {inputs.desiredSalaryPerFounder.toLocaleString()}/month per founder?
            </p>
            <p className={`text-3xl font-black ${sc.text}`}>{result.affordabilityStatus}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Score: {result.affordabilityScore}/100
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-500 dark:text-gray-400">Max affordable per founder</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatKES(result.maxAffordableSalary, true)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">30% of profit rule</p>
          </div>
        </div>
      </div>

      <AlertBanner
        type={sc.alert}
        title={`Total founder cost: ${formatKES(result.totalFounderCost, true)}/month (${formatKES(result.cashImpact, true)}/year)`}
        message={`Profit remaining after salary: ${formatKES(result.profitAfterSalary, true)}/month. Runway with salary: ${result.runwayMonthsWithSalary === Infinity ? '∞' : result.runwayMonthsWithSalary} months (currently: ${result.runwayMonthsCurrent === Infinity ? '∞' : result.runwayMonthsCurrent} months).`}
      />

      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Max Affordable"
          value={formatKES(result.maxAffordableSalary, true)}
          subtitle="Per founder / month"
          icon="💼"
          status={inputs.desiredSalaryPerFounder <= result.maxAffordableSalary ? 'success' : 'error'}
        />
        <MetricCard
          label="Runway (With Salary)"
          value={result.runwayMonthsWithSalary === Infinity ? '∞ months' : `${result.runwayMonthsWithSalary} months`}
          subtitle={`Was: ${result.runwayMonthsCurrent === Infinity ? '∞' : result.runwayMonthsCurrent} months`}
          icon="⏱️"
          status={result.runwayMonthsWithSalary >= 6 ? 'success' : result.runwayMonthsWithSalary >= 3 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Break-Even Revenue"
          value={formatKES(result.breakEvenMonthlyRevenue, true)}
          subtitle="Monthly revenue needed"
          icon="🎯"
          status={inputs.currentRevenue >= result.breakEvenMonthlyRevenue ? 'success' : 'warning'}
        />
        <MetricCard
          label="Profit After Salary"
          value={formatKES(result.profitAfterSalary, true)}
          subtitle="Monthly remaining"
          icon="📊"
          status={result.profitAfterSalary > 0 ? 'success' : 'error'}
        />
      </ResultCardsGrid>

      {result.deferredCompAnnual > 0 && (
        <>
          <CompactHeader title="Deferred Compensation Tracker" />
          <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10 p-4 space-y-2">
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Market salary</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatKES(inputs.marketSalaryBenchmark ?? 0, true)}/mo</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Your salary</p>
                <p className="font-bold text-gray-900 dark:text-white">{formatKES(inputs.desiredSalaryPerFounder, true)}/mo</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Deferred / month</p>
                <p className="font-bold text-orange-700 dark:text-orange-300">{formatKES(result.deferredCompMonthly, true)}</p>
              </div>
            </div>
            <div className="border-t border-orange-200 dark:border-orange-800 pt-2 flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Annual deferred compensation (all founders)</span>
              <span className="text-base font-bold text-orange-700 dark:text-orange-300">{formatKES(result.deferredCompAnnual, true)}</span>
            </div>
          </div>
        </>
      )}

      <ResultDisplay
        title="Recommendations"
        status={result.affordabilityStatus === 'Affordable' ? 'success' : result.affordabilityStatus === 'Marginal' ? 'warning' : 'error'}
        sections={[{
          rows: result.recommendations.map((rec, i) => ({ label: `${i + 1}.`, value: rec })),
        }]}
      />
    </OpsLayout>
  )
}
