interface HealthScoreProps {
  score: number // 0–100
  label?: string
  showBar?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

function getScoreConfig(score: number): {
  label: string
  color: string
  bg: string
  bar: string
  ring: string
} {
  if (score >= 80) return {
    label: 'Excellent',
    color: 'text-green-700 dark:text-green-300',
    bg: 'bg-green-50 dark:bg-green-900/30',
    bar: 'bg-green-500',
    ring: 'ring-green-200 dark:ring-green-800',
  }
  if (score >= 60) return {
    label: 'Good',
    color: 'text-blue-700 dark:text-blue-300',
    bg: 'bg-blue-50 dark:bg-blue-900/30',
    bar: 'bg-blue-500',
    ring: 'ring-blue-200 dark:ring-blue-800',
  }
  if (score >= 40) return {
    label: 'Fair',
    color: 'text-yellow-700 dark:text-yellow-300',
    bg: 'bg-yellow-50 dark:bg-yellow-900/30',
    bar: 'bg-yellow-500',
    ring: 'ring-yellow-200 dark:ring-yellow-800',
  }
  if (score >= 30) return {
    label: 'Poor',
    color: 'text-orange-700 dark:text-orange-300',
    bg: 'bg-orange-50 dark:bg-orange-900/30',
    bar: 'bg-orange-500',
    ring: 'ring-orange-200 dark:ring-orange-800',
  }
  return {
    label: 'Critical',
    color: 'text-red-700 dark:text-red-300',
    bg: 'bg-red-50 dark:bg-red-900/30',
    bar: 'bg-red-500',
    ring: 'ring-red-200 dark:ring-red-800',
  }
}

const sizeStyles = {
  sm: { score: 'text-xl', status: 'text-xs', padding: 'p-3', barH: 'h-1.5' },
  md: { score: 'text-3xl', status: 'text-sm', padding: 'p-4', barH: 'h-2' },
  lg: { score: 'text-5xl', status: 'text-base', padding: 'p-6', barH: 'h-3' },
}

export function HealthScore({ score, label, showBar = true, size = 'md', className = '' }: HealthScoreProps) {
  const clamped = Math.max(0, Math.min(100, Math.round(score)))
  const config = getScoreConfig(clamped)
  const sz = sizeStyles[size]

  return (
    <div
      className={[
        'rounded-lg border ring-1 flex flex-col gap-2',
        config.bg,
        config.ring,
        sz.padding,
        className,
      ].join(' ')}
    >
      {label && (
        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </p>
      )}
      <div className="flex items-baseline gap-2">
        <span className={['font-bold leading-none', sz.score, config.color].join(' ')}>
          {clamped}
        </span>
        <span className="text-gray-400 dark:text-gray-500 text-sm">/100</span>
        <span className={['font-semibold ml-1', sz.status, config.color].join(' ')}>
          {config.label}
        </span>
      </div>
      {showBar && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden h-2">
          <div
            className={['rounded-full transition-all duration-500', config.bar, sz.barH].join(' ')}
            style={{ width: `${clamped}%` }}
            role="progressbar"
            aria-valuenow={clamped}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      )}
    </div>
  )
}
