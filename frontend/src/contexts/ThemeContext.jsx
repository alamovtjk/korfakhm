import { createContext, useContext, useEffect } from 'react'

/* Тема всегда светлая — чистый белый SaaS-дизайн. Контекст оставлен
   ради страниц, которые всё ещё читают isDark: их internal
   isDark ? darkClasses : lightClasses теперь всегда берёт светлую ветку. */
const ThemeContext = createContext({ theme: 'light', isDark: false, toggle: () => {} })

export function ThemeProvider({ children }) {
  useEffect(() => {
    document.documentElement.classList.remove('dark')
    document.body.classList.remove('light-mode')
  }, [])
  return (
    <ThemeContext.Provider value={{ theme: 'light', isDark: false, toggle: () => {} }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
