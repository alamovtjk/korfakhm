import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Plus, Edit2, Trash2, X, Check, Building2, MapPin, ChevronRight } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../contexts/AuthContext'
import { vacancyService } from '../services/vacancyService'

const CATEGORIES = ['IT','Дизайн','Маркетинг','Управление','Финансы','Медицина','Образование','Аналитика','Бизнес','Другое']
const CITIES     = ['Душанбе','Худжанд','Куляб','Истаравшан','Бохтар','Другой город']
const TYPES      = ['Офис','Удалённо','Гибрид']

function Modal({ vacancy, onClose, onSave, isDark, lang }) {
  const [form, setForm] = useState(vacancy)
  const T = lang === 'tj'
    ? { save:'Сохранить', cancel:'Бекор', pos:'Вазифа', company:'Ширкат', salary:'Маош', city:'Шаҳр', type:'Формат', cat:'Категория', desc:'Тавсиф', contact:'Алоқа' }
    : { save:'Сохранить', cancel:'Отмена', pos:'Должность', company:'Компания', salary:'Зарплата', city:'Город', type:'Формат', cat:'Категория', desc:'Описание', contact:'Контакт' }

  const inp = `w-full px-3 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
    isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500' : 'bg-white border-slate-200 text-slate-900 focus:border-blue-500'
  }`

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 20 }}
        transition={{ duration: 0.22 }}
        className={`w-full max-w-lg rounded-3xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'tj' ? 'Вакансияро таҳрир кунед' : 'Редактировать вакансию'}
          </h3>
          <button onClick={onClose} className={`p-1.5 rounded-lg ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3">
          {[
            { key: 'position', label: T.pos, type: 'text' },
            { key: 'company',  label: T.company, type: 'text' },
            { key: 'salary',   label: T.salary,  type: 'text' },
            { key: 'contact',  label: T.contact, type: 'text' },
          ].map(({ key, label, type }) => (
            <div key={key}>
              <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</label>
              <input type={type} value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className={inp} />
            </div>
          ))}

          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'city',     label: T.city, opts: CITIES    },
              { key: 'type',     label: T.type, opts: TYPES     },
              { key: 'category', label: T.cat,  opts: CATEGORIES },
            ].map(({ key, label, opts }) => (
              <div key={key}>
                <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{label}</label>
                <select value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} className={inp + ' cursor-pointer'}>
                  {opts.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div>
            <label className={`block text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{T.desc}</label>
            <textarea value={form.description || ''} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
              rows={3} className={inp + ' resize-none'} />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
            isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-600 hover:bg-slate-50'
          }`}>{T.cancel}</button>
          <button onClick={() => onSave(form)} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20 transition-all hover:-translate-y-0.5">
            <Check size={15} /> {T.save}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function MyVacancies() {
  const navigate   = useNavigate()
  const { isDark } = useTheme()
  const { lang }   = useLang()
  const { user }   = useAuth()

  const [vacancies, setVacancies] = useState([])
  const [editing,   setEditing]   = useState(null)
  const [deleting,  setDeleting]  = useState(null)

  useEffect(() => {
    if (!user) { navigate('/auth', { state: { from: '/my-vacancies' } }); return }
    reload()
  }, [user]) // eslint-disable-line

  function reload() {
    const all = vacancyService.getPublished()
    setVacancies(all.filter(v => v.ownerEmail?.toLowerCase() === user?.email?.toLowerCase()))
  }

  function handleSave(updated) {
    vacancyService.update(updated.id, updated)
    setEditing(null)
    reload()
  }

  function handleDelete(id) {
    vacancyService.delete(id)
    setDeleting(null)
    reload()
  }

  const T = lang === 'tj'
    ? { title: 'Вакансияҳои ман', sub: 'Вакансияҳое, ки шумо гузоштед', empty: 'Шумо ҳанӯз вакансия нагузоштед', empty_btn: 'Вакансия гузоред', edit: 'Таҳрир', del: 'Нест кардан', confirm_del: 'Ин вакансияро нест кунем?', cancel: 'Бекор', salary: 'маош', posted: 'Нашршуда' }
    : { title: 'Мои вакансии', sub: 'Вакансии, которые вы разместили', empty: 'Вы ещё не разместили вакансии', empty_btn: 'Разместить вакансию', edit: 'Редактировать', del: 'Удалить', confirm_del: 'Удалить эту вакансию?', cancel: 'Отмена', salary: 'зарплата', posted: 'Опубликовано' }

  if (!user) return null

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#0a0e1a]' : 'bg-[#f0f4ff]'}`}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
              isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-50 text-blue-700'
            }`}>
              <Briefcase size={11} /> {vacancies.length} {lang === 'tj' ? 'вакансия' : 'вакансий'}
            </div>
            <h1 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.title}</h1>
            <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{T.sub}</p>
          </div>
          <button
            onClick={() => navigate('/post-vacancy')}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={15} />
            {lang === 'tj' ? 'Нав' : 'Новая'}
          </button>
        </div>

        {/* List */}
        {vacancies.length === 0 ? (
          <div className={`rounded-2xl border py-16 text-center ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'}`}>
            <Briefcase size={40} className={`mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
            <p className={`font-semibold mb-4 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{T.empty}</p>
            <button
              onClick={() => navigate('/post-vacancy')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md"
            >
              <Plus size={14} /> {T.empty_btn}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {vacancies.map(v => (
              <motion.div
                key={v.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`rounded-2xl border p-5 ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white font-bold text-base shadow-md flex-shrink-0">
                      {v.company.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className={`font-bold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{v.position}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Building2 size={11} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
                        <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{v.company}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin size={11} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
                          <span className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{v.city}</span>
                        </div>
                        <span className={`text-xs font-semibold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                          {v.salary} {lang === 'tj' ? 'сом.' : 'сом.'}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                          isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
                        }`}>{T.posted}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => setEditing(v)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isDark ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <Edit2 size={12} /> {T.edit}
                    </button>
                    <button
                      onClick={() => setDeleting(v.id)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={12} /> {T.del}
                    </button>
                  </div>
                </div>

                <p className={`text-xs mt-3 pt-3 border-t leading-relaxed ${
                  isDark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'
                }`}>
                  {v.description}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editing && (
          <Modal
            vacancy={editing}
            onClose={() => setEditing(null)}
            onSave={handleSave}
            isDark={isDark}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* Delete confirm */}
      <AnimatePresence>
        {deleting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`w-full max-w-sm rounded-2xl border p-6 shadow-2xl ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <Trash2 size={28} className="text-red-500 mb-3" />
              <p className={`font-bold mb-5 ${isDark ? 'text-white' : 'text-slate-900'}`}>{T.confirm_del}</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleting(null)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border ${isDark ? 'border-slate-700 text-slate-400' : 'border-slate-300 text-slate-600'}`}>{T.cancel}</button>
                <button onClick={() => handleDelete(deleting)} className="flex-1 py-2.5 rounded-xl text-sm font-bold bg-red-600 hover:bg-red-500 text-white transition-colors">{T.del}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
