import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, ResultCardsGrid } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculatePricing, type PricingInputs } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const DEFAULTS: PricingInputs = {
  directCosts: 600,
  overheadAllocation: 400,
  targetMargin: 40,
  marketRate: 1_800,
  valueToClient: 50_000,
  valueCapture: 25,
  unitsPerYear: 1_200,
}

export default function PricingOps() {
  const [inputs, setInputs] = useState<PricingInputs>(DEFAULTS)

  const set = (key: keyof PricingInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculatePricing(inputs), [inputs])

  const marginStatus = (margin: number): 'success' | 'warning' | 'error' =>
    margin >= 30 ? 'success' : margin >= 15 ? 'warning' : 'error'

  return (
    <OpsLayout
      title="3-Method Pricing Calculator"
      subtitle="Cost-Plus · Market · Value-Based anchor"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {/* Inputs */}
      <QuickInputRow>
        <FormInput label="Direct Costs / hr" value={inputs.directCosts} onChange={set('directCosts')} format="currency" prefix="KES" hint="Labour, materials per unit" />
        <FormInput label="Overhead / hr" value={inputs.overheadAllocation} onChange={set('overheadAllocation')} format="currency" prefix="KES" hint="Rent, admin allocated per unit" />
        <FormInput label="Target Margin %" value={inputs.targetMargin} onChange={set('targetMargin')} format="percentage" />
        <FormInput label="Market Rate" value={inputs.marketRate} onChange={set('marketRate')} format="currency" prefix="KES" hint="What competitors charge" />
        <FormInput label="Value to Client" value={inputs.valueToClient} onChange={set('valueToClient')} format="currency" prefix="KES" hint="Client problem cost or benefit" />
        <FormInput label="Value Capture %" value={inputs.valueCapture} onChange={set('valueCapture')} format="percentage" hint="% of value to charge (20–30%)" />
        <FormInput label="Units / Year" value={inputs.unitsPerYear} onChange={set('unitsPerYear')} format="number" hint="Billable hours or units per year" />
      </QuickInputRow>

      {/* Alert */}
      {result.isBelowCost && (
        <AlertBanner type="error" title="Pricing Below Cost" message={`Your total cost is ${formatKES(result.totalCost)}/unit. All methods are below cost — you are losing money on every unit.`} />
      )}
      {!result.isBelowCost && result.marginAtRecommended < 20 && (
        <AlertBanner type="warning" title="Low Margin Warning" message={`${formatPct(result.marginAtRecommended)} margin at recommended price. Target 30–40% for healthy unit economics.`} />
      )}

      {/* Method comparison KPIs */}
      <ResultCardsGrid cols={3}>
        {result.methods.map(method => (
          <MetricCard
            key={method.name}
            label={method.name}
            value={formatKES(method.price)}
            subtitle={method.label}
            icon={method.name === 'Cost-Plus' ? '💲' : method.name === 'Market Rate' ? '📊' : '💡'}
            status={marginStatus(method.margin)}
            trend={{ value: Math.round(method.margin), label: 'margin' }}
          />
        ))}
      </ResultCardsGrid>

      {/* Recommendation card */}
      <div className="rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">🎯 Recommended Price</span>
        </div>
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-blue-700 dark:text-blue-300">{formatKES(result.recommendedPrice)}</span>
          <span className="text-sm text-blue-600 dark:text-blue-400">/ unit · {formatPct(result.marginAtRecommended)} margin</span>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{result.recommendation}</p>
      </div>

      {/* Impact & Comparison */}
      <ResultDisplay
        title="Pricing Analysis"
        status={result.isBelowCost ? 'error' : marginStatus(result.marginAtRecommended)}
        sections={[
          {
            title: 'Unit Economics',
            rows: [
              { label: 'Total Cost / unit', value: formatKES(result.totalCost) },
              { label: 'Recommended Price', value: formatKES(result.recommendedPrice), highlight: true },
              { label: 'Gross Margin', value: formatPct(result.marginAtRecommended), status: marginStatus(result.marginAtRecommended) },
              { label: 'Margin / unit', value: formatKES(result.recommendedPrice - result.totalCost) },
            ],
          },
          {
            title: 'Annual Impact',
            rows: [
              { label: 'Units / Year', value: inputs.unitsPerYear.toLocaleString() },
              { label: 'Annual Revenue', value: formatKES(result.recommendedPrice * inputs.unitsPerYear, true) },
              { label: 'Annual Profit', value: formatKES(result.annualImpact, true), highlight: true, status: result.annualImpact >= 0 ? 'success' : 'error' },
            ],
          },
          ...(inputs.marketRate > 0 ? [{
            title: 'Market Comparison',
            rows: [
              { label: 'Market Rate', value: formatKES(inputs.marketRate) },
              { label: 'Your Price', value: formatKES(result.recommendedPrice) },
              {
                label: 'vs Market',
                value: `${result.recommendedPrice >= inputs.marketRate ? '+' : ''}${formatPct(((result.recommendedPrice - inputs.marketRate) / inputs.marketRate) * 100)}`,
                status: (Math.abs(result.recommendedPrice - inputs.marketRate) / inputs.marketRate) < 0.15 ? 'success' : 'warning' as 'success' | 'warning',
              },
            ],
          }] : []),
        ]}
      />
    </OpsLayout>
  )
}
