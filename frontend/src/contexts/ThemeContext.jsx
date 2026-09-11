import { createContext, useContext, useEffect, useState } from 'react'

/* Светлая тема — витрина по умолчанию, тёмная — по выбору пользователя.
   Класс .dark на <html> ставится СИНХРОННО ещё до рендера React'ом
   инлайн-скриптом в index.html (см. комментарий там) — это только
   держит React-состояние в согласии с тем, что уже на странице, и
   переключает/сохраняет выбор. */
const ThemeContext = createContext({ theme: 'light', isDark: false, toggle: () => {} })

function getInitialTheme() {
  if (typeof document !== 'undefined' && document.documentElement.classList.contains('dark')) return 'dark'
  try {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark' || saved === 'light') return saved
  } catch { /* localStorage недоступен (приватный режим и т.п.) */ }
  return 'light'
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    try { localStorage.setItem('theme', theme) } catch { /* ignore */ }
  }, [theme])

  function toggle() {
    setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }

  return (
    <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
