/** Break-Even Analysis — pure calculation functions (no React) */

export interface BreakEvenInputs {
  fixedCosts: number          // KES per month
  variableCostPerUnit: number // KES per unit/hour
  pricePerUnit: number        // KES per unit/hour
  currentSales?: number       // units per month (optional — for safety margin)
}

export interface ScenarioRow {
  label: string
  breakEvenUnits: number
  breakEvenRevenue: number
  change: string
}

export interface BreakEvenResult {
  contributionMargin: number        // KES per unit
  contributionMarginPct: number     // %
  breakEvenUnits: number
  breakEvenRevenue: number
  currentRevenue: number
  safetyMarginUnits: number        // currentSales - breakEvenUnits (if above)
  safetyMarginPct: number          // safety margin as % of current sales
  isAboveBreakEven: boolean
  unitsToBreakEven: number         // how many more units needed (0 if already above)
  scenarios: ScenarioRow[]
  status: 'above' | 'at' | 'below'
}

function beUnits(fixedCosts: number, price: number, varCost: number): number {
  const cm = price - varCost
  return cm > 0 ? fixedCosts / cm : Infinity
}

export function calculateBreakEven(inputs: BreakEvenInputs): BreakEvenResult {
  const cm = inputs.pricePerUnit - inputs.variableCostPerUnit
  const cmPct = inputs.pricePerUnit > 0 ? (cm / inputs.pricePerUnit) * 100 : 0

  const breakEvenUnits = cm > 0 ? inputs.fixedCosts / cm : Infinity
  const breakEvenRevenue = isFinite(breakEvenUnits) ? breakEvenUnits * inputs.pricePerUnit : Infinity

  const current = inputs.currentSales ?? 0
  const currentRevenue = current * inputs.pricePerUnit

  const safetyMarginUnits = isFinite(breakEvenUnits) ? Math.max(0, current - breakEvenUnits) : 0
  const safetyMarginPct = current > 0 ? (safetyMarginUnits / current) * 100 : 0
  const isAboveBreakEven = isFinite(breakEvenUnits) && current >= breakEvenUnits
  const unitsToBreakEven = isAboveBreakEven || !isFinite(breakEvenUnits) ? 0 : breakEvenUnits - current

  const scenarios: ScenarioRow[] = [
    {
      label: '+10% Price',
      breakEvenUnits: Math.round(beUnits(inputs.fixedCosts, inputs.pricePerUnit * 1.1, inputs.variableCostPerUnit)),
      breakEvenRevenue: Math.round(beUnits(inputs.fixedCosts, inputs.pricePerUnit * 1.1, inputs.variableCostPerUnit) * inputs.pricePerUnit * 1.1),
      change: 'Price increase 10%',
    },
    {
      label: '-20% Fixed Costs',
      breakEvenUnits: Math.round(beUnits(inputs.fixedCosts * 0.8, inputs.pricePerUnit, inputs.variableCostPerUnit)),
      breakEvenRevenue: Math.round(beUnits(inputs.fixedCosts * 0.8, inputs.pricePerUnit, inputs.variableCostPerUnit) * inputs.pricePerUnit),
      change: 'Reduce fixed costs 20%',
    },
    {
      label: '-10% Variable Cost',
      breakEvenUnits: Math.round(beUnits(inputs.fixedCosts, inputs.pricePerUnit, inputs.variableCostPerUnit * 0.9)),
      breakEvenRevenue: Math.round(beUnits(inputs.fixedCosts, inputs.pricePerUnit, inputs.variableCostPerUnit * 0.9) * inputs.pricePerUnit),
      change: 'Reduce variable costs 10%',
    },
  ]

  let status: BreakEvenResult['status'] = 'below'
  if (isAboveBreakEven) status = 'above'
  else if (unitsToBreakEven < breakEvenUnits * 0.05) status = 'at'

  return {
    contributionMargin: cm,
    contributionMarginPct: cmPct,
    breakEvenUnits: isFinite(breakEvenUnits) ? breakEvenUnits : 0,
    breakEvenRevenue: isFinite(breakEvenRevenue) ? breakEvenRevenue : 0,
    currentRevenue,
    safetyMarginUnits,
    safetyMarginPct,
    isAboveBreakEven,
    unitsToBreakEven,
    scenarios,
    status,
  }
}
