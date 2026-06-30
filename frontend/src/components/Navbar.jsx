import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Map, Plus, BarChart3, Trophy, Menu, X, Zap, Shield, Home, User } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const ALL_NAV_ITEMS = [
  { to: '/map', label: 'Live Map', icon: Map },
  { to: '/report', label: 'Report', icon: Plus, highlight: true },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
]

const BOTTOM_NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/map', label: 'Map', icon: Map },
  { to: '/report', label: 'Report', icon: Plus, highlight: true },
  { to: '/dashboard', label: 'Dashboard', icon: BarChart3 },
  { to: '/leaderboard', label: 'Board', icon: Trophy },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, isLoggedIn, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  if (location.pathname === '/admin') return null

  const navItems = isLoggedIn ? ALL_NAV_ITEMS : []
  const bottomItems = isLoggedIn ? BOTTOM_NAV_ITEMS : [
    { to: '/', label: 'Home', icon: Home },
    { to: '/map', label: 'Map', icon: Map },
    { to: '/leaderboard', label: 'Leaderboard', icon: Trophy },
  ]

  const handleMenuClose = () => setMobileOpen(false)

  return (
    <>
      {/* ── Desktop / Tablet Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: 'var(--navbar-height)',
        background: 'rgba(6, 11, 23, 0.9)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center',
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: '28px', width: '100%' }}>
          {/* Logo */}
          <NavLink to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', flexShrink: 0 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18, boxShadow: '0 0 20px var(--color-primary-glow)',
              flexShrink: 0,
            }}>🦸</div>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800, fontSize: '1.05rem',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
            }}>
              Community<span style={{ color: 'var(--color-primary-light)' }}>Hero</span>
            </span>
          </NavLink>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flex: 1 }} className="desktop-nav">
            {navItems.map(({ to, label, icon: Icon, highlight }) => (
              <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
                {({ isActive }) => (
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: highlight ? '8px 16px' : '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.865rem', fontWeight: 600,
                    cursor: 'pointer', transition: 'all 0.2s',
                    background: highlight
                      ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
                      : isActive ? 'var(--bg-elevated)' : 'transparent',
                    color: highlight ? 'white' : isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                    border: highlight ? 'none' : isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                    boxShadow: highlight ? '0 4px 16px var(--color-primary-glow)' : 'none',
                  }}>
                    <Icon size={14} />
                    {label}
                  </div>
                )}
              </NavLink>
            ))}
          </div>

          {/* User section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', flexShrink: 0 }}>
            {isLoggedIn ? (
              <>
                {user?.role === 'admin' ? (
                  <button className="btn btn-ghost btn-sm" onClick={() => { logout(); navigate('/admin'); }}>
                    Logout
                  </button>
                ) : (
                  <div
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      padding: '6px 12px', borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                      cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onClick={() => navigate('/account')}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--border-primary)'; e.currentTarget.style.background = 'rgba(22,32,53,0.9)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.background = 'var(--bg-elevated)'; }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{user.avatar_emoji}</span>
                    <div className="hide-mobile">
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{user.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--color-warning-light)', lineHeight: 1, marginTop: 2 }}>
                        <Zap size={8} style={{ display: 'inline' }} /> {user.points || 0} pts
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <button className="btn btn-ghost btn-sm hide-mobile" onClick={() => navigate('/login')}>
                Join Now
              </button>
            )}

            {/* Mobile hamburger (shown on small screens above 768 if needed) */}
            <button
              className="btn-ghost btn-sm mobile-menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              style={{
                display: 'none',
                padding: '8px',
                borderRadius: 'var(--radius-md)',
                background: 'transparent',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile Drawer Menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleMenuClose}
              style={{
                position: 'fixed', inset: 0, zIndex: 990,
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
              }}
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{
                position: 'fixed', top: 0, right: 0, bottom: 0,
                width: '280px', zIndex: 995,
                background: 'rgba(9, 14, 26, 0.98)',
                backdropFilter: 'blur(24px)',
                borderLeft: '1px solid var(--border-subtle)',
                display: 'flex', flexDirection: 'column',
                padding: '0',
                boxShadow: '-8px 0 40px rgba(0,0,0,0.6)',
              }}
            >
              {/* Drawer header */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '20px',
                borderBottom: '1px solid var(--border-subtle)',
                paddingTop: 'calc(20px + var(--navbar-height))',
              }}>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1rem', color: 'var(--text-primary)' }}>
                  Navigation
                </span>
                <button
                  onClick={handleMenuClose}
                  style={{
                    background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                    borderRadius: 'var(--radius-md)', padding: '6px', cursor: 'pointer',
                    color: 'var(--text-secondary)', display: 'flex', alignItems: 'center',
                  }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Nav links */}
              <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <NavLink to="/" onClick={handleMenuClose} style={{ textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '12px',
                      padding: '12px 16px', borderRadius: 'var(--radius-md)',
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-elevated)' : 'transparent',
                      fontWeight: 600, fontSize: '0.9rem',
                      transition: 'all 0.2s',
                    }}>
                      <Home size={16} /> Home
                    </div>
                  )}
                </NavLink>
                {navItems.map(({ to, label, icon: Icon, highlight }) => (
                  <NavLink key={to} to={to} onClick={handleMenuClose} style={{ textDecoration: 'none' }}>
                    {({ isActive }) => (
                      <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '12px 16px', borderRadius: 'var(--radius-md)',
                        color: highlight ? 'white' : isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        background: highlight
                          ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
                          : isActive ? 'var(--bg-elevated)' : 'transparent',
                        fontWeight: 600, fontSize: '0.9rem',
                        boxShadow: highlight ? '0 4px 16px var(--color-primary-glow)' : 'none',
                        border: highlight ? 'none' : '1px solid transparent',
                        transition: 'all 0.2s',
                      }}>
                        <Icon size={16} /> {label}
                      </div>
                    )}
                  </NavLink>
                ))}
              </div>

              {/* Bottom user section */}
              <div style={{ padding: '16px', borderTop: '1px solid var(--border-subtle)' }}>
                {isLoggedIn ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {user?.role !== 'admin' && (
                      <div
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '12px 14px', borderRadius: 'var(--radius-md)',
                          background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)',
                          cursor: 'pointer',
                        }}
                        onClick={() => { navigate('/account'); handleMenuClose(); }}
                      >
                        <span style={{ fontSize: '1.2rem' }}>{user.avatar_emoji}</span>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--color-warning-light)' }}>
                            <Zap size={9} style={{ display: 'inline' }} /> {user.points || 0} pts
                          </div>
                        </div>
                        <User size={14} style={{ marginLeft: 'auto', color: 'var(--text-muted)' }} />
                      </div>
                    )}
                    <button
                      className="btn btn-ghost btn-sm btn-full"
                      onClick={() => { logout(); navigate('/'); handleMenuClose(); }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-primary btn-full"
                    onClick={() => { navigate('/login'); handleMenuClose(); }}
                  >
                    Join Now
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Navigation ── */}
      {isLoggedIn && (
        <nav className="bottom-nav">
          <NavLink to="/" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <div className="bottom-nav-icon"><Home size={18} /></div>
            <span>Home</span>
          </NavLink>
          <NavLink to="/map" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <div className="bottom-nav-icon"><Map size={18} /></div>
            <span>Map</span>
          </NavLink>
          <NavLink to="/report" className={({ isActive }) => `bottom-nav-item highlight ${isActive ? 'active' : ''}`}>
            <div className="bottom-nav-icon"><Plus size={18} /></div>
            <span>Report</span>
          </NavLink>
          <NavLink to="/dashboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <div className="bottom-nav-icon"><BarChart3 size={18} /></div>
            <span>Stats</span>
          </NavLink>
          <NavLink to="/leaderboard" className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}>
            <div className="bottom-nav-icon"><Trophy size={18} /></div>
            <span>Board</span>
          </NavLink>
        </nav>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-toggle { display: flex !important; }
        }
        @media (max-width: 480px) {
          .mobile-menu-toggle { display: none !important; }
        }
        .bottom-nav a { color: inherit; text-decoration: none; }
      `}</style>
    </>
  )
}
