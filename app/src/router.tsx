import { createBrowserRouter } from 'react-router-dom';
import { ProtectedRoute } from './components/protected/ProtectedRoute';
import { AppLayout } from './components/layout/AppLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import { DashboardPage } from './pages/calculators/DashboardPage';
import { PLCalculatorPage } from './pages/calculators/PLCalculatorPage';
import { BalanceSheetPage } from './pages/calculators/BalanceSheetPage';
import { BudgetVariancePage } from './pages/calculators/BudgetVariancePage';
import { CashForecastPage } from './pages/calculators/CashForecastPage';
import { CashLeakagePage } from './pages/calculators/CashLeakagePage';
import { WorkingCapitalPage } from './pages/calculators/WorkingCapitalPage';
import { BreakEvenPage } from './pages/calculators/BreakEvenPage';
import { PricingPage } from './pages/calculators/PricingPage';
import { CapexPage } from './pages/calculators/CapexPage';
import { PayrollPage } from './pages/calculators/PayrollPage';
import { FounderSalaryPage } from './pages/calculators/FounderSalaryPage';
import { OperationsKPIPage } from './pages/calculators/OperationsKPIPage';
import { TaxCalendarPage } from './pages/calculators/TaxCalendarPage';
import { WeeklyReviewPage } from './pages/calculators/WeeklyReviewPage';
import { ActionPlanPage } from './pages/calculators/ActionPlanPage';
import Page from './app/cap-table/page';

export const router = createBrowserRouter([
  // Public routes
  { path: '/login', element: <LoginPage /> },
  { path: '/signup', element: <SignupPage /> },

  // Protected routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { path: '/', element: <DashboardPage /> },
          { path: '/pl', element: <PLCalculatorPage /> },
          { path: '/balance-sheet', element: <BalanceSheetPage /> },
          { path: '/budget-variance', element: <BudgetVariancePage /> },
          { path: '/cash-forecast', element: <CashForecastPage /> },
          { path: '/cash-leakage', element: <CashLeakagePage /> },
          { path: '/working-capital', element: <WorkingCapitalPage /> },
          { path: '/break-even', element: <BreakEvenPage /> },
          { path: '/pricing', element: <PricingPage /> },
          { path: '/capex', element: <CapexPage /> },
          { path: '/payroll', element: <PayrollPage /> },
          { path: '/founder-salary', element: <FounderSalaryPage /> },
          { path: '/operations-kpi', element: <OperationsKPIPage /> },
          { path: '/tax-calendar', element: <TaxCalendarPage /> },
          { path: '/weekly-review', element: <WeeklyReviewPage /> },
          { path: '/action-plan', element: <ActionPlanPage /> },
          { path: '/cap-table', element: <Page /> },
        ],
      },
    ],
  },
]);
