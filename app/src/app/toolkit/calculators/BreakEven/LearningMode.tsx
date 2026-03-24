import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, CaseStudyCard, DiagramSlot, ActionPlanSection } from '../../layouts/LearningLayout'
import { FormInput } from '../../components/FormInput'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculateBreakEven, type BreakEvenInputs } from './shared'
import { formatKES, formatPct, fmtNum } from '../../utils/format'

const EXAMPLE: BreakEvenInputs = {
  fixedCosts: 500_000,
  variableCostPerUnit: 800,
  pricePerUnit: 2_000,
  currentSales: 300,
}

export default function BreakEvenLearning() {
  const [inputs, setInputs] = useState<BreakEvenInputs>(EXAMPLE)
  const set = (key: keyof BreakEvenInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculateBreakEven(inputs), [inputs])

  return (
    <LearningLayout
      title="Break-Even Analysis"
      description="Break-even is the point where your revenue exactly covers all your costs — you make neither a profit nor a loss. Every unit sold above break-even generates pure profit. It's the most fundamental number every founder must know."
    >
      {/* Section 1 */}
      <SectionHeader
        step={1}
        title="Fixed costs vs variable costs"
        explanation="This distinction is the foundation of break-even analysis. Fixed costs exist regardless of sales volume. Variable costs only exist when you produce or sell."
      />
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4">
          <h4 className="text-sm font-semibold text-red-800 dark:text-red-200 mb-2">🏢 Fixed Costs</h4>
          <p className="text-xs text-red-700 dark:text-red-300 mb-3">These costs are the same every month regardless of whether you sell 0 or 1,000 units.</p>
          <ul className="text-xs text-red-700 dark:text-red-300 space-y-1">
            {['Rent / office lease', 'Full-time salaries', 'Software subscriptions', 'Internet and utilities', 'Insurance premiums', 'Loan repayments'].map((i, k) => <li key={k}>• {i}</li>)}
          </ul>
        </div>
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">📦 Variable Costs</h4>
          <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">These costs increase directly with each unit produced or each client served.</p>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            {['Subcontractors (per project)', 'Raw materials', 'Delivery / shipping', 'Sales commissions', 'Transaction fees', 'Direct labour (per unit)'].map((i, k) => <li key={k}>• {i}</li>)}
          </ul>
        </div>
      </div>

      {/* Section 2 — Contribution margin */}
      <SectionHeader
        step={2}
        title="Contribution margin — the key metric"
        explanation="Contribution margin is the profit per unit AFTER variable costs. It's what each unit 'contributes' toward covering your fixed costs — and then profit."
      />
      <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-4 space-y-3">
        <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">Contribution Margin Formula</p>
        <div className="space-y-1 font-mono text-sm text-purple-700 dark:text-purple-300">
          <p>Contribution Margin = Price − Variable Cost per Unit</p>
          <p>Contribution Margin % = (CM / Price) × 100</p>
          <p>Break-Even Units = Fixed Costs ÷ Contribution Margin</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded p-3 text-xs text-gray-600 dark:text-gray-400">
          <strong>Example:</strong> Price KES 2,000 − Variable Cost KES 800 = CM KES 1,200 (60%).
          Fixed Costs KES 500,000 ÷ KES 1,200 = <strong>417 units to break even</strong>.
          Every unit sold above 417 generates KES 1,200 pure profit.
        </div>
      </div>

      {/* Section 3 — Interactive */}
      <SectionHeader
        step={3}
        title="Calculate your break-even"
        explanation="Enter your fixed costs, variable cost per unit, and price per unit. Add current sales to see your safety margin — how far above break-even you are."
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <FormInput label="Monthly Fixed Costs" value={inputs.fixedCosts} onChange={set('fixedCosts')} format="currency" prefix="KES" />
        <FormInput label="Variable Cost / Unit" value={inputs.variableCostPerUnit} onChange={set('variableCostPerUnit')} format="currency" prefix="KES" />
        <FormInput label="Price / Unit" value={inputs.pricePerUnit} onChange={set('pricePerUnit')} format="currency" prefix="KES" />
        <FormInput label="Current Sales (units)" value={inputs.currentSales ?? ''} onChange={set('currentSales')} format="number" hint="Optional — for safety margin" />
      </div>

      {result.contributionMargin <= 0 && (
        <AlertBanner type="error" title="No contribution margin" message="Your price is below your variable cost. You cannot break even — raise prices before anything else." />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Break-Even Units" value={fmtNum(Math.ceil(result.breakEvenUnits))} subtitle="units/month needed" icon="⚖️" status="neutral" />
        <MetricCard label="Break-Even Revenue" value={formatKES(result.breakEvenRevenue, true)} subtitle="monthly revenue floor" icon="💰" status="neutral" />
        <MetricCard label="Contribution Margin" value={formatKES(result.contributionMargin)} subtitle={formatPct(result.contributionMarginPct) + ' per unit'} icon="📊" status={result.contributionMarginPct >= 40 ? 'success' : result.contributionMarginPct >= 20 ? 'warning' : 'error'} />
        <MetricCard label="Safety Margin" value={formatPct(result.safetyMarginPct)} subtitle={result.safetyMarginPct > 0 ? 'above break-even' : 'below break-even'} icon="🛡️" status={result.safetyMarginPct >= 20 ? 'success' : result.safetyMarginPct >= 5 ? 'warning' : 'error'} />
      </div>

      {/* Section 4 — Safety margin */}
      <SectionHeader
        step={4}
        title="Safety margin — your buffer against downturns"
        explanation="The safety margin is how far your current sales are above break-even, expressed as a percentage. If your safety margin is 30%, sales can fall 30% before you start losing money."
      />
      {result.status === 'above' ? (
        <AlertBanner
          type="success"
          title={`Safety Margin: ${formatPct(result.safetyMarginPct)}`}
          message={`You're ${fmtNum(Math.round(result.safetyMarginUnits))} units above break-even. Sales can drop ${formatPct(result.safetyMarginPct)} before you make a loss. ${result.safetyMarginPct < 15 ? 'This buffer is thin — focus on growing sales.' : 'Good buffer — keep building it.'}`}
        />
      ) : (inputs.currentSales ?? 0) > 0 ? (
        <AlertBanner
          type="warning"
          title={`Below break-even: need ${fmtNum(Math.ceil(result.unitsToBreakEven))} more units/month`}
          message={`Currently selling ${inputs.currentSales} units. Need ${fmtNum(Math.ceil(result.breakEvenUnits))} to break even. Options: increase price, reduce fixed costs, reduce variable costs, or increase sales volume.`}
        />
      ) : null}

      {/* What-if scenarios */}
      <ResultDisplay
        title="What-If Scenarios"
        status="neutral"
        sections={[{
          title: 'Improve your break-even point',
          rows: result.scenarios.map(s => ({
            label: s.label,
            value: `${fmtNum(s.breakEvenUnits)} units (${formatKES(s.breakEvenRevenue, true)})`,
            sublabel: s.change,
            status: s.breakEvenUnits < result.breakEvenUnits ? 'success' : 'neutral' as 'success' | 'neutral',
          })),
        }]}
        footer="Each scenario lowers your break-even point. Combining them has a compounding effect."
      />

      {/* Section 5 — What happens without break-even knowledge */}
      <SectionHeader
        step={5}
        title="What happens when founders don't know their break-even"
        explanation="Not knowing your break-even leads to common and expensive mistakes. Here's what to watch for."
      />
      <div className="space-y-2">
        {[
          { mistake: 'Discounting into a loss', desc: 'Offering a 20% discount when your safety margin is 15% = operating at a loss on that client. Every "deal" bleeds cash.' },
          { mistake: 'Hiring before break-even', desc: 'Adding staff (fixed cost) before hitting break-even raises the break-even point further. Each hire must be justified by additional revenue.' },
          { mistake: 'Confusing revenue with profit', desc: 'Celebrating KES 2M in sales without knowing you need KES 2.5M to break even. More sales = bigger loss.' },
          { mistake: 'Seasonal business crashes', desc: 'Low season dips below break-even. Without a safety margin, even a 2-month slow period can be fatal.' },
        ].map((m, i) => (
          <div key={i} className="flex gap-3 rounded-lg border border-red-100 dark:border-red-900 bg-white dark:bg-gray-900 p-3">
            <span className="text-red-500 text-lg shrink-0">✗</span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{m.mistake}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <CaseStudyCard
        company="Nairobi Restaurant Group"
        scenario="Restaurant owner celebrated opening a 2nd location. Revenue doubled. But he didn't realise the 2nd location's fixed costs (rent, staff) pushed combined break-even from 800 to 1,900 covers per month. During COVID-19, they couldn't hit 1,900 covers and both locations bled cash."
        outcome="Closed the 2nd location, focused on the profitable original. Survived by reducing break-even point back to 800 covers."
        lesson="Expansion raises your break-even point. Always recalculate break-even before adding fixed costs."
        tag="Break-Even"
      />

      <DiagramSlot title="Break-Even Chart" description="Revenue line crosses Total Cost line = Break-Even Point">
        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p>📈 Revenue = Price × Units (green line — starts at 0)</p>
          <p>📉 Total Cost = Fixed Costs + (Variable Cost × Units) (red line — starts at fixed cost level)</p>
          <p>🔵 Where they cross = Break-Even Point = {fmtNum(Math.ceil(result.breakEvenUnits))} units</p>
          <p>🟢 Area to the right of intersection = Profit zone</p>
        </div>
      </DiagramSlot>

      <ActionPlanSection
        title="Your Action Plan"
        items={[
          { title: 'List all fixed costs', description: 'Write down every cost that exists regardless of sales: rent, salaries, subscriptions, loan payments. Total them.', priority: 'high' },
          { title: 'Calculate contribution margin', description: `Your CM is ${formatKES(result.contributionMargin)}/unit (${formatPct(result.contributionMarginPct)}). If below 30%, review pricing and variable costs first.`, priority: 'high' },
          { title: 'Know your break-even number by heart', description: `Your break-even is ${fmtNum(Math.ceil(result.breakEvenUnits))} units/month or ${formatKES(result.breakEvenRevenue, true)}/month. Put this on a sticky note on your monitor.`, priority: 'medium' },
          { title: 'Build a 20% safety margin', description: 'Target sales at 120% of break-even. This gives you a buffer for slow months, discounting, and unexpected costs.', priority: 'medium' },
        ]}
      />
    </LearningLayout>
  )
}
