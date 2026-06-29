import { motion } from 'framer-motion'
import { Zap, Shield, Target, Star, Award } from 'lucide-react'

const BADGE_CONFIG = {
  'First Steps': { icon: '🌱', color: '#10b981', desc: 'First report submitted' },
  'Watchdog': { icon: '🔍', color: '#6366f1', desc: '10 verifications' },
  'City Builder': { icon: '🏗️', color: '#f59e0b', desc: '5 resolved issues' },
  'Hero': { icon: '⭐', color: '#f59e0b', desc: '500 points earned' },
  'Guardian': { icon: '🛡️', color: '#3b82f6', desc: '25 reports submitted' },
}

export default function LeaderboardRow({ user, rank, isCurrentUser = false }) {
  const badges = typeof user.badges_json === 'string'
    ? JSON.parse(user.badges_json || '[]')
    : (user.badges || [])

  const rankDisplay = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: rank * 0.07 }}
      style={{
        display: 'flex', alignItems: 'center', gap: '16px',
        padding: '16px 20px',
        background: isCurrentUser
          ? 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(99,102,241,0.05))'
          : rank <= 3 ? 'rgba(255,255,255,0.02)' : 'transparent',
        border: isCurrentUser
          ? '1px solid var(--border-primary)'
          : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        transition: 'all 0.2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      whileHover={{ scale: 1.01, borderColor: 'var(--border-medium)' }}
    >
      {/* Glow for top 3 */}
      {rank <= 3 && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px',
          background: rank === 1 ? '#fbbf24' : rank === 2 ? '#94a3b8' : '#cd7c34',
          borderRadius: '4px 0 0 4px',
        }} />
      )}

      {/* Rank */}
      <div style={{
        fontSize: rank <= 3 ? '1.5rem' : '0.9rem',
        fontWeight: 800, minWidth: '40px', textAlign: 'center',
        color: rank <= 3 ? undefined : 'var(--text-muted)',
        fontFamily: 'var(--font-display)',
      }}>
        {rankDisplay}
      </div>

      {/* Avatar */}
      <div style={{
        width: 44, height: 44,
        background: isCurrentUser
          ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
          : 'var(--bg-elevated)',
        borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.4rem',
        boxShadow: isCurrentUser ? '0 0 16px var(--color-primary-glow)' : 'none',
        flexShrink: 0,
      }}>
        {user.avatar_emoji}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
          <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
            {user.name}
          </span>
          {isCurrentUser && (
            <span style={{
              fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px',
              background: 'var(--color-primary-dim)', color: 'var(--color-primary-light)',
              border: '1px solid var(--border-primary)', borderRadius: 'var(--radius-full)',
            }}>YOU</span>
          )}
        </div>
        {/* Badges */}
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {badges.slice(0, 4).map((badge) => {
            const cfg = BADGE_CONFIG[badge]
            return cfg ? (
              <span key={badge} title={cfg.desc} style={{
                fontSize: '0.7rem', padding: '2px 8px',
                background: `${cfg.color}20`,
                border: `1px solid ${cfg.color}40`,
                borderRadius: 'var(--radius-full)',
                color: cfg.color,
                cursor: 'help',
              }}>
                {cfg.icon} {badge}
              </span>
            ) : null
          })}
          {badges.length === 0 && (
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>No badges yet</span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '16px', flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Reports</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user.reports_count}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Verified</div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{user.verifications_count}</div>
        </div>
        <div style={{ textAlign: 'center', minWidth: '60px' }}>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '2px' }}>Points</div>
          <div style={{
            fontWeight: 800, fontSize: '1rem',
            color: 'var(--color-warning-light)',
            fontFamily: 'var(--font-display)',
          }}>
            <Zap size={11} style={{ display: 'inline', marginRight: '2px' }} />
            {user.points}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
