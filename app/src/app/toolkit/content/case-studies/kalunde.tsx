/** Kalunde — Social Media Manager case study (used in Pricing LearningMode) */
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { ResultDisplay } from '../../components/ResultDisplay'
import { formatKES } from '../../utils/format'

export function KalundeCaseStudy() {
  return (
    <div className="space-y-5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          📚 Case Study — Social Media Strategy
        </span>
        <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
          Pricing
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">Kalunde: Charging KES 600/hr — Leaving KES 2.4M on the Table</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
          Kalunde is a social media strategist in Nairobi. She charges KES 600–800/hour because "that's what the market pays."
          But she is exhausted, working 60+ hours a week and barely covering her costs. A 3-method pricing analysis changed everything.
        </p>
      </div>

      {/* Before metrics */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Before — The Problem</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <MetricCard label="Hourly Rate" value="KES 600–800" subtitle="Market-feel pricing" icon="⏱️" status="error" />
          <MetricCard label="True Cost/hr" value="KES 1,200" subtitle="With all overheads" icon="💸" status="error" />
          <MetricCard label="Margin" value="−33% to 0%" subtitle="Losing or breakeven" icon="📉" status="error" />
          <MetricCard label="Weekly Hours" value="60+ hrs" subtitle="Burnout risk" icon="😓" status="warning" />
        </div>
      </div>

      <AlertBanner
        type="error"
        title="Root cause: Kalunde was pricing below her true cost"
        message={
          <div className="space-y-1 text-sm">
            <p>Direct labour: KES 400/hr + Overhead (internet, tools, rent share, admin): KES 800/hr = <strong>KES 1,200 true cost per hour</strong></p>
            <p>She was charging KES 600–800, meaning <strong>every hour she worked, she lost KES 400–600</strong>.</p>
          </div>
        }
      />

      {/* The 3-method analysis */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">The 3-Method Pricing Analysis</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              method: '1. Cost-Plus',
              price: 'KES 2,000/hr',
              calc: 'KES 1,200 cost ÷ (1 − 40% margin)',
              verdict: 'Minimum floor',
              color: 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20',
              badge: 'text-blue-700 dark:text-blue-300',
            },
            {
              method: '2. Market Rate',
              price: 'KES 1,500–2,000/hr',
              calc: 'Senior social media strategists in Nairobi',
              verdict: 'She was far below market',
              color: 'border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20',
              badge: 'text-orange-700 dark:text-orange-300',
            },
            {
              method: '3. Value-Based',
              price: 'KES 3,000–5,000/hr',
              calc: 'Client gets KES 15K–20K new revenue per hour of her work (25% capture)',
              verdict: 'Strong value proposition',
              color: 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20',
              badge: 'text-green-700 dark:text-green-300',
            },
          ].map(m => (
            <div key={m.method} className={`rounded-lg border p-3 ${m.color}`}>
              <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${m.badge}`}>{m.method}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{m.price}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{m.calc}</p>
              <p className={`text-xs font-medium mt-1 ${m.badge}`}>→ {m.verdict}</p>
            </div>
          ))}
        </div>
      </div>

      {/* The recommendation */}
      <div className="rounded-lg border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/20 p-4">
        <p className="text-xs font-bold text-green-600 dark:text-green-400 uppercase tracking-wider mb-1">🎯 Recommendation</p>
        <p className="text-xl font-bold text-green-700 dark:text-green-300">KES 1,800 / hour</p>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Above cost-plus floor (KES 2,000 was the technical floor — KES 1,800 with volume incentives),
          competitive with market, significantly below value-based ceiling. Immediately defensible and profitable.
        </p>
      </div>

      {/* Impact */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">The Impact</p>
        <ResultDisplay
          title="Pricing Transformation (1,200 hrs/year)"
          status="success"
          sections={[{
            rows: [
              { label: 'Old rate (avg KES 700/hr)', value: formatKES(700 * 1_200, true), status: 'error' },
              { label: 'Old margin', value: '−41% (loss-making)', status: 'error' },
              { label: 'New rate (KES 1,800/hr)', value: formatKES(1_800 * 1_200, true), status: 'success' },
              { label: 'New margin', value: '33% gross margin', status: 'success' },
              { label: 'Revenue increase', value: '+125% (+KES 1.32M/year)', status: 'success', highlight: true },
              { label: 'Clients lost at new rate', value: '3 of 11 (price-sensitive only)', status: 'neutral' },
              { label: 'Hours worked (reduced)', value: '40 hrs/week (was 60+)', status: 'success' },
            ],
          }]}
          footer="💡 Lesson: Market-feel pricing costs you KES 2.4M annually. Always run 3-method pricing before setting rates."
        />
      </div>

      {/* Psychology tips */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Pricing Psychology Tips</p>
        <div className="space-y-2">
          {[
            { tip: 'Anchor high first', desc: 'Present your highest package first. It makes middle packages look reasonable by comparison.' },
            { tip: 'Price in packages, not hourly', desc: 'A "Social Media Starter Package — KES 45,000/month" is easier to accept than "25 hours × KES 1,800".' },
            { tip: 'Show the ROI explicitly', desc: '"My clients average 3× return on this investment" removes price objections better than any discount.' },
            { tip: 'Raise rates annually', desc: 'Build in a 15–20% rate increase every 12 months. Existing clients expect it; new clients never know old rates.' },
          ].map((t, i) => (
            <div key={i} className="flex gap-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
              <span className="text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/40 px-1.5 py-0.5 rounded h-fit shrink-0">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{t.tip}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
