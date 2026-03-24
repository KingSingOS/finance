import { useState, useMemo } from 'react'
import { OpsLayout, QuickInputRow, ActionBar, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { FormInput } from '../../components/FormInput'
import { calculateCashForecast, type CashForecastInputs } from './shared'
import { formatKES } from '../../utils/format'

const DEFAULTS: CashForecastInputs = {
  startingCash: 1_500_000,
  weeklyRevenue: 250_000,
  weeklyExpenses: 220_000,
}

const statusColor = {
  healthy: 'text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20',
  warning: 'text-yellow-700 dark:text-yellow-300 bg-yellow-50 dark:bg-yellow-900/20',
  crisis: 'text-red-700 dark:text-red-300 bg-red-50 dark:bg-red-900/20',
}

export default function CashForecastOps() {
  const [inputs, setInputs] = useState<CashForecastInputs>(DEFAULTS)

  const set = (key: keyof CashForecastInputs) => (val: string) =>
    setInputs(p => ({ ...p, [key]: parseFloat(val) || 0 }))

  const result = useMemo(() => calculateCashForecast(inputs), [inputs])

  const runwayText = result.runwayWeeks === Infinity
    ? '13+ weeks (strong)'
    : `${result.runwayWeeks} weeks`

  return (
    <OpsLayout
      title="13-Week Cash Forecast"
      subtitle="Runway analysis & weekly projections"
      toolbar={
        <ActionBar actions={[
          { label: 'Reset', onClick: () => setInputs(DEFAULTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {/* Inputs */}
      <QuickInputRow>
        <FormInput label="Starting Cash" value={inputs.startingCash} onChange={set('startingCash')} format="currency" prefix="KES" />
        <FormInput label="Weekly Revenue" value={inputs.weeklyRevenue} onChange={set('weeklyRevenue')} format="currency" prefix="KES" />
        <FormInput label="Weekly Expenses" value={inputs.weeklyExpenses} onChange={set('weeklyExpenses')} format="currency" prefix="KES" />
      </QuickInputRow>

      {/* Runway alert */}
      {result.status === 'critical' && (
        <AlertBanner
          type="error"
          title={`🚨 Critical: ${runwayText} of runway`}
          message="Cash will run out within 8 weeks. Chase all outstanding invoices, delay non-essential expenses, and seek emergency financing immediately."
        />
      )}
      {result.status === 'warning' && (
        <AlertBanner
          type="warning"
          title={`⚠️ Warning: ${runwayText} of runway`}
          message="Runway under 13 weeks. Review expenses and accelerate collections now."
        />
      )}
      {result.status === 'healthy' && (
        <AlertBanner
          type="success"
          title={`✅ Healthy: ${runwayText} runway`}
          message="Cash position is strong. Consider building a 6-month emergency reserve."
        />
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          label="Cash Runway"
          value={runwayText}
          icon="⏳"
          status={result.runwayWeeks === Infinity || result.runwayWeeks >= 13 ? 'success' : result.runwayWeeks >= 8 ? 'warning' : 'error'}
        />
        <MetricCard
          label="Weekly Net Flow"
          value={formatKES(inputs.weeklyRevenue - inputs.weeklyExpenses, true)}
          subtitle={inputs.weeklyRevenue > inputs.weeklyExpenses ? 'Cash positive' : 'Cash burning'}
          icon={inputs.weeklyRevenue >= inputs.weeklyExpenses ? '📈' : '📉'}
          status={inputs.weeklyRevenue >= inputs.weeklyExpenses ? 'success' : 'error'}
        />
        <MetricCard
          label="13-Week Net"
          value={formatKES(result.totalNetFlow, true)}
          icon="📊"
          status={result.totalNetFlow >= 0 ? 'success' : 'error'}
        />
        <MetricCard
          label="Healthy Weeks"
          value={`${result.weeks.filter(w => w.status === 'healthy').length} / 13`}
          icon="✅"
          status={result.weeks.filter(w => w.status === 'healthy').length >= 10 ? 'success' : 'warning'}
        />
      </div>

      {/* 13-week table */}
      <CompactHeader title="13-Week Projection" />
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 text-left">
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Wk</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Revenue</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Expenses</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Net</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Ending Cash</th>
              <th className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {result.weeks.map(w => (
              <tr key={w.week} className="bg-white dark:bg-gray-900">
                <td className="px-3 py-1.5 text-gray-500 dark:text-gray-400 font-mono">{w.week}</td>
                <td className="px-3 py-1.5 text-gray-900 dark:text-gray-100">{formatKES(w.revenue, true)}</td>
                <td className="px-3 py-1.5 text-gray-900 dark:text-gray-100">{formatKES(w.expenses, true)}</td>
                <td className={`px-3 py-1.5 font-medium ${w.net >= 0 ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {w.net >= 0 ? '+' : ''}{formatKES(w.net, true)}
                </td>
                <td className="px-3 py-1.5 font-medium text-gray-900 dark:text-gray-100">{formatKES(w.endingCash, true)}</td>
                <td className="px-3 py-1.5">
                  <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${statusColor[w.status]}`}>
                    {w.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </OpsLayout>
  )
}
