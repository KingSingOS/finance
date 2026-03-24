/** P&L Statement — pure calculation functions (no React) */

export interface PLInputs {
  revenue: number           // KES
  cogs: number              // KES
  operatingExpenses: number // KES (rent, salaries, utilities, marketing, etc.)
  interest: number          // KES
  tax: number               // KES
}

export interface PLResult {
  grossProfit: number
  grossMargin: number       // %
  operatingProfit: number
  operatingMargin: number   // %
  netProfit: number
  netMargin: number         // %
  burnRate: number          // monthly (if loss-making)
  cogsRatio: number         // %
  opexRatio: number         // %
  status: 'healthy' | 'marginal' | 'loss'
}

export interface PLBenchmark {
  metric: string
  yourValue: number
  target: number
  status: 'good' | 'fair' | 'poor'
  note: string
}

export function calculatePL(inputs: PLInputs): PLResult {
  const grossProfit = inputs.revenue - inputs.cogs
  const operatingProfit = grossProfit - inputs.operatingExpenses
  const netProfit = operatingProfit - inputs.interest - inputs.tax

  const grossMargin = inputs.revenue > 0 ? (grossProfit / inputs.revenue) * 100 : 0
  const operatingMargin = inputs.revenue > 0 ? (operatingProfit / inputs.revenue) * 100 : 0
  const netMargin = inputs.revenue > 0 ? (netProfit / inputs.revenue) * 100 : 0
  const cogsRatio = inputs.revenue > 0 ? (inputs.cogs / inputs.revenue) * 100 : 0
  const opexRatio = inputs.revenue > 0 ? (inputs.operatingExpenses / inputs.revenue) * 100 : 0

  const burnRate = netProfit < 0 ? Math.abs(netProfit) : 0

  let status: PLResult['status'] = 'healthy'
  if (netMargin < 0) status = 'loss'
  else if (netMargin < 8) status = 'marginal'

  return {
    grossProfit,
    grossMargin,
    operatingProfit,
    operatingMargin,
    netProfit,
    netMargin,
    burnRate,
    cogsRatio,
    opexRatio,
    status,
  }
}

/** Industry benchmarks for service businesses */
export function getPLBenchmarks(result: PLResult): PLBenchmark[] {
  return [
    {
      metric: 'Gross Margin',
      yourValue: result.grossMargin,
      target: 45,
      status: result.grossMargin >= 45 ? 'good' : result.grossMargin >= 30 ? 'fair' : 'poor',
      note: 'Service businesses: 40–60%',
    },
    {
      metric: 'Operating Margin',
      yourValue: result.operatingMargin,
      target: 20,
      status: result.operatingMargin >= 20 ? 'good' : result.operatingMargin >= 10 ? 'fair' : 'poor',
      note: 'Target 15–25% for service businesses',
    },
    {
      metric: 'Net Margin',
      yourValue: result.netMargin,
      target: 15,
      status: result.netMargin >= 15 ? 'good' : result.netMargin >= 8 ? 'fair' : 'poor',
      note: 'Industry benchmark: 10–20%',
    },
  ]
}
