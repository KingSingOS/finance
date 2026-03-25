import { LearningLayout } from '../../layouts/LearningLayout'

export default function ActionPlansLearning() {
  return (
    <LearningLayout
      title="Action Plans"
      description="How to prioritise, assign, and track business actions effectively"
    >
      {/* Why action plans fail */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Why Most Action Lists Fail</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Every business has a to-do list. Most aren't actionable. The difference between action lists
          that drive results and those that gather dust is <strong>four disciplines</strong>:
          prioritisation, ownership, deadlines, and tracking.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: '🎯', label: 'Prioritised', desc: 'Not all actions are equal' },
            { icon: '👤', label: 'Owned', desc: 'One person responsible' },
            { icon: '📅', label: 'Dated', desc: 'Clear due date' },
            { icon: '🔄', label: 'Tracked', desc: 'Status reviewed weekly' },
          ].map(d => (
            <div key={d.label} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-center space-y-1">
              <p className="text-2xl">{d.icon}</p>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{d.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{d.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Priority framework */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Priority Levels</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Use a 4-tier priority system. Each tier implies a different response time and escalation path.
        </p>
        <div className="space-y-2">
          {[
            {
              level: 'Critical',
              badge: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
              desc: 'Business-stopping or high-value opportunity with imminent expiry.',
              response: 'Same day. Owner must update status by end of business.',
              examples: 'System outage, major deal closing today, compliance breach, key hire offer expiring.',
            },
            {
              level: 'High',
              badge: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
              desc: 'Important to strategic goals, with clear near-term impact.',
              response: 'This week. Should not carry over more than 2 weeks.',
              examples: 'Hiring for critical role, major customer follow-up, product bug affecting 10%+ users.',
            },
            {
              level: 'Medium',
              badge: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
              desc: 'Meaningful work that moves the business forward but has flexibility.',
              response: 'This sprint/fortnight. Can be deprioritised if Critical/High items surge.',
              examples: 'Process improvements, documentation, partnerships, training.',
            },
            {
              level: 'Low',
              badge: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
              desc: 'Nice to have — value is real but time-insensitive.',
              response: 'This month. If it keeps getting bumped, question if it should be on the list.',
              examples: 'Admin clean-up, tool integrations, cosmetic improvements, research tasks.',
            },
          ].map(p => (
            <div key={p.level} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.badge}`}>{p.level}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{p.desc}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Response time: </span>
                  <span className="text-gray-500 dark:text-gray-400">{p.response}</span>
                </div>
                <div>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">Examples: </span>
                  <span className="text-gray-500 dark:text-gray-400">{p.examples}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Action status lifecycle */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Action Status Lifecycle</h2>
        <div className="flex items-center gap-2 flex-wrap">
          {[
            { s: 'To Do', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
            { s: '→', color: 'text-gray-400 font-bold' },
            { s: 'In Progress', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' },
            { s: '→', color: 'text-gray-400 font-bold' },
            { s: 'Done', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' },
          ].map((item, i) => (
            item.s === '→'
              ? <span key={i} className={item.color}>{item.s}</span>
              : <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.color}`}>{item.s}</span>
          ))}
          <span className="text-gray-400 text-xs ml-2">or</span>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300 ml-1">Blocked</span>
        </div>
        <div className="space-y-2 text-sm">
          {[
            { status: 'To Do', rule: 'Not yet started. Should have a due date and owner assigned.' },
            { status: 'In Progress', rule: 'Actively being worked. If it stays In Progress for >2 weeks without movement, it might be Blocked.' },
            { status: 'Blocked', rule: 'Waiting on something outside the owner\'s control. Always document the blocker and who can remove it.' },
            { status: 'Done', rule: 'Completed. Define done clearly — "sent email" is not done if you needed a response.' },
          ].map(r => (
            <div key={r.status} className="flex gap-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300 w-24 shrink-0">{r.status}:</span>
              <span className="text-gray-600 dark:text-gray-400">{r.rule}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Good action writing */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Writing Good Actions</h2>
        <p className="text-sm text-gray-700 dark:text-gray-300">A good action is specific, has a clear outcome, and is unambiguously completable.</p>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">❌ Vague</th>
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">✅ Specific</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {[
                { bad: 'Look into hiring', good: 'Post Software Engineer JD on BrighterMonday by Friday' },
                { bad: 'Follow up with Safaricom', good: 'Send revised proposal to John at Safaricom by Tuesday' },
                { bad: 'Sort out marketing', good: 'Brief agency on Q3 campaign; get cost estimate by Mon' },
                { bad: 'Fix the bug', good: 'Fix payment timeout bug causing checkout failures (ticket #247)' },
                { bad: 'Review finances', good: 'Update June P&L actuals and share with board by 5pm Friday' },
              ].map(row => (
                <tr key={row.bad} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2.5 text-gray-500 dark:text-gray-400 text-xs">{row.bad}</td>
                  <td className="px-3 py-2.5 text-gray-800 dark:text-gray-200 text-xs font-medium">{row.good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </LearningLayout>
  )
}
