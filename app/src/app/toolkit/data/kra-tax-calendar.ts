/** KRA Tax Calendar Data — Kenya Revenue Authority obligations */

export interface TaxObligation {
  tax: string
  description: string
  frequency: 'Monthly' | 'Quarterly' | 'Annually'
  dueDate: string
  penalty: string
  iTaxLink?: string
}

export const KRA_TAX_OBLIGATIONS: TaxObligation[] = [
  {
    tax: 'PAYE',
    description: 'Pay As You Earn — employee income tax withheld by employer',
    frequency: 'Monthly',
    dueDate: '9th of the following month',
    penalty: '5% of tax due per month, up to 100% of tax due',
  },
  {
    tax: 'VAT',
    description: 'Value Added Tax (businesses with turnover ≥ KES 5M/year)',
    frequency: 'Monthly',
    dueDate: '20th of the following month',
    penalty: '5% of tax due + 1% per month interest',
  },
  {
    tax: 'WHT',
    description: 'Withholding Tax on payments to contractors, dividends, rent, royalties',
    frequency: 'Monthly',
    dueDate: '20th of the following month',
    penalty: '5% of tax due per month, up to 100% of tax due',
  },
  {
    tax: 'Instalment Tax',
    description: 'Corporate income tax installments (4 equal installments in tax year)',
    frequency: 'Quarterly',
    dueDate: '20th of 4th, 6th, 9th, and 12th month of accounting year',
    penalty: '20% interest per annum on underpaid installments',
  },
  {
    tax: 'Corporate Tax',
    description: 'Annual income tax return for companies (30% of taxable profit)',
    frequency: 'Annually',
    dueDate: '6 months after year end',
    penalty: '5% of tax due + 1% per month interest on balance',
  },
  {
    tax: 'Turnover Tax',
    description: 'For businesses with turnover KES 1M–25M/year (3% of gross sales)',
    frequency: 'Monthly',
    dueDate: '20th of the following month',
    penalty: '5% of tax due + 1% per month interest',
  },
  {
    tax: 'Rental Income Tax',
    description: '10% of gross rental receipts (residential), elect PAYE rates',
    frequency: 'Monthly',
    dueDate: '20th of the following month',
    penalty: '5% of tax due + 1% per month interest',
  },
  {
    tax: 'Housing Levy',
    description: 'Affordable Housing Levy — 1.5% employer + 1.5% employee of gross',
    frequency: 'Monthly',
    dueDate: '9th of the following month',
    penalty: '3% per month on unpaid amount',
  },
  {
    tax: 'NSSF',
    description: 'National Social Security Fund contributions',
    frequency: 'Monthly',
    dueDate: '9th of the following month',
    penalty: 'KES 200 per day overdue per employee',
  },
]

export type DeadlineStatus = 'upcoming' | 'due-soon' | 'overdue'

export interface TaxDeadline {
  date: Date
  tax: string
  description: string
  daysUntil: number
  status: DeadlineStatus
}

function getDeadlineStatus(deadline: Date, today: Date): DeadlineStatus {
  const daysUntil = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  if (daysUntil < 0) return 'overdue'
  if (daysUntil <= 7) return 'due-soon'
  return 'upcoming'
}

function getMonthName(monthIndex: number): string {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  return months[((monthIndex % 12) + 12) % 12] ?? 'January'
}

/** Get all KRA filing deadlines for a given year/month (1-indexed) */
export function getTaxDeadlinesForMonth(year: number, month: number): TaxDeadline[] {
  const today = new Date()
  const prevMonth = month === 1 ? 12 : month - 1
  const prevYear  = month === 1 ? year - 1 : year
  const deadlines: TaxDeadline[] = []

  const makeDays = (day: number, y = year, m = month): number =>
    Math.ceil((new Date(y, m - 1, day).getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

  // ── 9th deadlines (PAYE, Housing Levy, NSSF) ────────────────────────────
  const ninth = new Date(year, month - 1, 9)
  const prevLabel = `${getMonthName(prevMonth - 1)} ${prevYear}`

  for (const tax of ['PAYE', 'Housing Levy', 'NSSF']) {
    deadlines.push({
      date: ninth,
      tax,
      description: `${tax} for ${prevLabel}`,
      daysUntil: makeDays(9),
      status: getDeadlineStatus(ninth, today),
    })
  }

  // ── 20th deadlines (VAT, WHT, Turnover Tax, Rental Income) ─────────────
  const twentieth = new Date(year, month - 1, 20)

  for (const [tax, desc] of [
    ['VAT', `VAT return for ${prevLabel}`],
    ['WHT', `Withholding Tax for ${prevLabel}`],
    ['Turnover Tax', `Turnover Tax for ${prevLabel}`],
    ['Rental Income', `Rental Income Tax for ${prevLabel}`],
  ] as [string, string][]) {
    deadlines.push({
      date: twentieth,
      tax,
      description: desc,
      daysUntil: makeDays(20),
      status: getDeadlineStatus(twentieth, today),
    })
  }

  // ── Quarterly installment tax (20th of 4th, 6th, 9th, 12th) ───────────
  const installmentMonths = [4, 6, 9, 12]
  if (installmentMonths.includes(month)) {
    const instDate = new Date(year, month - 1, 20)
    deadlines.push({
      date: instDate,
      tax: 'Instalment Tax',
      description: `Q${installmentMonths.indexOf(month) + 1} Corporate Tax Instalment`,
      daysUntil: makeDays(20),
      status: getDeadlineStatus(instDate, today),
    })
  }

  return deadlines.sort((a, b) => a.date.getTime() - b.date.getTime())
}
