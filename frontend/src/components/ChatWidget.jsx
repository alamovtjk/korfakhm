import { useState, useRef, useEffect } from 'react'
import { X, Send, RotateCcw } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'

/* ── Local fallback replies ──────────────────────────────────────── */
const LOCAL = {
  ru: {
    default:    'Хороший вопрос! Пройди наш тест — он подберёт профессии именно для тебя 🎯',
    программист:'Junior IT в Таджикистане: 3–5 тыс. сом, Senior: 12 000+. Начни с Python или JavaScript 💻',
    разработчик:'Junior IT в Таджикистане: 3–5 тыс. сом, Senior: 12 000+. Начни с Python или JavaScript 💻',
    python:     'Python отлично для Data Science и Backend. Alif Tech и Somon IT нанимают от 5 000 сом.',
    javascript: 'React / JavaScript — самый востребованный стек в Душанбе. Компании ищут постоянно.',
    it:         'IT — самая быстрорастущая отрасль. Зарплаты выше рынка, много удалённых $ позиций 🚀',
    дизайн:     'UX/UI дизайн востребован. Figma + Adobe XD. Зарплата: 3–6 тыс. сом + удалёнка 🎨',
    зарплата:   'Junior IT — 3–5 тыс. сом, Middle — 6–10 тыс., Senior — 12–20 тыс. 💰',
    работа:     'Смотри раздел «Вакансии» — реальные вакансии без регистрации! 📋',
    вакансия:   'Смотри раздел «Вакансии» — реальные вакансии без регистрации! 📋',
    тест:       'RIASEC-тест займёт 35–45 мин и подберёт 5 профессий для тебя. Бесплатно! 🧠',
    iq:         'Наш IQ-тест — первый в Таджикистане на двух языках! 25 вопросов, результат с перцентилем 🧩',
    маркетинг:  'Маркетолог и SMM — стабильный спрос. МегаФон TJ и другие. Зарплата: 3–6 тыс. сом 📈',
    курс:       'Alif Academy, IOTA Academy (Душанбе), Coursera — 1–2 часа в день + практика = работа через 6–12 мес 📚',
    привет:     'Привет! Я AIDA — ИИ-ассистент КОРФАҲМ 🤖 Спроси о профессиях, зарплатах или карьере!',
    здравствуй: 'Привет! Я AIDA — ИИ-ассистент КОРФАҲМ 🤖 Спроси о профессиях, зарплатах или карьере!',
    спасибо:    'Пожалуйста! Если нужна помощь — я здесь 😊 Попробуй наш тест на профессию?',
  },
  tj: {
    default:    'Савол хуб! Санҷишро гузар — он касбҳоро барои ту интихоб мекунад 🎯',
    салом:      'Салом! Ман AIDA — ИИ-ассистенти КОРФАҲМ 🤖 Дар бораи касбҳо, маош ё кор бипурс!',
    барнома:    'Барномасозӣ — касби рақами 1! Junior: 3–5 ҳаз. сом., Senior: 12 000+. Python-ро оғоз кун 💻',
    кор:        'Бахши «Вакансияҳо»-ро бин — вакансияҳои воқеӣ бе сабтном! 📋',
    маош:       'Junior IT — 3–5 ҳаз., Middle — 6–10 ҳаз., Senior — 12–20 ҳаз. сомонӣ 💰',
    санҷиш:     'Санҷиши RIASEC 35–45 дақиқа, 5 касби мувофиқ. Ройгон! 🧠',
    ташаккур:   'Хоҳиш мекунам! Санҷишро гузаштӣ? 😊',
  },
}

function getLocalReply(msg, lang) {
  const lower = msg.toLowerCase()
  const map = LOCAL[lang] || LOCAL.ru
  for (const [kw, reply] of Object.entries(map)) {
    if (kw !== 'default' && lower.includes(kw)) return reply
  }
  return map.default
}

async function fetchReply(message, lang, history) {
  try {
    const res = await fetch('/api/chat/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, lang, history }),
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) throw new Error()
    const data = await res.json()
    return data.reply
  } catch {
    return getLocalReply(message, lang)
  }
}

