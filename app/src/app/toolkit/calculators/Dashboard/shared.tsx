/** Dashboard — pure calculation functions (no React) */

export interface DashboardInputs {
  revenue: number     // monthly KES
  profit: number      // monthly KES
  cashBalance: number // current cash KES
  runway: number      // months of runway
  margin: number      // net margin %
  growthRate?: number // YoY revenue growth % (optional)
}

export type HealthStatus = 'Critical' | 'Poor' | 'Fair' | 'Good' | 'Excellent'

export interface DashboardResult {
  overallScore: number
  status: HealthStatus
  breakdown: {
    profitability: number  // 0-100
    runway: number         // 0-100
    growth: number         // 0-100
    efficiency: number     // 0-100
    liquidity: number      // 0-100
  }
  criticalIssues: string[]
  recommendations: string[]
}

// ── Component scorers ──────────────────────────────────────────────

function scoreProfitability(margin: number): number {
  if (margin >= 15) return 100
  if (margin <= 5) return 0
  return Math.round(((margin - 5) / 10) * 100)
}

function scoreRunway(months: number): number {
  if (months >= 6) return 100
  if (months <= 3) return 0
  return Math.round(((months - 3) / 3) * 100)
}

function scoreGrowth(rate?: number): number {
  if (rate === undefined || rate === null) return 50  // neutral if not provided
  if (rate >= 20) return 100
  if (rate >= 10) return 70
  if (rate >= 0) return 40
  return 10
}

function scoreEfficiency(revenue: number, profit: number): number {
  if (revenue <= 0) return 50
  const margin = (profit / revenue) * 100
  return Math.min(100, Math.max(0, Math.round(margin * 5)))
}

function scoreLiquidity(cashBalance: number, profit: number): number {
  if (profit <= 0) return 100  // no burn
  const monthsCovered = cashBalance / profit
  if (monthsCovered >= 5) return 100
  if (monthsCovered <= 0) return 0
  return Math.round((monthsCovered / 5) * 100)
}

function statusFromScore(score: number): HealthStatus {
  if (score >= 80) return 'Excellent'
  if (score >= 60) return 'Good'
  if (score >= 40) return 'Fair'
  if (score >= 30) return 'Poor'
  return 'Critical'
}

// ── Main calculation ───────────────────────────────────────────────

export function calculateDashboard(inputs: DashboardInputs): DashboardResult {
  const breakdown = {
    profitability: scoreProfitability(inputs.margin),
    runway: scoreRunway(inputs.runway),
    growth: scoreGrowth(inputs.growthRate),
    efficiency: scoreEfficiency(inputs.revenue, inputs.profit),
    liquidity: scoreLiquidity(inputs.cashBalance, inputs.profit),
  }

  // Weighted average: profitability 20%, runway 25%, growth 15%, efficiency 20%, liquidity 20%
  const overallScore = Math.round(
    breakdown.profitability * 0.20 +
    breakdown.runway       * 0.25 +
    breakdown.growth       * 0.15 +
    breakdown.efficiency   * 0.20 +
    breakdown.liquidity    * 0.20,
  )

  const status = statusFromScore(overallScore)

  const criticalIssues: string[] = []
  if (inputs.margin < 5) criticalIssues.push('Net margin below 5% — business is barely profitable')
  if (inputs.runway < 3) criticalIssues.push(`Only ${inputs.runway.toFixed(1)} months runway — take immediate action`)
  if (inputs.profit < 0) criticalIssues.push('Business is operating at a loss')
  if (inputs.cashBalance < inputs.revenue) criticalIssues.push('Cash balance below one month of revenue')

  const recommendations: string[] = []
  if (breakdown.profitability < 50) recommendations.push('Review pricing strategy — target 15%+ net margin')
  if (breakdown.runway < 50) recommendations.push('Reduce burn rate or raise capital to extend runway to 6+ months')
  if (breakdown.efficiency < 50) recommendations.push('Operating costs are high — identify and cut non-essential expenses')
  if (breakdown.liquidity < 50) recommendations.push('Build cash reserves — target 3–6 months of operating expenses')
  if ((inputs.growthRate ?? 0) < 0) recommendations.push('Revenue is declining — review sales pipeline and customer churn')
  if (recommendations.length === 0) recommendations.push('Maintain financial discipline and build reserves for growth investment')

  return { overallScore, status, breakdown, criticalIssues, recommendations }
}
