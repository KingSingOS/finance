import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useBusiness } from '../../contexts/BusinessContext';

const NAV_SECTIONS = [
  {
    label: 'Overview',
    items: [
      { path: '/', label: 'Dashboard' },
      { path: '/cap-table', label: 'Cap Table' },
    ],
  },
  {
    label: 'Financial Statements',
    items: [
      { path: '/pl', label: 'P&L Statement' },
      { path: '/balance-sheet', label: 'Balance Sheet' },
      { path: '/budget-variance', label: 'Budget Variance' },
    ],
  },
  {
    label: 'Cash Management',
    items: [
      { path: '/cash-forecast', label: 'Cash Forecast' },
      { path: '/cash-leakage', label: 'Cash Leakage' },
      { path: '/working-capital', label: 'Working Capital' },
    ],
  },
  {
    label: 'Planning',
    items: [
      { path: '/break-even', label: 'Break-Even' },
      { path: '/pricing', label: 'Pricing' },
      { path: '/capex', label: 'Capex' },
      { path: '/payroll', label: 'Payroll' },
      { path: '/founder-salary', label: 'Founder Salary' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { path: '/operations-kpi', label: 'Operations KPIs' },
      { path: '/tax-calendar', label: 'Tax Calendar' },
      { path: '/weekly-review', label: 'Weekly Review' },
      { path: '/action-plan', label: 'Action Plan' },
    ],
  },
];

export function AppLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { businesses, activeBusiness, setActiveBusiness } = useBusiness();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-gray-900 text-gray-100 w-64 shrink-0">
      <div className="p-4 border-b border-gray-700">
        <span className="text-lg font-bold tracking-tight text-white">FinanceOS</span>
      </div>

      {/* Business selector */}
      {businesses.length > 0 && (
        <div className="px-3 py-3 border-b border-gray-700">
          <select
            value={activeBusiness?.id ?? ''}
            onChange={e => {
              const biz = businesses.find(b => b.id === e.target.value);
              if (biz) setActiveBusiness(biz);
            }}
            className="w-full text-xs bg-gray-800 border border-gray-600 rounded px-2 py-1.5 text-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {businesses.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 space-y-4">
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              {section.label}
            </p>
            {section.items.map(item => {
              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-1.5 text-sm rounded mx-1 transition-colors ${
                    active
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="w-full text-left text-sm text-gray-400 hover:text-white px-3 py-2 rounded hover:bg-gray-800 transition-colors"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:flex flex-col">{sidebar}</div>

      {/* Sidebar - mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-30 transform transition-transform duration-200 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebar}
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar (mobile) */}
        <header className="lg:hidden flex items-center h-12 px-4 bg-white border-b border-gray-200 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-1 text-gray-600 hover:text-gray-900"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="ml-3 text-sm font-semibold text-gray-900">FinanceOS</span>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
