import { motion } from 'framer-motion'
import { CheckCircle, Circle, Loader } from 'lucide-react'

const STEPS = [
  { key: 'Open', label: 'Reported', icon: '📋', desc: 'Issue reported by citizen' },
  { key: 'In Progress', label: 'In Progress', icon: '⚙️', desc: 'Municipal team assigned' },
  { key: 'Resolved', label: 'Resolved', icon: '✅', desc: 'Issue fixed and closed' },
]

export default function StatusTimeline({ status }) {
  const currentIndex = STEPS.findIndex((s) => s.key === status)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0' }}>
      {STEPS.map((step, idx) => {
        const isDone = idx <= currentIndex
        const isActive = idx === currentIndex

        return (
          <div key={step.key} style={{ display: 'flex', alignItems: 'center', flex: idx < STEPS.length - 1 ? 1 : 'none' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
              {/* Circle */}
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  boxShadow: isActive ? '0 0 16px rgba(99,102,241,0.4)' : 'none',
                }}
                style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  background: isDone
                    ? isActive
                      ? 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))'
                      : 'var(--color-accent)'
                    : 'var(--bg-elevated)',
                  border: `2px solid ${isDone ? (isActive ? 'var(--color-primary)' : 'var(--color-accent)') : 'var(--border-medium)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem',
                  transition: 'all 0.3s',
                }}
              >
                {isDone ? step.icon : <Circle size={14} color="var(--text-muted)" />}
              </motion.div>
              {/* Label */}
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: isDone ? 'var(--text-primary)' : 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {step.label}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {step.desc}
                </div>
              </div>
            </div>

            {/* Connector line */}
            {idx < STEPS.length - 1 && (
              <div style={{
                flex: 1, height: 2,
                background: idx < currentIndex ? 'var(--color-accent)' : 'var(--border-subtle)',
                margin: '0 4px',
                marginTop: '-28px',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
