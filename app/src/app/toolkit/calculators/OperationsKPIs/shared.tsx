/** Operations KPIs — track actual vs target performance */

export type KPIFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Quarterly' | 'Annually'
export type KPICategory = 'Financial' | 'Operational' | 'Customer' | 'Growth'
export type KPIStatus = 'On Track' | 'At Risk' | 'Off Track'
export type KPITrend = 'Up' | 'Down' | 'Flat'

export interface KPIItem {
  id: string
  name: string
  category: KPICategory
  actual: number
  target: number
  unit: string      // e.g. '%', 'KES', 'days', 'NPS', 'units'
  frequency: KPIFrequency
  higherIsBetter: boolean  // true for revenue/margin/NPS; false for cost/DSO
  previousActual?: number  // for trend calculation
}

export interface KPIResult {
  id: string
  name: string
  category: KPICategory
  actual: number
  target: number
  unit: string
  variancePct: number    // (actual - target) / target * 100
  varianceAbs: number    // actual - target
  status: KPIStatus
  trend: KPITrend | null
  achievementPct: number // actual / target * 100
  frequency: KPIFrequency
  higherIsBetter: boolean
}

export interface KPISummary {
  kpis: KPIResult[]
  totalKPIs: number
  onTrack: number
  atRisk: number
  offTrack: number
  overallScore: number   // % on-track
  byCategory: Record<KPICategory, { total: number; onTrack: number }>
}

const ON_TRACK_THRESHOLD   = -5    // variance > -5% = on track
const AT_RISK_THRESHOLD    = -15   // variance > -15% = at risk

function getStatus(variancePct: number, higherIsBetter: boolean): KPIStatus {
  // For lower-is-better KPIs, flip the sign
  const adjusted = higherIsBetter ? variancePct : -variancePct
  if (adjusted >= ON_TRACK_THRESHOLD) return 'On Track'
  if (adjusted >= AT_RISK_THRESHOLD)  return 'At Risk'
  return 'Off Track'
}

function getTrend(actual: number, previous: number | undefined, higherIsBetter: boolean): KPITrend | null {
  if (previous === undefined) return null
  const delta = actual - previous
  if (Math.abs(delta) / (Math.abs(previous) || 1) < 0.01) return 'Flat'
  const improving = higherIsBetter ? delta > 0 : delta < 0
  return improving ? 'Up' : 'Down'
}

export function calculateKPIs(kpis: KPIItem[]): KPISummary {
  const results: KPIResult[] = kpis.map(kpi => {
    const varianceAbs = kpi.actual - kpi.target
    const variancePct = kpi.target !== 0 ? (varianceAbs / kpi.target) * 100 : 0
    const achievementPct = kpi.target !== 0 ? (kpi.actual / kpi.target) * 100 : 0
    const status = getStatus(variancePct, kpi.higherIsBetter)
    const trend  = getTrend(kpi.actual, kpi.previousActual, kpi.higherIsBetter)

    return {
      id: kpi.id,
      name: kpi.name,
      category: kpi.category,
      actual: kpi.actual,
      target: kpi.target,
      unit: kpi.unit,
      variancePct,
      varianceAbs,
      status,
      trend,
      achievementPct,
      frequency: kpi.frequency,
      higherIsBetter: kpi.higherIsBetter,
    }
  })

  const onTrack  = results.filter(r => r.status === 'On Track').length
  const atRisk   = results.filter(r => r.status === 'At Risk').length
  const offTrack = results.filter(r => r.status === 'Off Track').length
  const overallScore = results.length > 0 ? (onTrack / results.length) * 100 : 0

  const categories: KPICategory[] = ['Financial', 'Operational', 'Customer', 'Growth']
  const byCategory = Object.fromEntries(
    categories.map(cat => {
      const catKPIs = results.filter(r => r.category === cat)
      return [cat, { total: catKPIs.length, onTrack: catKPIs.filter(r => r.status === 'On Track').length }]
    })
  ) as Record<KPICategory, { total: number; onTrack: number }>

  return { kpis: results, totalKPIs: results.length, onTrack, atRisk, offTrack, overallScore, byCategory }
}

export const DEFAULT_KPIS: KPIItem[] = [
  { id: '1', name: 'Monthly Revenue', category: 'Financial', actual: 1_800_000, target: 2_000_000, unit: 'KES', frequency: 'Monthly', higherIsBetter: true, previousActual: 1_650_000 },
  { id: '2', name: 'Net Profit Margin', category: 'Financial', actual: 14, target: 18, unit: '%', frequency: 'Monthly', higherIsBetter: true, previousActual: 12 },
  { id: '3', name: 'Cash Runway', category: 'Financial', actual: 4, target: 6, unit: 'months', frequency: 'Monthly', higherIsBetter: true },
  { id: '4', name: 'Order Delivery Time', category: 'Operational', actual: 3.5, target: 2, unit: 'days', frequency: 'Weekly', higherIsBetter: false, previousActual: 4 },
  { id: '5', name: 'Customer Satisfaction', category: 'Customer', actual: 78, target: 85, unit: 'NPS', frequency: 'Monthly', higherIsBetter: true, previousActual: 75 },
  { id: '6', name: 'Customer Retention', category: 'Customer', actual: 82, target: 90, unit: '%', frequency: 'Monthly', higherIsBetter: true },
  { id: '7', name: 'New Customers', category: 'Growth', actual: 12, target: 15, unit: 'clients', frequency: 'Monthly', higherIsBetter: true, previousActual: 10 },
  { id: '8', name: 'Revenue Growth', category: 'Growth', actual: 18, target: 20, unit: '%', frequency: 'Monthly', higherIsBetter: true },
]
