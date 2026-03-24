/** Mercy — ESG Consulting case study (used in Working Capital LearningMode) */
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { ResultDisplay } from '../../components/ResultDisplay'
import { CashTimeline } from '../visuals/CashTimeline'
import { formatKES } from '../../utils/format'

export function MercyCaseStudy() {
  return (
    <div className="space-y-5 rounded-xl border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/20 p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          📚 Case Study — ESG Consulting
        </span>
        <span className="text-xs bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">
          Working Capital
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 dark:text-white">Mercy's Story: "Profitable but Broke"</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
          Mercy runs a Nairobi-based ESG consulting firm with KES 20M annual revenue and several major corporate clients.
          Despite winning large contracts, her business account was perpetually near zero — she couldn't pay salaries on time
          and had accumulated KES 7M in liabilities to cover operating costs.
        </p>
      </div>

      {/* Before metrics */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">The Problem — Before</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <MetricCard label="Annual Revenue" value={formatKES(20_000_000, true)} icon="📊" status="neutral" />
          <MetricCard label="Annual Profit" value="KES 0" subtitle="Profitable on paper" icon="💰" status="error" />
          <MetricCard label="Liabilities" value={formatKES(7_000_000, true)} subtitle="To cover operations" icon="⚠️" status="error" />
          <MetricCard label="WIP Days" value="60 days" subtitle="Before invoicing" icon="🏗️" status="error" />
          <MetricCard label="Receivables (DSO)" value="60 days" subtitle="To collect payment" icon="📥" status="error" />
          <MetricCard label="Payables (DPO)" value="15 days" subtitle="To pay suppliers" icon="📤" status="warning" />
        </div>
      </div>

      {/* Cash timeline - before */}
      <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <CashTimeline wipDays={60} receivablesDays={60} payablesDays={15} />
      </div>

      {/* The diagnosis */}
      <AlertBanner
        type="error"
        title="Diagnosis: CCC = 105 days"
        message={
          <div className="space-y-1">
            <p>60 WIP + 60 Receivables − 15 Payables = <strong>105 days</strong></p>
            <p>Daily Revenue: KES {(20_000_000 / 365).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} × 105 days = <strong>KES 5,753,424 locked in working capital</strong></p>
            <p className="mt-1 text-sm opacity-90">This is why Mercy had zero cash despite KES 20M revenue — her business was financing her clients' operations for 105 days on every project.</p>
          </div>
        }
      />

      {/* The solution */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">The Solution — 3 Changes</p>
        <div className="space-y-2">
          {[
            { step: '1', title: 'Invoice at milestones', desc: 'Instead of completing projects before billing, Mercy invoiced at 25%, 50%, 75% and 100% completion. WIP days dropped from 60 → 15.', impact: 'WIP: 60 → 15 days' },
            { step: '2', title: 'Require 30% upfront deposit', desc: 'All new contracts required a 30% deposit before work begins. Clients accepted this as industry standard.', impact: 'Immediate cash inflow' },
            { step: '3', title: 'Negotiate Net 30 supplier terms', desc: 'Mercy renegotiated payment terms with her subcontractors from immediate to Net 30, extending DPO from 15 → 30 days.', impact: 'DPO: 15 → 30 days' },
          ].map(s => (
            <div key={s.step} className="flex gap-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-3">
              <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                {s.step}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{s.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.desc}</p>
                <span className="text-xs font-semibold text-green-600 dark:text-green-400 mt-1 block">→ {s.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* After metrics */}
      <div>
        <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">The Result — After</p>
        <div className="bg-white dark:bg-gray-900 rounded-lg p-4 border border-gray-200 dark:border-gray-700 mb-3">
          <CashTimeline wipDays={15} receivablesDays={30} payablesDays={30} />
        </div>
        <ResultDisplay
          title="Working Capital Transformation"
          status="success"
          sections={[{
            rows: [
              { label: 'Old CCC', value: '105 days', status: 'error' },
              { label: 'New CCC', value: '15 days', status: 'success' },
              { label: 'Cash was locked (before)', value: formatKES(5_753_424, true), status: 'error' },
              { label: 'Cash freed (improvement)', value: formatKES(4_109_589, true), status: 'success', highlight: true },
              { label: 'Liabilities repaid', value: 'KES 7M cleared in 18 months', status: 'success' },
            ],
          }]}
          footer="💡 Lesson: You can be profitable on paper and broke in practice. CCC determines how much cash your business finances for clients."
        />
      </div>
    </div>
  )
}
