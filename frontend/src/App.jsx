import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LangProvider } from './contexts/LangContext'
import { AuthProvider } from './contexts/AuthContext'
import Landing from './pages/Landing'
import SpaceBg from './components/SpaceBg'

/* Всё, кроме главной, грузится по требованию — иначе один общий бандл
   тянет за собой весь сайт при первом заходе, что бьёт по LCP. */
const Quiz        = lazy(() => import('./pages/Quiz'))
const Results     = lazy(() => import('./pages/Results'))
const CareerPlan  = lazy(() => import('./pages/CareerPlan'))
const Dashboard   = lazy(() => import('./pages/Dashboard'))
const PostVacancy = lazy(() => import('./pages/PostVacancy'))
const Admin       = lazy(() => import('./pages/Admin'))
const IQTest      = lazy(() => import('./pages/IQTest'))
const IQResults   = lazy(() => import('./pages/IQResults'))
const Vacancies   = lazy(() => import('./pages/Vacancies'))
const Auth        = lazy(() => import('./pages/Auth'))
const MyVacancies = lazy(() => import('./pages/MyVacancies'))
const ChatWidget  = lazy(() => import('./components/ChatWidget'))

function PageLoader() {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div
        className="animate-spin"
        style={{ width: 28, height: 28, borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--violet)' }}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
        <BrowserRouter>
          <SpaceBg />
          <Suspense fallback={null}>
            <ChatWidget />
          </Suspense>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/results" element={<Results />} />
              <Route path="/plan/:profession" element={<CareerPlan />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/post-vacancy" element={<PostVacancy />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/iq" element={<IQTest />} />
              <Route path="/iq-results" element={<IQResults />} />
              <Route path="/vacancies" element={<Vacancies />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/my-vacancies" element={<MyVacancies />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
