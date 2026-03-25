/** Cash Leakage Detector — pure calculation functions (no React) */

export type Necessity = 'required' | 'useful' | 'optional'

export interface ExpenseItem {
  id: string
  name: string
  monthlyAmount: number
  necessity: Necessity
}

export interface CashLeakageInputs {
  expenses: ExpenseItem[]
  monthlyRevenue: number  // for % calculations
}

export type LeakageStatus = 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Critical'

export interface LeakItem {
  id: string
  name: string
  monthlyAmount: number
  annualAmount: number
  necessity: Necessity
  percentOfRevenue: number
}

export interface CashLeakageResult {
  totalMonthlyLeakage: number       // sum of optional expenses
  annualLeakageAmount: number
  totalMonthlyOptional: number      // optional (leakage)
  totalMonthlyUseful: number        // useful (watch)
  totalMonthlyRequired: number      // required (necessary)
  topLeaks: LeakItem[]
  leakageScore: number              // 0-100 (0=no leaks, 100=critical)
  leakagePercent: number            // optional as % of total expenses
  leakagePercentOfRevenue: number   // optional as % of revenue
  status: LeakageStatus
  totalMonthlyExpenses: number
  recommendations: string[]
}

function leakageStatusFromScore(score: number): LeakageStatus {
  if (score <= 20) return 'Excellent'
  if (score <= 40) return 'Good'
  if (score <= 60) return 'Fair'
  if (score <= 80) return 'Poor'
  return 'Critical'
}

export function calculateCashLeakage(inputs: CashLeakageInputs): CashLeakageResult {
  const expenses = inputs.expenses.filter(e => e.monthlyAmount > 0)

  const totalMonthlyExpenses = expenses.reduce((s, e) => s + e.monthlyAmount, 0)
  const totalMonthlyRequired = expenses
    .filter(e => e.necessity === 'required')
    .reduce((s, e) => s + e.monthlyAmount, 0)
  const totalMonthlyUseful = expenses
    .filter(e => e.necessity === 'useful')
    .reduce((s, e) => s + e.monthlyAmount, 0)
  const totalMonthlyOptional = expenses
    .filter(e => e.necessity === 'optional')
    .reduce((s, e) => s + e.monthlyAmount, 0)

  const totalMonthlyLeakage = totalMonthlyOptional
  const annualLeakageAmount = totalMonthlyLeakage * 12

  // Build top leaks list (optional expenses sorted by amount)
  const topLeaks: LeakItem[] = expenses
    .filter(e => e.necessity === 'optional')
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount)
    .map(e => ({
      id: e.id,
      name: e.name,
      monthlyAmount: e.monthlyAmount,
      annualAmount: e.monthlyAmount * 12,
      necessity: e.necessity,
      percentOfRevenue: inputs.monthlyRevenue > 0
        ? (e.monthlyAmount / inputs.monthlyRevenue) * 100
        : 0,
    }))

  const leakagePercent = totalMonthlyExpenses > 0
    ? (totalMonthlyOptional / totalMonthlyExpenses) * 100
    : 0
  const leakagePercentOfRevenue = inputs.monthlyRevenue > 0
    ? (totalMonthlyOptional / inputs.monthlyRevenue) * 100
    : 0

  // Score: based on leakage as % of total expenses
  const leakageScore = Math.min(100, Math.round(leakagePercent * 2))
  const status = leakageStatusFromScore(leakageScore)

  const recommendations: string[] = []
  if (topLeaks.length > 0) {
    const topLeak = topLeaks[0]
    recommendations.push(
      `Top leak: "${topLeak.name}" — KES ${topLeak.monthlyAmount.toLocaleString()}/month = KES ${topLeak.annualAmount.toLocaleString()}/year. Review necessity or cancel.`
    )
  }
  if (totalMonthlyOptional > 0) {
    recommendations.push(
      `Eliminating all optional expenses saves KES ${(annualLeakageAmount / 1000).toFixed(0)}K/year — enough to fund a growth investment.`
    )
  }
  if (leakagePercentOfRevenue > 10) {
    recommendations.push(
      `Optional expenses are ${leakagePercentOfRevenue.toFixed(1)}% of revenue — above the 5% benchmark. Audit each item this week.`
    )
  }
  if (totalMonthlyUseful > inputs.monthlyRevenue * 0.15) {
    recommendations.push(
      `"Useful" expenses are large — review each for ROI. Low-return useful expenses should be reclassified as optional.`
    )
  }
  if (status === 'Excellent' || status === 'Good') {
    recommendations.push('Low leakage detected. Run this audit quarterly to maintain discipline as the business scales.')
  }

  return {
    totalMonthlyLeakage,
    annualLeakageAmount,
    totalMonthlyOptional,
    totalMonthlyUseful,
    totalMonthlyRequired,
    topLeaks,
    leakageScore,
    leakagePercent,
    leakagePercentOfRevenue,
    status,
    totalMonthlyExpenses,
    recommendations,
  }
}

// Default expense categories for first-time users
export const DEFAULT_EXPENSES: ExpenseItem[] = [
  { id: '1', name: 'Rent / Office Space', monthlyAmount: 30_000, necessity: 'required' },
  { id: '2', name: 'Staff Salaries', monthlyAmount: 150_000, necessity: 'required' },
  { id: '3', name: 'Internet & Phone', monthlyAmount: 5_000, necessity: 'required' },
  { id: '4', name: 'Accounting / Legal', monthlyAmount: 10_000, necessity: 'required' },
  { id: '5', name: 'Software Subscriptions', monthlyAmount: 8_000, necessity: 'useful' },
  { id: '6', name: 'Marketing & Ads', monthlyAmount: 15_000, necessity: 'useful' },
  { id: '7', name: 'Travel & Transport', monthlyAmount: 12_000, necessity: 'useful' },
  { id: '8', name: 'Meals & Entertainment', monthlyAmount: 8_000, necessity: 'optional' },
  { id: '9', name: 'Unused SaaS Tools', monthlyAmount: 5_000, necessity: 'optional' },
  { id: '10', name: 'Office Supplies', monthlyAmount: 3_000, necessity: 'optional' },
]
