import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import StatsCard from '../components/StatsCard'
import PredictiveInsight from '../components/PredictiveInsight'
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/SeverityBadge'
import { useIssueStore } from '../store/issueStore'
import { BarChart3, TrendingUp, Zap, RefreshCw } from 'lucide-react'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const MOCK_STATS = {
  total_issues: 8, open: 5, in_progress: 2, resolved: 2,
  high_severity: 4, total_verifications: 93, resolution_rate: 25.0,
  top_category: 'Pothole',
  category_breakdown: { Pothole: 2, 'Garbage Overflow': 1, 'Damaged Streetlight': 1, 'Water Leakage': 1, 'Broken Footpath': 1, 'Drainage Blocked': 1, 'Tree Fallen': 1 },
  severity_breakdown: { High: 4, Medium: 3, Low: 1 },
}

const MOCK_PREDICTIONS = [
  { type: 'seasonal', icon: '🌧️', title: 'Monsoon Infrastructure Risk', description: 'Historical data indicates 340% increase in drainage and pothole reports during June-September. Proactive maintenance recommended.', confidence: 0.92, action: 'Pre-monsoon drainage audit and road patching' },
  { type: 'trend', icon: '📈', title: 'Pothole Surge Predicted', description: 'Based on 2 recent reports, Pothole incidents are trending upward. Recommend pre-emptive inspection of high-density zones.', confidence: 0.82, action: 'Schedule Pothole inspection drive' },
  { type: 'hotzone', icon: '🔥', title: 'High-Risk Zone Detected', description: 'Cluster of 3 issues detected near SG Highway corridor. This area shows signs of systemic infrastructure neglect.', confidence: 0.87, action: 'Deploy rapid response team to this zone' },
  { type: 'alert', icon: '⚠️', title: 'Critical Backlog Warning', description: '4 high-severity issues remain unaddressed. Delayed response may escalate safety hazards and increase remediation costs.', confidence: 0.99, action: 'Prioritize 4 critical issues immediately' },
]

