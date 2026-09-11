import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, CheckCircle2, Circle, BookOpen, Briefcase, TrendingUp, ArrowLeft, ExternalLink, ChevronDown, ChevronUp, Megaphone } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { vacancyService } from '../services/vacancyService'

const DEMO_PLAN = {
  profession: 'Frontend-разработчик',
  overview: {
    description: 'Frontend-разработчик создаёт визуальную часть сайтов и приложений — всё, что видит и с чем взаимодействует пользователь. Это одна из самых востребованных профессий в IT.',
    why_fits: 'По результатам твоего теста у тебя высокая склонность к логическому мышлению, интерес к технологиям и желание создавать визуальные продукты. Это идеальное сочетание для Frontend-разработки.',
    salaries: { junior: '2 500–4 000', middle: '5 000–10 000', senior: '12 000–25 000' },
    currency: 'сомони/мес',
  },
  steps: [
    { number: 1, title: 'Основы веба (1–2 месяца)', description: 'Изучи HTML5 и CSS3 — фундамент всего веб-разработки. HTML — структура, CSS — внешний вид.', resources: ['YouTube: Дмитрий Фастовец — HTML/CSS для начинающих', 'freeCodeCamp.org (бесплатно)', 'MDN Web Docs — справочник'], tasks: ['Создай 3 статических страницы', 'Сделай адаптивный лендинг', 'Изучи Flexbox и Grid'] },
    { number: 2, title: 'JavaScript (2–3 месяца)', description: 'JavaScript делает страницы интерактивными. Обязательный язык для любого frontend-разработчика.', resources: ['Книга: "Выразительный JavaScript"', 'YouTube: Vladilen Minin — JS', 'JavaScript.info (лучший бесплатный курс)'], tasks: ['Создай калькулятор', 'Сделай To-Do приложение', 'Изучи работу с API'] },
    { number: 3, title: 'React.js (2–3 месяца)', description: 'React — самая популярная библиотека для интерфейсов. Используется в 80% таджикских IT-компаний.', resources: ['Официальная документация React', 'Udemy: Academind — React Complete Guide', 'YouTube: Codevolution'], tasks: ['Создай интернет-магазин', 'Сделай приложение с авторизацией', 'Поработай с Firebase'] },
    { number: 4, title: 'Git и командная работа (2–3 недели)', description: 'Git — система контроля версий. Без него не берут ни в одну команду.', resources: ['GitHub Learning Lab', 'YouTube: Git для начинающих', 'Learngitbranching.js.org'], tasks: ['Создай аккаунт на GitHub', 'Загрузи все свои проекты', 'Выучи pull requests и merge'] },
    { number: 5, title: 'Портфолио (1–2 месяца)', description: 'Без портфолио не получишь первую работу. Создай 4–5 проектов для работодателей Таджикистана.', resources: ['Dribbble — для вдохновения', 'Behance — примеры портфолио', 'Netlify — бесплатный хостинг'], tasks: ['Лендинг для местного бизнеса', 'Доска объявлений как OLX', 'Сайт ресторана с меню', 'Личное портфолио'] },
    { number: 6, title: 'Поиск первой работы', description: 'Таджикистан активно растёт в IT. Вот где и как искать работу.', resources: ['HeadHunter.tj', 'Telegram: IT Tajikistan, TajDev', 'LinkedIn', 'Обращения в IT-компании Душанбе'], tasks: ['Составь резюме по ATS-стандарту', 'Создай профиль на LinkedIn', 'Подай заявки в 10+ компаний', 'Подготовься к техническому интервью'] },
    { number: 7, title: 'Рост и увеличение дохода', description: 'После первой работы прокачивай навыки и выходи на международный рынок.', resources: ['Upwork — фриланс международный', 'TypeScript — следующий навык', 'Next.js — для senior-позиций'], tasks: ['Изучи TypeScript', 'Зарегистрируйся на Upwork', 'Найди ментора', 'Начни с мелких фриланс-заказов'] },
  ],
  vacancies: [
    { company: 'Alif Tech', position: 'Junior Frontend Developer', salary: '3 000–5 000', city: 'Душанбе', type: 'Офис' },
    { company: 'IdeaSoft', position: 'React Developer', salary: '4 000–7 000', city: 'Душанбе', type: 'Гибрид' },
    { company: 'Прогресс Банк', position: 'Web Developer', salary: '3 500–6 000', city: 'Душанбе', type: 'Офис' },
    { company: 'Remote startup', position: 'Frontend Engineer', salary: '$300–600', city: 'Удалённо', type: 'Remote' },
  ],
}

