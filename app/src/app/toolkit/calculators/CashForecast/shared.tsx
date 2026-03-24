/** Cash Forecast (13-week rolling) — pure calculation functions (no React) */

export interface CashForecastInputs {
  startingCash: number    // KES
  weeklyRevenue: number   // KES average per week
  weeklyExpenses: number  // KES average per week
}

export interface WeekRow {
  week: number
  revenue: number
  expenses: number
  net: number
  endingCash: number
  status: 'healthy' | 'warning' | 'crisis'
}

export interface CashForecastResult {
  weeks: WeekRow[]
  runwayWeeks: number      // weeks until cash hits zero (Infinity if always positive)
  breakEvenWeek: number    // first week where cumulative cash flow turns positive (0 if already positive)
  totalNetFlow: number     // total net over 13 weeks
  avgWeeklyBurn: number    // positive = net burn, negative = net gain
  status: 'healthy' | 'warning' | 'critical'
}

function weekStatus(endingCash: number, weeklyExpenses: number): WeekRow['status'] {
  if (weeklyExpenses <= 0) return 'healthy'
  const weeksLeft = endingCash / weeklyExpenses
  if (weeksLeft > 8) return 'healthy'
  if (weeksLeft > 4) return 'warning'
  return 'crisis'
}

export function calculateCashForecast(inputs: CashForecastInputs): CashForecastResult {
  const WEEKS = 13
  const weeks: WeekRow[] = []
  let cash = inputs.startingCash
  let runwayWeeks = Infinity
  let breakEvenWeek = 0
  const weeklyNet = inputs.weeklyRevenue - inputs.weeklyExpenses
  let cumulativeFlow = 0

  for (let w = 1; w <= WEEKS; w++) {
    const revenue = inputs.weeklyRevenue
    const expenses = inputs.weeklyExpenses
    const net = revenue - expenses
    cumulativeFlow += net
    cash = cash + net

    if (cash <= 0 && runwayWeeks === Infinity) {
      runwayWeeks = w - 1
    }

    if (breakEvenWeek === 0 && cumulativeFlow > 0 && weeklyNet > 0) {
      breakEvenWeek = w
    }

    weeks.push({
      week: w,
      revenue,
      expenses,
      net,
      endingCash: Math.max(cash, 0),
      status: weekStatus(Math.max(cash, 0), expenses),
    })
  }

  const avgWeeklyBurn = -weeklyNet // positive = burning cash
  let status: CashForecastResult['status'] = 'healthy'
  if (runwayWeeks < 8 || weeks.some(w => w.status === 'crisis')) status = 'critical'
  else if (runwayWeeks < 13 || weeks.some(w => w.status === 'warning')) status = 'warning'

  return {
    weeks,
    runwayWeeks,
    breakEvenWeek,
    totalNetFlow: cumulativeFlow,
    avgWeeklyBurn,
    status,
  }
}
