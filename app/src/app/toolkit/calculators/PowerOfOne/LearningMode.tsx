import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, ActionPlanSection } from '../../layouts/LearningLayout'
import { FormInput } from '../../components/FormInput'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { PowerOfOneCompound } from '../../content/visuals/PowerOfOneCompound'
import { KalundeCaseStudy } from '../../content/case-studies/kalunde'
import { calculatePowerOfOne, type PowerOfOneInputs } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const EXAMPLE: PowerOfOneInputs = {
  currentRevenue: 2_000_000,
  currentCOGS: 800_000,
  currentOverhead: 600_000,
  currentVolume: 100,
  annualRevenue: 24_000_000,
  priceMultiplier: 1,
  volumeMultiplier: 1,
  cogsMultiplier: 1,
  overheadMultiplier: 1,
  receivablesMultiplier: 1,
  wipMultiplier: 1,
  payablesMultiplier: 1,
}

const LEVERS = [
  {
    index: 1,
    icon: '💰',
    name: 'Price (+1%)',
    color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10',
    badgeColor: 'text-blue-700 dark:text-blue-300',
    explanation: 'Increasing price by 1% flows DIRECTLY to profit. There are no additional costs. If you have a 20% margin, a 1% price increase creates a 5% profit increase.',
    why: 'Price is the highest-leverage lever because every extra shilling of revenue at the same cost structure is pure profit. Most businesses undercharge by 10–30% due to fear of losing clients.',
    key: 'priceMultiplier' as const,
    actions: [
      { title: 'Test 1% with new clients', description: 'Raise your rate by 1% for all new clients only. Measure churn impact over 30 days. Expect near-zero resistance.', priority: 'high' as const },
      { title: 'Bundle services for value pricing', description: 'Group 3 services into a "package" at a slight premium. Clients compare packages, not line items.', priority: 'medium' as const },
      { title: 'Emphasise outcomes, not hours', description: '"We grew Client X revenue by 40%" commands higher prices than "We worked 80 hours."', priority: 'medium' as const },
    ],
  },
  {
    index: 2,
    icon: '🎯',
    name: 'Volume (+1%)',
    color: 'border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-900/10',
    badgeColor: 'text-indigo-700 dark:text-indigo-300',
    explanation: 'Sell 1% more units at current prices and margins. More sales with existing infrastructure means leveraged growth — same fixed costs, higher profit.',
    why: 'Volume growth uses your existing capacity. One extra client call per week = ~5 extra calls per year. At your conversion rate, that is 1–2 extra clients.',
    key: 'volumeMultiplier' as const,
    actions: [
      { title: 'One extra sales call per week', description: 'Just one more discovery call per week compounds to 52 extra conversations annually. Even a 10% conversion = 5 new clients.', priority: 'high' as const },
      { title: 'Launch a referral programme', description: '"Refer 2 clients, get a free month of service." Referrals close at 3× the rate of cold leads.', priority: 'medium' as const },
      { title: 'Expand to adjacent segments', description: 'Your current clients know others like them. Ask: "Who else in your network has this problem?"', priority: 'low' as const },
    ],
  },
  {
    index: 3,
    icon: '📉',
    name: 'COGS (-1%)',
    color: 'border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-900/10',
    badgeColor: 'text-violet-700 dark:text-violet-300',
    explanation: 'Reduce your direct costs of goods/services by 1%. Every shilling saved in COGS = a shilling of profit. No revenue increase required.',
    why: 'COGS often contains negotiated rates, waste, and inefficiency that have never been reviewed. Even a single supplier negotiation can yield 3–5% savings.',
    key: 'cogsMultiplier' as const,
    actions: [
      { title: 'Negotiate bulk discounts with top 3 suppliers', description: 'If you spend KES 500K/month with a supplier, ask for 3% bulk discount. That\'s KES 180K/year for one meeting.', priority: 'high' as const },
      { title: 'Find 1 alternative supplier to create competition', description: 'Getting a competing quote from a new supplier often prompts a 5–8% reduction from your existing one.', priority: 'medium' as const },
      { title: 'Measure and reduce process waste', description: 'Time your 5 most common service delivery steps. Eliminating one hour of wasted time per project = COGS reduction.', priority: 'low' as const },
    ],
  },
  {
    index: 4,
    icon: '✂️',
    name: 'Overhead (-1%)',
    color: 'border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10',
    badgeColor: 'text-purple-700 dark:text-purple-300',
    explanation: 'Reduce operating expenses by 1%. Unlike COGS, overhead reductions are permanent — they improve margins in every future month, compounding over time.',
    why: 'Overhead grows silently. Subscriptions auto-renew. Office space auto-extends. A quarterly overhead audit typically finds 5–15% in unnecessary spend.',
    key: 'overheadMultiplier' as const,
    actions: [
      { title: 'Audit all monthly subscriptions', description: 'Export your bank statement and highlight every recurring charge. Cancel anything not used in the last 30 days.', priority: 'high' as const },
      { title: 'Negotiate rent and utilities', description: 'As a long-term tenant, you have leverage. Ask for a 5% rent reduction; accept 3%. Long-term savings are significant.', priority: 'medium' as const },
      { title: 'Automate one manual process', description: 'Every manual process that can be automated (invoicing, reporting, scheduling) reduces overhead cost per unit of revenue.', priority: 'low' as const },
    ],
  },
  {
    index: 5,
    icon: '⚡',
    name: 'Receivables (-1 day)',
    color: 'border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-900/10',
    badgeColor: 'text-pink-700 dark:text-pink-300',
    explanation: 'Collect payment 1 day faster. This frees up 1 day\'s worth of annual revenue as working capital — cash you can use today instead of waiting.',
    why: 'Cash in your client\'s account earns you nothing. Collecting faster reduces your need to borrow, cuts interest costs, and gives you working capital for growth.',
    key: 'receivablesMultiplier' as const,
    actions: [
      { title: 'Send invoices same day work completes', description: 'Every day you delay invoicing = 1 day longer to get paid. Set a rule: invoice sent within 2 hours of delivery.', priority: 'high' as const },
      { title: 'Offer 2% discount for payment within 7 days', description: '2% early pay discount costs you KES 2K on a KES 100K invoice — and moves cash 21 days faster. Usually worth it.', priority: 'medium' as const },
      { title: 'Automated payment reminders at Day 14, 21, 28', description: 'Clients who receive a reminder on Day 14 pay 40% faster than those who don\'t. Automate with your invoicing tool.', priority: 'medium' as const },
    ],
  },
  {
    index: 6,
    icon: '📦',
    name: 'WIP/Inventory (-1 day)',
    color: 'border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/10',
    badgeColor: 'text-rose-700 dark:text-rose-300',
    explanation: 'Complete work 1 day faster (services) or reduce inventory by 1 day (products). Cash tied up in WIP or inventory earns nothing and creates risk.',
    why: 'WIP is the invisible inventory of service businesses. Every day your team spends on undelivered work is cash you have spent but cannot bill for yet.',
    key: 'wipMultiplier' as const,
    actions: [
      { title: 'Standardise your delivery process with templates', description: 'A standard project template cuts delivery time by 20–30%. Every day saved = 1 day less WIP.', priority: 'high' as const },
      { title: 'Bill at milestones instead of completion', description: 'Split every project into 3 billing milestones (30%/40%/30%). Immediately cuts WIP by 50–60%.', priority: 'high' as const },
      { title: 'Require 30% upfront deposit', description: 'A 30% deposit before project start means you have collected before WIP even begins accumulating.', priority: 'medium' as const },
    ],
  },
  {
    index: 7,
    icon: '🕐',
    name: 'Payables (+1 day)',
    color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10',
    badgeColor: 'text-orange-700 dark:text-orange-300',
    explanation: 'Negotiate to pay suppliers 1 day later. This keeps cash in your business longer — 1 extra day of annual revenue remains in your account.',
    why: 'Paying suppliers early is a free loan to them. By negotiating Net 30 instead of Net 15, you keep cash in your business for an extra 15 days at no cost.',
    key: 'payablesMultiplier' as const,
    actions: [
      { title: 'Request Net 30 from all suppliers currently on Net 15', description: 'A simple email: "We are growing and need Net 30 terms going forward." Most suppliers will agree to maintain the relationship.', priority: 'high' as const },
      { title: 'Use your payment history as leverage', description: 'If you\'ve paid on time for 12+ months, you are a low-risk customer. Use this to negotiate extended terms.', priority: 'medium' as const },
      { title: 'Pay on the due date, not early', description: 'Many businesses pay 3–5 days early by habit. Pay exactly on the due date to retain maximum cash.', priority: 'low' as const },
    ],
  },
]

