import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { calculatePowerOfOne, type PowerOfOneInputs, type LeverResult } from './shared'
import { formatKES, formatPct } from '../../utils/format'

const DEFAULTS: PowerOfOneInputs = {
  currentRevenue: 2_000_000,
  currentCOGS: 800_000,
  currentOverhead: 600_000,
  currentVolume: 100,
  annualRevenue: 24_000_000,
  priceMultiplier: 1,
  volumeMultiplier: 1,
  cogsMultiplier: 1,
  overheadMultiplier: 1,
  receivablesMultiplier: 1,
  wipMultiplier: 1,
  payablesMultiplier: 1,
}

interface LeverCardProps {
  lever: LeverResult
  index: number
  multiplier: number
  onMultiplierChange: (val: string) => void
}

function LeverCard({ lever, index, multiplier, onMultiplierChange }: LeverCardProps) {
  const borderColor = lever.type === 'profit'
    ? 'border-blue-200 dark:border-blue-800'
    : 'border-purple-200 dark:border-purple-800'
  const badgeColor = lever.type === 'profit'
    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
    : 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'

  return (
    <div className={`rounded-lg border bg-white dark:bg-gray-900 p-4 space-y-3 ${borderColor}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{lever.icon}</span>
          <div>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Lever {index}
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{lever.description.split(' ').slice(0, 3).join(' ')}</p>
          </div>
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badgeColor}`}>
          {lever.type}
        </span>
      </div>

      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
          {lever.type === 'profit' ? 'Improvement %' : 'Days improved'}
        </p>
        <input
          type="number"
          min={0}
          max={lever.type === 'profit' ? 10 : 30}
          step={lever.type === 'profit' ? 0.5 : 1}
          value={multiplier}
          onChange={e => onMultiplierChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
        />
      </div>

      <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-500 dark:text-gray-400">Impact</p>
        <p className="text-lg font-bold text-green-700 dark:text-green-300">{formatKES(lever.impact, true)}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500">
          {lever.type === 'profit' ? 'extra profit' : 'cash freed'}
        </p>
      </div>
    </div>
  )
}

export default function PowerOfOneOps() {
  const [inputs, setInputs] = useState<PowerOfOneInputs>(DEFAULTS)

  const set = (key: keyof PowerOfOneInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculatePowerOfOne(inputs), [inputs])

  const levers = [
    { lever: result.lever1_Price, key: 'priceMultiplier' as const, mult: inputs.priceMultiplier ?? 1 },
    { lever: result.lever2_Volume, key: 'volumeMultiplier' as const, mult: inputs.volumeMultiplier ?? 1 },
    { lever: result.lever3_COGS, key: 'cogsMultiplier' as const, mult: inputs.cogsMultiplier ?? 1 },
    { lever: result.lever4_Overhead, key: 'overheadMultiplier' as const, mult: inputs.overheadMultiplier ?? 1 },
    { lever: result.lever5_Receivables, key: 'receivablesMultiplier' as const, mult: inputs.receivablesMultiplier ?? 1 },
    { lever: result.lever6_Inventory, key: 'wipMultiplier' as const, mult: inputs.wipMultiplier ?? 1 },
    { lever: result.lever7_Payables, key: 'payablesMultiplier' as const, mult: inputs.payablesMultiplier ?? 1 },
  ]

  const profitStatus = result.currentMargin >= 15 ? 'success' : result.currentMargin >= 5 ? 'warning' : 'error'

  return (
    <OpsLayout
      title="Power of One"
      subtitle="7 levers × small improvements = compound impact"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
          { label: 'All → 1%/1d', onClick: () => setInputs(p => ({ ...p, priceMultiplier: 1, volumeMultiplier: 1, cogsMultiplier: 1, overheadMultiplier: 1, receivablesMultiplier: 1, wipMultiplier: 1, payablesMultiplier: 1 })), variant: 'secondary' },
        ]} />
      }
    >
      {/* Business inputs */}
      <QuickInputRow>
        <FormInput label="Monthly Revenue" value={inputs.currentRevenue} onChange={set('currentRevenue')} format="currency" prefix="KES" />
        <FormInput label="Monthly COGS" value={inputs.currentCOGS} onChange={set('currentCOGS')} format="currency" prefix="KES" hint="Direct costs" />
        <FormInput label="Monthly Overhead" value={inputs.currentOverhead} onChange={set('currentOverhead')} format="currency" prefix="KES" hint="Operating costs" />
        <FormInput label="Annual Revenue" value={inputs.annualRevenue} onChange={set('annualRevenue')} format="currency" prefix="KES" hint="For cash levers" />
      </QuickInputRow>

      {/* Summary KPIs */}
      <ResultCardsGrid cols={4}>
        <MetricCard
          label="Current Profit"
          value={formatKES(result.currentProfit, true)}
          subtitle="Monthly"
          icon="💵"
          status={result.currentProfit > 0 ? profitStatus : 'error'}
        />
        <MetricCard
          label="Current Margin"
          value={formatPct(result.currentMargin)}
          subtitle="Net margin"
          icon="📊"
          status={profitStatus}
        />
        <MetricCard
          label="Total Profit Impact"
          value={formatKES(result.combinedProfitImpact, true)}
          subtitle="All 4 profit levers"
          icon="💰"
          status="success"
        />
        <MetricCard
          label="Total Cash Impact"
          value={formatKES(result.combinedCashImpact, true)}
          subtitle="All 3 cash levers"
          icon="⚡"
          status="success"
        />
      </ResultCardsGrid>

      {/* Grand total */}
      <AlertBanner
        type="success"
        title={`Combined Impact: ${formatKES(result.combinedImpact, true)} — ${formatPct((result.compoundMultiplier - 1) * 100)} compound improvement`}
        message={`Profit levers: ${formatKES(result.combinedProfitImpact, true)} extra profit. Cash levers: ${formatKES(result.combinedCashImpact, true)} freed. Compound multiplier: ${result.compoundMultiplier.toFixed(4)}×`}
      />

      {/* 7 Lever cards */}
      <CompactHeader title="The 7 Levers — Adjust Each to Model Scenarios" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {levers.map(({ lever, key, mult }, i) => (
          <LeverCard
            key={key}
            lever={lever}
            index={i + 1}
            multiplier={mult}
            onMultiplierChange={set(key)}
          />
        ))}
      </div>

      {/* Profit lever breakdown */}
      <CompactHeader title="Profit Levers vs Cash Levers" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 p-4 space-y-2">
          <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">Profit Levers (1-4)</p>
          {[result.lever1_Price, result.lever2_Volume, result.lever3_COGS, result.lever4_Overhead].map((l, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{l.icon} {l.description}</span>
              <span className="font-semibold text-blue-700 dark:text-blue-300">{formatKES(l.impact, true)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold border-t border-blue-200 dark:border-blue-800 pt-2">
            <span>Total profit impact</span>
            <span className="text-blue-700 dark:text-blue-300">{formatKES(result.combinedProfitImpact, true)}</span>
          </div>
        </div>

        <div className="rounded-lg border border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-900/10 p-4 space-y-2">
          <p className="text-xs font-bold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Cash Levers (5-7)</p>
          {[result.lever5_Receivables, result.lever6_Inventory, result.lever7_Payables].map((l, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{l.icon} {l.description}</span>
              <span className="font-semibold text-purple-700 dark:text-purple-300">{formatKES(l.impact, true)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold border-t border-purple-200 dark:border-purple-800 pt-2">
            <span>Total cash freed</span>
            <span className="text-purple-700 dark:text-purple-300">{formatKES(result.combinedCashImpact, true)}</span>
          </div>
        </div>
      </div>
    </OpsLayout>
  )
}
