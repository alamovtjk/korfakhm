const SEED_VACANCIES = [
  { id: 1, company: 'Alif Tech', position: 'Junior Frontend Developer', category: 'IT', salary: '3 000–5 000', city: 'Душанбе', type: 'Офис', description: 'Разработка веб-приложений на React.js', contact: 'hr@alif.tj', status: 'published' },
  { id: 2, company: 'IdeaSoft', position: 'React Developer', category: 'IT', salary: '4 000–7 000', city: 'Душанбе', type: 'Гибрид', description: 'Фронтенд-разработка корпоративных приложений', contact: 'jobs@ideasoft.tj', status: 'published' },
  { id: 3, company: 'Прогресс Банк', position: 'Web Developer', category: 'IT', salary: '3 500–6 000', city: 'Душанбе', type: 'Офис', description: 'Поддержка банковских веб-сервисов', contact: 'hr@progress.tj', status: 'published' },
  { id: 4, company: 'IMON International', position: 'Data Analyst', category: 'Аналитика', salary: '4 000–7 000', city: 'Душанбе', type: 'Офис', description: 'Анализ финансовых данных и построение отчётов', contact: 'hr@imon.tj', status: 'published' },
  { id: 5, company: 'МегаФон Таджикистан', position: 'Digital Marketing Specialist', category: 'Маркетинг', salary: '3 500–6 000', city: 'Душанбе', type: 'Офис', description: 'Ведение digital-кампаний и SMM', contact: 'careers@megafon.tj', status: 'published' },
  { id: 6, company: 'Somon IT', position: 'Python Developer', category: 'IT', salary: '5 000–9 000', city: 'Душанбе', type: 'Гибрид', description: 'Backend-разработка на Python/Django', contact: 'hr@somon.tj', status: 'published' },
  { id: 7, company: 'Remote Startup', position: 'Frontend Engineer', category: 'IT', salary: '$300–600', city: 'Удалённо', type: 'Remote', description: 'Разработка на React для международного рынка', contact: 'hello@startup.com', status: 'published' },
  { id: 8, company: 'Агентство Дизайн', position: 'UX/UI Designer', category: 'Дизайн', salary: '3 000–5 500', city: 'Душанбе', type: 'Гибрид', description: 'Разработка интерфейсов мобильных приложений', contact: 'design@agency.tj', status: 'published' },
]

function getAll() {
  const stored = localStorage.getItem('tc_vacancies')
  if (!stored) {
    localStorage.setItem('tc_vacancies', JSON.stringify(SEED_VACANCIES))
    return SEED_VACANCIES
  }
  return JSON.parse(stored)
}

function save(list) {
  localStorage.setItem('tc_vacancies', JSON.stringify(list))
}

function nextId(list) {
  return list.length > 0 ? Math.max(...list.map(v => v.id)) + 1 : 1
}

export const vacancyService = {
  getPublished() {
    return getAll().filter(v => v.status === 'published')
  },
  getAll() {
    return getAll()
  },
  getByOwner(email) {
    return getAll().filter(v => v.ownerEmail?.toLowerCase() === email?.toLowerCase())
  },
  add(data) {
    const list = getAll()
    const item = { ...data, id: nextId(list), status: 'published', createdAt: Date.now() }
    list.push(item)
    save(list)
    return item
  },
  update(id, data) {
    const list = getAll()
    const idx = list.findIndex(v => v.id === id)
    if (idx === -1) return null
    list[idx] = { ...list[idx], ...data }
    save(list)
    return list[idx]
  },
  delete(id) {
    const list = getAll().filter(v => v.id !== id)
    save(list)
  },
}

// Vacancy requests (from employers)
function getRequests() {
  const stored = localStorage.getItem('tc_vacancy_requests')
  return stored ? JSON.parse(stored) : []
}

function saveRequests(list) {
  localStorage.setItem('tc_vacancy_requests', JSON.stringify(list))
}

export const requestService = {
  getAll() {
    return getRequests()
  },
  add(data) {
    const list = getRequests()
    const item = { ...data, id: Date.now(), status: 'pending', createdAt: Date.now() }
    list.unshift(item)
    saveRequests(list)
    return item
  },
  approve(id) {
    const requests = getRequests()
    const req = requests.find(r => r.id === id)
    if (!req) return
    // Move to vacancies
    vacancyService.add({
      company: req.company,
      position: req.position,
      category: req.category,
      salary: req.salary,
      city: req.city,
      type: req.type,
      description: req.description,
      contact: req.contact,
    })
    const updated = requests.map(r => r.id === id ? { ...r, status: 'approved' } : r)
    saveRequests(updated)
  },
  reject(id) {
    const updated = getRequests().map(r => r.id === id ? { ...r, status: 'rejected' } : r)
    saveRequests(updated)
  },
  delete(id) {
    saveRequests(getRequests().filter(r => r.id !== id))
  },
}

// Simple admin auth
const ADMIN_PASSWORD = 'admin123'

export const adminAuth = {
  login(password) {
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem('tc_admin', '1')
      return true
    }
    return false
  },
  logout() {
    sessionStorage.removeItem('tc_admin')
  },
  isLoggedIn() {
    return sessionStorage.getItem('tc_admin') === '1'
  },
}
