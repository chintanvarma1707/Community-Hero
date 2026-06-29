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
      <div className="container" style={{ paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="section-tag"><BarChart3 size={12} /> Impact Analytics</span>
            <h1 style={{ fontSize: '2rem', marginTop: '8px' }}>City Dashboard</h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>Real-time overview of Ahmedabad's infrastructure health</p>
          </div>
          <button className="btn btn-ghost" onClick={loadDashboardData} disabled={loadingStats}>
            <RefreshCw size={14} className={loadingStats ? 'spin' : ''} /> Refresh
          </button>
        </div>

        {/* Stats grid */}
        <div className="grid-4" style={{ marginBottom: '32px' }}>
          <StatsCard icon="📊" label="Total Reports" value={stats.total_issues} subtitle="Community driven" color="var(--color-primary)" index={0} />
          <StatsCard icon="🔓" label="Open Issues" value={stats.open} subtitle="Awaiting action" color="var(--color-danger)" index={1} />
          <StatsCard icon="⚙️" label="In Progress" value={stats.in_progress} subtitle="Being resolved" color="var(--color-warning)" index={2} />
          <StatsCard icon="✅" label="Resolved" value={stats.resolved} subtitle={`${stats.resolution_rate}% rate`} color="var(--color-accent)" index={3} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Stats row 2 */}
          <StatsCard icon="🔴" label="High Severity" value={stats.high_severity} subtitle="Priority issues" color="var(--color-danger)" index={4} />
          <StatsCard icon="👍" label="Verifications" value={stats.total_verifications} subtitle="Community checks" color="var(--color-info)" index={5} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
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

          {/* Severity donut-style */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>🎯 Severity Distribution</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { label: 'High Priority', pct: severityPct.High, color: 'var(--color-danger)', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
                { label: 'Medium Priority', pct: severityPct.Medium, color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.3)' },
                { label: 'Low Priority', pct: severityPct.Low, color: 'var(--color-accent)', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.3)' },
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

            {/* Resolution rate ring */}
            <div style={{ marginTop: '24px', textAlign: 'center' }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--color-accent-light)', fontFamily: 'var(--font-display)' }}>
                {stats.resolution_rate}%
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Overall Resolution Rate</div>
            </div>
          </div>
        </div>

        {/* Recent Issues Table */}
        <div className="card" style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '20px' }}>🕐 Recent Reports</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  {['Issue', 'Category', 'Severity', 'Status', 'Verifications', 'Reporter'].map((h) => (
                    <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentIssues.map((issue) => (
                  <tr key={issue.id} style={{ borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '12px', maxWidth: '200px' }}>
                      <div style={{ fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{issue.title}</div>
                    </td>
                    <td style={{ padding: '12px' }}><CategoryBadge category={issue.category} /></td>
                    <td style={{ padding: '12px' }}><SeverityBadge severity={issue.severity} /></td>
                    <td style={{ padding: '12px' }}><StatusBadge status={issue.status} /></td>
                    <td style={{ padding: '12px', fontWeight: 700 }}>👍 {issue.verifications}</td>
                    <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{issue.reporter_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Predictive Insights */}
        <div>
          <div style={{ marginBottom: '20px' }}>
            <span className="section-tag"><TrendingUp size={12} /> Gemini AI Predictions</span>
            <h2 style={{ fontSize: '1.5rem', marginTop: '8px' }}>Predictive Infrastructure Insights</h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem' }}>
              AI-powered analysis of historical patterns to forecast infrastructure failures
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {predictions.map((p, i) => (
              <PredictiveInsight key={i} insight={p} index={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
