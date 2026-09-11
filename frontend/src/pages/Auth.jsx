import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, LogIn, UserPlus, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../contexts/ThemeContext'
import { useLang } from '../contexts/LangContext'
import { useAuth } from '../contexts/AuthContext'

export default function Auth() {
  const navigate  = useNavigate()
  const location  = useLocation()
  const { isDark } = useTheme()
  const { lang }   = useLang()
  const { register, login } = useAuth()

  const from = location.state?.from || '/'

  const [tab,      setTab]      = useState('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [showPw,   setShowPw]   = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  /* Theme colors */
  const bg       = isDark ? '#06060f'                  : '#f5f4ff'
  const text     = isDark ? 'rgba(255,255,255,0.94)'   : '#1a1535'
  const textDim  = isDark ? 'rgba(255,255,255,0.5)'    : 'rgba(26,21,53,0.55)'
  const border   = isDark ? 'rgba(255,255,255,0.1)'    : 'rgba(100,80,200,0.18)'
  const inpBg    = isDark ? 'rgba(255,255,255,0.05)'   : 'rgba(255,255,255,0.9)'
  const inpBdr   = isDark ? 'rgba(255,255,255,0.1)'    : 'rgba(100,80,200,0.2)'
  const inpFocus = '#7c3aed'

  const T = {
    ru: {
      login: 'Вход', register: 'Регистрация',
      name: 'Ваше имя', email: 'Email', password: 'Пароль',
      login_btn: 'Войти', register_btn: 'Создать аккаунт',
      wrong: 'Неверный email или пароль',
      taken: 'Этот email уже зарегистрирован',
      fill: 'Заполните все поля',
      sub_login:  'Войдите, чтобы публиковать и управлять вакансиями',
      sub_reg:    'Создайте аккаунт и начните размещать вакансии',
      name_ph:    'Алишер Назаров',
      back: '← На главную',
    },
    tj: {
      login: 'Вуруд', register: 'Сабтном',
      name: 'Номи шумо', email: 'Email', password: 'Рамз',
      login_btn: 'Даромадан', register_btn: 'Аккаунт сохтан',
      wrong: 'Email ё рамз нодуруст',
      taken: 'Ин email аллакай сабтном шудааст',
      fill: 'Ҳамаи майдонҳоро пур кунед',
      sub_login:  'Даромадед то вакансияҳоро нашр ва идора кунед',
      sub_reg:    'Аккаунт созед ва вакансия гузоштанро оғоз кунед',
      name_ph:    'Алишер Назаров',
      back: '← Ба саҳифаи асосӣ',
    },
  }
  const t = T[lang] || T.ru

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password.trim() || (tab === 'register' && !name.trim())) {
      setError(t.fill); return
    }
    setLoading(true)

    if (tab === 'login') {
      const res = await login(email.trim(), password)
      if (res?.error) { setError(t.wrong); setLoading(false); return }
    } else {
      const res = await register(name.trim(), email.trim(), password)
      if (res?.error === 'email_taken') { setError(t.taken); setLoading(false); return }
    }

    setLoading(false)
    navigate(from, { replace: true })
  }

  function inputStyle(focused) {
    return {
      width: '100%', padding: '13px 16px', borderRadius: 14,
      border: `1px solid ${focused ? inpFocus : inpBdr}`,
      background: inpBg, color: text, fontSize: 14, fontFamily: 'Manrope, system-ui',
      outline: 'none', transition: 'border-color .18s',
      boxShadow: focused ? `0 0 0 3px rgba(124,58,237,0.15)` : 'none',
    }
  }

  return (
    <div className="page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px' }}>

      {/* Logo */}
      <button onClick={() => navigate('/')} style={{
        display:'flex', alignItems:'center', gap:10, marginBottom:32,
        background:'none', border:'none', cursor:'pointer', position:'relative', zIndex:1,
      }}>
        <img src="/logo-mark.png" alt="" width={40} height={40} style={{
          borderRadius:12, display:'block', objectFit:'contain',
          boxShadow:'0 6px 20px rgba(124,58,237,0.35)',
        }} />
        <span style={{ fontWeight:900, fontSize:22, color:text, fontFamily:'Manrope, system-ui', letterSpacing:'-0.02em' }}>
          КОР
          <span style={{ background:'linear-gradient(135deg,#7c3aed,#0d9488)',
            WebkitBackgroundClip:'text', backgroundClip:'text', color:'transparent' }}>ФАҲМ</span>
        </span>
      </button>

      {/* Card */}
      <motion.div
        initial={{ opacity:0, y:24, scale:0.97 }}
        animate={{ opacity:1, y:0, scale:1 }}
        transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
        className="glass-s"
        style={{ width:'100%', maxWidth:440, borderRadius:28, padding:'32px 28px', position:'relative', zIndex:1 }}
      >
        {/* Tabs */}
        <div style={{ display:'flex', padding:4, borderRadius:18, marginBottom:24,
          background: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(124,58,237,0.07)',
          border: `1px solid ${border}` }}>
          {[['login', <LogIn size={14} />, t.login], ['register', <UserPlus size={14} />, t.register]].map(([key, icon, label]) => (
            <button key={key} onClick={() => { setTab(key); setError('') }} style={{
              flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:7,
              padding:'10px', borderRadius:14, border:'none', cursor:'pointer',
              fontSize:13, fontWeight:700, fontFamily:'Manrope, system-ui', transition:'all .2s',
              background: tab === key ? 'linear-gradient(135deg,#7c3aed,#0d9488)' : 'transparent',
              color: tab === key ? '#fff' : textDim,
              boxShadow: tab === key ? '0 4px 14px rgba(124,58,237,0.3)' : 'none',
            }}>{icon}{label}</button>
          ))}
        </div>

        {/* Subtitle */}
        <p style={{ fontSize:13, color:textDim, textAlign:'center', marginBottom:24, lineHeight:1.6 }}>
          {tab === 'login' ? t.sub_login : t.sub_reg}
        </p>

        <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>

          {/* Name (register only) */}
          <AnimatePresence>
            {tab === 'register' && (
              <motion.div
                initial={{ opacity:0, height:0, marginBottom:0 }}
                animate={{ opacity:1, height:'auto' }}
                exit={{ opacity:0, height:0 }}
                transition={{ duration:0.2 }}
              >
                <label style={{ display:'block', fontSize:12, fontWeight:700, color:textDim, marginBottom:6 }}>{t.name}</label>
                <FocusInput type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder={t.name_ph} style={inputStyle} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Email */}
          <div>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:textDim, marginBottom:6 }}>{t.email}</label>
            <FocusInput type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" autoComplete="email" style={inputStyle} />
          </div>

          {/* Password */}
          <div>
            <label style={{ display:'block', fontSize:12, fontWeight:700, color:textDim, marginBottom:6 }}>{t.password}</label>
            <div style={{ position:'relative' }}>
              <FocusInput type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                style={(f) => ({ ...inputStyle(f), paddingRight:48 })} />
              <button type="button" onClick={() => setShowPw(s => !s)} style={{
                position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                background:'none', border:'none', cursor:'pointer', color:textDim, display:'flex',
              }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                style={{ fontSize:12, color:'#ef4444', background:'rgba(239,68,68,0.1)',
                  border:'1px solid rgba(239,68,68,0.2)', padding:'10px 14px', borderRadius:12 }}
              >{error}</motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <button type="submit" disabled={loading} style={{
            width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:8,
            padding:'15px', borderRadius:16, border:'none', cursor: loading ? 'wait' : 'pointer',
            background:'linear-gradient(135deg,#7c3aed,#0d9488)', color:'#fff',
            fontSize:14, fontWeight:800, fontFamily:'Manrope, system-ui',
            opacity: loading ? 0.7 : 1, transition:'opacity .18s, transform .18s',
            boxShadow:'0 6px 24px rgba(124,58,237,0.35)',
          }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.opacity='0.9' } }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.opacity=loading?'0.7':'1' }}
          >
            {loading ? (
              <div style={{ width:18, height:18, border:'2.5px solid rgba(255,255,255,0.35)',
                borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite' }} />
            ) : (
              <>
                {tab === 'login' ? <LogIn size={16} /> : <Sparkles size={16} />}
                {tab === 'login' ? t.login_btn : t.register_btn}
              </>
            )}
          </button>
        </form>
      </motion.div>

      {/* Back link */}
      <button onClick={() => navigate('/')} style={{
        marginTop:24, fontSize:13, fontWeight:600, color:textDim,
        background:'none', border:'none', cursor:'pointer', transition:'color .18s',
        position:'relative', zIndex:1,
      }}
        onMouseEnter={e => e.currentTarget.style.color = text}
        onMouseLeave={e => e.currentTarget.style.color = textDim}
      >{t.back}</button>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

/* Input that tracks focus state for style */
function FocusInput({ style, ...props }) {
  const [focused, setFocused] = useState(false)
  const s = typeof style === 'function' ? style(focused) : style
  return (
    <input
      {...props}
      style={s}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  )
}
