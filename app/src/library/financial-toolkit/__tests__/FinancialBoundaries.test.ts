import { describe, test, expect } from '@jest/globals';
import { FounderSalaryCalculator } from '../calculators/FounderSalaryCalculator';
import { WeeklyReviewCalculator } from '../calculators/WeeklyReviewCalculator';

describe('Financial decision boundaries', () => {
  test.each([[200000, false], [216000, true]])(
    'requires the full three-month salary reserve at cash %s', (businessCash, canAfford) => {
      const result = FounderSalaryCalculator.calculate({
        companyId: 'boundary', rent: 20000, food: 15000, school: 10000,
        transport: 5000, insurance: 3000, savings: 5000, other: 2000,
        businessProfit: 100000, businessCash
      });
      expect(result.minimumSalary).toBe(72000);
      expect(result.decision.canAfford).toBe(canAfford);
    }
  );

  test('does not classify favorable revenue and spending variances as misses', () => {
    const review = WeeklyReviewCalculator.calculate({
      companyId: 'boundary', weekNumber: 1, year: 2026,
      weekStartDate: '2026-01-01', weekEndDate: '2026-01-07',
      targets: { revenue: 100, cashOut: 100 }, actuals: { revenue: 120, cashOut: 80 }
    });
    expect(review.variances.revenue?.status).toBe('on-track');
    expect(review.variances.cashOut?.status).toBe('on-track');
    expect(review.performance.percentOnTrack).toBe(100);
  });
});
