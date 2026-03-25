import { LearningLayout } from '../../layouts/LearningLayout'

export default function WeeklyReviewLearning() {
  return (
    <LearningLayout
      title="Weekly Review"
      description="Building the discipline of weekly business performance reviews"
    >
      {/* Why weekly? */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Why a Weekly Cadence?</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Monthly reviews are too infrequent — problems compound for 4 weeks before you see them.
          Daily is too granular — noise overwhelms signal. Weekly is the sweet spot: frequent enough
          to catch issues early, focused enough to see trends.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { period: 'Daily', issue: 'Too much noise. Reactions to individual data points, not patterns.', icon: '❌' },
            { period: 'Weekly', issue: 'Right balance. Enough data to see trends. Fast enough to correct.', icon: '✅' },
            { period: 'Monthly', issue: 'Too slow. 4 weeks of drift before you notice. Recovery is harder.', icon: '⚠️' },
          ].map(c => (
            <div key={c.period} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 text-center space-y-2">
              <p className="text-3xl">{c.icon}</p>
              <p className="font-bold text-gray-900 dark:text-white">{c.period}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{c.issue}</p>
            </div>
          ))}
        </div>
      </section>

      {/* The 5-part weekly review */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">The 5-Part Weekly Review</h2>
        <div className="space-y-2">
          {[
            {
              n: '1', title: 'Wins', time: '5 min',
              desc: 'Start with what went right. Reinforces positive behaviours, energises the team, and prevents a culture of only discussing problems.',
              prompt: '"What are 2–3 things that went well this week?"',
            },
            {
              n: '2', title: 'Challenges', time: '5 min',
              desc: 'Honest assessment of what was hard, blocked, or missed. No blame — focus on systems and processes, not people.',
              prompt: '"What slowed us down? What wasn\'t done? What surprised us negatively?"',
            },
            {
              n: '3', title: 'KPI Review', time: '10 min',
              desc: 'Check 5–8 key metrics against targets. Red/yellow/green. Dig into any metric that\'s yellow or red — don\'t just note it.',
              prompt: '"For each red metric: what caused it, and what\'s the fix?"',
            },
            {
              n: '4', title: 'Last Week — Actions Done?', time: '5 min',
              desc: 'Accountability check. Every action item from last week is either Done, In Progress, or Blocked. If blocked — why? Remove the blocker.',
              prompt: '"For every incomplete action: is it still a priority? Who is unblocking it?"',
            },
            {
              n: '5', title: 'This Week — Priorities', time: '5 min',
              desc: 'Set 3–5 clear priorities for the week ahead. Assign an owner to each. Keep it achievable — don\'t over-plan.',
              prompt: '"If we only accomplish 3 things this week, which 3 matter most?"',
            },
          ].map(s => (
            <div key={s.n} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold flex items-center justify-center shrink-0">
                  {s.n}
                </span>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-900 dark:text-white">{s.title}</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500">{s.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{s.desc}</p>
                  <p className="text-xs text-blue-700 dark:text-blue-300 italic">{s.prompt}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Scoring */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Weekly Score Interpretation</h2>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Score</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Health</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">What it means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { range: '80–100%', label: 'Excellent', meaning: 'Hitting targets and delivering on commitments. Maintain momentum.', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' },
                { range: '60–79%', label: 'Good', meaning: 'Mostly on track. 1–2 areas need attention. Sustainable short-term.', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' },
                { range: '40–59%', label: 'Fair', meaning: 'Multiple issues. Risk of compounding problems. Investigate root causes now.', color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' },
                { range: '0–39%', label: 'Poor', meaning: 'Significant underperformance. Reset priorities and remove blockers urgently.', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' },
              ].map(r => (
                <tr key={r.range} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2 text-sm font-mono text-gray-700 dark:text-gray-300">{r.range}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${r.color}`}>{r.label}</span>
                  </td>
                  <td className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400">{r.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Score = 60% KPI score + 40% action completion rate.
          KPIs weighted higher because lagging outcomes matter more than activity.
        </p>
      </section>

      {/* Common mistakes */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Common Weekly Review Mistakes</h2>
        <div className="space-y-2">
          {[
            'Too many metrics — pick 5–8 that matter, not 20. More metrics = less focus.',
            'No owners — every action must have one person accountable. "The team" does nothing.',
            'Skipping when busy — the weeks you most need a review are the weeks you feel you don\'t have time for one.',
            'Only reviewing problems — not enough wins review kills morale and misses learning.',
            'Carrying over actions indefinitely — if an action has missed 3 weeks, either kill it or escalate it.',
          ].map((point, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-red-400 font-bold shrink-0">✗</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>
    </LearningLayout>
  )
}
