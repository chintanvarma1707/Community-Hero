import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export default function StatsCard({ icon, label, value, subtitle, color = 'var(--color-primary)', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="stats-card"
      style={{ '--card-color': color }}
      whileHover={{ y: -4, borderColor: 'var(--border-medium)' }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -24, right: -24,
        width: 120, height: 120,
        background: color,
        borderRadius: '50%',
        opacity: 0.07,
        filter: 'blur(32px)',
        pointerEvents: 'none',
      }} />

      {/* Icon */}
      <div style={{
        width: 44, height: 44,
        background: `${color}18`,
        border: `1px solid ${color}35`,
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem',
        marginBottom: '14px',
        position: 'relative', zIndex: 1,
      }}>
        {icon}
      </div>

      {/* Value */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.6rem, 3vw, 2.2rem)',
        fontWeight: 800,
        color: 'var(--text-primary)',
        lineHeight: 1, marginBottom: '6px',
        position: 'relative', zIndex: 1,
      }}>
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: '0.84rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px', position: 'relative', zIndex: 1 }}>
        {label}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', position: 'relative', zIndex: 1 }}>
          <TrendingUp size={9} />
          {subtitle}
        </div>
      )}
    </motion.div>
  )
}
