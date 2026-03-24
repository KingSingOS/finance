import { NavLink } from 'react-router-dom'

interface Tool {
  id: string
  label: string
  path: string
  description: string
}

interface Category {
  id: string
  icon: string
  label: string
  tools: Tool[]
}

export const TOOLKIT_CATEGORIES: Category[] = [
  {
    id: 'core',
    icon: '📊',
    label: 'Core Financials',
    tools: [
      { id: 'dashboard', label: 'Dashboard', path: '/toolkit/dashboard', description: 'KPI overview & health score' },
      { id: 'pl', label: 'P&L Statement', path: '/toolkit/pl', description: 'Profit & loss analysis' },
      { id: 'balance-sheet', label: 'Balance Sheet', path: '/toolkit/balance-sheet', description: 'Assets, liabilities & equity' },
    ],
  },
  {
    id: 'cash',
    icon: '💵',
    label: 'Cash Management',
    tools: [
      { id: 'cash-forecast', label: 'Cash Forecast', path: '/toolkit/cash-forecast', description: 'Runway & cash projections' },
      { id: 'working-capital', label: 'Working Capital', path: '/toolkit/working-capital', description: 'AR/AP aging & cash cycle' },
      { id: 'cash-leakage', label: 'Cash Leakage', path: '/toolkit/cash-leakage', description: 'Identify cash drains' },
      { id: 'budget-variance', label: 'Budget Variance', path: '/toolkit/budget-variance', description: 'Plan vs actual tracking' },
    ],
  },
  {
    id: 'strategic',
    icon: '💡',
    label: 'Strategic Planning',
    tools: [
      { id: 'pricing', label: 'Pricing', path: '/toolkit/pricing', description: '3-method anchor pricing' },
      { id: 'break-even', label: 'Break-Even', path: '/toolkit/break-even', description: 'Break-even analysis' },
      { id: 'power-of-one', label: 'Power of One', path: '/toolkit/power-of-one', description: '1% improvement impact' },
      { id: 'growth', label: 'Growth', path: '/toolkit/growth', description: 'Growth projections' },
      { id: 'founder-salary', label: 'Founder Salary', path: '/toolkit/founder-salary', description: 'Affordable compensation' },
    ],
  },
  {
    id: 'operations',
    icon: '🏗️',
    label: 'Operations',
    tools: [
      { id: 'capex', label: 'CAPEX', path: '/toolkit/capex', description: 'Capital expenditure tracking' },
      { id: 'payroll', label: 'Payroll', path: '/toolkit/payroll', description: 'Department payroll & capacity' },
      { id: 'tax-calendar', label: 'Tax Calendar', path: '/toolkit/tax-calendar', description: 'Tax obligations & alerts' },
      { id: 'kpis', label: 'Operations KPIs', path: '/toolkit/kpis', description: 'Industry-specific KPIs' },
    ],
  },
  {
    id: 'execution',
    icon: '📝',
    label: 'Execution',
    tools: [
      { id: 'weekly-review', label: 'Weekly Review', path: '/toolkit/weekly-review', description: 'Plan vs actual weekly' },
      { id: 'action-plans', label: 'Action Plans', path: '/toolkit/action-plans', description: 'Prioritised action tracking' },
    ],
  },
]

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex items-start gap-2 px-2.5 py-2 rounded-md text-sm transition-colors group',
    isActive
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100',
  ].join(' ')

interface ToolkitNavProps {
  collapsed?: boolean
  className?: string
}

export function ToolkitNav({ collapsed = false, className = '' }: ToolkitNavProps) {
  return (
    <nav
      className={[
        'flex flex-col gap-5 py-4',
        collapsed ? 'items-center' : '',
        className,
      ].join(' ')}
      aria-label="Toolkit navigation"
    >
      {TOOLKIT_CATEGORIES.map(category => (
        <div key={category.id}>
          {/* Category header */}
          {!collapsed && (
            <p className="px-2.5 mb-1.5 text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <span>{category.icon}</span>
              {category.label}
            </p>
          )}
          {collapsed && (
            <p className="text-lg mb-1" title={category.label}>{category.icon}</p>
          )}

          {/* Tools */}
          <ul className="space-y-0.5">
            {category.tools.map(tool => (
              <li key={tool.id}>
                {collapsed ? (
                  <NavLink
                    to={tool.path}
                    title={tool.label}
                    className={({ isActive }) =>
                      [
                        'flex items-center justify-center w-9 h-9 rounded-md text-sm transition-colors',
                        isActive
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                          : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800',
                      ].join(' ')
                    }
                  >
                    {tool.label.charAt(0)}
                  </NavLink>
                ) : (
                  <NavLink to={tool.path} className={navLinkClass}>
                    {({ isActive }) => (
                      <>
                        <span
                          className={[
                            'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
                            isActive ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400',
                          ].join(' ')}
                        />
                        <span className="flex-1 min-w-0">
                          <span className="block font-medium leading-tight">{tool.label}</span>
                          <span className="block text-xs text-gray-400 dark:text-gray-500 truncate">
                            {tool.description}
                          </span>
                        </span>
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}
