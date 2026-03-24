import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculateWorkingCapital, type WorkingCapitalInputs } from './shared'
import { formatKES, fmtNum } from '../../utils/format'

const DEFAULTS: WorkingCapitalInputs = {
  wipDays: 30,
  receivablesDays: 45,
  payablesDays: 15,
  annualRevenue: 20_000_000,
}

// Simple AR aging table derived from receivables days
function buildAgingRows(dso: number, annualRevenue: number) {
  const dailyRevenue = annualRevenue / 365
  const totalAR = dailyRevenue * dso
  // Typical distribution: current 50%, 30-60 30%, 60-90 15%, 90+ 5%
  return [
    { bucket: 'Current (0–30 days)', amount: totalAR * 0.50, action: 'Monitor normally', priority: 'low' as const },
    { bucket: '30–60 days', amount: totalAR * 0.30, action: 'Send payment reminder', priority: 'medium' as const },
    { bucket: '60–90 days', amount: totalAR * 0.15, action: 'Formal demand letter', priority: 'high' as const },
    { bucket: '90+ days', amount: totalAR * 0.05, action: '🚨 Escalate — collection risk', priority: 'urgent' as const },
  ]
}

const priorityBadge = {
  low: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
  medium: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  high: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  urgent: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
}

export default function WorkingCapitalOps() {
  const [inputs, setInputs] = useState<WorkingCapitalInputs>(DEFAULTS)

  const set = (key: keyof WorkingCapitalInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculateWorkingCapital(inputs), [inputs])
  const aging = useMemo(() => buildAgingRows(inputs.receivablesDays, inputs.annualRevenue), [inputs])

  const cccMetricStatus = (ccc: number): 'success' | 'warning' | 'error' =>
    ccc < 45 ? 'success' : ccc < 75 ? 'warning' : 'error'

  return (
    <OpsLayout
      title="Working Capital / CCC"
      subtitle="Cash conversion cycle analysis"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {/* Inputs */}
      <QuickInputRow>
        <FormInput label="WIP Days" value={inputs.wipDays} onChange={set('wipDays')} format="number" hint="Days before you invoice" />
        <FormInput label="Receivables Days (DSO)" value={inputs.receivablesDays} onChange={set('receivablesDays')} format="number" hint="Days to collect payment" />
        <FormInput label="Payables Days (DPO)" value={inputs.payablesDays} onChange={set('payablesDays')} format="number" hint="Days before you pay suppliers" />
        <FormInput label="Annual Revenue" value={inputs.annualRevenue} onChange={set('annualRevenue')} format="currency" prefix="KES" />
      </QuickInputRow>

      {/* CCC alert */}
      {result.ccc > 90 && (
        <AlertBanner
          type="error"
          title={`Critical CCC: ${fmtNum(result.ccc)} days — ${formatKES(result.cashLocked, true)} locked`}
          message={`Target is 45 days. Reaching target would free ${formatKES(result.cashToFree, true)} in cash.`}
        />
      )}
      {result.ccc > 45 && result.ccc <= 90 && (
        <AlertBanner
          type="warning"
          title={`CCC at ${fmtNum(result.ccc)} days (target: 45)`}
          message={`Improving to 45 days would free ${formatKES(result.cashToFree, true)} in cash.`}
        />
      )}
      {result.ccc <= 45 && (
        <AlertBanner type="success" title={`Excellent CCC: ${fmtNum(result.ccc)} days`} message="Below the 45-day target. Maintain discipline." />
      )}

      {/* KPIs */}
      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Cash Conversion Cycle"
          value={`${fmtNum(result.ccc)} days`}
          subtitle={`Target: 45 days`}
          icon="🔄"
          status={cccMetricStatus(result.ccc)}
        />
        <MetricCard
          label="Cash Locked"
          value={formatKES(result.cashLocked, true)}
          subtitle="In working capital"
          icon="🔒"
          status={result.cashLocked > 5_000_000 ? 'error' : result.cashLocked > 2_000_000 ? 'warning' : 'success'}
        />
        <MetricCard label="WIP Days" value={`${inputs.wipDays}d`} subtitle="Days before invoicing" icon="🏗️" status={inputs.wipDays > 30 ? 'warning' : 'success'} />
        <MetricCard label="Cash to Free" value={formatKES(result.cashToFree, true)} subtitle="If CCC hits 45 days" icon="💸" status="neutral" />
      </ResultCardsGrid>

      {/* CCC Formula display */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">CCC Formula</p>
        <div className="flex items-center gap-2 text-sm flex-wrap">
          <span className="font-mono bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">{inputs.wipDays}d WIP</span>
          <span className="text-gray-400">+</span>
          <span className="font-mono bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 px-2 py-1 rounded">{inputs.receivablesDays}d Receivables</span>
          <span className="text-gray-400">−</span>
          <span className="font-mono bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">{inputs.payablesDays}d Payables</span>
          <span className="text-gray-400">=</span>
          <span className={`font-mono font-bold px-2 py-1 rounded ${result.ccc <= 45 ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
            {fmtNum(result.ccc)} days CCC
          </span>
        </div>
      </div>

      {/* AR Aging Table */}
      <CompactHeader title="AR Aging — Collection Priorities" />
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Bucket</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Est. Amount</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Recommended Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {aging.map(row => (
              <tr key={row.bucket} className="bg-white dark:bg-gray-900">
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{row.bucket}</td>
                <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-white">{formatKES(row.amount, true)}</td>
                <td className="px-3 py-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityBadge[row.priority]}`}>
                    {row.action}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recommendations */}
      <ResultDisplay
        title="Improvement Actions"
        status={cccMetricStatus(result.ccc)}
        sections={[{
          rows: result.recommendations.map((rec, i) => ({ label: `${i + 1}.`, value: rec })),
        }]}
      />
    </OpsLayout>
  )
}
