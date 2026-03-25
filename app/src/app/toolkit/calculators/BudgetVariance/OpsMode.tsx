import { useState, useMemo } from 'react'
import { OpsLayout, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { calculateBudgetVariance, DEFAULT_LINES, type BudgetLine, type BudgetCategory } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const CATEGORIES: BudgetCategory[] = ['Revenue', 'COGS', 'Opex', 'Capex']

const STATUS_BADGE = {
  'On Budget':   'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  'Favorable':   'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  'Under Budget':'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  'Over Budget': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
  'Unfavorable': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
}

let nextId = 100

export default function BudgetVarianceOps() {
  const [lines, setLines] = useState<BudgetLine[]>(DEFAULT_LINES)
  const [activeCategory, setActiveCategory] = useState<BudgetCategory | 'All'>('All')

  const summary = useMemo(() => calculateBudgetVariance(lines), [lines])
  const filtered = activeCategory === 'All'
    ? summary.lines
    : summary.lines.filter(l => l.category === activeCategory)

  function updateLine<K extends keyof BudgetLine>(id: string, field: K, value: BudgetLine[K]) {
    setLines(ls => ls.map(l => l.id === id ? { ...l, [field]: value } : l))
  }

  function removeLine(id: string) {
    setLines(ls => ls.filter(l => l.id !== id))
  }

  function addLine() {
    const id = String(nextId++)
    setLines(ls => [...ls, { id, name: 'New Line', category: 'Opex', budget: 0, actual: 0, higherIsBetter: false }])
  }

  const overBudget = summary.lines.filter(l => l.status === 'Over Budget' || l.status === 'Unfavorable')

  return (
    <OpsLayout
      title="Budget Variance"
      subtitle="Plan vs actual tracking"
      toolbar={
        <ActionBar actions={[
          { label: 'Add Line', onClick: addLine, variant: 'primary', icon: '+' },
          { label: 'Reset', onClick: () => setLines(DEFAULT_LINES), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {overBudget.length > 0 && (
        <AlertBanner
          type="error"
          title={`${overBudget.length} line${overBudget.length > 1 ? 's' : ''} over budget`}
          message={overBudget.map(l => `${l.name} (+${formatPct(l.variancePct, 0)} / ${formatKES(l.variance, true)} over)`).join(' | ')}
        />
      )}

      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Net Profit"
          value={formatKES(summary.netActualProfit, true)}
          subtitle={`Budget: ${formatKES(summary.netBudgetProfit, true)}`}
          icon="💰"
          status={summary.profitVariance >= 0 ? 'success' : 'error'}
        />
        <MetricCard
          label="Profit Variance"
          value={`${summary.profitVariance >= 0 ? '+' : ''}${formatKES(summary.profitVariance, true)}`}
          subtitle="Actual vs budgeted profit"
          icon="📊"
          status={summary.profitVariance >= 0 ? 'success' : 'error'}
        />
        <MetricCard
          label="On Budget"
          value={summary.onBudget}
          subtitle={`of ${summary.lines.length} lines`}
          icon="✅"
          status={summary.onBudget === summary.lines.length ? 'success' : 'warning'}
        />
        <MetricCard
          label="Over Budget / Unfavorable"
          value={summary.unfavorable}
          subtitle="Lines needing attention"
          icon="⚠️"
          status={summary.unfavorable > 0 ? 'error' : 'success'}
        />
      </ResultCardsGrid>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['All', ...CATEGORIES] as const).map(cat => {
          const catData = cat !== 'All' ? summary.byCategory[cat] : null
          const catVariancePct = catData && catData.budget !== 0
            ? (catData.variance / catData.budget) * 100 : 0
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={[
                'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                activeCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              ].join(' ')}
            >
              {cat}
              {catData && (
                <span className={`ml-1 opacity-70 ${catVariancePct > 5 ? 'text-red-400' : catVariancePct < -5 ? 'text-blue-400' : ''}`}>
                  ({catVariancePct >= 0 ? '+' : ''}{formatPct(catVariancePct, 0)})
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Variance table */}
      <CompactHeader title={`${activeCategory} Lines (${filtered.length})`} />
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[680px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {['Name', 'Category', 'Budget', 'Actual', 'Variance', 'Var %', 'Status', ''].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(res => {
              const line = lines.find(l => l.id === res.id)!
              const isPositive = res.status === 'Favorable' || res.status === 'Under Budget'
              const isNegative = res.status === 'Over Budget' || res.status === 'Unfavorable'
              const varClass = isPositive
                ? 'text-blue-700 dark:text-blue-300'
                : isNegative
                  ? 'text-red-700 dark:text-red-300'
                  : 'text-gray-700 dark:text-gray-300'

              return (
                <tr key={res.id} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={line.name}
                      onChange={e => updateLine(line.id, 'name', e.target.value)}
                      className="w-36 bg-transparent text-gray-900 dark:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded px-1 py-0.5 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={line.category}
                      onChange={e => updateLine(line.id, 'category', e.target.value as BudgetCategory)}
                      className="text-xs bg-transparent text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={line.budget}
                      onChange={e => updateLine(line.id, 'budget', parseFloat(e.target.value) || 0)}
                      className="w-24 text-right bg-transparent text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={line.actual}
                      onChange={e => updateLine(line.id, 'actual', parseFloat(e.target.value) || 0)}
                      className="w-24 text-right bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none"
                    />
                  </td>
                  <td className={`px-3 py-2 text-xs font-medium ${varClass}`}>
                    {res.variance >= 0 ? '+' : ''}{formatKES(res.variance, true)}
                  </td>
                  <td className={`px-3 py-2 text-xs font-medium ${varClass}`}>
                    {res.variancePct >= 0 ? '+' : ''}{formatPct(res.variancePct, 1)}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[res.status]}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeLine(line.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Category summary cards */}
      <CompactHeader title="By Category" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(cat => {
          const data = summary.byCategory[cat]
          const pct = data.budget !== 0 ? (data.variance / data.budget) * 100 : 0
          const isRevenue = cat === 'Revenue'
          const isFavorable = isRevenue ? pct > 0 : pct < 0
          return (
            <MetricCard
              key={cat}
              label={cat}
              value={`${pct >= 0 ? '+' : ''}${formatPct(pct, 1)}`}
              subtitle={`${formatKES(data.actual, true)} actual`}
              icon={cat === 'Revenue' ? '📈' : cat === 'COGS' ? '🏭' : cat === 'Opex' ? '⚙️' : '🏗️'}
              status={isFavorable ? 'success' : Math.abs(pct) <= 5 ? 'neutral' : 'error'}
            />
          )
        })}
      </div>
    </OpsLayout>
  )
}