export default function CareerPlan() {
  const { profession } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { t } = useLang()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checked, setChecked] = useState({})
  const [activeTab, setActiveTab] = useState('plan')
  const [expanded, setExpanded] = useState({ 1: true })
  const [liveVacancies, setLiveVacancies] = useState([])

  useEffect(() => {
    setLiveVacancies(vacancyService.getPublished())
  }, [activeTab])

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const res = await fetch(`/api/plan/${encodeURIComponent(profession)}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ answers: JSON.parse(localStorage.getItem('quiz_answers') || '{}') }),
        })
        setPlan(await res.json())
      } catch {
        setPlan({ ...DEMO_PLAN, profession: decodeURIComponent(profession) })
      }
      setLoading(false)
    }
    load()
  }, [profession])

  function toggle(key) {
    setChecked(p => ({ ...p, [key]: !p[key] }))
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col transition-colors page`}>
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 px-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Loader2 size={28} className="animate-spin text-white" />
            </div>
          </div>
          <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.plan_generating}</p>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.plan_generating_sub}</p>
          <div className="flex gap-1.5 mt-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (!plan) return null
  const { overview, steps, vacancies } = plan
  const totalTasks = steps.flatMap(s => s.tasks).length
  const doneTasks = Object.values(checked).filter(Boolean).length
  const pct = Math.round((doneTasks / totalTasks) * 100)

  return (
    <div className={`min-h-screen transition-colors page`}>
      <Navbar />

      {/* Sticky progress bar */}
      <div className={`sticky top-16 z-40 border-b px-4 py-3 glass ${
        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-200'
      }`}>
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <button
            onClick={() => navigate('/results')}
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors flex-shrink-0 ${
              isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ArrowLeft size={15} />
            <span className="hidden sm:inline">{t.plan_back}</span>
          </button>
          <div className="flex items-center gap-3 flex-1 max-w-xs ml-auto">
            <div className="text-right">
              <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.plan_progress}</div>
              <div className="text-xs font-bold text-blue-500">{doneTasks}/{totalTasks} {t.plan_tasks}</div>
            </div>
            <div className="flex-1 relative">
              <div className={`w-full rounded-full h-2 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
                <div className="bg-gradient-to-r from-blue-500 to-violet-500 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
              </div>
              <span className={`absolute -right-0 -top-4 text-xs font-bold text-blue-500 ${pct > 0 ? 'opacity-100' : 'opacity-0'}`}>{pct}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Title */}
        <div className="mb-6">
          <p className={`text-sm font-medium mb-1 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{t.plan_path}:</p>
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.profession}</h1>
          <p className={`mt-2 text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{overview.description}</p>
        </div>

        {/* Salary cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            { label: t.plan_junior, val: overview.salaries.junior, color: 'text-emerald-500', bg: isDark ? 'bg-emerald-900/20 border-emerald-800/40' : 'bg-emerald-50 border-emerald-200' },
            { label: t.plan_middle, val: overview.salaries.middle, color: 'text-blue-500', bg: isDark ? 'bg-blue-900/20 border-blue-800/40' : 'bg-blue-50 border-blue-200' },
            { label: t.plan_senior, val: overview.salaries.senior, color: 'text-violet-500', bg: isDark ? 'bg-violet-900/20 border-violet-800/40' : 'bg-violet-50 border-violet-200' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-3 text-center ${s.bg}`}>
              <div className={`text-xs font-medium mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{s.label}</div>
              <div className={`text-sm font-bold ${s.color}`}>{s.val}</div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{overview.currency}</div>
            </div>
          ))}
        </div>

        {/* Why fits */}
        <div className={`rounded-xl border p-4 mb-6 ${
          isDark ? 'bg-blue-900/20 border-blue-800/40' : 'bg-blue-50 border-blue-200'
        }`}>
          <p className={`text-xs font-semibold mb-1.5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>{t.plan_why}</p>
          <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{overview.why_fits}</p>
        </div>

        {/* Tabs */}
        <div className={`flex gap-1 rounded-xl p-1 mb-6 ${isDark ? 'bg-slate-800/60' : 'bg-slate-200/60'}`}>
          {[
            { id: 'plan', label: t.plan_tab_plan, icon: TrendingUp },
            { id: 'vacancies', label: t.plan_tab_vacancies, icon: Briefcase },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <tab.icon size={15} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Steps */}
        {activeTab === 'plan' && (
          <div className="space-y-3">
            {steps.map(step => {
              const isOpen = expanded[step.number]
              const stepDone = step.tasks.filter(tk => checked[`${step.number}-${tk}`]).length
              return (
                <div key={step.number} className={`rounded-2xl border overflow-hidden transition-colors ${
                  isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  {/* Step header */}
                  <button
                    className="w-full flex items-center gap-3 px-5 py-4 text-left"
                    onClick={() => setExpanded(p => ({ ...p, [step.number]: !p[step.number] }))}
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-md shadow-blue-500/20">
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{step.title}</div>
                      {stepDone > 0 && (
                        <div className="text-xs text-emerald-500 font-medium">{stepDone}/{step.tasks.length} задач выполнено</div>
                      )}
                    </div>
                    {isOpen ? <ChevronUp size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} /> : <ChevronDown size={16} className={isDark ? 'text-slate-500' : 'text-slate-400'} />}
                  </button>

                  {/* Step content */}
                  {isOpen && (
                    <div className={`px-5 pb-5 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <p className={`text-sm leading-relaxed my-3 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{step.description}</p>
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <div className={`flex items-center gap-1.5 text-xs font-bold mb-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <BookOpen size={11} /> {t.plan_resources}
                          </div>
                          <ul className="space-y-1.5">
                            {step.resources.map((r, i) => (
                              <li key={i} className={`text-sm flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                                <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>{r}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className={`flex items-center gap-1.5 text-xs font-bold mb-2.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                            <CheckCircle2 size={11} /> {t.plan_tasks_label}
                          </div>
                          <ul className="space-y-2">
                            {step.tasks.map((task, i) => {
                              const key = `${step.number}-${task}`
                              const done = checked[key]
                              return (
                                <li key={i} onClick={() => toggle(key)} className="flex items-start gap-2 cursor-pointer group">
                                  {done
                                    ? <CheckCircle2 size={15} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                                    : <Circle size={15} className={`flex-shrink-0 mt-0.5 transition-colors ${isDark ? 'text-slate-700 group-hover:text-slate-500' : 'text-slate-300 group-hover:text-slate-500'}`} />
                                  }
                                  <span className={`text-sm ${done ? 'line-through text-slate-500' : isDark ? 'text-slate-300' : 'text-slate-700'}`}>{task}</span>
                                </li>
                              )
                            })}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Vacancies */}
        {activeTab === 'vacancies' && (
          <div className="space-y-3">
            {/* Post vacancy CTA banner */}
            <div
              onClick={() => navigate('/post-vacancy')}
              className={`rounded-xl border p-4 flex items-center gap-4 cursor-pointer transition-all hover:-translate-y-0.5 ${
                isDark
                  ? 'bg-gradient-to-r from-orange-950/50 to-amber-950/50 border-orange-800/40 hover:border-orange-700/60'
                  : 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 hover:border-orange-300'
              }`}
            >
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md shadow-orange-500/20">
                <Megaphone size={18} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm ${isDark ? 'text-orange-300' : 'text-orange-800'}`}>{t.pv_nav}</div>
                <div className={`text-xs mt-0.5 ${isDark ? 'text-orange-400/70' : 'text-orange-600/70'}`}>{t.pv_sub}</div>
              </div>
              <ExternalLink size={15} className={isDark ? 'text-orange-400' : 'text-orange-500'} />
            </div>

            {liveVacancies.map((v) => (
              <div key={v.id} className={`rounded-xl border p-4 sm:p-5 transition-all hover:-translate-y-0.5 ${
                isDark ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className={`font-semibold text-sm sm:text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>{v.position}</div>
                    <div className="text-blue-500 text-sm font-medium">{v.company}</div>
                    {v.description && (
                      <p className={`text-xs mt-1 line-clamp-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{v.description}</p>
                    )}
                    <div className={`flex flex-wrap items-center gap-2 mt-2 text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                      <span>📍 {v.city}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${
                        v.type === 'Remote'
                          ? isDark ? 'bg-green-900/30 border-green-800/50 text-green-400' : 'bg-green-50 border-green-200 text-green-600'
                          : isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'
                      }`}>{v.type}</span>
                      <span className={`px-2 py-0.5 rounded-full border text-xs ${isDark ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-500'}`}>
                        {v.category}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="font-bold text-emerald-500 text-sm">{v.salary}</div>
                    <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>сомони/мес</div>
                    {v.contact && (
                      <a
                        href={v.contact.startsWith('@') ? `https://t.me/${v.contact.slice(1)}` : `mailto:${v.contact}`}
                        className="mt-2 flex items-center justify-end gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors font-medium"
                        onClick={e => e.stopPropagation()}
                      >
                        {t.plan_apply} <ExternalLink size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <p className={`text-center text-xs py-3 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{t.plan_vacancies_updated}</p>
          </div>
        )}
      </div>
    </div>
  )
}
