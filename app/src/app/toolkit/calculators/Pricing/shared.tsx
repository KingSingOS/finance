/** Pricing Calculator (3-method anchor) — pure calculation functions (no React) */

export interface PricingInputs {
  directCosts: number        // KES per hour / unit
  overheadAllocation: number // KES per hour / unit
  targetMargin: number       // desired margin % (e.g. 40)
  marketRate: number         // KES — competitor / market price
  valueToClient: number      // KES — estimated value delivered to client (for value-based)
  valueCapture: number       // % of value to capture (0-100, typically 20-30%)
  unitsPerYear: number       // billable hours/units per year (for annual impact)
}

export interface PricingMethod {
  name: string
  price: number
  margin: number  // %
  label: string
}

export interface PricingResult {
  totalCost: number          // directCosts + overheadAllocation
  costPlusPrice: number      // cost / (1 - targetMargin/100)
  marketPrice: number        // marketRate as provided
  valueBased: number         // valueToClient * (valueCapture/100)
  recommendedPrice: number   // anchor: market-aware, above cost-plus floor
  marginAtRecommended: number // %
  annualImpact: number       // recommendedPrice * unitsPerYear - costs * unitsPerYear
  methods: PricingMethod[]
  isBelowCost: boolean
  recommendation: string
}

export function calculatePricing(inputs: PricingInputs): PricingResult {
  const totalCost = inputs.directCosts + inputs.overheadAllocation
  const costPlusPrice = inputs.targetMargin < 100
    ? totalCost / (1 - inputs.targetMargin / 100)
    : totalCost * 2

  const valueBased = inputs.valueToClient > 0
    ? inputs.valueToClient * (inputs.valueCapture / 100)
    : 0

  // Recommended = highest of cost-plus and a market-aware weighted anchor
  const validPrices = [costPlusPrice, inputs.marketRate, valueBased].filter(p => p > 0)
  const rawAnchor = validPrices.length > 0
    ? validPrices.reduce((s, p) => s + p, 0) / validPrices.length
    : costPlusPrice
  const recommendedPrice = Math.max(costPlusPrice, rawAnchor)

  const marginAtRecommended = recommendedPrice > 0
    ? ((recommendedPrice - totalCost) / recommendedPrice) * 100
    : 0

  const annualImpact = (recommendedPrice - totalCost) * inputs.unitsPerYear
  const isBelowCost = recommendedPrice < totalCost

  const methods: PricingMethod[] = [
    {
      name: 'Cost-Plus',
      price: costPlusPrice,
      margin: costPlusPrice > 0 ? ((costPlusPrice - totalCost) / costPlusPrice) * 100 : 0,
      label: `Cost + ${inputs.targetMargin}% margin`,
    },
    ...(inputs.marketRate > 0 ? [{
      name: 'Market Rate',
      price: inputs.marketRate,
      margin: inputs.marketRate > 0 ? ((inputs.marketRate - totalCost) / inputs.marketRate) * 100 : 0,
      label: 'Competitor / market average',
    }] : []),
    ...(valueBased > 0 ? [{
      name: 'Value-Based',
      price: valueBased,
      margin: valueBased > 0 ? ((valueBased - totalCost) / valueBased) * 100 : 0,
      label: `${inputs.valueCapture}% of client value delivered`,
    }] : []),
  ]

  let recommendation = ''
  if (isBelowCost) {
    recommendation = `⚠️ All methods are below your cost — you're pricing at a loss. Raise prices or reduce costs.`
  } else if (marginAtRecommended < 20) {
    recommendation = `Margin is only ${marginAtRecommended.toFixed(0)}% — consider increasing to 30–40% minimum.`
  } else if (marginAtRecommended > 60) {
    recommendation = `Strong margin (${marginAtRecommended.toFixed(0)}%) — verify your price is defensible against competitors.`
  } else {
    recommendation = `Recommended price of KES ${recommendedPrice.toFixed(0)} gives a healthy ${marginAtRecommended.toFixed(0)}% margin.`
  }

  return {
    totalCost,
    costPlusPrice,
    marketPrice: inputs.marketRate,
    valueBased,
    recommendedPrice,
    marginAtRecommended,
    annualImpact,
    methods,
    isBelowCost,
    recommendation,
  }
}
