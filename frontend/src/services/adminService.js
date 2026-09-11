// Админ-сессия — отдельный JWT (не совпадает с паролем и не совпадает
// с токеном обычного пользователя), живёт в sessionStorage и истекает
// на сервере через 12 часов.
import { apiFetch, adminToken } from './api'

export const adminAuth = {
  async login(password) {
    const data = await apiFetch('/admin/login', { method: 'POST', body: { password } })
    sessionStorage.setItem('tc_admin_token', data.token)
    return true
  },
  logout() {
    sessionStorage.removeItem('tc_admin_token')
  },
  isLoggedIn() {
    return !!adminToken()
  },
}

export const adminVacancyService = {
  async getAll(status) {
    const qs = status ? `?status=${encodeURIComponent(status)}` : ''
    return apiFetch(`/admin/vacancies${qs}`, { token: adminToken() })
  },
  async add(form) {
    return apiFetch('/admin/vacancies', { method: 'POST', body: { ...form, status: 'published' }, token: adminToken() })
  },
  async update(id, form) {
    return apiFetch(`/admin/vacancies/${id}`, { method: 'PUT', body: form, token: adminToken() })
  },
  async delete(id) {
    return apiFetch(`/admin/vacancies/${id}`, { method: 'DELETE', token: adminToken() })
  },
  async approve(id) {
    return apiFetch(`/admin/vacancies/${id}/approve`, { method: 'PUT', token: adminToken() })
  },
  async reject(id) {
    return apiFetch(`/admin/vacancies/${id}/reject`, { method: 'PUT', token: adminToken() })
  },
}
