import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import { Trophy, Zap, Star, RefreshCw } from 'lucide-react'
import LeaderboardRow from '../components/LeaderboardRow'
import { useAuthStore } from '../store/authStore'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const MOCK_USERS = [
  { id: 1, name: 'Rahul Sharma', avatar_emoji: '🦸', points: 485, reports_count: 18, verifications_count: 32, resolved_count: 6, badges_json: '["First Steps","Watchdog","City Builder"]', created_at: new Date().toISOString() },
  { id: 2, name: 'Priya Patel', avatar_emoji: '🌟', points: 360, reports_count: 14, verifications_count: 28, resolved_count: 4, badges_json: '["First Steps","Watchdog"]', created_at: new Date().toISOString() },
  { id: 3, name: 'Amit Joshi', avatar_emoji: '🔥', points: 290, reports_count: 11, verifications_count: 19, resolved_count: 3, badges_json: '["First Steps","Watchdog"]', created_at: new Date().toISOString() },
  { id: 4, name: 'Neha Gupta', avatar_emoji: '💎', points: 220, reports_count: 8, verifications_count: 14, resolved_count: 2, badges_json: '["First Steps"]', created_at: new Date().toISOString() },
  { id: 5, name: 'Vikram Singh', avatar_emoji: '⚡', points: 175, reports_count: 6, verifications_count: 11, resolved_count: 1, badges_json: '["First Steps"]', created_at: new Date().toISOString() },
  { id: 6, name: 'Kavya Mehta', avatar_emoji: '🌸', points: 140, reports_count: 5, verifications_count: 8, resolved_count: 1, badges_json: '["First Steps"]', created_at: new Date().toISOString() },
  { id: 7, name: 'Deepak Rao', avatar_emoji: '🎯', points: 110, reports_count: 4, verifications_count: 6, resolved_count: 0, badges_json: '["First Steps"]', created_at: new Date().toISOString() },
  { id: 8, name: 'Anita Desai', avatar_emoji: '🌈', points: 85, reports_count: 3, verifications_count: 5, resolved_count: 0, badges_json: '["First Steps"]', created_at: new Date().toISOString() },
]

const BADGE_INFO = [
  { icon: '🌱', name: 'First Steps', desc: 'Submit your first issue report', pts: 10 },
  { icon: '🔍', name: 'Watchdog', desc: 'Verify 10 community issues', pts: 30 },
  { icon: '🏗️', name: 'City Builder', desc: 'Have 5 of your reports resolved', pts: 100 },
  { icon: '⭐', name: 'Hero', desc: 'Accumulate 500 civic points', pts: 500 },
  { icon: '🛡️', name: 'Guardian', desc: 'Submit 25 verified reports', pts: 250 },
]

const PODIUM_CONFIG = [
  { rank: 2, heightRem: 7, bg: 'linear-gradient(135deg, #94a3b8, #64748b)', shadow: 'rgba(148,163,184,0.3)', medal: '🥈' },
  { rank: 1, heightRem: 9, bg: 'linear-gradient(135deg, #fbbf24, #f59e0b)', shadow: 'rgba(251,191,36,0.4)', medal: '🥇' },
  { rank: 3, heightRem: 5.5, bg: 'linear-gradient(135deg, #c084fc, #a855f7)', shadow: 'rgba(192,132,252,0.3)', medal: '🥉' },
]

