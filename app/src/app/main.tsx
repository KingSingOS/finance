import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import { AuthProvider } from '../contexts/AuthContext'
import { BusinessProvider } from '../contexts/BusinessContext'
import { router } from '../router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BusinessProvider>
        <RouterProvider router={router} />
      </BusinessProvider>
    </AuthProvider>
  </StrictMode>,
)
