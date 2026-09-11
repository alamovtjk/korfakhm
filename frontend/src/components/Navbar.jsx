import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, Sun, Moon } from 'lucide-react'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../contexts/AuthContext'
import { useTheme } from '../contexts/ThemeContext'

export default function Navbar() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { lang, setLanguage, t } = useLang()
  const { isDark, toggle } = useTheme()
  const { user, logout } = useAuth()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [userOpen,   setUserOpen]   = useState(false)
  const userRef = useRef(null)

  useEffect(() => {
    function handler(e) {
      if (userRef.current && !userRef.current.contains(e.target)) setUserOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const navLinks = [
    { label: t.nav_start,                                          path: '/quiz'        },
    { label: lang === 'tj' ? 'Санҷиши IQ'   : 'IQ-тест',          path: '/iq'          },
    { label: lang === 'tj' ? 'Вакансияҳо'   : 'Вакансии',         path: '/vacancies'   },
    { label: t.nav_dashboard,                                      path: '/dashboard'   },
  ]

  const active = location.pathname

  /* Theme-aware color shortcuts */
  const text         = isDark ? 'rgba(255,255,255,0.94)' : '#1a1535'
  const textDim      = isDark ? 'rgba(255,255,255,0.5)'  : 'rgba(26,21,53,0.5)'
  const textDimHov   = isDark ? 'rgba(255,255,255,0.9)'  : '#1a1535'
  const borderClr    = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(100,80,200,0.18)'
  const bgCtrl       = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(124,58,237,0.07)'
  const bgCtrlHov    = isDark ? 'rgba(255,255,255,0.13)' : 'rgba(124,58,237,0.14)'
  const pillBg       = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.08)'
  const pillBorder   = isDark ? 'rgba(255,255,255,0.1)'  : 'rgba(100,80,200,0.18)'

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: isDark ? 'rgba(6,6,15,0.85)' : 'rgba(245,244,255,0.92)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      borderBottom: `1px solid ${borderClr}`,
      transition: 'background .3s, border-color .3s',
    }}>
      <div style={{ maxWidth: 1152, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

          {/* ── Logo ── */}
          <button onClick={() => navigate('/')} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'none', border: 'none', cursor: 'pointer', padding: 0,
          }}>
            <div style={{
              width: 34, height: 34, borderRadius: 10,
              background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em',
            }}>КФ</div>
            <span style={{ fontWeight: 900, fontSize: 18, color: text, letterSpacing: '-0.02em' }}>
              КОР<span style={{
                background: 'linear-gradient(135deg, #a78bfa, #2dd4bf)',
                WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent',
              }}>ФАҲМ</span>
            </span>
          </button>

          {/* ── Desktop nav links ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2 }} className="hidden-mobile">
            {navLinks.map(link => (
              <button key={link.path} onClick={() => navigate(link.path)} style={{
                background: active === link.path
                  ? (isDark ? 'rgba(255,255,255,0.09)' : 'rgba(124,58,237,0.1)')
                  : 'none',
                border: 'none', cursor: 'pointer',
                padding: '8px 16px', borderRadius: 12,
                fontSize: 14, fontWeight: 600,
                color: active === link.path
                  ? (isDark ? 'rgba(255,255,255,0.95)' : '#5b21b6')
                  : textDim,
                transition: 'color .18s, background .18s',
              }}
                onMouseEnter={e => { if (active !== link.path) e.currentTarget.style.color = textDimHov }}
                onMouseLeave={e => { if (active !== link.path) e.currentTarget.style.color = textDim }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* ── Right controls ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }} className="hidden-mobile">

            {/* Theme toggle */}
            <button onClick={toggle} title={isDark ? 'Светлая тема' : 'Тёмная тема'} style={{
              width: 36, height: 36, borderRadius: 10,
              border: `1px solid ${borderClr}`,
              background: bgCtrl, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: isDark ? '#fbbf24' : '#7c3aed',
              transition: 'all .18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = bgCtrlHov }}
              onMouseLeave={e => { e.currentTarget.style.background = bgCtrl }}
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </button>

            {/* Lang pills */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 3, padding: 4,
              borderRadius: 12,
              background: pillBg,
              border: `1px solid ${pillBorder}`,
            }}>
              {['ru', 'tj'].map(l => (
                <button key={l} onClick={() => setLanguage(l)} style={{
                  padding: '4px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
                  fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                  background: lang === l ? 'rgba(124,58,237,0.65)' : 'transparent',
                  color: lang === l ? '#fff' : textDim,
                  transition: 'all .18s',
                }}>{l}</button>
              ))}
            </div>

            {/* Post vacancy */}
            <button onClick={() => navigate('/post-vacancy')} style={{
              padding: '8px 16px', borderRadius: 12,
              border: `1px solid ${borderClr}`,
              background: bgCtrl, backdropFilter: 'blur(12px)',
              fontSize: 13, fontWeight: 700, color: textDim,
              cursor: 'pointer', transition: 'all .18s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.background = bgCtrlHov }}
              onMouseLeave={e => { e.currentTarget.style.color = textDim; e.currentTarget.style.background = bgCtrl }}
            >
              {lang === 'tj' ? 'Вакансия' : 'Разместить вакансию'}
            </button>

            {/* User avatar or login */}
            {user ? (
              <div ref={userRef} style={{ position: 'relative' }}>
                <button onClick={() => setUserOpen(o => !o)} style={{
                  width: 36, height: 36, borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
                  fontSize: 14, fontWeight: 800, color: '#fff',
                }}>
                  {user.name?.charAt(0)?.toUpperCase() || '?'}
                </button>
                {userOpen && (
                  <div style={{
                    position: 'absolute', right: 0, top: 'calc(100% + 8px)',
                    width: 180, borderRadius: 16, overflow: 'hidden', zIndex: 100,
                    background: isDark ? 'rgba(12,8,28,0.96)' : 'rgba(255,254,255,0.98)',
                    border: `1px solid ${borderClr}`,
                    backdropFilter: 'blur(24px)',
                    boxShadow: isDark ? '0 20px 60px rgba(0,0,0,0.5)' : '0 20px 60px rgba(100,80,200,0.15)',
                  }}>
                    <div style={{ padding: '12px 16px', borderBottom: `1px solid ${borderClr}` }}>
                      <div style={{ fontSize: 11, color: textDim, marginBottom: 2 }}>Аккаунт</div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                    </div>
                    {[
                      { label: 'Дашборд', action: () => { navigate('/dashboard'); setUserOpen(false) } },
                      { label: 'Мои вакансии', action: () => { navigate('/my-vacancies'); setUserOpen(false) } },
                    ].map(item => (
                      <button key={item.label} onClick={item.action} style={{
                        width: '100%', padding: '10px 16px', border: 'none', background: 'none',
                        textAlign: 'left', fontSize: 13, fontWeight: 600,
                        color: textDim, cursor: 'pointer', transition: 'all .15s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = bgCtrlHov; e.currentTarget.style.color = text }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = textDim }}
                      >{item.label}</button>
                    ))}
                    <button onClick={() => { logout(); setUserOpen(false) }} style={{
                      width: '100%', padding: '10px 16px', border: 'none', background: 'none',
                      textAlign: 'left', fontSize: 13, fontWeight: 600,
                      color: 'rgba(239,68,68,0.85)', cursor: 'pointer', transition: 'all .15s',
                    }}
                      onMouseEnter={e => { e.currentTarget.style.background = bgCtrlHov }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'none' }}
                    >Выйти</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => navigate('/auth')} style={{
                padding: '8px 20px', borderRadius: 12, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
                fontSize: 13, fontWeight: 700, color: '#fff',
                transition: 'opacity .18s, transform .18s',
              }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'none' }}
              >
                {lang === 'tj' ? 'Дохил шудан' : 'Войти'}
              </button>
            )}
          </div>

          {/* ── Mobile burger ── */}
          <button onClick={() => setMobileOpen(o => !o)} style={{
            display: 'none', padding: 8, borderRadius: 10,
            border: `1px solid ${borderClr}`,
            background: bgCtrl, cursor: 'pointer', color: text,
          }} className="show-mobile">
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile menu ── */}
        {mobileOpen && (
          <div style={{ paddingBottom: 16 }}>
            {navLinks.map(link => (
              <button key={link.path} onClick={() => { navigate(link.path); setMobileOpen(false) }} style={{
                display: 'block', width: '100%', padding: '12px 16px',
                marginBottom: 4, borderRadius: 12, border: 'none', cursor: 'pointer',
                textAlign: 'left', fontSize: 14, fontWeight: 600,
                background: active === link.path ? 'rgba(124,58,237,0.15)' : 'transparent',
                color: active === link.path ? '#7c3aed' : textDim,
              }}>{link.label}</button>
            ))}
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              {['ru', 'tj'].map(l => (
                <button key={l} onClick={() => setLanguage(l)} style={{
                  flex: 1, padding: '10px', borderRadius: 10, cursor: 'pointer',
                  border: `1px solid ${borderClr}`,
                  background: lang === l ? 'rgba(124,58,237,0.5)' : bgCtrl,
                  color: lang === l ? '#fff' : textDim,
                  fontSize: 12, fontWeight: 700, textTransform: 'uppercase',
                }}>{l}</button>
              ))}
              <button onClick={toggle} style={{
                padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                border: `1px solid ${borderClr}`,
                background: bgCtrl,
                color: isDark ? '#fbbf24' : '#7c3aed',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {isDark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
            </div>
            <button onClick={() => { navigate('/auth'); setMobileOpen(false) }} style={{
              display: 'block', width: '100%', marginTop: 8, padding: '12px',
              borderRadius: 12, border: 'none', cursor: 'pointer',
              background: 'linear-gradient(135deg, #7c3aed, #0d9488)',
              fontSize: 14, fontWeight: 700, color: '#fff',
            }}>
              {lang === 'tj' ? 'Дохил шудан' : 'Войти'}
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hidden-mobile { display: none !important; }
          .show-mobile   { display: flex !important; }
        }
        @media (min-width: 769px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </nav>
  )
}
