import { useState, useMemo } from 'react'
import { OpsLayout, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { calculateWeeklyReview, DEFAULT_INPUTS, type WeeklyReviewInputs, type ActionItem, type ActionStatus, type Priority } from './shared'
import { formatPct } from '../../utils/format'
const STATUSES: ActionStatus[] = ['Not Started', 'In Progress', 'Blocked', 'Done']
const PRIORITIES: Priority[] = ['High', 'Medium', 'Low']

let nextActionId = 100
let nextKpiId = 100

export default function WeeklyReviewOps() {
  const [inputs, setInputs] = useState<WeeklyReviewInputs>(DEFAULT_INPUTS)
  const result = useMemo(() => calculateWeeklyReview(inputs), [inputs])

  function set<K extends keyof WeeklyReviewInputs>(field: K, value: WeeklyReviewInputs[K]) {
    setInputs(s => ({ ...s, [field]: value }))
  }

  function updateKPI(id: string, field: string, value: string | number) {
    set('kpis', inputs.kpis.map(k => k.id === id ? { ...k, [field]: value } : k))
  }

  function updateAction(list: 'lastWeekActions' | 'thisWeekPriorities', id: string, field: string, value: string) {
    set(list, inputs[list].map((a: ActionItem) => a.id === id ? { ...a, [field]: value } : a))
  }

  function removeAction(list: 'lastWeekActions' | 'thisWeekPriorities', id: string) {
    set(list, inputs[list].filter((a: ActionItem) => a.id !== id))
  }

  function addAction(list: 'lastWeekActions' | 'thisWeekPriorities') {
    const id = String(nextActionId++)
    const newAction: ActionItem = { id, text: 'New action', owner: '', priority: 'Medium', status: 'Not Started' }
    set(list, [...inputs[list], newAction])
  }

  function addKPI() {
    const id = String(nextKpiId++)
    set('kpis', [...inputs.kpis, { id, name: 'New KPI', target: 0, actual: 0, unit: '' }])
  }

  return (
    <OpsLayout
      title="Weekly Review"
      subtitle={inputs.weekLabel}
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULT_INPUTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {/* Score summary */}
      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Overall Score"
          value={`${result.overallScore}%`}
          subtitle={result.healthLabel}
          icon="🏆"
          status={result.overallScore >= 80 ? 'success' : result.overallScore >= 60 ? 'warning' : 'error'}
        />
        <MetricCard
          label="KPIs On Track"
          value={`${result.kpisOnTrack}/${result.kpisTotal}`}
          subtitle={`${formatPct(result.kpiScore, 0)} on target`}
          icon="🎯"
          status={result.kpiScore >= 80 ? 'success' : result.kpiScore >= 60 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Actions Done"
          value={`${result.actionsCompleted}/${result.actionsTotal}`}
          subtitle={`${formatPct(result.completionRate, 0)} completion`}
          icon="✅"
          status={result.completionRate >= 80 ? 'success' : result.completionRate >= 60 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Week"
          value={new Date().toLocaleDateString('en-KE', { month: 'short', day: 'numeric' })}
          subtitle="Weekly check-in"
          icon="📅"
          status="neutral"
        />
      </ResultCardsGrid>

      {/* Wins & Challenges */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide">🏆 Wins this week</label>
          <textarea
            value={inputs.wins}
            onChange={e => set('wins', e.target.value)}
            rows={3}
            placeholder="What went well?"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-red-600 dark:text-red-400 uppercase tracking-wide">⚠️ Challenges</label>
          <textarea
            value={inputs.challenges}
            onChange={e => set('challenges', e.target.value)}
            rows={3}
            placeholder="What was hard or blocked?"
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
          />
        </div>
      </div>

      {/* KPI tracker */}
      <CompactHeader
        title="KPI Tracker"
        actions={<button onClick={addKPI} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">+ Add KPI</button>}
      />
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[540px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {['KPI', 'Target', 'Actual', 'Unit', 'Vs Target', ''].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {inputs.kpis.map(kpi => {
              const pct = kpi.target > 0 ? (kpi.actual / kpi.target) * 100 : 100
              const onTrack = pct >= 90
              return (
                <tr key={kpi.id} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={kpi.name}
                      onChange={e => updateKPI(kpi.id, 'name', e.target.value)}
                      className="w-32 bg-transparent text-gray-900 dark:text-white border border-transparent hover:border-gray-200 rounded px-1 py-0.5 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={kpi.target}
                      onChange={e => updateKPI(kpi.id, 'target', parseFloat(e.target.value) || 0)}
                      className="w-24 text-right bg-transparent text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={kpi.actual}
                      onChange={e => updateKPI(kpi.id, 'actual', parseFloat(e.target.value) || 0)}
                      className="w-24 text-right bg-transparent text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={kpi.unit}
                      onChange={e => updateKPI(kpi.id, 'unit', e.target.value)}
                      className="w-14 bg-transparent text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 rounded px-1 py-0.5 text-xs focus:outline-none"
                    />
                  </td>
                  <td className={`px-3 py-2 text-xs font-bold ${onTrack ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                    {formatPct(pct, 0)}
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => set('kpis', inputs.kpis.filter(k => k.id !== kpi.id))} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Last week actions */}
      <CompactHeader
        title="Last Week — Actions"
        actions={<button onClick={() => addAction('lastWeekActions')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">+ Add</button>}
      />
      <ActionTable
        items={inputs.lastWeekActions}
        onUpdate={(id, field, val) => updateAction('lastWeekActions', id, field, val)}
        onRemove={id => removeAction('lastWeekActions', id)}
        showStatus
      />

      {/* This week priorities */}
      <CompactHeader
        title="This Week — Priorities"
        actions={<button onClick={() => addAction('thisWeekPriorities')} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">+ Add</button>}
      />
      <ActionTable
        items={inputs.thisWeekPriorities}
        onUpdate={(id, field, val) => updateAction('thisWeekPriorities', id, field, val)}
        onRemove={id => removeAction('thisWeekPriorities', id)}
        showStatus={false}
      />
    </OpsLayout>
  )
}

function ActionTable({
  items,
  onUpdate,
  onRemove,
  showStatus,
}: {
  items: ActionItem[]
  onUpdate: (id: string, field: string, val: string) => void
  onRemove: (id: string) => void
  showStatus: boolean
}) {
  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
      <table className="w-full text-sm min-w-[500px]">
        <thead>
          <tr className="bg-gray-50 dark:bg-gray-800">
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Action</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Owner</th>
            <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Priority</th>
            {showStatus && <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Status</th>}
            <th className="px-3 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {items.map(item => (
            <tr key={item.id} className="bg-white dark:bg-gray-900">
              <td className="px-3 py-2">
                <input
                  type="text"
                  value={item.text}
                  onChange={e => onUpdate(item.id, 'text', e.target.value)}
                  className="w-full min-w-[160px] bg-transparent text-gray-900 dark:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded px-1 py-0.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </td>
              <td className="px-3 py-2">
                <input
                  type="text"
                  value={item.owner}
                  onChange={e => onUpdate(item.id, 'owner', e.target.value)}
                  className="w-20 bg-transparent text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 rounded px-1 py-0.5 text-xs focus:outline-none"
                />
              </td>
              <td className="px-3 py-2">
                <select
                  value={item.priority}
                  onChange={e => onUpdate(item.id, 'priority', e.target.value)}
                  className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 text-gray-600 dark:text-gray-400"
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </td>
              {showStatus && (
                <td className="px-3 py-2">
                  <select
                    value={item.status}
                    onChange={e => onUpdate(item.id, 'status', e.target.value)}
                    className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 text-gray-600 dark:text-gray-400"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              )}
              <td className="px-3 py-2">
                <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
