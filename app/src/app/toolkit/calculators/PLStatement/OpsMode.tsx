import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, ResultCardsGrid } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculatePL, getPLBenchmarks, type PLInputs } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const DEFAULTS: PLInputs = {
  revenue: 2_000_000,
  cogs: 600_000,
  operatingExpenses: 900_000,
  interest: 50_000,
  tax: 100_000,
}

export default function PLOps() {
  const [inputs, setInputs] = useState<PLInputs>(DEFAULTS)

  const set = (key: keyof PLInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculatePL(inputs), [inputs])
  const benchmarks = useMemo(() => getPLBenchmarks(result), [result])

  const marginStatus = (pct: number): 'success' | 'warning' | 'error' =>
    pct >= 15 ? 'success' : pct >= 5 ? 'warning' : 'error'

  return (
    <OpsLayout
      title="P&L Statement"
      subtitle="Instant profit & loss analysis"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
          { label: 'Export CSV', onClick: () => alert('Export coming in Sprint 3'), variant: 'secondary', icon: '⬇' },
        ]} />
      }
    >
      {/* Inputs */}
      <QuickInputRow>
        <FormInput label="Revenue" value={inputs.revenue} onChange={set('revenue')} format="currency" prefix="KES" required />
        <FormInput label="Cost of Goods Sold" value={inputs.cogs} onChange={set('cogs')} format="currency" prefix="KES" />
        <FormInput label="Operating Expenses" value={inputs.operatingExpenses} onChange={set('operatingExpenses')} format="currency" prefix="KES" hint="Rent, salaries, utilities, marketing" />
        <FormInput label="Interest" value={inputs.interest} onChange={set('interest')} format="currency" prefix="KES" />
        <FormInput label="Tax" value={inputs.tax} onChange={set('tax')} format="currency" prefix="KES" />
      </QuickInputRow>

      {/* Margin alerts */}
      {result.netMargin < 0 && (
        <AlertBanner type="error" title="Loss-Making" message={`Net loss of ${formatKES(Math.abs(result.netProfit))} — burning ${formatKES(result.burnRate)} per period.`} />
      )}
      {result.netMargin >= 0 && result.netMargin < 8 && (
        <AlertBanner type="warning" title="Low Net Margin" message={`${formatPct(result.netMargin)} net margin is below the 10% benchmark. Review costs or raise prices.`} />
      )}
      {result.netMargin >= 15 && (
        <AlertBanner type="success" title="Healthy Profitability" message={`${formatPct(result.netMargin)} net margin — above the 15% industry benchmark.`} />
      )}

      {/* Margin KPIs */}
      <ResultCardsGrid cols={3}>
        <MetricCard
          label="Gross Margin"
          value={formatPct(result.grossMargin)}
          subtitle={`Gross Profit: ${formatKES(result.grossProfit, true)}`}
          icon="📈"
          status={marginStatus(result.grossMargin)}
        />
        <MetricCard
          label="Operating Margin"
          value={formatPct(result.operatingMargin)}
          subtitle={`Op. Profit: ${formatKES(result.operatingProfit, true)}`}
          icon="⚙️"
          status={marginStatus(result.operatingMargin)}
        />
        <MetricCard
          label="Net Margin"
          value={formatPct(result.netMargin)}
          subtitle={`Net Profit: ${formatKES(result.netProfit, true)}`}
          icon="💰"
          status={marginStatus(result.netMargin)}
        />
      </ResultCardsGrid>

      {/* P&L Table */}
      <ResultDisplay
        title="P&L Statement"
        status={result.status === 'healthy' ? 'success' : result.status === 'marginal' ? 'warning' : 'error'}
        sections={[
          {
            title: 'Revenue',
            rows: [{ label: 'Total Revenue', value: formatKES(inputs.revenue), highlight: true }],
          },
          {
            title: 'Cost of Sales',
            rows: [
              { label: 'Cost of Goods Sold', value: formatKES(inputs.cogs) },
              { label: 'Gross Profit', value: formatKES(result.grossProfit), highlight: true, sublabel: formatPct(result.grossMargin), status: result.grossMargin >= 30 ? 'success' : 'warning' },
            ],
          },
          {
            title: 'Operating Expenses',
            rows: [
              { label: 'Operating Expenses', value: formatKES(inputs.operatingExpenses) },
              { label: 'Operating Profit (EBIT)', value: formatKES(result.operatingProfit), highlight: true, sublabel: formatPct(result.operatingMargin), status: marginStatus(result.operatingMargin) },
            ],
          },
          {
            title: 'Below the Line',
            rows: [
              { label: 'Interest', value: formatKES(inputs.interest) },
              { label: 'Tax', value: formatKES(inputs.tax) },
              { label: 'Net Profit', value: formatKES(result.netProfit), highlight: true, sublabel: formatPct(result.netMargin), status: result.netProfit >= 0 ? marginStatus(result.netMargin) : 'error' },
            ],
          },
        ]}
        footer={
          <div className="space-y-1">
            {benchmarks.map(b => (
              <div key={b.metric} className="flex justify-between">
                <span>{b.metric}: {formatPct(b.yourValue)} (target: {formatPct(b.target)})</span>
                <span className={b.status === 'good' ? 'text-green-600' : b.status === 'fair' ? 'text-yellow-600' : 'text-red-600'}>
                  {b.status === 'good' ? '✓' : b.status === 'fair' ? '~' : '✗'} {b.note}
                </span>
              </div>
            ))}
          </div>
        }
      />
    </OpsLayout>
  )
}
