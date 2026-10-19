export type Amounts = Record<string, number | null>;
export type Data = { balanceSheet: Amounts; incomeStatement: Amounts };
// Pure, synchronous normalization: unknown operands remain unknown; no setState/read race.
export function normalizeStatement(input: Data): Data {
  const bs = { ...input.balanceSheet }, inc = { ...input.incomeStatement };
  const sum = (group: Amounts, keys: string[]) => keys.every(k => typeof group[k] === 'number' && Number.isFinite(group[k])) ? keys.reduce((a, k) => a + (group[k] as number), 0) : null;
  const difference = (a: number | null, b: number | null) => a === null || b === null ? null : a - b;
  bs.totalCurrentAssets = sum(bs, ['cashAndCashEquivalents', 'shortTermInvestments', 'accountsReceivable', 'inventory']);
  bs.totalAssets = sum(bs, ['totalCurrentAssets', 'propertyPlantEquipment', 'longTermInvestments']);
  bs.totalCurrentLiabilities = sum(bs, ['accountsPayable', 'shortTermDebt']);
  bs.totalLiabilities = sum(bs, ['totalCurrentLiabilities', 'longTermDebt']);
  bs.totalEquity = sum(bs, ['commonStock', 'retainedEarnings']);
  inc.grossProfit = difference(inc.revenue, inc.costOfGoodsSold);
  inc.operatingIncome = difference(inc.grossProfit, inc.operatingExpenses);
  inc.incomeBeforeTax = difference(inc.operatingIncome, inc.interestExpense);
  inc.netIncome = difference(inc.incomeBeforeTax, inc.incomeTaxExpense);
  return { balanceSheet: bs, incomeStatement: inc };
}
