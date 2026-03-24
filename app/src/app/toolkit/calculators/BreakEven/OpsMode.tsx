import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, ResultCardsGrid } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculateBreakEven, type BreakEvenInputs } from './shared'
import { formatKES, formatPct, fmtNum } from '../../utils/format'

const DEFAULTS: BreakEvenInputs = {
  fixedCosts: 500_000,
  variableCostPerUnit: 800,
  pricePerUnit: 2_000,
  currentSales: 300,
}

/** Minimal SVG break-even chart */
function BreakEvenChart({ fixedCosts, varCost, price, beUnits, currentSales }: {
  fixedCosts: number; varCost: number; price: number; beUnits: number; currentSales: number
}) {
  const maxUnits = Math.max(beUnits * 2, currentSales * 1.5, 100)
  const maxRevenue = maxUnits * price
  const W = 320; const H = 160; const PAD = 32

  const xScale = (u: number) => PAD + (u / maxUnits) * (W - PAD * 2)
  const yScale = (v: number) => H - PAD - (v / maxRevenue) * (H - PAD * 2)

  const revenue = [[0, 0], [maxUnits, maxRevenue]] as [number, number][]
  const totalCost = [[0, fixedCosts], [maxUnits, fixedCosts + varCost * maxUnits]] as [number, number][]

  const toPath = (pts: [number, number][]) =>
    pts.map(([u, v], i) => `${i === 0 ? 'M' : 'L'}${xScale(u)},${yScale(v)}`).join(' ')

  const beX = xScale(beUnits)
  const beY = yScale(beUnits * price)
  const curX = xScale(currentSales)
  const curProfit = currentSales * price - (fixedCosts + varCost * currentSales)

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" aria-label="Break-even chart">
      {/* Fixed cost baseline */}
      <line x1={PAD} y1={yScale(fixedCosts)} x2={W - PAD} y2={yScale(fixedCosts)}
        stroke="currentColor" strokeWidth="1" strokeDasharray="4 2" className="text-gray-300 dark:text-gray-600" />
      {/* Revenue line */}
      <path d={toPath(revenue)} fill="none" stroke="#16a34a" strokeWidth="2" />
      {/* Total cost line */}
      <path d={toPath(totalCost)} fill="none" stroke="#dc2626" strokeWidth="2" />
      {/* Break-even point */}
      {isFinite(beX) && <circle cx={beX} cy={beY} r="5" fill="#2563eb" />}
      {/* Current sales marker */}
      {currentSales > 0 && (
        <line x1={curX} y1={PAD} x2={curX} y2={H - PAD}
          stroke={curProfit >= 0 ? '#16a34a' : '#dc2626'} strokeWidth="1.5" strokeDasharray="3 2" />
      )}
      {/* Labels */}
      <text x={W - PAD - 2} y={yScale(maxRevenue) + 12} fontSize="9" fill="#16a34a" textAnchor="end">Revenue</text>
      <text x={W - PAD - 2} y={yScale(fixedCosts + varCost * maxUnits) - 4} fontSize="9" fill="#dc2626" textAnchor="end">Total Cost</text>
      {isFinite(beX) && <text x={beX + 7} y={beY - 7} fontSize="9" fill="#2563eb">BE</text>}
    </svg>
  )
}

export default function BreakEvenOps() {
  const [inputs, setInputs] = useState<BreakEvenInputs>(DEFAULTS)

  const set = (key: keyof BreakEvenInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculateBreakEven(inputs), [inputs])

  return (
    <OpsLayout
      title="Break-Even Analysis"
      subtitle="Fixed costs · contribution margin · safety margin"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {/* Inputs */}
      <QuickInputRow>
        <FormInput label="Monthly Fixed Costs" value={inputs.fixedCosts} onChange={set('fixedCosts')} format="currency" prefix="KES" hint="Rent, salaries, subscriptions" />
        <FormInput label="Variable Cost / Unit" value={inputs.variableCostPerUnit} onChange={set('variableCostPerUnit')} format="currency" prefix="KES" hint="Cost that scales with each unit" />
        <FormInput label="Price / Unit" value={inputs.pricePerUnit} onChange={set('pricePerUnit')} format="currency" prefix="KES" />
        <FormInput label="Current Sales (units/mo)" value={inputs.currentSales ?? ''} onChange={set('currentSales')} format="number" hint="Optional — for safety margin" />
      </QuickInputRow>

      {/* Status alerts */}
      {result.contributionMargin <= 0 && (
        <AlertBanner type="error" title="Negative Contribution Margin" message="Your price is below your variable cost — every unit sold increases your losses. Raise prices immediately." />
      )}
      {result.contributionMargin > 0 && result.status === 'below' && (inputs.currentSales ?? 0) > 0 && (
        <AlertBanner
          type="warning"
          title={`Below Break-Even — need ${fmtNum(result.unitsToBreakEven)} more units`}
          message={`Currently selling ${inputs.currentSales} units. Need ${fmtNum(Math.ceil(result.breakEvenUnits))} to break even.`}
        />
      )}
      {result.status === 'above' && (
        <AlertBanner
          type="success"
          title={`Above Break-Even — Safety Margin: ${formatPct(result.safetyMarginPct)}`}
          message={`You are ${fmtNum(Math.round(result.safetyMarginUnits))} units above break-even. Sales can drop ${formatPct(result.safetyMarginPct)} before a loss occurs.`}
        />
      )}

      {/* KPI Cards */}
      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Break-Even Units"
          value={fmtNum(Math.ceil(result.breakEvenUnits))}
          subtitle="units / month"
          icon="⚖️"
          status="neutral"
        />
        <MetricCard
          label="Break-Even Revenue"
          value={formatKES(result.breakEvenRevenue, true)}
          subtitle="monthly revenue needed"
          icon="💰"
          status="neutral"
        />
        <MetricCard
          label="Contribution Margin"
          value={formatKES(result.contributionMargin)}
          subtitle={`${formatPct(result.contributionMarginPct)} per unit`}
          icon="📊"
          status={result.contributionMarginPct >= 40 ? 'success' : result.contributionMarginPct >= 20 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Safety Margin"
          value={formatPct(result.safetyMarginPct)}
          subtitle={result.safetyMarginUnits > 0 ? `${fmtNum(Math.round(result.safetyMarginUnits))} units buffer` : 'Below break-even'}
          icon="🛡️"
          status={result.safetyMarginPct >= 20 ? 'success' : result.safetyMarginPct >= 5 ? 'warning' : 'error'}
        />
      </ResultCardsGrid>

      {/* Chart + scenarios side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">Break-Even Chart</p>
          <BreakEvenChart
            fixedCosts={inputs.fixedCosts}
            varCost={inputs.variableCostPerUnit}
            price={inputs.pricePerUnit}
            beUnits={result.breakEvenUnits}
            currentSales={inputs.currentSales ?? 0}
          />
          <div className="flex gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-green-600 inline-block" /> Revenue</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-600 inline-block" /> Total Cost</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-600 inline-block" /> Break-Even</span>
          </div>
        </div>

        <ResultDisplay
          title="What-If Scenarios"
          status="neutral"
          sections={[{
            rows: result.scenarios.map(s => ({
              label: s.label,
              value: `${fmtNum(s.breakEvenUnits)} units`,
              sublabel: formatKES(s.breakEvenRevenue, true),
              status: s.breakEvenUnits < result.breakEvenUnits ? 'success' : 'neutral' as 'success' | 'neutral',
            })),
          }]}
          footer="Lower break-even units = easier to reach profitability"
        />
      </div>
    </OpsLayout>
  )
}
