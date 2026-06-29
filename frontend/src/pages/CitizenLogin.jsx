import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { User, Mail, Phone, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function CitizenLogin() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(
        isLogin ? 'Citizen' : name.trim(),
        email.trim(),
        phone.trim() || '+91 9999999999',
        password,
        'citizen'
      )
      toast.success(isLogin ? '👋 Welcome back!' : '🎉 Account created!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.message || 'Invalid credentials. Please try again.')
    }
    setLoading(false)
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      await login('Rahul Sharma', 'rahul@example.com', '+91 9825012345', '', 'citizen')
      toast.success('👋 Demo login successful!')
      navigate('/dashboard')
    } catch {
      // Fallback if backend is not running
      await login('Rahul Sharma', 'rahul@example.com', '+91 9825012345', 'demo', 'citizen')
      toast.success('👋 Demo login successful!')
      navigate('/dashboard')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-base)' }}>
      {/* Left - Branding Panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
        padding: '80px', background: 'linear-gradient(135deg, #05101f 0%, #0c1a38 50%, #0f2d3a 100%)',
        position: 'relative', overflow: 'hidden'
      }} className="login-left-panel">
        {/* Decorative circles */}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '48px' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg, #10b981, #34d399)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, boxShadow: '0 0 24px rgba(16,185,129,0.4)' }}>🦸</div>
            <span style={{ fontWeight: 800, fontSize: '1.4rem', color: 'white', letterSpacing: '-0.02em' }}>Community<span style={{ color: '#34d399' }}>Hero</span></span>
          </Link>

          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.03em' }}>
            Your City.<br />
            <span style={{ background: 'linear-gradient(135deg, #10b981, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Voice.</span><br />
            Your Impact.
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: '380px', marginBottom: '48px' }}>
            Join thousands of citizens who are actively making their neighborhoods better — one report at a time.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { icon: '🗺️', text: 'Report issues with live geotagging' },
              { icon: '🤖', text: 'AI-powered automatic categorization' },
              { icon: '🏆', text: 'Earn points and community badges' },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }}
                style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>{item.text}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form Panel */}
      <div style={{ width: '480px', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 48px', background: 'var(--bg-surface)', overflow: 'auto' }} className="login-right-panel">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '8px', letterSpacing: '-0.02em' }}>
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '0.95rem' }}>
            {isLogin ? 'Log in to your Community Hero account.' : 'Join the movement to fix our city.'}
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', padding: '4px', marginBottom: '28px' }}>
            <button type="button" onClick={() => setIsLogin(true)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s', background: isLogin ? 'var(--color-primary)' : 'transparent', color: isLogin ? 'white' : 'var(--text-muted)', boxShadow: isLogin ? '0 2px 8px rgba(16,185,129,0.3)' : 'none' }}>Log In</button>
            <button type="button" onClick={() => setIsLogin(false)} style={{ flex: 1, padding: '10px', borderRadius: 'var(--radius-md)', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '0.9rem', transition: 'all 0.2s', background: !isLogin ? 'var(--color-primary)' : 'transparent', color: !isLogin ? 'white' : 'var(--text-muted)', boxShadow: !isLogin ? '0 2px 8px rgba(16,185,129,0.3)' : 'none' }}>Sign Up</button>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <InputField icon={User} type="text" placeholder="Full Name" value={name} onChange={setName} required />
                </motion.div>
              )}
            </AnimatePresence>

            <InputField icon={Mail} type="email" placeholder="Email Address" value={email} onChange={setEmail} required />

            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div key="phone" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                  <InputField icon={Phone} type="tel" placeholder="Phone Number (e.g. +91 9876543210)" value={phone} onChange={setPhone} />
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ position: 'relative' }}>
              <InputField icon={Lock} type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={setPassword} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}>
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button type="submit" disabled={loading}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px', borderRadius: 'var(--radius-md)', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', background: 'linear-gradient(135deg, #10b981, #34d399)', color: 'white', fontWeight: 700, fontSize: '1rem', marginTop: '8px', boxShadow: '0 4px 16px rgba(16,185,129,0.35)', transition: 'all 0.2s' }}>
              {loading ? <div className="spinner" style={{ borderColor: 'white', borderTopColor: 'transparent', width: '20px', height: '20px' }} /> : <><span>{isLogin ? 'Log In' : 'Create Account'}</span><ArrowRight size={18} /></>}
            </button>
          </form>

          {/* Demo Credentials Box */}
          <div style={{ marginTop: '28px', padding: '18px', background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: 'var(--radius-lg)' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#60a5fa', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>🔑 Demo Credentials</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              <span><strong style={{ color: 'var(--text-primary)' }}>Email:</strong> rahul@example.com</span>
              <span><strong style={{ color: 'var(--text-primary)' }}>Password:</strong> (leave blank or any value)</span>
            </div>
            <button onClick={handleDemoLogin} disabled={loading}
              style={{ width: '100%', padding: '10px', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: 'var(--radius-md)', color: '#60a5fa', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}>
              ⚡ Quick Demo Login
            </button>
          </div>

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Government official?{' '}
            <Link to="/admin" style={{ color: 'var(--color-primary-light)', fontWeight: 700, textDecoration: 'none' }}>Admin Portal →</Link>
          </p>
        </motion.div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .login-left-panel { display: none !important; }
          .login-right-panel { width: 100% !important; }
        }
      `}</style>
    </div>
  )
}

function InputField({ icon: Icon, type, placeholder, value, onChange, required }) {
  return (
    <div style={{ position: 'relative' }}>
      <Icon size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none', zIndex: 1 }} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        style={{ width: '100%', padding: '13px 14px 13px 40px', background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'border 0.2s', boxSizing: 'border-box' }}
        onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary)' }}
        onBlur={(e) => { e.target.style.borderColor = 'var(--border-medium)' }}
      />
    </div>
  )
}
