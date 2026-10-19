import { describe, expect, it } from '@jest/globals';
import { normalizeStatement } from '../../financial-analysis/normalizeStatement';
describe('financial analysis synchronous derived totals', () => {
  const data = { balanceSheet: { cashAndCashEquivalents: 100, shortTermInvestments: 0, accountsReceivable: 40, inventory: 10, propertyPlantEquipment: 30, longTermInvestments: 0, accountsPayable: 20, shortTermDebt: 0, longTermDebt: 10, commonStock: 100, retainedEarnings: 50 }, incomeStatement: { revenue: 200, costOfGoodsSold: 70, operatingExpenses: 30, interestExpense: 5, incomeTaxExpense: 15 } };
  it('recalculates from the final edited input without reading asynchronously updated state', () => {
    expect(normalizeStatement(data).incomeStatement.netIncome).toBe(80);
    expect(normalizeStatement({ ...data, incomeStatement: { ...data.incomeStatement, revenue: 250 } }).incomeStatement.netIncome).toBe(130);
  });
  it('preserves unknown amounts instead of manufacturing zero', () => {
    expect(normalizeStatement({ ...data, balanceSheet: { ...data.balanceSheet, inventory: null } }).balanceSheet.totalAssets).toBeNull();
  });
  it('keeps explicit zero and leaves original input unchanged', () => {
    const original = JSON.stringify(data);
    expect(normalizeStatement({ ...data, incomeStatement: { ...data.incomeStatement, revenue: 0 } }).incomeStatement.netIncome).toBe(-120);
    expect(JSON.stringify(data)).toBe(original);
  });
});
