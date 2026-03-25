import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, ActionPlanSection } from '../../layouts/LearningLayout'
import { FormInput } from '../../components/FormInput'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { calculateSustainableGrowth, type SustainableGrowthInputs } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const EXAMPLE: SustainableGrowthInputs = {
  currentRevenue: 2_000_000,
  netProfit: 300_000,
  retentionRate: 50,
  workingCapitalRequirement: 20,
  currentDebt: 1_000_000,
  targetDebtToEquity: 1.0,
  currentGrowthRate: 20,
}

const CASE_EXAMPLES = [
  { label: 'Company A', margin: 10, retention: 50, desc: '10% margin, reinvests 50% of profit' },
  { label: 'Company B', margin: 15, retention: 80, desc: '15% margin, reinvests 80% of profit' },
  { label: 'Company C', margin: 5, retention: 30, desc: '5% margin, reinvests only 30%' },
]

export default function SustainableGrowthLearning() {
  const [inputs, setInputs] = useState<SustainableGrowthInputs>(EXAMPLE)
  const set = (key: keyof SustainableGrowthInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculateSustainableGrowth(inputs), [inputs])

  return (
    <LearningLayout
      title="Sustainable Growth Rate"
      description="Most founders want to grow as fast as possible. But growing faster than your retained earnings allow is a trap — profitable companies go bankrupt because they run out of cash funding their own growth. The Sustainable Growth Rate (SGR) tells you exactly how fast you can grow without external funding."
    >
      {/* Section 1 — The Growth Trap */}
      <SectionHeader
        step={1}
        title="The Growth Trap: how profitable companies go bankrupt"
        explanation="It sounds impossible: a company with strong profits runs out of cash and closes. This happens all the time — and it's called the growth trap. Here's the mechanism."
      />

      <AlertBanner
        type="warning"
        title="The Growth Trap — Growing too fast kills profitable businesses"
        message={
          <div className="space-y-2 text-sm">
            <p>Scenario: Your business has KES 1M/month revenue, 15% margin (KES 150K profit). You land 3 large clients and revenue doubles to KES 2M next month.</p>
            <p><strong>The problem:</strong> You must pay staff, rent, and costs NOW. But clients pay in 30–60 days. You need KES 500K in additional working capital immediately — but you only have KES 150K/month in profit. <strong>You're profitable AND cash-bankrupt.</strong></p>
          </div>
        }
      />

      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '📈', title: 'Fast growth starts', desc: 'New clients, new orders, rapid revenue increase. Everything looks great on paper.', color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10' },
          { icon: '💸', title: 'Cash drains first', desc: 'You must hire, buy inventory, and pay costs before you can invoice or collect. Cash leaves before it arrives.', color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10' },
          { icon: '💀', title: 'Profitable but bankrupt', desc: 'P&L shows profit. Bank shows zero. Payroll is due. You cannot fund your own growth. Crisis.', color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' },
        ].map(step => (
          <div key={step.title} className={`rounded-lg border p-4 space-y-2 ${step.color}`}>
            <div className="text-2xl">{step.icon}</div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{step.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{step.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 2 — The SGR formula */}
      <SectionHeader
        step={2}
        title="The Sustainable Growth Rate formula (Higgins Model)"
        explanation="Professor Robert Higgins developed this formula in the 1970s. It answers: what is the maximum growth rate a business can sustain using only its own retained earnings?"
      />

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-4">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">The Formula</p>
        <div className="font-mono text-sm space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-2 py-1 rounded">Net Profit Margin</span>
            <span className="text-gray-400">×</span>
            <span className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-2 py-1 rounded">Retention Rate</span>
            <span className="text-gray-400">=</span>
            <span className="bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2 py-1 rounded">Plowback Ratio (b)</span>
          </div>
          <div className="mt-3">
            <p className="text-gray-600 dark:text-gray-400 text-xs">SGR = b ÷ (1 − b)</p>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
          Where Net Profit Margin = Net Profit ÷ Revenue, and Retention Rate is the % of profit reinvested in the business (rather than paid out as dividends or withdrawn by founders).
        </p>
      </div>

      {/* Section 3 — Real examples */}
      <SectionHeader
        step={3}
        title="Real-world examples — same industry, very different growth ceilings"
        explanation="Two companies in the same industry can have dramatically different sustainable growth rates — simply because of how much profit they make and how much they reinvest."
      />

      <div className="space-y-3">
        {CASE_EXAMPLES.map(ex => {
          const npm = ex.margin / 100
          const b = ex.retention / 100
          const sgr = denominator(npm, b) > 0 ? (npm * b / denominator(npm, b)) * 100 : 0
          return (
            <div key={ex.label} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex-1">
                <p className="font-semibold text-gray-900 dark:text-white text-sm">{ex.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{ex.desc}</p>
              </div>
              <div className="flex gap-4 text-sm shrink-0">
                <div className="text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Margin</p>
                  <p className="font-bold text-gray-700 dark:text-gray-300">{ex.margin}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">Retention</p>
                  <p className="font-bold text-gray-700 dark:text-gray-300">{ex.retention}%</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400 dark:text-gray-500">SGR</p>
                  <p className={`font-bold text-base ${sgr >= 10 ? 'text-green-700 dark:text-green-300' : sgr >= 5 ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
                    {formatPct(sgr)}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Section 4 — Interactive calculator */}
      <SectionHeader
        step={4}
        title="Calculate your sustainable growth rate"
        explanation="Enter your numbers to see your SGR and whether you are growing faster or slower than your retained earnings support."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <FormInput label="Monthly Revenue" value={inputs.currentRevenue} onChange={set('currentRevenue')} format="currency" prefix="KES" />
        <FormInput label="Monthly Net Profit" value={inputs.netProfit} onChange={set('netProfit')} format="currency" prefix="KES" />
        <FormInput label="Retention Rate" value={inputs.retentionRate} onChange={set('retentionRate')} format="percentage" hint="% of profit reinvested" min={0} max={100} />
        <FormInput label="WC Requirement" value={inputs.workingCapitalRequirement} onChange={set('workingCapitalRequirement')} format="percentage" hint="% of revenue" min={0} max={100} />
        <FormInput label="Current Growth Rate" value={inputs.currentGrowthRate ?? 0} onChange={set('currentGrowthRate')} format="percentage" hint="YoY actual growth %" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Sustainable Growth Rate"
          value={formatPct(result.sustainableGrowthRate)}
          subtitle="Max without new funding"
          icon="📈"
          status={result.sustainableGrowthRate >= 15 ? 'success' : result.sustainableGrowthRate >= 5 ? 'warning' : 'error'}
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
        <MetricCard
          label="Status"
          value={result.status}
          subtitle={result.growthGap !== null ? `Gap: ${result.growthGap > 0 ? '+' : ''}${formatPct(result.growthGap)}` : ''}
          icon="🎯"
          status={result.status === 'Optimal' || result.status === 'Opportunity' ? 'success' : result.status === 'Overstretched' ? 'error' : 'neutral'}
        />
      </div>

      {result.status === 'Overstretched' && result.fundingGapIfExceeding > 0 && (
        <AlertBanner
          type="error"
          title={`Overstretched: growing ${formatPct(result.growthGap ?? 0)} faster than sustainable`}
          message={`You need approximately ${formatKES(result.fundingGapIfExceeding, true)} in external funding to sustain this growth rate. Without it: cash crisis risk within 6–12 months.`}
        />
      )}
      {result.status === 'Opportunity' && (
        <AlertBanner
          type="info"
          title="Growth opportunity: you can safely accelerate"
          message={`Your current growth rate is ${formatPct(result.currentGrowthRate ?? 0)}, but your retained earnings can support up to ${formatPct(result.sustainableGrowthRate)}. You have room to invest in growth.`}
        />
      )}
      {result.status === 'Optimal' && (
        <AlertBanner
          type="success"
          title="Optimal: growth rate matches retained earnings capacity"
          message="Your growth and financial profile are well-balanced. Maintain this discipline and review quarterly."
        />
      )}

      {/* Section 5 — Two levers to increase SGR */}
      <SectionHeader
        step={5}
        title="Two levers to increase your sustainable growth rate"
        explanation="If your current growth rate exceeds the SGR, you have two choices: slow down, or use one of these levers to raise your SGR."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            lever: 'Increase net profit margin',
            icon: '📈',
            how: 'Raise prices, cut COGS, reduce overhead. Even 1% more margin meaningfully raises SGR.',
            example: `${formatPct(result.netProfitMargin)}% margin → ${formatPct(result.netProfitMargin + 3)}% would raise SGR by ~${formatPct((((result.netProfitMargin + 3) / 100 * inputs.retentionRate / 100) / (1 - (result.netProfitMargin + 3) / 100 * inputs.retentionRate / 100)) * 100 - result.sustainableGrowthRate)}`,
            color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10',
          },
          {
            lever: 'Increase retention rate',
            icon: '🏦',
            how: 'Reinvest more profit instead of withdrawing it. Higher retained earnings = higher SGR.',
            example: `${inputs.retentionRate}% retention → 80% would raise SGR by ${formatPct(Math.max(0, ((result.netProfitMargin / 100 * 0.8) / (1 - result.netProfitMargin / 100 * 0.8)) * 100 - result.sustainableGrowthRate))}`,
            color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10',
          },
        ].map(item => (
          <div key={item.lever} className={`rounded-lg border p-4 space-y-2 ${item.color}`}>
            <div className="text-2xl">{item.icon}</div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{item.lever}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400">{item.how}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-900/40 rounded p-2">{item.example}</p>
          </div>
        ))}
      </div>

      <ActionPlanSection
        title="Recommendations"
        items={result.recommendations.map((rec, i) => ({
          title: `Action ${i + 1}`,
          description: rec,
          priority: i === 0 ? 'high' : i < 3 ? 'medium' : 'low',
        }))}
      />
    </LearningLayout>
  )
}

// Helper used inline
function denominator(npm: number, b: number): number {
  return 1 - npm * b
}
