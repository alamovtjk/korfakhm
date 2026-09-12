import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2, Loader2, Building2, ArrowLeft, Megaphone } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../contexts/AuthContext'
import { useSeo } from '../hooks/useSeo'
import { vacancyService } from '../services/vacancyService'

const EMPTY = { company: '', position: '', salary: '', city: '', type: 'Офис', category: 'IT', description: '', contact: '' }

export default function PostVacancy() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { t, lang } = useLang()
  const { user } = useAuth()
  const tj = lang === 'tj'

  useSeo({
    title: tj ? 'Вакансия гузоштан' : 'Разместить вакансию',
    description: tj
      ? 'Вакансияро ройгон гузоред ва дар Тоҷикистон зуд кормандро пайдо кунед.'
      : 'Разместите вакансию бесплатно и найдите сотрудника в Таджикистане быстро.',
    path: '/post-vacancy',
  })

  const [form, setForm] = useState({ ...EMPTY, contact: user?.email || '' })
  const [errors, setErrors] = useState({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  function set(k, v) { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: '' })) }

  function validate() {
    const e = {}
    if (!form.company.trim()) e.company = t.pv_required
    if (!form.position.trim()) e.position = t.pv_required
    if (!form.contact.trim()) e.contact = t.pv_required
    if (!form.city.trim()) e.city = t.pv_required
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function submit(e) {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setSubmitError('')
    try {
      // Любая заявка (гостя или зарегистрированного) уходит на модерацию —
      // публикует только админ.
      await vacancyService.submit(form)
      setDone(true)
    } catch {
      setSubmitError(t.pv_error)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = (field) => `w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
    errors[field]
      ? 'border-red-500 ' + (isDark ? 'bg-red-900/10' : 'bg-red-50')
      : isDark
        ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-500 shadow-sm'
  }`
  const labelCls = `block text-sm font-semibold mb-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`
  const selectCls = inputCls('') + ' cursor-pointer'

  if (done) {
    return (
      <div className={`min-h-screen transition-colors page`}>
        <Navbar />
        <div className="flex items-center justify-center px-4 py-24">
          <div className={`text-center max-w-md rounded-3xl border p-10 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-lg'}`}>
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-500/30">
              <CheckCircle2 size={30} className="text-white" />
            </div>
            <h2 className={`text-2xl font-extrabold mb-3 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.pv_success_title}</h2>
            <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.pv_success_sub}</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => { setForm(EMPTY); setDone(false) }}
                className={`py-3 rounded-xl border font-medium text-sm transition-colors ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'}`}
              >
                {t.pv_send_another}
              </button>
              <button
                onClick={() => navigate('/')}
                className="py-3 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all"
              >
                {t.pv_back}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-colors page`}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className={`flex items-center gap-1.5 text-sm font-medium mb-6 transition-colors ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}
        >
          <ArrowLeft size={15} /> {t.pv_back}
        </button>

        {/* Header */}
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-400 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-orange-500/30">
            <Megaphone size={22} className="text-white" />
          </div>
          <div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.pv_title}</h1>
            <p className={`mt-1 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.pv_sub}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={submit} noValidate>
          <div className={`rounded-2xl border p-6 sm:p-7 space-y-5 ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>

            {/* Company + Position */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t.pv_company} *</label>
                <input
                  className={inputCls('company')}
                  value={form.company}
                  onChange={e => set('company', e.target.value)}
                  placeholder="Alif Tech"
                />
                {errors.company && <p className="text-red-500 text-xs mt-1">{errors.company}</p>}
              </div>
              <div>
                <label className={labelCls}>{t.pv_position} *</label>
                <input
                  className={inputCls('position')}
                  value={form.position}
                  onChange={e => set('position', e.target.value)}
                  placeholder="Frontend Developer"
                />
                {errors.position && <p className="text-red-500 text-xs mt-1">{errors.position}</p>}
              </div>
            </div>

            {/* Salary + City */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t.pv_salary}</label>
                <input
                  className={inputCls('salary')}
                  value={form.salary}
                  onChange={e => set('salary', e.target.value)}
                  placeholder="4 000–7 000 сомонӣ"
                />
              </div>
              <div>
                <label className={labelCls}>{t.pv_city} *</label>
                <select className={selectCls} value={form.city} onChange={e => set('city', e.target.value)}>
                  <option value="">— Выберите —</option>
                  {t.pv_cities.map(c => <option key={c}>{c}</option>)}
                </select>
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Type + Category */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>{t.pv_type}</label>
                <div className="flex gap-2">
                  {[t.pv_type_office, t.pv_type_remote, t.pv_type_hybrid].map((tp, i) => {
                    const vals = ['Офис', 'Remote', 'Гибрид']
                    const selected = form.type === vals[i]
                    return (
                      <button
                        key={tp}
                        type="button"
                        onClick={() => set('type', vals[i])}
                        className={`flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-all ${
                          selected
                            ? 'border-blue-500 bg-blue-600/10 text-blue-500'
                            : isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600' : 'border-slate-300 text-slate-500 hover:border-slate-400'
                        }`}
                      >
                        {tp}
                      </button>
                    )
                  })}
                </div>
              </div>
              <div>
                <label className={labelCls}>{t.pv_category}</label>
                <select className={selectCls} value={form.category} onChange={e => set('category', e.target.value)}>
                  {t.pv_categories.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>{t.pv_desc}</label>
              <textarea
                className={inputCls('description') + ' resize-none'}
                rows={4}
                value={form.description}
                onChange={e => set('description', e.target.value)}
                placeholder="Опишите вакансию, требования, условия работы..."
              />
            </div>

            {/* Contact */}
            <div>
              <label className={labelCls}>{t.pv_contact} *</label>
              <input
                className={inputCls('contact')}
                value={form.contact}
                onChange={e => set('contact', e.target.value)}
                placeholder="+992 90 000 0000 или @telegram"
              />
              {errors.contact && <p className="text-red-500 text-xs mt-1">{errors.contact}</p>}
            </div>

            {submitError && <p className="text-red-500 text-sm text-center -mt-1">{submitError}</p>}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:opacity-50 text-white py-4 rounded-xl font-bold text-base shadow-lg shadow-orange-500/25 transition-all hover:-translate-y-0.5"
            >
              {loading ? <><Loader2 size={18} className="animate-spin" /> {t.pv_submitting}</> : <><Megaphone size={18} /> {t.pv_submit}</>}
            </button>
          </div>
        </form>

        {/* Info box */}
        <div className={`mt-6 rounded-xl border p-4 flex items-start gap-3 ${isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-blue-50 border-blue-200'}`}>
          <Building2 size={18} className={`flex-shrink-0 mt-0.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-blue-700'}`}>
            После подачи заявки наш администратор проверит данные и опубликует вакансию в течение 24 часов. Услуга абсолютно бесплатная.
          </p>
        </div>
      </div>
    </div>
  )
}
