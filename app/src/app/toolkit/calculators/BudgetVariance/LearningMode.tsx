import { LearningLayout } from '../../layouts/LearningLayout'
import { HelpTooltip } from '../../components/Tooltip'

export default function BudgetVarianceLearning() {
  return (
    <LearningLayout
      title="Budget Variance Analysis"
      description="Understanding plan vs actual performance and what variance tells you"
    >
      {/* What is budget variance */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          What is Budget Variance?
          <HelpTooltip content="Variance is always Actual minus Budget — positive means more than planned." />
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Budget variance is the difference between what you planned to spend/earn and what actually happened.
          It's the most fundamental management accounting tool — it tells you whether you're executing
          your plan or drifting from it.
        </p>
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 font-mono text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <p>Variance = Actual − Budget</p>
          <p>Variance % = (Actual − Budget) ÷ Budget × 100%</p>
        </div>
      </section>

      {/* Favorable vs unfavorable */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Favorable vs Unfavorable</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Whether a variance is good or bad <strong>depends on the line item</strong>. A positive variance
          on revenue is great; a positive variance on expenses is bad.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10 p-4 space-y-2">
            <p className="font-bold text-green-700 dark:text-green-300">Favorable Variance</p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Revenue <strong>above</strong> budget → good (+)</li>
              <li>• Costs <strong>below</strong> budget → good (−)</li>
            </ul>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Investigate <em>why</em> it's favorable — can you repeat it?
            </p>
          </div>
          <div className="rounded-lg border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10 p-4 space-y-2">
            <p className="font-bold text-red-700 dark:text-red-300">Unfavorable Variance</p>
            <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
              <li>• Revenue <strong>below</strong> budget → bad (−)</li>
              <li>• Costs <strong>above</strong> budget → bad (+)</li>
            </ul>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Investigate <em>why</em> — bad planning or bad execution?
            </p>
          </div>
        </div>
      </section>

      {/* Four categories */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">The Four Budget Categories</h2>
        <div className="space-y-3">
          {[
            {
              cat: 'Revenue', icon: '📈',
              what: 'Income from sales of products/services.',
              favorable: 'Actual > Budget (more revenue than planned)',
              unfavorable: 'Actual < Budget (missed sales targets)',
              tip: 'Break revenue variance into volume and price — did you sell more units, or at better prices?',
            },
            {
              cat: 'COGS (Cost of Goods Sold)', icon: '🏭',
              what: 'Direct costs of producing what you sell: materials, direct labour, manufacturing overhead.',
              favorable: 'Actual < Budget (produced at lower cost)',
              unfavorable: 'Actual > Budget (cost overruns in production)',
              tip: 'COGS variance often reflects pricing power of suppliers — review contracts regularly.',
            },
            {
              cat: 'Opex (Operating Expenses)', icon: '⚙️',
              what: 'Indirect running costs: salaries, rent, marketing, technology.',
              favorable: 'Actual < Budget (operational discipline)',
              unfavorable: 'Actual > Budget (overspending / scope creep)',
              tip: 'Most controllable category. Regular review of discretionary opex prevents drift.',
            },
            {
              cat: 'Capex (Capital Expenditure)', icon: '🏗️',
              what: 'Investment in long-term assets: equipment, vehicles, office fit-out.',
              favorable: 'Actual < Budget (deferred spend or better pricing)',
              unfavorable: 'Actual > Budget (project overruns)',
              tip: 'Capex hits cash immediately but P&L gradually via depreciation. Track separately from opex.',
            },
          ].map(c => (
            <div key={c.cat} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">{c.icon}</span>
                <p className="font-bold text-gray-900 dark:text-white">{c.cat}</p>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">{c.what}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="rounded bg-green-50 dark:bg-green-900/10 p-2">
                  <span className="font-semibold text-green-700 dark:text-green-300">Favorable: </span>
                  <span className="text-gray-700 dark:text-gray-300">{c.favorable}</span>
                </div>
                <div className="rounded bg-red-50 dark:bg-red-900/10 p-2">
                  <span className="font-semibold text-red-700 dark:text-red-300">Unfavorable: </span>
                  <span className="text-gray-700 dark:text-gray-300">{c.unfavorable}</span>
                </div>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300 italic">💡 {c.tip}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Thresholds */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Variance Thresholds — When to Act</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Not every variance requires action. Set materiality thresholds to focus attention on meaningful deviations.
        </p>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Variance %</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Status</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { range: '0% – ±5%', status: 'On Budget', action: 'Monitor only — within normal tolerance', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' },
                { range: '±5% – ±15%', status: 'Investigate', action: 'Identify root cause; assess if it will compound', color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' },
                { range: '> ±15%', status: 'Act Now', action: 'Immediate intervention required; escalate to leadership', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' },
              ].map(row => (
                <tr key={row.range} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300">{row.range}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${row.color}`}>{row.status}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Root cause framework */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Root Cause Framework — 3 Questions</h2>
        <div className="space-y-2">
          {[
            { q: '1. Is it a planning error?', a: 'The budget was unrealistic to begin with. Fix by improving forecasting methodology.' },
            { q: '2. Is it an execution error?', a: 'The plan was realistic but wasn\'t followed. Fix via accountability and process changes.' },
            { q: '3. Is it an external change?', a: 'Market conditions changed (currency, supplier costs). Reforecast and adjust budget.' },
          ].map(item => (
            <div key={item.q} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 space-y-1">
              <p className="font-semibold text-sm text-gray-900 dark:text-white">{item.q}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{item.a}</p>
            </div>
          ))}
        </div>
      </section>
    </LearningLayout>
  )
}
