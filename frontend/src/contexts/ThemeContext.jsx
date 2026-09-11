import { createContext, useContext, useEffect } from 'react'

/* Тема всегда тёмная — как на alteno.dev. Контекст оставлен ради
   страниц, которые всё ещё читают isDark. */
const ThemeContext = createContext({ theme: 'dark', isDark: true, toggle: () => {} })

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.add('dark')
    document.body.classList.remove('light-mode')
  }, [])
  return (
    <ThemeContext.Provider value={{ theme: 'dark', isDark: true, toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
