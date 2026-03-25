/** Payroll Kenya — statutory deductions per KRA 2024 rules */
import {
  calculatePAYE,
  calculateNHIF,
  calculateNSSF,
  calculateHousingLevy,
  NSSF_RATE_2024,
  NSSF_LOWER_LIMIT,
  NSSF_UPPER_LIMIT,
  HOUSING_LEVY_RATE,
} from '../../data/kenya-tax-tables'

export interface PayrollInputs {
  grossSalary: number  // monthly KES
}

export interface PayrollResult {
  grossSalary: number
  paye: number
  nhif: number
  nssf: number              // employee share
  housingLevy: number       // employee share
  totalDeductions: number
  netPay: number
  // Employer costs
  employerNSSF: number      // mirrors employee share
  employerHousingLevy: number // 1.5% of gross
  totalEmployerCost: number  // gross + employer NSSF + employer housing levy
  // Percentages
  takeHomePercentage: number  // netPay / grossSalary * 100
  effectiveTaxRate: number    // paye / grossSalary * 100
}

export function calculatePayroll(inputs: PayrollInputs): PayrollResult {
  const gross = inputs.grossSalary
  const paye = calculatePAYE(gross)
  const nhif = calculateNHIF(gross)
  const nssf = calculateNSSF(gross)
  const housingLevy = calculateHousingLevy(gross)

  const totalDeductions = paye + nhif + nssf + housingLevy
  const netPay = gross - totalDeductions

  // Employer matches NSSF exactly; also pays 1.5% housing levy
  const tierI  = Math.min(gross, NSSF_LOWER_LIMIT) * NSSF_RATE_2024
  const tierII = gross > NSSF_LOWER_LIMIT
    ? Math.min(gross - NSSF_LOWER_LIMIT, NSSF_UPPER_LIMIT - NSSF_LOWER_LIMIT) * NSSF_RATE_2024
    : 0
  const employerNSSF = tierI + tierII
  const employerHousingLevy = gross * HOUSING_LEVY_RATE

  const totalEmployerCost = gross + employerNSSF + employerHousingLevy
  const takeHomePercentage = gross > 0 ? (netPay / gross) * 100 : 0
  const effectiveTaxRate   = gross > 0 ? (paye / gross) * 100 : 0

  return {
    grossSalary: gross,
    paye,
    nhif,
    nssf,
    housingLevy,
    totalDeductions,
    netPay,
    employerNSSF,
    employerHousingLevy,
    totalEmployerCost,
    takeHomePercentage,
    effectiveTaxRate,
  }
}
