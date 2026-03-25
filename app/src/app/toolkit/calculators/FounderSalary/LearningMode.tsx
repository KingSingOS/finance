import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, ActionPlanSection } from '../../layouts/LearningLayout'
import { FormInput } from '../../components/FormInput'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { calculateFounderSalary, type FounderSalaryInputs } from './shared'
import { formatKES } from '../../utils/format'

const EXAMPLE: FounderSalaryInputs = {
  currentRevenue: 1_500_000,
  currentProfit: 300_000,
  cashBalance: 2_000_000,
  monthlyBurnRate: 1_200_000,
  foundersCount: 2,
  desiredSalaryPerFounder: 80_000,
  marketSalaryBenchmark: 200_000,
}

export default function FounderSalaryLearning() {
  const [inputs, setInputs] = useState<FounderSalaryInputs>(EXAMPLE)
  const set = (key: keyof FounderSalaryInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculateFounderSalary(inputs), [inputs])

  return (
    <LearningLayout
      title="Founder Salary: How to Pay Yourself"
      description="Paying yourself too early can bankrupt a growing business. Paying yourself too little creates burnout and resentment. This calculator helps you find the right balance — using the 30% rule and runway analysis."
    >
      {/* Section 1 — The founder dilemma */}
      <SectionHeader
        step={1}
        title="The founder's dilemma: take salary vs. reinvest"
        explanation="Every shilling you take as salary is a shilling that doesn't compound in the business. But paying yourself nothing is also unsustainable — it creates burnout, resentment, and poor decision-making."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '💀', title: 'No salary — burnout risk', desc: 'You work full-time for free. After 12 months, you\'re exhausted, making bad decisions, and considering quitting. The business suffers.', color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' },
          { icon: '✅', title: 'Moderate salary — the 30% rule', desc: 'Founder salaries stay below 30% of profit. You\'re compensated fairly, the business retains capital for growth.', color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' },
          { icon: '⚠️', title: 'Excessive salary — growth stall', desc: 'Founders take 70%+ of profit. Business has no retained earnings to fund growth. Gets stuck.', color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10' },
        ].map(s => (
          <div key={s.title} className={`rounded-lg border p-4 space-y-2 ${s.color}`}>
            <div className="text-2xl">{s.icon}</div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{s.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 2 — The 30% rule */}
      <SectionHeader
        step={2}
        title="The 30% rule"
        explanation="A simple, battle-tested guideline: total founder salaries should not exceed 30% of annual net profit. This leaves 70% of profit for reinvestment, debt service, and cash reserves."
      />

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-4">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">The 30% Rule in Practice</p>
        <div className="space-y-3">
          {[
            { profit: 300_000, founders: 1, label: '1 founder' },
            { profit: 300_000, founders: 2, label: '2 founders' },
            { profit: 1_000_000, founders: 2, label: '2 founders, higher profit' },
          ].map(ex => {
            const maxTotal = ex.profit * 0.3
            const perFounder = maxTotal / ex.founders
            return (
              <div key={ex.label} className="flex items-center justify-between gap-4 text-sm border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                <span className="text-gray-600 dark:text-gray-400">{ex.label}, {formatKES(ex.profit, true)}/mo profit</span>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">{formatKES(perFounder, true)}/mo each</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">(30% = {formatKES(maxTotal, true)}/mo total)</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Section 3 — Deferred compensation */}
      <SectionHeader
        step={3}
        title="Deferred compensation: tracking what you\'re owed"
        explanation="Many founders pay themselves below market rate in early years. Deferred compensation tracking is the discipline of recording this gap — so you can plan to close it as the business grows."
      />

      <AlertBanner
        type="info"
        title="Deferred compensation is a real obligation to yourself"
        message={
          <div className="space-y-1 text-sm">
            <p>Example: A senior product manager in Nairobi earns KES 250K/month. You pay yourself KES 60K. The KES 190K gap is deferred compensation — money you are owed but deferring to keep the business healthy.</p>
            <p>Track it monthly. Build a plan to close it when monthly profit reaches KES 800K+ (the 30% rule threshold for your target salary).</p>
          </div>
        }
      />

      {/* Section 4 — Salary vs dividends vs reinvestment */}
      <SectionHeader
        step={4}
        title="Salary vs. dividends vs. reinvestment"
        explanation="How you take money from the business matters — for tax, for optics with investors, and for financial planning."
      />

      <div className="space-y-3">
        {[
          {
            type: 'Salary',
            icon: '💼',
            pros: ['Regular income — predictable for personal budgeting', 'Shows business profitability accurately (salary is a cost)', 'Socially understood — you are an employee of your company'],
            cons: ['Subject to PAYE (income tax) — highest tax rate', 'Increases monthly burn rate'],
            color: 'border-blue-200 dark:border-blue-800',
            badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
          },
          {
            type: 'Dividends',
            icon: '💰',
            pros: ['Often lower tax rate than salary (withholding tax)', 'Flexible timing — only when profitable', 'Signalling: shows investors you\'re taking profit'],
            cons: ['Only payable from after-tax profit', 'Less predictable for personal budgeting', 'Not available if business is loss-making'],
            color: 'border-green-200 dark:border-green-800',
            badge: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
          },
          {
            type: 'Reinvestment',
            icon: '🌱',
            pros: ['Highest long-term return if business grows', 'Increases company value and SGR', 'No tax event today'],
            cons: ['No current income — only suits well-funded founders', 'Creates "paper wealth" that may never convert to cash', 'Requires discipline to not inflate lifestyle later'],
            color: 'border-purple-200 dark:border-purple-800',
            badge: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300',
          },
        ].map(item => (
          <div key={item.type} className={`rounded-lg border p-4 space-y-3 ${item.color}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{item.icon}</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${item.badge}`}>{item.type}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <p className="font-semibold text-green-700 dark:text-green-300 mb-1">Pros</p>
                {item.pros.map((p, i) => <p key={i} className="text-gray-600 dark:text-gray-400">✅ {p}</p>)}
              </div>
              <div>
                <p className="font-semibold text-red-700 dark:text-red-300 mb-1">Cons</p>
                {item.cons.map((c, i) => <p key={i} className="text-gray-600 dark:text-gray-400">⚠️ {c}</p>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section 5 — When to increase salary */}
      <SectionHeader
        step={5}
        title="When to increase your salary"
        explanation="There are clear signals that indicate you have earned the right to increase your draw. Use these as triggers, not arbitrary dates."
      />

      <div className="space-y-2">
        {[
          { trigger: '3 consecutive profitable quarters', detail: 'Sustained profitability (not one lucky month) means the business model is working. Reward yourself appropriately.' },
          { trigger: 'Cash runway > 12 months', detail: 'Over 12 months of runway means you have buffer for salary increases even in a slow quarter.' },
          { trigger: 'Revenue growth is steady (10%+ YoY)', detail: 'Growing at 10%+ annually means the business is compounding. Founder salary can increase proportionally.' },
          { trigger: 'Salary < 30% of annual profit', detail: 'This is the floor. If you\'re within the 30% rule and conditions above are met, increasing salary is financially responsible.' },
        ].map((item, i) => (
          <div key={i} className="flex gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
            <span className="text-green-500 font-bold text-lg shrink-0">✓</span>
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">{item.trigger}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Section 6 — Interactive calculator */}
      <SectionHeader
        step={6}
        title="Calculate your affordability"
        explanation="Enter your business financials and desired salary. The 30% rule and runway analysis will tell you exactly what you can afford."
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <FormInput label="Monthly Revenue" value={inputs.currentRevenue} onChange={set('currentRevenue')} format="currency" prefix="KES" />
        <FormInput label="Monthly Net Profit" value={inputs.currentProfit} onChange={set('currentProfit')} format="currency" prefix="KES" />
        <FormInput label="Cash Balance" value={inputs.cashBalance} onChange={set('cashBalance')} format="currency" prefix="KES" />
        <FormInput label="Monthly Burn Rate" value={inputs.monthlyBurnRate} onChange={set('monthlyBurnRate')} format="currency" prefix="KES" />
        <FormInput label="Founders Count" value={inputs.foundersCount} onChange={set('foundersCount')} format="number" min={1} max={10} />
        <FormInput label="Desired Salary / Founder" value={inputs.desiredSalaryPerFounder} onChange={set('desiredSalaryPerFounder')} format="currency" prefix="KES" />
        <FormInput label="Market Salary Benchmark" value={inputs.marketSalaryBenchmark ?? 0} onChange={set('marketSalaryBenchmark')} format="currency" prefix="KES" hint="What role pays externally" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Affordability"
          value={result.affordabilityStatus}
          subtitle={`Score: ${result.affordabilityScore}/100`}
          icon={result.affordabilityStatus === 'Affordable' ? '✅' : result.affordabilityStatus === 'Marginal' ? '⚠️' : '❌'}
          status={result.affordabilityStatus === 'Affordable' ? 'success' : result.affordabilityStatus === 'Marginal' ? 'warning' : 'error'}
        />
        <MetricCard
          label="Max Affordable"
          value={formatKES(result.maxAffordableSalary, true)}
          subtitle="Per founder / month"
          icon="💼"
          status={inputs.desiredSalaryPerFounder <= result.maxAffordableSalary ? 'success' : 'error'}
        />
        <MetricCard
          label="Runway With Salary"
          value={result.runwayMonthsWithSalary === Infinity ? '∞ months' : `${result.runwayMonthsWithSalary} months`}
          subtitle={`Without: ${result.runwayMonthsCurrent === Infinity ? '∞' : result.runwayMonthsCurrent} months`}
          icon="⏱️"
          status={result.runwayMonthsWithSalary >= 6 ? 'success' : result.runwayMonthsWithSalary >= 3 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Profit After Salary"
          value={formatKES(result.profitAfterSalary, true)}
          subtitle="Remaining monthly"
          icon="📊"
          status={result.profitAfterSalary > 0 ? 'success' : 'error'}
        />
      </div>

      {result.deferredCompAnnual > 0 && (
        <div className="rounded-lg border border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10 p-4 space-y-2">
          <p className="text-xs font-bold text-orange-700 dark:text-orange-300 uppercase tracking-wider">Deferred Compensation Tracker</p>
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
              <p className="text-xs text-gray-500 dark:text-gray-400">Monthly gap (all founders)</p>
              <p className="font-bold text-orange-700 dark:text-orange-300">{formatKES(result.deferredCompMonthly, true)}</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Annual deferred comp: <strong className="text-orange-700 dark:text-orange-300">{formatKES(result.deferredCompAnnual, true)}</strong> — record this in your financial records. Build a plan to close it as profit grows.
          </p>
        </div>
      )}

      <ActionPlanSection
        title="Recommendations"
        items={result.recommendations.map((rec, i) => ({
          title: `Action ${i + 1}`,
          description: rec,
          priority: i === 0 ? 'high' : i < 2 ? 'medium' : 'low',
        }))}
      />
    </LearningLayout>
  )
}
