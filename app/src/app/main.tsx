import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import './index.css'
import Layout from './Layout'
import { ModeProvider } from './contexts/ModeContext'
import CapTablePage from './cap-table/page.tsx'
import ToolkitPage from './toolkit/page.tsx'
import ToolPage from './toolkit/ToolPage.tsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/cap-table" replace /> },
      { path: 'cap-table', element: <CapTablePage /> },
      { path: 'toolkit', element: <ToolkitPage /> },
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
