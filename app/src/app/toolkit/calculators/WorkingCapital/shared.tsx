/** Working Capital / Cash Conversion Cycle — pure calculation functions (no React) */

export interface WorkingCapitalInputs {
  wipDays: number         // days WIP sits before invoicing (service businesses)
  receivablesDays: number // days to collect after invoicing (DSO)
  payablesDays: number    // days before paying suppliers (DPO)
  annualRevenue: number   // KES — used to calculate cash locked
}

export type CCCStatus = 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical'

export interface WorkingCapitalResult {
  ccc: number             // days: wipDays + receivablesDays - payablesDays
  cashLocked: number      // KES: (annualRevenue / 365) * ccc
  dailyRevenue: number    // KES per day
  status: CCCStatus
  targetCCC: number       // target = 45 days
  cashToFree: number      // cash freed if you hit target CCC
  recommendations: string[]
}

function cccStatus(ccc: number): CCCStatus {
  if (ccc < 30) return 'Excellent'
  if (ccc < 60) return 'Good'
  if (ccc < 90) return 'Needs Improvement'
  return 'Critical'
}

export function calculateWorkingCapital(inputs: WorkingCapitalInputs): WorkingCapitalResult {
  const ccc = inputs.wipDays + inputs.receivablesDays - inputs.payablesDays
  const dailyRevenue = inputs.annualRevenue / 365
  const cashLocked = dailyRevenue * Math.max(0, ccc)

  const TARGET_CCC = 45
  const targetCashLocked = dailyRevenue * Math.max(0, TARGET_CCC)
  const cashToFree = Math.max(0, cashLocked - targetCashLocked)

  const recommendations: string[] = []

  if (inputs.wipDays > 30) {
    recommendations.push(`Reduce WIP: Invoice at milestones instead of project completion — target 15–20 days`)
  }
  if (inputs.wipDays > 0) {
    recommendations.push(`Require 30–50% upfront deposit on new projects to cut WIP days`)
  }
  if (inputs.receivablesDays > 45) {
    recommendations.push(`Collections too slow (${inputs.receivablesDays} days) — automate reminders, offer 2% early-pay discount`)
  }
  if (inputs.payablesDays < 30) {
    recommendations.push(`Negotiate Net 30–45 terms with suppliers to extend DPO from ${inputs.payablesDays} days`)
  }
  if (ccc > 90) {
    recommendations.push(`Critical: KES ${(cashLocked / 1_000_000).toFixed(1)}M locked in working capital — treat as top priority`)
  }
  if (recommendations.length === 0) {
    recommendations.push('Excellent working capital management — maintain discipline and review quarterly')
  }

  return {
    ccc,
    cashLocked,
    dailyRevenue,
    status: cccStatus(ccc),
    targetCCC: TARGET_CCC,
    cashToFree,
    recommendations,
  }
}
