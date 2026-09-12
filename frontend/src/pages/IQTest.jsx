import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Timer, AlertTriangle, Brain, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../contexts/AuthContext'
import { useSeo } from '../hooks/useSeo'
import { IQ_QUESTIONS, IQ_CATEGORIES, IQ_DURATION, calcIQ } from '../data/iqQuestions'

const OPTION_LETTERS = ['А', 'Б', 'В', 'Г']

// ── Shuffle helpers ─────────────────────────────────────────────────────────
function shuffleArray(arr) {
  return [...arr].sort(() => Math.random() - 0.5)
}

function buildTestQuestions(questions) {
  const trick = questions.find(q => q.trick)
  const normal = shuffleArray(questions.filter(q => !q.trick)).slice(0, 24)
  const pool = trick ? [...normal, trick] : normal

  return pool.map(q => {
    if (q.matrix) return q
    const indexed = q.options.map((opt, i) => ({ opt, isCorrect: i === q.answer }))
    const shuffled = shuffleArray(indexed)
    return {
      ...q,
      options: shuffled.map(x => x.opt),
      answer: shuffled.findIndex(x => x.isCorrect),
    }
  })
}

// ── Robot face ──────────────────────────────────────────────────────────────
function RobotFace({ isTyping = false, size = 'md' }) {
  const dims    = { sm: 'w-10 h-10', md: 'w-14 h-14', lg: 'w-24 h-24' }
  const eyeDims = { sm: 'w-2 h-2',   md: 'w-3 h-3',   lg: 'w-5 h-5'   }
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      {/* Antenna */}
      <div className="flex flex-col items-center mb-0.5">
        <div className={`w-2 h-2 rounded-full transition-colors ${
          isTyping ? 'bg-emerald-400 animate-ping' : 'bg-blue-300 animate-pulse'
        }`} />
        <div className="w-0.5 h-3 bg-blue-400/50" />
      </div>
      {/* Head */}
      <div className={`${dims[size]} bg-gradient-to-br from-blue-500 to-violet-700 rounded-2xl shadow-xl shadow-blue-500/40 flex flex-col items-center justify-center gap-1.5 relative overflow-hidden`}>
        <div className="absolute top-1.5 right-1.5 w-3 h-3 bg-white/10 rounded-full" />
        {/* Eyes */}
        <div className="flex gap-2 items-center">
          {[0, 1].map(i => (
            <div key={i}
              className={`${eyeDims[size]} bg-white rounded-sm transition-all duration-150 ${isTyping ? 'animate-pulse' : ''}`}
              style={{ boxShadow: isTyping ? '0 0 8px #fff' : '0 0 3px rgba(255,255,255,0.6)' }}
            />
          ))}
        </div>
        {/* Mouth */}
        <div className={`rounded-full bg-white/60 transition-all duration-300 ${
          isTyping ? 'w-7 h-1' : 'w-4 h-1.5'
        }`} />
      </div>
    </div>
  )
}

// ── Typewriter text ─────────────────────────────────────────────────────────
function TypewriterText({ text, speed = 16, onDone, className = '' }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  const idxRef  = useRef(0)
  const skipRef = useRef(false)

  useEffect(() => {
    setDisplayed('')
    setDone(false)
    idxRef.current  = 0
    skipRef.current = false

    const iv = setInterval(() => {
      if (skipRef.current) {
        setDisplayed(text)
        setDone(true)
        clearInterval(iv)
        onDone?.()
        return
      }
      idxRef.current++
      setDisplayed(text.slice(0, idxRef.current))
      if (idxRef.current >= text.length) {
        setDone(true)
        clearInterval(iv)
        onDone?.()
      }
    }, speed)
    return () => clearInterval(iv)
  }, [text]) // eslint-disable-line

  return (
    <span className={className} onClick={() => { skipRef.current = true }} style={{ cursor: 'default' }}>
      {displayed}
      {!done && <span className="animate-pulse opacity-50 select-none ml-0.5">▌</span>}
    </span>
  )
}

