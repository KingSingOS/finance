import type { ReactNode } from 'react'

export type AlertType = 'info' | 'success' | 'warning' | 'error'

interface AlertBannerProps {
  type: AlertType
  title?: string
  message: ReactNode
  onDismiss?: () => void
  className?: string
}

const alertStyles: Record<
  AlertType,
  { container: string; icon: string; title: string; message: string; dismiss: string }
> = {
  info: {
    container: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    icon: 'ℹ️',
    title: 'text-blue-800 dark:text-blue-200',
    message: 'text-blue-700 dark:text-blue-300',
    dismiss: 'text-blue-400 hover:text-blue-600 dark:text-blue-500 dark:hover:text-blue-300',
  },
  success: {
    container: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    icon: '✅',
    title: 'text-green-800 dark:text-green-200',
    message: 'text-green-700 dark:text-green-300',
    dismiss: 'text-green-400 hover:text-green-600 dark:text-green-500 dark:hover:text-green-300',
  },
  warning: {
    container: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    icon: '⚠️',
    title: 'text-yellow-800 dark:text-yellow-200',
    message: 'text-yellow-700 dark:text-yellow-300',
    dismiss: 'text-yellow-400 hover:text-yellow-600 dark:text-yellow-500 dark:hover:text-yellow-300',
  },
  error: {
    container: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    icon: '🚨',
    title: 'text-red-800 dark:text-red-200',
    message: 'text-red-700 dark:text-red-300',
    dismiss: 'text-red-400 hover:text-red-600 dark:text-red-500 dark:hover:text-red-300',
  },
}

export function AlertBanner({ type, title, message, onDismiss, className = '' }: AlertBannerProps) {
  const s = alertStyles[type]

  return (
    <div
      role="alert"
      className={[
        'flex gap-3 rounded-lg border p-4',
        s.container,
        className,
      ].join(' ')}
    >
      <span className="text-lg leading-none mt-0.5 shrink-0">{s.icon}</span>
      <div className="flex-1 min-w-0">
        {title && (
          <p className={['text-sm font-semibold mb-1', s.title].join(' ')}>{title}</p>
        )}
        <div className={['text-sm', s.message].join(' ')}>{message}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className={['shrink-0 text-lg leading-none transition-colors', s.dismiss].join(' ')}
          aria-label="Dismiss"
        >
          ×
        </button>
      )}
    </div>
  )
}
