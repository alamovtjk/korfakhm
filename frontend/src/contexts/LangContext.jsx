import { createContext, useContext, useState } from 'react'
import ru from '../i18n/ru'
import tj from '../i18n/tj'

const LANGS = { ru, tj }
const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'ru')

  function setLanguage(l) {
    setLang(l)
    localStorage.setItem('lang', l)
  }

  const t = LANGS[lang] || ru

  return (
    <LangContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}
