// Вакансии живут в базе на сервере (таблица vacancies), а не в localStorage
// этого браузера — раньше работодатель "публиковал" вакансию и видел её
// только на своём компьютере. Все функции теперь асинхронные.
import { apiFetch, authToken } from './api'

export const vacancyService = {
  async getPublished({ category, city, limit } = {}) {
    const params = new URLSearchParams()
    if (category && category !== 'Все') params.set('category', category)
    if (city) params.set('city', city)
    if (limit) params.set('limit', limit)
    const qs = params.toString()
    const data = await apiFetch('/vacancies/' + (qs ? `?${qs}` : ''))
    return data.vacancies
  },

  // Заявка от гостя или зарегистрированного — всегда уходит на модерацию.
  async submit(form) {
    return apiFetch('/vacancies/submit', { method: 'POST', body: form, token: authToken() })
  },

  async getMine() {
    const data = await apiFetch('/vacancies/mine', { token: authToken() })
    return data.vacancies
  },

  async updateMine(id, form) {
    return apiFetch(`/vacancies/mine/${id}`, { method: 'PUT', body: form, token: authToken() })
  },

  async deleteMine(id) {
    return apiFetch(`/vacancies/mine/${id}`, { method: 'DELETE', token: authToken() })
  },
}
