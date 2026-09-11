import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Brain, Target, TrendingUp, MapPin, ArrowRight, Sparkles, Briefcase, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { useLang } from '../contexts/LangContext'
import { useTheme } from '../contexts/ThemeContext'
import { vacancyService } from '../services/vacancyService'

/* ── Typewriter ────────────────────────────────────────────── */
const PHRASES = {
  ru: ['которая тебе по душе', 'о которой ты мечтал', 'с высокой зарплатой', 'в Таджикистане'],
  tj: ['ки ба дилат мувофиқ аст', 'ки орзуи ту буд', 'бо маоши баланд', 'дар Тоҷикистон'],
}
function Typewriter({ lang }) {
  const phrases = PHRASES[lang] || PHRASES.ru
  const [idx, setIdx]       = useState(0)
  const [text, setText]     = useState('')
  const [del, setDel]       = useState(false)
  useEffect(() => {
    const full = phrases[idx]; let t
    if (!del && text.length < full.length)       t = setTimeout(() => setText(full.slice(0, text.length + 1)), 52)
    else if (!del && text.length === full.length) t = setTimeout(() => setDel(true), 1800)
    else if (del && text.length > 0)             t = setTimeout(() => setText(text.slice(0, -1)), 26)
    else { setDel(false); setIdx(i => (i + 1) % phrases.length) }
    return () => clearTimeout(t)
  }, [text, del, idx, phrases])
  return <span className="grad-violet">{text}<span style={{ color: '#a78bfa' }}>|</span></span>
}

/* ── CountUp ───────────────────────────────────────────────── */
function CountUp({ to, suffix = '', duration = 1600 }) {
  const [count, setCount] = useState(0)
  const ref     = useRef(null)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          const startTime = performance.now()
          const tick = (now) => {
            const elapsed  = now - startTime
            const progress = Math.min(elapsed / duration, 1)
            const eased    = 1 - Math.pow(1 - progress, 3) // easeOutCubic
            setCount(Math.round(eased * to))
            if (progress < 1) requestAnimationFrame(tick)
          }
          requestAnimationFrame(tick)
        }
      },
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])

  const formatted = count >= 1000
    ? Math.floor(count / 1000) + ' ' + String(count % 1000).padStart(3, '0')
    : String(count)

  return <span ref={ref}>{formatted}{suffix}</span>
}

/* ── Fade-up variant ───────────────────────────────────────── */
const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

