import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login('Admin', email, '+91 0000000000', password, 'admin', '🏛️')
      toast.success('✅ Authentication successful')
      navigate('/admin')
    } catch (err) {
      toast.error('❌ Invalid credentials. Access Denied.')
    }
    setLoading(false)
  }

  const handleQuickLogin = async () => {
    setLoading(true)
    try {
      await login('Admin', 'admin@ahmedabad.gov.in', '+91 0000000000', 'admin', 'admin', '🏛️')
      toast.success('✅ Admin authenticated')
      navigate('/admin')
    } catch {
      toast.error('Quick login failed. Try manually.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'radial-gradient(ellipse at top, #080d1a 0%, #020408 100%)', padding: '24px' }}>
      {/* Decorative Shield */}
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '700px', height: '700px', background: 'radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 60%)', pointerEvents: 'none' }} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '440px', position: 'relative', zIndex: 1 }}
      >
        {/* Top Badge */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ width: '80px', height: '80px', background: 'linear-gradient(135deg, rgba(59,130,246,0.15), rgba(99,102,241,0.15))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid rgba(59,130,246,0.25)', boxShadow: '0 0 40px rgba(59,130,246,0.12)' }}>
            <Shield size={36} color="#60a5fa" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: '6px' }}>Restricted Access</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Municipal Command Center • Authorized Personnel Only</p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '36px', background: 'rgba(16,24,40,0.8)', backdropFilter: 'blur(20px)' }}>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin ID</label>
              <input
                type="email"
                placeholder="admin@ahmedabad.gov.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '13px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#60a5fa' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-medium)' }}
              />
            </div>
            <div style={{ position: 'relative' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '13px 42px 13px 14px', background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' }}
                onFocus={(e) => { e.target.style.borderColor = '#60a5fa' }}
                onBlur={(e) => { e.target.style.borderColor = 'var(--border-medium)' }}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', bottom: '13px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '13px', borderRadius: 'var(--radius-md)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #3b82f6, #6366f1)', color: 'white', fontWeight: 700, fontSize: '0.95rem', marginTop: '8px', boxShadow: '0 4px 16px rgba(59,130,246,0.3)', transition: 'all 0.2s' }}>
              {loading ? <div className="spinner" style={{ borderColor: 'white', borderTopColor: 'transparent', width: '20px', height: '20px' }} /> : '🔐 Authenticate'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div style={{ marginTop: '24px', padding: '16px', background: 'rgba(99,102,241,0.07)', border: '1px dashed rgba(99,102,241,0.3)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#818cf8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>🔑 Demo Credentials</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span><strong style={{ color: 'var(--text-primary)' }}>Admin ID:</strong> admin@ahmedabad.gov.in</span>
              <span><strong style={{ color: 'var(--text-primary)' }}>Password:</strong> admin</span>
            </div>
            <button onClick={handleQuickLogin} disabled={loading}
              style={{ width: '100%', padding: '9px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.4)', borderRadius: 'var(--radius-md)', color: '#818cf8', fontWeight: 700, cursor: 'pointer', fontSize: '0.85rem' }}>
              ⚡ Quick Demo Login
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            ⚠️ All access attempts are logged and monitored.<br />Unauthorized access is prohibited.
          </p>
        </div>
      </motion.div>
    </div>
  )
}
