// app/src/library/financial-toolkit/types/index.ts
/**
 * Unified Type Exports - PRODUCTION READY
 * Single source of truth for all type definitions
 * 
 * FIXES APPLIED:
 * ✅ All types exported from single location
 * ✅ No fragmented imports
 * ✅ Currency type properly defined
 */

// ═══════════════════════════════════════════════════════════════════
// CORE TYPES
// ═══════════════════════════════════════════════════════════════════

export type Currency = 'USD' | 'EUR' | 'GBP' | 'KES' | 'NGN' | 'ZAR' | 'GHS' | 'TZS' | 'UGX' | 'RWF' | 'XAF' | 'XOF';

export interface ValidationError {
  field: string;
  message: string;
  code: 'REQUIRED' | 'INVALID_TYPE' | 'INVALID_VALUE' | 'OUT_OF_RANGE' | 'BUSINESS_LOGIC_WARNING' | 'BUSINESS_LOGIC_ERROR' | 'NEGATIVE_VALUE' | 'INVALID_FORMAT' | 'INVALID_RANGE' | 'MIN_LENGTH' | 'MAX_LENGTH';
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface TimeRange {
  startDate: string; // ISO 8601
  endDate: string; // ISO 8601
}

export interface CalculatorMetadata {
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
  deletedAt?: number; // Unix timestamp (soft delete)
}

// ═══════════════════════════════════════════════════════════════════
// P&L TYPES
// ═══════════════════════════════════════════════════════════════════

export interface PLStatementInput {
  companyId: string;
  businessName: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  currency?: Currency;
  revenue: number;
  cogs: number;
  rent: number;
  salaries: number;
  utilities: number;
  marketing: number;
  transport: number;
  otherExpenses: number;
  founderSalary: number;
  depreciation: number;
  interest: number;
  tax: number;
}

export interface PLStatement {
  id: string;
  companyId: string;
  period: 'monthly' | 'quarterly' | 'yearly';
  startDate: string;
  endDate: string;
  businessName: string;
  currency: Currency;
  revenue: { recurring: unknown[]; nonRecurring: unknown[]; total: number };
  cogs: { items: unknown[]; total: number };
  operatingExpenses: {
    rent: number;
    salaries: number;
    utilities: number;
    marketing: number;
    transport: number;
    other: number;
    items: unknown[];
    total: number;
  };
  founderSalary: number;
  depreciation: number;
  interest: number;
  tax: number;
  metrics: {
    grossProfit: number;
    grossMargin: number;
    operatingIncome: number;
    operatingMargin: number;
    ebitda: number;
    ebitdaMargin: number;
    netIncome: number;
    netMargin: number;
    burnRate: number;
    runway: number;
  };
  createdAt: number;
  updatedAt: number;
}

// ═══════════════════════════════════════════════════════════════════
// FOUNDER SALARY TYPES
// ═══════════════════════════════════════════════════════════════════

export interface FounderSalaryInput {
  companyId: string;
  currency?: Currency;
  rent: number;
  food: number;
  school: number;
  transport: number;
  insurance: number;
  savings: number;
  other: number;
  businessProfit: number;
  businessCash: number;
}

export interface FounderSalaryCalc {
  id: string;
  companyId: string;
  personalExpenses: {
    rent: number;
    food: number;
    school: number;
    transport: number;
    insurance: number;
    savings: number;
    other: number;
    total: number;
  };
  minimumSalary: number;
  businessFinancials: {
    monthlyProfit: number;
    cashBalance: number;
  };
  decision: {
    canAfford: boolean;
    profitCoversMin: boolean;
    cashCovers3Months: boolean;
    recommendedSalary: number;
    reasoning: string;
  };
  createdAt: number;
  updatedAt: number;
}

// ═══════════════════════════════════════════════════════════════════
// BREAK-EVEN TYPES
// ═══════════════════════════════════════════════════════════════════

export interface BreakEvenInput {
  companyId: string;
  productName?: string;
  currency?: Currency;
  fixedCosts: number;
  pricePerUnit: number;
  variableCostPerUnit: number;
  currentSales: number;
}

export interface BreakEvenAnalysis {
  id: string;
  companyId: string;
  productName?: string;
  inputs: {
    fixedCosts: number;
    pricePerUnit: number;
    variableCostPerUnit: number;
    currentSales: number;
    contributionMargin: number;
  };
  results: {
    contributionMargin: number;
    contributionMarginPercent: number;
    breakEvenUnits: number;
    breakEvenRevenue: number;
    currentRevenue: number;
    currentSales: number;
    unitsAboveBelowBreakEven: number;
    isAboveBreakEven: boolean;
    percentageToBreakEven: number;
  };
  scenarios: {
    priceIncrease10Percent: number;
    fixedCostsDecrease20Percent: number;
    variableCostDecrease5: number;
  };
  createdAt: number;
  updatedAt: number;
}

// ═══════════════════════════════════════════════════════════════════
// CASH FORECAST TYPES
// ═══════════════════════════════════════════════════════════════════

export interface CashForecastInput {
  companyId: string;
  currency?: Currency;
  openingCash: number;
  weeks: Array<{ cashIn: number; cashOut: number }>;
}

export interface WeekForecast {
  week: number;
  openingCash: number;
  cashIn: number;
  cashOut: number;
  closingCash: number;
  runway: number;
  status: 'healthy' | 'warning' | 'crisis';
}

export interface CashForecast {
  id: string;
  companyId: string;
  weeks: WeekForecast[];
  metrics: {
    averageBurnRate: number;
    totalCashIn: number;
    totalCashOut: number;
    netCashFlow: number;
    healthyWeeks: number;
    warningWeeks: number;
    crisisWeeks: number;
  };
  createdAt: number;
  updatedAt: number;
}

// ═══════════════════════════════════════════════════════════════════
// CASH LEAKAGE TYPES
// ═══════════════════════════════════════════════════════════════════

export interface CashLeakageInput {
  companyId: string;
  type: string;
  monthlyImpact: number;
  frequency: 1 | 2 | 3 | 4 | 5;
  severity: 1 | 2 | 3 | 4 | 5;
  notes?: string;
}

export interface CashLeakage {
  id: string;
  companyId: string;
  type: string;
  monthlyImpact: number;
  frequency: number;
  severity: number;
  riskScore: number;
  notes?: string;
  status: 'active' | 'addressed' | 'monitoring';
  createdAt: number;
  updatedAt: number;
}

export interface CashLeakageSummary {
  companyId: string;
  leaks: CashLeakage[];
  totalLeaks: number;
  totalMonthlyImpact: number;
  totalRiskScore: number;
  riskLevel: 'none' | 'minor' | 'significant' | 'major';
  recommendations: string[];
}

// ═══════════════════════════════════════════════════════════════════
// PRICING TYPES
// ═══════════════════════════════════════════════════════════════════

export interface PricingInput {
  companyId: string;
  productName: string;
  currency?: Currency;
  costPerUnit: number;
  desiredMarkup: number;
  competitor1: number;
  competitor2: number;
  competitor3: number;
  customerProblemCost: number;
  solutionPercentage: number;
}

export interface PricingAnalysis {
  id: string;
  companyId: string;
  productName: string;
  inputs: {
    costPerUnit: number;
    desiredMarkup: number;
    competitor1: number;
    competitor2: number;
    competitor3: number;
    customerProblemCost: number;
    solutionPercentage: number;
  };
  methods: {
    costPlus: number;
    marketRate: number;
    valueBased: number;
  };
  anchorPrice: number;
  minimumPrice: number;
  analysis: {
    marginPerUnit: number;
    marginPercent: number;
    isBelowMinimum: boolean;
    recommendation: string;
  };
  createdAt: number;
  updatedAt: number;
}

// ═══════════════════════════════════════════════════════════════════
// RE-EXPORT ALL PHASE TYPES
// ═══════════════════════════════════════════════════════════════════

export * from './phase1-types';
export * from './phase2-types';
export * from './phase3-types';

// ═══════════════════════════════════════════════════════════════════
// SHARED RESULT TYPES
// ═══════════════════════════════════════════════════════════════════

export interface BaseCalculatorResult {
  id: string;
  companyId: string;
  currency: Currency;
  createdAt: number;
  updatedAt: number;
}

export interface InsightResult {
  insights: string[];
  recommendations?: string[];
  alerts?: string[];
}

// ═══════════════════════════════════════════════════════════════════
// INTEGRATION TYPES (for calculator interconnections)
// ═══════════════════════════════════════════════════════════════════

export interface CompanyFinancialSnapshot {
  companyId: string;
  period: string;
  currency: Currency;
  pl?: any; // PLStatement
  balanceSheet?: any; // BalanceSheet
  cashForecast?: any; // CashForecast
  workingCapital?: any; // WorkingCapital
  dashboard?: any; // Dashboard
  capexProjects?: any[]; // Capex[]
  payroll?: any; // Payroll
  taxCalendar?: any; // TaxCalendar
  operationsKPIs?: any; // OperationsKPI
  weeklyReviews?: any[]; // WeeklyReview[]
  actionPlans?: any[]; // ActionPlan[]
}
