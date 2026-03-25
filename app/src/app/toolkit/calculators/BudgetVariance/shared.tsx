/** Budget Variance — plan vs actual tracking */

export type BudgetCategory = 'Revenue' | 'COGS' | 'Opex' | 'Capex'
export type VarianceStatus = 'On Budget' | 'Over Budget' | 'Under Budget' | 'Favorable' | 'Unfavorable'

export interface BudgetLine {
  id: string
  name: string
  category: BudgetCategory
  budget: number
  actual: number
  /** true = higher actual is good (Revenue); false = lower actual is good (costs) */
  higherIsBetter: boolean
}

export interface BudgetLineResult extends BudgetLine {
  variance: number          // actual - budget
  variancePct: number       // (actual - budget) / budget * 100
  status: VarianceStatus
}

export interface BudgetSummary {
  lines: BudgetLineResult[]
  totalBudget: number
  totalActual: number
  totalVariance: number
  totalVariancePct: number
  revenueVariance: number
  cogsVariance: number
  opexVariance: number
  capexVariance: number
  onBudget: number
  favorable: number
  unfavorable: number
  byCategory: Record<BudgetCategory, { budget: number; actual: number; variance: number; lines: number }>
  netBudgetProfit: number     // Revenue budget - COGS budget - Opex budget
  netActualProfit: number     // Revenue actual - COGS actual - Opex actual
  profitVariance: number      // netActual - netBudget
}

const THRESHOLD_PCT = 5  // within 5% = On Budget

function getStatus(variancePct: number, higherIsBetter: boolean): VarianceStatus {
  const absPct = Math.abs(variancePct)
  if (absPct <= THRESHOLD_PCT) return 'On Budget'
  if (higherIsBetter) {
    return variancePct > 0 ? 'Favorable' : 'Unfavorable'
  } else {
    return variancePct > 0 ? 'Over Budget' : 'Under Budget'
  }
}

export function calculateBudgetVariance(lines: BudgetLine[]): BudgetSummary {
  const results: BudgetLineResult[] = lines.map(line => {
    const variance = line.actual - line.budget
    const variancePct = line.budget !== 0 ? (variance / line.budget) * 100 : 0
    const status = getStatus(variancePct, line.higherIsBetter)
    return { ...line, variance, variancePct, status }
  })

  const totalBudget = results.reduce((s, r) => s + r.budget, 0)
  const totalActual = results.reduce((s, r) => s + r.actual, 0)
  const totalVariance = totalActual - totalBudget
  const totalVariancePct = totalBudget !== 0 ? (totalVariance / totalBudget) * 100 : 0

  const byCategory: BudgetSummary['byCategory'] = {
    Revenue: { budget: 0, actual: 0, variance: 0, lines: 0 },
    COGS:    { budget: 0, actual: 0, variance: 0, lines: 0 },
    Opex:    { budget: 0, actual: 0, variance: 0, lines: 0 },
    Capex:   { budget: 0, actual: 0, variance: 0, lines: 0 },
  }
  for (const r of results) {
    const c = byCategory[r.category]
    c.budget += r.budget
    c.actual += r.actual
    c.variance += r.variance
    c.lines += 1
  }

  const revenueVariance = byCategory.Revenue.variance
  const cogsVariance    = byCategory.COGS.variance
  const opexVariance    = byCategory.Opex.variance
  const capexVariance   = byCategory.Capex.variance

  const onBudget    = results.filter(r => r.status === 'On Budget').length
  const favorable   = results.filter(r => r.status === 'Favorable' || r.status === 'Under Budget').length
  const unfavorable = results.filter(r => r.status === 'Over Budget' || r.status === 'Unfavorable').length

  const netBudgetProfit = byCategory.Revenue.budget - byCategory.COGS.budget - byCategory.Opex.budget
  const netActualProfit = byCategory.Revenue.actual - byCategory.COGS.actual - byCategory.Opex.actual
  const profitVariance  = netActualProfit - netBudgetProfit

  return {
    lines: results,
    totalBudget, totalActual, totalVariance, totalVariancePct,
    revenueVariance, cogsVariance, opexVariance, capexVariance,
    onBudget, favorable, unfavorable,
    byCategory,
    netBudgetProfit, netActualProfit, profitVariance,
  }
}

export const DEFAULT_LINES: BudgetLine[] = [
  { id: '1',  name: 'Product Revenue',      category: 'Revenue', budget: 800_000, actual: 870_000, higherIsBetter: true },
  { id: '2',  name: 'Service Revenue',       category: 'Revenue', budget: 200_000, actual: 175_000, higherIsBetter: true },
  { id: '3',  name: 'Cost of Goods Sold',    category: 'COGS',    budget: 320_000, actual: 360_000, higherIsBetter: false },
  { id: '4',  name: 'Direct Labour',         category: 'COGS',    budget: 120_000, actual: 118_000, higherIsBetter: false },
  { id: '5',  name: 'Salaries & Wages',      category: 'Opex',    budget: 250_000, actual: 265_000, higherIsBetter: false },
  { id: '6',  name: 'Rent & Utilities',      category: 'Opex',    budget: 60_000,  actual: 60_000,  higherIsBetter: false },
  { id: '7',  name: 'Marketing',             category: 'Opex',    budget: 80_000,  actual: 92_000,  higherIsBetter: false },
  { id: '8',  name: 'Technology & Software', category: 'Opex',    budget: 30_000,  actual: 28_500,  higherIsBetter: false },
  { id: '9',  name: 'Equipment Purchase',    category: 'Capex',   budget: 150_000, actual: 145_000, higherIsBetter: false },
  { id: '10', name: 'Vehicle',               category: 'Capex',   budget: 100_000, actual: 0,       higherIsBetter: false },
]
