import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const API = '/api/auth'

function lsSession(u) { localStorage.setItem('tc_session', JSON.stringify(u)) }
function lsClearSession() { localStorage.removeItem('tc_session') }

// ── API helper ────────────────────────────────────────────────────────────
async function apiPost(path, body, token, method = 'POST') {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(API + path, {
    method,
    headers,
    body: method === 'GET' ? undefined : JSON.stringify(body),
    // Холодный старт бэкенда на Vercel (SQLAlchemy + первое подключение к
    // БД) иногда дольше 4с.
    signal: AbortSignal.timeout(10000),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.detail || 'api_error')
  return data
}

// ── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const s = localStorage.getItem('tc_session')
    return s ? JSON.parse(s) : null
  })

  const getToken = () => localStorage.getItem('tc_token')

  // Результаты теста живут на этом устройстве в localStorage (Dashboard,
  // Results, IQResults читают их напрямую) — так что на новом устройстве
  // после входа кабинет выглядел пустым, хотя результат уже сохранён на
  // сервере. Подтягиваем его один раз при входе/загрузке с токеном и
  // складываем в те же ключи, что страницы уже умеют читать.
  useEffect(() => {
    const token = getToken()
    if (!user || !token) return
    apiPost('/me', undefined, token, 'GET')
      .then(data => {
        if (data.results?.quiz && !localStorage.getItem('quiz_results')) {
          localStorage.setItem('quiz_results', JSON.stringify(data.results.quiz))
        }
        if (data.results?.iq && !localStorage.getItem('iq_results')) {
          localStorage.setItem('iq_results', JSON.stringify(data.results.iq))
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  async function register(name, email, password) {
    try {
      const data = await apiPost('/register', { name, email, password })
      localStorage.setItem('tc_token', data.token)
      lsSession(data.user)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      if (e.message === 'email_taken') return { error: 'email_taken' }
      return { error: 'network' }
    }
  }

  async function login(email, password) {
    try {
      const data = await apiPost('/login', { email, password })
      localStorage.setItem('tc_token', data.token)
      lsSession(data.user)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      if (e.message === 'wrong_credentials') return { error: 'wrong_credentials' }
      return { error: 'network' }
    }
  }

  function logout() {
    lsClearSession()
    localStorage.removeItem('tc_token')
    setUser(null)
  }

  async function saveResult(type, data) {
    if (!user) return
    const token = getToken()
    if (!token) return
    try {
      const path = type === 'iq' ? '/save-iq' : '/save-quiz'
      const body = type === 'iq'
        ? { iq: data.iq, level: data.level || '', percentile: data.percentile || 0 }
        : { riasec: data.riasec || {}, professions: data.professions || [] }
      await apiPost(path, body, token)
    } catch {
      // сервер недоступен — результат остаётся в localStorage (quiz_results/
      // iq_results), Dashboard/Results их и так читают напрямую оттуда
    }
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, saveResult }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
