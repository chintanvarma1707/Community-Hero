import { motion } from 'framer-motion'

export default function PredictiveInsight({ insight, index = 0 }) {
  const typeColors = {
    trend: { bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.25)', bar: 'var(--color-primary)' },
    hotzone: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', bar: 'var(--color-danger)' },
    seasonal: { bg: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.25)', bar: 'var(--color-info)' },
    alert: { bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)', bar: 'var(--color-warning)' },
  }

  const cfg = typeColors[insight.type] || typeColors.trend
  const confidencePct = Math.round((insight.confidence || 0) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      style={{
        padding: '20px',
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 'var(--radius-lg)',
        transition: 'all 0.2s',
      }}
      whileHover={{ scale: 1.01, boxShadow: `0 4px 20px ${cfg.border}` }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ fontSize: '1.6rem', flexShrink: 0 }}>{insight.icon}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px' }}>{insight.title}</div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '12px' }}>
            {insight.description}
          </p>

          {/* Action */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '0.75rem', fontWeight: 600,
            padding: '4px 12px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 'var(--radius-full)',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
          }}>
            💡 {insight.action}
          </div>

          {/* Confidence */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AI Confidence</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{confidencePct}%</span>
            </div>
            <div className="progress-bar">
              <motion.div
                style={{
                  height: '100%', borderRadius: 'var(--radius-full)',
                  background: cfg.bar,
                }}
                initial={{ width: 0 }}
                animate={{ width: `${confidencePct}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
