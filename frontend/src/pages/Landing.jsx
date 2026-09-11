import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import { Brain, Target, TrendingUp, MapPin, ArrowRight, Sparkles, Briefcase, Building2, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useLang } from '../contexts/LangContext'
import { vacancyService } from '../services/vacancyService'

/* ── Печатающаяся вторая строка заголовка ─────────────────── */
const PHRASES = {
  ru: ['которая тебе по душе', 'о которой ты мечтал', 'с высокой зарплатой', 'в Таджикистане'],
  tj: ['ки ба дилат мувофиқ аст', 'ки орзуи ту буд', 'бо маоши баланд', 'дар Тоҷикистон'],
}
function Typewriter({ lang }) {
  const phrases = PHRASES[lang] || PHRASES.ru
  const [idx, setIdx]   = useState(0)
  const [text, setText] = useState('')
  const [del, setDel]   = useState(false)
  useEffect(() => {
    const full = phrases[idx]; let t
    if (!del && text.length < full.length)        t = setTimeout(() => setText(full.slice(0, text.length + 1)), 52)
    else if (!del && text.length === full.length) t = setTimeout(() => setDel(true), 1800)
    else if (del && text.length > 0)              t = setTimeout(() => setText(text.slice(0, -1)), 26)
    else { setDel(false); setIdx(i => (i + 1) % phrases.length) }
    return () => clearTimeout(t)
  }, [text, del, idx, phrases])
  return <span className="grad">{text}<span style={{ WebkitTextFillColor: '#a78bfa', color: '#a78bfa' }}>|</span></span>
}

/* ── Счётчик ───────────────────────────────────────────────── */
function CountUp({ to, suffix = '', duration = 1600 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const started = useRef(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        const startTime = performance.now()
        const tick = (now) => {
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * to))
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.6 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration])
  const formatted = count >= 1000
    ? Math.floor(count / 1000) + ' ' + String(count % 1000).padStart(3, '0')
    : String(count)
  return <span ref={ref}>{formatted}{suffix}</span>
}

const fu = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] },
})
const inView = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
})

const TICKER = ['RIASEC-тест', 'IQ-тест', 'Персональный план от ИИ', 'Вакансии Таджикистана', 'Alif Tech', 'IdeaSoft', 'Somon IT', 'МегаФон TJ', 'Бесплатно', 'Ru · Tj']

