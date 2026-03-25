import { useState, useMemo } from 'react'
import { OpsLayout, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { calculateBalanceSheet, type BalanceSheetInputs, type HealthStatus } from './shared'
import { formatKES, fmtNum } from '../../utils/format'

const DEFAULTS: BalanceSheetInputs = {
  cash: 2_500_000,
  accountsReceivable: 1_800_000,
  inventory: 1_200_000,
  otherCurrentAssets: 300_000,
  fixedAssets: 8_000_000,
  otherLongTermAssets: 500_000,
  accountsPayable: 900_000,
  shortTermDebt: 1_500_000,
  otherCurrentLiabilities: 400_000,
  longTermDebt: 3_000_000,
  otherLongTermLiabilities: 200_000,
  ownersEquity: 5_000_000,
  retainedEarnings: 3_300_000,
}

const HEALTH_BADGE: Record<HealthStatus, string> = {
  Healthy:  'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
  Caution:  'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300',
  'At Risk':'bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300',
  Critical: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
}
const HEALTH_STATUS: Record<HealthStatus, 'success' | 'warning' | 'error'> = {
  Healthy: 'success', Caution: 'warning', 'At Risk': 'error', Critical: 'error',
}

function SectionRow({ label, value, bold }: { label: string; value: number; bold?: boolean }) {
  return (
    <div className={`flex justify-between py-1.5 px-3 ${bold ? 'font-semibold bg-gray-50 dark:bg-gray-800' : ''}`}>
      <span className={bold ? 'text-gray-900 dark:text-white text-sm' : 'text-gray-600 dark:text-gray-400 text-sm pl-3'}>{label}</span>
      <span className={bold ? 'text-gray-900 dark:text-white text-sm' : 'text-gray-700 dark:text-gray-300 text-sm'}>{formatKES(value, true)}</span>
    </div>
  )
}

export default function BalanceSheetOps() {
  const [inputs, setInputs] = useState<BalanceSheetInputs>(DEFAULTS)

  const result = useMemo(() => calculateBalanceSheet(inputs), [inputs])

  function set(field: keyof BalanceSheetInputs) {
    return (v: string) => setInputs(s => ({ ...s, [field]: parseFloat(v) || 0 }))
  }

  return (
    <OpsLayout
      title="Balance Sheet"
      subtitle="Assets = Liabilities + Equity"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {!result.isBalanced && (
        <AlertBanner
          type="error"
          title={`Balance sheet does not balance — gap of ${formatKES(Math.abs(result.balanceGap), true)}`}
          message="Assets must equal Liabilities + Equity. Check your input figures."
        />
      )}
      {result.overallStatus === 'Critical' && (
        <AlertBanner
          type="error"
          title="Critical financial health — immediate action required"
          message={result.recommendations[0]}
        />
      )}

      {/* Ratio summary */}
      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Current Ratio"
          value={result.currentRatio === Infinity ? '∞' : fmtNum(result.currentRatio, 2)}
          subtitle={result.liquidityStatus}
          icon="💧"
          status={HEALTH_STATUS[result.liquidityStatus]}
        />
        <MetricCard
          label="Quick Ratio"
          value={result.quickRatio === Infinity ? '∞' : fmtNum(result.quickRatio, 2)}
          subtitle="Excl. inventory"
          icon="⚡"
          status={result.quickRatio >= 1.0 ? 'success' : result.quickRatio >= 0.7 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Debt / Equity"
          value={result.debtToEquityRatio === Infinity ? '∞' : fmtNum(result.debtToEquityRatio, 2)}
          subtitle={result.solvencyStatus}
          icon="⚖️"
          status={HEALTH_STATUS[result.solvencyStatus]}
        />
        <MetricCard
          label="Working Capital"
          value={formatKES(result.workingCapital, true)}
          subtitle="Current assets − liabilities"
          icon="🔄"
          status={result.workingCapital >= 0 ? 'success' : 'error'}
        />
      </ResultCardsGrid>

      {/* Two-column balance sheet */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ASSETS */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-blue-50 dark:bg-blue-900/20 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-blue-700 dark:text-blue-300">ASSETS</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <div className="px-3 py-1.5">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Assets</p>
            </div>
            <div className="px-3 py-1.5 grid grid-cols-2 gap-2">
              <FormInput label="Cash & Equivalents" value={inputs.cash} onChange={set('cash')} format="currency" prefix="KES" />
              <FormInput label="Accounts Receivable" value={inputs.accountsReceivable} onChange={set('accountsReceivable')} format="currency" prefix="KES" />
              <FormInput label="Inventory" value={inputs.inventory} onChange={set('inventory')} format="currency" prefix="KES" />
              <FormInput label="Other Current Assets" value={inputs.otherCurrentAssets} onChange={set('otherCurrentAssets')} format="currency" prefix="KES" />
            </div>
            <SectionRow label="Total Current Assets" value={result.totalCurrentAssets} bold />

            <div className="px-3 py-1.5">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Non-Current Assets</p>
            </div>
            <div className="px-3 py-1.5 grid grid-cols-2 gap-2">
              <FormInput label="Fixed Assets (PPE)" value={inputs.fixedAssets} onChange={set('fixedAssets')} format="currency" prefix="KES" />
              <FormInput label="Other Long-term Assets" value={inputs.otherLongTermAssets} onChange={set('otherLongTermAssets')} format="currency" prefix="KES" />
            </div>
            <SectionRow label="Total Non-Current Assets" value={result.totalNonCurrentAssets} bold />

            <div className="flex justify-between py-2.5 px-3 bg-blue-50 dark:bg-blue-900/20 border-t-2 border-blue-200 dark:border-blue-700 font-bold">
              <span className="text-blue-700 dark:text-blue-300">TOTAL ASSETS</span>
              <span className="text-blue-700 dark:text-blue-300">{formatKES(result.totalAssets, true)}</span>
            </div>
          </div>
        </div>

        {/* LIABILITIES + EQUITY */}
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-red-50 dark:bg-red-900/20 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-bold text-red-700 dark:text-red-300">LIABILITIES + EQUITY</h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            <div className="px-3 py-1.5">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Current Liabilities</p>
            </div>
            <div className="px-3 py-1.5 grid grid-cols-2 gap-2">
              <FormInput label="Accounts Payable" value={inputs.accountsPayable} onChange={set('accountsPayable')} format="currency" prefix="KES" />
              <FormInput label="Short-term Debt" value={inputs.shortTermDebt} onChange={set('shortTermDebt')} format="currency" prefix="KES" />
              <FormInput label="Other Current Liabilities" value={inputs.otherCurrentLiabilities} onChange={set('otherCurrentLiabilities')} format="currency" prefix="KES" />
            </div>
            <SectionRow label="Total Current Liabilities" value={result.totalCurrentLiabilities} bold />

            <div className="px-3 py-1.5">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Non-Current Liabilities</p>
            </div>
            <div className="px-3 py-1.5 grid grid-cols-2 gap-2">
              <FormInput label="Long-term Debt" value={inputs.longTermDebt} onChange={set('longTermDebt')} format="currency" prefix="KES" />
              <FormInput label="Other Long-term Liabilities" value={inputs.otherLongTermLiabilities} onChange={set('otherLongTermLiabilities')} format="currency" prefix="KES" />
            </div>
            <SectionRow label="Total Non-Current Liabilities" value={result.totalNonCurrentLiabilities} bold />
            <SectionRow label="TOTAL LIABILITIES" value={result.totalLiabilities} bold />

            <div className="px-3 py-1.5">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Equity</p>
            </div>
            <div className="px-3 py-1.5 grid grid-cols-2 gap-2">
              <FormInput label="Owner's Equity" value={inputs.ownersEquity} onChange={set('ownersEquity')} format="currency" prefix="KES" />
              <FormInput label="Retained Earnings" value={inputs.retainedEarnings} onChange={set('retainedEarnings')} format="currency" prefix="KES" />
            </div>
            <SectionRow label="Total Equity" value={result.totalEquity} bold />

            <div className="flex justify-between py-2.5 px-3 bg-red-50 dark:bg-red-900/20 border-t-2 border-red-200 dark:border-red-700 font-bold">
              <span className="text-red-700 dark:text-red-300">TOTAL LIABILITIES + EQUITY</span>
              <span className="text-red-700 dark:text-red-300">{formatKES(result.liabilitiesPlusEquity, true)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Balance check */}
      <div className={`rounded-lg border-2 p-4 flex items-center gap-4 ${
        result.isBalanced
          ? 'border-green-200 dark:border-green-700 bg-green-50 dark:bg-green-900/10'
          : 'border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
      }`}>
        <div className="text-2xl">{result.isBalanced ? '✅' : '❌'}</div>
        <div>
          <p className="font-bold text-sm text-gray-900 dark:text-white">
            {result.isBalanced ? 'Balance sheet balances' : 'Balance sheet does NOT balance'}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Assets: {formatKES(result.totalAssets, true)} | Liabilities + Equity: {formatKES(result.liabilitiesPlusEquity, true)}
            {!result.isBalanced && ` | Gap: ${formatKES(Math.abs(result.balanceGap), true)}`}
          </p>
        </div>
        <div className="ml-auto">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${HEALTH_BADGE[result.overallStatus]}`}>
            Overall: {result.overallStatus}
          </span>
        </div>
      </div>

      {/* Health summary */}
      <CompactHeader title="Financial Health" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {result.recommendations.map((rec, i) => (
          <div key={i} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 flex gap-2">
            <span className="text-base shrink-0">{i === 0 && result.recommendations.length === 1 ? '✅' : '⚠️'}</span>
            <p className="text-xs text-gray-700 dark:text-gray-300">{rec}</p>
          </div>
        ))}
      </div>
    </OpsLayout>
  )
}
