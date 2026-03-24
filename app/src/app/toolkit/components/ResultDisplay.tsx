import type { ReactNode } from 'react'
import type { MetricStatus } from './MetricCard'

interface ResultRow {
  label: string
  value: ReactNode
  sublabel?: string
  status?: MetricStatus
  highlight?: boolean
}

interface ResultSection {
  title?: string
  rows: ResultRow[]
}

interface ResultDisplayProps {
  title: string
  subtitle?: string
  sections: ResultSection[]
  footer?: ReactNode
  status?: MetricStatus
  className?: string
}

const statusBorder: Record<MetricStatus, string> = {
  success: 'border-green-200 dark:border-green-800',
  warning: 'border-yellow-200 dark:border-yellow-800',
  error: 'border-red-200 dark:border-red-800',
  neutral: 'border-gray-200 dark:border-gray-700',
}

const rowStatusStyles: Record<MetricStatus, string> = {
  success: 'text-green-700 dark:text-green-300',
  warning: 'text-yellow-700 dark:text-yellow-300',
  error: 'text-red-700 dark:text-red-300',
  neutral: 'text-gray-900 dark:text-white',
}

export function ResultDisplay({ title, subtitle, sections, footer, status = 'neutral', className = '' }: ResultDisplayProps) {
  return (
    <div
      className={[
        'rounded-lg border bg-white dark:bg-gray-900 overflow-hidden shadow-sm',
        statusBorder[status],
        className,
      ].join(' ')}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
        )}
      </div>

      {/* Sections */}
      <div className="divide-y divide-gray-100 dark:divide-gray-800">
        {sections.map((section, si) => (
          <div key={si} className="px-4 py-3">
            {section.title && (
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
                {section.title}
              </p>
            )}
            <dl className="space-y-2">
              {section.rows.map((row, ri) => (
                <div
                  key={ri}
                  className={[
                    'flex items-start justify-between gap-4',
                    row.highlight ? 'font-semibold' : '',
                  ].join(' ')}
                >
                  <dt className="text-sm text-gray-600 dark:text-gray-400 shrink-0">
                    {row.label}
                    {row.sublabel && (
                      <span className="block text-xs text-gray-400 dark:text-gray-500 font-normal">
                        {row.sublabel}
                      </span>
                    )}
                  </dt>
                  <dd
                    className={[
                      'text-sm text-right',
                      row.status ? rowStatusStyles[row.status] : 'text-gray-900 dark:text-white',
                      row.highlight ? 'font-bold' : '',
                    ].join(' ')}
                  >
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      {/* Footer */}
      {footer && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          {footer}
        </div>
      )}
    </div>
  )
}
