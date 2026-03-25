import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './Layout'
import { ModeProvider } from './contexts/ModeContext'
import CapTablePage from './cap-table/page.tsx'
import ToolkitPage from './toolkit/page.tsx'
import ToolPage from './toolkit/ToolPage.tsx'
import Dashboard from './toolkit/calculators/Dashboard/index.tsx'
import PLStatement from './toolkit/calculators/PLStatement/index.tsx'
import CashForecast from './toolkit/calculators/CashForecast/index.tsx'
import WorkingCapital from './toolkit/calculators/WorkingCapital/index.tsx'
import Pricing from './toolkit/calculators/Pricing/index.tsx'
import BreakEven from './toolkit/calculators/BreakEven/index.tsx'
import PowerOfOne from './toolkit/calculators/PowerOfOne/index.tsx'
import SustainableGrowth from './toolkit/calculators/SustainableGrowth/index.tsx'
import FounderSalary from './toolkit/calculators/FounderSalary/index.tsx'
import CashLeakage from './toolkit/calculators/CashLeakage/index.tsx'
import PayrollKenya from './toolkit/calculators/PayrollKenya/index.tsx'
import TaxCalendar from './toolkit/calculators/TaxCalendar/index.tsx'
import CAPEXTracker from './toolkit/calculators/CAPEXTracker/index.tsx'
import OperationsKPIs from './toolkit/calculators/OperationsKPIs/index.tsx'
import BalanceSheet from './toolkit/calculators/BalanceSheet/index.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/cap-table" replace /> },
      { path: 'cap-table', element: <CapTablePage /> },
      { path: 'toolkit', element: <ToolkitPage /> },
      // Sprint 2 calculators — specific routes take precedence over wildcard
      { path: 'toolkit/dashboard', element: <Dashboard /> },
      { path: 'toolkit/pl', element: <PLStatement /> },
      { path: 'toolkit/cash-forecast', element: <CashForecast /> },
      { path: 'toolkit/working-capital', element: <WorkingCapital /> },
      { path: 'toolkit/pricing', element: <Pricing /> },
      { path: 'toolkit/break-even', element: <BreakEven /> },
      // Sprint 3 calculators
      { path: 'toolkit/power-of-one', element: <PowerOfOne /> },
      { path: 'toolkit/sustainable-growth', element: <SustainableGrowth /> },
      { path: 'toolkit/founder-salary', element: <FounderSalary /> },
      { path: 'toolkit/cash-leakage', element: <CashLeakage /> },
      // Sprint 4 calculators
      { path: 'toolkit/payroll-kenya', element: <PayrollKenya /> },
      { path: 'toolkit/tax-calendar', element: <TaxCalendar /> },
      { path: 'toolkit/capex', element: <CAPEXTracker /> },
      { path: 'toolkit/kpis', element: <OperationsKPIs /> },
      { path: 'toolkit/balance-sheet', element: <BalanceSheet /> },
      // Wildcard for future tools (shows placeholder)
      { path: 'toolkit/:tool', element: <ToolPage /> },
    ],
  },
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ModeProvider>
      <RouterProvider router={router} />
    </ModeProvider>
  </StrictMode>,
)
