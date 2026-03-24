import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, DiagramSlot, ActionPlanSection } from '../../layouts/LearningLayout'
import { HealthScore } from '../../components/HealthScore'
import { FormInput } from '../../components/FormInput'
import { AlertBanner } from '../../components/AlertBanner'
import { calculateDashboard, type DashboardInputs } from './shared'
import { formatPct } from '../../utils/format'

const EXAMPLE: DashboardInputs = {
  revenue: 1_500_000,
  profit: 150_000,
  cashBalance: 800_000,
  runway: 4,
  margin: 10,
  growthRate: 12,
}

export default function DashboardLearning() {
  const [inputs, setInputs] = useState<DashboardInputs>(EXAMPLE)
  const set = (key: keyof DashboardInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculateDashboard(inputs), [inputs])

  return (
    <LearningLayout
      title="Financial Health Dashboard"
      description="A health score is a single number (0–100) that tells you how your business is performing across five key dimensions. Think of it like a doctor's check-up — one score, five vital signs."
      sidebar={
        <div className="space-y-4">
          <HealthScore score={result.overallScore} label="Your Health Score" size="lg" showBar />
          <div className="space-y-2">
            {Object.entries(result.breakdown).map(([key, score]) => (
              <div key={key}>
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                  <span className="capitalize">{key}</span>
                  <span>{Math.round(score as number)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${(score as number) >= 60 ? 'bg-green-500' : (score as number) >= 30 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    style={{ width: `${score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      {/* Section 1 */}
      <SectionHeader
        step={1}
        title="What is a Financial Health Score?"
        explanation="Your health score is a weighted average of five metrics. Each metric is scored 0–100, then combined using the weights below. A score above 60 is 'Good', above 80 is 'Excellent'. Below 40 means you need to take immediate action."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Profitability', weight: '20%', icon: '💰', desc: 'Net margin ≥ 15% = 100' },
          { label: 'Cash Runway', weight: '25%', icon: '⏳', desc: '6+ months = 100' },
          { label: 'Growth', weight: '15%', icon: '📈', desc: 'YoY growth ≥ 20% = 100' },
          { label: 'Efficiency', weight: '20%', icon: '⚙️', desc: 'Opex ≤ 60% revenue = 100' },
          { label: 'Liquidity', weight: '20%', icon: '🏦', desc: '6mo cash coverage = 100' },
        ].map(m => (
          <div key={m.label} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-center">
            <div className="text-2xl mb-1">{m.icon}</div>
            <p className="text-xs font-semibold text-gray-900 dark:text-white">{m.label}</p>
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{m.weight}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{m.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 2 */}
      <SectionHeader
        step={2}
        title="Try it with your numbers"
        explanation="Enter your business figures below. The health score and component breakdown update in real time, showing how each metric contributes to your overall score."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <FormInput label="Monthly Revenue" value={inputs.revenue} onChange={set('revenue')} format="currency" prefix="KES" />
        <FormInput label="Monthly Profit" value={inputs.profit} onChange={set('profit')} format="currency" prefix="KES" />
        <FormInput label="Cash Balance" value={inputs.cashBalance} onChange={set('cashBalance')} format="currency" prefix="KES" />
        <FormInput label="Runway (months)" value={inputs.runway} onChange={set('runway')} format="number" />
        <FormInput label="Net Margin %" value={inputs.margin} onChange={set('margin')} format="percentage" />
        <FormInput label="Growth Rate %" value={inputs.growthRate ?? ''} onChange={set('growthRate')} format="percentage" hint="YoY (optional)" />
      </div>

      {result.criticalIssues.length > 0 && (
        <AlertBanner type="error" title="Issues in your example" message={
          <ul className="list-disc list-inside">{result.criticalIssues.map((i, idx) => <li key={idx}>{i}</li>)}</ul>
        } />
      )}

      {/* Section 3 */}
      <SectionHeader
        step={3}
        title="Understanding each metric"
        explanation="Each of the five metrics measures a different aspect of financial health. Improving your weakest metric has the most impact on your overall score."
      />
      <div className="space-y-3">
        {[
          {
            title: 'Profitability (20%)', icon: '💰', score: result.breakdown.profitability,
            explain: `Net margin is net profit ÷ revenue. Your margin of ${formatPct(inputs.margin)} means you keep ${formatPct(inputs.margin)} of every shilling earned. Benchmark: 15%+.`,
            action: inputs.margin < 15 ? 'Raise prices, reduce direct costs, or cut overhead to push margin above 15%.' : 'Excellent — maintain discipline.',
          },
          {
            title: 'Cash Runway (25%)', icon: '⏳', score: result.breakdown.runway,
            explain: `Runway = how many months you can operate at current burn. ${inputs.runway} months means you have ${inputs.runway} months before cash runs out if revenue stops.`,
            action: inputs.runway < 6 ? 'Target 6+ months of runway. Reduce burn rate and build a cash reserve.' : 'Strong runway — aim for 6–12 months as a buffer.',
          },
          {
            title: 'Growth (15%)', icon: '📈', score: result.breakdown.growth,
            explain: `Year-over-year revenue growth. At ${formatPct(inputs.growthRate ?? 0)}, you are ${(inputs.growthRate ?? 0) >= 20 ? 'growing strongly' : (inputs.growthRate ?? 0) >= 10 ? 'growing moderately' : 'growing slowly or declining'}.`,
            action: (inputs.growthRate ?? 0) < 10 ? 'Focus on customer acquisition and retention. Consider new channels or products.' : 'Good growth — invest in what is working.',
          },
        ].map(m => (
          <div key={m.title} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg">{m.icon}</span>
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{m.title}</h4>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{m.explain}</p>
                <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1.5">→ {m.action}</p>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-lg font-bold ${m.score >= 60 ? 'text-green-700 dark:text-green-300' : m.score >= 30 ? 'text-yellow-700 dark:text-yellow-300' : 'text-red-700 dark:text-red-300'}`}>
                  {Math.round(m.score)}
                </div>
                <div className="text-xs text-gray-400">/100</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Section 4 — Improvement plan */}
      <SectionHeader
        step={4}
        title="Your improvement plan"
        explanation="Based on your numbers, here are prioritised actions to improve your health score. Focus on the highest-weight metrics first."
      />
      <ActionPlanSection
        title="Recommended Actions"
        items={result.recommendations.map((rec, i) => ({
          title: `Action ${i + 1}`,
          description: rec,
          priority: i === 0 ? 'high' : i === 1 ? 'medium' : 'low',
        }))}
      />

      <DiagramSlot
        title="Health Score Tiers"
        description="Critical (0–29) → Poor (30–39) → Fair (40–59) → Good (60–79) → Excellent (80–100)"
      >
        <div className="flex gap-1 w-full h-8">
          {[
            { label: 'Critical', color: 'bg-red-500', w: 30 },
            { label: 'Poor', color: 'bg-orange-500', w: 10 },
            { label: 'Fair', color: 'bg-yellow-500', w: 20 },
            { label: 'Good', color: 'bg-blue-500', w: 20 },
            { label: 'Excellent', color: 'bg-green-500', w: 20 },
          ].map(tier => (
            <div
              key={tier.label}
              className={`${tier.color} rounded flex items-center justify-center text-xs text-white font-medium`}
              style={{ flex: tier.w }}
            >
              {tier.label}
            </div>
          ))}
        </div>
      </DiagramSlot>
    </LearningLayout>
  )
}
