/** Kenya Revenue Authority — Official 2024 Tax Tables
 *  Effective January 2024 (Finance Act 2023)
 *  CRITICAL: These rates must match KRA iTax exactly.
 */

// ── PAYE 2024 Tax Bands ────────────────────────────────────────────────────────
export const PAYE_BANDS_2024 = [
  { min: 0,      max: 24000,   rate: 0.10  },
  { min: 24001,  max: 32333,   rate: 0.25  },
  { min: 32334,  max: 500000,  rate: 0.30  },
  { min: 500001, max: 800000,  rate: 0.325 },
  { min: 800001, max: Infinity, rate: 0.35 },
] as const

// Personal Relief (monthly) — KES 28,800 per year
export const PERSONAL_RELIEF_MONTHLY = 2400

// ── NHIF Contribution Table 2024 ──────────────────────────────────────────────
export const NHIF_TABLE_2024 = [
  { min: 0,       max: 5999,    amount: 150  },
  { min: 6000,    max: 7999,    amount: 300  },
  { min: 8000,    max: 11999,   amount: 400  },
  { min: 12000,   max: 14999,   amount: 500  },
  { min: 15000,   max: 19999,   amount: 600  },
  { min: 20000,   max: 24999,   amount: 750  },
  { min: 25000,   max: 29999,   amount: 850  },
  { min: 30000,   max: 34999,   amount: 900  },
  { min: 35000,   max: 39999,   amount: 950  },
  { min: 40000,   max: 44999,   amount: 1000 },
  { min: 45000,   max: 49999,   amount: 1100 },
  { min: 50000,   max: 59999,   amount: 1200 },
  { min: 60000,   max: 69999,   amount: 1300 },
  { min: 70000,   max: 79999,   amount: 1400 },
  { min: 80000,   max: 89999,   amount: 1500 },
  { min: 90000,   max: 99999,   amount: 1600 },
  { min: 100000,  max: Infinity, amount: 1700 },
] as const

// ── NSSF 2024 ─────────────────────────────────────────────────────────────────
export const NSSF_RATE_2024 = 0.06
export const NSSF_LOWER_LIMIT = 7000    // Tier I ceiling
export const NSSF_UPPER_LIMIT = 36000   // Tier II ceiling

// ── Affordable Housing Levy 2024 ──────────────────────────────────────────────
export const HOUSING_LEVY_RATE = 0.015  // 1.5% of gross (both employee & employer)

// ── Helper functions ──────────────────────────────────────────────────────────

/** Calculate PAYE on monthly gross salary (after personal relief) */
export function calculatePAYE(grossSalary: number): number {
  let tax = 0
  let remainingIncome = grossSalary

  for (const band of PAYE_BANDS_2024) {
    if (remainingIncome <= 0) break
    const taxableInBand = band.max === Infinity
      ? remainingIncome
      : Math.min(band.max - band.min + (band.min === 0 ? 0 : 1), remainingIncome)
    tax += taxableInBand * band.rate
    remainingIncome -= taxableInBand
  }

  // Apply personal relief
  return Math.max(0, tax - PERSONAL_RELIEF_MONTHLY)
}

/** Calculate NHIF monthly contribution from gross salary */
export function calculateNHIF(grossSalary: number): number {
  for (const bracket of NHIF_TABLE_2024) {
    if (grossSalary >= bracket.min && grossSalary <= bracket.max) {
      return bracket.amount
    }
  }
  return NHIF_TABLE_2024[NHIF_TABLE_2024.length - 1].amount
}

/** Calculate NSSF monthly contribution (employee share)
 *  Tier I: First KES 7,000 @ 6% = max 420
 *  Tier II: KES 7,001–36,000 @ 6% = max 1,740
 *  Total employee max = KES 2,160 */
export function calculateNSSF(grossSalary: number): number {
  const tierI  = Math.min(grossSalary, NSSF_LOWER_LIMIT) * NSSF_RATE_2024
  const tierII = grossSalary > NSSF_LOWER_LIMIT
    ? Math.min(grossSalary - NSSF_LOWER_LIMIT, NSSF_UPPER_LIMIT - NSSF_LOWER_LIMIT) * NSSF_RATE_2024
    : 0
  return tierI + tierII
}

/** Calculate Affordable Housing Levy (employee share) */
export function calculateHousingLevy(grossSalary: number): number {
  return grossSalary * HOUSING_LEVY_RATE
}

/** Calculate full net pay after all statutory deductions */
export function calculateNetPay(grossSalary: number): number {
  return grossSalary
    - calculatePAYE(grossSalary)
    - calculateNHIF(grossSalary)
    - calculateNSSF(grossSalary)
    - calculateHousingLevy(grossSalary)
}
