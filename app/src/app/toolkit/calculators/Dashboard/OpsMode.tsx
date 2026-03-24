import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, CompactHeader } from '../../layouts/OpsLayout'
import { HealthScore } from '../../components/HealthScore'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculateDashboard, type DashboardInputs } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const DEFAULTS: DashboardInputs = {
  revenue: 1_500_000,
  profit: 150_000,
  cashBalance: 800_000,
  runway: 4,
  margin: 10,
  growthRate: 12,
}

export default function DashboardOps() {
  const [inputs, setInputs] = useState<DashboardInputs>(DEFAULTS)

  const set = (key: keyof DashboardInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculateDashboard(inputs), [inputs])

  const statusToMetric = (s: string): 'success' | 'warning' | 'error' | 'neutral' => {
    if (s === 'Excellent' || s === 'Good') return 'success'
    if (s === 'Fair') return 'warning'
    return 'error'
  }

  return (
    <OpsLayout
      title="Financial Health Dashboard"
      subtitle="Quick 5-input health score"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {/* Inputs */}
      <QuickInputRow>
        <FormInput label="Monthly Revenue" value={inputs.revenue} onChange={set('revenue')} format="currency" prefix="KES" />
        <FormInput label="Monthly Profit" value={inputs.profit} onChange={set('profit')} format="currency" prefix="KES" />
        <FormInput label="Cash Balance" value={inputs.cashBalance} onChange={set('cashBalance')} format="currency" prefix="KES" />
        <FormInput label="Runway (months)" value={inputs.runway} onChange={set('runway')} format="number" hint="How many months of cash?" />
        <FormInput label="Net Margin %" value={inputs.margin} onChange={set('margin')} format="percentage" />
        <FormInput label="Growth Rate %" value={inputs.growthRate ?? ''} onChange={set('growthRate')} format="percentage" hint="YoY revenue growth (optional)" />
      </QuickInputRow>

      {/* Critical alerts */}
      {result.criticalIssues.length > 0 && (
        <AlertBanner
          type="error"
          title="Critical Issues Detected"
          message={
            <ul className="list-disc list-inside space-y-0.5">
              {result.criticalIssues.map((issue, i) => <li key={i}>{issue}</li>)}
            </ul>
          }
        />
      )}

      {/* Health score + metric breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <HealthScore
          score={result.overallScore}
          label="Overall Health Score"
          size="lg"
          showBar
          className="sm:col-span-2 lg:col-span-1"
        />
        <MetricCard
          label="Profitability"
          value={formatPct(result.breakdown.profitability)}
          subtitle={`Margin: ${formatPct(inputs.margin)}`}
          icon="💰"
          status={result.breakdown.profitability >= 60 ? 'success' : result.breakdown.profitability >= 30 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Cash Runway"
          value={`${inputs.runway} mo`}
          subtitle={`Cash: ${formatKES(inputs.cashBalance, true)}`}
          icon="🏦"
          status={inputs.runway >= 6 ? 'success' : inputs.runway >= 3 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Efficiency"
          value={formatPct(result.breakdown.efficiency)}
          subtitle={`Revenue: ${formatKES(inputs.revenue, true)}/mo`}
          icon="⚡"
          status={result.breakdown.efficiency >= 60 ? 'success' : result.breakdown.efficiency >= 30 ? 'warning' : 'error'}
        />
      </div>

      {/* Recommendations */}
      <CompactHeader title="Top Recommendations" />
      <ResultDisplay
        title="Action Items"
        status={statusToMetric(result.status)}
        sections={[{
          rows: result.recommendations.slice(0, 3).map((rec, i) => ({
            label: `${i + 1}.`,
            value: rec,
          })),
        }]}
        footer={`Health status: ${result.status} (${result.overallScore}/100)`}
      />
    </OpsLayout>
  )
}
