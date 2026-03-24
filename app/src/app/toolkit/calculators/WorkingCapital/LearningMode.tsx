import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, ActionPlanSection } from '../../layouts/LearningLayout'
import { FormInput } from '../../components/FormInput'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { CashTimeline } from '../../content/visuals/CashTimeline'
import { MercyCaseStudy } from '../../content/case-studies/mercy'
import { calculateWorkingCapital, type WorkingCapitalInputs } from './shared'
import { formatKES, fmtNum } from '../../utils/format'

const EXAMPLE: WorkingCapitalInputs = {
  wipDays: 45,
  receivablesDays: 60,
  payablesDays: 20,
  annualRevenue: 12_000_000,
}

export default function WorkingCapitalLearning() {
  const [inputs, setInputs] = useState<WorkingCapitalInputs>(EXAMPLE)
  const set = (key: keyof WorkingCapitalInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculateWorkingCapital(inputs), [inputs])

  return (
    <LearningLayout
      title="Working Capital & Cash Conversion Cycle"
      description="Working capital is the cash your business ties up in its operations between paying expenses and collecting revenue. The Cash Conversion Cycle (CCC) measures how many days that cash is trapped — and it's one of the most powerful levers you have."
    >
      {/* Section 1 */}
      <SectionHeader
        step={1}
        title="The Cash Conversion Cycle (Alan Miltz framework)"
        explanation="The CCC tells you how many days of revenue are locked in your working capital at any given time. Three components: WIP days + Receivables days − Payables days = CCC days."
      />
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: '🏗️', label: 'WIP Days', color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200', desc: 'Days before you invoice after starting work. For service businesses, this is the "invisible inventory" — time you spend on a project before you can bill for it.' },
          { icon: '📥', label: 'Receivables Days (DSO)', color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200', desc: 'Days to collect payment after invoicing. This is Days Sales Outstanding (DSO). Every extra day here = cash sitting in your client\'s account instead of yours.' },
          { icon: '📤', label: 'Payables Days (DPO)', color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200', desc: 'Days before you pay your suppliers. Higher DPO = you keep cash longer. This is a buffer. Negotiate Net 30–60 with key suppliers to increase DPO.' },
        ].map(c => (
          <div key={c.label} className={`rounded-lg border p-4 ${c.color}`}>
            <div className="text-2xl mb-2">{c.icon}</div>
            <h4 className="text-sm font-semibold mb-1">{c.label}</h4>
            <p className="text-xs leading-relaxed opacity-80">{c.desc}</p>
          </div>
        ))}
      </div>

      {/* Section 2 — WIP insight for service businesses */}
      <SectionHeader
        step={2}
        title="WIP: the invisible inventory of service businesses"
        explanation="Product businesses have physical inventory (goods sitting in a warehouse). Service businesses have WIP — partially completed work that cannot be invoiced yet. It's just as dangerous to cash flow."
      />
      <AlertBanner
        type="info"
        title="The WIP Problem"
        message="If you spend 60 days on a project before invoicing, you are financing your client's project with your own cash for 60 days. You've paid your team, your tools, your overhead — but received nothing. This is the #1 cash flow killer for consultants, agencies, and professional services firms."
      />
      <div className="space-y-2 text-sm">
        <p className="font-semibold text-gray-900 dark:text-white">How to reduce WIP days:</p>
        <ul className="space-y-1.5 text-gray-600 dark:text-gray-400">
          {[
            '✅ Invoice at milestones (25%, 50%, 75%, 100% completion) instead of project end',
            '✅ Require 30–50% upfront deposit before starting any project',
            '✅ Use fixed-price contracts rather than time-and-materials where possible',
            '✅ Set a maximum WIP threshold — never start the next phase without payment for the previous one',
          ].map((item, i) => <li key={i}>{item}</li>)}
        </ul>
      </div>

      {/* Section 3 — Interactive */}
      <SectionHeader
        step={3}
        title="Calculate your CCC"
        explanation="Enter your WIP days, receivables days, payables days, and annual revenue to see your CCC and how much cash is locked in your working capital."
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <FormInput label="WIP Days" value={inputs.wipDays} onChange={set('wipDays')} format="number" hint="Days before invoicing" />
        <FormInput label="Receivables Days" value={inputs.receivablesDays} onChange={set('receivablesDays')} format="number" hint="Days to collect" />
        <FormInput label="Payables Days" value={inputs.payablesDays} onChange={set('payablesDays')} format="number" hint="Days to pay suppliers" />
        <FormInput label="Annual Revenue" value={inputs.annualRevenue} onChange={set('annualRevenue')} format="currency" prefix="KES" />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard label="CCC" value={`${fmtNum(result.ccc)} days`} subtitle={`Target: 45 days`} icon="🔄" status={result.ccc <= 45 ? 'success' : result.ccc <= 90 ? 'warning' : 'error'} />
        <MetricCard label="Cash Locked" value={formatKES(result.cashLocked, true)} subtitle="In working capital" icon="🔒" status={result.cashLocked > 3_000_000 ? 'error' : 'warning'} />
        <MetricCard label="Status" value={result.status} icon="📊" status={result.status === 'Excellent' || result.status === 'Good' ? 'success' : result.status === 'Needs Improvement' ? 'warning' : 'error'} />
        <MetricCard label="Cash to Free" value={formatKES(result.cashToFree, true)} subtitle="If CCC → 45 days" icon="💸" status="neutral" />
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <CashTimeline wipDays={inputs.wipDays} receivablesDays={inputs.receivablesDays} payablesDays={inputs.payablesDays} />
      </div>

      {/* Section 4 — Mercy case study */}
      <SectionHeader
        step={4}
        title="Case Study: How Mercy freed KES 4.1M in cash"
        explanation="Mercy's ESG consulting firm had KES 20M revenue and KES 0 profit — because her CCC was 105 days. Here's exactly how she fixed it."
      />
      <MercyCaseStudy />

      {/* Section 5 — Improvement strategies */}
      <SectionHeader
        step={5}
        title="Improvement strategies"
        explanation="The fastest way to free cash in your business without raising prices or cutting costs is to improve your CCC. Here's a prioritised approach."
      />
      <ActionPlanSection
        title="CCC Improvement Playbook"
        items={[
          { title: 'Invoice at project milestones', description: 'Switch from end-of-project billing to milestone billing (25/50/75/100%). Immediately cuts WIP days by 50–70%.', priority: 'high' },
          { title: 'Require upfront deposits', description: 'Require 30–50% deposit on all new contracts. Industry standard in consulting. Non-negotiable for high-risk clients.', priority: 'high' },
          { title: 'Automate payment reminders', description: 'Send automated reminders at Day 14, Day 21, Day 28, Day 35. Clients who are reminded pay 40% faster than those who aren\'t.', priority: 'medium' },
          { title: 'Offer early payment discounts', description: 'Offer 2% discount for payment within 10 days (Net 10/2%). The cost is small; the cash flow benefit is large.', priority: 'medium' },
          { title: 'Negotiate extended payables', description: 'Ask all key suppliers for Net 30–45 terms. Use your payment history as leverage. Extend DPO from 15 → 30+ days.', priority: 'low' },
        ]}
      />

      <ActionPlanSection
        title="Your Action Plan"
        items={result.recommendations.map((rec, i) => ({
          title: `Action ${i + 1}`,
          description: rec,
          priority: i === 0 ? 'high' : i < 3 ? 'medium' : 'low',
        }))}
      />
    </LearningLayout>
  )
}
