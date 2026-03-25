/** Power of One — pure calculation functions (no React) */

export interface PowerOfOneInputs {
  currentRevenue: number    // monthly KES
  currentCOGS: number       // monthly KES
  currentOverhead: number   // monthly KES
  currentVolume: number     // units sold per month
  annualRevenue: number     // KES (for working capital lever calculations)
  // Scenario multipliers (default 1.0 = 1% / 1 day)
  priceMultiplier?: number      // x% price increase (default 1)
  volumeMultiplier?: number     // x% volume increase (default 1)
  cogsMultiplier?: number       // x% COGS reduction (default 1)
  overheadMultiplier?: number   // x% overhead reduction (default 1)
  receivablesMultiplier?: number // x days faster collection (default 1)
  wipMultiplier?: number         // x days WIP reduction (default 1)
  payablesMultiplier?: number    // x days slower payment (default 1)
}

export interface LeverResult {
  improvement: string   // e.g. "+1%" or "-1 day"
  impact: number        // KES impact
  description: string
  type: 'profit' | 'cash'
  icon: string
}

export interface PowerOfOneResult {
  lever1_Price: LeverResult
  lever2_Volume: LeverResult
  lever3_COGS: LeverResult
  lever4_Overhead: LeverResult
  lever5_Receivables: LeverResult
  lever6_Inventory: LeverResult
  lever7_Payables: LeverResult
  combinedProfitImpact: number    // sum of levers 1-4
  combinedCashImpact: number      // sum of levers 5-7
  combinedImpact: number          // all 7
  compoundMultiplier: number      // 1.01^n
  currentProfit: number
  currentMargin: number           // %
  dailyRevenue: number
}

export function calculatePowerOfOne(inputs: PowerOfOneInputs): PowerOfOneResult {
  const p1 = inputs.priceMultiplier ?? 1
  const p2 = inputs.volumeMultiplier ?? 1
  const p3 = inputs.cogsMultiplier ?? 1
  const p4 = inputs.overheadMultiplier ?? 1
  const p5 = inputs.receivablesMultiplier ?? 1
  const p6 = inputs.wipMultiplier ?? 1
  const p7 = inputs.payablesMultiplier ?? 1

  const currentProfit = inputs.currentRevenue - inputs.currentCOGS - inputs.currentOverhead
  const currentMargin = inputs.currentRevenue > 0
    ? (currentProfit / inputs.currentRevenue) * 100
    : 0
  const dailyRevenue = inputs.annualRevenue / 365

  // Lever 1: Price — 1% price increase goes 100% to profit
  const l1Impact = inputs.currentRevenue * (p1 / 100)

  // Lever 2: Volume — 1% more volume at current contribution margin
  const l2Impact = currentProfit > 0 ? currentProfit * (p2 / 100) : inputs.currentRevenue * 0.005

  // Lever 3: COGS — reduce direct costs by 1%
  const l3Impact = inputs.currentCOGS * (p3 / 100)

  // Lever 4: Overhead — reduce operating costs by 1%
  const l4Impact = inputs.currentOverhead * (p4 / 100)

  // Lever 5: Receivables — collect p5 days faster (cash freed)
  const l5Impact = dailyRevenue * p5

  // Lever 6: WIP/Inventory — reduce p6 days of WIP (cash freed)
  const l6Impact = dailyRevenue * p6

  // Lever 7: Payables — pay p7 days later (cash retained)
  const l7Impact = dailyRevenue * p7

  const lever1_Price: LeverResult = {
    improvement: `+${p1}%`,
    impact: l1Impact,
    description: `Raise prices ${p1}%`,
    type: 'profit',
    icon: '💰',
  }
  const lever2_Volume: LeverResult = {
    improvement: `+${p2}%`,
    impact: l2Impact,
    description: `Increase sales volume ${p2}%`,
    type: 'profit',
    icon: '🎯',
  }
  const lever3_COGS: LeverResult = {
    improvement: `-${p3}%`,
    impact: l3Impact,
    description: `Reduce COGS ${p3}%`,
    type: 'profit',
    icon: '📉',
  }
  const lever4_Overhead: LeverResult = {
    improvement: `-${p4}%`,
    impact: l4Impact,
    description: `Reduce overhead ${p4}%`,
    type: 'profit',
    icon: '✂️',
  }
  const lever5_Receivables: LeverResult = {
    improvement: `-${p5} day${p5 !== 1 ? 's' : ''}`,
    impact: l5Impact,
    description: `Collect ${p5} day${p5 !== 1 ? 's' : ''} faster`,
    type: 'cash',
    icon: '⚡',
  }
  const lever6_Inventory: LeverResult = {
    improvement: `-${p6} day${p6 !== 1 ? 's' : ''}`,
    impact: l6Impact,
    description: `Reduce WIP ${p6} day${p6 !== 1 ? 's' : ''}`,
    type: 'cash',
    icon: '📦',
  }
  const lever7_Payables: LeverResult = {
    improvement: `+${p7} day${p7 !== 1 ? 's' : ''}`,
    impact: l7Impact,
    description: `Pay suppliers ${p7} day${p7 !== 1 ? 's' : ''} later`,
    type: 'cash',
    icon: '🕐',
  }

  const combinedProfitImpact = l1Impact + l2Impact + l3Impact + l4Impact
  const combinedCashImpact = l5Impact + l6Impact + l7Impact
  const combinedImpact = combinedProfitImpact + combinedCashImpact

  // Compound multiplier: (1 + p/100)^n for n active levers
  const profitLeverPct = ((p1 + p2 + p3 + p4) / 4) / 100
  const activeProfitLevers = 4
  const compoundMultiplier = Math.pow(1 + profitLeverPct, activeProfitLevers)

  return {
    lever1_Price,
    lever2_Volume,
    lever3_COGS,
    lever4_Overhead,
    lever5_Receivables,
    lever6_Inventory,
    lever7_Payables,
    combinedProfitImpact,
    combinedCashImpact,
    combinedImpact,
    compoundMultiplier,
    currentProfit,
    currentMargin,
    dailyRevenue,
  }
}
