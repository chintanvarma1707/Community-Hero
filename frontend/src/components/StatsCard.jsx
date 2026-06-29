import { motion } from 'framer-motion'
import { TrendingUp } from 'lucide-react'

export default function StatsCard({ icon, label, value, subtitle, color = 'var(--color-primary)', index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s',
      }}
      whileHover={{ borderColor: 'var(--border-medium)', y: -2 }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 120, height: 120,
        background: color,
        borderRadius: '50%',
        opacity: 0.06,
        filter: 'blur(30px)',
      }} />

      {/* Icon */}
      <div style={{
        width: 44, height: 44,
        background: `${color}20`,
        border: `1px solid ${color}40`,
        borderRadius: 'var(--radius-md)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.3rem',
        marginBottom: '16px',
      }}>
        {icon}
      </div>

      {/* Value */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '2.2rem', fontWeight: 800,
        color: 'var(--text-primary)',
        lineHeight: 1, marginBottom: '6px',
      }}>
        {value}
      </div>

      {/* Label */}
      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
        {label}
      </div>

      {/* Subtitle */}
      {subtitle && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <TrendingUp size={10} />
          {subtitle}
        </div>
      )}
    </motion.div>
  )
}
