/** Tax Calendar KRA — upcoming obligations and deadlines */
import {
  getTaxDeadlinesForMonth,
  KRA_TAX_OBLIGATIONS,
  type TaxDeadline,
  type TaxObligation,
} from '../../data/kra-tax-calendar'

export type { TaxDeadline, TaxObligation }

export interface TaxCalendarInputs {
  year: number
  month: number  // 1-indexed
}

export interface TaxCalendarResult {
  allDeadlines: TaxDeadline[]
  upcomingDeadlines: TaxDeadline[]   // daysUntil >= 0
  dueSoonDeadlines: TaxDeadline[]    // 0-7 days
  overdueDeadlines: TaxDeadline[]    // daysUntil < 0
  allObligations: TaxObligation[]
  monthLabel: string
  nextDeadline: TaxDeadline | null
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

export function calculateTaxCalendar(inputs: TaxCalendarInputs): TaxCalendarResult {
  const allDeadlines = getTaxDeadlinesForMonth(inputs.year, inputs.month)

  const upcomingDeadlines = allDeadlines.filter(d => d.daysUntil >= 0)
  const dueSoonDeadlines  = allDeadlines.filter(d => d.status === 'due-soon')
  const overdueDeadlines  = allDeadlines.filter(d => d.status === 'overdue')

  const nextDeadline = upcomingDeadlines.length > 0
    ? upcomingDeadlines.reduce((a, b) => a.daysUntil < b.daysUntil ? a : b)
    : null

  const monthLabel = `${MONTH_NAMES[(inputs.month - 1) % 12]} ${inputs.year}`

  return {
    allDeadlines,
    upcomingDeadlines,
    dueSoonDeadlines,
    overdueDeadlines,
    allObligations: KRA_TAX_OBLIGATIONS as unknown as TaxObligation[],
    monthLabel,
    nextDeadline,
  }
}

export { MONTH_NAMES }
