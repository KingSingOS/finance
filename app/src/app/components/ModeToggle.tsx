import { useMode } from '../contexts/ModeContext'

export function ModeToggle() {
  const { mode, toggleMode } = useMode()
  const isOps = mode === 'ops'

  return (
    <button
      onClick={toggleMode}
      className={[
        'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium',
        'border transition-all duration-200 select-none cursor-pointer',
        isOps
          ? 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/50'
          : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100 dark:bg-purple-900/30 dark:border-purple-700 dark:text-purple-300 dark:hover:bg-purple-900/50',
      ].join(' ')}
      title={`Switch to ${isOps ? 'Learning' : 'Ops'} mode`}
    >
      <span className="text-base leading-none">{isOps ? '🏢' : '🎓'}</span>
      <span>{isOps ? 'Ops Mode' : 'Learning Mode'}</span>
    </button>
  )
}