/* ── Главная ───────────────────────────────────────────────── */
export default function Landing() {
  const navigate    = useNavigate()
  const { t, lang } = useLang()
  const tj = lang === 'tj'

  const vacancies = vacancyService.getPublished().slice(0, 3)

  const features = [
    { icon: Brain,      cls: 's-violet',  title: t.landing_f1_title, desc: t.landing_f1_desc },
    { icon: Target,     cls: 's-teal',    title: t.landing_f2_title, desc: t.landing_f2_desc },
    { icon: TrendingUp, cls: 's-fuchsia', title: t.landing_f3_title, desc: t.landing_f3_desc },
    { icon: MapPin,     cls: 's-blue',    title: t.landing_f4_title, desc: t.landing_f4_desc },
  ]
  const steps = [
    { title: t.landing_s1, desc: t.landing_s1d },
    { title: t.landing_s2, desc: t.landing_s2d },
    { title: t.landing_s3, desc: t.landing_s3d },
    { title: t.landing_s4, desc: t.landing_s4d },
    { title: t.landing_s5, desc: t.landing_s5d },
  ]
  const stats = [
    { to: 10000, suffix: '+', label: t.landing_stat_users },
    { to: 50,    suffix: '+', label: t.landing_stat_prof  },
    { to: 95,    suffix: '%', label: t.landing_stat_happy },
  ]

  return (
    <div className="page">
      <Navbar />

      {/* ══ HERO ══ */}
      <section className="shell">
        <div className="hero-section">
          <div className="hero-copy">
            <motion.div {...fu(0)}>
              <span className="badge">
                <span className="dot" />
                {tj ? 'Платформаи №1 барои касб дар Тоҷикистон' : 'Платформа №1 для карьеры в Таджикистане'}
              </span>
            </motion.div>

            <motion.h1 {...fu(0.08)}>
              {tj ? 'Кореро пайдо кун,' : 'Найди работу,'}
              <br />
              <Typewriter lang={lang} />
            </motion.h1>

            <motion.p {...fu(0.16)} className="sub">{t.landing_sub}</motion.p>

            <motion.div {...fu(0.22)} className="hero-cta">
              <button onClick={() => navigate('/quiz')} className="btn btn-primary">
                <Sparkles /> {t.landing_cta} <ArrowRight />
              </button>
              <button onClick={() => navigate('/dashboard')} className="btn btn-ghost">
                <Play /> {t.landing_demo}
              </button>
            </motion.div>

            <motion.div {...fu(0.3)} className="hero-stats">
              {stats.map(s => (
                <div className="stat" key={s.label}>
                  <div className="num"><CountUp to={s.to} suffix={s.suffix} /></div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Плавающая карточка результата */}
          <motion.div {...fu(0.18)} className="hero-visual">
            <div className="fcard">
              <div className="pbar">
                <span className="d" /><span className="d" /><span className="d" />
                <span className="url">korfakhm.tj/results</span>
              </div>
              <div style={{ padding: '18px 20px 20px' }}>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 12 }}>
                  {tj ? 'Натиҷаи шумо' : 'Ваш результат'}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
                  {[
                    { val: '94',  label: 'IQ Score' },
                    { val: '5',   label: tj ? 'Касб' : 'Профессий' },
                    { val: '98%', label: tj ? 'Мувофиқ' : 'Совпадение' },
                  ].map(s => (
                    <div key={s.label} style={{ borderRadius: 14, padding: '12px 8px', textAlign: 'center', background: 'rgba(124,58,237,.14)', border: '1px solid rgba(124,58,237,.28)' }}>
                      <div className="ub grad" style={{ fontSize: 20, fontWeight: 700 }}>{s.val}</div>
                      <div style={{ fontSize: 10, color: 'var(--text-faint)', marginTop: 3, fontWeight: 600 }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="mono" style={{ fontSize: 10, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-faint)', marginBottom: 10 }}>
                  {tj ? 'Касбҳои мувофиқ' : 'Подходящие профессии'}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {[
                    { name: 'Frontend-разработчик', match: '98%', color: '#a78bfa' },
                    { name: 'UX/UI Дизайнер',       match: '92%', color: '#2dd4bf' },
                    { name: 'Data Analyst',          match: '87%', color: '#f0abfc' },
                  ].map(item => (
                    <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 12, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.07)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ width: 7, height: 7, borderRadius: '50%', background: item.color, boxShadow: `0 0 10px ${item.color}` }} />
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{item.name}</span>
                      </div>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: item.color }}>{item.match}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => navigate('/quiz')} className="btn btn-primary" style={{ marginTop: 16, width: '100%', fontSize: 14, padding: '12px 20px' }}>
                  {t.landing_cta} <ArrowRight />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══ TICKER ══ */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER, ...TICKER].map((s, i) => <span key={i}>{s} ✦</span>)}
        </div>
      </div>

      {/* ══ ВОЗМОЖНОСТИ ══ */}
      <section className="shell section" id="features">
        <motion.div {...inView(0)} className="sec-head" style={{ textAlign: 'center' }}>
          <span className="eyebrow"><span className="line" />{tj ? 'Имкониятҳо' : 'Возможности'}</span>
          <h2 className="sec-title">{t.landing_how}</h2>
          <p className="sec-sub" style={{ margin: '0 auto' }}>
            {tj ? 'Чор самт барои сохтани касби шумо' : 'Четыре направления для построения вашей карьеры'}
          </p>
        </motion.div>

        <div className="svc-grid">
          {features.map((f, i) => (
            <motion.div key={i} {...inView(i * 0.08)} className={`svc ${f.cls}`}>
              <span className="edge" />
              <div className="svc-top">
                <div className="svc-ico"><f.icon size={24} /></div>
                <span className="svc-num">0{i + 1}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ ШАГИ ══ */}
      <section className="shell section" id="process" style={{ paddingTop: 0 }}>
        <div className="proc-grid">
          <motion.div {...inView(0)} className="proc-left">
            <span className="eyebrow"><span className="line" />{tj ? 'Роҳ ба муваффақият' : 'Путь к успеху'}</span>
            <h2 className="sec-title">{t.landing_steps_title}</h2>
            <p>
              {tj
                ? 'Аз санҷиш то нақшаи рушд — панҷ қадам, ки туро ба касби орзуят мебаранд.'
                : 'От теста до плана развития — пять шагов, которые приведут тебя к профессии мечты.'}
            </p>
            <button onClick={() => navigate('/quiz')} className="btn btn-primary">
              <Sparkles /> {t.landing_cta}
            </button>
            <div className="rings">
              <span className="ring r1" /><span className="ring r2" /><span className="ring r3" /><span className="ring r4" />
              <span className="ring-core">AI</span>
            </div>
          </motion.div>

          <div className="steps">
            {steps.map((step, i) => (
              <motion.div key={i} {...inView(i * 0.08)} className={`step p${i + 1}`}>
                <div className="pnum">0{i + 1}</div>
                <div className="step-body">
                  <h4>{step.title}</h4>
                  <p>{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ВАКАНСИИ ══ */}
      <section className="shell section" id="vacancies" style={{ paddingTop: 0 }}>
        <motion.div {...inView(0)} className="sec-head" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <span className="eyebrow"><span className="line" />{tj ? 'Вакансияҳо' : 'Вакансии'}</span>
            <h2 className="sec-title" style={{ marginBottom: 8 }}>{tj ? 'Вазифаҳои кории имрӯза' : 'Актуальные вакансии'}</h2>
            <p className="sec-sub">{tj ? 'Бидуни санҷиш тавонед вазифаҳоро бинед' : 'Смотрите без прохождения теста'}</p>
          </div>
          <button onClick={() => navigate('/vacancies')} className="link-arrow">
            {tj ? 'Ҳамаи вакансияҳо' : 'Все вакансии'} <ArrowRight size={15} />
          </button>
        </motion.div>

        <div className="vac-grid">
          {vacancies.map((v, i) => (
            <motion.div key={v.id} {...inView(i * 0.08)} className="glass card-lift vac">
              <div className="vac-top">
                <div className="vac-logo">{v.company.charAt(0)}</div>
                <span className="chip">{v.type}</span>
              </div>
              <h3>{v.position}</h3>
              <div className="co"><Building2 size={12} /> {v.company}</div>
              <p className="desc">{v.description}</p>
              <div className="vac-foot">
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><MapPin size={11} /> {v.city}</span>
                <b>{v.salary} {tj ? 'сомонӣ' : 'сом'}</b>
              </div>
            </motion.div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button onClick={() => navigate('/vacancies')} className="btn btn-ghost">
            <Briefcase /> {tj ? 'Ҳамаи вакансияҳоро бин' : 'Смотреть все вакансии'}
          </button>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section className="shell section" id="cta" style={{ paddingTop: 0 }}>
        <motion.div {...inView(0)} className="banner">
          <div className="banner-inner">
            <div className="banner-ico"><Sparkles size={26} /></div>
            <h2>{t.landing_cta2_title}</h2>
            <p className="lead">{t.landing_cta2_sub}</p>
            <button onClick={() => navigate('/quiz')} className="btn btn-primary" style={{ fontSize: 16, padding: '15px 32px' }}>
              <Sparkles /> {t.landing_cta2_btn}
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  )
}
