/** Power of One Compound Visual — shows 7 × 1% = 7.2% compound effect */

interface BarConfig {
  label: string
  icon: string
  pct: number  // improvement %
}

interface PowerOfOneCompoundProps {
  levers?: number[]  // improvement % per lever (length 7, default all 1)
  className?: string
}

const LEVER_LABELS = ['Price', 'Volume', 'COGS', 'Overhead', 'Receivables', 'WIP', 'Payables']
const LEVER_ICONS  = ['💰', '🎯', '📉', '✂️', '⚡', '📦', '🕐']
const LEVER_COLORS = [
  'bg-blue-500 dark:bg-blue-600',
  'bg-indigo-500 dark:bg-indigo-600',
  'bg-violet-500 dark:bg-violet-600',
  'bg-purple-500 dark:bg-purple-600',
  'bg-pink-500 dark:bg-pink-600',
  'bg-rose-500 dark:bg-rose-600',
  'bg-orange-500 dark:bg-orange-600',
]
const LEVER_TEXT = [
  'text-blue-700 dark:text-blue-300',
  'text-indigo-700 dark:text-indigo-300',
  'text-violet-700 dark:text-violet-300',
  'text-purple-700 dark:text-purple-300',
  'text-pink-700 dark:text-pink-300',
  'text-rose-700 dark:text-rose-300',
  'text-orange-700 dark:text-orange-300',
]

export function PowerOfOneCompound({ levers, className = '' }: PowerOfOneCompoundProps) {
  const pcts = levers ?? [1, 1, 1, 1, 1, 1, 1]

  // Compound multiplier for profit levers (first 4)
  const profitMultiplier = pcts.slice(0, 4).reduce((m, p) => m * (1 + p / 100), 1)
  const totalCompound = (profitMultiplier - 1) * 100

  const bars: BarConfig[] = pcts.map((p, i) => ({
    label: LEVER_LABELS[i],
    icon: LEVER_ICONS[i],
    pct: p,
  }))

  // Max bar height relative to max pct for scaling
  const maxPct = Math.max(...pcts, 1)

  return (
    <div className={['space-y-5', className].join(' ')}>
      <div className="flex items-end gap-2 h-28 px-2">
        {bars.map((bar, i) => {
          const heightPct = maxPct > 0 ? (bar.pct / (maxPct * 1.2)) * 100 : 0
          return (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-1">
              {/* Value label */}
              <span className={['text-xs font-bold', LEVER_TEXT[i]].join(' ')}>
                {bar.pct > 0 ? `+${bar.pct}%` : '0'}
              </span>
              {/* Bar */}
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t overflow-hidden" style={{ height: '64px' }}>
                <div
                  className={['w-full rounded-t transition-all duration-300', LEVER_COLORS[i]].join(' ')}
                  style={{ height: `${Math.max(4, heightPct)}%`, marginTop: `${100 - Math.max(4, heightPct)}%` }}
                />
              </div>
              {/* Icon + label */}
              <span className="text-base">{bar.icon}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">{bar.label}</span>
            </div>
          )
        })}

        {/* Arrow + combined result bar */}
        <div className="flex items-center self-center pb-8 shrink-0">
          <span className="text-gray-400 text-lg mx-1">→</span>
        </div>

        <div className="flex-1 flex flex-col items-center gap-1">
          <span className="text-xs font-bold text-green-700 dark:text-green-300">
            +{totalCompound.toFixed(1)}%
          </span>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-t overflow-hidden" style={{ height: '64px' }}>
            <div
              className="w-full rounded-t bg-green-500 dark:bg-green-600 transition-all duration-300"
              style={{ height: `${Math.min(100, (totalCompound / (maxPct * bars.length * 1.2)) * 100)}%`, minHeight: '8px', marginTop: `${100 - Math.min(100, Math.max(8, (totalCompound / (maxPct * bars.length * 1.2)) * 100))}%` }}
            />
          </div>
          <span className="text-base">✨</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 text-center leading-tight">Combined</span>
        </div>
      </div>

      {/* Formula row */}
      <div className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3">
        <div className="flex flex-wrap items-center gap-1 text-xs font-mono">
          {pcts.slice(0, 4).map((p, i) => (
            <span key={i}>
              <span className={LEVER_TEXT[i]}>(1.{String(p).padStart(2, '0')})</span>
              {i < 3 && <span className="text-gray-400 mx-0.5">×</span>}
            </span>
          ))}
          <span className="text-gray-400 mx-1">=</span>
          <span className="font-bold text-green-700 dark:text-green-300">
            {profitMultiplier.toFixed(4)} → +{totalCompound.toFixed(2)}%
          </span>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Compound effect on profit levers (Price × Volume × COGS × Overhead)
        </p>
      </div>
    </div>
  )
}