/* ── Main ──────────────────────────────────────────────────── */
export default function Landing() {
  const navigate     = useNavigate()
  const { t, lang }  = useLang()
  const { isDark }   = useTheme()

  /* ── Theme color palette ── */
  const c = {
    bg:        isDark ? '#06060f'                  : '#f5f4ff',
    text:      isDark ? 'rgba(255,255,255,0.94)'   : '#1a1535',
    textDim:   isDark ? 'rgba(255,255,255,0.52)'   : 'rgba(26,21,53,0.6)',
    textFaint: isDark ? 'rgba(255,255,255,0.36)'   : 'rgba(26,21,53,0.42)',
    border:    isDark ? 'rgba(255,255,255,0.08)'   : 'rgba(100,80,200,0.12)',
    cardBg:    isDark ? 'rgba(255,255,255,0.05)'   : 'rgba(124,58,237,0.04)',
    cardBgHov: isDark ? 'rgba(255,255,255,0.08)'   : 'rgba(124,58,237,0.08)',
    statBorder:isDark ? 'rgba(255,255,255,0.08)'   : 'rgba(100,80,200,0.14)',
    footer:    isDark ? 'rgba(255,255,255,0.22)'   : 'rgba(26,21,53,0.35)',
  }

  const vacancies = vacancyService.getPublished().slice(0, 3)

  const features = [
    { icon: Brain,      color: '#a78bfa', rgb: '167,139,250', title: t.landing_f1_title, desc: t.landing_f1_desc },
    { icon: Target,     color: '#2dd4bf', rgb: '45,212,191',  title: t.landing_f2_title, desc: t.landing_f2_desc },
    { icon: TrendingUp, color: '#f0abfc', rgb: '240,171,252', title: t.landing_f3_title, desc: t.landing_f3_desc },
    { icon: MapPin,     color: '#60a5fa', rgb: '96,165,250',  title: t.landing_f4_title, desc: t.landing_f4_desc },
  ]

  const steps = [
    { n: '1', title: t.landing_s1, desc: t.landing_s1d },
    { n: '2', title: t.landing_s2, desc: t.landing_s2d },
    { n: '3', title: t.landing_s3, desc: t.landing_s3d },
    { n: '4', title: t.landing_s4, desc: t.landing_s4d },
    { n: '5', title: t.landing_s5, desc: t.landing_s5d },
  ]

  const stats = [
    { to: 10000, suffix: '+', label: t.landing_stat_users },
    { to: 50,    suffix: '+', label: t.landing_stat_prof  },
    { to: 95,    suffix: '%', label: t.landing_stat_happy },
  ]

  return (
    <div style={{ background: c.bg, minHeight: '100vh', color: c.text, transition: 'background .3s, color .3s' }}>
      <Navbar />

      {/* ══ HERO ════════════════════════════════════════════════ */}
      <section style={{ position: 'relative', overflow: 'hidden' }}>

        {/* Glow blobs */}
        <div style={{ position:'absolute', top:-80, left:'10%', width:600, height:600, borderRadius:'50%', pointerEvents:'none',
          background: isDark ? 'radial-gradient(ellipse, rgba(124,58,237,0.32) 0%, transparent 70%)' : 'radial-gradient(ellipse, rgba(124,58,237,0.18) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', top:120, right:'5%', width:480, height:480, borderRadius:'50%', pointerEvents:'none',
          background: isDark ? 'radial-gradient(ellipse, rgba(13,148,136,0.22) 0%, transparent 70%)' : 'radial-gradient(ellipse, rgba(13,148,136,0.14) 0%, transparent 70%)' }} />
        <div style={{ position:'absolute', bottom:-40, left:'40%', width:360, height:360, borderRadius:'50%', pointerEvents:'none',
          background: isDark ? 'radial-gradient(ellipse, rgba(147,51,234,0.18) 0%, transparent 70%)' : 'radial-gradient(ellipse, rgba(147,51,234,0.1) 0%, transparent 70%)' }} />

        <div className="hero-section-pad" style={{ maxWidth:1152, margin:'0 auto', padding:'80px 24px 100px', position:'relative' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:64, alignItems:'center' }} className="hero-grid">

            {/* Left */}
            <div className="hero-left">
              {/* Badge */}
              <motion.div {...fu(0)} style={{ display:'inline-flex', alignItems:'center', gap:8, marginBottom:28 }}>
                <div className="glass" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'8px 16px', borderRadius:999 }}>
                  <span style={{ color:'#a78bfa', fontSize:14 }}>✦</span>
                  <span style={{ fontSize:13, fontWeight:600, color: c.textDim }}>
                    {lang==='tj' ? 'Платформаи №1 барои касб дар Тоҷикистон' : 'Платформа №1 для карьеры в Таджикистане'}
                  </span>
                </div>
              </motion.div>

              {/* Heading */}
              <motion.h1 {...fu(0.08)} style={{
                fontSize:'clamp(36px,5vw,60px)', fontWeight:900, lineHeight:1.1,
                letterSpacing:'-0.03em', color: c.text, margin:'0 0 16px',
                minHeight:'3.5em',
              }}>
                {lang==='tj' ? 'Кореро пайдо кун,' : 'Найди работу,'}
                <br />
                <Typewriter lang={lang} />
              </motion.h1>

              {/* Subtitle */}
              <motion.p {...fu(0.16)} style={{
                fontSize:17, lineHeight:1.7, margin:'0 0 36px',
                color: c.textDim, maxWidth:480,
              }}>
                {t.landing_sub}
              </motion.p>

              {/* CTAs */}
              <motion.div {...fu(0.22)} className="hero-ctas" style={{ display:'flex', flexWrap:'wrap', gap:12, marginBottom:48 }}>
                <button onClick={() => navigate('/quiz')} className="btn-primary">
                  <Sparkles size={16} />
                  {t.landing_cta}
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => navigate('/dashboard')} className="btn-ghost">
                  {t.landing_demo}
                </button>
              </motion.div>

              {/* Stats */}
              <motion.div {...fu(0.3)} className="stats-row" style={{
                display:'flex', gap:32, paddingTop:24,
                borderTop:`1px solid ${c.statBorder}`,
              }}>
                {stats.map(s => (
                  <div key={s.label}>
                    <div className="stat-val" style={{ fontSize:26, fontWeight:900, color:c.text, letterSpacing:'-0.03em' }}>
                      <CountUp to={s.to} suffix={s.suffix} />
                    </div>
                    <div className="stat-lbl" style={{ fontSize:12, color:c.textFaint, marginTop:2, fontWeight:500 }}>{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right — glass card */}
            <motion.div {...fu(0.18)} className="hero-card-wrap" style={{ display:'flex', justifyContent:'center' }}>
              <div className="glass-s animate-float" style={{ borderRadius:24, overflow:'hidden', width:'100%', maxWidth:380 }}>

                {/* Card header */}
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  padding:'14px 18px', borderBottom:`1px solid ${c.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:28, height:28, borderRadius:8, background:'linear-gradient(135deg,#7c3aed,#0d9488)',
                      display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:900, color:'#fff' }}>КФ</div>
                    <span style={{ fontSize:13, fontWeight:800, color:c.text }}>КОРФАҲМ</span>
                  </div>
                  <div style={{ display:'flex', gap:5 }}>
                    {['#f87171','#fbbf24','#34d399'].map(col => (
                      <div key={col} style={{ width:10, height:10, borderRadius:'50%', background:col }} />
                    ))}
                  </div>
                </div>

                {/* Card body */}
                <div style={{ padding:'16px 18px' }}>
                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
                    color:c.textFaint, marginBottom:12 }}>
                    {lang==='tj' ? 'Натиҷаи шумо' : 'Ваш результат'}
                  </div>

                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:8, marginBottom:16 }}>
                    {[
                      { val:'94', label:'IQ Score' },
                      { val:'5',  label: lang==='tj' ? 'Касб' : 'Профессий' },
                      { val:'98%',label: lang==='tj' ? 'Мувофиқ' : 'Совпадение' },
                    ].map(s => (
                      <div key={s.label} style={{ borderRadius:14, padding:'10px 8px', textAlign:'center',
                        background:'rgba(124,58,237,0.14)', border:'1px solid rgba(124,58,237,0.28)' }}>
                        <div className="grad-violet" style={{ fontSize:18, fontWeight:900, display:'block' }}>{s.val}</div>
                        <div style={{ fontSize:9, color:c.textFaint, marginTop:2, fontWeight:600 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase',
                    color:c.textFaint, marginBottom:10 }}>
                    {lang==='tj' ? 'Касбҳои мувофиқ' : 'Подходящие профессии'}
                  </div>

                  <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                    {[
                      { name:'Frontend-разработчик', match:'98%', color:'#7c3aed' },
                      { name:'UX/UI Дизайнер',       match:'92%', color:'#0d9488' },
                      { name:'Data Analyst',          match:'87%', color:'#9333ea' },
                    ].map(item => (
                      <div key={item.name} style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                        padding:'10px 12px', borderRadius:12, background:c.cardBg }}>
                        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                          <div style={{ width:7, height:7, borderRadius:'50%', background:item.color, flexShrink:0 }} />
                          <span style={{ fontSize:12, fontWeight:600, color:c.text }}>{item.name}</span>
                        </div>
                        <span style={{ fontSize:11, fontWeight:800, color:item.color }}>{item.match}</span>
                      </div>
                    ))}
                  </div>

                  <button onClick={() => navigate('/quiz')} style={{
                    marginTop:14, width:'100%', padding:'12px', borderRadius:14, border:'none', cursor:'pointer',
                    background:'linear-gradient(135deg,#7c3aed,#0d9488)',
                    fontSize:13, fontWeight:700, color:'#fff', transition:'opacity .18s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity='1'}
                  >{t.landing_cta} →</button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════ */}
      <section className="sec-pad" style={{ padding:'80px 24px', borderTop:`1px solid ${c.border}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            transition={{ duration:0.5 }} viewport={{ once:true }}
            style={{ textAlign:'center', marginBottom:48 }}>
            <p className="section-label" style={{ marginBottom:12 }}>✦ {lang==='tj' ? 'ИМКОНИЯТҲО' : 'ВОЗМОЖНОСТИ'}</p>
            <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, color:c.text, margin:'0 0 12px', letterSpacing:'-0.025em' }}>
              {t.landing_how}
            </h2>
            <p style={{ fontSize:16, color:c.textDim, maxWidth:420, margin:'0 auto' }}>
              {lang==='tj' ? 'Чор самт барои сохтани касби шумо' : 'Четыре направления для построения вашей карьеры'}
            </p>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(240px, 1fr))', gap:16 }}>
            {features.map((f, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                transition={{ duration:0.45, delay:i*0.08 }} viewport={{ once:true }}
                className="glass card-lift"
                style={{ borderRadius:20, padding:'24px 22px' }}>
                <div style={{ width:46, height:46, borderRadius:14, marginBottom:18,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background:`rgba(${f.rgb},0.14)`, border:`1px solid rgba(${f.rgb},0.28)` }}>
                  <f.icon size={22} style={{ color:f.color }} />
                </div>
                <h3 style={{ fontSize:15, fontWeight:700, color:c.text, margin:'0 0 8px' }}>{f.title}</h3>
                <p style={{ fontSize:13, color:c.textDim, lineHeight:1.65, margin:0 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STEPS ═══════════════════════════════════════════════ */}
      <section className="sec-pad" style={{ padding:'80px 24px', borderTop:`1px solid ${c.border}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            transition={{ duration:0.5 }} viewport={{ once:true }}
            className="sec-head" style={{ textAlign:'center', marginBottom:56 }}>
            <p className="section-label" style={{ marginBottom:12 }}>✦ {lang==='tj' ? 'РОҲ БА МУВАФФАҚИЯТ' : 'ПУТЬ К УСПЕХУ'}</p>
            <h2 style={{ fontSize:'clamp(28px,4vw,42px)', fontWeight:900, color:c.text, margin:0, letterSpacing:'-0.025em' }}>
              {t.landing_steps_title}
            </h2>
          </motion.div>

          <div style={{ display:'flex', alignItems:'flex-start', gap:0 }} className="steps-row">
            {steps.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
                transition={{ duration:0.4, delay:i*0.09 }} viewport={{ once:true }}
                className="step-item"
                style={{ flex:1, display:'flex', alignItems:'flex-start', position:'relative' }}>
                {i < steps.length - 1 && (
                  <div className="step-connector" style={{ position:'absolute', top:20, left:'50%', width:'100%', height:1,
                    background:'linear-gradient(90deg, rgba(124,58,237,0.4), rgba(13,148,136,0.2))', zIndex:0 }} />
                )}
                <div style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', flex:1, position:'relative', zIndex:1 }}>
                  <div className="step-circle" style={{ width:40, height:40, borderRadius:'50%', marginBottom:14, flexShrink:0,
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontWeight:900, fontSize:16, color:'#fff',
                    background:'linear-gradient(135deg,#7c3aed,#0d9488)',
                    boxShadow:'0 0 20px rgba(124,58,237,0.4)' }}>{step.n}</div>
                  <div style={{ fontSize:13, fontWeight:700, color:c.text, marginBottom:4 }}>{step.title}</div>
                  <div style={{ fontSize:11, color:c.textFaint, lineHeight:1.5 }}>{step.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ VACANCIES ═══════════════════════════════════════════ */}
      <section className="sec-pad" style={{ padding:'80px 24px', borderTop:`1px solid ${c.border}` }}>
        <div style={{ maxWidth:1152, margin:'0 auto' }}>

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
            transition={{ duration:0.5 }} viewport={{ once:true }}
            style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:36, flexWrap:'wrap', gap:16 }}>
            <div>
              <p className="section-label" style={{ marginBottom:10 }}>✦ {lang==='tj' ? 'ВАКАНСИЯҲО' : 'ВАКАНСИИ'}</p>
              <h2 style={{ fontSize:'clamp(26px,3.5vw,38px)', fontWeight:900, color:c.text, margin:'0 0 6px', letterSpacing:'-0.025em' }}>
                {lang==='tj' ? 'Вазифаҳои кории имрӯза' : 'Актуальные вакансии'}
              </h2>
              <p style={{ fontSize:14, color:c.textFaint, margin:0 }}>
                {lang==='tj' ? 'Бидуни санҷиш тавонед вазифаҳоро бинед' : 'Смотрите без прохождения теста'}
              </p>
            </div>
            <button onClick={() => navigate('/vacancies')} style={{
              display:'flex', alignItems:'center', gap:6, background:'none', border:'none', cursor:'pointer',
              fontSize:14, fontWeight:700, color:'#0d9488', transition:'opacity .18s',
            }}
              onMouseEnter={e => e.currentTarget.style.opacity='0.7'}
              onMouseLeave={e => e.currentTarget.style.opacity='1'}
            >
              {lang==='tj' ? 'Ҳамаи вакансияҳо' : 'Все вакансии'}
              <ArrowRight size={15} />
            </button>
          </motion.div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))', gap:14 }}>
            {vacancies.map((v, i) => (
              <motion.div key={v.id}
                initial={{ opacity:0, y:22 }} whileInView={{ opacity:1, y:0 }}
                transition={{ duration:0.42, delay:i*0.08 }} viewport={{ once:true }}
                className="glass card-lift"
                style={{ borderRadius:20, padding:'20px' }}>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ width:40, height:40, borderRadius:12,
                    background:'linear-gradient(135deg,#0d9488,#2dd4bf)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    fontSize:16, fontWeight:900, color:'#fff',
                    boxShadow:'0 4px 14px rgba(13,148,136,0.3)' }}>
                    {v.company.charAt(0)}
                  </div>
                  <span style={{
                    fontSize:10, fontWeight:700, padding:'4px 10px', borderRadius:999,
                    background: v.type==='Remote' ? 'rgba(167,139,250,0.15)' : v.type==='Гибрид' ? 'rgba(251,191,36,0.12)' : 'rgba(96,165,250,0.12)',
                    border: v.type==='Remote' ? '1px solid rgba(167,139,250,0.3)' : v.type==='Гибрид' ? '1px solid rgba(251,191,36,0.25)' : '1px solid rgba(96,165,250,0.25)',
                    color: v.type==='Remote' ? '#7c3aed' : v.type==='Гибрид' ? '#d97706' : '#2563eb',
                  }}>{v.type}</span>
                </div>

                <div style={{ marginBottom:10 }}>
                  <p style={{ fontSize:14, fontWeight:700, color:c.text, margin:'0 0 4px' }}>{v.position}</p>
                  <div style={{ display:'flex', alignItems:'center', gap:5 }}>
                    <Building2 size={11} style={{ color:c.textFaint }} />
                    <span style={{ fontSize:12, color:c.textDim }}>{v.company}</span>
                  </div>
                </div>

                <p style={{ fontSize:12, color:c.textDim, lineHeight:1.55, margin:'0 0 14px',
                  overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>
                  {v.description}
                </p>

                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between',
                  paddingTop:12, borderTop:`1px solid ${c.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', gap:4 }}>
                    <MapPin size={11} style={{ color:c.textFaint }} />
                    <span style={{ fontSize:11, color:c.textFaint }}>{v.city}</span>
                  </div>
                  <span style={{ fontSize:13, fontWeight:800, color:'#0d9488' }}>
                    {v.salary} {lang==='tj' ? 'сомонӣ' : 'сом'}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>

          <div style={{ textAlign:'center', marginTop:36 }}>
            <button onClick={() => navigate('/vacancies')} className="btn-primary" style={{ fontSize:14 }}>
              <Briefcase size={16} />
              {lang==='tj' ? 'Ҳамаи вакансияҳоро бин' : 'Смотреть все вакансии'}
            </button>
          </div>
        </div>
      </section>

      {/* ══ CTA ═════════════════════════════════════════════════ */}
      <section className="sec-pad" style={{ padding:'80px 24px 100px' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <motion.div initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
            transition={{ duration:0.55 }} viewport={{ once:true }}
            className="glass-s cta-card"
            style={{ borderRadius:28, padding:'56px 40px', textAlign:'center', position:'relative', overflow:'hidden' }}>

            <div style={{ position:'absolute', top:-60, left:'50%', transform:'translateX(-50%)',
              width:400, height:300, borderRadius:'50%', pointerEvents:'none',
              background:'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)' }} />

            <div style={{ position:'relative' }}>
              <div style={{ width:56, height:56, borderRadius:16, margin:'0 auto 20px',
                background:'linear-gradient(135deg,#7c3aed,#0d9488)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 8px 24px rgba(124,58,237,0.35)' }}>
                <Sparkles size={26} color="#fff" />
              </div>
              <h2 style={{ fontSize:'clamp(24px,3.5vw,36px)', fontWeight:900, color:c.text, margin:'0 0 12px', letterSpacing:'-0.025em' }}>
                {t.landing_cta2_title}
              </h2>
              <p style={{ fontSize:16, color:c.textDim, margin:'0 0 32px', lineHeight:1.65 }}>
                {t.landing_cta2_sub}
              </p>
              <button onClick={() => navigate('/quiz')} className="btn-primary" style={{ fontSize:16, padding:'16px 36px' }}>
                <Sparkles size={18} />
                {t.landing_cta2_btn}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════ */}
      <footer style={{ textAlign:'center', padding:'24px', fontSize:13,
        color:c.footer, fontWeight:500, borderTop:`1px solid ${c.border}` }}>
        © 2026 КОРФАҲМ · Душанбе, Тоҷикистон
      </footer>

      <style>{`
        /* ─ hero ─ */
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .hero-card-wrap { display: none !important; }
          .hero-left { text-align: center !important; align-items: center !important; display: flex !important; flex-direction: column !important; }
          .hero-left h1, .hero-left p { text-align: center !important; }
          .hero-left .stats-row { justify-content: center !important; }
          .hero-ctas { justify-content: center !important; }
        }
        @media (max-width: 640px) {
          .hero-section-pad { padding: 44px 16px 60px !important; }
          .hero-left { align-items: center !important; }
        }

        /* ─ sections ─ */
        @media (max-width: 768px) {
          .sec-pad { padding-top: 52px !important; padding-bottom: 52px !important; padding-left: 16px !important; padding-right: 16px !important; }
        }
        @media (max-width: 480px) {
          .sec-pad { padding-top: 40px !important; padding-bottom: 40px !important; }
        }

        /* ─ stats ─ */
        @media (max-width: 480px) {
          .stats-row { gap: 18px !important; padding-top: 18px !important; }
          .stat-val  { font-size: 20px !important; }
          .stat-lbl  { font-size: 10px !important; }
        }

        /* ─ steps ─ */
        @media (max-width: 640px) {
          .steps-row      { flex-direction: column !important; gap: 16px !important; align-items: stretch !important; }
          .step-connector { display: none !important; }
          .step-item      { flex-direction: row !important; text-align: left !important; gap: 14px !important; align-items: flex-start !important; }
          .step-circle    { margin-bottom: 0 !important; flex-shrink: 0 !important; }
        }

        /* ─ cta card ─ */
        @media (max-width: 640px) {
          .cta-card { padding: 36px 20px !important; border-radius: 20px !important; }
        }

        /* ─ btns ─ */
        @media (max-width: 420px) {
          .btn-primary { padding: 12px 18px !important; font-size: 13px !important; }
          .btn-ghost   { padding: 12px 14px !important; font-size: 13px !important; }
          .hero-ctas   { flex-direction: column !important; gap: 10px !important; }
          .hero-ctas button { width: 100% !important; justify-content: center !important; }
        }

        /* ─ section headings ─ */
        @media (max-width: 480px) {
          .sec-head { margin-bottom: 28px !important; }
        }

        /* ─ mobile centering (global) ─ */
        @media (max-width: 640px) {
          .sec-head { text-align: center !important; }
          .stats-row { justify-content: space-around !important; flex-wrap: wrap !important; gap: 16px !important; }
          .stats-row > div { text-align: center !important; }
          .hero-ctas { justify-content: center !important; }
        }
      `}</style>
    </div>
  )
}
