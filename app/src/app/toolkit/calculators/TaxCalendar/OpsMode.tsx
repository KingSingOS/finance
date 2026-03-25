import { useState, useMemo } from 'react'
import { OpsLayout, ResultCardsGrid, ActionBar } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { calculateTaxCalendar, MONTH_NAMES, type TaxDeadline } from './shared'

const today = new Date()

const STATUS_CONFIG = {
  upcoming: {
    badge: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    row: 'bg-white dark:bg-gray-900',
    dot: 'bg-green-500',
    label: 'Upcoming',
  },
  'due-soon': {
    badge: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
    row: 'bg-yellow-50/30 dark:bg-yellow-900/5',
    dot: 'bg-yellow-500',
    label: 'Due Soon',
  },
  overdue: {
    badge: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
    row: 'bg-red-50/30 dark:bg-red-900/5',
    dot: 'bg-red-500',
    label: 'Overdue',
  },
}

function DeadlineRow({ d }: { d: TaxDeadline }) {
  const sc = STATUS_CONFIG[d.status]
  const absDay = Math.abs(d.daysUntil)
  const dayLabel = d.daysUntil < 0 ? `${absDay} days ago` : d.daysUntil === 0 ? 'TODAY' : `${d.daysUntil} days`
  return (
    <tr className={sc.row}>
      <td className="px-3 py-2.5">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
          <span className="font-medium text-gray-900 dark:text-white text-sm">{d.tax}</span>
        </div>
      </td>
      <td className="px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400">{d.description}</td>
      <td className="px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400">
        {d.date.getDate()}/{d.date.getMonth() + 1}/{d.date.getFullYear()}
      </td>
      <td className="px-3 py-2.5 text-right">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sc.badge}`}>{dayLabel}</span>
      </td>
    </tr>
  )
}

export default function TaxCalendarOps() {
  const [month, setMonth] = useState(today.getMonth() + 1)
  const [year,  setYear]  = useState(today.getFullYear())

  const result = useMemo(() => calculateTaxCalendar({ year, month }), [year, month])

  function prevMonth() { if (month === 1) { setMonth(12); setYear(y => y - 1) } else setMonth(m => m - 1) }
  function nextMonth() { if (month === 12) { setMonth(1); setYear(y => y + 1) } else setMonth(m => m + 1) }

  return (
    <OpsLayout
      title="KRA Tax Calendar"
      subtitle={result.monthLabel}
      toolbar={
        <ActionBar actions={[
          { label: '◀ Prev', onClick: prevMonth, variant: 'secondary' },
          { label: 'Next ▶', onClick: nextMonth, variant: 'secondary' },
        ]} />
      }
    >
      {/* Overdue alerts */}
      {result.overdueDeadlines.length > 0 && (
        <AlertBanner
          type="error"
          title={`${result.overdueDeadlines.length} OVERDUE tax obligation${result.overdueDeadlines.length > 1 ? 's' : ''} — file immediately to stop penalties`}
          message={result.overdueDeadlines.map(d => `${d.tax}: ${d.description} (${Math.abs(d.daysUntil)} days overdue)`).join(' | ')}
        />
      )}
      {result.dueSoonDeadlines.length > 0 && result.overdueDeadlines.length === 0 && (
        <AlertBanner
          type="warning"
          title={`${result.dueSoonDeadlines.length} deadline${result.dueSoonDeadlines.length > 1 ? 's' : ''} due within 7 days`}
          message={result.dueSoonDeadlines.map(d => `${d.tax} due ${d.daysUntil === 0 ? 'TODAY' : `in ${d.daysUntil} days`}`).join(' | ')}
        />
      )}
      {result.overdueDeadlines.length === 0 && result.dueSoonDeadlines.length === 0 && (
        <AlertBanner type="success" title="All clear — no overdue or due-soon obligations this month" message="Next deadline in more than 7 days. Stay on schedule." />
      )}

      {/* Summary KPIs */}
      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Total Deadlines"
          value={result.allDeadlines.length}
          subtitle={result.monthLabel}
          icon="📅"
          status="neutral"
        />
        <MetricCard
          label="Upcoming"
          value={result.upcomingDeadlines.length}
          subtitle="More than 7 days away"
          icon="🟢"
          status="success"
        />
        <MetricCard
          label="Due Soon"
          value={result.dueSoonDeadlines.length}
          subtitle="Within 7 days"
          icon="🟡"
          status={result.dueSoonDeadlines.length > 0 ? 'warning' : 'success'}
        />
        <MetricCard
          label="Overdue"
          value={result.overdueDeadlines.length}
          subtitle="File immediately"
          icon="🔴"
          status={result.overdueDeadlines.length > 0 ? 'error' : 'success'}
        />
      </ResultCardsGrid>

      {/* Next deadline highlight */}
      {result.nextDeadline && (
        <div className="rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 p-4 flex items-center gap-4">
          <div className="text-3xl">⏰</div>
          <div className="flex-1">
            <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Next Deadline</p>
            <p className="text-base font-bold text-gray-900 dark:text-white">{result.nextDeadline.tax}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">{result.nextDeadline.description}</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-2xl font-black text-blue-700 dark:text-blue-300">
              {result.nextDeadline.daysUntil === 0 ? 'TODAY' : `${result.nextDeadline.daysUntil}d`}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {result.nextDeadline.date.getDate()}/{result.nextDeadline.date.getMonth() + 1}/{result.nextDeadline.date.getFullYear()}
            </p>
          </div>
        </div>
      )}

      {/* Full deadlines table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Tax</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Description</th>
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400">Due Date</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {result.allDeadlines.map((d, i) => <DeadlineRow key={i} d={d} />)}
          </tbody>
        </table>
      </div>

      {/* Month navigation quick bar */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {MONTH_NAMES.map((name, i) => {
          const m = i + 1
          const isSelected = m === month
          return (
            <button
              key={name}
              onClick={() => setMonth(m)}
              className={[
                'px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-colors',
                isSelected
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
              ].join(' ')}
            >
              {name.slice(0, 3)}
            </button>
          )
        })}
      </div>
    </OpsLayout>
  )
}
