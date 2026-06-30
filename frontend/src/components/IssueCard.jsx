import { motion } from 'framer-motion'
import { CheckCircle, MapPin, Calendar, ThumbsUp } from 'lucide-react'
import { SeverityBadge, StatusBadge, CategoryBadge } from './SeverityBadge'
import { useIssueStore } from '../store/issueStore'
import { useAuthStore } from '../store/authStore'
import toast from 'react-hot-toast'

export default function IssueCard({ issue, onClose }) {
  const { verifyIssue } = useIssueStore()
  const { recordVerification } = useAuthStore()

  const handleVerify = async () => {
    try {
      await verifyIssue(issue.id)
      recordVerification()
      toast.success('✅ Issue verified! +3 points earned', { duration: 3000 })
    } catch {
      toast.error('Already verified or error occurred')
    }
  }

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      style={{
        background: 'rgba(15, 26, 46, 0.95)',
        border: '1px solid var(--border-medium)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        width: '100%',
        maxWidth: '380px',
        boxShadow: 'var(--shadow-xl)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Image */}
      {issue.image_url && (
        <div style={{ height: '140px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={issue.image_url}
            alt={issue.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 50%, rgba(8,13,26,0.9))',
          }} />
          <div style={{ position: 'absolute', bottom: '8px', left: '12px' }}>
            <SeverityBadge severity={issue.severity} />
          </div>
        </div>
      )}

      <div style={{ padding: '16px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, lineHeight: 1.3, flex: 1 }}>{issue.title}</h3>
          {onClose && (
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem', padding: '0 4px', flexShrink: 0 }}>×</button>
          )}
        </div>

        {/* Badges row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
          {!issue.image_url && <SeverityBadge severity={issue.severity} />}
          <StatusBadge status={issue.status} />
          <CategoryBadge category={issue.category} />
        </div>

        {/* AI description */}
        {issue.ai_description && (
          <div style={{
            padding: '10px 12px',
            background: 'var(--color-primary-dim)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            marginBottom: '12px',
            lineHeight: 1.5,
          }}>
            🤖 {issue.ai_description}
          </div>
        )}

        {/* Meta */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            <MapPin size={11} /> {issue.address || `${issue.latitude.toFixed(4)}, ${issue.longitude.toFixed(4)}`}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            <span>👤 {issue.reporter_name}</span>
            <span><Calendar size={10} style={{ display: 'inline' }} /> {timeAgo(issue.created_at)}</span>
          </div>
        </div>

        {/* Verify button */}
        {issue.status !== 'Resolved' && (
          <button
            className="btn btn-primary"
            onClick={handleVerify}
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <ThumbsUp size={14} />
            Verify Issue ({issue.verifications})
          </button>
        )}
        {issue.status === 'Resolved' && (
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            padding: '10px', background: 'var(--color-accent-glow)',
            border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-md)',
            color: 'var(--color-accent-light)', fontSize: '0.85rem', fontWeight: 600,
          }}>
            <CheckCircle size={15} /> Issue Resolved — Thank you!
          </div>
        )}

        {/* AI confidence */}
        {issue.ai_confidence > 0 && (
          <div style={{ marginTop: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
              <span>AI Confidence</span>
              <span>{Math.round(issue.ai_confidence * 100)}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${issue.ai_confidence * 100}%` }} />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}
