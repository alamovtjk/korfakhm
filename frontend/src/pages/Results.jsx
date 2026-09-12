import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, ArrowRight, RotateCcw, Sparkles, Brain, Lightbulb, AlertTriangle, TrendingUp, CheckCircle2, Circle, AlertCircle, DollarSign } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useSeo } from '../hooks/useSeo'
import { PROFESSION_SKILLS } from '../data/professionSkills'

const CATEGORY_GRADIENT = {
  IT: 'from-blue-500 to-cyan-500',
  Дизайн: 'from-violet-500 to-pink-500',
  Управление: 'from-orange-500 to-amber-400',
  Маркетинг: 'from-emerald-500 to-teal-400',
  Аналитика: 'from-indigo-500 to-blue-400',
  Медицина: 'from-red-500 to-rose-400',
  Образование: 'from-yellow-500 to-orange-400',
  Финансы: 'from-green-500 to-emerald-400',
  Бизнес: 'from-amber-500 to-orange-500',
}

const RIASEC_META = {
  R: { label: { ru: 'Практик', tj: 'Амалгар' }, color: 'bg-amber-500', desc: { ru: 'руки, техника, физика', tj: 'дастон, техника, физика' } },
  I: { label: { ru: 'Аналитик', tj: 'Таҳлилгар' }, color: 'bg-blue-500', desc: { ru: 'логика, исследование', tj: 'мантиқ, тадқиқот' } },
  A: { label: { ru: 'Творец', tj: 'Эҷодкор' }, color: 'bg-violet-500', desc: { ru: 'дизайн, идеи, выражение', tj: 'дизайн, ғояҳо, ифода' } },
  S: { label: { ru: 'Помощник', tj: 'Ёрдамгар' }, color: 'bg-emerald-500', desc: { ru: 'люди, общение, помощь', tj: 'одамон, муошират, кӯмак' } },
  E: { label: { ru: 'Лидер', tj: 'Роҳбар' }, color: 'bg-orange-500', desc: { ru: 'бизнес, убеждение', tj: 'тиҷорат, қонеъ кардан' } },
  C: { label: { ru: 'Организатор', tj: 'Ташкилотчи' }, color: 'bg-cyan-500', desc: { ru: 'порядок, системы', tj: 'тартиб, системаҳо' } },
}

const LEVEL_META = {
  critical: {
    label: { ru: 'Обязательно', tj: 'Ҳатмӣ' },
    color: 'text-red-500',
    bg: { dark: 'bg-red-900/20 border-red-800/30', light: 'bg-red-50 border-red-200' },
  },
  important: {
    label: { ru: 'Важно', tj: 'Муҳим' },
    color: 'text-amber-500',
    bg: { dark: 'bg-amber-900/20 border-amber-800/30', light: 'bg-amber-50 border-amber-200' },
  },
  nice: {
    label: { ru: 'Плюс', tj: 'Плюс' },
    color: 'text-blue-500',
    bg: { dark: 'bg-blue-900/20 border-blue-800/30', light: 'bg-blue-50 border-blue-200' },
  },
}

