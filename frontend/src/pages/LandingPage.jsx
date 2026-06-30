import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, Plus, BarChart3, Trophy, Zap, Shield, Users, ArrowRight, Star, LogIn, CheckCircle } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const features = [
  {
    icon: '📸', title: 'AI-Powered Reporting',
    desc: 'Upload a photo and Gemini Vision instantly categorizes the issue and scores its severity.',
    color: 'var(--color-primary)',
  },
  {
    icon: '🗺️', title: 'Live Issue Map',
    desc: 'See all reported problems in your city on an interactive heatmap in real-time.',
    color: '#3b82f6',
  },
  {
    icon: '✅', title: 'Community Verification',
    desc: 'Citizens verify issues, boosting confidence scores and priority for faster resolution.',
    color: 'var(--color-accent)',
  },
  {
    icon: '🏆', title: 'Civic Gamification',
    desc: 'Earn points and unlock badges for reporting and verifying. Compete on the leaderboard.',
    color: 'var(--color-warning)',
  },
  {
    icon: '📊', title: 'Impact Dashboard',
    desc: 'Track resolution rates, heatmaps, and AI-generated predictions for future failures.',
    color: '#8b5cf6',
  },
  {
    icon: '🔮', title: 'Predictive Insights',
    desc: 'AI analyzes patterns to predict where infrastructure will fail before it happens.',
    color: '#ec4899',
  },
]

const stats = [
  { value: '8,400+', label: 'Issues Reported', icon: '📋' },
  { value: '94%', label: 'AI Accuracy', icon: '🤖' },
  { value: '12,000+', label: 'Citizens Active', icon: '👥' },
  { value: '67%', label: 'Resolution Rate', icon: '✅' },
]

const categories = [
  { icon: '🕳️', label: 'Potholes' }, { icon: '💧', label: 'Water Leaks' },
  { icon: '💡', label: 'Streetlights' }, { icon: '🗑️', label: 'Garbage' },
  { icon: '🚶', label: 'Footpaths' }, { icon: '🌊', label: 'Drainage' },
  { icon: '🌳', label: 'Trees' }, { icon: '🛣️', label: 'Road Damage' },
]

