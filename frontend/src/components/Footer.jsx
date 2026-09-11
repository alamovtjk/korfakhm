import { useNavigate } from 'react-router-dom'
import { Send, Mail, MapPin } from 'lucide-react'
import { useLang } from '../contexts/LangContext'
import { Brand } from './Navbar'

/* Футер в стиле alteno.dev: бренд + три колонки + нижняя строка */
export default function Footer() {
  const navigate = useNavigate()
  const { lang } = useLang()
  const tj = lang === 'tj'

  const cols = [
    {
      title: tj ? 'Платформа' : 'Платформа',
      links: [
        { label: tj ? 'Санҷиши касб' : 'Тест на профессию', path: '/quiz' },
        { label: tj ? 'Санҷиши IQ'   : 'IQ-тест',           path: '/iq' },
        { label: tj ? 'Вакансияҳо'   : 'Вакансии',          path: '/vacancies' },
        { label: tj ? 'Кабинет'      : 'Личный кабинет',    path: '/dashboard' },
      ],
    },
    {
      title: tj ? 'Корфармоён' : 'Работодателям',
      links: [
        { label: tj ? 'Вакансия гузоштан' : 'Разместить вакансию', path: '/post-vacancy' },
        { label: tj ? 'Вакансияҳои ман'   : 'Мои вакансии',        path: '/my-vacancies' },
        { label: tj ? 'Дохил шудан'       : 'Войти',               path: '/auth' },
      ],
    },
  ]

  return (
    <footer className="footer">
      <div className="shell">
        <div className="footer-grid">
          <div className="fbrand">
            <Brand onClick={() => navigate('/')} />
            <p>
              {tj
                ? 'Платформаи ИИ барои интихоби касб ва рушди касбӣ дар Тоҷикистон.'
                : 'AI-платформа профориентации и карьерного роста для молодёжи Таджикистана.'}
            </p>
            <div className="socials">
              <a href="https://t.me/korfakhm" target="_blank" rel="noreferrer" aria-label="Telegram"><Send /></a>
              <a href="https://instagram.com/korfakhm" target="_blank" rel="noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a href="mailto:hello@korfakhm.tj" aria-label="Email"><Mail /></a>
            </div>
          </div>

          {cols.map(col => (
            <div className="fcol" key={col.title}>
              <h5>{col.title}</h5>
              {col.links.map(l => (
                <button key={l.path} onClick={() => navigate(l.path)}>{l.label}</button>
              ))}
            </div>
          ))}

          <div className="fcol">
            <h5>{tj ? 'Тамос' : 'Контакты'}</h5>
            <a href="mailto:hello@korfakhm.tj">hello@korfakhm.tj</a>
            <a href="https://t.me/korfakhm" target="_blank" rel="noreferrer">@korfakhm</a>
            <a style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <MapPin size={13} /> {tj ? 'Душанбе, Тоҷикистон' : 'Душанбе, Таджикистан'}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 КОРФАҲМ · {tj ? 'Ҳамаи ҳуқуқҳо ҳифз шудаанд' : 'Все права защищены'}</span>
          <span className="mono">Илм Фуруги Маърифат 2026 · Unbounded × Manrope</span>
        </div>
      </div>
    </footer>
  )
}
