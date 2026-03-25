import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculateSustainableGrowth, type SustainableGrowthInputs } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const DEFAULTS: SustainableGrowthInputs = {
  currentRevenue: 2_000_000,
  netProfit: 300_000,
  retentionRate: 50,
  workingCapitalRequirement: 20,
  currentDebt: 1_000_000,
  targetDebtToEquity: 1.0,
  currentGrowthRate: 15,
}

const statusStyle = {
  Opportunity: { alert: 'info' as const, msg: 'Growing slower than sustainable — you can accelerate safely.' },
  Optimal: { alert: 'success' as const, msg: 'Growth rate is well-matched to retained earnings capacity.' },
  Overstretched: { alert: 'error' as const, msg: 'Growing faster than sustainable — external funding needed or slow down.' },
  Unknown: { alert: 'info' as const, msg: 'Enter your current growth rate to see gap analysis.' },
}

export default function SustainableGrowthOps() {
  const [inputs, setInputs] = useState<SustainableGrowthInputs>(DEFAULTS)

  const set = (key: keyof SustainableGrowthInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculateSustainableGrowth(inputs), [inputs])
  const s = statusStyle[result.status]

  const sgrMetricStatus = result.sustainableGrowthRate >= 15 ? 'success'
    : result.sustainableGrowthRate >= 5 ? 'warning'
    : 'error'

  return (
    <OpsLayout
      title="Sustainable Growth Rate"
      subtitle="How fast can you grow using only retained earnings?"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      <QuickInputRow>
        <FormInput label="Monthly Revenue" value={inputs.currentRevenue} onChange={set('currentRevenue')} format="currency" prefix="KES" />
        <FormInput label="Monthly Net Profit" value={inputs.netProfit} onChange={set('netProfit')} format="currency" prefix="KES" />
        <FormInput label="Retention Rate" value={inputs.retentionRate} onChange={set('retentionRate')} format="percentage" hint="% of profit reinvested" min={0} max={100} />
        <FormInput label="WC Requirement" value={inputs.workingCapitalRequirement} onChange={set('workingCapitalRequirement')} format="percentage" hint="% of revenue" min={0} max={100} />
        <FormInput label="Current Growth Rate" value={inputs.currentGrowthRate ?? 0} onChange={set('currentGrowthRate')} format="percentage" hint="YoY revenue growth %" />
      </QuickInputRow>

      <AlertBanner
        type={s.alert}
        title={`${result.status}: ${s.msg}`}
        message={
          result.growthGap !== null
            ? `Current growth: ${formatPct(result.currentGrowthRate ?? 0)} vs sustainable: ${formatPct(result.sustainableGrowthRate)} (gap: ${result.growthGap > 0 ? '+' : ''}${formatPct(result.growthGap)})`
            : `Sustainable growth rate: ${formatPct(result.sustainableGrowthRate)}`
        }
      />

      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Sustainable Growth Rate"
          value={formatPct(result.sustainableGrowthRate)}
          subtitle="Max without external funding"
          icon="📈"
          status={sgrMetricStatus}
        />
        <MetricCard
          label="Net Profit Margin"
          value={formatPct(result.netProfitMargin)}
          subtitle="Annual"
          icon="💵"
          status={result.netProfitMargin >= 15 ? 'success' : result.netProfitMargin >= 5 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Retained Earnings"
          value={formatKES(result.retainedEarningsMonthly, true)}
          subtitle="Monthly reinvested"
          icon="🏦"
          status="neutral"
        />
        {result.fundingGapIfExceeding > 0 ? (
          <MetricCard
            label="Funding Gap"
            value={formatKES(result.fundingGapIfExceeding, true)}
            subtitle="External funding needed"
            icon="⚠️"
            status="error"
          />
        ) : (
          <MetricCard
            label="Growth Status"
            value={result.status}
            subtitle="vs sustainable rate"
            icon="🎯"
            status={result.status === 'Optimal' || result.status === 'Opportunity' ? 'success' : 'warning'}
          />
        )}
      </ResultCardsGrid>

      {result.currentGrowthRate !== undefined && (
        <>
          <CompactHeader title="Growth Rate Comparison" />
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-3">
            {[
              { label: 'Current Growth Rate', value: result.currentGrowthRate ?? 0, color: 'bg-blue-500' },
              { label: 'Sustainable Growth Rate', value: result.sustainableGrowthRate, color: 'bg-green-500' },
            ].map(row => {
              const maxPct = Math.max(result.currentGrowthRate ?? 0, result.sustainableGrowthRate, 1)
              const barWidth = Math.min(100, (row.value / (maxPct * 1.2)) * 100)
              return (
                <div key={row.label}>
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                    <span>{row.label}</span>
                    <span className="font-medium">{formatPct(row.value)}</span>
                  </div>
                  <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${row.color} rounded-full`} style={{ width: `${barWidth}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      <ResultDisplay
        title="Recommendations"
        status={result.status === 'Overstretched' ? 'error' : result.status === 'Optimal' ? 'success' : 'warning'}
        sections={[{
          rows: result.recommendations.map((rec, i) => ({ label: `${i + 1}.`, value: rec })),
        }]}
      />
    </OpsLayout>
  )
}
