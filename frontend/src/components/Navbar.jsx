import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate, useLocation } from 'react-router-dom'
import { ArrowRight, ArrowUp } from 'lucide-react'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../contexts/AuthContext'

const LANGS  = ['ru', 'tj']
const LABELS = { ru: 'РУ', tj: 'ТҶ' }

/* Логотип: градиентный квадрат + «КОРФАҲМ» с переливом на второй части */
export function Brand({ onClick }) {
  return (
    <button className="brand" onClick={onClick} aria-label="КОРФАҲМ">
      <span className="mark">КФ</span>
      <span>КОР<i>ФАҲМ</i></span>
    </button>
  )
}

function LangSwitch({ lang, setLanguage }) {
  const idx = LANGS.indexOf(lang)
  return (
    <div className="lang" role="tablist" style={{ ['--n']: LANGS.length }}>
      <span className="pill" style={{ left: `calc(5px + ${idx} * ((100% - 10px) / ${LANGS.length}))` }} />
      {LANGS.map(l => (
        <button key={l} className={lang === l ? 'active' : ''} onClick={() => setLanguage(l)}>
          {LABELS[l]}
        </button>
      ))}
    </div>
  )
}

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { lang, setLanguage, t } = useLang()
  const { user, logout } = useAuth()

  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [toTop,    setToTop]    = useState(false)
  const userRef = useRef(null)
  const barRef  = useRef(null)

  /* Полоса прогресса — transform на своём узле, без setState на каждый кадр */
  useEffect(() => {
    let ticking = false
    let total = 0
    const measure = () => {
      const doc = document.documentElement
      total = doc.scrollHeight - doc.clientHeight
    }
    const apply = () => {
      ticking = false
      const y = window.scrollY
      setScrolled(y > 40)
      setToTop(y > 600)
      if (barRef.current) barRef.current.style.transform = `scaleX(${total > 0 ? y / total : 0})`
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(apply)
    }
    measure(); apply()
    const ro = new ResizeObserver(measure)
    ro.observe(document.documentElement)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); ro.disconnect() }
  }, [])

  useEffect(() => {
    function handler(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  /* drawer: ESC закрывает, скролл блокируется */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    if (open) document.addEventListener('keydown', onKey)
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [open])

  const navLinks = [
    { label: t.nav_start,                                     path: '/quiz'      },
    { label: lang === 'tj' ? 'Санҷиши IQ' : 'IQ-тест',        path: '/iq'        },
    { label: lang === 'tj' ? 'Вакансияҳо' : 'Вакансии',       path: '/vacancies' },
    { label: t.nav_dashboard,                                 path: '/dashboard' },
  ]
  const active = location.pathname
  const go = (path) => { setOpen(false); setUserOpen(false); navigate(path) }

  const loginLabel   = lang === 'tj' ? 'Дохил шудан' : 'Войти'
  const vacancyLabel = lang === 'tj' ? 'Вакансия гузоштан' : 'Разместить вакансию'

  return (
    <>
      <div className="progress" ref={barRef} />

      <header className={`header${scrolled ? ' scrolled' : ''}`}>
        <div className="nav">
          <Brand onClick={() => go('/')} />

          <nav className="nav-links">
            {navLinks.map(link => (
              <button key={link.path} className={active === link.path ? 'active' : ''} onClick={() => go(link.path)}>
                {link.label}
              </button>
            ))}
          </nav>

          <div className="nav-right">
            <LangSwitch lang={lang} setLanguage={setLanguage} />

            <button className="btn btn-ghost nav-ghost" onClick={() => go('/post-vacancy')}>
              {vacancyLabel}
            </button>

            {user ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button className="avatar-btn" onClick={() => setUserOpen(o => !o)}>
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </button>
                {userOpen && (
                  <div className="user-menu">
                    <div className="um-head">
                      <small>{lang === 'tj' ? 'Ҳисоб' : 'Аккаунт'}</small>
                      <b>{user.name}</b>
                    </div>
                    <button onClick={() => go('/dashboard')}>{lang === 'tj' ? 'Кабинет' : 'Дашборд'}</button>
                    <button onClick={() => go('/my-vacancies')}>{lang === 'tj' ? 'Вакансияҳои ман' : 'Мои вакансии'}</button>
                    <button className="danger" onClick={() => { logout(); setUserOpen(false) }}>
                      {lang === 'tj' ? 'Баромад' : 'Выйти'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-primary nav-cta" onClick={() => go('/auth')}>
                {loginLabel}
              </button>
            )}

            <button className={`burger${open ? ' open' : ''}`} onClick={() => setOpen(!open)} aria-label="Menu">
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню — порталом в body, чтобы быть поверх шапки и чат-виджета */}
      {createPortal(<>
      <div className={`scrim${open ? ' show' : ''}`} onClick={() => setOpen(false)} />
      <div className={`drawer${open ? ' open' : ''}`}>
        <div className="drawer-head">
          <span className="drawer-eyebrow">{lang === 'tj' ? 'Навигатсия' : 'Навигация'}</span>
          <button className="drawer-close" onClick={() => setOpen(false)} aria-label="Закрыть">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" />
            </svg>
          </button>
        </div>

        <nav className="drawer-nav">
          {navLinks.map(link => (
            <button key={link.path} className={`drawer-link${active === link.path ? ' active' : ''}`} onClick={() => go(link.path)}>
              {link.label}
            </button>
          ))}
          <button className="drawer-link" onClick={() => go('/post-vacancy')}>{vacancyLabel}</button>
          {user && (
            <button className="drawer-link" onClick={() => go('/my-vacancies')}>
              {lang === 'tj' ? 'Вакансияҳои ман' : 'Мои вакансии'}
            </button>
          )}
        </nav>

        <div className="drawer-cta-wrap">
          {user ? (
            <button className="btn btn-ghost drawer-cta-btn" onClick={() => { logout(); setOpen(false) }}>
              {lang === 'tj' ? 'Баромад' : 'Выйти'} · {user.name}
            </button>
          ) : (
            <button className="btn btn-primary drawer-cta-btn" onClick={() => go('/auth')}>
              {loginLabel} <ArrowRight />
            </button>
          )}
        </div>

        <div className="drawer-foot">
          <span className="drawer-foot-label">{lang === 'tj' ? 'Забон' : 'Язык'}</span>
          <LangSwitch lang={lang} setLanguage={setLanguage} />
        </div>
      </div>
      </>, document.body)}

      <button className={`totop${toTop ? ' show' : ''}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Наверх">
        <ArrowUp size={18} />
      </button>
    </>
  )
}
