import { useState, useMemo } from 'react'
import { OpsLayout, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { calculateKPIs, DEFAULT_KPIS, type KPIItem, type KPICategory } from './shared'
import { formatPct } from '../../utils/format'

const CATEGORIES: KPICategory[] = ['Financial', 'Operational', 'Customer', 'Growth']

const STATUS_BADGE = {
  'On Track': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  'At Risk':  'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  'Off Track':'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
}
const STATUS_METRIC = { 'On Track': 'success' as const, 'At Risk': 'warning' as const, 'Off Track': 'error' as const }

const TREND_ICON = { Up: '↑', Down: '↓', Flat: '→' }
const TREND_COLOR = { Up: 'text-green-600 dark:text-green-400', Down: 'text-red-600 dark:text-red-400', Flat: 'text-gray-400' }

let nextId = 100

export default function OperationsKPIsOps() {
  const [kpis, setKPIs] = useState<KPIItem[]>(DEFAULT_KPIS)
  const [activeCategory, setActiveCategory] = useState<KPICategory | 'All'>('All')

  const summary = useMemo(() => calculateKPIs(kpis), [kpis])
  const filtered = activeCategory === 'All'
    ? summary.kpis
    : summary.kpis.filter(k => k.category === activeCategory)

  function updateKPI<K extends keyof KPIItem>(id: string, field: K, value: KPIItem[K]) {
    setKPIs(ks => ks.map(k => k.id === id ? { ...k, [field]: value } : k))
  }

  function removeKPI(id: string) {
    setKPIs(ks => ks.filter(k => k.id !== id))
  }

  function addKPI() {
    const id = String(nextId++)
    setKPIs(ks => [...ks, {
      id,
      name: 'New KPI',
      category: 'Financial',
      actual: 0,
      target: 100,
      unit: '%',
      frequency: 'Monthly',
      higherIsBetter: true,
    }])
  }

  const offTrackKPIs = summary.kpis.filter(k => k.status === 'Off Track')

  return (
    <OpsLayout
      title="Operations KPIs"
      subtitle="Track actual vs target performance"
      toolbar={
        <ActionBar actions={[
          { label: 'Add KPI', onClick: addKPI, variant: 'primary', icon: '+' },
          { label: 'Reset', onClick: () => setKPIs(DEFAULT_KPIS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {offTrackKPIs.length > 0 && (
        <AlertBanner
          type="error"
          title={`${offTrackKPIs.length} KPI${offTrackKPIs.length > 1 ? 's' : ''} off track — immediate attention required`}
          message={offTrackKPIs.map(k => `${k.name} (${formatPct(k.variancePct, 0)} vs target)`).join(' | ')}
        />
      )}

      {/* Summary */}
      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Overall Score"
          value={`${formatPct(summary.overallScore, 0)} on track`}
          subtitle={`${summary.totalKPIs} KPIs tracked`}
          icon="🎯"
          status={summary.overallScore >= 80 ? 'success' : summary.overallScore >= 60 ? 'warning' : 'error'}
        />
        <MetricCard label="On Track" value={summary.onTrack} icon="✅" status="success" />
        <MetricCard label="At Risk" value={summary.atRisk} icon="⚠️" status={summary.atRisk > 0 ? 'warning' : 'success'} />
        <MetricCard label="Off Track" value={summary.offTrack} icon="❌" status={summary.offTrack > 0 ? 'error' : 'success'} />
      </ResultCardsGrid>

      {/* Category filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['All', ...CATEGORIES] as const).map(cat => (
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
            {cat !== 'All' && (
              <span className="ml-1 opacity-70">
                ({summary.byCategory[cat]?.onTrack ?? 0}/{summary.byCategory[cat]?.total ?? 0})
              </span>
            )}
          </button>
        ))}
      </div>

      {/* KPI table */}
      <CompactHeader title={`${activeCategory} KPIs (${filtered.length})`} />
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {['KPI', 'Category', 'Actual', 'Target', 'Unit', 'Variance', 'Trend', 'Status', ''].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(res => {
              const kpi = kpis.find(k => k.id === res.id)!
              const varianceClass = res.status === 'On Track'
                ? 'text-green-700 dark:text-green-300'
                : res.status === 'At Risk'
                  ? 'text-yellow-700 dark:text-yellow-300'
                  : 'text-red-700 dark:text-red-300'
              return (
                <tr key={res.id} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={kpi.name}
                      onChange={e => updateKPI(kpi.id, 'name', e.target.value)}
                      className="w-36 bg-transparent text-gray-900 dark:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded px-1 py-0.5 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={kpi.category}
                      onChange={e => updateKPI(kpi.id, 'category', e.target.value as KPICategory)}
                      className="text-xs bg-transparent text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={kpi.actual}
                      onChange={e => updateKPI(kpi.id, 'actual', parseFloat(e.target.value) || 0)}
                      className="w-20 text-right bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={kpi.target}
                      onChange={e => updateKPI(kpi.id, 'target', parseFloat(e.target.value) || 0)}
                      className="w-20 text-right bg-transparent text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">{kpi.unit}</td>
                  <td className={`px-3 py-2 text-xs font-medium ${varianceClass}`}>
                    {res.variancePct >= 0 ? '+' : ''}{formatPct(res.variancePct, 1)}
                  </td>
                  <td className="px-3 py-2">
                    {res.trend && (
                      <span className={`text-sm font-bold ${TREND_COLOR[res.trend]}`}>
                        {TREND_ICON[res.trend]}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_BADGE[res.status]}`}>
                      {res.status}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeKPI(kpi.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Category score cards */}
      <CompactHeader title="By Category" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CATEGORIES.map(cat => {
          const data = summary.byCategory[cat]
          const pct = data.total > 0 ? (data.onTrack / data.total) * 100 : 0
          return (
            <MetricCard
              key={cat}
              label={cat}
              value={`${data.onTrack}/${data.total}`}
              subtitle={`${formatPct(pct, 0)} on track`}
              icon={cat === 'Financial' ? '💵' : cat === 'Operational' ? '⚙️' : cat === 'Customer' ? '⭐' : '📈'}
              status={STATUS_METRIC[data.onTrack === data.total ? 'On Track' : data.onTrack >= data.total * 0.6 ? 'At Risk' : 'Off Track']}
            />
          )
        })}
      </div>
    </OpsLayout>
  )
}
