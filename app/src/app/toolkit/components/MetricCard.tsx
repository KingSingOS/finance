import type { ReactNode } from 'react'

export type MetricStatus = 'success' | 'warning' | 'error' | 'neutral'

interface MetricCardProps {
  label: string
  value: string | number
  subtitle?: string
  icon?: ReactNode
  status?: MetricStatus
  trend?: { value: number; label: string }
  className?: string
}

const statusStyles: Record<MetricStatus, { border: string; badge: string; dot: string }> = {
  success: {
    border: 'border-green-200 dark:border-green-800',
    badge: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300',
    dot: 'bg-green-500',
  },
  warning: {
    border: 'border-yellow-200 dark:border-yellow-800',
    badge: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
    dot: 'bg-yellow-500',
  },
  error: {
    border: 'border-red-200 dark:border-red-800',
    badge: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300',
    dot: 'bg-red-500',
  },
  neutral: {
    border: 'border-gray-200 dark:border-gray-700',
    badge: 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300',
    dot: 'bg-gray-400',
  },
}

export function MetricCard({
  label,
  value,
  subtitle,
  icon,
  status = 'neutral',
  trend,
  className = '',
}: MetricCardProps) {
  const s = statusStyles[status]
  const trendPositive = trend && trend.value >= 0

  return (
    <div
      className={[
        'rounded-lg border bg-white dark:bg-gray-900 p-4 flex flex-col gap-2 shadow-sm',
        s.border,
        className,
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          {label}
        </span>
        {icon && (
          <span className={['p-1.5 rounded-md text-sm', s.badge].join(' ')}>{icon}</span>
        )}
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-900 dark:text-white leading-none">
          {value}
        </span>
        {trend && (
          <span
            className={[
              'text-xs font-medium mb-0.5',
              trendPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400',
            ].join(' ')}
          >
            {trendPositive ? '▲' : '▼'} {Math.abs(trend.value)}% {trend.label}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
      )}

      {status !== 'neutral' && (
        <div className="flex items-center gap-1.5 mt-auto pt-1">
          <span className={['w-1.5 h-1.5 rounded-full', s.dot].join(' ')} />
          <span className={['text-xs font-medium', s.badge.split(' ').slice(1).join(' ')].join(' ')}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </span>
        </div>
      )}
    </div>
  )
}
