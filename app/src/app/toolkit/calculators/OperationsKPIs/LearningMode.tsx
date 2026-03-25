import { LearningLayout } from '../../layouts/LearningLayout'
import { HelpTooltip } from '../../components/Tooltip'

const KPI_CATEGORIES = [
  {
    name: 'Financial KPIs',
    color: 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10',
    headerColor: 'text-green-700 dark:text-green-300',
    icon: '💵',
    kpis: [
      { name: 'Gross Margin %', benchmark: '50–70% (SaaS), 30–50% (retail)', frequency: 'Monthly', type: 'Lagging', note: 'Revenue minus COGS, divided by revenue.' },
      { name: 'Net Profit Margin %', benchmark: '10–20% (healthy SME)', frequency: 'Monthly', type: 'Lagging', note: 'Bottom-line profitability after all costs.' },
      { name: 'Revenue Growth %', benchmark: '>20% (high-growth), >10% (stable)', frequency: 'Monthly', type: 'Lagging', note: 'Period-over-period revenue change.' },
      { name: 'Operating Cash Flow', benchmark: 'Positive & > net income', frequency: 'Monthly', type: 'Lagging', note: 'Cash generated from core operations.' },
      { name: 'Burn Rate', benchmark: '<12 months runway remaining = red flag', frequency: 'Monthly', type: 'Leading', note: 'Monthly cash outflow for pre-revenue companies.' },
    ],
  },
  {
    name: 'Operational KPIs',
    color: 'border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10',
    headerColor: 'text-blue-700 dark:text-blue-300',
    icon: '⚙️',
    kpis: [
      { name: 'Order Fulfillment Rate', benchmark: '>95%', frequency: 'Daily/Weekly', type: 'Lagging', note: 'Orders shipped on time vs total orders.' },
      { name: 'Inventory Turnover', benchmark: '4–8x/year (retail)', frequency: 'Monthly', type: 'Lagging', note: 'COGS ÷ average inventory. Higher = leaner stock.' },
      { name: 'Employee Productivity', benchmark: 'Revenue per employee > KES 2M/year', frequency: 'Monthly', type: 'Lagging', note: 'Revenue or output divided by headcount.' },
      { name: 'Capacity Utilization %', benchmark: '75–85% (optimal)', frequency: 'Weekly', type: 'Leading', note: 'Actual output vs maximum possible output.' },
      { name: 'Downtime %', benchmark: '<2% (target)', frequency: 'Daily', type: 'Leading', note: 'Hours of system/equipment downtime vs total hours.' },
    ],
  },
  {
    name: 'Customer KPIs',
    color: 'border-yellow-200 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/10',
    headerColor: 'text-yellow-700 dark:text-yellow-300',
    icon: '⭐',
    kpis: [
      { name: 'Net Promoter Score (NPS)', benchmark: '>50 excellent, >30 good, <0 bad', frequency: 'Quarterly', type: 'Lagging', note: '% promoters minus % detractors on 0–10 scale.' },
      { name: 'Customer Satisfaction (CSAT)', benchmark: '>80%', frequency: 'Monthly', type: 'Lagging', note: 'Avg satisfaction score from post-interaction surveys.' },
      { name: 'Customer Churn Rate', benchmark: '<5%/month (SaaS), <2% (subscription)', frequency: 'Monthly', type: 'Lagging', note: 'Customers lost ÷ total customers at start of period.' },
      { name: 'Customer Acquisition Cost (CAC)', benchmark: 'CAC payback < 12 months', frequency: 'Monthly', type: 'Lagging', note: 'Total sales & marketing spend ÷ new customers acquired.' },
      { name: 'Average Response Time', benchmark: '<4 hours (email), <2 min (chat)', frequency: 'Daily', type: 'Leading', note: 'Time from customer contact to first meaningful response.' },
    ],
  },
  {
    name: 'Growth KPIs',
    color: 'border-purple-200 dark:border-purple-700 bg-purple-50 dark:bg-purple-900/10',
    headerColor: 'text-purple-700 dark:text-purple-300',
    icon: '📈',
    kpis: [
      { name: 'Monthly Recurring Revenue (MRR)', benchmark: 'Track growth rate; 10%+ MoM = strong', frequency: 'Monthly', type: 'Leading', note: 'Predictable monthly revenue from subscriptions/contracts.' },
      { name: 'Customer Lifetime Value (CLV)', benchmark: 'CLV:CAC ratio > 3:1', frequency: 'Quarterly', type: 'Lagging', note: 'Total revenue expected from a customer over their lifetime.' },
      { name: 'Market Share %', benchmark: 'Growing QoQ in target segment', frequency: 'Quarterly', type: 'Lagging', note: 'Your revenue as % of total addressable market.' },
      { name: 'New Customer %', benchmark: '20–40% new customers each month', frequency: 'Monthly', type: 'Leading', note: 'New customers acquired ÷ total active customers.' },
      { name: 'Pipeline Value', benchmark: '3–5x current monthly revenue', frequency: 'Weekly', type: 'Leading', note: 'Total value of qualified sales opportunities in pipeline.' },
    ],
  },
]