/* ── AIDA robot face ─────────────────────────────────────────────── */
function AidaFace({ size = 40, isTyping = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: size * 0.3,
      background: 'linear-gradient(135deg, #7c3aed 0%, #0d9488 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: Math.max(3, size * 0.08), flexShrink: 0, position: 'relative', overflow: 'hidden',
      boxShadow: '0 4px 14px rgba(124,58,237,0.4)',
    }}>
      <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%',
        background:'linear-gradient(to bottom, rgba(255,255,255,0.22), transparent)' }} />
      <div style={{ display:'flex', gap: size * 0.15 }}>
        {[0,1].map(i => (
          <div key={i} style={{
            width: size * 0.16, height: size * 0.16, borderRadius: 2,
            background: '#fff',
            animation: isTyping ? 'aida-pulse .8s ease-in-out infinite' : 'aida-blink 4s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }} />
        ))}
      </div>
      <div style={{
        width: size * 0.38, height: size * 0.16,
        borderBottom: '2px solid rgba(255,255,255,0.75)',
        borderRadius: isTyping ? 4 : '0 0 50px 50px',
        transition: 'border-radius .3s',
      }} />
    </div>
  )
}

/* ── Chat panel (shared for mobile and desktop) ──────────────────── */
function ChatPanel({ messages, loading, input, setInput, send, onKey, reset, setOpen, lang, isDark, inputRef, bottomRef, SUGGESTED, sendText }) {
  const bg     = isDark ? '#0d0a1e'               : '#ffffff'
  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(100,80,200,0.15)'
  const msgAI  = isDark ? 'rgba(255,255,255,0.07)': 'rgba(124,58,237,0.06)'
  const msgAIc = isDark ? 'rgba(255,255,255,0.88)': '#1a1535'
  const textDim= isDark ? 'rgba(255,255,255,0.4)' : 'rgba(26,21,53,0.45)'
  const inpBg  = isDark ? 'rgba(255,255,255,0.05)': 'rgba(124,58,237,0.04)'

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', background: bg }}>

      {/* Header */}
      <div style={{
        display:'flex', alignItems:'center', gap:12,
        padding:'14px 16px', flexShrink:0,
        background:'linear-gradient(135deg, #7c3aed 0%, #0d9488 100%)',
      }}>
        <AidaFace size={38} isTyping={loading} />
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ fontSize:15, fontWeight:800, color:'#fff', fontFamily:'Manrope,system-ui' }}>AIDA</div>
          <div style={{ fontSize:10, color:'rgba(255,255,255,0.72)', marginTop:1, fontWeight:600 }}>
            {loading
              ? (lang==='tj' ? 'Менависад...' : 'Печатает...')
              : 'ИИ-ассистент КОРФАҲМ • Онлайн'}
          </div>
        </div>
        <div style={{ display:'flex', gap:6 }}>
          <button
            onClick={reset}
            style={{ width:32, height:32, borderRadius:10, border:'none', cursor:'pointer',
              background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}
          >
            <RotateCcw size={13} color="#fff" />
          </button>
          <button
            onClick={() => setOpen(false)}
            style={{ width:32, height:32, borderRadius:10, border:'none', cursor:'pointer',
              background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center' }}
          >
            <X size={16} color="#fff" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex:1, overflowY:'auto', padding:'14px 12px 8px', display:'flex', flexDirection:'column', gap:12,
        WebkitOverflowScrolling:'touch' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', gap:8, flexDirection: m.role==='user' ? 'row-reverse' : 'row', alignItems:'flex-end' }}>
            {m.role==='assistant' && <AidaFace size={28} isTyping={false} />}
            <div style={{
              maxWidth:'80%', padding:'10px 13px', borderRadius:18,
              borderTopLeftRadius: m.role==='assistant' ? 4 : 18,
              borderTopRightRadius: m.role==='user' ? 4 : 18,
              fontSize:13, lineHeight:1.65, whiteSpace:'pre-line', fontFamily:'Manrope,system-ui',
              background: m.role==='user' ? 'linear-gradient(135deg,#7c3aed,#0d9488)' : msgAI,
              color: m.role==='user' ? '#fff' : msgAIc,
              border: m.role==='assistant' ? `1px solid ${border}` : 'none',
              wordBreak:'break-word',
            }}>
              {m.content}
            </div>
          </div>
        ))}

        {/* Typing dots */}
        {loading && (
          <div style={{ display:'flex', gap:8, alignItems:'flex-end' }}>
            <AidaFace size={28} isTyping />
            <div style={{ padding:'10px 14px', borderRadius:18, borderTopLeftRadius:4,
              background:msgAI, border:`1px solid ${border}`, display:'flex', gap:5, alignItems:'center' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ width:7, height:7, borderRadius:'50%', background:'#a78bfa',
                  animation:'aida-pulse .9s ease-in-out infinite', animationDelay:`${i*0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        {/* Suggested questions */}
        {messages.length === 1 && !loading && (
          <div style={{ display:'flex', flexDirection:'column', gap:7, paddingLeft:36 }}>
            {SUGGESTED.map((s, i) => (
              <button key={i} onClick={() => sendText(s)} style={{
                textAlign:'left', padding:'9px 13px', borderRadius:12,
                border:`1px solid ${border}`, background:'transparent', cursor:'pointer',
                fontSize:12, color:textDim, fontFamily:'Manrope,system-ui', fontWeight:600,
              }}>
                {s}
              </button>
            ))}
          </div>
        )}

        <div ref={bottomRef} style={{ height:4 }} />
      </div>

      {/* Input bar */}
      <div style={{ padding:'10px 12px 14px', borderTop:`1px solid ${border}`, flexShrink:0 }}>
        <div style={{ display:'flex', gap:8, alignItems:'center',
          background:inpBg, border:`1px solid ${border}`, borderRadius:14, padding:'10px 14px' }}>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder={lang==='tj' ? 'Савол бипурс...' : 'Задай вопрос...'}
            style={{
              flex:1, background:'transparent', border:'none', outline:'none',
              fontSize:14, fontFamily:'Manrope,system-ui', color:msgAIc, minWidth:0,
            }}
          />
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            style={{
              width:36, height:36, borderRadius:11, border:'none',
              cursor: input.trim() && !loading ? 'pointer' : 'default',
              background: input.trim() && !loading
                ? 'linear-gradient(135deg,#7c3aed,#0d9488)'
                : 'rgba(124,58,237,0.2)',
              display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, transition:'all .18s',
            }}
          >
            <Send size={15} color="#fff" />
          </button>
        </div>
        <div style={{ textAlign:'center', fontSize:9, color:textDim, marginTop:6, fontWeight:600, letterSpacing:'0.1em' }}>
          КОРФАҲМ · AIDA AI
        </div>
      </div>
    </div>
  )
}

/* ── Main widget ──────────────────────────────────────────────────── */
export default function ChatWidget() {
  const { isDark } = useTheme()
  const { lang }   = useLang()

  const [open,     setOpen]    = useState(false)
  const [messages, setMessages]= useState([])
  const [input,    setInput]   = useState('')
  const [loading,  setLoading] = useState(false)
  const [hasNew,   setHasNew]  = useState(false)
  const [isMobile, setIsMobile]= useState(() => window.innerWidth <= 640)

  const bottomRef     = useRef(null)
  const inputRef      = useRef(null)
  const constraintRef = useRef(null)
  const wasDragged    = useRef(false)
  const tapStart      = useRef(0)

  /* track mobile breakpoint */
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth <= 640)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])

  const greeting = lang==='tj'
    ? 'Салом! Ман AIDA — дастёри зеҳни сунъии КОРФАҲМ ✦\n\nДар бораи касбҳо, маош ё кор дар Тоҷикистон бипурс!'
    : 'Привет! Я AIDA — ИИ-ассистент КОРФАҲМ ✦\n\nСпроси о профессиях, зарплатах или о том, как найти работу в Таджикистане!'

  const SUGGESTED = lang==='tj'
    ? ['Маош дар IT чанд аст?', 'Чӣ тавр барномасоз шавам?', 'Кадом касб ба ман мувофиқ?']
    : ['Какие зарплаты в IT?', 'Как стать разработчиком?', 'Какая профессия мне подходит?']

  /* scroll to bottom on new messages */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [messages, loading])

  /* on open: init greeting, focus input */
  useEffect(() => {
    if (open) {
      if (messages.length === 0) setMessages([{ role:'assistant', content:greeting }])
      setHasNew(false)
      setTimeout(() => inputRef.current?.focus(), 350)
    }
  }, [open]) // eslint-disable-line

  /* lock body scroll when mobile sheet is open */
  useEffect(() => {
    if (isMobile && open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isMobile, open])

  async function sendText(text) {
    if (!text.trim() || loading) return
    setInput('')
    const history = messages.map(m => ({ role:m.role, content:m.content }))
    setMessages(prev => [...prev, { role:'user', content:text }])
    setLoading(true)
    const reply = await fetchReply(text, lang, history)
    setLoading(false)
    setMessages(prev => [...prev, { role:'assistant', content:reply }])
    if (!open) setHasNew(true)
  }

  function send() { sendText(input.trim()) }
  function onKey(e) { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); send() } }
  function reset() { setMessages([{ role:'assistant', content:greeting }]) }

  const border = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(100,80,200,0.15)'

  const panelProps = { messages, loading, input, setInput, send, onKey, reset, setOpen, lang, isDark, inputRef, bottomRef, SUGGESTED, sendText }

  return (
    <>
      <style>{`
        @keyframes aida-blink  { 0%,88%,100%{transform:scaleY(1)} 94%{transform:scaleY(0.08)} }
        @keyframes aida-pulse  { 0%,100%{opacity:1} 50%{opacity:.45} }
        @keyframes aida-float  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes aida-ring   { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.9);opacity:0} }
        @keyframes aida-ring2  { 0%{transform:scale(1);opacity:.3} 100%{transform:scale(2.4);opacity:0} }
        .aida-float { animation: aida-float 3.2s ease-in-out infinite; }
        .aida-ring  { animation: aida-ring  2s ease-out infinite; }
        .aida-ring2 { animation: aida-ring2 2s ease-out .5s infinite; }
      `}</style>

      {/* ══ MOBILE: bottom-sheet overlay ══════════════════════════ */}
      {isMobile && (
        <>
          {/* Backdrop */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="backdrop"
                initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                transition={{ duration:.2 }}
                onClick={() => setOpen(false)}
                style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.55)', zIndex:60, touchAction:'none' }}
              />
            )}
          </AnimatePresence>

          {/* Bottom sheet */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="sheet"
                initial={{ y:'100%' }}
                animate={{ y:0 }}
                exit={{ y:'100%' }}
                transition={{ type:'spring', stiffness:340, damping:34 }}
                style={{
                  position:'fixed', bottom:0, left:0, right:0, zIndex:61,
                  height:'82vh', maxHeight:'82vh',
                  borderRadius:'22px 22px 0 0',
                  overflow:'hidden',
                  boxShadow:'0 -8px 60px rgba(0,0,0,0.55)',
                }}
              >
                <ChatPanel {...panelProps} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating button (mobile — no drag) */}
          <AnimatePresence>
            {!open && (
              <motion.div
                key="btn-mobile"
                initial={{ opacity:0, scale:.5 }}
                animate={{ opacity:1, scale:1 }}
                exit={{ opacity:0, scale:.5 }}
                transition={{ type:'spring', stiffness:260, damping:20 }}
                style={{ position:'fixed', bottom:20, right:20, zIndex:62,
                  display:'flex', flexDirection:'column', alignItems:'center' }}
              >
                {/* Speech bubble */}
                <div style={{
                  marginBottom:8, padding:'7px 13px', borderRadius:14, borderBottomRightRadius:4,
                  fontSize:12, fontWeight:700, whiteSpace:'nowrap', fontFamily:'Manrope,system-ui',
                  background: isDark ? 'rgba(20,14,40,0.96)' : '#fff',
                  color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1535',
                  border:`1px solid ${border}`,
                  boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.5)' : '0 8px 24px rgba(100,80,200,0.18)',
                }}>
                  ✦ {lang==='tj' ? 'Кӯмак лозим аст?' : 'Чем помочь?'}
                </div>

                {/* Antenna dot */}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:4 }}>
                  <div style={{ position:'relative', width:9, height:9 }}>
                    <div style={{ width:9, height:9, borderRadius:'50%', background:'#2dd4bf', boxShadow:'0 0 8px #2dd4bf' }} />
                    <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#2dd4bf', animation:'aida-ring 2s ease-out infinite' }} />
                  </div>
                  <div style={{ width:2, height:12, background:'linear-gradient(to bottom,rgba(45,212,191,0.6),transparent)' }} />
                </div>

                {/* Main tap button */}
                <div style={{ position:'relative' }} className="aida-float">
                  <div style={{ position:'absolute', inset:0, borderRadius:20, background:'linear-gradient(135deg,#7c3aed,#0d9488)', animation:'aida-ring 2s ease-out infinite' }} />
                  <button
                    onTouchEnd={e => { e.preventDefault(); setOpen(true) }}
                    onClick={() => setOpen(true)}
                    style={{
                      position:'relative', width:64, height:64, borderRadius:20, border:'none', cursor:'pointer',
                      background:'linear-gradient(135deg,#7c3aed 0%,#0d9488 100%)',
                      boxShadow:'0 8px 32px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.22)',
                      overflow:'hidden', touchAction:'manipulation',
                    }}
                  >
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%',
                      background:'linear-gradient(to bottom,rgba(255,255,255,0.2),transparent)', borderRadius:'20px 20px 0 0' }} />
                    <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:6 }}>
                      <div style={{ display:'flex', gap:9 }}>
                        {[0,1].map(i => (
                          <div key={i} style={{ width:11, height:11, borderRadius:3, background:'#fff',
                            boxShadow:'0 0 8px rgba(255,255,255,0.9)', animation:'aida-blink 4s ease-in-out infinite', animationDelay:`${i*0.12}s` }} />
                        ))}
                      </div>
                      <div style={{ width:26, height:10, borderBottom:'2px solid rgba(255,255,255,0.8)', borderRadius:'0 0 50px 50px' }} />
                    </div>
                    {hasNew && (
                      <span style={{ position:'absolute', top:-6, right:-6, width:18, height:18, borderRadius:'50%',
                        background:'#ef4444', fontSize:9, fontWeight:800, color:'#fff',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        boxShadow:'0 0 10px rgba(239,68,68,0.6)', border:'2px solid #fff' }}>!</span>
                    )}
                  </button>
                </div>

                <div style={{
                  marginTop:8, padding:'3px 12px', borderRadius:999,
                  fontSize:10, fontWeight:800, letterSpacing:'0.12em', fontFamily:'Manrope,system-ui',
                  background: isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)',
                  color: isDark ? '#a78bfa' : '#7c3aed',
                  border:`1px solid ${isDark ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.25)'}`,
                }}>
                  ✦ AIDA AI
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* ══ DESKTOP: draggable floating widget ════════════════════ */}
      {!isMobile && (
        <>
          {/* Drag constraint layer */}
          <div ref={constraintRef} style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:49 }} />

          {/* Chat window — separate from draggable button, always fixed at bottom-right */}
          <AnimatePresence>
            {open && (
              <motion.div
                key="chat-desktop"
                initial={{ opacity:0, y:16, scale:.96 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:16, scale:.96 }}
                transition={{ type:'spring', stiffness:320, damping:28 }}
                style={{
                  position:'fixed', bottom:104, right:24, zIndex:51,
                  width:360, height:520,
                  borderRadius:24, overflow:'hidden',
                  border:`1px solid ${border}`,
                  boxShadow: isDark
                    ? '0 24px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)'
                    : '0 24px 80px rgba(100,80,200,0.18), inset 0 1px 0 rgba(255,255,255,0.9)',
                }}
              >
                <ChatPanel {...panelProps} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Draggable button */}
          <motion.div
            drag
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={constraintRef}
            onDragStart={() => { wasDragged.current = false; tapStart.current = Date.now() }}
            onDrag={(_, info) => {
              if (Math.abs(info.offset.x) > 8 || Math.abs(info.offset.y) > 8) wasDragged.current = true
            }}
            style={{
              position:'fixed', bottom:24, right:24, zIndex:52,
              display:'flex', flexDirection:'column', alignItems:'center',
              touchAction:'none', cursor:'grab',
              userSelect:'none',
            }}
            whileDrag={{ cursor:'grabbing' }}
          >
            <AnimatePresence>
              {!open && (
                <motion.div
                  initial={{ opacity:0, scale:.5 }}
                  animate={{ opacity:1, scale:1 }}
                  exit={{ opacity:0, scale:.5 }}
                  transition={{ type:'spring', stiffness:260, damping:20 }}
                  style={{ display:'flex', flexDirection:'column', alignItems:'center' }}
                >
                  {/* Speech bubble */}
                  <motion.div
                    initial={{ opacity:0, y:6 }} animate={{ opacity:1, y:0 }} transition={{ delay:.5 }}
                    style={{
                      marginBottom:8, padding:'7px 14px', borderRadius:14, borderBottomRightRadius:4,
                      fontSize:11, fontWeight:700, whiteSpace:'nowrap', fontFamily:'Manrope,system-ui',
                      background: isDark ? 'rgba(20,14,40,0.96)' : '#fff',
                      color: isDark ? 'rgba(255,255,255,0.9)' : '#1a1535',
                      border:`1px solid ${border}`,
                      boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.4)' : '0 8px 24px rgba(100,80,200,0.14)',
                      pointerEvents:'none',
                    }}
                  >
                    ✦ {lang==='tj' ? 'Ба ту кӯмак карда метавонам?' : 'Чем могу помочь?'}
                  </motion.div>

                  {/* Antenna */}
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginBottom:4 }}>
                    <div style={{ position:'relative', width:10, height:10 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:'#2dd4bf', boxShadow:'0 0 10px #2dd4bf' }} />
                      <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#2dd4bf', animation:'aida-ring 2s ease-out infinite' }} />
                      <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'#2dd4bf', animation:'aida-ring2 2s ease-out .5s infinite' }} />
                    </div>
                    <div style={{ width:2, height:14, background:'linear-gradient(to bottom,rgba(45,212,191,0.6),transparent)' }} />
                  </div>

                  {/* Main button */}
                  <div style={{ position:'relative' }} className="aida-float">
                    <div style={{ position:'absolute', inset:0, borderRadius:20, background:'linear-gradient(135deg,#7c3aed,#0d9488)', animation:'aida-ring 2s ease-out infinite' }} />
                    <div style={{ position:'absolute', inset:0, borderRadius:20, background:'linear-gradient(135deg,#a78bfa,#2dd4bf)', animation:'aida-ring2 2s ease-out .5s infinite' }} />

                    <button
                      onClick={() => { if (!wasDragged.current) setOpen(o => !o) }}
                      style={{
                        position:'relative', width:64, height:64, borderRadius:20, border:'none', cursor:'grab',
                        background:'linear-gradient(135deg,#7c3aed 0%,#0d9488 100%)',
                        boxShadow:'0 8px 32px rgba(124,58,237,0.55), inset 0 1px 0 rgba(255,255,255,0.22)',
                        overflow:'hidden',
                      }}
                    >
                      <div style={{ position:'absolute', top:0, left:0, right:0, height:'45%',
                        background:'linear-gradient(to bottom,rgba(255,255,255,0.2),transparent)', borderRadius:'20px 20px 0 0' }} />
                      <div style={{ position:'relative', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:6 }}>
                        <div style={{ display:'flex', gap:9 }}>
                          {[0,1].map(i => (
                            <div key={i} style={{ width:11, height:11, borderRadius:3, background:'#fff',
                              boxShadow:'0 0 8px rgba(255,255,255,0.9)', animation:'aida-blink 4s ease-in-out infinite', animationDelay:`${i*0.12}s` }} />
                          ))}
                        </div>
                        <div style={{ width:26, height:10, borderBottom:'2px solid rgba(255,255,255,0.8)', borderRadius:'0 0 50px 50px' }} />
                      </div>
                      {hasNew && (
                        <motion.span initial={{ scale:0 }} animate={{ scale:1 }}
                          style={{ position:'absolute', top:-6, right:-6, width:18, height:18, borderRadius:'50%',
                            background:'#ef4444', fontSize:9, fontWeight:800, color:'#fff',
                            display:'flex', alignItems:'center', justifyContent:'center',
                            boxShadow:'0 0 10px rgba(239,68,68,0.6)', border:'2px solid #fff' }}>!</motion.span>
                      )}
                    </button>
                  </div>

                  {/* Name badge */}
                  <motion.div
                    initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} transition={{ delay:.35 }}
                    style={{
                      marginTop:8, padding:'3px 12px', borderRadius:999,
                      fontSize:10, fontWeight:800, letterSpacing:'0.12em', fontFamily:'Manrope,system-ui',
                      background: isDark ? 'rgba(124,58,237,0.2)' : 'rgba(124,58,237,0.1)',
                      color: isDark ? '#a78bfa' : '#7c3aed',
                      border:`1px solid ${isDark ? 'rgba(124,58,237,0.35)' : 'rgba(124,58,237,0.25)'}`,
                    }}
                  >
                    ✦ AIDA AI
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Show mini header when chat is open so user can drag to reposition */}
            {open && (
              <div style={{
                width:56, height:56, borderRadius:16,
                background:'linear-gradient(135deg,#7c3aed,#0d9488)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 4px 20px rgba(124,58,237,0.5)',
                cursor:'grab',
              }}>
                <AidaFace size={36} isTyping={loading} />
              </div>
            )}
          </motion.div>
        </>
      )}
    </>
  )
}