function GapAnalysis({ professionName, riasec, isDark, lang }) {
  const prof = PROFESSION_SKILLS[professionName]
  if (!prof) return null

  // Estimate skill status from RIASEC scores
  // If user scores high on relevant dims → likely has foundational aptitude
  const getStatus = (skill) => {
    const dims = prof.riasecKey
    const avgScore = dims.reduce((sum, d) => sum + (riasec[d] || 0), 0) / dims.length
    if (skill.level === 'critical') return avgScore >= 65 ? 'partial' : 'missing'
    if (skill.level === 'important') return avgScore >= 50 ? 'partial' : 'missing'
    return avgScore >= 40 ? 'partial' : 'missing'
  }

  const skills = prof.skills.map(s => ({ ...s, status: getStatus(s) }))
  const missing = skills.filter(s => s.status === 'missing')
  const partial = skills.filter(s => s.status === 'partial')

  const statusIcon = (status) => {
    if (status === 'missing') return <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
    return <Circle size={14} className="text-amber-400 flex-shrink-0" />
  }

  const statusLabel = {
    missing: { ru: 'Нужно освоить', tj: 'Бояд омӯхт' },
    partial: { ru: 'Развивать', tj: 'Рушд додан' },
  }

  return (
    <div className={`rounded-2xl border p-5 sm:p-6 mb-6 ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" />
          <h2 className={`text-sm font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'tj' ? 'Таҳлили малакаҳо' : 'Gap-анализ навыков'}
          </h2>
        </div>
        <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-semibold ${isDark ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
          <DollarSign size={11} />
          {prof.salaryTJ}
        </div>
      </div>

      <div className="space-y-2">
        {skills.map((skill, i) => {
          const levelMeta = LEVEL_META[skill.level]
          return (
            <div
              key={i}
              className={`flex items-center gap-3 p-3 rounded-xl border ${
                isDark ? levelMeta.bg.dark : levelMeta.bg.light
              }`}
            >
              {statusIcon(skill.status)}
              <span className={`flex-1 text-sm ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {skill.name[lang] || skill.name.ru}
              </span>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold uppercase tracking-wide ${levelMeta.color}`}>
                  {levelMeta.label[lang] || levelMeta.label.ru}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  skill.status === 'missing'
                    ? isDark ? 'bg-red-900/40 text-red-300' : 'bg-red-100 text-red-700'
                    : isDark ? 'bg-amber-900/40 text-amber-300' : 'bg-amber-100 text-amber-700'
                }`}>
                  {statusLabel[skill.status][lang] || statusLabel[skill.status].ru}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {missing.length > 0 && (
        <div className={`mt-4 p-3 rounded-xl ${isDark ? 'bg-slate-800/60' : 'bg-slate-50'}`}>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            <span className="font-bold text-red-400">{missing.length}</span>
            {lang === 'tj'
              ? ` малакаи ҳатмӣ барои омӯхтан · `
              : ` критичных навыка для освоения · `}
            <span className="font-bold text-amber-400">{partial.length}</span>
            {lang === 'tj' ? ` — барои рушд додан` : ` — для развития`}
          </p>
        </div>
      )}
    </div>
  )
}

function RiasecBar({ dim, value, isDark, lang }) {
  const meta = RIASEC_META[dim]
  return (
    <div className="flex items-center gap-3">
      <div className="w-20 text-right">
        <span className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
          {meta.label[lang] || meta.label.ru}
        </span>
        <div className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
          {meta.desc[lang] || meta.desc.ru}
        </div>
      </div>
      <div className={`flex-1 rounded-full h-2.5 ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
        <div
          className={`h-2.5 rounded-full ${meta.color} transition-all duration-1000`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className={`text-xs font-bold w-8 text-right ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
        {value}
      </span>
    </div>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { lang, t } = useLang()
  const tj = lang === 'tj'

  useSeo({
    title: tj ? 'Натиҷаҳои санҷиши касб' : 'Результаты теста на профессию',
    description: tj
      ? 'Касбҳои беҳтарини шумо тибқи натиҷаи санҷиши AI ва нақшаи рушди шахсӣ.'
      : 'Твои идеальные профессии по результатам AI-теста и персональный план развития.',
    path: '/results',
    noindex: true,
  })

  const [results, setResults] = useState(null)
  const [showRiasec, setShowRiasec] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('quiz_results')
    if (stored) {
      setResults(JSON.parse(stored))
      // Animate RIASEC bars after mount
      setTimeout(() => setShowRiasec(true), 300)
    } else {
      navigate('/quiz')
    }
  }, [navigate])

  if (!results) return null
  const { professions, riasec, ai_analysis } = results
  const top = professions[0]
  const topGrad = CATEGORY_GRADIENT[top.category] || 'from-blue-500 to-cyan-500'

  // Sort RIASEC dims by value for display
  const riasecSorted = riasec
    ? Object.entries(riasec).sort(([, a], [, b]) => b - a)
    : []

  return (
    <div className={`min-h-screen transition-colors page`}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg shadow-yellow-500/30">
            <Trophy size={30} className="text-white" />
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {t.results_title}
          </h1>
          <p className={`text-sm sm:text-base ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {t.results_sub}
          </p>
        </div>

        {/* AI Personality Analysis — shown if Claude key is set */}
        {ai_analysis && (
          <div className={`rounded-2xl border p-5 sm:p-6 mb-6 ${
            isDark
              ? 'bg-gradient-to-br from-violet-950/50 to-blue-950/50 border-violet-800/40'
              : 'bg-gradient-to-br from-violet-50 to-blue-50 border-violet-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-violet-500" />
              <span className={`text-xs font-bold uppercase tracking-wide ${isDark ? 'text-violet-400' : 'text-violet-600'}`}>
                Анализ от ИИ
              </span>
            </div>

            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-bold mb-3 bg-gradient-to-r ${topGrad} text-white`}>
              {ai_analysis.personality_type}
            </div>

            <p className={`text-sm leading-relaxed mb-5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              {ai_analysis.summary}
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className={`rounded-xl p-4 ${isDark ? 'bg-emerald-900/20 border border-emerald-800/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Brain size={13} className="text-emerald-500" />
                  <span className={`text-xs font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Твои сильные стороны</span>
                </div>
                <ul className="space-y-1">
                  {ai_analysis.strengths?.map((s, i) => (
                    <li key={i} className={`text-xs flex items-start gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      <span className="text-emerald-500 font-bold">✓</span> {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hidden talent */}
              <div className={`rounded-xl p-4 ${isDark ? 'bg-blue-900/20 border border-blue-800/30' : 'bg-blue-50 border border-blue-200'}`}>
                <div className="flex items-center gap-1.5 mb-2">
                  <Lightbulb size={13} className="text-blue-500" />
                  <span className={`text-xs font-bold ${isDark ? 'text-blue-400' : 'text-blue-700'}`}>Скрытый талант</span>
                </div>
                <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {ai_analysis.hidden_talent}
                </p>
              </div>
            </div>

            {ai_analysis.watch_out && (
              <div className={`mt-4 rounded-xl p-3 flex items-start gap-2 ${isDark ? 'bg-amber-900/20 border border-amber-800/30' : 'bg-amber-50 border border-amber-200'}`}>
                <AlertTriangle size={13} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className={`text-xs leading-relaxed ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                  <span className="font-bold">На заметку: </span>{ai_analysis.watch_out}
                </p>
              </div>
            )}
          </div>
        )}

        {/* RIASEC Profile */}
        {riasec && (
          <div className={`rounded-2xl border p-5 sm:p-6 mb-6 ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
            <h2 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Твой психологический профиль
            </h2>
            <div className="space-y-3">
              {riasecSorted.map(([dim, val]) => (
                <RiasecBar
                  key={dim}
                  dim={dim}
                  value={showRiasec ? val : 0}
                  isDark={isDark}
                  lang={lang}
                />
              ))}
            </div>
          </div>
        )}

        {/* Gap Analysis */}
        {riasec && (
          <GapAnalysis
            professionName={top.name}
            riasec={riasec}
            isDark={isDark}
            lang={lang}
          />
        )}

        {/* Top profession */}
        <div className={`bg-gradient-to-r ${topGrad} p-[1.5px] rounded-2xl mb-4 shadow-lg`}>
          <div className={`rounded-2xl p-5 sm:p-6 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full mb-2 bg-gradient-to-r ${topGrad} text-white`}>
                  <Sparkles size={11} /> {t.results_best}
                </span>
                <h2 className={`text-xl sm:text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {top.emoji} {top.name}
                </h2>
                <span className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{top.category}</span>
                {ai_analysis?.top_profession_why && (
                  <p className={`text-xs mt-2 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    {ai_analysis.top_profession_why}
                  </p>
                )}
              </div>
              <div className="text-right ml-4">
                <div className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${topGrad} bg-clip-text text-transparent`}>
                  {top.score}%
                </div>
                <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.results_match}</div>
              </div>
            </div>
            <div className={`w-full rounded-full h-2 mb-5 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <div className={`bg-gradient-to-r ${topGrad} h-2 rounded-full`} style={{ width: `${top.score}%` }} />
            </div>
            <button
              onClick={() => navigate(`/plan/${encodeURIComponent(top.name)}`)}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5 bg-gradient-to-r ${topGrad} text-white shadow-md`}
            >
              {t.results_get_plan} <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* Other professions */}
        <div className="space-y-2.5 mb-8">
          {professions.slice(1).map((p, i) => {
            const grad = CATEGORY_GRADIENT[p.category] || 'from-blue-500 to-cyan-500'
            return (
              <div
                key={i}
                onClick={() => navigate(`/plan/${encodeURIComponent(p.name)}`)}
                className={`rounded-xl border p-4 cursor-pointer group transition-all hover:-translate-y-0.5 ${
                  isDark
                    ? 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{p.emoji}</span>
                    <div>
                      <div className={`font-semibold text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{p.name}</div>
                      <div className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{p.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm bg-gradient-to-r ${grad} bg-clip-text text-transparent`}>{p.score}%</span>
                    <ArrowRight size={14} className={`transition-colors ${isDark ? 'text-slate-700 group-hover:text-slate-400' : 'text-slate-300 group-hover:text-slate-600'}`} />
                  </div>
                </div>
                <div className={`w-full rounded-full h-1.5 ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                  <div className={`bg-gradient-to-r ${grad} h-1.5 rounded-full`} style={{ width: `${p.score}%` }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate('/quiz')}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border transition-colors ${
              isDark
                ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-white'
            }`}
          >
            <RotateCcw size={15} /> {t.results_retry}
          </button>
          <button
            onClick={() => navigate(`/plan/${encodeURIComponent(top.name)}`)}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            {t.results_top_plan} <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  )
}
