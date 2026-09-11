import { useEffect } from 'react'

/* Космический фон в стиле alteno.dev: пятна света, туманности (фрактальный
   шум на маленьком холсте), галактики NASA, три слоя звёзд с параллаксом
   и пара летающих тарелок. Рендерится один раз в App поверх body, под
   контентом страниц (z-index 0). */

const GALAXIES = [
  { src: '/space/galaxy-1.webp', x: 13, y: 17, size: 190, rot: -14, op: .55, dur: 260, depth: 1.0 },
  { src: '/space/galaxy-2.webp', x: 79, y: 11, size: 140, rot: 22,  op: .45, dur: 320, depth: 0.6 },
  { src: '/space/galaxy-3.webp', x: 87, y: 63, size: 165, rot: -6,  op: .5,  dur: 290, depth: 0.85 },
  { src: '/space/galaxy-4.webp', x: 21, y: 78, size: 120, rot: 30,  op: .38, dur: 350, depth: 0.45 },
]

const SHIPS = [
  { id: 's1', cls: 'ship-a', hue: '#c4b5fd', glow: 'rgba(167,139,250,.85)' },
  { id: 's2', cls: 'ship-b', hue: '#99f6e4', glow: 'rgba(45,212,191,.8)' },
]

/* Шаг повторения звёздных плиток — тот же, что в CSS */
const SKY_LAYERS = [
  { varName: '--sky-far',  tile: 240, speed: 0.05 },
  { varName: '--sky-mid',  tile: 320, speed: 0.12 },
  { varName: '--sky-near', tile: 520, speed: 0.24 },
]
const wrap = (v, m) => ((v % m) + m) % m

function useSkyParallax() {
  useEffect(() => {
    const root = document.documentElement
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const wide    = window.matchMedia('(min-width: 768px)').matches
    if (reduced || !wide) return

    let ticking = false
    const apply = () => {
      ticking = false
      const scroll = window.scrollY
      const max = root.scrollHeight - window.innerHeight
      const progress = max > 0 ? scroll / max : 0
      for (const { varName, tile, speed } of SKY_LAYERS) {
        root.style.setProperty(varName, `${-wrap(scroll * speed, tile).toFixed(2)}px`)
      }
      root.style.setProperty('--sky-prog', String(progress.toFixed(4)))
    }
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(apply)
    }
    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
}

/* Пока страница прокручивается — снимаем backdrop-filter со всего стекла */
function useScrollingClass() {
  useEffect(() => {
    const html = document.documentElement
    let timer = 0
    const onScroll = () => {
      if (!html.classList.contains('is-scrolling')) html.classList.add('is-scrolling')
      clearTimeout(timer)
      timer = setTimeout(() => html.classList.remove('is-scrolling'), 140)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); clearTimeout(timer) }
  }, [])
}

function Galaxy({ g }) {
  return (
    <span className="gx-holder" style={{
      left: `${g.x}%`, top: `${g.y}%`, width: `${g.size}px`, height: `${g.size}px`,
      margin: `${-g.size / 2}px 0 0 ${-g.size / 2}px`, ['--gx-depth']: g.depth,
    }}>
      <img className="gx" src={g.src} alt="" aria-hidden="true" loading="lazy" draggable="false"
        style={{ opacity: g.op, ['--gx-rot']: `${g.rot}deg`, ['--gx-dur']: `${g.dur}s` }} />
    </span>
  )
}

function Ship({ s }) {
  return (
    <span className={`ship ${s.cls}`} aria-hidden="true">
      <svg viewBox="0 0 64 34" width="100%" height="100%">
        <defs>
          <radialGradient id={`${s.id}-beam`} cx="50%" cy="0%" r="70%">
            <stop offset="0%" stopColor={s.glow} stopOpacity=".55" />
            <stop offset="100%" stopColor={s.glow} stopOpacity="0" />
          </radialGradient>
          <linearGradient id={`${s.id}-hull`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.hue} stopOpacity=".9" />
            <stop offset="100%" stopColor="#0d0d18" stopOpacity=".95" />
          </linearGradient>
        </defs>
        <path d="M22 22 L42 22 L52 34 L12 34 Z" fill={`url(#${s.id}-beam)`} />
        <path d="M22 15 A10 9 0 0 1 42 15 Z" fill={s.hue} opacity=".55" />
        <path d="M22 15 A10 9 0 0 1 42 15" fill="none" stroke={s.hue} strokeWidth="1.1" opacity=".9" />
        <ellipse cx="32" cy="17" rx="30" ry="6.5" fill={`url(#${s.id}-hull)`} />
        <ellipse cx="32" cy="17" rx="30" ry="6.5" fill="none" stroke={s.hue} strokeWidth="1" opacity=".75" />
        <circle cx="14" cy="18.5" r="1.5" fill={s.hue} className="ship-lamp" />
        <circle cx="32" cy="19.4" r="1.5" fill={s.hue} className="ship-lamp" style={{ animationDelay: '.5s' }} />
        <circle cx="50" cy="18.5" r="1.5" fill={s.hue} className="ship-lamp" style={{ animationDelay: '1s' }} />
      </svg>
    </span>
  )
}

export default function SpaceBg() {
  useSkyParallax()
  useScrollingClass()

  return (
    <>
      <div className="bg-stage" aria-hidden="true">
        {/* Дым: два слоя фрактального шума разной частоты и цвета */}
        <svg className="neb" viewBox="0 0 600 400" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <filter id="neb-teal" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0055 0.011" numOctaves="5" seed="17" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.06  0 0 0 0 0.72  0 0 0 0 0.62  0 0 0 -1.7 1.0" />
            </filter>
            <filter id="neb-violet" x="0" y="0" width="100%" height="100%">
              <feTurbulence type="fractalNoise" baseFrequency="0.0042 0.009" numOctaves="5" seed="41" />
              <feColorMatrix type="matrix" values="0 0 0 0 0.47  0 0 0 0 0.20  0 0 0 0 0.86  0 0 0 -1.8 1.05" />
            </filter>
            <radialGradient id="neb-mask-teal" cx="72%" cy="34%" r="58%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="neb-mask-violet" cx="18%" cy="26%" r="56%">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </radialGradient>
            <mask id="mask-teal"><rect width="600" height="400" fill="url(#neb-mask-teal)" /></mask>
            <mask id="mask-violet"><rect width="600" height="400" fill="url(#neb-mask-violet)" /></mask>
          </defs>
          <g className="neb-teal"><rect width="600" height="400" filter="url(#neb-teal)" mask="url(#mask-teal)" /></g>
          <g className="neb-violet"><rect width="600" height="400" filter="url(#neb-violet)" mask="url(#mask-violet)" /></g>
        </svg>

        <div className="gx-field" aria-hidden="true">
          {GALAXIES.map(g => <Galaxy key={g.src} g={g} />)}
        </div>
        {SHIPS.map(s => <Ship key={s.id} s={s} />)}

        <div className="blob v" />
        <div className="blob t" />
        <div className="blob b" />
        <div className="sky sky-far" />
        <div className="sky sky-mid" />
        <div className="sky sky-near" />
      </div>
    </>
  )
}
