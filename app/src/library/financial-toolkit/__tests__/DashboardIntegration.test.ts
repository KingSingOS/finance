import { describe, test, expect } from '@jest/globals';
import { PLCalculator } from '../calculators/PLCalculator';
import { CashForecastCalculator } from '../calculators/CashForecastCalculator';
import { DashboardCalculator } from '../calculators/DashboardCalculator';

describe('Dashboard consumes actual calculator results', () => {
  test('retains profitability and cash metrics across the public integration', () => {
    const pl = PLCalculator.calculate({
      companyId: 'integration', period: 'monthly', businessName: 'Fixture',
      startDate: '2026-01-01', endDate: '2026-01-31', revenue: 1000, cogs: 300,
      rent: 100, salaries: 0, utilities: 0, marketing: 0, transport: 0,
      otherExpenses: 0, founderSalary: 0, depreciation: 0, interest: 0, tax: 0
    });
    const cashForecast = CashForecastCalculator.calculate({
      companyId: 'integration', openingCash: 5000,
      weeks: [{ cashIn: 500, cashOut: 1000 }]
    });
    const dashboard = DashboardCalculator.autoCalculate({
      companyId: 'integration', period: '2026-01', pl, cashForecast
    });
    expect(dashboard.keyMetrics.revenue).toBe(1000);
    expect(dashboard.keyMetrics.grossMargin).toBe(70);
    expect(dashboard.keyMetrics.netMargin).toBe(60);
    expect(dashboard.keyMetrics.ebitda).toBe(600);
    expect(dashboard.keyMetrics.cashBalance).toBe(4500);
    expect(dashboard.keyMetrics.runway).toBe(4.5);
    expect(dashboard.keyMetrics.burnRate).toBe(1000);
    expect(dashboard.indicators.liquidity).toBe('red');
  });
});
