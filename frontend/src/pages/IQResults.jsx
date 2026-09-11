import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Trophy, ArrowRight, RotateCcw, Brain, TrendingUp, Target } from 'lucide-react'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { getIQLevel, IQ_CATEGORIES } from '../data/iqQuestions'

// Bell curve distribution zones for visual
const BELL_ZONES = [
  { range: '70–79', pct: 2.2,  iq: 75,  color: 'bg-red-500' },
  { range: '80–89', pct: 13.6, iq: 85,  color: 'bg-orange-500' },
  { range: '90–109', pct: 68.2, iq: 100, color: 'bg-emerald-500' },
  { range: '110–119', pct: 13.6, iq: 115, color: 'bg-blue-500' },
  { range: '120–129', pct: 2.2, iq: 125, color: 'bg-violet-500' },
  { range: '130+', pct: 0.2,   iq: 135, color: 'bg-purple-600' },
]

function AnimatedNumber({ target, duration = 1500 }) {
  const [val, setVal] = useState(70)
  useEffect(() => {
    const start = Date.now()
    const from = 70
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(from + eased * (target - from)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return val
}

function BellCurve({ iq, isDark }) {
  const activeZone = BELL_ZONES.findIndex(z => iq < z.iq + 10 && iq >= z.iq - 10) ?? 2
  const clampedActive = BELL_ZONES.reduce((best, z, i) =>
    Math.abs(z.iq - iq) < Math.abs(BELL_ZONES[best].iq - iq) ? i : best, 0)

  return (
    <div className="mt-4">
      <div className="flex items-end gap-0.5 h-16 mb-1">
        {BELL_ZONES.map((z, i) => {
          const isActive = i === clampedActive
          // Bell curve heights
          const heights = [20, 50, 100, 50, 20, 8]
          return (
            <div
              key={z.range}
              className="flex-1 flex flex-col items-center gap-0.5"
              style={{ height: '100%' }}
            >
              <div
                className={`w-full rounded-t-sm transition-all duration-700 ${isActive ? z.color : isDark ? 'bg-slate-700' : 'bg-slate-200'}`}
                style={{ height: `${heights[i]}%`, opacity: isActive ? 1 : 0.5 }}
              />
            </div>
          )
        })}
      </div>
      <div className="flex gap-0.5">
        {BELL_ZONES.map((z, i) => {
          const isActive = i === clampedActive
          return (
            <div key={z.range} className="flex-1 text-center">
              <div className={`text-[9px] font-bold ${isActive ? (isDark ? 'text-white' : 'text-slate-900') : isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                {z.range}
              </div>
              <div className={`text-[8px] ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>{z.pct}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function IQResults() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { lang } = useLang()
  const [data, setData] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('iq_results')
    if (stored) {
      setData(JSON.parse(stored))
      setTimeout(() => setShow(true), 200)
    } else {
      navigate('/iq')
    }
  }, [navigate])

  if (!data) return null

  const { score, maxScore, percentile, catScore, catMax, catTotal } = data
  const iq = Number.isFinite(data.iq) ? data.iq : 85
  const level = getIQLevel(iq)
  const animIQ = show ? iq : 70

  const categoryLabels = {
    sequence: { tj: 'Силсила',  ru: 'Последовательности' },
    analogy:  { tj: 'Аналогия', ru: 'Аналогии'           },
    odd:      { tj: 'Ягона',    ru: 'Лишнее'              },
    logic:    { tj: 'Мантиқ',   ru: 'Логика'              },
    matrix:   { tj: 'Намуна',   ru: 'Паттерны'            },
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#0a0e1a]' : 'bg-[#f0f4ff]'}`}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 bg-gradient-to-br ${level.color} shadow-lg`}>
            <Brain size={30} className="text-white" />
          </div>
          <h1 className={`text-2xl sm:text-3xl font-extrabold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'tj' ? 'Натиҷаи санҷиши IQ' : 'Результат IQ-теста'}
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {lang === 'tj' ? 'Санҷиши зеҳни Таҷикӣ' : 'Первый IQ-тест на таджикском языке'}
          </p>
        </div>

        {/* IQ Score card */}
        <div className={`bg-gradient-to-r ${level.color} p-[1.5px] rounded-2xl mb-6 shadow-xl`}>
          <div className={`rounded-2xl p-6 sm:p-8 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold text-white bg-gradient-to-r ${level.color} mb-3`}>
                  {level.emoji} {level.label[lang] || level.label.tj}
                </div>
                <p className={`text-sm leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  {level.desc[lang] || level.desc.tj}
                </p>
              </div>
              <div className="text-right ml-4 flex-shrink-0">
                <div className={`text-5xl sm:text-6xl font-black bg-gradient-to-br ${level.color} bg-clip-text text-transparent leading-none`}>
                  <AnimatedNumber target={animIQ} />
                </div>
                <div className={`text-xs mt-1 font-semibold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>IQ</div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                {
                  label: { tj: 'Дурустӣ', ru: 'Правильных' },
                  value: `${score}/${maxScore}`,
                  icon: <Target size={14} />,
                  color: 'text-emerald-500',
                },
                {
                  label: { tj: 'Фоиз', ru: 'Процент' },
                  value: `${Math.round((score / maxScore) * 100)}%`,
                  icon: <TrendingUp size={14} />,
                  color: level.textColor,
                },
                {
                  label: { tj: 'Перцентил', ru: 'Перцентиль' },
                  value: `${lang === 'tj' ? 'Аз' : 'Лучше'} ${percentile}%`,
                  icon: <Trophy size={14} />,
                  color: 'text-amber-500',
                },
              ].map((s, i) => (
                <div key={i} className={`rounded-xl p-3 text-center ${isDark ? 'bg-slate-800/60' : 'bg-slate-50'}`}>
                  <div className={`flex items-center justify-center gap-1 mb-1 ${s.color}`}>{s.icon}</div>
                  <div className={`text-base font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{s.value}</div>
                  <div className={`text-[10px] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                    {s.label[lang] || s.label.ru}
                  </div>
                </div>
              ))}
            </div>

            {/* Bell curve */}
            <div className={`rounded-xl p-4 ${isDark ? 'bg-slate-800/60' : 'bg-slate-50'}`}>
              <p className={`text-xs font-semibold mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {lang === 'tj' ? 'Ҷойгиршавии шумо дар байни одамон' : 'Ваше место среди людей'}
              </p>
              <BellCurve iq={iq} isDark={isDark} />
            </div>
          </div>
        </div>

        {/* Category breakdown */}
        <div className={`rounded-2xl border p-5 sm:p-6 mb-6 ${isDark ? 'bg-slate-900/70 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
          <h2 className={`text-sm font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
            {lang === 'tj' ? 'Натиҷа аз рӯи бахшҳо' : 'Результат по категориям'}
          </h2>
          <div className="space-y-3">
            {Object.entries(IQ_CATEGORIES).map(([key, cat]) => {
              const got = catScore[key] || 0
              const max = catMax[key] || 1
              const pct = Math.round((got / max) * 100)
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                      <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        {categoryLabels[key]?.[lang] || categoryLabels[key]?.ru}
                      </span>
                    </div>
                    <span className={`text-xs font-bold ${pct >= 70 ? 'text-emerald-500' : pct >= 40 ? 'text-amber-500' : 'text-red-400'}`}>
                      {got}/{max} {lang === 'tj' ? 'хол' : 'очков'}
                    </span>
                  </div>
                  <div className={`w-full h-2 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div
                      className={`h-2 rounded-full transition-all duration-1000 ${cat.color}`}
                      style={{ width: show ? `${pct}%` : '0%' }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Weak area tip */}
        {(() => {
          const weakCat = Object.entries(IQ_CATEGORIES).reduce((worst, [key]) => {
            const pct = ((catScore[key] || 0) / (catMax[key] || 1)) * 100
            const worstPct = ((catScore[worst] || 0) / (catMax[worst] || 1)) * 100
            return pct < worstPct ? key : worst
          }, Object.keys(IQ_CATEGORIES)[0])
          const weakLabel = categoryLabels[weakCat]?.[lang] || categoryLabels[weakCat]?.ru
          return (
            <div className={`rounded-2xl border p-4 mb-6 ${isDark ? 'bg-amber-900/10 border-amber-800/30' : 'bg-amber-50 border-amber-200'}`}>
              <p className={`text-xs ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                <span className="font-bold">
                  {lang === 'tj' ? '💡 Маслиҳат: ' : '💡 Совет: '}
                </span>
                {lang === 'tj'
                  ? `Заифтарин бахши шумо «${weakLabel}» буд. Маводи тафаккури мантиқиро бештар машқ кунед.`
                  : `Ваша слабая категория — «${weakLabel}». Тренируйте логическое мышление с помощью головоломок.`}
              </p>
            </div>
          )
        })()}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => { localStorage.removeItem('iq_results'); navigate('/iq') }}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-medium text-sm border transition-colors ${
              isDark
                ? 'border-slate-700 text-slate-400 hover:text-white hover:border-slate-500 hover:bg-slate-800'
                : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:border-slate-400 hover:bg-white'
            }`}
          >
            <RotateCcw size={15} />
            {lang === 'tj' ? 'Такрор гузаштан' : 'Пройти заново'}
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
          >
            {lang === 'tj' ? 'Санҷиши касбӣ гузаштан' : 'Пройти тест на профессию'}
            <ArrowRight size={16} />
          </button>
        </div>

      </div>
    </div>
  )
}
