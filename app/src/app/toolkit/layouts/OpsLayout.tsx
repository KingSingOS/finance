import type { ReactNode } from 'react'

// ── Quick input row ───────────────────────────────────────────────────────────
interface QuickInputRowProps {
  children: ReactNode
  className?: string
}

export function QuickInputRow({ children, className = '' }: QuickInputRowProps) {
  return (
    <div className={['grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3', className].join(' ')}>
      {children}
    </div>
  )
}

// ── Result cards grid ─────────────────────────────────────────────────────────
interface ResultCardsGridProps {
  children: ReactNode
  cols?: 2 | 3 | 4
  className?: string
}

const colStyles = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }

export function ResultCardsGrid({ children, cols = 3, className = '' }: ResultCardsGridProps) {
  return (
    <div className={['grid grid-cols-1 gap-3', colStyles[cols], className].join(' ')}>
      {children}
    </div>
  )
}

// ── Action button bar ─────────────────────────────────────────────────────────
interface ActionButton {
  label: string
  onClick: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  icon?: string
  disabled?: boolean
}

interface ActionBarProps {
  actions: ActionButton[]
  className?: string
}

const btnVariant = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600',
  secondary: 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-gray-200 dark:border-gray-600',
  danger: 'bg-red-600 hover:bg-red-700 text-white dark:bg-red-700 dark:hover:bg-red-800',
}

export function ActionBar({ actions, className = '' }: ActionBarProps) {
  return (
    <div className={['flex flex-wrap gap-2', className].join(' ')}>
      {actions.map((action, i) => (
        <button
          key={i}
          onClick={action.onClick}
          disabled={action.disabled}
          className={[
            'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors',
            btnVariant[action.variant ?? 'secondary'],
            action.disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {action.icon && <span>{action.icon}</span>}
          {action.label}
        </button>
      ))}
    </div>
  )
}

// ── Compact section header ────────────────────────────────────────────────────
interface CompactHeaderProps {
  title: string
  actions?: ReactNode
  className?: string
}

export function CompactHeader({ title, actions, className = '' }: CompactHeaderProps) {
  return (
    <div className={['flex items-center justify-between', className].join(' ')}>
      <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">
        {title}
      </h2>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

// ── Main OpsLayout ────────────────────────────────────────────────────────────
interface OpsLayoutProps {
  title: string
  subtitle?: string
  toolbar?: ReactNode
  children: ReactNode
  aside?: ReactNode
  className?: string
}

export function OpsLayout({ title, subtitle, toolbar, children, aside, className = '' }: OpsLayoutProps) {
  return (
    <div className={['ops-layout space-y-4', className].join(' ')}>
      {/* Compact header — minimal chrome */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
              🏢 Ops Mode
            </span>
          </div>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && (
            <p className="text-xs text-gray-500 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
        {toolbar && <div className="flex items-center gap-2 shrink-0">{toolbar}</div>}
      </div>

      {/* Compact body — efficiency focused */}
      {aside ? (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 min-w-0 space-y-4">{children}</div>
          <aside className="lg:w-64 shrink-0 space-y-3">{aside}</aside>
        </div>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  )
}
