import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Page from './FinanceWorkspace.tsx'
import { canonicalizeLegacyWorksheetUrl } from './workspaceRouting'

canonicalizeLegacyWorksheetUrl(window.location, window.history)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
)
