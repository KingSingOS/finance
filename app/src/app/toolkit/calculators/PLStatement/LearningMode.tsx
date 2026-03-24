import { useState, useMemo } from 'react'
import { LearningLayout, SectionHeader, CaseStudyCard, DiagramSlot } from '../../layouts/LearningLayout'
import { ResultDisplay } from '../../components/ResultDisplay'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { MetricCard } from '../../components/MetricCard'
import { calculatePL, getPLBenchmarks, type PLInputs } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const EXAMPLE: PLInputs = {
  revenue: 2_000_000,
  cogs: 600_000,
  operatingExpenses: 900_000,
  interest: 50_000,
  tax: 100_000,
}

export default function PLLearning() {
  const [inputs, setInputs] = useState<PLInputs>(EXAMPLE)
  const set = (key: keyof PLInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))
  const result = useMemo(() => calculatePL(inputs), [inputs])
  const benchmarks = useMemo(() => getPLBenchmarks(result), [result])

  return (
    <LearningLayout
      title="P&L Statement"
      description="The Profit & Loss statement (also called the Income Statement) shows how much money your business made and spent over a period. It answers the most fundamental question: are you making money?"
    >
      {/* Section 1 */}
      <SectionHeader
        step={1}
        title="The income statement structure"
        explanation="A P&L flows from top (revenue) to bottom (net profit), with costs subtracted in a specific order. Each subtraction reveals a different profitability metric."
      />
      <DiagramSlot title="P&L Flow">
        <div className="text-sm space-y-0.5 text-left w-full max-w-sm mx-auto">
          {[
            { label: 'Revenue', color: 'text-blue-700 dark:text-blue-300', indent: 0 },
            { label: '− Cost of Goods Sold (COGS)', color: 'text-red-600 dark:text-red-400', indent: 1 },
            { label: '= Gross Profit', color: 'text-green-700 dark:text-green-300 font-semibold', indent: 0 },
            { label: '− Operating Expenses', color: 'text-red-600 dark:text-red-400', indent: 1 },
            { label: '= Operating Profit (EBIT)', color: 'text-green-700 dark:text-green-300 font-semibold', indent: 0 },
            { label: '− Interest & Tax', color: 'text-red-600 dark:text-red-400', indent: 1 },
            { label: '= Net Profit', color: 'text-green-700 dark:text-green-300 font-bold text-base', indent: 0 },
          ].map((row, i) => (
            <div key={i} className={`flex gap-2 ${row.color}`} style={{ paddingLeft: `${row.indent * 16}px` }}>
              <span>{row.label}</span>
            </div>
          ))}
        </div>
      </DiagramSlot>

      {/* Section 2 — Line item definitions */}
      <SectionHeader
        step={2}
        title="What each line item means"
        explanation="Understanding the difference between gross profit, operating profit, and net profit tells you WHERE your business is leaking money."
      />
      <div className="space-y-3">
        {[
          { term: 'Revenue', definition: 'Total income from sales of goods or services. Top line. Does not mean profit.', example: 'You invoice a client KES 200,000 for a project = KES 200,000 revenue.' },
          { term: 'COGS (Cost of Goods Sold)', definition: 'Direct costs to deliver your product/service: materials, direct labour, subcontractors. Does NOT include overhead.', example: 'Project labour (KES 60,000) + subcontractor (KES 20,000) = KES 80,000 COGS.' },
          { term: 'Gross Profit', definition: 'Revenue − COGS. The profit before you pay your overhead. Service businesses should target 40–60%.', example: 'KES 200,000 − KES 80,000 = KES 120,000 gross profit (60% margin).' },
          { term: 'Operating Expenses (OpEx)', definition: 'Fixed overhead: rent, admin salaries, utilities, marketing, transport. These costs exist whether or not you have clients.', example: 'Rent KES 30K + Salaries KES 60K + Marketing KES 10K = KES 100K/month OpEx.' },
          { term: 'Net Profit', definition: 'The bottom line. What remains after all costs, interest, and tax. This is the actual wealth your business creates.', example: 'Service business benchmark: 10–20% net margin.' },
        ].map(item => (
          <div key={item.term} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{item.term}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{item.definition}</p>
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1.5 italic">Example: {item.example}</p>
          </div>
        ))}
      </div>

      {/* Section 3 — Interactive */}
      <SectionHeader
        step={3}
        title="Build your P&L"
        explanation="Enter your figures to see your P&L instantly. The margin benchmarks show how you compare to service business norms."
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <FormInput label="Revenue" value={inputs.revenue} onChange={set('revenue')} format="currency" prefix="KES" />
        <FormInput label="COGS" value={inputs.cogs} onChange={set('cogs')} format="currency" prefix="KES" />
        <FormInput label="Operating Expenses" value={inputs.operatingExpenses} onChange={set('operatingExpenses')} format="currency" prefix="KES" />
        <FormInput label="Interest" value={inputs.interest} onChange={set('interest')} format="currency" prefix="KES" />
        <FormInput label="Tax" value={inputs.tax} onChange={set('tax')} format="currency" prefix="KES" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <MetricCard label="Gross Margin" value={formatPct(result.grossMargin)} subtitle="Target: 40–60%" icon="📈" status={result.grossMargin >= 40 ? 'success' : result.grossMargin >= 25 ? 'warning' : 'error'} />
        <MetricCard label="Operating Margin" value={formatPct(result.operatingMargin)} subtitle="Target: 15–25%" icon="⚙️" status={result.operatingMargin >= 15 ? 'success' : result.operatingMargin >= 8 ? 'warning' : 'error'} />
        <MetricCard label="Net Margin" value={formatPct(result.netMargin)} subtitle="Target: 10–20%" icon="💰" status={result.netMargin >= 10 ? 'success' : result.netMargin >= 5 ? 'warning' : 'error'} />
      </div>

      <ResultDisplay
        title="Your P&L Statement"
        status={result.status === 'healthy' ? 'success' : result.status === 'marginal' ? 'warning' : 'error'}
        sections={[
          { title: 'Revenue', rows: [{ label: 'Total Revenue', value: formatKES(inputs.revenue), highlight: true }] },
          { title: 'Cost of Sales', rows: [
            { label: 'COGS', value: `(${formatKES(inputs.cogs)})` },
            { label: 'Gross Profit', value: formatKES(result.grossProfit), highlight: true, sublabel: formatPct(result.grossMargin) },
          ]},
          { title: 'Operating Expenses', rows: [
            { label: 'OpEx', value: `(${formatKES(inputs.operatingExpenses)})` },
            { label: 'Operating Profit', value: formatKES(result.operatingProfit), highlight: true, sublabel: formatPct(result.operatingMargin) },
          ]},
          { title: 'Below the Line', rows: [
            { label: 'Interest', value: `(${formatKES(inputs.interest)})` },
            { label: 'Tax', value: `(${formatKES(inputs.tax)})` },
            { label: 'Net Profit', value: formatKES(result.netProfit), highlight: true, sublabel: formatPct(result.netMargin), status: result.netProfit >= 0 ? 'success' : 'error' },
          ]},
        ]}
        footer={`Benchmarks: ${benchmarks.map(b => `${b.metric} ${b.status === 'good' ? '✓' : '✗'}`).join(' · ')}`}
      />

      {/* Section 4 — Benchmarks */}
      <SectionHeader
        step={4}
        title="Industry benchmarks for service businesses"
        explanation="East African service businesses (consulting, agencies, tech) typically operate within these margin ranges. Your margins tell you where to focus improvement efforts."
      />
      <div className="space-y-2">
        {benchmarks.map(b => (
          <div key={b.metric} className={`flex items-center justify-between rounded-lg border p-3 ${b.status === 'good' ? 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20' : b.status === 'fair' ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' : 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20'}`}>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{b.metric}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{b.note}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-gray-900 dark:text-white">{formatPct(b.yourValue)}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Target: {formatPct(b.target)}</p>
            </div>
          </div>
        ))}
      </div>

      {result.netMargin < 5 && (
        <AlertBanner type="warning" title="Low margin — what to do" message="1) Raise prices (fastest impact). 2) Reduce COGS — negotiate with suppliers. 3) Cut non-essential operating expenses. 4) Increase revenue without proportional cost increase." />
      )}

      <CaseStudyCard
        company="Kenyan Technology Agency"
        scenario="Agency had 52% gross margin but only 3% net margin. Owner couldn't understand why profits disappeared."
        outcome="Found that OpEx was 85% of gross profit. Reduced office rent (moved to co-working) and cut 2 underutilised subscriptions. Net margin rose to 14% in 3 months."
        lesson="Gross margin tells you if your pricing is right. Net margin tells you if your cost structure is right. You need both."
        tag="P&L Analysis"
      />
    </LearningLayout>
  )
}