export default function PowerOfOneLearning() {
  const [inputs, setInputs] = useState<PowerOfOneInputs>(EXAMPLE)
  const set = (key: keyof PowerOfOneInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculatePowerOfOne(inputs), [inputs])

  const leverPcts = [
    inputs.priceMultiplier ?? 1,
    inputs.volumeMultiplier ?? 1,
    inputs.cogsMultiplier ?? 1,
    inputs.overheadMultiplier ?? 1,
    inputs.receivablesMultiplier ?? 1,
    inputs.wipMultiplier ?? 1,
    inputs.payablesMultiplier ?? 1,
  ]

  return (
    <LearningLayout
      title="The Power of One Framework"
      description='Developed by Alan Miltz, the Power of One framework shows how 7 small 1% improvements — each easy on its own — combine to create a 7.2% compound improvement. Most businesses try to "double revenue" and fail. The Power of One shows a more reliable path.'
    >
      {/* Section 1 — Why small changes beat big bets */}
      <SectionHeader
        step={1}
        title="Why 7 × 1% beats 1 × 7%"
        explanation="A 7% improvement in a single area is hard — it requires a major strategy shift, investment, or luck. But seven 1% improvements? Each one is a small, achievable action. And because they compound, the combined result is actually greater than 7%."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: '😰', title: 'The usual approach', desc: 'Focus on ONE big goal: "Double revenue!" Requires a massive strategy shift. Usually fails or takes years.', color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' },
          { icon: '✅', title: 'Power of One', desc: 'Improve 7 levers by 1% each. Each is achievable in weeks. Combined = 7.2% compound improvement.', color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10' },
          { icon: '📈', title: 'The compound effect', desc: '1.01 × 1.01 × 1.01 × 1.01 = 1.04 (not 1.04 exactly — it\'s slightly more due to compounding).', color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10' },
        ].map(c => (
          <div key={c.title} className={`rounded-lg border p-4 space-y-2 ${c.color}`}>
            <div className="text-2xl">{c.icon}</div>
            <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{c.title}</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 2 — Compound effect visual */}
      <SectionHeader
        step={2}
        title="The compound effect: 1.01⁷ = 1.072"
        explanation="When each lever improves by 1%, they don't just add — they multiply. A 1% price improvement on higher revenue produces more absolute gain than a 1% improvement on lower revenue."
      />

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-5">
        <PowerOfOneCompound levers={leverPcts} />
      </div>

      {/* Section 3 — Your business inputs */}
      <SectionHeader
        step={3}
        title="Enter your numbers to see your impact"
        explanation="The framework works for any business size. Enter your monthly figures and the calculator shows the actual KES impact of each 1% improvement."
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <FormInput label="Monthly Revenue" value={inputs.currentRevenue} onChange={set('currentRevenue')} format="currency" prefix="KES" />
        <FormInput label="Monthly COGS" value={inputs.currentCOGS} onChange={set('currentCOGS')} format="currency" prefix="KES" />
        <FormInput label="Monthly Overhead" value={inputs.currentOverhead} onChange={set('currentOverhead')} format="currency" prefix="KES" />
        <FormInput label="Annual Revenue" value={inputs.annualRevenue} onChange={set('annualRevenue')} format="currency" prefix="KES" hint="For cash lever calculations" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="Current Profit" value={formatKES(result.currentProfit, true)} subtitle="Monthly" icon="💵" status={result.currentProfit > 0 ? 'success' : 'error'} />
        <MetricCard label="Net Margin" value={formatPct(result.currentMargin)} icon="📊" status={result.currentMargin >= 15 ? 'success' : result.currentMargin >= 5 ? 'warning' : 'error'} />
        <MetricCard label="Profit Lever Impact" value={formatKES(result.combinedProfitImpact, true)} subtitle="All 4 profit levers at 1%" icon="💰" status="success" />
        <MetricCard label="Cash Lever Impact" value={formatKES(result.combinedCashImpact, true)} subtitle="All 3 cash levers at 1 day" icon="⚡" status="success" />
      </div>

      <AlertBanner
        type="success"
        title={`Total Impact: ${formatKES(result.combinedImpact, true)} from seven 1% improvements`}
        message={`Compound multiplier: ${result.compoundMultiplier.toFixed(4)}× on profit levers. That's ${formatPct((result.compoundMultiplier - 1) * 100)} compound improvement from four 1% changes.`}
      />

      {/* Section 4 — The 7 levers in detail */}
      <SectionHeader
        step={4}
        title="The 7 Levers explained"
        explanation="Each lever has a different mechanism. Levers 1-4 directly improve profitability. Levers 5-7 improve cash flow by reducing cash tied up in the business cycle."
      />

      <div className="space-y-6">
        {LEVERS.map(lever => {
          const leverResult = [result.lever1_Price, result.lever2_Volume, result.lever3_COGS, result.lever4_Overhead, result.lever5_Receivables, result.lever6_Inventory, result.lever7_Payables][lever.index - 1]
          const mult = leverPcts[lever.index - 1]

          return (
            <div key={lever.index} className={`rounded-xl border p-5 space-y-4 ${lever.color}`}>
              {/* Lever header */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{lever.icon}</div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Lever {lever.index}</p>
                    <h3 className={`text-base font-bold ${lever.badgeColor}`}>{lever.name}</h3>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Impact at {mult}{lever.index <= 4 ? '%' : ' day'}</p>
                  <p className="text-lg font-bold text-green-700 dark:text-green-300">{formatKES(leverResult.impact, true)}</p>
                </div>
              </div>

              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lever.explanation}</p>

              <div className="bg-white/60 dark:bg-gray-900/40 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Why it matters</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{lever.why}</p>
              </div>

              {/* Scenario slider */}
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  {lever.index <= 4 ? 'Improvement:' : 'Days improved:'}
                </span>
                <input
                  type="range"
                  min={0}
                  max={lever.index <= 4 ? 5 : 30}
                  step={lever.index <= 4 ? 0.5 : 1}
                  value={mult}
                  onChange={e => set(lever.key)(e.target.value)}
                  className="flex-1 accent-green-500"
                />
                <span className={`text-sm font-bold w-12 text-right ${lever.badgeColor}`}>
                  {mult}{lever.index <= 4 ? '%' : 'd'}
                </span>
              </div>

              <ActionPlanSection title="Action Ideas" items={lever.actions} />
            </div>
          )
        })}
      </div>

      {/* Section 5 — Kalunde reference */}
      <SectionHeader
        step={5}
        title="Lever 1 in action: Kalunde's pricing story"
        explanation="Kalunde's pricing transformation is the Power of One Lever 1 taken to the extreme — not 1%, but 200%. The same logic applies at any scale."
      />

      <AlertBanner
        type="info"
        title="Kalunde raised rates from KES 700 → 1,800/hr — that's +157%, not just 1%"
        message="The Power of One says even 1% matters. Kalunde's story shows what happens when you correct severe underpricing. Most businesses have a 5–20% gap they can close immediately."
      />

      <KalundeCaseStudy />

      {/* Section 6 — Pick 2 this quarter */}
      <SectionHeader
        step={6}
        title="Your action plan: pick 2 levers this quarter"
        explanation="Don't try to fix all 7 at once. Overwhelm leads to inaction. The most effective approach is picking ONE profit lever (1-4) and ONE cash lever (5-7) and executing them fully before moving to the next pair."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10 p-4">
          <p className="text-xs font-bold text-green-700 dark:text-green-300 uppercase tracking-wider mb-2">Pick 1 profit lever (1-4)</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Which is easiest to move in your business this quarter? For most businesses: Price (Lever 1) has highest impact with lowest effort.</p>
          <div className="mt-3 space-y-1">
            {[result.lever1_Price, result.lever2_Volume, result.lever3_COGS, result.lever4_Overhead].map((l, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{l.icon} Lever {i + 1}: {l.description}</span>
                <span className="font-medium text-green-700 dark:text-green-300">{formatKES(l.impact, true)}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 p-4">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-2">Pick 1 cash lever (5-7)</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Cash levers don't increase profit but free up capital for growth. Receivables (Lever 5) usually has the fastest result.</p>
          <div className="mt-3 space-y-1">
            {[result.lever5_Receivables, result.lever6_Inventory, result.lever7_Payables].map((l, i) => (
              <div key={i} className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{l.icon} Lever {i + 5}: {l.description}</span>
                <span className="font-medium text-blue-700 dark:text-blue-300">{formatKES(l.impact, true)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <ActionPlanSection
        title="Recommended 90-Day Plan"
        items={[
          { title: 'Week 1-2: Audit', description: 'Run all 7 levers with your actual numbers. Identify the 2 levers with highest impact-to-effort ratio for your business.', priority: 'high' },
          { title: 'Week 3-4: Quick wins', description: 'Implement the two highest-leverage quick actions (from the action plans above). Aim for immediate impact.', priority: 'high' },
          { title: 'Month 2-3: Measure and iterate', description: 'Track the before/after on your chosen levers. Measure impact in KES, not percentages. Set a target date.', priority: 'medium' },
          { title: 'Quarter end: Choose next 2 levers', description: 'After 90 days, move to the next pair. Run this cycle 4 times a year = all 7+ levers touched annually.', priority: 'low' },
        ]}
      />
    </LearningLayout>
  )
}
