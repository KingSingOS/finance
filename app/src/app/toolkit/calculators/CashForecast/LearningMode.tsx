import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, CaseStudyCard, DiagramSlot } from '../../layouts/LearningLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { calculateCashForecast, type CashForecastInputs } from './shared'
import { formatKES } from '../../utils/format'

const EXAMPLE: CashForecastInputs = {
  startingCash: 1_500_000,
  weeklyRevenue: 250_000,
  weeklyExpenses: 290_000,  // loss-making to illustrate the lesson
}

export default function CashForecastLearning() {
  const [inputs, setInputs] = useState<CashForecastInputs>(EXAMPLE)
  const set = (key: keyof CashForecastInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculateCashForecast(inputs), [inputs])

  // Simple sparkline for cash balance
  const maxCash = Math.max(...result.weeks.map(w => w.endingCash), inputs.startingCash)
  const cashBars = result.weeks.map(w => ({
    ...w,
    height: maxCash > 0 ? Math.max(4, (w.endingCash / maxCash) * 80) : 4,
  }))

  return (
    <LearningLayout
      title="13-Week Cash Forecast"
      description="Profitability ≠ cash. A business can be profitable on paper and run out of money next Friday. The 13-week cash forecast is the most important tool a founder can use — it tells you exactly when you'll run out of cash."
    >
      {/* Section 1 */}
      <SectionHeader
        step={1}
        title="Why cash runway matters more than profit"
        explanation="Profit is an accounting concept. Cash is reality. Businesses die from running out of cash, not from making accounting losses. You need to know your runway — how many weeks until you hit zero."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '📊', title: 'Profitable, Cash Positive', desc: 'Revenue > Costs AND cash is increasing. This is the goal.', color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' },
          { icon: '⚠️', title: 'Profitable, Cash Negative', desc: 'Accounting shows profit BUT cash balance falls. This happens when clients pay late, invoices are delayed, or you invest in growth. DANGEROUS.', color: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' },
          { icon: '🚨', title: 'Loss-Making, Cash Burning', desc: 'Expenses > Revenue every week. Cash reduces each period until you hit zero. Immediate action required.', color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20' },
        ].map(s => (
          <div key={s.title} className={`rounded-lg border p-4 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{s.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 2 */}
      <SectionHeader
        step={2}
        title="What is burn rate?"
        explanation="Burn rate = how much cash you spend each week (or month) in excess of what you bring in. If you bring in KES 250K/week and spend KES 300K, your burn rate is KES 50K/week."
      />
      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-4 space-y-2">
        <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Burn Rate Formula</p>
        <div className="font-mono text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <p>Weekly Burn = Weekly Expenses − Weekly Revenue</p>
          <p>Runway (weeks) = Current Cash ÷ Weekly Burn</p>
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
            Example: KES {formatKES(EXAMPLE.startingCash)} ÷ KES {formatKES(EXAMPLE.weeklyExpenses - EXAMPLE.weeklyRevenue)}/week burn = {Math.round(EXAMPLE.startingCash / (EXAMPLE.weeklyExpenses - EXAMPLE.weeklyRevenue))} weeks
          </p>
        </div>
      </div>

      {/* Section 3 — Interactive forecast */}
      <SectionHeader
        step={3}
        title="Build your 13-week forecast"
        explanation="Enter your starting cash, average weekly revenue, and weekly expenses. The tool projects your cash balance week by week and tells you your runway."
      />
      <div className="grid grid-cols-3 gap-3">
        <FormInput label="Starting Cash" value={inputs.startingCash} onChange={set('startingCash')} format="currency" prefix="KES" />
        <FormInput label="Weekly Revenue" value={inputs.weeklyRevenue} onChange={set('weeklyRevenue')} format="currency" prefix="KES" />
        <FormInput label="Weekly Expenses" value={inputs.weeklyExpenses} onChange={set('weeklyExpenses')} format="currency" prefix="KES" />
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Runway"
          value={result.runwayWeeks === Infinity ? '13+ wks' : `${result.runwayWeeks} wks`}
          icon="⏳"
          status={result.runwayWeeks === Infinity || result.runwayWeeks >= 13 ? 'success' : result.runwayWeeks >= 8 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Weekly Net"
          value={formatKES(inputs.weeklyRevenue - inputs.weeklyExpenses, true)}
          icon={inputs.weeklyRevenue >= inputs.weeklyExpenses ? '📈' : '📉'}
          status={inputs.weeklyRevenue >= inputs.weeklyExpenses ? 'success' : 'error'}
        />
        <MetricCard label="Total Net (13 wk)" value={formatKES(result.totalNetFlow, true)} icon="📊" status={result.totalNetFlow >= 0 ? 'success' : 'error'} />
        <MetricCard
          label="Crisis Weeks"
          value={`${result.weeks.filter(w => w.status === 'crisis').length} / 13`}
          icon="🚨"
          status={result.weeks.filter(w => w.status === 'crisis').length === 0 ? 'success' : 'error'}
        />
      </div>

      {/* Cash bar chart */}
      <DiagramSlot title="13-Week Cash Balance">
        <div className="w-full space-y-2">
          <div className="flex items-end gap-1 h-24">
            {cashBars.map(w => (
              <div key={w.week} className="flex-1 flex flex-col items-center gap-0.5">
                <div
                  className={`w-full rounded-t transition-all ${w.status === 'healthy' ? 'bg-green-500' : w.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}
                  style={{ height: `${w.height}%` }}
                  title={`Week ${w.week}: ${formatKES(w.endingCash, true)}`}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-gray-400 dark:text-gray-500">
            <span>Wk 1</span>
            <span>Wk 7</span>
            <span>Wk 13</span>
          </div>
          <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-green-500 inline-block" /> Healthy (&gt;8 wks left)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-yellow-500 inline-block" /> Warning (4–8 wks)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded bg-red-500 inline-block" /> Crisis (&lt;4 wks)</span>
          </div>
        </div>
      </DiagramSlot>

      {result.status !== 'healthy' && (
        <AlertBanner
          type={result.status === 'critical' ? 'error' : 'warning'}
          title={result.status === 'critical' ? 'Action required: runway is critical' : 'Warning: cash position needs attention'}
          message={
            <div className="space-y-1 text-sm">
              <p>Immediate steps:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Chase all outstanding invoices — call every client with a balance</li>
                <li>Delay all non-essential expenses by 30–60 days</li>
                <li>Offer clients a discount for early payment (2–5%)</li>
                <li>Review subscriptions and recurring costs — cut non-critical ones</li>
                {result.runwayWeeks < 8 && <li className="font-semibold">Explore emergency credit line or bridge financing</li>}
              </ul>
            </div>
          }
        />
      )}

      {/* Section 4 — Scenario planning */}
      <SectionHeader
        step={4}
        title="Scenario planning: best / worst / likely"
        explanation="Never forecast with a single scenario. Build three: worst case (revenue drops 20%), likely case (baseline), and best case (revenue increases 20%). Manage to the worst case."
      />
      <div className="grid grid-cols-3 gap-3 text-sm">
        {[
          { label: 'Worst Case', factor: 0.8, color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200' },
          { label: 'Likely Case', factor: 1.0, color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200' },
          { label: 'Best Case', factor: 1.2, color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200' },
        ].map(s => {
          const r = calculateCashForecast({ ...inputs, weeklyRevenue: inputs.weeklyRevenue * s.factor })
          return (
            <div key={s.label} className={`rounded-lg border p-3 ${s.color}`}>
              <p className="text-xs font-semibold uppercase tracking-wider opacity-75 mb-1">{s.label}</p>
              <p className="font-bold">
                {r.runwayWeeks === Infinity ? '13+ weeks' : `${r.runwayWeeks} wks`}
              </p>
              <p className="text-xs opacity-75 mt-0.5">Revenue ×{s.factor}</p>
            </div>
          )
        })}
      </div>

      <CaseStudyCard
        company="Nairobi Logistics Company"
        scenario="Founder showed a P&L with KES 400K net profit for the month. But bank account had KES 50K. He was confused — 'how can I be profitable and broke?'"
        outcome="Cash flow analysis showed 4 large clients owed KES 1.8M, all 60+ days overdue. The 'profit' existed on paper but not in the bank. Collections were accelerated, and cash recovered in 6 weeks."
        lesson="Your P&L is based on when you invoice. Your cash is based on when clients pay. These are different things."
        tag="Cash vs Profit"
      />
    </LearningLayout>
  )
}
