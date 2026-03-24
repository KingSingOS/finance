import { ModeToggle } from '../components/ModeToggle'
import { useMode } from '../contexts/ModeContext'

export default function ToolkitPage() {
  const { mode } = useMode()

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
      <div className="flex flex-col items-center gap-3">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Unified Financial Toolkit
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg">Coming Soon</p>
      </div>

      <div className="flex flex-col items-center gap-2">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Current mode:{' '}
          <span className="font-medium text-gray-700 dark:text-gray-200">
            {mode === 'ops' ? '🏢 Ops' : '🎓 Learning'}
          </span>
        </p>
        <ModeToggle />
      </div>

      <p className="max-w-md text-sm text-gray-400 dark:text-gray-500">
        {mode === 'ops'
          ? 'Ops mode: fast-access financial tools for day-to-day operations.'
          : 'Learning mode: guided walkthroughs and explanations for every tool.'}
      </p>
    </div>
  )
}
