import { useParams } from 'react-router-dom'
import { TOOLKIT_CATEGORIES } from './components/ToolkitNav'
import { AlertBanner } from './components/AlertBanner'

function toTitleCase(slug: string) {
  return slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

export default function ToolPage() {
  const { tool = '' } = useParams<{ tool: string }>()

  // Look up metadata from nav definition
  const allTools = TOOLKIT_CATEGORIES.flatMap(c => c.tools.map(t => ({ ...t, categoryLabel: c.label, categoryIcon: c.icon })))
  const meta = allTools.find(t => t.path === `/toolkit/${tool}`)

  const displayName = meta?.label ?? toTitleCase(tool)
  const category = meta ? `${meta.categoryIcon} ${meta.categoryLabel}` : 'Toolkit'
  const description = meta?.description ?? 'Financial calculator'

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center max-w-lg mx-auto">
      <div className="text-4xl">{meta?.categoryIcon ?? '🔧'}</div>
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          {category}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>
      </div>

      <AlertBanner
        type="warning"
        title="Coming in Sprint 2+"
        message={`The ${displayName} calculator UI will be built in an upcoming sprint. The underlying calculation engine already exists in src/library/financial-toolkit/.`}
      />

      <p className="text-xs text-gray-400 dark:text-gray-500">
        Use the sidebar to navigate between tools
      </p>
    </div>
  )
}
