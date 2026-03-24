import { useState } from 'react'
import { useMode } from '../contexts/ModeContext'
import { ModeToggle } from '../components/ModeToggle'
import { ToolkitNav } from './components/ToolkitNav'
import { MetricCard } from './components/MetricCard'
import { AlertBanner } from './components/AlertBanner'
import { HealthScore } from './components/HealthScore'

export default function ToolkitPage() {
  const { mode } = useMode()
  const [navOpen, setNavOpen] = useState(false)

  return (
    <div className="flex gap-6 min-h-[80vh]">
      {/* Sidebar — desktop */}
      <aside className="hidden lg:block w-60 shrink-0 border-r border-gray-200 dark:border-gray-700 pr-4">
        <ToolkitNav />
      </aside>

      {/* Mobile nav drawer */}
      {navOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setNavOpen(false)}
            aria-hidden="true"
          />
          <div className="relative w-64 bg-white dark:bg-gray-900 shadow-xl h-full overflow-y-auto px-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Tools</span>
              <button
                onClick={() => setNavOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none"
                aria-label="Close menu"
              >
                ×
              </button>
            </div>
            <ToolkitNav />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Unified Financial Toolkit
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              18 calculators for startup financial management
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile nav toggle */}
            <button
              className="lg:hidden p-2 rounded-md border border-gray-200 dark:border-gray-700 text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              onClick={() => setNavOpen(true)}
              aria-label="Open tools menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
              </svg>
            </button>
            <ModeToggle />
          </div>
        </div>

        {/* Mode alert */}
        <AlertBanner
          type={mode === 'ops' ? 'info' : 'success'}
          title={mode === 'ops' ? 'Ops Mode Active' : 'Learning Mode Active'}
          message={
            mode === 'ops'
              ? 'Compact views with quick-entry forms and instant results. Toggle to Learning Mode for guided walkthroughs.'
              : 'Educational layouts with explanations, case studies, and step-by-step guidance. Toggle to Ops Mode for speed.'
          }
        />

        {/* Health score + metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <HealthScore
            score={72}
            label="Financial Health"
            showBar
            className="sm:col-span-2 lg:col-span-1"
          />
          <MetricCard
            label="Tools Available"
            value="18"
            subtitle="Across 5 categories"
            icon="🧰"
            status="neutral"
          />
          <MetricCard
            label="Current Mode"
            value={mode === 'ops' ? 'Ops' : 'Learning'}
            subtitle={mode === 'ops' ? 'Fast & focused' : 'Guided & educational'}
            icon={mode === 'ops' ? '🏢' : '🎓'}
            status="success"
          />
          <MetricCard
            label="Sprint"
            value="1"
            subtitle="Core architecture"
            icon="🚀"
            status="warning"
          />
        </div>

        {/* Category summary */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Tool Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: '📊', label: 'Core Financials', tools: 'Dashboard · P&L · Balance Sheet', count: 3, path: '/toolkit/dashboard' },
              { icon: '💵', label: 'Cash Management', tools: 'Forecast · Working Capital · Leakage · Variance', count: 4, path: '/toolkit/cash-forecast' },
              { icon: '💡', label: 'Strategic Planning', tools: 'Pricing · Break-Even · Growth · Salary', count: 5, path: '/toolkit/pricing' },
              { icon: '🏗️', label: 'Operations', tools: 'CAPEX · Payroll · Tax Calendar · KPIs', count: 4, path: '/toolkit/capex' },
              { icon: '📝', label: 'Execution', tools: 'Weekly Review · Action Plans', count: 2, path: '/toolkit/weekly-review' },
            ].map(cat => (
              <div
                key={cat.label}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-default"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    {cat.count} tools
                  </span>
                </div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{cat.label}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{cat.tools}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Coming soon footer */}
        <div className="rounded-lg border border-dashed border-gray-200 dark:border-gray-700 p-6 text-center">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Sprint 2+ will wire individual calculator UIs into each tool route
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Select a tool from the sidebar to see its placeholder page
          </p>
        </div>
      </div>
    </div>
  )
}
