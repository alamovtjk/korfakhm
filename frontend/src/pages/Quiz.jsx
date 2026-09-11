import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Send, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../contexts/AuthContext'

// ── Robot face ────────────────────────────────────────────────────────────────
function RobotFace({ isTyping }) {
  return (
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="flex flex-col items-center mb-0.5">
        <div className="relative">
          <div className={`w-2 h-2 rounded-full shadow-lg transition-colors duration-300 ${
            isTyping ? 'bg-emerald-400 shadow-emerald-400/80' : 'bg-blue-400 shadow-blue-400/60'
          }`} />
          {isTyping && <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-60" />}
        </div>
        <div className="w-0.5 h-3 bg-gradient-to-b from-blue-400/60 to-transparent" />
      </div>
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex flex-col items-center justify-center gap-1.5 relative overflow-hidden shadow-lg"
        style={{
          background: 'linear-gradient(135deg,#3b82f6 0%,#6d28d9 60%,#7c3aed 100%)',
          boxShadow: '0 4px 18px rgba(99,102,241,0.5),inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-xl" />
        <div className="flex gap-1.5 relative z-10">
          {[0, 1].map(i => (
            <div key={i}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 bg-white rounded-sm transition-all ${isTyping ? 'animate-pulse' : ''}`}
              style={{ boxShadow: isTyping ? '0 0 8px #fff' : '0 0 4px rgba(255,255,255,0.7)' }}
            />
          ))}
        </div>
        <div className={`transition-all duration-300 relative z-10 ${
          isTyping
            ? 'w-5 h-0.5 rounded-full bg-white/70'
            : 'w-4 h-2.5 border-b-2 border-white/70 rounded-b-full'
        }`} />
      </div>
    </div>
  )
}

// ── Typing dots ───────────────────────────────────────────────────────────────
function TypingDots({ isDark }) {
  return (
    <div className={`flex gap-1.5 items-center px-4 py-3 rounded-2xl rounded-tl-sm ${
      isDark ? 'bg-slate-800' : 'bg-white border border-slate-200 shadow-sm'
    }`}>
      {[0, 1, 2].map(i => (
        <div key={i}
          className="w-2 h-2 rounded-full bg-blue-400 animate-bounce"
          style={{ animationDelay: `${i * 140}ms` }}
        />
      ))}
    </div>
  )
}

const TOTAL_Q = 12

/* 12 diverse fallback questions (used when API is unavailable) */
const FALLBACK_Q = {
  ru: [
    { text:'Чем тебе нравится заниматься в свободное время?', options:['Читать и учиться','Создавать что-то своё','Общаться с людьми','Планировать и организовывать дела'] },
    { text:'Какие школьные предметы нравились тебе больше всего?', options:['Математика и физика','Рисование и музыка','Литература и обществознание','Экономика и черчение'] },
    { text:'Как ты предпочитаешь работать?', options:['В одиночку — сосредоточенно','Гибко, по вдохновению','С большим коллективом','По чёткому плану, всё структурировано'] },
    { text:'Что для тебя важнее в будущей работе?', options:['Интересные и сложные задачи','Возможность творческого самовыражения','Польза людям','Высокая зарплата и карьерный рост'] },
    { text:'Ты больше любишь создавать или анализировать?', options:['Анализировать и исследовать','Создавать новое','Улучшать существующее','Организовывать процессы'] },
    { text:'Как ты относишься к риску?', options:['Рискую, только если всё тщательно просчитано','Рискую ради интересного нового опыта','Советуюсь с близкими перед решением','Рискую ради выгоды и результата'] },
    { text:'Опиши своё идеальное рабочее место:', options:['Тихий офис за компьютером','Творческая студия','Работа с клиентами/пациентами','Динамичный офис, полный встреч и переговоров'] },
    { text:'Как ты обычно принимаешь решения?', options:['Анализирую данные и факты','Слушаю интуицию','Советуюсь с людьми','Действую быстро по ситуации'] },
    { text:'Были ли у тебя опыт руководства чем-то (командой, проектом, мероприятием)?', options:['Нет, предпочитаю работать самостоятельно, а не руководить','Пробовал — больше люблю вдохновлять, чем командовать','Нет, но хотел бы попробовать, особенно в команде','Да, и мне это нравится — легко беру на себя ответственность'] },
    { text:'Как ты обучаешься лучше всего?', options:['Читаю и изучаю самостоятельно','Экспериментирую и учусь методом проб и ошибок','Учусь у наставника или в группе','Учусь через реальный проект, ориентируясь на результат'] },
    { text:'Каким ты видишь себя через 5 лет?', options:['Экспертом в своей области','Автором собственных творческих проектов','Специалистом, помогающим людям','Основателем своего дела или руководителем команды'] },
    { text:'Последний вопрос: какое слово лучше всего тебя описывает?', options:['Аналитик — думаю системно','Творец — создаю новое','Коммуникатор — соединяю людей','Организатор — строю процессы'] },
  ],
  tj: [
    { text:'Дар вақти озод чӣ кор мекунӣ?', options:['Мехонам ва меомӯзам','Эҷод мекунам','Бо дӯстон вохӯрдан','Кору корҳоро нақша ва ташкил мекунам'] },
    { text:'Кадом фанҳо дар мактаб бештар маъқул буд?', options:['Математика ва физика','Рассомӣ ва мусиқӣ','Адабиёт ва ҷамъиятшиносӣ','Иқтисод ва чизкашӣ'] },
    { text:'Чӣ тавр корро дӯст медорӣ?', options:['Танҳо ва мутамарказ','Озодона, аз рӯи илҳом','Дар коллективи калон','Бо нақшаи возеҳ ва тартибот'] },
    { text:'Дар кор чӣ муҳимтар аст?', options:['Вазифаҳои ҷолиб ва мураккаб','Имконияти ифодаи эҷодӣ','Фоида ба мардум','Маоши баланд ва рушди касбӣ'] },
    { text:'Чиро бештар дӯст медорӣ — эҷод кардан ё таҳлил?', options:['Таҳлил ва тадқиқ','Чизи нав эҷод кардан','Такмил додани мавҷуда','Ташкили раванд'] },
    { text:'Нисбат ба хатар чӣ фикр дорӣ?', options:['Танҳо агар ҳама чиз хуб ҳисоб шуда бошад, хатар мекунам','Барои таҷрибаи нави ҷолиб хатар мекунам','Пеш аз қарор бо наздикон машварат мекунам','Барои фоида ва натиҷа хатар мекунам'] },
    { text:'Ҷои кории идеалии худро тасвир кун:', options:['Офиси ором дар назди компютер','Студияи эҷодӣ','Кор бо муштариён','Офиси пуртаҳаррук бо вохӯриҳо ва музокирот'] },
    { text:'Чӣ тавр қарор қабул мекунӣ?', options:['Маълумотро таҳлил мекунам','Инстинктро мегӯшам','Машварат мекунам','Зуд амал мекунам'] },
    { text:'Таҷрибаи роҳбарӣ дошта ӣ?', options:['Не, мустақилона кор кардан беҳтар аст, на роҳбарӣ','Кӯшиш кардам — илҳом бахшиданро аз фармон додан бештар дӯст медорам','Не, аммо мехоҳам, махсусан дар гурӯҳ','Бале, ва ба ман маъқул аст — масъулиятро осон ба ӯҳда мегирам'] },
    { text:'Чӣ тавр беҳтар меомӯзӣ?', options:['Мустақилона мехонам ва меомӯзам','Бо озмоиш ва хато меомӯзам','Аз устод ё дар гурӯҳ меомӯзам','Дар лоиҳаи воқеӣ, бо нигоҳ ба натиҷа меомӯзам'] },
    { text:'Худро 5 сол пас чӣ тавр мебинӣ?', options:['Эксперт дар соҳаи худ','Муаллифи лоиҳаҳои эҷодии худ','Мутахассис барои ёрии мардум','Бунёдгузор ё роҳбари ширкат'] },
    { text:'Охирин савол: кадом калима ту را беҳтар тавсиф мекунад?', options:['Таҳлилгар — системавӣ фикр мекунам','Эҷодкор — навро месозам','Коммуникатор — одамонро пайваст мекунам','Ташкилотчӣ — равандҳо месозам'] },
  ],
}

export default function Quiz() {
  const navigate     = useNavigate()
  const { isDark }   = useTheme()
  const { lang }     = useLang()
  const { saveResult } = useAuth()

  const [apiHistory, setApiHistory] = useState([])
  const [messages,   setMessages]   = useState([])
  const [currentQ,   setCurrentQ]   = useState(null)
  const [input,      setInput]       = useState('')
  const [loading,    setLoading]     = useState(true)
  const [qNum,       setQNum]        = useState(0)

  const bottomRef      = useRef(null)
  const inputRef       = useRef(null)
  const isFetching     = useRef(false)  // prevent concurrent/duplicate fetches
  const initCalled     = useRef(false)  // ensure single mount fetch
  const qNumRef        = useRef(0)      // always-current qNum for async closures
  const offlineIdx     = useRef([])     // tracks which option (0-3) user chose offline

  useEffect(() => { qNumRef.current = qNum }, [qNum])

  // ── Single init — no double fetch even if component re-mounts ──
  useEffect(() => {
    if (initCalled.current) return
    initCalled.current = true
    fetchNext([], lang)
  }, []) // eslint-disable-line

  // ── Scroll ──
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // ── Offline result: simple RIASEC from chosen option indices ──
  function buildOfflineResult(indices, language) {
    const c = { IR: 0, A: 0, S: 0, EC: 0 }
    indices.forEach(i => {
      if (i === 0) c.IR++
      else if (i === 1) c.A++
      else if (i === 2) c.S++
      else c.EC++
    })
    const top = Object.entries(c).sort((a, b) => b[1] - a[1])[0][0]
    // Доля ответов в каждой корзине, а не фиксированный множитель — раньше
    // было *4, откалиброванное под старые 25 вопросов (25*4=100 — потолок
    // шкалы). После сокращения теста до 12 вопросов тот же множитель давал
    // потолок 48/100: профиль не мог показать уверенный результат, даже
    // если пользователь выбирал один и тот же тип ответа всегда.
    const total = indices.length || 1
    const pct = k => Math.round((c[k] / total) * 100)
    const PROFS = {
      IR: [
        { name:'Data Scientist',        emoji:'📊', score:92, category:'IT',      reason:'Аналитический склад ума и любовь к данным' },
        { name:'Backend-разработчик',   emoji:'⚙️', score:88, category:'IT',      reason:'Технические задачи и системное мышление' },
        { name:'QA Engineer',           emoji:'🔍', score:84, category:'IT',      reason:'Внимательность к деталям и точность' },
        { name:'DevOps / SRE',          emoji:'🔧', score:80, category:'IT',      reason:'Инженерный подход к проблемам' },
        { name:'Финансовый аналитик',   emoji:'💰', score:76, category:'Финансы', reason:'Работа с числами и анализом' },
      ],
      A: [
        { name:'UX/UI дизайнер',        emoji:'🎨', score:92, category:'Дизайн',    reason:'Творческий подход и внимание к красоте' },
        { name:'Frontend-разработчик',  emoji:'💻', score:88, category:'IT',        reason:'Создание красивых интерфейсов' },
        { name:'Графический дизайнер',  emoji:'🖌️', score:84, category:'Дизайн',    reason:'Визуальное и художественное мышление' },
        { name:'SMM-специалист',        emoji:'📲', score:80, category:'Маркетинг', reason:'Творческий контент и коммуникация' },
        { name:'Копирайтер',            emoji:'✍️', score:76, category:'Маркетинг', reason:'Создание текстов и историй' },
      ],
      S: [
        { name:'Психолог',              emoji:'🧠', score:92, category:'Медицина',    reason:'Понимание людей и желание помочь' },
        { name:'HR-менеджер',           emoji:'👥', score:88, category:'Управление',  reason:'Работа с людьми и их развитием' },
        { name:'Учитель',               emoji:'🎓', score:84, category:'Образование', reason:'Передача знаний и опыта' },
        { name:'Врач / медработник',    emoji:'🩺', score:80, category:'Медицина',    reason:'Помощь людям в важные моменты' },
        { name:'Маркетолог',            emoji:'📈', score:76, category:'Маркетинг',   reason:'Понимание потребностей клиентов' },
      ],
      EC: [
        { name:'Предприниматель',       emoji:'🚀', score:92, category:'Бизнес',     reason:'Лидерство и стремление к результату' },
        { name:'Продакт-менеджер',      emoji:'📋', score:88, category:'Управление', reason:'Организаторские способности' },
        { name:'Менеджер проектов',     emoji:'📌', score:84, category:'Управление', reason:'Управление командой и сроками' },
        { name:'Бизнес-аналитик',       emoji:'🔬', score:80, category:'Аналитика',  reason:'Системный подход к бизнесу' },
        { name:'Маркетолог',            emoji:'📈', score:76, category:'Маркетинг',  reason:'Рыночное мышление и стратегия' },
      ],
    }
    const typeNames = {
      IR: language==='tj' ? 'Таҳлилгар-Техник'    : 'Аналитик-Технарь',
      A:  language==='tj' ? 'Эҷодкор-Дизайнер'    : 'Творец-Дизайнер',
      S:  language==='tj' ? 'Коммуникатор-Ёрдамгар': 'Помощник-Коммуникатор',
      EC: language==='tj' ? 'Роҳбар-Ташкилотчӣ'   : 'Лидер-Организатор',
    }
    return {
      professions: PROFS[top],
      riasec: { R: pct('IR'), I: pct('IR'), A: pct('A'), S: pct('S'), E: pct('EC'), C: pct('EC') },
      ai_analysis: {
        personality_type: typeNames[top],
        summary: language==='tj'
          ? `Натиҷа аз рӯи ${indices.length} ҷавоби шумо ҳисоб карда шудааст. Барои натиҷаи дақиқтар интернетро пайваст кунед!`
          : `Результат рассчитан на основе ${indices.length} твоих ответов. Для более точного анализа ИИ нужен интернет!`,
        strengths: language==='tj'
          ? ['Мустақилӣ','Тафаккури системавӣ','Диққатнокӣ','Майли пешрафт']
          : ['Самостоятельность','Системное мышление','Внимательность','Стремление к развитию'],
        hidden_talent: '',
        career_insight: '',
      },
    }
  }

  async function fetchNext(hist, language) {
    if (isFetching.current) return          // block concurrent fetches
    isFetching.current = true
    setLoading(true)
    setCurrentQ(null)
    const useLang = language ?? lang
    const nextNum = qNumRef.current         // how many questions answered so far

    try {
      const res  = await fetch('/api/quiz/ai-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history: hist, lang: useLang }),
      })
      const data = await res.json()

      if (data.type === 'question') {
        const num = data.question_num ?? nextNum + 1
        setCurrentQ(data)
        setQNum(num)
        qNumRef.current = num
        setMessages(prev => [...prev, { from: 'ai', text: data.text }])
        setTimeout(() => inputRef.current?.focus(), 100)
      } else if (data.type === 'result') {
        const result = {
          professions: (data.professions || []).map(p => ({
            name: p.name, emoji: p.emoji||'💼', score: p.score||80,
            category: p.category||'IT', reason: p.reason||'',
          })),
          riasec: { R:50, I:50, A:50, S:50, E:50, C:50 },
          ai_analysis: {
            personality_type: data.personality_type,
            summary:          data.summary,
            strengths:        data.strengths || [],
            hidden_talent:    data.advice || '',
            career_insight:   data.advice || '',
          },
        }
        localStorage.setItem('quiz_results', JSON.stringify(result))
        saveResult?.('quiz', result)
        navigate('/results')
        return
      }
    } catch {
      // ── Offline fallback ──
      if (nextNum >= TOTAL_Q) {
        // All 12 answered in offline mode → compute result and navigate
        const result = buildOfflineResult(offlineIdx.current, useLang)
        localStorage.setItem('quiz_results', JSON.stringify(result))
        saveResult?.('quiz', result)
        navigate('/results')
        return
      }
      const list = FALLBACK_Q[useLang] || FALLBACK_Q.ru
      const fq   = list[Math.min(nextNum, list.length - 1)]
      const num  = nextNum + 1
      setCurrentQ({ type:'question', question_num:num, text:fq.text, options:fq.options })
      setQNum(num)
      qNumRef.current = num
      setMessages(prev => [...prev, { from:'ai', text:fq.text }])
    } finally {
      isFetching.current = false
      setLoading(false)
    }
  }

  async function sendAnswer(text) {
    const answer = text.trim()
    if (!answer || loading || isFetching.current) return

    // Track offline option index for result generation
    const optIdx = currentQ?.options?.indexOf(answer) ?? 0
    offlineIdx.current.push(optIdx >= 0 ? optIdx : 0)

    setMessages(prev => [...prev, { from:'user', text:answer }])
    setInput('')

    const newHist = [
      ...apiHistory,
      { role:'assistant', content: JSON.stringify({ type:'question', text:currentQ?.text, options:currentQ?.options }) },
      { role:'user',      content: answer },
    ]
    setApiHistory(newHist)
    fetchNext(newHist, lang)
  }

  const progress = Math.min(100, (qNum / TOTAL_Q) * 100)
  const isTj     = lang === 'tj'

  return (
    <div className={`min-h-screen flex flex-col page`}>
      <Navbar />

      {/* ── Progress bar ── */}
      <div className={`sticky top-16 z-40 px-4 py-2.5 border-b ${
        isDark ? 'bg-slate-900/90 border-slate-800 backdrop-blur' : 'bg-white/90 border-slate-200 backdrop-blur'
      }`}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <span className={`text-xs font-semibold whitespace-nowrap ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isTj ? 'Савол' : 'Вопрос'} {Math.min(qNum, TOTAL_Q)} / {TOTAL_Q}
          </span>
          <div className={`flex-1 h-1.5 rounded-full ${isDark ? 'bg-slate-800' : 'bg-slate-200'}`}>
            <div
              className="h-1.5 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-700"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className={`text-xs font-bold ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>

      {/* ── Chat messages ── */}
      <div className="flex-1 overflow-y-auto px-4 py-5 sm:py-8">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* ZAKA intro */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 items-end"
          >
            <RobotFace isTyping={false} />
            <div className={`px-4 py-3 rounded-2xl rounded-tl-sm text-sm leading-relaxed max-w-[82%] ${
              isDark ? 'bg-slate-800 text-white' : 'bg-white text-slate-800 border border-slate-200 shadow-sm'
            }`}>
              {isTj
                ? '👋 Салом! Ман ZAKA — дастёри зеҳни сунъии КОРФАҲМ. Ба ту 12 савол медиҳам ва касбҳои мувофиқро пешниҳод мекунам.'
                : '👋 Привет! Я ZAKA — ИИ-помощник платформы КОРФАҲМ. Задам тебе 12 вопросов и найду подходящие профессии.'}
            </div>
          </motion.div>

          {/* Conversation messages */}
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
                className={`flex gap-3 items-end ${msg.from === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {msg.from === 'ai' && <RobotFace isTyping={false} />}

                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed max-w-[82%] font-medium ${
                  msg.from === 'ai'
                    ? isDark
                      ? 'bg-slate-800 text-white rounded-tl-sm'
                      : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200 shadow-sm'
                    : 'bg-gradient-to-br from-blue-600 to-violet-600 text-white rounded-tr-sm'
                }`}>
                  {msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* AI typing indicator */}
          {loading && (
            <motion.div
              key="typing"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3 items-end"
            >
              <RobotFace isTyping={true} />
              <TypingDots isDark={isDark} />
            </motion.div>
          )}

          {/* Answer options */}
          {!loading && currentQ?.options && (
            <motion.div
              key={`opts-${qNum}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="grid sm:grid-cols-2 gap-2 pl-14 sm:pl-16"
            >
              {currentQ.options.map((opt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.06 }}
                  onClick={() => sendAnswer(opt)}
                  className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all active:scale-95 hover:-translate-y-0.5 ${
                    isDark
                      ? 'border-slate-700 bg-slate-800/70 text-slate-200 hover:border-blue-500 hover:bg-blue-950/40'
                      : 'border-slate-200 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 shadow-sm'
                  }`}
                >
                  {opt}
                </motion.button>
              ))}
            </motion.div>
          )}

          <div ref={bottomRef} className="h-2" />
        </div>
      </div>

      {/* ── Text input ── */}
      <div className={`sticky bottom-0 px-4 py-3 border-t ${
        isDark ? 'bg-slate-900/95 border-slate-800 backdrop-blur' : 'bg-white/95 border-slate-200 backdrop-blur'
      }`}>
        <form
          className="max-w-2xl mx-auto flex gap-2"
          onSubmit={e => { e.preventDefault(); sendAnswer(input) }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading || !currentQ}
            placeholder={
              loading
                ? (isTj ? 'ZAKA фикр мекунад...' : 'ZAKA думает...')
                : (isTj ? 'Ё навис, ё вариантро интихоб кун...' : 'Или напиши свой ответ...')
            }
            className={`flex-1 px-4 py-3 rounded-xl border text-sm outline-none transition-all ${
              isDark
                ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white'
            } disabled:opacity-50`}
          />
          <button
            type="submit"
            disabled={loading || !input.trim() || !currentQ}
            className="px-4 py-3 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white rounded-xl disabled:opacity-40 transition-all active:scale-95"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </form>
        <p className={`text-center text-[10px] mt-1.5 ${isDark ? 'text-slate-700' : 'text-slate-400'}`}>
          {isTj ? 'Вариантро клик кун ё ҷавоби худатро навис' : 'Кликни вариант или напиши свой ответ'}
        </p>
      </div>
    </div>
  )
}
