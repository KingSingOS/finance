import { useState, useMemo } from 'react'
import { OpsLayout, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { ResultDisplay } from '../../components/ResultDisplay'
import { calculateCashLeakage, DEFAULT_EXPENSES, type CashLeakageInputs, type ExpenseItem, type Necessity } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const NECESSITIES: Necessity[] = ['required', 'useful', 'optional']
const NECESSITY_LABELS: Record<Necessity, string> = {
  required: '✅ Required',
  useful: '⚠️ Useful',
  optional: '🚨 Optional',
}
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

let nextId = 100

export default function CashLeakageOps() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>(DEFAULT_EXPENSES)
  const [monthlyRevenue, setMonthlyRevenue] = useState(500_000)

  const inputs: CashLeakageInputs = { expenses, monthlyRevenue }
  const result = useMemo(() => calculateCashLeakage(inputs), [inputs])

  function updateExpense(id: string, field: keyof ExpenseItem, value: string | number | Necessity) {
    setExpenses(es => es.map(e => e.id === id ? { ...e, [field]: value } : e))
  }

  function removeExpense(id: string) {
    setExpenses(es => es.filter(e => e.id !== id))
  }

  function addExpense() {
    const id = String(nextId++)
    setExpenses(es => [...es, { id, name: 'New expense', monthlyAmount: 5_000, necessity: 'useful' }])
  }

  const metricStatus = STATUS_STYLES[result.status]

  return (
    <OpsLayout
      title="Cash Leakage Detector"
      subtitle="Find and stop the drains on your cash"
      toolbar={
        <ActionBar actions={[
          { label: 'Add Expense', onClick: addExpense, variant: 'primary', icon: '+' },
          { label: 'Reset', onClick: () => setExpenses(DEFAULT_EXPENSES), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {/* Revenue input */}
      <div className="flex gap-3 items-end">
        <div className="w-48">
          <FormInput
            label="Monthly Revenue"
            value={monthlyRevenue}
            onChange={v => setMonthlyRevenue(parseFloat(v) || 0)}
            format="currency"
            prefix="KES"
            hint="For % of revenue calculations"
          />
        </div>
      </div>

      {/* Leakage summary */}
      {result.totalMonthlyLeakage > 0 && (
        <AlertBanner
          type={result.status === 'Excellent' || result.status === 'Good' ? 'success' : result.status === 'Fair' ? 'warning' : 'error'}
          title={`${result.status} — ${formatKES(result.annualLeakageAmount, true)}/year in optional expenses`}
          message={`${formatKES(result.totalMonthlyLeakage, true)}/month optional (${formatPct(result.leakagePercentOfRevenue)} of revenue). Eliminating leaks would immediately improve profit.`}
        />
      )}

      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Monthly Leakage"
          value={formatKES(result.totalMonthlyLeakage, true)}
          subtitle="Optional expenses"
          icon="🚨"
          status={result.totalMonthlyLeakage > 20_000 ? 'error' : result.totalMonthlyLeakage > 5_000 ? 'warning' : 'success'}
        />
        <MetricCard
          label="Annual Leakage"
          value={formatKES(result.annualLeakageAmount, true)}
          subtitle="If not addressed"
          icon="📅"
          status={metricStatus}
        />
        <MetricCard
          label="Leakage Score"
          value={`${result.leakageScore}/100`}
          subtitle={result.status}
          icon="📊"
          status={metricStatus}
        />
        <MetricCard
          label="Leakage % Revenue"
          value={formatPct(result.leakagePercentOfRevenue)}
          subtitle="Target: < 5%"
          icon="📉"
          status={result.leakagePercentOfRevenue < 5 ? 'success' : result.leakagePercentOfRevenue < 10 ? 'warning' : 'error'}
        />
      </ResultCardsGrid>

      {/* Expense table */}
      <CompactHeader title="Expense Audit" />
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Expense</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Monthly (KES)</th>
              <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400">Necessity</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Annual</th>
              <th className="px-3 py-2"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {expenses.map(expense => (
              <tr key={expense.id} className={[
                'bg-white dark:bg-gray-900',
                expense.necessity === 'optional' ? 'bg-red-50/30 dark:bg-red-900/5' : '',
              ].join(' ')}>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    value={expense.name}
                    onChange={e => updateExpense(expense.id, 'name', e.target.value)}
                    className="w-full bg-transparent text-gray-700 dark:text-gray-300 border-none outline-none focus:bg-white dark:focus:bg-gray-800 rounded px-1 py-0.5 text-sm"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    value={expense.monthlyAmount}
                    onChange={e => updateExpense(expense.id, 'monthlyAmount', parseFloat(e.target.value) || 0)}
                    className="w-28 bg-transparent text-right text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                  />
                </td>
                <td className="px-3 py-2 text-center">
                  <select
                    value={expense.necessity}
                    onChange={e => updateExpense(expense.id, 'necessity', e.target.value as Necessity)}
                    className={`text-xs font-medium px-2 py-1 rounded-full border-none cursor-pointer ${NECESSITY_BADGE[expense.necessity]}`}
                  >
                    {NECESSITIES.map(n => (
                      <option key={n} value={n}>{NECESSITY_LABELS[n]}</option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-right text-gray-600 dark:text-gray-400">
                  {formatKES(expense.monthlyAmount * 12, true)}
                </td>
                <td className="px-3 py-2 text-center">
                  <button
                    onClick={() => removeExpense(expense.id)}
                    className="text-gray-400 hover:text-red-500 dark:hover:text-red-400 text-xs"
                    aria-label="Remove"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-gray-800 font-semibold border-t-2 border-gray-200 dark:border-gray-700">
              <td className="px-3 py-2 text-sm text-gray-900 dark:text-white">Total</td>
              <td className="px-3 py-2 text-right text-sm text-gray-900 dark:text-white">
                {result.totalMonthlyExpenses.toLocaleString()}
              </td>
              <td className="px-3 py-2" />
              <td className="px-3 py-2 text-right text-sm text-gray-900 dark:text-white">
                {formatKES(result.totalMonthlyExpenses * 12, true)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Category summary */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Required', amount: result.totalMonthlyRequired, color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10', textColor: 'text-green-700 dark:text-green-300' },
          { label: 'Useful (Review)', amount: result.totalMonthlyUseful, color: 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10', textColor: 'text-yellow-700 dark:text-yellow-300' },
          { label: 'Optional (Leakage)', amount: result.totalMonthlyOptional, color: 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10', textColor: 'text-red-700 dark:text-red-300' },
        ].map(cat => (
          <div key={cat.label} className={`rounded-lg border p-3 ${cat.color}`}>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">{cat.label}</p>
            <p className={`text-lg font-bold mt-1 ${cat.textColor}`}>{formatKES(cat.amount, true)}/mo</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{formatKES(cat.amount * 12, true)}/yr</p>
          </div>
        ))}
      </div>

      <ResultDisplay
        title="Top Leaks & Recommendations"
        status={metricStatus}
        sections={[
          ...(result.topLeaks.length > 0 ? [{
            title: 'Top Optional Expenses',
            rows: result.topLeaks.slice(0, 5).map(leak => ({
              label: leak.name,
              value: `${formatKES(leak.monthlyAmount)}/mo = ${formatKES(leak.annualAmount, true)}/yr`,
              status: 'error' as const,
            })),
          }] : []),
          {
            title: 'Actions',
            rows: result.recommendations.map((rec, i) => ({ label: `${i + 1}.`, value: rec })),
          },
        ]}
      />
    </OpsLayout>
  )
}
