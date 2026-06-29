import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import LandingPage from './pages/LandingPage'
import MapView from './pages/MapView'
import ReportIssue from './pages/ReportIssue'
import Dashboard from './pages/Dashboard'
import Leaderboard from './pages/Leaderboard'
import AccountSettings from './pages/AccountSettings'
import AdminPortal from './pages/AdminPortal'
import AdminLogin from './pages/AdminLogin'
import CitizenLogin from './pages/CitizenLogin'
import { useAuthStore } from './store/authStore'

const AdminRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuthStore()
  if (!isLoggedIn || user?.role !== 'admin') {
    return <AdminLogin />
  }
  return children
}

const CitizenRoute = ({ children }) => {
  const { user, isLoggedIn } = useAuthStore()
  if (!isLoggedIn || user?.role !== 'citizen') {
    return <Navigate to="/login" replace />
  }
  return children
}

function App() {
  return (
    <BrowserRouter>
      {/* Ambient background orbs */}
      <div className="bg-orbs" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <Navbar />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<CitizenLogin />} />
        <Route path="/map" element={<MapView />} />
        <Route path="/report" element={<CitizenRoute><ReportIssue /></CitizenRoute>} />
        <Route path="/dashboard" element={<CitizenRoute><Dashboard /></CitizenRoute>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/account" element={<CitizenRoute><AccountSettings /></CitizenRoute>} />
        <Route path="/admin" element={<AdminRoute><AdminPortal /></AdminRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a2540',
            color: '#f0f4ff',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            fontFamily: 'Inter, sans-serif',
          },
          success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
        }}
      />
    </BrowserRouter>
  )
}

export default App
