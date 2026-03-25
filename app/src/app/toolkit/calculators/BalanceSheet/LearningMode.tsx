import { LearningLayout } from '../../layouts/LearningLayout'
import { HelpTooltip } from '../../components/Tooltip'

const RATIOS = [
  {
    name: 'Current Ratio',
    formula: 'Current Assets ÷ Current Liabilities',
    healthy: '≥ 2.0',
    caution: '1.5 – 2.0',
    atRisk: '1.0 – 1.5',
    critical: '< 1.0',
    meaning: 'Can you pay short-term debts with short-term assets?',
    note: 'Below 1.0 means current liabilities exceed current assets — insolvency risk.',
  },
  {
    name: 'Quick Ratio (Acid Test)',
    formula: '(Current Assets − Inventory) ÷ Current Liabilities',
    healthy: '≥ 1.0',
    caution: '0.7 – 1.0',
    atRisk: '0.5 – 0.7',
    critical: '< 0.5',
    meaning: 'Can you pay short-term debts WITHOUT selling inventory?',
    note: 'More conservative than current ratio; inventory may not be quickly liquid.',
  },
  {
    name: 'Debt-to-Equity (D/E)',
    formula: 'Total Liabilities ÷ Total Equity',
    healthy: '≤ 0.5',
    caution: '0.5 – 1.0',
    atRisk: '1.0 – 2.0',
    critical: '> 2.0',
    meaning: 'How much of the business is funded by debt vs owner equity?',
    note: 'Higher D/E increases financial risk but can boost returns (leverage effect).',
  },
  {
    name: 'Debt Ratio',
    formula: 'Total Liabilities ÷ Total Assets',
    healthy: '< 40%',
    caution: '40 – 60%',
    atRisk: '60 – 80%',
    critical: '> 80%',
    meaning: 'What % of your assets are financed by debt?',
    note: 'An 80%+ debt ratio means creditors own most of the business.',
  },
  {
    name: 'Working Capital',
    formula: 'Current Assets − Current Liabilities',
    healthy: 'Positive & growing',
    caution: 'Positive but declining',
    atRisk: 'Near zero',
    critical: 'Negative',
    meaning: 'Short-term liquidity buffer available to fund daily operations.',
    note: 'Negative working capital is a serious warning sign for operational continuity.',
  },
]

const EXAMPLES = [
  { label: 'Cash & Equivalents', side: 'Assets', type: 'Current' },
  { label: 'Accounts Receivable', side: 'Assets', type: 'Current' },
  { label: 'Inventory', side: 'Assets', type: 'Current' },
  { label: 'Prepaid Expenses', side: 'Assets', type: 'Current' },
  { label: 'Property, Plant & Equipment', side: 'Assets', type: 'Non-Current' },
  { label: 'Intangible Assets', side: 'Assets', type: 'Non-Current' },
  { label: 'Long-term Investments', side: 'Assets', type: 'Non-Current' },
  { label: 'Accounts Payable', side: 'Liabilities', type: 'Current' },
  { label: 'Short-term Debt / Overdraft', side: 'Liabilities', type: 'Current' },
  { label: 'Accrued Expenses', side: 'Liabilities', type: 'Current' },
  { label: 'Long-term Loans', side: 'Liabilities', type: 'Non-Current' },
  { label: 'Deferred Tax Liabilities', side: 'Liabilities', type: 'Non-Current' },
  { label: "Owner's / Share Capital", side: 'Equity', type: '' },
  { label: 'Retained Earnings', side: 'Equity', type: '' },
]