// ── Matrix grid ─────────────────────────────────────────────────────────────
function MatrixGrid({ matrix, isDark }) {
  return (
    <div className="flex justify-center my-4">
      <table className="border-collapse rounded-xl overflow-hidden shadow-lg">
        <tbody>
          {matrix.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => (
                <td key={ci} className={`w-14 h-12 sm:w-16 sm:h-14 text-center text-base sm:text-lg font-bold border ${
                  cell === null
                    ? isDark ? 'bg-blue-900/50 border-blue-600 text-blue-300' : 'bg-blue-50 border-blue-300 text-blue-600'
                    : isDark ? 'bg-slate-800 border-slate-700 text-white'     : 'bg-white border-slate-200 text-slate-800'
                }`}>
                  {cell === null ? '?' : cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Timer ───────────────────────────────────────────────────────────────────
function TimerDisplay({ seconds, isDark }) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const isCritical = seconds < 60
  const isLow = seconds < 300
  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-mono font-bold text-sm transition-colors ${
      isCritical ? 'bg-red-900/40 text-red-400 animate-pulse'
        : isLow   ? isDark ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-50 text-amber-600'
        :           isDark ? 'bg-slate-800 text-slate-300'     : 'bg-slate-100 text-slate-700'
    }`}>
      <Timer size={13} />
      {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
    </div>
  )
}

// ── Intro screen ─────────────────────────────────────────────────────────────
function IntroScreen({ onStart, lang, isDark }) {
  const [msgIdx,      setMsgIdx]      = useState(0)
  const [showFeatures, setShowFeatures] = useState(false)
  const [showStart,   setShowStart]   = useState(false)

  const messages = lang === 'tj'
    ? [
        'Салом! Ман ZAKA — ёрдамчии зеҳнии шумо 🤖',
        'Имрӯз IQ-и шуморо санҷем!',
        'Ба ҳар савол бодиққат посух диҳед. Вақт маҳдуд аст ⏱',
      ]
    : [
        'Привет! Я ZAKA — ваш ИИ-ассистент 🤖',
        'Сегодня измерим ваш интеллект!',
        'Отвечайте внимательно. Время ограничено ⏱',
      ]

  function handleMsgDone() {
    if (msgIdx < messages.length - 1) {
      setTimeout(() => setMsgIdx(i => i + 1), 500)
    } else {
      setTimeout(() => setShowFeatures(true), 300)
      setTimeout(() => setShowStart(true), 700)
    }
  }

  const features = [
    { icon: '🧩', label: lang === 'tj' ? '25 савол'        : '25 вопросов'          },
    { icon: '⏱',  label: lang === 'tj' ? '20 дақиқа'       : '20 минут'             },
    { icon: '🎯', label: lang === 'tj' ? 'IQ + перцентил'  : 'IQ + перцентиль'      },
    { icon: '🔀', label: lang === 'tj' ? 'Ҳар бор тафовут' : 'Каждый раз по-новому' },
  ]

  return (
    <div className={`min-h-screen flex flex-col transition-colors page`}>
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">

          {/* Robot + chat bubbles */}
          <div className="flex gap-4 mb-6">
            <div className="pt-2">
              <RobotFace size="lg" isTyping={!showStart} />
            </div>
            <div className="flex-1 space-y-3">
              {messages.slice(0, msgIdx + 1).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16, scale: 0.96 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{ duration: 0.28 }}
                  className={`rounded-2xl rounded-tl-sm p-3.5 shadow-sm ${
                    isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                  }`}
                >
                  <p className={`text-sm font-medium leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {i === msgIdx
                      ? <TypewriterText text={msg} speed={22} onDone={handleMsgDone} />
                      : msg}
                  </p>
                </motion.div>
              ))}

              {/* Typing dots while next message hasn't started */}
              {msgIdx < messages.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className={`inline-flex items-center gap-1 px-4 py-3 rounded-2xl rounded-tl-sm ${
                    isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-slate-200'
                  }`}
                >
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Feature cards */}
          <AnimatePresence>
            {showFeatures && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-2 mb-5"
              >
                {features.map((f, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.07 }}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                      isDark ? 'bg-slate-800/60 border-slate-700' : 'bg-white border-slate-200'
                    }`}
                  >
                    <span className="text-xl">{f.icon}</span>
                    <span className={`text-xs font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      {f.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Start button */}
          <AnimatePresence>
            {showStart && (
              <motion.button
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onStart}
                className="w-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white py-4 rounded-2xl font-bold text-base shadow-xl shadow-blue-500/30 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
              >
                <Zap size={18} />
                {lang === 'tj' ? 'Санҷишро оғоз кардан' : 'Начать тест'}
              </motion.button>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  )
}

// ── Glitch / error screen ────────────────────────────────────────────────────
function GlitchScreen({ lang, onDone }) {
  const [phase, setPhase] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1800)
    const t2 = setTimeout(() => setPhase(2), 3500)
    const t3 = setTimeout(() => onDone(), 4700)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div className="min-h-screen flex items-center justify-center page px-4 overflow-hidden">
      <style>{`
        @keyframes glitch-shift {
          0%,100%{transform:translate(0) skewX(0deg)}
          20%{transform:translate(-5px,2px) skewX(-1deg)}
          40%{transform:translate(5px,-2px) skewX(1deg)}
          60%{transform:translate(-3px,4px) skewX(0deg)}
          80%{transform:translate(3px,-3px) skewX(-0.5deg)}
        }
        @keyframes scanline {
          0%{top:-5%} 100%{top:105%}
        }
        @keyframes flicker {
          0%,100%{opacity:1} 33%{opacity:0.6} 66%{opacity:0.9}
        }
        .glitch-anim { animation: glitch-shift 0.22s infinite; }
        .flicker-anim { animation: flicker 0.4s infinite; }
        .scanline-el {
          position:absolute; left:0; width:100%; height:3px;
          background:rgba(255,255,255,0.05);
          animation:scanline 1.8s linear infinite;
        }
      `}</style>

      <AnimatePresence mode="wait">
        {phase === 0 && (
          <motion.div key="calc" className="text-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Brain className="w-16 h-16 text-blue-400 mx-auto mb-5 animate-pulse" />
            <p className="text-blue-300 font-mono text-lg mb-5">
              {lang === 'tj' ? 'Ҳисоб карда истодам...' : 'Вычисляю результат...'}
            </p>
            <div className="w-56 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                initial={{ width: 0 }} animate={{ width: '100%' }}
                transition={{ duration: 1.6, ease: 'easeOut' }} />
            </div>
            <p className="text-slate-600 font-mono text-xs mt-3 animate-pulse">analyzing neural patterns...</p>
          </motion.div>
        )}

        {phase === 1 && (
          <motion.div key="error" className="text-center relative"
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <div className="scanline-el" />
            <motion.div
              animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
              transition={{ duration: 0.4, repeat: Infinity, repeatDelay: 0.3 }}
              className="text-6xl mb-5"
            >⚠️</motion.div>
            <div className="glitch-anim flicker-anim">
              <p className="text-red-400 font-black text-4xl sm:text-5xl font-mono tracking-widest mb-2">
                ERROR 404
              </p>
              <p className="text-red-300/80 font-mono text-sm sm:text-base tracking-[0.3em] uppercase">
                {lang === 'tj' ? 'МАҒЗИ ШУМО ЁФТ НАШУД' : 'МОЗГ НЕ НАЙДЕН'}
              </p>
            </div>
            <div className="mt-4 space-y-1">
              <p className="text-slate-600 font-mono text-xs animate-pulse">brain.exe has stopped working</p>
              <p className="text-slate-700 font-mono text-[10px]">0x00000000 CRITICAL_PROCESS_DIED</p>
            </div>
          </motion.div>
        )}

        {phase === 2 && (
          <motion.div key="joke" className="text-center"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}>
            <motion.div
              animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
              transition={{ duration: 0.6 }}
              className="text-6xl mb-5"
            >😄</motion.div>
            <p className="text-white text-2xl font-bold mb-2">
              {lang === 'tj' ? 'Шӯхӣ кардам!' : 'Шучу!'}
            </p>
            <p className="text-slate-400 text-sm">
              {lang === 'tj' ? 'Натиҷаи ваъеиро нишон медиҳам...' : 'Показываю настоящий результат...'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function IQTest() {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { lang }   = useLang()
  const { saveResult } = useAuth()
  const tj = lang === 'tj'

  useSeo({
    title: tj ? 'Санҷиши IQ онлайн ройгон' : 'IQ-тест онлайн бесплатно',
    description: tj
      ? 'Санҷиши ройгони IQ-ро бо забонҳои русӣ ва тоҷикӣ гузаред ва сатҳи зеҳни худро бифаҳмед.'
      : 'Пройди бесплатный IQ-тест на русском и таджикском языках и узнай свой уровень интеллекта.',
    path: '/iq',
  })

  const [phase,     setPhase]     = useState('intro')
  const [questions, setQuestions] = useState([])
  const [current,   setCurrent]   = useState(0)
  const [answers,   setAnswers]   = useState({})
  const [timeLeft,  setTimeLeft]  = useState(IQ_DURATION)
  const [isTyping,  setIsTyping]  = useState(true)
  const [dir,       setDir]       = useState(1)
  const submittedRef = useRef(false)

  const q = questions[current]

  const handleSubmit = useCallback(() => {
    if (submittedRef.current) return
    submittedRef.current = true
    const result = calcIQ(answers, questions)
    const iqData = { ...result, answers }
    localStorage.setItem('iq_results', JSON.stringify(iqData))
    saveResult('iq', { iq: result.iq, level: result.level, percentile: result.percentile })
    setPhase('glitch')
  }, [answers, questions])

  useEffect(() => {
    if (phase !== 'test') return
    if (submittedRef.current) return
    if (timeLeft <= 0) { handleSubmit(); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [timeLeft, phase, handleSubmit])

  function startTest() {
    submittedRef.current = false
    setAnswers({})
    setCurrent(0)
    setTimeLeft(IQ_DURATION)
    setQuestions(buildTestQuestions(IQ_QUESTIONS))
    setPhase('test')
    setIsTyping(true)
  }

  function go(direction) {
    const next = current + direction
    if (next >= 0 && next < questions.length) {
      setDir(direction)
      setIsTyping(true)
      setCurrent(next)
    }
  }

  // ── Phase renders ──────────────────────────────────────────────────────────
  if (phase === 'intro') {
    return <IntroScreen onStart={startTest} lang={lang} isDark={isDark} />
  }
  if (phase === 'glitch') {
    return <GlitchScreen lang={lang} onDone={() => navigate('/iq-results')} />
  }
  if (!q) return null

  const total         = questions.length
  const cat           = IQ_CATEGORIES[q.category]
  const answered      = answers[q.id] !== undefined
  const answeredCount = Object.keys(answers).length

  return (
    <div className={`min-h-screen flex flex-col transition-colors page`}>
      <Navbar />

      {/* Progress bar */}
      <div className={`sticky top-16 z-40 px-4 py-3 border-b ${
        isDark ? 'bg-slate-900/90 border-slate-800 backdrop-blur' : 'bg-white/90 border-slate-200 backdrop-blur'
      }`}>
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-2">
            <TimerDisplay seconds={timeLeft} isDark={isDark} />
            <span className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              {answeredCount} / {total}
            </span>
          </div>
          <div className="flex gap-0.5 flex-wrap">
            {questions.map((qItem, i) => (
              <button
                key={qItem.id}
                onClick={() => { setDir(i > current ? 1 : -1); setIsTyping(true); setCurrent(i) }}
                className={`rounded-full transition-all ${
                  i === current
                    ? 'w-5 h-2.5 bg-blue-500'
                    : answers[qItem.id] !== undefined
                      ? 'w-2.5 h-2.5 bg-emerald-500'
                      : `w-2.5 h-2.5 ${isDark ? 'bg-slate-700' : 'bg-slate-300'}`
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 flex items-start justify-center px-4 py-6 sm:py-8">
        <div className="w-full max-w-2xl">

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={q.id}
              initial={{ opacity: 0, x: dir * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -50 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              {/* Robot + speech bubble */}
              <div className="flex gap-3 sm:gap-4 mb-4">
                <div className="pt-1">
                  <RobotFace size="md" isTyping={isTyping} />
                </div>
                <div className={`flex-1 rounded-2xl rounded-tl-sm p-4 sm:p-5 shadow-sm ${
                  isDark ? 'bg-slate-900/70 border border-slate-800' : 'bg-white border border-slate-200'
                }`}>
                  {/* Category badge + difficulty dots */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${cat.color}`}>
                      {cat[lang] || cat.ru}
                    </span>
                    <span className={`text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>#{current + 1}</span>
                    <div className="flex gap-0.5 ml-auto">
                      {[1, 2, 3].map(d => (
                        <div key={d} className={`w-1.5 h-1.5 rounded-full ${
                          d <= q.difficulty
                            ? q.difficulty === 1 ? 'bg-emerald-500' : q.difficulty === 2 ? 'bg-amber-500' : 'bg-red-500'
                            : isDark ? 'bg-slate-700' : 'bg-slate-200'
                        }`} />
                      ))}
                    </div>
                  </div>

                  <p className={`text-sm sm:text-base font-semibold leading-relaxed ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    <TypewriterText
                      key={`${q.id}-${lang}`}
                      text={q.text[lang] || q.text.tj}
                      speed={15}
                      onDone={() => setIsTyping(false)}
                    />
                  </p>

                  {q.matrix && <MatrixGrid matrix={q.matrix} isDark={isDark} />}

                  {q.trick && (
                    <p className={`text-[10px] mt-2 italic ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>
                      {lang === 'tj' ? '* Бодиққат фикр кунед...' : '* Думайте внимательно...'}
                    </p>
                  )}
                </div>
              </div>

              {/* Answer options — stagger in after typing finishes */}
              <motion.div
                className="space-y-2.5 pl-[calc(56px+12px)] sm:pl-[calc(56px+16px)]"
                initial="hidden"
                animate={isTyping ? 'hidden' : 'visible'}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
              >
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === i
                  return (
                    <motion.button
                      key={i}
                      variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
                      onClick={() => setAnswers(p => ({ ...p, [q.id]: i }))}
                      className={`w-full flex items-center gap-3.5 p-3.5 rounded-xl border-2 text-left transition-all hover:-translate-y-0.5 ${
                        selected
                          ? isDark ? 'border-blue-500 bg-blue-900/25 shadow-lg shadow-blue-500/10' : 'border-blue-500 bg-blue-50 shadow-sm'
                          : isDark ? 'border-slate-700/70 hover:border-slate-600 hover:bg-slate-800/40' : 'border-slate-200 hover:border-slate-300 bg-white hover:shadow-sm'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                        selected ? 'bg-blue-500 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {OPTION_LETTERS[i]}
                      </div>
                      <span className={`text-sm font-medium ${
                        selected ? isDark ? 'text-white' : 'text-slate-900' : isDark ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {opt[lang] || opt.tj}
                      </span>
                    </motion.button>
                  )
                })}
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center gap-4 mt-5 pl-[calc(56px+12px)] sm:pl-[calc(56px+16px)]">
            <button
              onClick={() => go(-1)}
              disabled={current === 0}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
                isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ChevronLeft size={18} />
              {lang === 'tj' ? 'Қафо' : 'Назад'}
            </button>

            {current === total - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!answered}
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                {lang === 'tj' ? 'Натиҷа гирифтан' : 'Получить результат'}
                <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => go(1)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5"
              >
                {lang === 'tj' ? 'Пеш' : 'Далее'}
                <ChevronRight size={16} />
              </button>
            )}
          </div>

          {current === total - 1 && answeredCount < total && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`mt-3 flex items-center gap-2 text-xs p-3 rounded-xl pl-[calc(56px+12px)] sm:pl-[calc(56px+16px)] ${
                isDark ? 'bg-amber-900/20 border border-amber-800/30 text-amber-400' : 'bg-amber-50 border border-amber-200 text-amber-700'
              }`}
            >
              <AlertTriangle size={13} className="flex-shrink-0 ml-[calc(56px+12px)] sm:ml-0" />
              {lang === 'tj'
                ? `${total - answeredCount} савол бе ҷавоб монд — метавонед баргардед.`
                : `${total - answeredCount} вопросов без ответа — можете вернуться.`}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
