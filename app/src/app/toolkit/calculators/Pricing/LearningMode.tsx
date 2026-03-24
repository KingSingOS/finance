import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, DiagramSlot, ActionPlanSection } from '../../layouts/LearningLayout'
import { FormInput } from '../../components/FormInput'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { ResultDisplay } from '../../components/ResultDisplay'
import { KalundeCaseStudy } from '../../content/case-studies/kalunde'
import { calculatePricing, type PricingInputs } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const EXAMPLE: PricingInputs = {
  directCosts: 600,
  overheadAllocation: 400,
  targetMargin: 40,
  marketRate: 1_800,
  valueToClient: 50_000,
  valueCapture: 25,
  unitsPerYear: 1_200,
}

export default function PricingLearning() {
  const [inputs, setInputs] = useState<PricingInputs>(EXAMPLE)
  const set = (key: keyof PricingInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculatePricing(inputs), [inputs])

  return (
    <LearningLayout
      title="3-Method Pricing Framework"
      description="Most founders price by feel — asking 'what will clients accept?' or copying competitors. This leads to systematic underpricing. The 3-method approach gives you a defensible, profitable anchor price grounded in cost, market, and value."
    >
      {/* Section 1 */}
      <SectionHeader
        step={1}
        title="Why cost-plus alone isn't enough"
        explanation="Cost-plus pricing (your cost + a markup) is the floor — it keeps you from losing money. But it leaves money on the table if your service delivers high value, and it can push you below market if your cost estimate is wrong."
      />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            method: 'Cost-Plus',
            icon: '💲',
            pros: ['Ensures you never sell below cost', 'Simple to calculate', 'Defensible internally'],
            cons: ['Ignores what clients will actually pay', 'Ignores value you deliver', 'Race to the bottom with competitors'],
            verdict: 'Use as your minimum floor — never price below this',
            color: 'border-blue-200 dark:border-blue-800',
          },
          {
            method: 'Market-Based',
            icon: '📊',
            pros: ['Grounded in what buyers expect', 'Competitive positioning', 'Easy to justify to clients'],
            cons: ['May anchor to wrong comparisons', 'Ignores your cost structure', 'Commoditises your service'],
            verdict: 'Use as a sanity check and competitive reference',
            color: 'border-orange-200 dark:border-orange-800',
          },
          {
            method: 'Value-Based',
            icon: '💡',
            pros: ['Highest potential price', 'Aligns price with ROI delivered', 'Differentiates from competitors'],
            cons: ['Requires understanding client ROI', 'Harder to prove to price-sensitive clients', 'Needs strong sales capability'],
            verdict: 'Use as your ceiling — the maximum your price can reach',
            color: 'border-green-200 dark:border-green-800',
          },
        ].map(m => (
          <div key={m.method} className={`rounded-lg border bg-white dark:bg-gray-900 p-4 ${m.color}`}>
            <div className="text-2xl mb-2">{m.icon}</div>
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">{m.method}</h4>
            <div className="space-y-1 mb-3">
              {m.pros.map((p, i) => <p key={i} className="text-xs text-green-600 dark:text-green-400">✓ {p}</p>)}
              {m.cons.map((c, i) => <p key={i} className="text-xs text-red-600 dark:text-red-400">✗ {c}</p>)}
            </div>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 border-t border-gray-200 dark:border-gray-700 pt-2">
              → {m.verdict}
            </p>
          </div>
        ))}
      </div>

      {/* Section 2 — Value-based explained */}
      <SectionHeader
        step={2}
        title="Value-based pricing: how to calculate client value"
        explanation="Value-based pricing starts with understanding what your client would lose (or gain) by hiring you. Then you charge 20–30% of that value. The remaining 70–80% is the client's ROI."
      />
      <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-4 space-y-3">
        <p className="text-sm font-semibold text-purple-800 dark:text-purple-200">The Value Equation</p>
        <div className="space-y-1.5 text-sm text-purple-700 dark:text-purple-300 font-mono">
          <p>Step 1: What problem does your client have? (KES value)</p>
          <p>Step 2: How much of that problem do you solve? (% solved)</p>
          <p>Step 3: Your value delivered = Problem × % solved</p>
          <p>Step 4: Your price = Value delivered × 20–30% capture rate</p>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded p-3 text-xs text-gray-600 dark:text-gray-400">
          <strong>Example:</strong> Client loses KES 500K/month due to poor social media. You solve 60% of that = KES 300K value/month.
          At 25% capture: KES 75,000/month. At 4 hours/week = KES 4,687.50/hour. Much higher than a "market rate" of KES 1,500/hour.
        </div>
      </div>

      {/* Section 3 — Interactive calculator */}
      <SectionHeader
        step={3}
        title="Calculate your anchor price"
        explanation="Enter your cost structure, target margin, market rate, and value parameters. The tool shows all three prices and recommends an anchor."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <FormInput label="Direct Costs / hr" value={inputs.directCosts} onChange={set('directCosts')} format="currency" prefix="KES" hint="Labour + materials per unit" />
        <FormInput label="Overhead / hr" value={inputs.overheadAllocation} onChange={set('overheadAllocation')} format="currency" prefix="KES" hint="Rent, tools, admin per unit" />
        <FormInput label="Target Margin %" value={inputs.targetMargin} onChange={set('targetMargin')} format="percentage" />
        <FormInput label="Market Rate" value={inputs.marketRate} onChange={set('marketRate')} format="currency" prefix="KES" hint="What competitors charge" />
        <FormInput label="Value to Client" value={inputs.valueToClient} onChange={set('valueToClient')} format="currency" prefix="KES" hint="Client problem cost or benefit" />
        <FormInput label="Value Capture %" value={inputs.valueCapture} onChange={set('valueCapture')} format="percentage" hint="20–30% is typical" />
      </div>

      {result.isBelowCost && (
        <AlertBanner type="error" title="Below Cost" message={`Your total cost is ${formatKES(result.totalCost)}/unit. Price above this before anything else.`} />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {result.methods.map(m => (
          <MetricCard
            key={m.name}
            label={m.name}
            value={formatKES(m.price)}
            subtitle={m.label}
            icon={m.name === 'Cost-Plus' ? '💲' : m.name === 'Market Rate' ? '📊' : '💡'}
            status={m.margin >= 30 ? 'success' : m.margin >= 15 ? 'warning' : 'error'}
            trend={{ value: Math.round(m.margin), label: 'margin' }}
          />
        ))}
      </div>

      <div className="rounded-lg border-2 border-blue-300 dark:border-blue-600 bg-blue-50 dark:bg-blue-900/20 p-4">
        <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">🎯 Anchor Price (Recommended)</p>
        <p className="text-3xl font-bold text-blue-700 dark:text-blue-300 mb-1">{formatKES(result.recommendedPrice)}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{result.recommendation}</p>
      </div>

      <ResultDisplay
        title="Annual Impact"
        status={result.marginAtRecommended >= 30 ? 'success' : 'warning'}
        sections={[{
          rows: [
            { label: 'Recommended Price', value: formatKES(result.recommendedPrice), highlight: true },
            { label: 'Gross Margin', value: formatPct(result.marginAtRecommended), status: result.marginAtRecommended >= 30 ? 'success' : 'warning' },
            { label: `Annual Revenue (${inputs.unitsPerYear} units)`, value: formatKES(result.recommendedPrice * inputs.unitsPerYear, true) },
            { label: 'Annual Profit', value: formatKES(result.annualImpact, true), highlight: true, status: result.annualImpact >= 0 ? 'success' : 'error' },
          ],
        }]}
      />

      {/* Section 4 — Kalunde case study */}
      <SectionHeader
        step={4}
        title="Case Study: Kalunde's KES 2.4M pricing mistake"
        explanation="Kalunde was charging KES 600–800/hour for social media strategy. Her true cost was KES 1,200/hour. A 3-method analysis revealed she should be charging KES 1,800/hour — and that clients would pay it."
      />
      <KalundeCaseStudy />

      {/* Section 5 — Psychology and action plan */}
      <SectionHeader
        step={5}
        title="Raising prices: how to do it without losing clients"
        explanation="Most founders fear raising prices will lose clients. In practice, a 20–30% price increase loses fewer than 20% of clients — and total revenue usually increases because better-paying clients replace price-sensitive ones."
      />
      <DiagramSlot title="Price Increase Playbook">
        <div className="text-sm text-left space-y-2 w-full">
          {[
            { week: 'Wk 1', action: 'Audit: know your true cost per hour/unit including all overhead' },
            { week: 'Wk 2', action: 'Research: call 5 potential clients, ask what they\'d pay. Do competitor research.' },
            { week: 'Wk 3', action: 'Calculate: run 3-method analysis for each service line' },
            { week: 'Wk 4', action: 'Announce to existing clients 30 days in advance ("annual rate adjustment")' },
            { week: 'Wk 6', action: 'Apply new rates to all new clients immediately, existing clients from Month 2' },
            { week: 'Wk 12', action: 'Review: which clients stayed? Revenue change? Adjust if needed.' },
          ].map(s => (
            <div key={s.week} className="flex gap-3">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded h-fit shrink-0">{s.week}</span>
              <p className="text-gray-600 dark:text-gray-400 text-xs">{s.action}</p>
            </div>
          ))}
        </div>
      </DiagramSlot>

      <ActionPlanSection
        title="Your Pricing Action Plan"
        items={[
          { title: 'Calculate your true hourly cost', description: `Your cost is ${formatKES(result.totalCost)}/unit. Include ALL overhead — if you're not including rent, internet, and admin time, your cost is higher than you think.`, priority: 'high' },
          { title: 'Research market rate in detail', description: 'Survey 5–10 competitors in your space. Ask referral sources what others charge. You may be underpriced by 30–50%.', priority: 'high' },
          { title: 'Quantify client ROI', description: 'For each service, ask: "What is this worth to my client?" Then use 20–30% as your price. Document specific ROI examples from past clients.', priority: 'medium' },
          { title: 'Test new pricing on next 3 proposals', description: 'Send your next 3 proposals at the recommended price. Track acceptance rate. If >80% say yes immediately, you may still be underpriced.', priority: 'medium' },
        ]}
      />
    </LearningLayout>
  )
}
