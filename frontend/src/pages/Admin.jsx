import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LogOut, Plus, Pencil, Trash2, Check, X, BarChart3,
  Briefcase, ClipboardList, Eye, Shield, ChevronDown,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { adminAuth, adminVacancyService } from '../services/adminService'

const EMPTY_FORM = { company: '', position: '', category: 'IT', salary: '', city: 'Душанбе', type: 'Офис', description: '', contact: '' }

const CATEGORIES = ['IT', 'Дизайн', 'Маркетинг', 'Управление', 'Финансы', 'Медицина', 'Образование', 'Аналитика', 'Бизнес', 'Другое']
const CITIES = ['Душанбе', 'Худжанд', 'Куляб', 'Истаравшан', 'Бохтар', 'Удалённо', 'Другой город']
const TYPES = ['Офис', 'Гибрид', 'Remote']

// ─── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ isDark, t, onLogin }) {
  const [pw, setPw] = useState('')
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await adminAuth.login(pw)
      onLogin()
    } catch {
      setErr(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 page`}>
      <div className={`w-full max-w-sm rounded-2xl border p-8 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
            <Shield size={26} className="text-white" />
          </div>
        </div>
        <h1 className={`text-xl font-bold text-center mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.adm_login_title}</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <input
              type="password"
              value={pw}
              onChange={e => { setPw(e.target.value); setErr(false) }}
              placeholder={t.adm_password}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                err
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                  : isDark
                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                    : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
              }`}
            />
            {err && <p className="text-red-500 text-xs mt-1.5">{t.adm_wrong_pw}</p>}
          </div>
          <button
            type="submit"
            disabled={loading || !pw}
            className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-50 text-white py-3 rounded-xl font-semibold transition-all"
          >
            {loading ? '...' : t.adm_login_btn}
          </button>
        </form>
      </div>
    </div>
  )
}