export default function BalanceSheetLearning() {
  return (
    <LearningLayout
      title="Balance Sheet"
      description="Understanding the accounting equation, ratios, and financial health"
    >
      {/* The accounting equation */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">
          The Fundamental Accounting Equation
          <HelpTooltip content="This equation must always hold — if it doesn't, there's an error in the records." />
        </h2>
        <div className="rounded-xl border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 p-5 text-center">
          <p className="text-2xl font-black text-blue-700 dark:text-blue-300">
            Assets = Liabilities + Equity
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            Everything the company owns (assets) must be financed by either borrowing (liabilities)
            or owner investment (equity).
          </p>
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          The balance sheet is a <strong>snapshot at a point in time</strong> — unlike the P&L which
          covers a period. It tells you what the company owns, what it owes, and what's left for owners.
        </p>
      </section>

      {/* Three sections */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Three Sections of a Balance Sheet</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-lg border-2 border-blue-200 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/10 p-4 space-y-2">
            <p className="font-bold text-blue-700 dark:text-blue-300">1. Assets</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Resources owned or controlled by the business that have future economic value.</p>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Current (≤ 1 year):</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Cash, receivables, inventory</p>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Non-Current ({'>'} 1 year):</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">PPE, investments, intangibles</p>
            </div>
          </div>
          <div className="rounded-lg border-2 border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10 p-4 space-y-2">
            <p className="font-bold text-red-700 dark:text-red-300">2. Liabilities</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Obligations owed to external parties — what the company must pay back.</p>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Current (due ≤ 1 year):</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Payables, overdrafts, accruals</p>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mt-1">Non-Current:</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Long-term loans, bonds payable</p>
            </div>
          </div>
          <div className="rounded-lg border-2 border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10 p-4 space-y-2">
            <p className="font-bold text-green-700 dark:text-green-300">3. Equity</p>
            <p className="text-sm text-gray-700 dark:text-gray-300">Residual interest — what belongs to the owners after all liabilities are paid.</p>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 dark:text-gray-400">Share capital / owner's contribution</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Retained earnings (cumulative profits)</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-medium">Equity = Assets − Liabilities</p>
            </div>
          </div>
        </div>
      </section>

      {/* Line items reference */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Common Balance Sheet Line Items</h2>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                <th className="px-3 py-2 text-left text-xs font-semibold text-gray-500">Line Item</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Section</th>
                <th className="px-3 py-2 text-center text-xs font-semibold text-gray-500">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {EXAMPLES.map(ex => (
                <tr key={ex.label} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300">{ex.label}</td>
                  <td className="px-3 py-2 text-center">
                    <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${
                      ex.side === 'Assets' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                      : ex.side === 'Liabilities' ? 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300'
                      : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                    }`}>{ex.side}</span>
                  </td>
                  <td className="px-3 py-2 text-center text-xs text-gray-500 dark:text-gray-400">{ex.type || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Ratios */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">Key Financial Ratios</h2>
        <div className="space-y-3">
          {RATIOS.map(r => (
            <div key={r.name} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <p className="font-bold text-sm text-gray-900 dark:text-white">{r.name}</p>
                <p className="font-mono text-xs text-blue-600 dark:text-blue-400">{r.formula}</p>
              </div>
              <div className="p-3 space-y-2">
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">{r.meaning}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { label: 'Healthy', val: r.healthy, color: 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300' },
                    { label: 'Caution', val: r.caution, color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300' },
                    { label: 'At Risk', val: r.atRisk, color: 'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300' },
                    { label: 'Critical', val: r.critical, color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300' },
                  ].map(th => (
                    <div key={th.label} className={`rounded px-2 py-1 text-center ${th.color}`}>
                      <p className="text-xs font-bold">{th.label}</p>
                      <p className="text-xs">{th.val}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">{r.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Reading a balance sheet */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">How to Read a Balance Sheet — 5-Step Framework</h2>
        <div className="space-y-2">
          {[
            { step: '1. Check it balances', detail: 'Assets = Liabilities + Equity. If not, there\'s a data entry error.' },
            { step: '2. Assess liquidity', detail: 'Current ratio ≥ 1.5 and working capital positive — can you survive the next 12 months?' },
            { step: '3. Check leverage', detail: 'D/E ratio below 1.0 — is the business financially stable or dangerously indebted?' },
            { step: '4. Quality of assets', detail: 'High cash and receivables vs high inventory or goodwill — liquid assets are safer.' },
            { step: '5. Equity trend', detail: 'Is retained earnings growing each year? Growing equity = compounding shareholder value.' },
          ].map(s => (
            <div key={s.step} className="flex gap-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3">
              <span className="font-bold text-sm text-blue-600 dark:text-blue-400 whitespace-nowrap">{s.step}</span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{s.detail}</span>
            </div>
          ))}
        </div>
      </section>
    </LearningLayout>
  )
}
