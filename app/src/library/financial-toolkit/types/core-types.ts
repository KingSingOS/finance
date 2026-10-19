/** Contracts for the original six calculators, matching their public inputs and results. */
import type { CalculatorMetadata, Currency } from './index';

interface CompanyResult extends CalculatorMetadata { id: string; companyId: string }
export interface PLStatementInput {
  companyId: string; period: string;
  startDate: string; endDate: string; businessName: string;
  revenue: number; cogs: number; rent: number; salaries: number; utilities: number;
  marketing: number; transport: number; otherExpenses: number; founderSalary: number;
  depreciation: number; interest: number; tax: number;
}
export interface PLStatement extends CompanyResult {
  period: PLStatementInput['period']; startDate: string; endDate: string; businessName: string; currency: Currency;
  revenue: { recurring: unknown[]; nonRecurring: unknown[]; total: number };
  cogs: { items: unknown[]; total: number };
  operatingExpenses: { rent: number; salaries: number; utilities: number; marketing: number;
    transport: number; other: number; items: unknown[]; total: number };
  founderSalary: number; depreciation: number; interest: number; tax: number;
  metrics: { grossProfit: number; grossMargin: number; operatingIncome: number; operatingMargin: number;
    ebitda: number; ebitdaMargin: number; netIncome: number; netMargin: number; burnRate: number; runway: number };
}
export interface CashForecastInput {
  companyId: string; openingCash: number; weeks: { cashIn: number; cashOut: number }[];
}
export interface WeekForecast {
  week: number; openingCash: number; cashIn: number; cashOut: number; closingCash: number;
  runway: number; status: 'healthy' | 'warning' | 'crisis';
}
export interface CashForecast extends CompanyResult {
  weeks: WeekForecast[];
  metrics: { averageBurnRate: number; totalCashIn: number; totalCashOut: number;
    netCashFlow: number; healthyWeeks: number; warningWeeks: number; crisisWeeks: number };
}
export interface BreakEvenInput {
  companyId: string; productName: string; fixedCosts: number; pricePerUnit: number;
  variableCostPerUnit: number; currentSales: number;
}
export interface BreakEvenAnalysis extends CompanyResult {
  productName: string; inputs: Omit<BreakEvenInput, 'companyId' | 'productName'>;
  results: { contributionMargin: number; contributionMarginPercent: number; breakEvenUnits: number;
    breakEvenRevenue: number; currentRevenue: number; unitsAboveBelowBreakEven: number;
    isAboveBreakEven: boolean; percentageToBreakEven: number };
  scenarios: { priceIncrease10Percent: number; fixedCostsDecrease20Percent: number; variableCostDecrease5: number };
}
export interface FounderSalaryInput {
  companyId: string; rent: number; food: number; school: number; transport: number;
  insurance: number; savings: number; other: number; businessProfit: number; businessCash: number;
}
export interface FounderSalaryCalc extends CompanyResult {
  personalExpenses: Pick<FounderSalaryInput, 'rent' | 'food' | 'school' | 'transport' | 'insurance' | 'savings' | 'other'> & { total: number };
  minimumSalary: number; businessFinancials: { monthlyProfit: number; cashBalance: number };
  decision: { canAfford: boolean; profitCoversMin: boolean; cashCovers3Months: boolean; recommendedSalary: number; reasoning: string };
}
export interface PricingInput {
  companyId: string; productName: string; costPerUnit: number; desiredMarkup: number;
  competitor1: number; competitor2: number; competitor3: number; customerProblemCost: number; solutionPercentage: number;
}
export interface PricingAnalysis extends CompanyResult {
  productName: string; inputs: Omit<PricingInput, 'companyId' | 'productName'>;
  methods: { costPlus: number; marketRate: number; valueBased: number };
  anchorPrice: number; minimumPrice: number;
  analysis: { marginPerUnit: number; marginPercent: number; isBelowMinimum: boolean; recommendation: string };
}
export interface CashLeakageInput {
  companyId: string; type: string; monthlyImpact: number; frequency: 1 | 2 | 3 | 4 | 5;
  severity: 1 | 2 | 3 | 4 | 5; notes?: string;
}
export interface CashLeakage extends CashLeakageInput, CompanyResult {
  riskScore: number; status: 'active' | 'resolved';
}
export interface CashLeakageSummary {
  companyId: string; leaks: CashLeakage[]; totalLeaks: number; totalMonthlyImpact: number;
  totalRiskScore: number; riskLevel: 'none' | 'minor' | 'significant' | 'major'; recommendations: string[];
}
