import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Map, Plus, BarChart3, Trophy, Zap, Shield, Users, ArrowRight, Star, LogIn } from 'lucide-react'
import { useAuthStore } from '../store/authStore'

const features = [
  {
    icon: '📸', title: 'AI-Powered Reporting',
    desc: 'Upload a photo and Gemini Vision instantly categorizes the issue and scores its severity.',
    color: 'var(--color-primary)',
  },
  {
    icon: '🗺️', title: 'Live Issue Map',
    desc: 'See all reported problems in your city on an interactive Google Maps heatmap in real-time.',
    color: '#3b82f6',
  },
  {
    icon: '✅', title: 'Community Verification',
    desc: 'Citizens walking by can verify issues, boosting confidence scores and priority.',
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
  { value: '8,400+', label: 'Issues Reported' },
  { value: '94%', label: 'AI Accuracy' },
  { value: '12,000+', label: 'Citizens Active' },
  { value: '67%', label: 'Resolution Rate' },
]

const categories = [
  { icon: '🕳️', label: 'Potholes' }, { icon: '💧', label: 'Water Leaks' },
  { icon: '💡', label: 'Streetlights' }, { icon: '🗑️', label: 'Garbage' },
  { icon: '🚶', label: 'Footpaths' }, { icon: '🌊', label: 'Drainage' },
  { icon: '🌳', label: 'Trees' }, { icon: '🛣️', label: 'Road Damage' },
]

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } }
const item = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } }

export default function LandingPage() {
  const navigate = useNavigate()
  const { isLoggedIn } = useAuthStore()

  return (
    <div className="page-wrapper">
      {/* ---- HERO ---- */}
      <section style={{ padding: '80px 0 60px', position: 'relative', overflow: 'hidden' }}>
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Tag */}
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <span className="section-tag">
              <Zap size={12} /> Powered by Google Gemini & Maps
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            style={{
              fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 6vw, 5rem)',
              fontWeight: 900, lineHeight: 1.05, marginBottom: '24px',
              letterSpacing: '-0.03em',
            }}
          >
            Fix Your City,{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--color-primary-light) 0%, #a78bfa 50%, var(--color-accent-light) 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>
              Be a Hero
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 40px', lineHeight: 1.7 }}
          >
            Community Hero empowers citizens to report local infrastructure issues with AI-powered categorization, real-time mapping, and gamified civic engagement.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            {isLoggedIn ? (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/report')} style={{ gap: '10px' }}>
                  <Plus size={18} /> Report an Issue
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => navigate('/dashboard')} style={{ gap: '10px' }}>
                  <BarChart3 size={18} /> View Dashboard
                </button>
              </>
            ) : (
              <>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/login')} style={{ gap: '10px' }}>
                  <Plus size={18} /> Join to Report Issues
                </button>
                <button className="btn btn-ghost btn-lg" onClick={() => navigate('/login')} style={{ gap: '10px' }}>
                  <LogIn size={18} /> Log In
                </button>
              </>
            )}
          </motion.div>

          {/* Hero stats strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            style={{
              display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap',
              marginTop: '60px', paddingTop: '40px',
              borderTop: '1px solid var(--border-subtle)',
            }}
          >
            {stats.map((s) => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800,
                  background: 'linear-gradient(135deg, var(--text-primary), var(--color-primary-light))',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- ISSUE CATEGORIES SCROLL ---- */}
      <section style={{ padding: '20px 0 60px', overflow: 'hidden' }}>
        <div style={{ display: 'flex', gap: '12px', animation: 'scroll-x 20s linear infinite', width: 'max-content' }}>
          {[...categories, ...categories].map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '8px 18px',
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
        <style>{`
          @keyframes scroll-x {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </section>

      {/* ---- FEATURES ---- */}
      <section style={{ padding: '60px 0 80px' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-tag"><Shield size={12} /> Platform Features</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '8px' }}>
              Everything Citizens Need
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '12px', maxWidth: '480px', margin: '12px auto 0' }}>
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
                style={{
                  padding: '28px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'all 0.25s',
                  cursor: 'default',
                  position: 'relative', overflow: 'hidden',
                }}
                whileHover={{ borderColor: f.color + '50', y: -4, boxShadow: `0 8px 30px ${f.color}15` }}
              >
                <div style={{
                  width: 48, height: 48,
                  background: `${f.color}15`, border: `1px solid ${f.color}30`,
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.5rem', marginBottom: '16px',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ---- HOW IT WORKS ---- */}
      <section style={{ padding: '60px 0', background: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <span className="section-tag"><Star size={12} /> Simple & Powerful</span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', marginTop: '8px' }}>How It Works</h2>
          </div>
          <div style={{ display: 'flex', gap: '0', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            {[
              { step: '01', icon: '📸', title: 'Snap & Upload', desc: 'Take a photo of the issue and upload it to the platform' },
              { step: '02', icon: '🤖', title: 'AI Analyzes', desc: 'Gemini Vision categorizes the issue and scores severity automatically' },
              { step: '03', icon: '🗺️', title: 'Pinned on Map', desc: 'Your report appears live on the community map with exact location' },
              { step: '04', icon: '✅', title: 'Community Verifies', desc: 'Neighbors verify the issue, increasing priority for authorities' },
            ].map((s, i) => (
              <div key={s.step} style={{ flex: 1, minWidth: '200px', textAlign: 'center', padding: '20px', position: 'relative' }}>
                {i < 3 && (
                  <div style={{
                    position: 'absolute', right: 0, top: '40px',
                    color: 'var(--text-muted)', fontSize: '1.5rem',
                  }}>→</div>
                )}
                <div style={{
                  width: 64, height: 64,
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.8rem', margin: '0 auto 16px',
                  position: 'relative',
                }}>
                  {s.icon}
                  <div style={{
                    position: 'absolute', top: -8, left: -8,
                    width: 24, height: 24,
                    background: 'var(--color-primary)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 800, color: 'white',
                  }}>{s.step}</div>
                </div>
                <h3 style={{ fontSize: '1rem', marginBottom: '8px' }}>{s.title}</h3>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---- CTA ---- */}
      <section style={{ padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{
              padding: '60px 40px',
              background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.03))',
              border: '1px solid var(--border-primary)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 0 60px rgba(99,102,241,0.1)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🦸</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', marginBottom: '16px' }}>Ready to Make a Difference?</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', maxWidth: '480px', margin: '0 auto 32px', lineHeight: 1.7 }}>
              Join thousands of citizens building better cities. Every report counts. Every verification matters.
            </p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
                  <LogIn size={18} /> Get Started Now
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)', padding: '32px 0',
        textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem',
      }}>
        <div className="container">
          <div style={{ marginBottom: '8px' }}>🦸 Community Hero — Built for Google Cloud Hackathon 2024</div>
          <div>Powered by Gemini Vision API · Google Maps · FastAPI · React</div>
        </div>
      </footer>
    </div>
  )
}