const STATUS_THRESHOLDS = [
  { status: 'On Track', rule: 'Actual ≥ 95% of target (for higher-is-better)', color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' },
  { status: 'At Risk', rule: 'Actual is 85%–95% of target', color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' },
  { status: 'Off Track', rule: 'Actual < 85% of target', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' },
]

export default function OperationsKPIsLearning() {
  return (
    <LearningLayout
      title="Operations KPIs"
      description="Key Performance Indicators — categories, benchmarks, and best practices"
    >
      {/* What are KPIs */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          What makes a good KPI?
          <HelpTooltip content="KPIs should be tied to strategic objectives — tracking too many dilutes focus." />
        </h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          A KPI (Key Performance Indicator) is a quantifiable measure used to evaluate how well
          an organization is achieving its objectives. Good KPIs follow the <strong>SMART</strong> framework:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            { letter: 'S', word: 'Specific', desc: 'Clear, unambiguous measure' },
            { letter: 'M', word: 'Measurable', desc: 'Can be quantified objectively' },
            { letter: 'A', word: 'Achievable', desc: 'Realistic given resources' },
            { letter: 'R', word: 'Relevant', desc: 'Tied to strategic goals' },
            { letter: 'T', word: 'Time-bound', desc: 'Has a clear review period' },
          ].map(s => (
            <div key={s.letter} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 text-center">
              <p className="text-2xl font-black text-blue-600 dark:text-blue-400">{s.letter}</p>
              <p className="text-xs font-bold text-gray-900 dark:text-white">{s.word}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Leading vs lagging */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Leading vs Lagging Indicators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 p-4 space-y-2">
            <p className="font-bold text-blue-700 dark:text-blue-300">Leading Indicators</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Predict future outcomes. Actionable now — changing these drivers
              will change future results.
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Sales pipeline value</li>
              <li>• Capacity utilization</li>
              <li>• New customer acquisition rate</li>
              <li>• Average response time</li>
            </ul>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Track weekly for early warning</p>
          </div>
          <div className="rounded-lg border-2 border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10 p-4 space-y-2">
            <p className="font-bold text-orange-700 dark:text-orange-300">Lagging Indicators</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Confirm what already happened. Good for scoring performance
              but can't be changed retroactively.
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Revenue and profit</li>
              <li>• Net Promoter Score</li>
              <li>• Customer churn rate</li>
              <li>• Market share</li>
            </ul>
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Track monthly/quarterly for accountability</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          <strong>Best practice:</strong> Track a balanced mix. If you only track lagging indicators,
          you're always looking backwards. Leading indicators let you course-correct before it's too late.
        </p>
      </section>

      {/* Status thresholds */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">How KPI Status is Determined</h2>
        <div className="space-y-2">
          {STATUS_THRESHOLDS.map(s => (
            <div key={s.status} className="flex items-center gap-3">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${s.color}`}>{s.status}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{s.rule}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          For lower-is-better KPIs (e.g. churn rate, downtime), variance is inverted —
          being above target is bad, not good.
        </p>
      </section>

      {/* KPI categories */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">KPI Categories & Industry Benchmarks</h2>
        {KPI_CATEGORIES.map(cat => (
          <div key={cat.name} className={`rounded-lg border p-4 space-y-3 ${cat.color}`}>
            <div className="flex items-center gap-2">
              <span className="text-xl">{cat.icon}</span>
              <h3 className={`font-bold text-base ${cat.headerColor}`}>{cat.name}</h3>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-white/60 dark:bg-gray-900/60">
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">KPI</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Benchmark</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Type</th>
                    <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {cat.kpis.map(k => (
                    <tr key={k.name} className="bg-white dark:bg-gray-900">
                      <td className="px-3 py-2">
                        <p className="font-medium text-gray-900 dark:text-white text-xs">{k.name}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{k.note}</p>
                      </td>
                      <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">{k.benchmark}</td>
                      <td className="px-3 py-2 text-center">
                        <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${k.type === 'Leading' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300' : 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300'}`}>
                          {k.type}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-center text-xs text-gray-500 dark:text-gray-400">{k.frequency}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </section>

      {/* Best practices */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">KPI Tracking Best Practices</h2>
        <div className="space-y-2">
          {[
            "Start with 5–10 KPIs maximum. More than that spreads attention too thin and dilutes accountability.",
            "Assign an owner to each KPI — someone accountable for the number, not just someone who reports it.",
            "Review cadence matters: operational KPIs (fulfillment, response time) weekly; financial KPIs monthly; strategic KPIs quarterly.",
            "Set targets bottom-up where possible — teams who set their own targets are more committed to hitting them.",
            "Look for divergence between leading and lagging indicators: a healthy pipeline (leading) with declining revenue (lagging) signals a conversion problem, not a demand problem.",
          ].map((point, i) => (
            <div key={i} className="flex gap-2 text-sm text-gray-700 dark:text-gray-300">
              <span className="text-blue-500 font-bold shrink-0">{i + 1}.</span>
              <span>{point}</span>
            </div>
          ))}
        </div>
      </section>
    </LearningLayout>
  )
}
