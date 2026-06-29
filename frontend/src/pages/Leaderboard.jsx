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

export default function Leaderboard() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [loading, setLoading] = useState(false)
  const { user, isLoggedIn } = useAuthStore()

  useEffect(() => {
    loadLeaderboard()
  }, [])

  const loadLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API}/api/users/leaderboard?limit=10`)
      if (res.data.length > 0) setUsers(res.data)
    } catch {
      // Use mock data
    }
    setLoading(false)
  }

  // Insert current user if logged in
  const displayUsers = [...users]
  if (isLoggedIn && user?.points > 0) {
    const userRank = users.filter((u) => u.points > user.points).length + 1
    // Merge or add current user
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

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '900px', paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <span className="section-tag"><Trophy size={12} /> Civic Champions</span>
          <h1 style={{ fontSize: '2.5rem', marginTop: '8px' }}>
            Community Leaderboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '10px', maxWidth: '480px', margin: '10px auto 0' }}>
            Citizens making Ahmedabad better, one report at a time.
          </p>
        </div>

        {/* Community stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{
            display: 'flex', justifyContent: 'center', gap: '40px',
            padding: '24px', marginBottom: '32px',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.03))',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-warning-light)', fontFamily: 'var(--font-display)' }}>
              <Zap size={20} style={{ display: 'inline', marginRight: '4px' }} />{totalPoints.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Points Earned</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-primary-light)', fontFamily: 'var(--font-display)' }}>
              {displayUsers.length}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Active Heroes</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent-light)', fontFamily: 'var(--font-display)' }}>
              {displayUsers.reduce((acc, u) => acc + (u.reports_count || 0), 0)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Issues Reported</div>
          </div>
          <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ec4899', fontFamily: 'var(--font-display)' }}>
              {displayUsers.reduce((acc, u) => acc + (u.verifications_count || 0), 0)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Verifications</div>
          </div>
        </motion.div>

        {/* Leaderboard */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.1rem' }}>🏆 Top Contributors</h2>
          <button className="btn btn-ghost btn-sm" onClick={loadLeaderboard}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '48px' }}>
          {loading ? (
            [...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: '72px' }} />)
          ) : (
            displayUsers.map((u, i) => (
              <LeaderboardRow
                key={u.id}
                user={u}
                rank={i + 1}
                isCurrentUser={u.id === 9 && isLoggedIn}
              />
            ))
          )}
        </div>

        {/* Points guide */}
        <div>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            <Zap size={16} style={{ display: 'inline', marginRight: '8px', color: 'var(--color-warning)' }} />
            How to Earn Points
          </h2>
          <div className="grid-2" style={{ marginBottom: '32px' }}>
            {[
              { action: 'Report a new issue', pts: '+10', icon: '📸', color: 'var(--color-primary)' },
              { action: 'Issue gets verified', pts: '+5', icon: '✅', color: 'var(--color-accent)' },
              { action: 'Verify another\'s issue', pts: '+3', icon: '👍', color: '#3b82f6' },
              { action: 'Issue marked Resolved', pts: '+20', icon: '🎯', color: 'var(--color-warning)' },
            ].map((p) => (
              <motion.div
                key={p.action}
                whileHover={{ scale: 1.02 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 20px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <div style={{ fontSize: '1.5rem' }}>{p.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{p.action}</div>
                </div>
                <div style={{
                  fontSize: '1.2rem', fontWeight: 800, color: p.color,
                  fontFamily: 'var(--font-display)',
                }}>{p.pts}</div>
              </motion.div>
            ))}
          </div>

          {/* Badges */}
          <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
            <Star size={16} style={{ display: 'inline', marginRight: '8px', color: 'var(--color-warning)' }} />
            Achievable Badges
          </h2>
          <div className="grid-3">
            {BADGE_INFO.map((b, i) => (
              <motion.div
                key={b.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.07 }}
                style={{
                  padding: '20px',
                  background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-lg)', textAlign: 'center',
                  transition: 'all 0.2s',
                }}
                whileHover={{ borderColor: 'var(--color-warning)', boxShadow: '0 0 20px rgba(245,158,11,0.1)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{b.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{b.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: '10px' }}>{b.desc}</div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  fontSize: '0.72rem', fontWeight: 700,
                  padding: '3px 10px',
                  background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                  borderRadius: 'var(--radius-full)', color: 'var(--color-warning-light)',
                }}>
                  <Zap size={10} /> {b.pts}+ pts
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
