import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Building2, MapPin, Search, X, ChevronRight, SlidersHorizontal } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { vacancyService } from '../services/vacancyService'

const TYPE_COLORS = {
  Remote:  { dark: 'bg-violet-900/40 text-violet-400', light: 'bg-violet-50 text-violet-600' },
  Гибрид:  { dark: 'bg-amber-900/30 text-amber-400',   light: 'bg-amber-50 text-amber-600'   },
  Омехта:  { dark: 'bg-amber-900/30 text-amber-400',   light: 'bg-amber-50 text-amber-600'   },
  Офис:    { dark: 'bg-blue-900/30 text-blue-400',     light: 'bg-blue-50 text-blue-600'     },
  Дурдаст: { dark: 'bg-violet-900/40 text-violet-400', light: 'bg-violet-50 text-violet-600' },
}

const AVATAR_COLORS = [
  'from-emerald-500 to-teal-600',
  'from-blue-500 to-cyan-600',
  'from-violet-500 to-purple-600',
  'from-orange-500 to-amber-600',
  'from-rose-500 to-pink-600',
  'from-indigo-500 to-blue-700',
]

function VacancyCard({ v, isDark, lang }) {
  const typeColor = TYPE_COLORS[v.type] || TYPE_COLORS['Офис']
  const avatarColor = AVATAR_COLORS[v.id % AVATAR_COLORS.length]

  return (
    <div className={`group rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl flex flex-col gap-4 ${
      isDark
        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-600 hover:shadow-emerald-500/5'
        : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-slate-200'
    }`}>
      {/* Header */}
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-base font-bold text-white bg-gradient-to-br ${avatarColor} shadow-md flex-shrink-0`}>
          {v.company.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`font-bold text-sm leading-snug truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {v.position}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Building2 size={11} className={isDark ? 'text-slate-500' : 'text-slate-400'} />
            <p className={`text-xs truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{v.company}</p>
          </div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${
          isDark ? typeColor.dark : typeColor.light
        }`}>
          {v.type}
        </span>
      </div>

      {/* Description */}
      <p className={`text-xs leading-relaxed line-clamp-2 flex-1 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
        {v.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <div className="flex items-center gap-1">
          <MapPin size={11} className={isDark ? 'text-slate-600' : 'text-slate-400'} />
          <span className={`text-[11px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{v.city}</span>
        </div>
        <span className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
          {v.salary} {lang === 'tj' ? 'сом.' : 'сом.'}
        </span>
      </div>

      {/* Contact */}
      <a
        href={`mailto:${v.contact}`}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-sm shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
        onClick={e => e.stopPropagation()}
      >
        {lang === 'tj' ? 'Муроҷиат кун' : 'Откликнуться'}
        <ChevronRight size={13} />
      </a>
    </div>
  )
}

export default function Vacancies() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { lang } = useLang()

  const allVacancies = useMemo(() => vacancyService.getPublished(), [])

  const categories = ['all', ...Array.from(new Set(allVacancies.map(v => v.category)))]
  const cities     = ['all', ...Array.from(new Set(allVacancies.map(v => v.city)))]
  const types      = ['all', ...Array.from(new Set(allVacancies.map(v => v.type)))]

  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('all')
  const [city,     setCity]     = useState('all')
  const [type,     setType]     = useState('all')
  const [showFilters, setShowFilters] = useState(false)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return allVacancies.filter(v => {
      if (q && !v.position.toLowerCase().includes(q) && !v.company.toLowerCase().includes(q) && !v.description.toLowerCase().includes(q)) return false
      if (category !== 'all' && v.category !== category) return false
      if (city !== 'all' && v.city !== city) return false
      if (type !== 'all' && v.type !== type) return false
      return true
    })
  }, [allVacancies, search, category, city, type])

  const activeFiltersCount = [category, city, type].filter(f => f !== 'all').length

  const labelAll = lang === 'tj' ? 'Ҳама' : 'Все'

  return (
    <div className={`min-h-screen transition-colors page`}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full mb-3 ${
            isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
          }`}>
            <Briefcase size={11} />
            {allVacancies.length} {lang === 'tj' ? 'вакансия' : 'вакансий'}
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {lang === 'tj' ? 'Вакансияҳои кор' : 'Вакансии в Таджикистане'}
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'tj'
                  ? 'Корро бидуни санҷиш пайдо кунед'
                  : 'Найдите работу без прохождения теста'}
              </p>
            </div>
            <button
              onClick={() => navigate('/post-vacancy')}
              className="flex-shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-500/20 transition-all hover:-translate-y-0.5"
            >
              <Briefcase size={14} />
              {lang === 'tj' ? 'Вакансия гузоред' : 'Разместить вакансию'}
            </button>
          </div>
        </div>

        {/* Search + filter toggle */}
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <Search size={15} className={`absolute left-3.5 top-1/2 -translate-y-1/2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`} />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={lang === 'tj' ? 'Ҷустуҷӯи вазифа ё ширкат...' : 'Поиск по вакансии или компании...'}
              className={`w-full pl-9 pr-9 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-slate-400'
              }`}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className={isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'} />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(s => !s)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              showFilters || activeFiltersCount > 0
                ? isDark ? 'border-blue-500 bg-blue-900/20 text-blue-400' : 'border-blue-400 bg-blue-50 text-blue-600'
                : isDark ? 'border-slate-700 text-slate-400 hover:border-slate-600 hover:text-slate-300' : 'border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="hidden sm:inline">{lang === 'tj' ? 'Филтр' : 'Фильтры'}</span>
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-blue-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter dropdowns */}
        {showFilters && (
          <div className={`rounded-2xl border p-4 mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            {[
              { label: lang === 'tj' ? 'Категория' : 'Категория', value: category, set: setCategory, options: categories },
              { label: lang === 'tj' ? 'Шаҳр'     : 'Город',      value: city,     set: setCity,     options: cities     },
              { label: lang === 'tj' ? 'Формат'   : 'Формат',     value: type,     set: setType,     options: types      },
            ].map(({ label, value, set, options }) => (
              <div key={label}>
                <label className={`block text-xs font-semibold mb-1.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {label}
                </label>
                <select
                  value={value}
                  onChange={e => set(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl border text-sm outline-none transition-colors ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-white focus:border-slate-500'
                      : 'bg-slate-50 border-slate-200 text-slate-800 focus:border-slate-300'
                  }`}
                >
                  <option value="all">{labelAll}</option>
                  {options.filter(o => o !== 'all').map(o => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        {/* Category chips */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(c => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                category === c
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : isDark
                    ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-300'
                    : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-300 hover:text-slate-700'
              }`}
            >
              {c === 'all' ? labelAll : c}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className={`text-xs font-medium mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
          {lang === 'tj'
            ? `${filtered.length} вакансия ёфт шуд`
            : `Найдено ${filtered.length} вакансий`}
          {(search || activeFiltersCount > 0) && (
            <button
              onClick={() => { setSearch(''); setCategory('all'); setCity('all'); setType('all') }}
              className={`ml-2 underline ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-600'}`}
            >
              {lang === 'tj' ? 'Тоза кардан' : 'Сбросить'}
            </button>
          )}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map(v => (
              <VacancyCard key={v.id} v={v} isDark={isDark} lang={lang} />
            ))}
          </div>
        ) : (
          <div className={`rounded-2xl border py-16 text-center ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <Briefcase size={36} className={`mx-auto mb-3 ${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
            <p className={`font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {lang === 'tj' ? 'Вакансия ёфт нашуд' : 'Вакансии не найдены'}
            </p>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
              {lang === 'tj' ? 'Филтрро тағйир диҳед' : 'Попробуйте изменить фильтры'}
            </p>
          </div>
        )}

      </div>
    </div>
  )
}
