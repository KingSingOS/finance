import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Mode = 'ops' | 'learning'

interface ModeContextValue {
  mode: Mode
  setMode: (mode: Mode) => void
  toggleMode: () => void
}

const STORAGE_KEY = 'financial-toolkit-mode'

const ModeContext = createContext<ModeContextValue | null>(null)

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored === 'learning' ? 'learning' : 'ops'
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
  }, [mode])

  const setMode = (newMode: Mode) => setModeState(newMode)
  const toggleMode = () => setModeState(m => (m === 'ops' ? 'learning' : 'ops'))

  return (
    <ModeContext.Provider value={{ mode, setMode, toggleMode }}>
      {children}
    </ModeContext.Provider>
  )
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext)
  if (!ctx) throw new Error('useMode must be used within a ModeProvider')
  return ctx
}
