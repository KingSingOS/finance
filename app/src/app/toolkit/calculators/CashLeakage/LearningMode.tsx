import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, ActionPlanSection } from '../../layouts/LearningLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { calculateCashLeakage, DEFAULT_EXPENSES, type CashLeakageInputs, type ExpenseItem, type Necessity } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const NECESSITY_BADGE: Record<Necessity, string> = {
  required: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  useful: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  optional: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
}

const STATUS_STYLES = {
  Excellent: 'success' as const,
  Good: 'success' as const,
  Fair: 'warning' as const,
  Poor: 'error' as const,
  Critical: 'error' as const,
}

export default function CashLeakageLearning() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(DEFAULT_EXPENSES)
  const [monthlyRevenue, setMonthlyRevenue] = useState(500_000)

  const inputs: CashLeakageInputs = { expenses, monthlyRevenue }
  const result = useMemo(() => calculateCashLeakage(inputs), [inputs])

  function updateExpense(id: string, field: keyof ExpenseItem, value: string | number | Necessity) {
    setExpenses(es => es.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  return (
    <LearningLayout
      title="Cash Leakage: Stop the Drains"
      description="Small recurring costs are invisible killers. KES 10,000/month in unnecessary subscriptions is KES 120,000/year — enough to hire a part-time assistant. This framework helps you identify, classify, and eliminate cash leaks before they compound."
    >
      {/* Section 1 — The compounding cost of small leaks */}
      <SectionHeader
        step={1}
        title="How small leaks compound into large losses"
        explanation="KES 1,000/month feels trivial. But it compounds: KES 1,000 × 12 months × 5 years = KES 60,000 spent on something that never contributed to revenue. Multiply that across 10 small leaks and you have a major problem."
      />

      <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3">The Compounding Cost of Leaks</p>
        <div className="space-y-2">
          {[
            { monthly: 2_000, desc: 'Unused SaaS subscription (1 tool)' },
            { monthly: 5_000, desc: 'Duplicate service already covered elsewhere' },
            { monthly: 10_000, desc: 'Excessive entertainment / meals' },
            { monthly: 15_000, desc: 'Auto-renewing memberships not used' },
          ].map(item => (
            <div key={item.desc} className="flex items-center justify-between text-sm gap-3">
              <span className="text-gray-600 dark:text-gray-400">{item.desc}</span>
              <div className="flex gap-4 shrink-0 text-right">
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Monthly</p>
                  <p className="font-medium text-gray-700 dark:text-gray-300">{formatKES(item.monthly, true)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">Annual</p>
                  <p className="font-medium text-red-700 dark:text-red-300">{formatKES(item.monthly * 12, true)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">5 years</p>
                  <p className="font-bold text-red-700 dark:text-red-300">{formatKES(item.monthly * 60, true)}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-bold text-sm">
            <span className="text-gray-900 dark:text-white">Total (4 leaks combined)</span>
            <span className="text-red-700 dark:text-red-300">{formatKES((2_000 + 5_000 + 10_000 + 15_000) * 60, true)} in 5 years</span>
          </div>
        </div>
      </div>

      {/* Section 2 — Common cash leaks */}
      <SectionHeader
        step={2}
        title="The most common cash leaks in African SMBs"
        explanation="These categories appear in nearly every business audit. Review each category against your own spend."
      />

      <div className="space-y-3">
        {[
          {
            category: 'Unused SaaS subscriptions',
            icon: '💻',
            detail: 'Software that auto-renews monthly. Average SMB has 3–5 tools they no longer use actively.',
            benchmark: 'Should be < 2% of revenue',
            fix: 'Audit all subscriptions. Cancel anything with < 5 uses in last 30 days.',
            color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10',
          },
          {
            category: 'Excessive travel & entertainment',
            icon: '✈️',
            detail: 'Client dinners, team outings, and travel that don\'t generate proportionate value.',
            benchmark: 'Should be < 5% of revenue',
            fix: 'Set a per-quarter entertainment budget. Require pre-approval for anything over KES 5,000.',
            color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/10',
          },
          {
            category: 'Duplicate services',
            icon: '🔄',
            detail: 'Two tools doing the same job (e.g. two project management tools, two cloud storage subscriptions).',
            benchmark: 'Zero duplicates target',
            fix: 'Map all tools to job-to-be-done. Eliminate redundancy in monthly tool audit.',
            color: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10',
          },
          {
            category: 'Paying suppliers too early',
            icon: '📅',
            detail: 'Paying invoices 3–7 days before they are due — a free loan to your supplier.',
            benchmark: 'Pay on due date, never early',
            fix: 'Set payment rules: pay on the due date. Use a payment queue in your accounting tool.',
            color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10',
          },
        ].map(leak => (
          <div key={leak.category} className={`rounded-lg border p-4 space-y-2 ${leak.color}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{leak.icon}</span>
              <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{leak.category}</h4>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">{leak.detail}</p>
            <div className="flex gap-4 text-xs">
              <span className="text-gray-500 dark:text-gray-400">Benchmark: <strong>{leak.benchmark}</strong></span>
            </div>
            <p className="text-xs text-green-700 dark:text-green-300">✅ Fix: {leak.fix}</p>
          </div>
        ))}
      </div>

      {/* Section 3 — Prevention systems */}
      <SectionHeader
        step={3}
        title="Prevention systems — stop leaks before they start"
        explanation="The best time to catch a leak is before it starts. These systems, once set up, run on autopilot."
      />

      <ActionPlanSection
        title="Leakage Prevention Systems"
        items={[
          { title: 'Monthly expense review (1 hour/month)', description: 'Every 1st of the month: export bank statement, highlight every line item. Ask: "Did this generate value in the last 30 days?" Cancel or reduce anything that didn\'t.', priority: 'high' },
          { title: 'Approval process for new subscriptions', description: 'Any new recurring expense requires a written justification (what problem does it solve? what\'s the ROI?). Founder approval required for anything > KES 2,000/month.', priority: 'high' },
          { title: 'Subscription audit calendar', description: 'Add every subscription renewal date to your calendar. Review 2 weeks before renewal. Cancel before auto-renewal if it\'s not delivering value.', priority: 'medium' },
          { title: 'Annual contract renegotiation', description: 'Every January, renegotiate your top 5 largest recurring costs: rent, internet, insurance, key suppliers. 3-5% reductions compound over years.', priority: 'medium' },
          { title: 'Centralised purchasing', description: 'All purchases > KES 5,000 go through one person/process. Eliminates duplicate purchases and impulse spending.', priority: 'low' },
        ]}
      />

      {/* Section 4 — Interactive audit */}
      <SectionHeader
        step={4}
        title="Audit your own expenses"
        explanation="Classify each expense as Required, Useful, or Optional. Anything Optional is a potential leak. Review and eliminate."
      />

      <div className="flex gap-3 items-end mb-4">
        <div className="w-48">
          <FormInput
            label="Monthly Revenue"
            value={monthlyRevenue}
            onChange={v => setMonthlyRevenue(parseFloat(v) || 0)}
            format="currency"
            prefix="KES"
          />
        </div>
      </div>

      {result.totalMonthlyLeakage > 0 && (
        <AlertBanner
          type={result.status === 'Excellent' || result.status === 'Good' ? 'success' : 'warning'}
          title={`${result.status}: ${formatKES(result.annualLeakageAmount, true)}/year in optional expenses identified`}
          message={`${formatKES(result.totalMonthlyLeakage, true)}/month = ${formatPct(result.leakagePercentOfRevenue)} of revenue. Eliminating these improves profit immediately with zero effort required on revenue.`}
        />
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricCard
          label="Monthly Leakage"
          value={formatKES(result.totalMonthlyLeakage, true)}
          subtitle="Optional expenses"
          icon="🚨"
          status={result.totalMonthlyLeakage > 10_000 ? 'error' : result.totalMonthlyLeakage > 3_000 ? 'warning' : 'success'}
        />
        <MetricCard
          label="Annual Leakage"
          value={formatKES(result.annualLeakageAmount, true)}
          icon="📅"
          status={STATUS_STYLES[result.status]}
        />
        <MetricCard
          label="Leakage Score"
          value={`${result.leakageScore}/100`}
          subtitle={result.status}
          icon="📊"
          status={STATUS_STYLES[result.status]}
        />
        <MetricCard
          label="% of Revenue"
          value={formatPct(result.leakagePercentOfRevenue)}
          subtitle="Target: < 5%"
          icon="📉"
          status={result.leakagePercentOfRevenue < 5 ? 'success' : 'warning'}
        />
      </div>

      {/* Expense classification table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Expense</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Monthly</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {expenses.map(expense => (
              <tr key={expense.id} className={[
                'bg-white dark:bg-gray-900',
                expense.necessity === 'optional' ? 'bg-red-50/30 dark:bg-red-900/5' : '',
              ].join(' ')}>
                <td className="px-3 py-2 text-gray-700 dark:text-gray-300">{expense.name}</td>
                <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-white">
                  {formatKES(expense.monthlyAmount, true)}
                </td>
                <td className="px-3 py-2 text-center">
                  <select
                    value={expense.necessity}
                    onChange={e => updateExpense(expense.id, 'necessity', e.target.value as Necessity)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-none cursor-pointer ${NECESSITY_BADGE[expense.necessity]}`}
                  >
                    <option value="required">✅ Required</option>
                    <option value="useful">⚠️ Useful</option>
                    <option value="optional">🚨 Optional</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Required', amount: result.totalMonthlyRequired, color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10', textColor: 'text-green-700 dark:text-green-300' },
          { label: 'Useful (Watch)', amount: result.totalMonthlyUseful, color: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10', textColor: 'text-yellow-700 dark:text-yellow-300' },
          { label: 'Optional (Leaks)', amount: result.totalMonthlyOptional, color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10', textColor: 'text-red-700 dark:text-red-300' },
        ].map(cat => (
          <div key={cat.label} className={`rounded-lg border p-3 ${cat.color}`}>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{cat.label}</p>
            <p className={`text-lg font-bold mt-1 ${cat.textColor}`}>{formatKES(cat.amount, true)}/mo</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{formatKES(cat.amount * 12, true)}/yr</p>
          </div>
        ))}
      </div>

      <ActionPlanSection
        title="Your Leak Elimination Plan"
        items={result.recommendations.map((rec, i) => ({
          title: `Action ${i + 1}`,
          description: rec,
          priority: i === 0 ? 'high' : 'medium',
        }))}
      />
    </LearningLayout>
  )
}
