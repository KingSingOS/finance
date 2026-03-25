import { useState, useMemo } from 'react'
import { OpsLayout, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { calculateActionSummary, DEFAULT_ACTIONS, type Action, type ActionStatus, type ActionPriority, type ActionCategory } from './shared'
import { formatPct } from '../../utils/format'

const STATUSES: ActionStatus[]  = ['To Do', 'In Progress', 'Done', 'Blocked']
const PRIORITIES: ActionPriority[] = ['Critical', 'High', 'Medium', 'Low']
const CATEGORIES: ActionCategory[] = ['Revenue', 'Operations', 'Finance', 'HR', 'Product', 'Marketing', 'Other']

const PRIORITY_BADGE: Record<ActionPriority, string> = {
  Critical:'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  High:    'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  Medium:  'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  Low:     'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
}


let nextId = 100

export default function ActionPlansOps() {
  const [actions, setActions] = useState<Action[]>(DEFAULT_ACTIONS)
  const [filterStatus,   setFilterStatus]   = useState<ActionStatus | 'All'>('All')
  const [filterPriority, setFilterPriority] = useState<ActionPriority | 'All'>('All')

  const summary = useMemo(() => calculateActionSummary(actions), [actions])

  const filtered = actions.filter(a =>
    (filterStatus   === 'All' || a.status   === filterStatus) &&
    (filterPriority === 'All' || a.priority === filterPriority)
  )

  function updateAction<K extends keyof Action>(id: string, field: K, value: Action[K]) {
    setActions(as => as.map(a => a.id === id ? { ...a, [field]: value } : a))
  }

  function removeAction(id: string) {
    setActions(as => as.filter(a => a.id !== id))
  }

  function addAction() {
    const id = String(nextId++)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)
    setActions(as => [...as, {
      id,
      title: 'New Action',
      description: '',
      owner: '',
      priority: 'Medium',
      category: 'Other',
      status: 'To Do',
      dueDate: dueDate.toISOString().slice(0, 10),
    }])
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  function isOverdue(a: Action) {
    return a.status !== 'Done' && a.dueDate && new Date(a.dueDate + 'T00:00') < today
  }

  return (
    <OpsLayout
      title="Action Plans"
      subtitle="Prioritised actions & accountability tracker"
      toolbar={
        <ActionBar actions={[
          { label: 'Add Action', onClick: addAction, variant: 'primary', icon: '+' },
          { label: 'Reset', onClick: () => setActions(DEFAULT_ACTIONS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {summary.criticalOpen > 0 && (
        <AlertBanner
          type="error"
          title={`${summary.criticalOpen} Critical action${summary.criticalOpen > 1 ? 's' : ''} not yet done`}
          message={actions.filter(a => a.priority === 'Critical' && a.status !== 'Done').map(a => a.title).join(' | ')}
        />
      )}
      {summary.overdue > 0 && (
        <AlertBanner
          type="warning"
          title={`${summary.overdue} overdue action${summary.overdue > 1 ? 's' : ''}`}
          message={actions.filter(a => isOverdue(a)).map(a => `${a.title} (due ${a.dueDate})`).join(' | ')}
        />
      )}

      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Completion Rate"
          value={formatPct(summary.completionRate, 0)}
          subtitle={`${summary.done} of ${summary.total} done`}
          icon="✅"
          status={summary.completionRate >= 70 ? 'success' : summary.completionRate >= 40 ? 'warning' : 'error'}
        />
        <MetricCard
          label="In Progress"
          value={summary.inProgress}
          subtitle="Active items"
          icon="🔄"
          status="neutral"
        />
        <MetricCard
          label="Blocked"
          value={summary.blocked}
          subtitle="Need resolution"
          icon="🚧"
          status={summary.blocked > 0 ? 'error' : 'success'}
        />
        <MetricCard
          label="Due This Week"
          value={summary.dueThisWeek}
          subtitle={`${summary.overdue} overdue`}
          icon="⏰"
          status={summary.overdue > 0 ? 'error' : summary.dueThisWeek > 0 ? 'warning' : 'success'}
        />
      </ResultCardsGrid>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        <div className="flex gap-1 flex-wrap">
          {(['All', ...STATUSES] as const).map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={[
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                filterStatus === s
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              ].join(' ')}
            >{s}</button>
          ))}
        </div>
        <div className="flex gap-1 flex-wrap">
          {(['All', ...PRIORITIES] as const).map(p => (
            <button
              key={p}
              onClick={() => setFilterPriority(p)}
              className={[
                'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                filterPriority === p
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              ].join(' ')}
            >{p}</button>
          ))}
        </div>
      </div>

      {/* Actions table */}
      <CompactHeader title={`Actions (${filtered.length})`} />
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[740px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {['Action', 'Owner', 'Category', 'Priority', 'Status', 'Due', ''].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {filtered.map(action => {
              const overdue = isOverdue(action)
              return (
                <tr key={action.id} className={overdue && action.status !== 'Done' ? 'bg-red-50/30 dark:bg-red-900/5' : 'bg-white dark:bg-gray-900'}>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={action.title}
                      onChange={e => updateAction(action.id, 'title', e.target.value)}
                      className="w-44 bg-transparent text-gray-900 dark:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded px-1 py-0.5 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={action.owner}
                      onChange={e => updateAction(action.id, 'owner', e.target.value)}
                      className="w-20 bg-transparent text-gray-500 dark:text-gray-400 border border-transparent hover:border-gray-200 rounded px-1 py-0.5 text-xs focus:outline-none"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={action.category}
                      onChange={e => updateAction(action.id, 'category', e.target.value as ActionCategory)}
                      className="text-xs bg-transparent text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${PRIORITY_BADGE[action.priority]}`}>
                      {action.priority}
                    </span>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={action.status}
                      onChange={e => updateAction(action.id, 'status', e.target.value as ActionStatus)}
                      className="text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 text-gray-600 dark:text-gray-400"
                    >
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="date"
                      value={action.dueDate}
                      onChange={e => updateAction(action.id, 'dueDate', e.target.value)}
                      className={`text-xs bg-transparent border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 focus:outline-none ${overdue && action.status !== 'Done' ? 'text-red-600 dark:text-red-400 font-medium' : 'text-gray-600 dark:text-gray-400'}`}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeAction(action.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Priority progress */}
      <CompactHeader title="By Priority" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {PRIORITIES.map(p => {
          const data = summary.byPriority[p]
          const pct = data.total > 0 ? (data.done / data.total) * 100 : 100
          return (
            <MetricCard
              key={p}
              label={p}
              value={`${data.done}/${data.total}`}
              subtitle={`${formatPct(pct, 0)} complete`}
              icon={p === 'Critical' ? '🔴' : p === 'High' ? '🟠' : p === 'Medium' ? '🟡' : '🟢'}
              status={pct === 100 ? 'success' : pct >= 50 ? 'warning' : p === 'Critical' ? 'error' : 'neutral'}
            />
          )
        })}
      </div>
    </OpsLayout>
  )
}
