import { useNavigate } from 'react-router-dom'
import { ArrowRight, ClipboardList, Trophy, BookOpen, Target, Sparkles } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useSeo } from '../hooks/useSeo'

const SAMPLE_PROFESSIONS = [
  { name: 'Frontend-разработчик', emoji: '💻', category: 'IT', score: 92 },
  { name: 'UX/UI дизайнер', emoji: '🎨', category: 'Дизайн', score: 85 },
  { name: 'Менеджер проектов', emoji: '📋', category: 'Управление', score: 78 },
  { name: 'Маркетолог', emoji: '📊', category: 'Маркетинг', score: 72 },
  { name: 'Бизнес-аналитик', emoji: '🔍', category: 'Аналитика', score: 68 },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { t, lang } = useLang()
  const tj = lang === 'tj'

  useSeo({
    title: tj ? 'Кабинети шахсӣ' : 'Личный кабинет',
    description: tj
      ? 'Натиҷаҳои санҷиш, касбҳои тавсияшуда ва нақшаи рушд дар як ҷо.'
      : 'Твои результаты тестов, рекомендованные профессии и план развития в одном месте.',
    path: '/dashboard',
    noindex: true,
  })

  const results = JSON.parse(localStorage.getItem('quiz_results') || 'null')
  const professions = results?.professions || SAMPLE_PROFESSIONS

  const stats = [
    { icon: ClipboardList, label: t.dash_test_done, value: results ? t.dash_yes : t.dash_no, color: 'text-blue-500', bg: isDark ? 'bg-blue-900/20 border-blue-800/30' : 'bg-blue-50 border-blue-200' },
    { icon: Trophy, label: t.dash_professions, value: professions.length, color: 'text-yellow-500', bg: isDark ? 'bg-yellow-900/20 border-yellow-800/30' : 'bg-yellow-50 border-yellow-200' },
    { icon: BookOpen, label: t.dash_plans, value: '0', color: 'text-emerald-500', bg: isDark ? 'bg-emerald-900/20 border-emerald-800/30' : 'bg-emerald-50 border-emerald-200' },
    { icon: Target, label: t.dash_tasks, value: '0', color: 'text-violet-500', bg: isDark ? 'bg-violet-900/20 border-violet-800/30' : 'bg-violet-50 border-violet-200' },
  ]

  return (
    <div className={`min-h-screen transition-colors page`}>
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-2xl sm:text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.dash_title}</h1>
          <p className={`mt-1 text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.dash_sub}</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-xl border p-4 ${s.bg}`}>
              <s.icon size={20} className={`${s.color} mb-2`} />
              <div className={`text-xl font-extrabold ${s.color}`}>{s.value}</div>
              <div className={`text-xs mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Quiz CTA */}
        {!results && (
          <div className={`rounded-2xl border p-6 mb-8 text-center ${
            isDark
              ? 'bg-gradient-to-br from-blue-950 to-violet-950 border-blue-800/40'
              : 'bg-gradient-to-br from-blue-50 to-violet-50 border-blue-200'
          }`}>
            <Sparkles size={32} className="mx-auto mb-3 text-blue-500" />
            <h2 className={`text-lg font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.dash_no_test}</h2>
            <p className={`text-sm mb-5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{t.dash_no_test_sub}</p>
            <button
              onClick={() => navigate('/quiz')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
            >
              {t.dash_start_quiz}
            </button>
          </div>
        )}

        {/* Professions list */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {results ? t.dash_your_prof : t.dash_popular}
            </h2>
            {results && (
              <button
                onClick={() => navigate('/results')}
                className="text-blue-500 hover:text-blue-400 text-sm font-medium transition-colors"
              >
                {t.dash_all}
              </button>
            )}
          </div>
          <div className="space-y-2.5">
            {professions.map((p, i) => (
              <div
                key={i}
                onClick={() => navigate(`/plan/${encodeURIComponent(p.name)}`)}
                className={`rounded-xl border p-4 cursor-pointer group transition-all hover:-translate-y-0.5 flex items-center justify-between ${
                  isDark
                    ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xl flex-shrink-0">{p.emoji}</span>
                  <div className="min-w-0">
                    <div className={`font-semibold text-sm truncate ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.name}</div>
                    <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{p.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                  {p.score && <span className="text-sm font-bold text-blue-500">{p.score}%</span>}
                  <div className={`flex items-center gap-1 text-xs transition-colors ${isDark ? 'text-slate-600 group-hover:text-slate-400' : 'text-slate-300 group-hover:text-slate-600'}`}>
                    <span className="hidden sm:inline">{t.dash_open}</span>
                    <ArrowRight size={14} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-3">
          <button
            onClick={() => navigate('/quiz')}
            className={`text-left rounded-xl border p-5 transition-all hover:-translate-y-0.5 ${
              isDark ? 'bg-slate-900/60 border-slate-800 hover:border-blue-800/50' : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-sm'
            }`}
          >
            <ClipboardList size={22} className="text-blue-500 mb-3" />
            <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {results ? t.dash_retake : t.dash_take}
            </div>
            <p className={`text-sm ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>12 вопросов · 10–15 мин</p>
          </button>
          <button
            onClick={() => navigate(`/plan/${encodeURIComponent(professions[0].name)}`)}
            className={`text-left rounded-xl border p-5 transition-all hover:-translate-y-0.5 ${
              isDark ? 'bg-slate-900/60 border-slate-800 hover:border-violet-800/50' : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-sm'
            }`}
          >
            <Target size={22} className="text-violet-500 mb-3" />
            <div className={`font-semibold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.dash_top_plan}</div>
            <p className={`text-sm truncate ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{professions[0].name}</p>
          </button>
        </div>
      </div>
    </div>
  )
}
