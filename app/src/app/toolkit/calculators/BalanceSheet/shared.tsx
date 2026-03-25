/** Balance Sheet — fundamental accounting equation and ratios */

export interface BalanceSheetInputs {
  // Current Assets
  cash: number
  accountsReceivable: number
  inventory: number
  otherCurrentAssets: number
  // Non-Current Assets
  fixedAssets: number      // PPE at book value
  otherLongTermAssets: number
  // Current Liabilities
  accountsPayable: number
  shortTermDebt: number
  otherCurrentLiabilities: number
  // Non-Current Liabilities
  longTermDebt: number
  otherLongTermLiabilities: number
  // Equity
  ownersEquity: number
  retainedEarnings: number
}

export type HealthStatus = 'Healthy' | 'Caution' | 'At Risk' | 'Critical'

export interface BalanceSheetResult {
  // Asset totals
  totalCurrentAssets: number
  totalNonCurrentAssets: number
  totalAssets: number
  // Liability totals
  totalCurrentLiabilities: number
  totalNonCurrentLiabilities: number
  totalLiabilities: number
  // Equity
  totalEquity: number
  // Balance check
  liabilitiesPlusEquity: number
  isBalanced: boolean
  balanceGap: number          // totalAssets - (liabilities + equity)
  // Ratios
  currentRatio: number        // current assets / current liabilities
  quickRatio: number          // (current assets - inventory) / current liabilities
  debtToEquityRatio: number   // total liabilities / total equity
  workingCapital: number      // current assets - current liabilities
  debtRatio: number           // total liabilities / total assets
  // Health
  liquidityStatus: HealthStatus
  solvencyStatus: HealthStatus
  overallStatus: HealthStatus
  recommendations: string[]
}

function liquidityHealth(currentRatio: number): HealthStatus {
  if (currentRatio >= 2.0) return 'Healthy'
  if (currentRatio >= 1.5) return 'Caution'
  if (currentRatio >= 1.0) return 'At Risk'
  return 'Critical'
}

function solvencyHealth(debtToEquity: number): HealthStatus {
  if (debtToEquity <= 0.5) return 'Healthy'
  if (debtToEquity <= 1.0) return 'Caution'
  if (debtToEquity <= 2.0) return 'At Risk'
  return 'Critical'
}

function worstOf(a: HealthStatus, b: HealthStatus): HealthStatus {
  const order: Record<HealthStatus, number> = { Healthy: 0, Caution: 1, 'At Risk': 2, Critical: 3 }
  return order[a] >= order[b] ? a : b
}

export function calculateBalanceSheet(inputs: BalanceSheetInputs): BalanceSheetResult {
  // Totals
  const totalCurrentAssets      = inputs.cash + inputs.accountsReceivable + inputs.inventory + inputs.otherCurrentAssets
  const totalNonCurrentAssets   = inputs.fixedAssets + inputs.otherLongTermAssets
  const totalAssets             = totalCurrentAssets + totalNonCurrentAssets

  const totalCurrentLiabilities    = inputs.accountsPayable + inputs.shortTermDebt + inputs.otherCurrentLiabilities
  const totalNonCurrentLiabilities = inputs.longTermDebt + inputs.otherLongTermLiabilities
  const totalLiabilities           = totalCurrentLiabilities + totalNonCurrentLiabilities

  const totalEquity = inputs.ownersEquity + inputs.retainedEarnings

  const liabilitiesPlusEquity = totalLiabilities + totalEquity
  const balanceGap = totalAssets - liabilitiesPlusEquity
  const isBalanced = Math.abs(balanceGap) < 1  // allow 1 KES rounding

  // Ratios
  const currentRatio = totalCurrentLiabilities > 0
    ? totalCurrentAssets / totalCurrentLiabilities : Infinity
  const quickRatio = totalCurrentLiabilities > 0
    ? (totalCurrentAssets - inputs.inventory) / totalCurrentLiabilities : Infinity
  const debtToEquityRatio = totalEquity > 0
    ? totalLiabilities / totalEquity : Infinity
  const workingCapital = totalCurrentAssets - totalCurrentLiabilities
  const debtRatio = totalAssets > 0 ? totalLiabilities / totalAssets : 0

  // Health assessment
  const liquidityStatus = liquidityHealth(currentRatio)
  const solvencyStatus  = solvencyHealth(debtToEquityRatio)
  const overallStatus   = worstOf(liquidityStatus, solvencyStatus)

  const recommendations: string[] = []
  if (currentRatio < 1.5) {
    recommendations.push(`Current ratio ${currentRatio.toFixed(2)} — below 1.5 target. Improve collections or reduce short-term debt.`)
  }
  if (quickRatio < 1.0) {
    recommendations.push(`Quick ratio ${quickRatio.toFixed(2)} — below 1.0. Reduce inventory dependence; accelerate receivables.`)
  }
  if (debtToEquityRatio > 1.0) {
    recommendations.push(`Debt-to-equity ${debtToEquityRatio.toFixed(2)} — above 1.0 target. Reduce liabilities or inject equity.`)
  }
  if (workingCapital < 0) {
    recommendations.push(`Negative working capital (${workingCapital.toLocaleString()} KES) — urgent: cannot meet short-term obligations.`)
  }
  if (!isBalanced) {
    recommendations.push(`Balance sheet does not balance (gap: KES ${Math.abs(balanceGap).toLocaleString()}). Check input figures.`)
  }
  if (recommendations.length === 0) {
    recommendations.push('Balance sheet is healthy. Review ratios quarterly and maintain discipline.')
  }

  return {
    totalCurrentAssets, totalNonCurrentAssets, totalAssets,
    totalCurrentLiabilities, totalNonCurrentLiabilities, totalLiabilities,
    totalEquity, liabilitiesPlusEquity, isBalanced, balanceGap,
    currentRatio, quickRatio, debtToEquityRatio, workingCapital, debtRatio,
    liquidityStatus, solvencyStatus, overallStatus, recommendations,
  }
}
