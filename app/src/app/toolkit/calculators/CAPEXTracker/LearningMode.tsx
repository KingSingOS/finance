import { useState } from 'react'
import { LearningLayout } from '../../layouts/LearningLayout'
import { HelpTooltip } from '../../components/Tooltip'
import { formatKES, formatPct } from '../../utils/format'

function DepreciationDemo() {
  const [cost, setCost] = useState(1_000_000)
  const [life, setLife] = useState(5)
  const [method, setMethod] = useState<'sl' | 'db'>('sl')
  const salvage = 0

  const rows: { year: number; depn: number; bookValue: number }[] = []
  if (method === 'sl') {
    const annual = (cost - salvage) / life
    let bv = cost
    for (let y = 1; y <= life; y++) {
      bv = Math.max(salvage, bv - annual)
      rows.push({ year: y, depn: annual, bookValue: bv })
    }
  } else {
    const rate = 2 / life
    let bv = cost
    for (let y = 1; y <= life; y++) {
      const depn = Math.max(0, bv * rate)
      bv = Math.max(salvage, bv - depn)
      rows.push({ year: y, depn, bookValue: bv })
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Asset Cost (KES)</label>
          <input
            type="number"
            value={cost}
            onChange={e => setCost(parseFloat(e.target.value) || 0)}
            className="w-32 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Useful Life (years)</label>
          <input
            type="number"
            value={life}
            min={1}
            max={20}
            onChange={e => setLife(parseInt(e.target.value) || 1)}
            className="w-20 border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1">Method</label>
          <select
            value={method}
            onChange={e => setMethod(e.target.value as 'sl' | 'db')}
            className="border border-gray-300 dark:border-gray-600 rounded-lg px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="sl">Straight-line</option>
            <option value="db">Double Declining</option>
          </select>
        </div>
      </div>
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Year</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Depreciation</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">Book Value</th>
              <th className="px-3 py-2 text-right text-xs font-semibold text-gray-500">% Remaining</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            <tr className="bg-blue-50 dark:bg-blue-900/10">
              <td className="px-3 py-2 text-xs text-gray-500">0</td>
              <td className="px-3 py-2 text-right text-xs text-gray-400">—</td>
              <td className="px-3 py-2 text-right text-xs font-medium text-blue-700 dark:text-blue-300">{formatKES(cost, true)}</td>
              <td className="px-3 py-2 text-right text-xs text-gray-400">100%</td>
            </tr>
            {rows.map(r => (
              <tr key={r.year} className="bg-white dark:bg-gray-900">
                <td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">{r.year}</td>
                <td className="px-3 py-2 text-right text-xs text-red-600 dark:text-red-400">({formatKES(r.depn, true)})</td>
                <td className="px-3 py-2 text-right text-xs font-medium text-gray-900 dark:text-white">{formatKES(r.bookValue, true)}</td>
                <td className="px-3 py-2 text-right text-xs text-gray-500">{formatPct(r.bookValue / cost * 100, 0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function CAPEXTrackerLearning() {
  return (
    <LearningLayout
      title="CAPEX & Depreciation"
      description="Capital expenditure, depreciation methods, and asset ROI"
    >
      {/* CAPEX vs OPEX */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          CAPEX vs OPEX — What's the difference?
          <HelpTooltip content="Misclassifying CAPEX as OPEX (or vice versa) can materially distort your P&L and tax liability." />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 p-4 space-y-2">
            <p className="font-bold text-blue-700 dark:text-blue-300">CAPEX — Capital Expenditure</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Money spent to acquire, upgrade, or maintain <strong>long-term assets</strong> (PPE).
              Cost is spread over the asset's useful life via depreciation.
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Machinery, vehicles, computers</li>
              <li>• Building construction or renovation</li>
              <li>• Software licences (multi-year)</li>
              <li>• Land acquisition</li>
            </ul>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400">Hits balance sheet → P&L gradually over life</p>
          </div>
          <div className="rounded-lg border-2 border-orange-200 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10 p-4 space-y-2">
            <p className="font-bold text-orange-700 dark:text-orange-300">OPEX — Operating Expenditure</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Day-to-day costs of running the business.
              Fully expensed in the period incurred.
            </p>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Salaries and wages</li>
              <li>• Rent, utilities, insurance</li>
              <li>• Repairs and maintenance</li>
              <li>• Marketing and subscriptions</li>
            </ul>
            <p className="text-xs font-medium text-orange-600 dark:text-orange-400">Hits P&L immediately in full</p>
          </div>
        </div>
        <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 p-3 text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Kenya Tax Rule:</strong> KRA generally allows tax deductions on CAPEX through
          Investment Deduction (100% for manufacturing plant) or Wear & Tear Allowances (12.5%–30%
          per year depending on asset class).
        </div>
      </section>

      {/* Depreciation methods */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Depreciation Methods</h2>
        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
          Depreciation allocates the cost of an asset across its useful life.
          The two most common accounting methods are:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-2">
            <p className="font-bold text-gray-900 dark:text-white">Straight-Line (SL)</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Equal charge every year.</p>
            <div className="rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">
              Annual = (Cost − Salvage) ÷ Life
            </div>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <li>✅ Simple, predictable P&L impact</li>
              <li>✅ Matches assets that depreciate evenly (buildings)</li>
              <li>❌ Ignores higher use in early years</li>
            </ul>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 space-y-2">
            <p className="font-bold text-gray-900 dark:text-white">Double Declining Balance (DDB)</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Heavier charge in early years.</p>
            <div className="rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300">
              Rate = 2 ÷ Life; Charge = Rate × Book Value
            </div>
            <ul className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <li>✅ Reflects technology obsolescence well</li>
              <li>✅ Conserves tax in early years (with KRA WTA)</li>
              <li>❌ More complex; lower P&L profit in year 1–2</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Interactive demo */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Interactive Depreciation Schedule</h2>
        <DepreciationDemo />
      </section>

      {/* ROI and Payback */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Measuring CAPEX Performance</h2>
        <div className="space-y-3">
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Return on Investment (ROI)</p>
            <div className="rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300 mb-2">
              ROI = (Annual Revenue Impact − Annual Depreciation) ÷ Total Cost × 100%
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Positive ROI means the asset generates more value than it costs to own. Aim for ROI above
              your cost of capital (typically 15–25% for Kenyan SMEs).
            </p>
          </div>
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">Payback Period</p>
            <div className="rounded bg-gray-50 dark:bg-gray-800 px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300 mb-2">
              Payback = Total Cost ÷ Annual Revenue Impact
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              How many years to recover the investment. A payback under the useful life is the minimum;
              under 3 years is considered strong for most business assets.
            </p>
          </div>
        </div>
      </section>

      {/* Best practices */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">CAPEX Best Practices</h2>
        <div className="space-y-2">
          {[
            'Maintain a fixed asset register with acquisition date, cost, depreciation method, and current book value for every asset.',
            'Review useful life estimates annually — technology assets often become obsolete faster than accounting estimates assume.',
            'For KRA purposes, use the Wear & Tear Allowance (WTA) schedule: 12.5% for buildings, 25% for computers, 37.5% for certain plant.',
            'Before a CAPEX decision, model ROI and payback — if payback exceeds 70% of useful life, reconsider.',
            'Impairment: if market value falls below book value, write down immediately (IFRS requires impairment testing).',
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