export default function Dashboard() {
  const { issues, fetchIssues } = useIssueStore()
  const [stats, setStats] = useState(MOCK_STATS)
  const [predictions, setPredictions] = useState(MOCK_PREDICTIONS)
  const [loadingStats, setLoadingStats] = useState(false)

  useEffect(() => {
    fetchIssues()
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    setLoadingStats(true)
    try {
      const [statsRes, predRes] = await Promise.all([
        axios.get(`${API}/api/dashboard/stats`),
        axios.get(`${API}/api/dashboard/predictions`),
      ])
      setStats(statsRes.data)
      setPredictions(predRes.data)
    } catch {
      // Use mock data
    }
    setLoadingStats(false)
  }

  const recentIssues = issues.slice(0, 6)

  const categoryEntries = Object.entries(stats.category_breakdown || {})
    .sort((a, b) => b[1] - a[1])
  const maxCatCount = categoryEntries[0]?.[1] || 1

  const severityPct = {
    High: Math.round(((stats.severity_breakdown?.High || 0) / (stats.total_issues || 1)) * 100),
    Medium: Math.round(((stats.severity_breakdown?.Medium || 0) / (stats.total_issues || 1)) * 100),
    Low: Math.round(((stats.severity_breakdown?.Low || 0) / (stats.total_issues || 1)) * 100),
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ paddingTop: 'clamp(24px, 4vw, 40px)', paddingBottom: '60px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(20px, 4vw, 32px)', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="section-tag"><BarChart3 size={12} /> Impact Analytics</span>
            <h1 style={{ marginTop: '8px' }}>City Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}>
              Real-time overview of Ahmedabad's infrastructure health
            </p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={loadDashboardData} disabled={loadingStats}>
            <RefreshCw size={14} className={loadingStats ? 'spinning' : ''} style={{ animation: loadingStats ? 'spin 0.7s linear infinite' : 'none' }} />
            Refresh
          </button>
        </div>

        {/* Stats grid — 4 cols desktop, 2 tablet, 1 mobile */}
        <div className="grid-4" style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
          <StatsCard icon="📊" label="Total Reports" value={stats.total_issues} subtitle="Community driven" color="var(--color-primary)" index={0} />
          <StatsCard icon="🔓" label="Open Issues" value={stats.open} subtitle="Awaiting action" color="var(--color-danger)" index={1} />
          <StatsCard icon="⚙️" label="In Progress" value={stats.in_progress} subtitle="Being resolved" color="var(--color-warning)" index={2} />
          <StatsCard icon="✅" label="Resolved" value={stats.resolved} subtitle={`${stats.resolution_rate}% rate`} color="var(--color-accent)" index={3} />
        </div>

        {/* Secondary stats */}
        <div className="grid-2" style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>
          <StatsCard icon="🔴" label="High Severity" value={stats.high_severity} subtitle="Priority issues" color="var(--color-danger)" index={4} />
          <StatsCard icon="👍" label="Verifications" value={stats.total_verifications} subtitle="Community checks" color="var(--color-info)" index={5} />
        </div>

        {/* Charts row — 2 cols desktop, 1 col mobile */}
        <div className="grid-2" style={{ marginBottom: 'clamp(16px, 3vw, 28px)' }}>

          {/* Category breakdown */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              📂 Issues by Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categoryEntries.slice(0, 7).map(([cat, count]) => (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px', fontSize: '0.82rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{cat}</span>
                    <span style={{ fontWeight: 700 }}>{count}</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      className="progress-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / maxCatCount) * 100}%` }}
                      transition={{ duration: 0.7, delay: 0.1 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Severity distribution */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>🎯 Severity Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { label: 'High Priority', pct: severityPct.High, color: 'var(--color-danger)', bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)' },
                { label: 'Medium Priority', pct: severityPct.Medium, color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.25)' },
                { label: 'Low Priority', pct: severityPct.Low, color: 'var(--color-accent)', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)' },
              ].map((s) => (
                <div key={s.label} style={{
                  padding: '14px 16px',
                  background: s.bg, border: `1px solid ${s.border}`,
                  borderRadius: 'var(--radius-md)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{s.label}</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: s.color, fontFamily: 'var(--font-display)' }}>{s.pct}%</span>
                  </div>
                  <div className="progress-bar">
                    <motion.div
                      style={{ height: '100%', background: s.color, borderRadius: 'var(--radius-full)' }}
                      initial={{ width: 0 }} animate={{ width: `${s.pct}%` }}
                      transition={{ duration: 0.7, delay: 0.2 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px', textAlign: 'center', padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 'clamp(1.8rem, 4vw, 2.2rem)', fontWeight: 800, color: 'var(--color-accent-light)', fontFamily: 'var(--font-display)' }}>
                {stats.resolution_rate}%
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>Overall Resolution Rate</div>
            </div>
          </div>
        </div>

        {/* Recent Issues — table on desktop, cards on mobile */}
        <div className="card" style={{ marginBottom: 'clamp(16px, 3vw, 28px)', padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: 'clamp(16px, 3vw, 24px)', borderBottom: '1px solid var(--border-subtle)' }}>
            <h3 style={{ fontSize: '1rem' }}>🕐 Recent Reports</h3>
          </div>

          {/* Desktop table */}
          <div className="scroll-x hide-mobile" style={{ padding: '0 clamp(16px, 3vw, 24px) clamp(16px, 3vw, 24px)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Issue', 'Category', 'Severity', 'Status', 'Verifications', 'Reporter'].map((h) => (
                    <th key={h} style={{ padding: '12px 12px 8px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentIssues.map((issue) => (
                  <tr key={issue.id}
                    style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px', maxWidth: '200px' }}>
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.title}</div>
                    </td>
                    <td style={{ padding: '12px' }}><CategoryBadge category={issue.category} /></td>
                    <td style={{ padding: '12px' }}><SeverityBadge severity={issue.severity} /></td>
                    <td style={{ padding: '12px' }}><StatusBadge status={issue.status} /></td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>👍 {issue.verifications}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{issue.reporter_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="show-mobile-only" style={{ flexDirection: 'column', gap: '10px', padding: '12px' }}>
            {recentIssues.map((issue) => (
              <div key={issue.id} style={{
                padding: '14px', background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px', gap: '8px' }}>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', flex: 1, lineHeight: 1.3 }}>{issue.title}</div>
                  <SeverityBadge severity={issue.severity} />
                </div>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
                  <StatusBadge status={issue.status} />
                  <CategoryBadge category={issue.category} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span>{issue.reporter_name}</span>
                  <span>👍 {issue.verifications}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Predictive Insights */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <span className="section-tag"><TrendingUp size={12} /> Gemini AI Predictions</span>
            <h2 style={{ marginTop: '8px' }}>Predictive Infrastructure Insights</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: 'clamp(0.85rem, 2vw, 0.9rem)' }}>
              AI-powered analysis of historical patterns to forecast infrastructure failures
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {predictions.map((p, i) => (
              <PredictiveInsight key={i} insight={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
