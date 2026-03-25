/** Founder Salary Affordability — pure calculation functions (no React) */

export interface FounderSalaryInputs {
  currentRevenue: number          // monthly KES
  currentProfit: number           // monthly KES (net profit after costs)
  cashBalance: number             // current cash KES
  monthlyBurnRate: number         // monthly expenses KES
  foundersCount: number           // number of founders (1-5)
  desiredSalaryPerFounder: number // monthly KES per founder
  marketSalaryBenchmark?: number  // optional: what role would pay externally
}

export type AffordabilityStatus = 'Affordable' | 'Marginal' | 'Not Affordable'

export interface FounderSalaryResult {
  affordabilityScore: number       // 0-100
  affordabilityStatus: AffordabilityStatus
  maxAffordableSalary: number      // per founder, monthly KES
  totalFounderCost: number         // all founders, monthly
  cashImpact: number               // annual KES
  runwayMonthsWithSalary: number   // months runway after paying salary
  runwayMonthsCurrent: number      // months runway now
  breakEvenMonthlyRevenue: number  // KES revenue needed to afford desired salary
  profitAfterSalary: number        // monthly KES remaining
  deferredCompMonthly: number      // gap between market and actual (if benchmark given)
  deferredCompAnnual: number
  recommendations: string[]
}

const SALARY_RATIO_LIMIT = 0.30  // salaries should be < 30% of annual profit

export function calculateFounderSalary(inputs: FounderSalaryInputs): FounderSalaryResult {
  const annualProfit = inputs.currentProfit * 12
  const totalFounderMonthly = inputs.desiredSalaryPerFounder * inputs.foundersCount
  const totalFounderAnnual = totalFounderMonthly * 12
  const cashImpact = totalFounderAnnual

  // Max affordable: 30% of monthly profit, split per founder
  const maxTotalMonthly = inputs.currentProfit * SALARY_RATIO_LIMIT
  const maxAffordableSalary = inputs.foundersCount > 0
    ? maxTotalMonthly / inputs.foundersCount
    : 0

  // Runway
  const effectiveBurn = inputs.monthlyBurnRate + totalFounderMonthly
  const runwayMonthsWithSalary = effectiveBurn > 0
    ? Math.floor(inputs.cashBalance / effectiveBurn)
    : Infinity
  const runwayMonthsCurrent = inputs.monthlyBurnRate > 0
    ? Math.floor(inputs.cashBalance / inputs.monthlyBurnRate)
    : Infinity

  // Profit after salary
  const profitAfterSalary = inputs.currentProfit - totalFounderMonthly

  // Break-even revenue: Need profit = totalFounderMonthly / 0.3
  const requiredMonthlyProfit = totalFounderMonthly / SALARY_RATIO_LIMIT
  const currentExpenses = inputs.currentRevenue - inputs.currentProfit
  const breakEvenMonthlyRevenue = currentExpenses + requiredMonthlyProfit

  // Deferred compensation
  const benchmark = inputs.marketSalaryBenchmark ?? 0
  const deferredCompMonthly = benchmark > inputs.desiredSalaryPerFounder
    ? (benchmark - inputs.desiredSalaryPerFounder) * inputs.foundersCount
    : 0
  const deferredCompAnnual = deferredCompMonthly * 12

  // Affordability checks
  const salaryVsProfit = annualProfit > 0 ? totalFounderAnnual / annualProfit : Infinity
  const adequateRunway = runwayMonthsWithSalary >= 6
  const withinRatio = salaryVsProfit <= SALARY_RATIO_LIMIT
  const hasProfit = inputs.currentProfit > totalFounderMonthly

  // Score (0-100)
  let affordabilityScore = 0
  if (annualProfit > 0) {
    // Salary-to-profit ratio component (0-60 pts)
    const ratioScore = Math.max(0, Math.min(60, (1 - salaryVsProfit / SALARY_RATIO_LIMIT) * 60))
    // Runway component (0-40 pts)
    const runwayScore = runwayMonthsWithSalary === Infinity ? 40
      : Math.min(40, (runwayMonthsWithSalary / 12) * 40)
    affordabilityScore = Math.round(ratioScore + runwayScore)
  }

  let affordabilityStatus: AffordabilityStatus = 'Not Affordable'
  if (withinRatio && adequateRunway && hasProfit) {
    affordabilityStatus = affordabilityScore >= 70 ? 'Affordable' : 'Marginal'
  } else if (salaryVsProfit <= 0.50 && runwayMonthsWithSalary >= 3) {
    affordabilityStatus = 'Marginal'
  }

  const recommendations: string[] = []
  if (!hasProfit) {
    recommendations.push(`Monthly salary (${inputs.foundersCount > 1 ? 'total' : ''} KES ${totalFounderMonthly.toLocaleString()}) exceeds monthly profit — business would run at a loss.`)
  } else if (!withinRatio) {
    recommendations.push(`Salary is ${(salaryVsProfit * 100).toFixed(0)}% of annual profit (limit: 30%). Target max KES ${maxAffordableSalary.toLocaleString()} per founder.`)
  }
  if (!adequateRunway) {
    recommendations.push(`With this salary, runway drops to ${runwayMonthsWithSalary} months. Target 6+ months before drawing full salary.`)
  }
  if (affordabilityStatus === 'Affordable') {
    recommendations.push(`Salary is within the 30% rule and runway is adequate. Review again after each quarter.`)
  }
  if (deferredCompAnnual > 0) {
    recommendations.push(`Tracking KES ${(deferredCompAnnual / 1000).toFixed(0)}K/year in deferred comp. Plan to close this gap as the business grows.`)
  }
  if (inputs.currentProfit < 0) {
    recommendations.push(`Business is currently loss-making — no founder salary is advisable until profitable.`)
  }

  return {
    affordabilityScore,
    affordabilityStatus,
    maxAffordableSalary,
    totalFounderCost: totalFounderMonthly,
    cashImpact,
    runwayMonthsWithSalary,
    runwayMonthsCurrent,
    breakEvenMonthlyRevenue,
    profitAfterSalary,
    deferredCompMonthly,
    deferredCompAnnual,
    recommendations,
  }
}
