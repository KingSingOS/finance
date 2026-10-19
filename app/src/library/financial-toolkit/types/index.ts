import type { PLStatement, CashForecast } from './core-types';
import type { BalanceSheet, WorkingCapital, Dashboard } from './phase1-types';
import type { Capex, Payroll, TaxCalendar, OperationsKPI } from './phase2-types';
import type { WeeklyReview, ActionPlan } from './phase3-types';
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
  code: 'REQUIRED' | 'INVALID_TYPE' | 'INVALID_VALUE' | 'OUT_OF_RANGE' | 'BUSINESS_LOGIC_WARNING' | 'INVALID_FORMAT' | 'INVALID_RANGE' | 'NEGATIVE_VALUE' | 'MIN_LENGTH' | 'MAX_LENGTH' | 'BUSINESS_LOGIC_ERROR';
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
// RE-EXPORT ALL PHASE TYPES
// ═══════════════════════════════════════════════════════════════════

export * from './core-types';
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
  pl?: PLStatement; // PLStatement
  balanceSheet?: BalanceSheet; // BalanceSheet
  cashForecast?: CashForecast; // CashForecast
  workingCapital?: WorkingCapital; // WorkingCapital
  dashboard?: Dashboard; // Dashboard
  capexProjects?: Capex[]; // Capex[]
  payroll?: Payroll; // Payroll
  taxCalendar?: TaxCalendar; // TaxCalendar
  operationsKPIs?: OperationsKPI; // OperationsKPI
  weeklyReviews?: WeeklyReview[]; // WeeklyReview[]
  actionPlans?: ActionPlan[]; // ActionPlan[]
}