const howItWorks = [
  { step: '01', icon: '📸', title: 'Snap & Upload', desc: 'Take a photo of the issue and upload it to the platform' },
  { step: '02', icon: '🤖', title: 'AI Analyzes', desc: 'Gemini Vision categorizes the issue and scores severity automatically' },
  { step: '03', icon: '🗺️', title: 'Pinned on Map', desc: 'Your report appears live on the community map with exact location' },
  { step: '04', icon: '✅', title: 'Community Verifies', desc: 'Neighbors verify the issue, increasing priority for authorities' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }

export default function LandingPage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()

  return (
    <div className="page-wrapper">
      {/* ---- HERO ---- */}
      <section style={{ padding: 'clamp(48px, 8vw, 100px) 0 clamp(40px, 6vw, 70px)', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>

          {/* Announce bar */}
          <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'flex', justifyContent: 'center' }}>
            <div className="announce-bar">
              <div className="announce-bar-dot" />
              <Zap size={13} />
              Powered by Google Gemini & Maps
              <div className="announce-bar-dot" style={{ animationDelay: '-1s' }} />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-hero"
            style={{ marginBottom: 'clamp(16px, 3vw, 28px)', marginTop: '8px' }}
          >
            Fix Your City,{' '}
            <span className="gradient-text">Be a Hero</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{
              fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
              color: 'var(--text-secondary)',
              maxWidth: '640px',
              margin: '0 auto',
              marginBottom: 'clamp(28px, 5vw, 44px)',
              lineHeight: 1.75,
            }}
          >
            Community Hero empowers citizens to report local infrastructure issues with AI-powered categorization, real-time mapping, and gamified civic engagement.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {isLoggedIn ? (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/report')}>
                  <Plus size={18} /> Report an Issue
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => navigate('/dashboard')}>
                  <BarChart3 size={18} /> View Dashboard
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                  <Plus size={18} /> Join to Report Issues
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => navigate('/map')}>
                  <Map size={18} /> View Live Map
                </button>
              </>
            )}
          </motion.div>

          {/* Social proof */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{ marginTop: 'clamp(32px, 5vw, 56px)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {['🦸','🌟','🔥','💎'].map((e, i) => (
                <div key={i} style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--bg-elevated)', border: '2px solid var(--bg-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', marginLeft: i > 0 ? '-6px' : 0, zIndex: 4 - i,
                }}>{e}</div>
              ))}
            </div>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Join <strong style={{ color: 'var(--text-primary)' }}>12,000+</strong> civic heroes already making a difference
            </span>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
              gap: '16px',
              marginTop: 'clamp(40px, 6vw, 64px)',
              paddingTop: 'clamp(32px, 5vw, 48px)',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center', padding: '8px' }}>
                <div style={{ fontSize: '1.4rem', marginBottom: '6px' }}>{s.icon}</div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, var(--text-primary), var(--color-primary-light))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- CATEGORY SCROLL ---- */}
      <section style={{ padding: '0 0 clamp(40px, 6vw, 60px)', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '12px', animation: 'scroll-x 22s linear infinite', width: 'max-content' }}>
          {[...categories, ...categories].map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 20px',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              whiteSpace: 'nowrap', fontSize: '0.85rem', color: 'var(--text-secondary)',
              flexShrink: 0,
            }}>
              <span style={{ fontSize: '1.1rem' }}>{c.icon}</span> {c.label}
            </div>
          ))}
        </div>
      </section>

      {/* ---- FEATURES ---- */}
      <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 52px)' }}>
            <span className="section-tag"><Shield size={12} /> Platform Features</span>
            <h2 style={{ marginTop: '8px' }}>Everything Citizens Need</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '480px', margin: '12px auto 0', fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              From reporting to resolution — a complete civic-tech ecosystem
            </p>
          </div>

          <motion.div
            className="grid-3"
            variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          >
            {features.map((f) => (
              <motion.div
                key={f.title} variants={item}
                className="feature-card"
                style={{ '--feature-color': f.color }}
                whileHover={{ borderColor: f.color + '40', y: -4, boxShadow: `0 12px 40px ${f.color}15` }}
              >
                <div style={{
                  width: 52, height: 52,
                  background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.6rem', marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section className="section-padding">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(32px, 5vw, 52px)' }}>
            <span className="section-tag"><Star size={12} /> Simple & Powerful</span>
            <h2 style={{ marginTop: '8px' }}>How It Works</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '24px',
            position: 'relative',
          }}>
            {howItWorks.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center', padding: '28px 20px', position: 'relative' }}
              >
                {/* Connector arrow (hidden on mobile) */}
                {i < howItWorks.length - 1 && (
                  <div style={{
                    position: 'absolute', right: '-12px', top: '56px',
                    color: 'var(--text-muted)', fontSize: '1.2rem', zIndex: 1,
                    display: 'none',
                  }} className="hide-mobile">→</div>
                )}
                <div style={{
                  width: 72, height: 72,
                  background: 'linear-gradient(145deg, var(--bg-elevated), var(--bg-surface))',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-xl)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '2rem', margin: '0 auto 20px',
                  position: 'relative',
                  boxShadow: 'var(--shadow-md)',
                }}>
                  {s.icon}
                  <div style={{
                    position: 'absolute', top: -10, left: -10,
                    width: 28, height: 28,
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800, color: 'white',
                    boxShadow: '0 0 12px var(--color-primary-glow)',
                  }}>{s.step}</div>
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- TRUST SECTION ---- */}
      <section className="section-padding-sm" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
            {[
              { icon: '🔒', title: 'Secure & Private', desc: 'Your data is encrypted and never sold to third parties' },
              { icon: '⚡', title: 'Real-time Updates', desc: 'Instant notifications when your issue status changes' },
              { icon: '🏛️', title: 'Govt. Integration', desc: 'Direct pipeline to municipal corporation systems' },
            ].map((t) => (
              <div key={t.title} style={{
                display: 'flex', gap: '16px', alignItems: 'flex-start',
                padding: '20px', background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)',
              }}>
                <div style={{ fontSize: '1.8rem', flexShrink: 0 }}>{t.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>{t.title}</div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section className="section-padding">
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{
              padding: 'clamp(36px, 6vw, 64px) clamp(24px, 5vw, 48px)',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05), rgba(99,102,241,0.08))',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 8s ease infinite',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-2xl)',
              boxShadow: '0 0 80px rgba(99,102,241,0.08)',
              position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
            <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>🦸</div>
            <h2 style={{ marginBottom: '16px' }}>Ready to Make a Difference?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'clamp(24px, 4vw, 36px)', maxWidth: '480px', margin: '0 auto clamp(24px, 4vw, 36px)', lineHeight: 1.75, fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}>
              Join thousands of citizens building better cities. Every report counts. Every verification matters.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {isLoggedIn ? (
                <>
                  <button className="btn btn-primary btn-lg" onClick={() => navigate('/report')}>
                    <Plus size={18} /> Report First Issue
                  </button>
                  <button className="btn btn-ghost btn-lg" onClick={() => navigate('/dashboard')}>
                    <BarChart3 size={18} /> View Dashboard <ArrowRight size={16} />
                  </button>
                </>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')}>
                  <LogIn size={18} /> Get Started — It's Free
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: 'clamp(24px, 4vw, 40px) 0',
        background: 'var(--bg-secondary)',
      }}>
        <div className="container">
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            flexWrap: 'wrap', gap: '16px', marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 8,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
              }}>🦸</div>
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem' }}>
                Community<span style={{ color: 'var(--color-primary-light)' }}>Hero</span>
              </span>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {['/map', '/leaderboard'].map((path, i) => (
                <a key={path} href={path} style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {['Live Map', 'Leaderboard'][i]}
                </a>
              ))}
            </div>
          </div>
          <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: '16px' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              © 2024 Community Hero — Built for Google Cloud Hackathon
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Powered by Gemini Vision · Google Maps · FastAPI · React
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
