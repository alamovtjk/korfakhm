// ── Общий helper для запросов к бэкенду ─────────────────────────────────────
// Каждый вызов кидает Error с текстом из {detail: "..."} при !ok, чтобы
// вызывающий код мог показать осмысленную ошибку вместо "что-то пошло не так".

export function authToken() {
  return localStorage.getItem('tc_token')
}

export function adminToken() {
  return sessionStorage.getItem('tc_admin_token')
}

export async function apiFetch(path, { method = 'GET', body, token, timeout = 8000 } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch('/api' + path, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeout),
  })
  let data = null
  try { data = await res.json() } catch { /* пустой ответ (204 и т.п.) */ }
  if (!res.ok) throw new Error(data?.detail || `http_${res.status}`)
  return data
}
