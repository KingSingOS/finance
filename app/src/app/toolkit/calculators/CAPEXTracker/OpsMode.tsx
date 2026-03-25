import { useState, useMemo } from 'react'
import { OpsLayout, ActionBar, ResultCardsGrid, CompactHeader } from '../../layouts/OpsLayout'
import { MetricCard } from '../../components/MetricCard'
import { AlertBanner } from '../../components/AlertBanner'
import { calculateCAPEX, DEFAULT_PROJECTS, type CAPEXProject, type DepreciationMethod } from './shared'
import { formatKES, formatPct, fmtNum } from '../../utils/format'

let nextId = 100

export default function CAPEXTrackerOps() {
  const [projects, setProjects] = useState<CAPEXProject[]>(DEFAULT_PROJECTS)

  const summary = useMemo(() => calculateCAPEX(projects), [projects])

  function updateProject<K extends keyof CAPEXProject>(id: string, field: K, value: CAPEXProject[K]) {
    setProjects(ps => ps.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  function removeProject(id: string) {
    setProjects(ps => ps.filter(p => p.id !== id))
  }

  function addProject() {
    const id = String(nextId++)
    const now = new Date()
    setProjects(ps => [...ps, {
      id,
      name: 'New Asset',
      totalCost: 500_000,
      dateAcquired: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`,
      usefulLifeYears: 5,
      salvageValue: 0,
      method: 'straight-line',
    }])
  }

  const statusBadge = {
    'Active': 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300',
    'Fully Depreciated': 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    'Disposed': 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300',
  }

  return (
    <OpsLayout
      title="CAPEX Tracker"
      subtitle="Capital expenditure and depreciation management"
      toolbar={
        <ActionBar actions={[
          { label: 'Add Asset', onClick: addProject, variant: 'primary', icon: '+' },
          { label: 'Reset', onClick: () => setProjects(DEFAULT_PROJECTS), variant: 'secondary', icon: '↺' },
        ]} />
      }
    >
      {summary.projects.filter(p => p.remainingLifeYears <= 1 && p.status === 'Active').length > 0 && (
        <AlertBanner
          type="warning"
          title="Assets nearing end of life"
          message={summary.projects.filter(p => p.remainingLifeYears <= 1 && p.status === 'Active').map(p => `${p.name} (${p.remainingLifeYears.toFixed(1)}yr remaining)`).join(', ')}
        />
      )}

      <ResultCardsGrid cols={4}>
        <MetricCard label="Total Invested" value={formatKES(summary.totalInvested, true)} subtitle="Acquisition cost" icon="💰" status="neutral" />
        <MetricCard label="Book Value" value={formatKES(summary.totalBookValue, true)} subtitle="Net book value today" icon="📊" status={summary.totalBookValue / summary.totalInvested > 0.5 ? 'success' : 'warning'} />
        <MetricCard label="Annual Depreciation" value={formatKES(summary.totalAnnualDepreciation, true)} subtitle="P&L charge per year" icon="📉" status="neutral" />
        <MetricCard label="Active Assets" value={summary.assetsByStatus['Active']} subtitle={`${summary.assetsByStatus['Fully Depreciated']} fully depr.`} icon="🏭" status="neutral" />
      </ResultCardsGrid>

      {/* Asset table */}
      <CompactHeader title="Asset Register" />
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800">
              {['Asset Name', 'Cost', 'Acquired', 'Life', 'Method', 'Book Value', 'Rem. Life', 'Status', ''].map(h => (
                <th key={h} className="px-3 py-2 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {projects.map(project => {
              const res = summary.projects.find(r => r.id === project.id)
              return (
                <tr key={project.id} className="bg-white dark:bg-gray-900">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={project.name}
                      onChange={e => updateProject(project.id, 'name', e.target.value)}
                      className="w-32 bg-transparent text-gray-900 dark:text-white border border-transparent hover:border-gray-200 dark:hover:border-gray-700 rounded px-1 py-0.5 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={project.totalCost}
                      onChange={e => updateProject(project.id, 'totalCost', parseFloat(e.target.value) || 0)}
                      className="w-28 bg-transparent text-right text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="month"
                      value={project.dateAcquired}
                      onChange={e => updateProject(project.id, 'dateAcquired', e.target.value)}
                      className="bg-transparent text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      value={project.usefulLifeYears}
                      min={1}
                      max={50}
                      onChange={e => updateProject(project.id, 'usefulLifeYears', parseInt(e.target.value) || 1)}
                      className="w-12 bg-transparent text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded px-2 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                    />
                    <span className="text-xs text-gray-400 dark:text-gray-500 ml-0.5">yr</span>
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={project.method}
                      onChange={e => updateProject(project.id, 'method', e.target.value as DepreciationMethod)}
                      className="text-xs bg-transparent text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 rounded px-1 py-0.5 focus:outline-none"
                    >
                      <option value="straight-line">Straight-line</option>
                      <option value="declining-balance">Declining</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 text-right font-medium text-gray-900 dark:text-white text-xs">
                    {res ? formatKES(res.currentBookValue, true) : '—'}
                  </td>
                  <td className="px-3 py-2 text-xs text-gray-500 dark:text-gray-400">
                    {res ? `${res.remainingLifeYears.toFixed(1)}yr` : '—'}
                  </td>
                  <td className="px-3 py-2">
                    {res && (
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${statusBadge[res.status]}`}>
                        {res.status}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <button onClick={() => removeProject(project.id)} className="text-gray-400 hover:text-red-500 text-xs">✕</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="bg-gray-50 dark:bg-gray-800 font-semibold border-t-2 border-gray-200 dark:border-gray-700 text-sm">
              <td className="px-3 py-2">Total ({projects.length} assets)</td>
              <td className="px-3 py-2 text-right text-xs">{formatKES(summary.totalInvested, true)}</td>
              <td colSpan={3} />
              <td className="px-3 py-2 text-right text-xs">{formatKES(summary.totalBookValue, true)}</td>
              <td className="px-3 py-2 text-xs">{summary.weightedRemainingLife.toFixed(1)}yr avg</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ROI grid */}
      {summary.projects.some(p => p.roi !== null) && (
        <>
          <CompactHeader title="ROI by Asset" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {summary.projects.filter(p => p.roi !== null).map(p => (
              <div key={p.id} className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 space-y-2">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{p.name}</p>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">ROI</span>
                  <span className={p.roi! > 0 ? 'font-bold text-green-700 dark:text-green-300' : 'font-bold text-red-700 dark:text-red-300'}>{formatPct(p.roi!)}</span>
                </div>
                {p.paybackYears !== null && (
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500 dark:text-gray-400">Payback</span>
                    <span className="font-medium text-gray-700 dark:text-gray-300">{fmtNum(p.paybackYears, 1)} years</span>
                  </div>
                )}
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500 dark:text-gray-400">Book Value</span>
                  <span className="text-gray-700 dark:text-gray-300">{formatKES(p.currentBookValue, true)}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </OpsLayout>
  )
}
