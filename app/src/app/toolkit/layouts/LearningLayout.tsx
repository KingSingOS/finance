import type { ReactNode } from 'react'

// ── Section header with explanation ──────────────────────────────────────────
interface SectionHeaderProps {
  title: string
  explanation: string
  step?: number
}

export function SectionHeader({ title, explanation, step }: SectionHeaderProps) {
  return (
    <div className="flex gap-4 mb-6">
      {step !== undefined && (
        <div className="shrink-0 w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-sm font-bold flex items-center justify-center">
          {step}
        </div>
      )}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">{explanation}</p>
      </div>
    </div>
  )
}

// ── Case study card ───────────────────────────────────────────────────────────
interface CaseStudyCardProps {
  company: string
  scenario: string
  outcome: string
  lesson: string
  tag?: string
}

export function CaseStudyCard({ company, scenario, outcome, lesson, tag }: CaseStudyCardProps) {
  return (
    <div className="rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          📚 Case Study
        </span>
        {tag && (
          <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        )}
      </div>
      <p className="font-semibold text-gray-900 dark:text-white text-sm">{company}</p>
      <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{scenario}</p>
      <div className="pt-2 border-t border-purple-200 dark:border-purple-800 space-y-1">
        <p className="text-sm font-medium text-green-700 dark:text-green-300">✅ {outcome}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">💡 {lesson}</p>
      </div>
    </div>
  )
}

// ── Diagram slot ──────────────────────────────────────────────────────────────
interface DiagramSlotProps {
  title: string
  description?: string
  children?: ReactNode
}

export function DiagramSlot({ title, description, children }: DiagramSlotProps) {
  return (
    <div className="rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
      <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
        {title}
      </p>
      {description && (
        <p className="text-sm text-gray-400 dark:text-gray-500 mb-4">{description}</p>
      )}
      {children ?? (
        <div className="flex items-center justify-center h-20 text-gray-300 dark:text-gray-600 text-3xl">
          📊
        </div>
      )}
    </div>
  )
}

// ── Action plan section ───────────────────────────────────────────────────────
interface ActionItem {
  title: string
  description: string
  priority: 'high' | 'medium' | 'low'
}

interface ActionPlanSectionProps {
  title?: string
  items: ActionItem[]
}

const priorityStyles = {
  high: { dot: 'bg-red-500', text: 'text-red-600 dark:text-red-400', label: 'High Priority' },
  medium: { dot: 'bg-yellow-500', text: 'text-yellow-600 dark:text-yellow-400', label: 'Medium Priority' },
  low: { dot: 'bg-green-500', text: 'text-green-600 dark:text-green-400', label: 'Low Priority' },
}

export function ActionPlanSection({ title = 'Action Plan', items }: ActionPlanSectionProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
      <div className="space-y-2">
        {items.map((item, i) => {
          const p = priorityStyles[item.priority]
          return (
            <div
              key={i}
              className="flex gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4"
            >
              <div className={['w-2 h-2 rounded-full mt-1.5 shrink-0', p.dot].join(' ')} />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{item.title}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                <span className={['text-xs font-medium mt-1 block', p.text].join(' ')}>
                  {p.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── Main LearningLayout ───────────────────────────────────────────────────────
interface LearningLayoutProps {
  title: string
  description: string
  children: ReactNode
  sidebar?: ReactNode
  className?: string
}

export function LearningLayout({ title, description, children, sidebar, className = '' }: LearningLayoutProps) {
  return (
    <div className={['learning-layout space-y-8', className].join(' ')}>
      {/* Page header — wide spacing for readability */}
      <div className="max-w-2xl">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
            🎓 Learning Mode
          </span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
      </div>

      {/* Body */}
      <div className={['flex gap-8', sidebar ? 'flex-col lg:flex-row' : ''].join(' ')}>
        <div className="flex-1 min-w-0 space-y-8">{children}</div>
        {sidebar && (
          <aside className="lg:w-72 shrink-0 space-y-4">{sidebar}</aside>
        )}
      </div>
    </div>
  )
}
