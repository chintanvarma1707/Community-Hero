import { motion } from 'framer-motion'
import { Bot, AlertTriangle, CheckCircle, Gauge } from 'lucide-react'
import { SeverityBadge, CategoryBadge } from './SeverityBadge'

export default function AIAnalysisCard({ analysis, loading }) {
  if (loading) {
    return (
      <div style={{
        padding: '24px',
        background: 'var(--bg-elevated)',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{
            width: 36, height: 36,
            background: 'var(--color-primary-dim)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div className="spinner" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Gemini AI Analyzing...</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Processing image with Vision API</div>
          </div>
        </div>
        <div className="skeleton" style={{ height: '12px', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '12px', width: '70%', marginBottom: '8px' }} />
        <div className="skeleton" style={{ height: '12px', width: '50%' }} />
      </div>
    )
  }

  if (!analysis) return null

  const confidencePct = Math.round((analysis.confidence || 0) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      style={{
        padding: '20px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(99,102,241,0.03))',
        border: '1px solid var(--border-primary)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 0 30px rgba(99,102,241,0.1)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          borderRadius: 'var(--radius-md)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 0 16px var(--color-primary-glow)',
          fontSize: '1rem',
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Gemini Vision Analysis</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--color-primary-light)' }}>Powered by Google AI</div>
        </div>
      </div>

      {/* Category & Severity */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <CategoryBadge category={analysis.category} />
        <SeverityBadge severity={analysis.severity} />
      </div>

      {/* Description */}
      <p style={{
        fontSize: '0.85rem', color: 'var(--text-secondary)',
        lineHeight: 1.6, marginBottom: '14px',
      }}>
        {analysis.description}
      </p>

      {/* Recommended action */}
      {analysis.recommended_action && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(245,158,11,0.1)',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.8rem',
          color: 'var(--color-warning-light)',
          marginBottom: '14px',
          display: 'flex', gap: '8px', alignItems: 'flex-start',
        }}>
          <AlertTriangle size={13} style={{ flexShrink: 0, marginTop: '1px' }} />
          {analysis.recommended_action}
        </div>
      )}

      {/* Confidence */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Gauge size={11} /> AI Confidence
          </div>
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-light)' }}>{confidencePct}%</span>
        </div>
        <div className="progress-bar">
          <motion.div
            className="progress-fill"
            initial={{ width: 0 }}
            animate={{ width: `${confidencePct}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  )
}
