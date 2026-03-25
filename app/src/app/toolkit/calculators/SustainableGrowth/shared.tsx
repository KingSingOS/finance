/** Sustainable Growth Rate — pure calculation functions (no React) */

export interface SustainableGrowthInputs {
  currentRevenue: number             // monthly KES
  netProfit: number                  // monthly KES
  retentionRate: number              // % of profit reinvested (0-100), default 50
  workingCapitalRequirement: number  // as % of revenue (0-100), default 20
  currentDebt: number                // total KES
  targetDebtToEquity: number         // ratio, default 1.0
  currentGrowthRate?: number         // optional YoY %, if known
}

export type GrowthStatus = 'Opportunity' | 'Optimal' | 'Overstretched' | 'Unknown'

export interface SustainableGrowthResult {
  sustainableGrowthRate: number      // % per year
  maxGrowthWithoutFunding: number    // % — same as SGR in simplified model
  currentGrowthRate: number | null
  fundingGapIfExceeding: number      // KES annual — how much external funding needed
  netProfitMargin: number            // %
  retainedEarningsMonthly: number    // KES
  status: GrowthStatus
  growthGap: number | null           // currentGrowthRate - sustainableGrowthRate
  recommendations: string[]
}

export function calculateSustainableGrowth(inputs: SustainableGrowthInputs): SustainableGrowthResult {
  const annualRevenue = inputs.currentRevenue * 12
  const annualProfit = inputs.netProfit * 12

  const npm = annualRevenue > 0 ? annualProfit / annualRevenue : 0  // as decimal
  const b = inputs.retentionRate / 100  // retention rate as decimal

  // Higgins SGR: (NPM × b) / (1 - NPM × b)
  const numerator = npm * b
  const denominator = 1 - numerator
  const sustainableGrowthRate = denominator > 0 ? (numerator / denominator) * 100 : 0

  const maxGrowthWithoutFunding = sustainableGrowthRate

  const retainedEarningsMonthly = inputs.netProfit * (inputs.retentionRate / 100)

  const currentGrowthRate = inputs.currentGrowthRate ?? null
  const growthGap = currentGrowthRate !== null ? currentGrowthRate - sustainableGrowthRate : null

  // If growing faster than sustainable rate, calculate funding gap
  let fundingGapIfExceeding = 0
  if (growthGap !== null && growthGap > 0) {
    // Additional revenue from excess growth requires working capital
    const excessGrowthRevenue = annualRevenue * (growthGap / 100)
    fundingGapIfExceeding = excessGrowthRevenue * (inputs.workingCapitalRequirement / 100)
  }

  let status: GrowthStatus = 'Unknown'
  if (currentGrowthRate !== null) {
    if (currentGrowthRate < sustainableGrowthRate - 2) status = 'Opportunity'
    else if (currentGrowthRate <= sustainableGrowthRate + 2) status = 'Optimal'
    else status = 'Overstretched'
  }

  const recommendations: string[] = []
  if (npm < 0.05) {
    recommendations.push('Net margin below 5% — focus on profitability before growth. Sustainable growth requires profitable operations.')
  }
  if (inputs.retentionRate < 40) {
    recommendations.push(`Reinvesting only ${inputs.retentionRate}% of profit. Raising retention rate to 60%+ would increase sustainable growth rate to ${((npm * 0.6) / (1 - npm * 0.6) * 100).toFixed(1)}%.`)
  }
  if (status === 'Overstretched' && growthGap !== null) {
    recommendations.push(`Growing ${growthGap.toFixed(1)}% faster than sustainable — requires external funding or growth must slow. Without funding: cash crisis risk.`)
  }
  if (status === 'Opportunity') {
    recommendations.push('Growing slower than sustainable rate — you have capacity to accelerate. Increase marketing spend or expand capacity.')
  }
  if (inputs.workingCapitalRequirement > 25) {
    recommendations.push('High working capital requirement limits sustainable growth. Reduce CCC (Days Sales Outstanding / WIP) to free up capacity.')
  }
  if (recommendations.length === 0) {
    recommendations.push('Growth rate aligns with retained earnings capacity. Maintain financial discipline and monitor monthly.')
  }

  return {
    sustainableGrowthRate,
    maxGrowthWithoutFunding,
    currentGrowthRate,
    fundingGapIfExceeding,
    netProfitMargin: npm * 100,
    retainedEarningsMonthly,
    status,
    growthGap,
    recommendations,
  }
}
