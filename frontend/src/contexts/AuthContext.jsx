import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

const API = '/api/auth'

// ── localStorage fallback (works without backend) ─────────────────────────
function lsGetUsers() { return JSON.parse(localStorage.getItem('tc_users') || '[]') }
function lsSaveUsers(list) { localStorage.setItem('tc_users', JSON.stringify(list)) }
function lsSession(u) { localStorage.setItem('tc_session', JSON.stringify(u)) }
function lsClearSession() { localStorage.removeItem('tc_session') }

function lsRegister(name, email, password) {
  const users = lsGetUsers()
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) return { error: 'email_taken' }
  const newUser = { id: Date.now(), name, email: email.toLowerCase(), password, results: {} }
  lsSaveUsers([...users, newUser])
  const session = { id: newUser.id, name, email: newUser.email }
  lsSession(session)
  return { ok: true, user: session, token: null }
}

function lsLogin(email, password) {
  const users = lsGetUsers()
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password)
  if (!found) return { error: 'wrong_credentials' }
  const session = { id: found.id, name: found.name, email: found.email }
  lsSession(session)
  return { ok: true, user: session, token: null }
}

// ── API helpers ───────────────────────────────────────────────────────────
async function apiPost(path, body, token) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(API + path, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(4000),
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

  // token is stored separately (null when using localStorage fallback)
  const getToken = () => localStorage.getItem('tc_token')

  async function register(name, email, password) {
    try {
      const data = await apiPost('/register', { name, email, password })
      localStorage.setItem('tc_token', data.token)
      lsSession(data.user)
      setUser(data.user)
      return { ok: true }
    } catch (e) {
      if (e.message === 'email_taken') return { error: 'email_taken' }
      // backend unavailable — use localStorage
      const res = lsRegister(name, email, password)
      if (res.ok) setUser(res.user)
      return res
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
      // backend unavailable — use localStorage
      const res = lsLogin(email, password)
      if (res.ok) setUser(res.user)
      return res
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

    // Save to backend if token exists
    if (token) {
      try {
        const path = type === 'iq' ? '/save-iq' : '/save-quiz'
        const body = type === 'iq'
          ? { iq: data.iq, level: data.level || '', percentile: data.percentile || 0 }
          : { riasec: data.riasec || {}, professions: data.professions || [] }
        await apiPost(path, body, token)
      } catch {
        // silently ignore backend errors
      }
    }

    // Always also save to localStorage as cache
    const users = lsGetUsers()
    const idx = users.findIndex(u => u.id === user.id)
    if (idx !== -1) {
      users[idx].results = { ...users[idx].results, [type]: { ...data, savedAt: Date.now() } }
      lsSaveUsers(users)
    }
  }

  function getUserResults() {
    if (!user) return {}
    const users = lsGetUsers()
    const found = users.find(u => u.id === user.id)
    return found?.results || {}
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout, saveResult, getUserResults }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