// ─── Vacancy Form Modal ───────────────────────────────────────────────────────
function VacancyModal({ isDark, t, initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM)

  function set(k, v) { setForm(p => ({ ...p, [k]: v })) }

  const inputCls = `w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
    isDark
      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
      : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500'
  }`
  const labelCls = `block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`
  const selectCls = inputCls + ' cursor-pointer'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-lg rounded-2xl border shadow-2xl max-h-[90vh] overflow-y-auto ${
        isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <div className={`flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`}>
          <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {initial ? t.adm_modal_edit : t.adm_modal_add}
          </h2>
          <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t.adm_company}</label>
              <input className={inputCls} value={form.company} onChange={e => set('company', e.target.value)} placeholder="Alif Tech" />
            </div>
            <div>
              <label className={labelCls}>{t.adm_position}</label>
              <input className={inputCls} value={form.position} onChange={e => set('position', e.target.value)} placeholder="Frontend Developer" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>{t.adm_salary}</label>
              <input className={inputCls} value={form.salary} onChange={e => set('salary', e.target.value)} placeholder="3 000–6 000" />
            </div>
            <div>
              <label className={labelCls}>{t.adm_contact}</label>
              <input className={inputCls} value={form.contact} onChange={e => set('contact', e.target.value)} placeholder="hr@company.tj" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>{t.adm_city}</label>
              <select className={selectCls} value={form.city} onChange={e => set('city', e.target.value)}>
                {CITIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t.adm_type}</label>
              <select className={selectCls} value={form.type} onChange={e => set('type', e.target.value)}>
                {TYPES.map(tp => <option key={tp}>{tp}</option>)}
              </select>
            </div>
            <div>
              <label className={labelCls}>{t.adm_category}</label>
              <select className={selectCls} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelCls}>{t.adm_description}</label>
            <textarea
              className={inputCls + ' resize-none'}
              rows={3}
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Описание вакансии..."
            />
          </div>
        </div>

        <div className={`flex gap-3 px-5 py-4 border-t sticky bottom-0 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl font-medium text-sm border transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>
            {t.adm_cancel}
          </button>
          <button
            onClick={() => { if (form.company && form.position) onSave(form) }}
            disabled={!form.company || !form.position}
            className="flex-1 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 text-white py-2.5 rounded-xl font-semibold text-sm transition-all"
          >
            {t.adm_save}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Admin Dashboard ─────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { t } = useLang()
  const [authed, setAuthed] = useState(adminAuth.isLoggedIn())
  const [tab, setTab] = useState('vacancies')
  const [vacancies, setVacancies] = useState([])
  const [modal, setModal] = useState(null) // null | { type: 'add' } | { type: 'edit', item }
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [toast, setToast] = useState(null)

  const refresh = useCallback(() => {
    adminVacancyService.getAll().then(setVacancies).catch(() => setVacancies([]))
  }, [])

  useEffect(() => { if (authed) refresh() }, [authed, refresh])

  // "Заявки" — те же вакансии, просто со статусом не "published"
  const requests = vacancies.filter(v => v.status !== 'published')

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2500)
  }

  async function handleSave(form) {
    if (modal.type === 'add') {
      await adminVacancyService.add(form)
      showToast('Вакансия добавлена')
    } else {
      await adminVacancyService.update(modal.item.id, form)
      showToast('Вакансия обновлена')
    }
    setModal(null)
    refresh()
  }

  async function handleDelete(id) {
    await adminVacancyService.delete(id)
    setDeleteConfirm(null)
    refresh()
    showToast('Удалено', 'error')
  }

  async function handleApprove(id) {
    await adminVacancyService.approve(id)
    refresh()
    showToast('Вакансия опубликована')
  }

  async function handleReject(id) {
    await adminVacancyService.reject(id)
    refresh()
    showToast('Заявка отклонена', 'error')
  }

  function logout() {
    adminAuth.logout()
    setAuthed(false)
  }

  if (!authed) return <LoginScreen isDark={isDark} t={t} onLogin={() => { setAuthed(true) }} />

  const published = vacancies.filter(v => v.status === 'published').length
  const pendingReqs = requests.filter(r => r.status === 'pending').length

  const card = `rounded-2xl border ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`
  const th = `text-xs font-bold uppercase px-4 py-3 text-left ${isDark ? 'text-slate-500' : 'text-slate-400'}`
  const td = `px-4 py-3.5 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`

  return (
    <div className={`min-h-screen transition-colors page`}>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] px-4 py-2.5 rounded-xl shadow-lg text-white text-sm font-medium flex items-center gap-2 ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-emerald-600'
        }`}>
          {toast.type === 'error' ? <X size={14} /> : <Check size={14} />}
          {toast.msg}
        </div>
      )}

      {/* Modals */}
      {modal && (
        <VacancyModal
          isDark={isDark}
          t={t}
          initial={modal.item}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
          <div className={`relative rounded-2xl border p-6 max-w-sm w-full shadow-2xl ${isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            <p className={`font-semibold mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.adm_confirm_delete}</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className={`flex-1 py-2.5 rounded-xl border text-sm font-medium ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}>{t.adm_cancel}</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-semibold transition-colors">{t.adm_delete}</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className={`sticky top-0 z-40 border-b glass ${isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-lg flex items-center justify-center">
              <Shield size={15} className="text-white" />
            </div>
            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.adm_title}</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className={`text-sm flex items-center gap-1.5 ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>
              <Eye size={15} /> Сайт
            </button>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-400 transition-colors">
              <LogOut size={15} /> {t.adm_logout}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: Briefcase, label: t.adm_total, value: vacancies.length, color: 'text-blue-500', bg: isDark ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200' },
            { icon: ClipboardList, label: t.adm_pending, value: pendingReqs, color: 'text-orange-500', bg: isDark ? 'bg-orange-900/20 border-orange-800/30' : 'bg-orange-50 border-orange-200' },
            { icon: BarChart3, label: t.adm_published, value: published, color: 'text-emerald-500', bg: isDark ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200' },
          ].map((s, i) => (
            <div key={i} className={`rounded-xl border p-4 ${s.bg}`}>
              <s.icon size={20} className={`${s.color} mb-2`} />
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 rounded-xl p-1 mb-6 w-fit ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/60'}`}>
          {[
            { id: 'vacancies', label: t.adm_tab_vacancies, icon: Briefcase },
            { id: 'requests', label: t.adm_tab_requests, icon: ClipboardList, badge: pendingReqs },
          ].map(tab_ => (
            <button
              key={tab_.id}
              onClick={() => setTab(tab_.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all relative ${
                tab === tab_.id
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab_.icon size={15} />
              {tab_.label}
              {tab_.badge > 0 && (
                <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center ${tab === tab_.id ? 'bg-orange-500' : 'bg-orange-500'}`}>
                  {tab_.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Vacancies tab */}
        {tab === 'vacancies' && (
          <div className={card}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
              <h2 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.adm_tab_vacancies}</h2>
              <button
                onClick={() => setModal({ type: 'add' })}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all"
              >
                <Plus size={15} /> {t.adm_add}
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={`border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <tr>
                    <th className={th}>{t.adm_company}</th>
                    <th className={th}>{t.adm_position}</th>
                    <th className={th + ' hidden sm:table-cell'}>{t.adm_category}</th>
                    <th className={th + ' hidden md:table-cell'}>{t.adm_salary}</th>
                    <th className={th + ' hidden md:table-cell'}>{t.adm_city}</th>
                    <th className={th}></th>
                  </tr>
                </thead>
                <tbody>
                  {vacancies.map((v, i) => (
                    <tr key={v.id} className={`border-b transition-colors ${
                      isDark
                        ? `${i % 2 === 0 ? '' : 'bg-slate-800/30'} border-slate-800/50 hover:bg-slate-800/50`
                        : `${i % 2 === 0 ? '' : 'bg-slate-50/50'} border-slate-100 hover:bg-slate-50`
                    }`}>
                      <td className={td}>
                        <div className="font-semibold">{v.company}</div>
                        <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{v.contact}</div>
                      </td>
                      <td className={td}>{v.position}</td>
                      <td className={td + ' hidden sm:table-cell'}>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>{v.category}</span>
                      </td>
                      <td className={td + ' hidden md:table-cell font-medium text-emerald-500'}>{v.salary}</td>
                      <td className={td + ' hidden md:table-cell'}>{v.city}</td>
                      <td className={td}>
                        <div className="flex items-center gap-1 justify-end">
                          <button
                            onClick={() => setModal({ type: 'edit', item: v })}
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-700 text-slate-400 hover:text-blue-400' : 'hover:bg-slate-100 text-slate-400 hover:text-blue-500'}`}
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(v.id)}
                            className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-red-900/30 text-slate-400 hover:text-red-400' : 'hover:bg-red-50 text-slate-400 hover:text-red-500'}`}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {vacancies.length === 0 && (
                <div className={`text-center py-12 text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Вакансий нет</div>
              )}
            </div>
          </div>
        )}

        {/* Requests tab */}
        {tab === 'requests' && (
          <div className="space-y-3">
            {requests.length === 0 && (
              <div className={`${card} text-center py-16`}>
                <ClipboardList size={36} className={`mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.adm_empty_requests}</p>
              </div>
            )}
            {requests.map(req => (
              <div key={req.id} className={`${card} p-5`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{req.position}</span>
                      {req.status === 'pending' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-500 border border-orange-500/30">{t.adm_new_badge}</span>
                      )}
                      {req.status === 'approved' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-500 border border-emerald-500/30">Опубликовано</span>
                      )}
                      {req.status === 'rejected' && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500/20 text-red-500 border border-red-500/30">Отклонено</span>
                      )}
                    </div>
                    <div className="text-blue-500 text-sm font-medium">{req.company}</div>
                    <div className={`flex flex-wrap gap-3 mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>📍 {req.city}</span>
                      <span>💼 {req.type}</span>
                      <span>💰 {req.salary}</span>
                      <span>📂 {req.category}</span>
                    </div>
                    {req.description && (
                      <p className={`text-sm mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{req.description}</p>
                    )}
                    <div className={`text-xs mt-2 font-medium ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      {t.adm_contact}: <span className={isDark ? 'text-slate-300' : 'text-slate-700'}>{req.contact}</span>
                    </div>
                  </div>
                  {req.status === 'pending' && (
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleReject(req.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium border transition-colors ${isDark ? 'border-red-800/50 text-red-400 hover:bg-red-900/20' : 'border-red-200 text-red-600 hover:bg-red-50'}`}
                      >
                        <X size={14} /> {t.adm_reject}
                      </button>
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                      >
                        <Check size={14} /> {t.adm_approve}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
