/** Cash Timeline visual — shows the CCC cash-locked period */
interface CashTimelineProps {
  wipDays: number
  receivablesDays: number
  payablesDays: number
  className?: string
}

export function CashTimeline({ wipDays, receivablesDays, payablesDays, className = '' }: CashTimelineProps) {
  const ccc = wipDays + receivablesDays - payablesDays
  const totalSpan = Math.max(wipDays + receivablesDays, payablesDays, 1)

  // Scale all values to % of total span
  const pct = (days: number) => Math.min(100, (days / (totalSpan * 1.1)) * 100)

  const wipEnd = pct(wipDays)
  const invoiceEnd = pct(wipDays + receivablesDays)
  const payEnd = pct(payablesDays)

  return (
    <div className={['space-y-4', className].join(' ')}>
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
        Cash Conversion Timeline
      </p>

      {/* Timeline bars */}
      <div className="space-y-3">
        {/* WIP bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>WIP (Days before invoicing)</span>
            <span className="font-medium">{wipDays} days</span>
          </div>
          <div className="relative w-full h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-blue-400 dark:bg-blue-600 rounded-full flex items-center pl-2"
              style={{ width: `${wipEnd}%` }}
            >
              <span className="text-xs text-white font-medium whitespace-nowrap">Day 0 → Invoice</span>
            </div>
          </div>
        </div>

        {/* Receivables bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Receivables (Days to collect)</span>
            <span className="font-medium">{receivablesDays} days</span>
          </div>
          <div className="relative w-full h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute top-0 h-full bg-orange-400 dark:bg-orange-600 rounded-full"
              style={{ left: `${wipEnd}%`, width: `${invoiceEnd - wipEnd}%` }}
            />
            <div className="absolute left-0 top-0 h-full flex items-center pl-2">
              <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">Invoice day {wipDays} → Paid day {wipDays + receivablesDays}</span>
            </div>
          </div>
        </div>

        {/* Payables bar */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
            <span>Payables (Days to pay suppliers)</span>
            <span className="font-medium">{payablesDays} days</span>
          </div>
          <div className="relative w-full h-6 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full bg-green-400 dark:bg-green-600 rounded-full flex items-center pl-2"
              style={{ width: `${payEnd}%` }}
            >
              <span className="text-xs text-white font-medium whitespace-nowrap">Pay day {payablesDays}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className={[
        'rounded-lg p-3 border text-sm',
        ccc <= 45
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
          : ccc <= 90
            ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
      ].join(' ')}>
        <span className="font-semibold">Cash Conversion Cycle: </span>
        {wipDays}d WIP + {receivablesDays}d Receivables − {payablesDays}d Payables = <strong>{ccc} days</strong>
        {ccc > 45 && <span className="ml-1 text-xs opacity-75">(target: 45 days)</span>}
      </div>

      {/* Day markers */}
      <div className="flex gap-4 flex-wrap text-xs">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-400 dark:bg-blue-600 inline-block shrink-0" />
          WIP (cash out, no invoice yet)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-orange-400 dark:bg-orange-600 inline-block shrink-0" />
          Receivables (invoice sent, waiting for cash)
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-green-400 dark:bg-green-600 inline-block shrink-0" />
          Payables (buffer — cash stays in your account)
        </span>
      </div>
    </div>
  )
}
