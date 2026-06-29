import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Plus, BarChart3, Trophy, Menu, X, Zap, Shield } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const ALL_NAV_ITEMS = [
  { to: '/map', label: 'Live Map', icon: Map },
  { to: '/report', label: 'Report Issue', icon: Plus, highlight: true },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isLoggedIn, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/admin') return null;

  const navItems = isLoggedIn ? ALL_NAV_ITEMS : []

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--navbar-height)',
        background: 'rgba(8, 13, 26, 0.85)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '32px', width: '100%' }}>
          {/* Logo */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 0 20px var(--color-primary-glow)',
            }}>🦸</div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: '1.1rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}>Community<span style={{ color: 'var(--color-primary-light)' }}>Hero</span></span>
          </NavLink>

          {/* Desktop Nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }} className="desktop-nav">
            {navItems.map(({ to, label, icon: Icon, highlight }) => (
              <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: highlight ? '8px 16px' : '8px 14px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: highlight
                      ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
                      : isActive ? 'var(--bg-elevated)' : 'transparent',
                    color: highlight ? 'white' : isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: highlight ? 'none' : isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                    boxShadow: highlight ? '0 4px 16px var(--color-primary-glow)' : 'none',
                  }}>
                    <Icon size={15} />
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* User section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {user?.role === 'admin' ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/admin'); }}>
                    Logout
                  </button>
                ) : (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 14px', borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                    cursor: 'pointer', title: 'View Account & Settings'
                  }} onClick={() => navigate('/account')}>
                    <span style={{ fontSize: '1.1rem' }}>{user.avatar_emoji}</span>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{user.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-warning-light)', lineHeight: 1, marginTop: 2 }}>
                        <Zap size={9} style={{ display: 'inline' }} /> {user.points || 0} pts
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>
                Join Now
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="btn btn-ghost btn-sm mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{ display: 'none' }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile nav */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              position: 'fixed', top: 'var(--navbar-height)', left: 0, right: 0,
              zIndex: 999, background: 'rgba(8,13,26,0.97)',
              backdropFilter: 'blur(20px)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '16px',
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} onClick={() => setMobileOpen(false)}
                style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 16px', borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)', fontWeight: 600,
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                <Icon size={16} /> {label}
              </NavLink>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Login modal removed in favor of dedicated /login page */}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </>
  )
}