export default function Leaderboard() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [loading, setLoading] = useState(false)
  const { user, isLoggedIn } = useAuthStore()

  useEffect(() => { loadLeaderboard() }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/api/users/leaderboard?limit=10`)
      if (res.data.length > 0) setUsers(res.data)
    } catch { /* Use mock */ }
    setLoading(false)
  }

  const displayUsers = [...users]
  if (isLoggedIn && user?.points > 0) {
    const existingIdx = displayUsers.findIndex((u) => u.id === 9)
    const userEntry = {
      id: 9, name: user.name, avatar_emoji: user.avatar_emoji,
      points: user.points, reports_count: user.reports_count,
      verifications_count: user.verifications_count, resolved_count: user.resolved_count,
      badges_json: JSON.stringify(user.badges || []),
      created_at: new Date().toISOString(),
    }
    if (existingIdx >= 0) displayUsers[existingIdx] = userEntry
    else displayUsers.push(userEntry)
    displayUsers.sort((a, b) => b.points - a.points)
  }

  const totalPoints = displayUsers.reduce((acc, u) => acc + u.points, 0)
  const topThree = displayUsers.slice(0, 3)

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '900px', paddingTop: 'clamp(24px, 4vw, 40px)', paddingBottom: '60px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 'clamp(24px, 4vw, 40px)' }}>
          <span className="section-tag"><Trophy size={12} /> Civic Champions</span>
          <h1 style={{ marginTop: '8px' }}>Community Leaderboard</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', maxWidth: '420px', margin: '10px auto 0', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
            Citizens making Ahmedabad better, one report at a time.
          </p>
        </div>

        {/* Community stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
            gap: '16px',
            padding: 'clamp(16px, 3vw, 24px)',
            marginBottom: 'clamp(24px, 4vw, 36px)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.03))',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
          }}
        >
          {[
            { val: totalPoints.toLocaleString(), label: 'Total Points', color: 'var(--color-warning-light)', icon: <Zap size={14} /> },
            { val: displayUsers.length, label: 'Active Heroes', color: 'var(--color-primary-light)', icon: '🦸' },
            { val: displayUsers.reduce((acc, u) => acc + (u.reports_count || 0), 0), label: 'Issues Reported', color: 'var(--color-accent-light)', icon: '📋' },
            { val: displayUsers.reduce((acc, u) => acc + (u.verifications_count || 0), 0), label: 'Verifications', color: '#ec4899', icon: '👍' },
          ].map(({ val, label, color, icon }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'clamp(1.4rem, 3vw, 1.8rem)', fontWeight: 800, color, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                {typeof icon === 'string' ? icon : icon}{val}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Podium — top 3 */}
        {topThree.length >= 3 && (
          <div style={{ marginBottom: 'clamp(24px, 4vw, 36px)' }}>
            <div className="podium">
              {PODIUM_CONFIG.map(({ rank, heightRem, bg, shadow, medal }) => {
                const u = topThree[rank - 1]
                if (!u) return null
                return (
                  <div key={rank} className="podium-slot">
                    {/* Avatar */}
                    <div style={{
                      width: rank === 1 ? 68 : 54,
                      height: rank === 1 ? 68 : 54,
                      borderRadius: 'var(--radius-xl)',
                      background: bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: rank === 1 ? '2rem' : '1.6rem',
                      boxShadow: `0 0 24px ${shadow}`,
                      border: `3px solid ${shadow.replace('0.', '0.6').replace(')', '')}`,
                      flexShrink: 0,
                    }}>
                      {u.avatar_emoji}
                    </div>
                    {/* Medal */}
                    <div style={{ fontSize: '1.2rem' }}>{medal}</div>
                    {/* Name */}
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, textAlign: 'center', lineHeight: 1.2 }}>
                      {u.name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--color-warning-light)', fontWeight: 700 }}>
                      <Zap size={9} style={{ display: 'inline' }} /> {u.points}
                    </div>
                    {/* Podium base */}
                    <div style={{
                      width: '100%',
                      height: `${heightRem}rem`,
                      background: bg,
                      borderRadius: 'var(--radius-md) var(--radius-md) 0 0',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', fontWeight: 900, color: 'white',
                      boxShadow: `0 -4px 20px ${shadow}`,
                      fontFamily: 'var(--font-display)',
                    }}>
                      {rank}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Leaderboard list */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.15rem)' }}>🏆 Top Contributors</h2>
          <button className="btn btn-ghost btn-sm" onClick={loadLeaderboard} disabled={loading}>
            <RefreshCw size={13} style={{ animation: loading ? 'spin 0.7s linear infinite' : 'none' }} /> Refresh
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '40px' }}>
          {loading ? (
            [...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: '72px' }} />)
          ) : (
            displayUsers.map((u, i) => (
              <LeaderboardRow key={u.id} user={u} rank={i + 1} isCurrentUser={u.id === 9 && isLoggedIn} />
            ))
          )}
        </div>

        {/* Points guide */}
        <div>
          <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={16} color="var(--color-warning)" /> How to Earn Points
          </h2>
          <div className="grid-2" style={{ marginBottom: 'clamp(24px, 4vw, 36px)', gap: '10px' }}>
            {[
              { action: 'Report a new issue', pts: '+10', icon: '📸', color: 'var(--color-primary)' },
              { action: 'Issue gets verified by community', pts: '+5', icon: '✅', color: 'var(--color-accent)' },
              { action: "Verify another citizen's issue", pts: '+3', icon: '👍', color: '#3b82f6' },
              { action: 'Issue marked Resolved', pts: '+20', icon: '🎯', color: 'var(--color-warning)' },
            ].map((p) => (
              <motion.div
                key={p.action}
                whileHover={{ scale: 1.02, borderColor: p.color + '40' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: 'clamp(12px, 2vw, 16px) clamp(14px, 2vw, 20px)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)', transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '1.4rem', flexShrink: 0 }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.3 }}>{p.action}</div>
                </div>
                <div style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', fontWeight: 800, color: p.color, fontFamily: 'var(--font-display)', flexShrink: 0 }}>
                  {p.pts}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Badges */}
          <h2 style={{ fontSize: 'clamp(1rem, 2vw, 1.2rem)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={16} color="var(--color-warning)" /> Achievable Badges
          </h2>
          <div className="grid-3" style={{ gap: '10px' }}>
            {BADGE_INFO.map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ borderColor: 'rgba(245,158,11,0.4)', boxShadow: '0 0 20px rgba(245,158,11,0.08)' }}
                style={{
                  padding: 'clamp(14px, 2vw, 20px)',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', textAlign: 'center',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '8px' }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '4px' }}>{b.name}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>{b.desc}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '3px 10px',
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                  borderRadius: 'var(--radius-full)', color: 'var(--color-warning-light)',
                }}>
                  <Zap size={9} /> {b.pts}+ pts
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
