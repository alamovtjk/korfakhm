import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import { LangProvider } from './contexts/LangContext'
import { AuthProvider } from './contexts/AuthContext'
import Landing from './pages/Landing'
import Quiz from './pages/Quiz'
import Results from './pages/Results'
import CareerPlan from './pages/CareerPlan'
import Dashboard from './pages/Dashboard'
import PostVacancy from './pages/PostVacancy'
import Admin from './pages/Admin'
import IQTest from './pages/IQTest'
import IQResults from './pages/IQResults'
import Vacancies from './pages/Vacancies'
import Auth from './pages/Auth'
import MyVacancies from './pages/MyVacancies'
import ChatWidget from './components/ChatWidget'
import SpaceBg from './components/SpaceBg'

export default function App() {
  return (
    <ThemeProvider>
      <LangProvider>
        <AuthProvider>
        <BrowserRouter>
          <SpaceBg />
          <ChatWidget />
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
        </BrowserRouter>
        </AuthProvider>
      </LangProvider>
    </ThemeProvider>
  )
}
