import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useIssueStore } from '../store/issueStore'
import { StatusBadge, SeverityBadge, CategoryBadge } from '../components/SeverityBadge'
import { Shield, CheckCircle, Clock, AlertTriangle, AlertCircle, Activity, Search, LayoutDashboard, ListTodo, Settings, LogOut } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { useNavigate } from 'react-router-dom'

export default function AdminPortal() {
  const { issues, fetchIssues, updateStatus, loading } = useIssueStore()
  const { logout } = useAuthStore()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('queue')
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => { fetchIssues() }, [])

  const filteredIssues = issues.filter(i => {
    if (filterStatus !== 'All' && i.status !== filterStatus) return false
    if (search && !i.title.toLowerCase().includes(search.toLowerCase()) && !i.address.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const openIssues = issues.filter(i => i.status === 'Open').length
  const inProgressIssues = issues.filter(i => i.status === 'In Progress').length
  const resolvedIssues = issues.filter(i => i.status === 'Resolved').length
  const highSeverity = issues.filter(i => i.severity === 'High' && i.status !== 'Resolved').length

  const handleStatusChange = async (issueId, newStatus) => {
    try {
      await updateStatus(issueId, newStatus)
      toast.success(`Status updated to ${newStatus}`)
      if (newStatus === 'Resolved') {
        const issue = issues.find(i => i.id === issueId)
        setTimeout(() => {
          toast.custom((t) => (
            <div style={{ background: '#25D366', color: 'white', padding: '16px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(37,211,102,0.3)', display: 'flex', gap: '12px', alignItems: 'flex-start', maxWidth: '350px' }}>
              <div style={{ fontSize: '24px' }}>💬</div>
              <div>
                <div style={{ fontWeight: 800, marginBottom: '4px', fontSize: '0.9rem' }}>WhatsApp Notification Sent</div>
                <div style={{ fontSize: '0.82rem', opacity: 0.9 }}>
                  Issue '{issue?.title}' marked resolved. Reporter notified!
                </div>
              </div>
            </div>
          ), { duration: 5000 })
        }, 1000)
      }
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  const handleDepartmentChange = async (issueId, newDept) => {
    try {
      const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
      const res = await fetch(`${API}/api/issues/${issueId}/department`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ department: newDept })
      })
      if (res.ok) { toast.success(`Assigned to ${newDept}`); fetchIssues() }
    } catch (err) { toast.error('Failed to assign department') }
  }

  const handleLogout = () => { logout(); navigate('/') }

  const sidebarItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'queue', icon: ListTodo, label: 'Live Queue', badge: openIssues },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <div style={{ background: '#040810', minHeight: '100vh', paddingTop: 'var(--navbar-height)' }}>
      {/* Admin Header */}
      <div style={{
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-medium)',
        padding: '0',
      }}>
        {/* Mobile top bar with logo */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '12px 20px',
          background: 'linear-gradient(135deg, rgba(59,130,246,0.08), rgba(99,102,241,0.05))',
          borderBottom: '1px solid var(--border-subtle)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: 36, height: 36, borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 16px rgba(59,130,246,0.4)',
            }}>
              <Shield size={18} color="white" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 900, fontSize: '1rem', color: '#60a5fa', lineHeight: 1 }}>
                Gov Command
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
                Admin Portal
              </div>
            </div>
          </div>
          {highSeverity > 0 && (
            <div style={{
              padding: '6px 12px',
              background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-full)', color: 'var(--color-danger-light)',
              fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px',
              fontSize: '0.8rem',
            }}>
              <AlertCircle size={14} /> {highSeverity} Critical
            </div>
          )}
        </div>

        {/* Tab navigation */}
        <div style={{
          display: 'flex', gap: '0', padding: '0 12px',
          overflowX: 'auto', scrollbarWidth: 'none',
        }}>
          {sidebarItems.map(({ id, icon: Icon, label, badge }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '14px 18px',
                background: 'transparent',
                border: 'none',
                borderBottom: activeTab === id ? '2px solid #3b82f6' : '2px solid transparent',
                color: activeTab === id ? '#60a5fa' : 'var(--text-secondary)',
                fontWeight: activeTab === id ? 700 : 500,
                fontSize: '0.875rem', cursor: 'pointer',
                transition: 'all 0.2s', whiteSpace: 'nowrap',
                fontFamily: 'var(--font-body)',
                position: 'relative',
              }}
            >
              <Icon size={16} /> {label}
              {badge > 0 && (
                <span style={{
                  background: '#ef4444', color: 'white',
                  fontSize: '0.65rem', fontWeight: 800,
                  padding: '2px 6px', borderRadius: '10px',
                  boxShadow: '0 0 8px rgba(239,68,68,0.4)',
                  marginLeft: '2px',
                }}>{badge}</span>
              )}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '0 4px' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', background: 'transparent', border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-md)', color: 'var(--text-muted)', cursor: 'pointer',
                fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s', fontFamily: 'var(--font-body)',
                whiteSpace: 'nowrap',
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.borderColor = 'var(--border-medium)'; e.currentTarget.style.background = 'transparent'; }}
            >
              <LogOut size={14} /> <span className="hide-mobile">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: 'clamp(16px, 3vw, 32px)' }}>
        <AnimatePresence mode="wait">

          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, marginBottom: 'clamp(20px, 4vw, 32px)' }}>
                Executive Overview
              </h1>

              <div className="grid-4" style={{ marginBottom: 'clamp(20px, 4vw, 32px)' }}>
                <KpiCard icon={AlertTriangle} title="Open Reports" value={openIssues} color="var(--color-danger)" />
                <KpiCard icon={Activity} title="In Progress" value={inProgressIssues} color="var(--color-warning)" />
                <KpiCard icon={CheckCircle} title="Resolved" value={resolvedIssues} color="var(--color-accent)" />
                <KpiCard icon={Clock} title="Avg. Resolution" value="48h" color="var(--color-primary)" />
              </div>

              <div className="card" style={{
                padding: 'clamp(24px, 4vw, 40px)', textAlign: 'center',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '240px',
                background: 'linear-gradient(135deg, rgba(30,41,59,0.4), rgba(15,23,42,0.4))',
                border: '1px dashed var(--border-medium)', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(59,130,246,0.04) 0%, transparent 70%)' }} />
                <Activity size={40} color="#475569" style={{ marginBottom: '16px', zIndex: 1 }} />
                <h3 style={{ fontSize: '1.1rem', marginBottom: '8px', zIndex: 1 }}>City Heatmap Coming Soon</h3>
                <p style={{ color: 'var(--text-muted)', zIndex: 1, fontSize: '0.85rem', maxWidth: '380px' }}>
                  The geographic analytics module is currently under development.
                </p>
              </div>
            </motion.div>
          )}

          {/* ── QUEUE TAB ── */}
          {activeTab === 'queue' && (
            <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              {/* Queue header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'clamp(16px, 3vw, 24px)', flexWrap: 'wrap', gap: '12px' }}>
                <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900 }}>Live Issue Queue</h1>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', flex: '1', justifyContent: 'flex-end' }}>
                  <div style={{ position: 'relative', flex: '1', minWidth: '160px', maxWidth: '280px' }}>
                    <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" className="form-input" placeholder="Search issues..."
                      style={{ paddingLeft: '36px', height: '40px', fontSize: '0.85rem' }}
                      value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                    style={{ height: '40px', fontSize: '0.85rem', minWidth: '140px', flex: '0 0 auto' }}>
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              {/* Issues — desktop table, mobile cards */}
              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '100px' }} />)}
                </div>
              ) : filteredIssues.length === 0 ? (
                <div className="card empty-state">
                  <div className="empty-state-icon">🔍</div>
                  <p style={{ color: 'var(--text-muted)' }}>No issues found matching your filters.</p>
                </div>
              ) : (
                <>
                  {/* Desktop table */}
                  <div className="card hide-mobile" style={{ overflowX: 'auto', padding: 0 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border-medium)', background: 'rgba(0,0,0,0.15)' }}>
                          {['Issue Details', 'Reporter', 'AI Analysis', 'Action'].map(h => (
                            <th key={h} style={{ padding: '16px 20px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredIssues.map((issue) => (
                          <tr key={issue.id} style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            background: issue.severity === 'High' && issue.status === 'Open' ? 'rgba(239,68,68,0.03)' : 'transparent',
                            transition: 'background 0.2s',
                          }}>
                            <td style={{ padding: '20px', verticalAlign: 'top', maxWidth: '280px' }}>
                              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                                <CategoryBadge category={issue.category} />
                                <SeverityBadge severity={issue.severity} />
                              </div>
                              <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px', color: 'var(--text-primary)', lineHeight: 1.3 }}>{issue.title}</h4>
                              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>📍 {issue.address}</div>
                            </td>
                            <td style={{ padding: '20px', verticalAlign: 'top' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '6px' }}>{issue.reporter_name}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-primary-light)', background: 'var(--color-primary-dim)', display: 'inline-block', padding: '2px 8px', borderRadius: '10px' }}>
                                👍 {issue.verifications} Verified
                              </div>
                            </td>
                            <td style={{ padding: '20px', verticalAlign: 'top', maxWidth: '260px' }}>
                              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                                {issue.ai_description || 'No AI analysis.'}
                              </div>
                              {issue.ai_cost && <div style={{ fontSize: '0.78rem', color: '#fbbf24', marginBottom: '4px', fontWeight: 700 }}>💰 Est. Cost: {issue.ai_cost}</div>}
                              {issue.ai_materials && <div style={{ fontSize: '0.78rem', color: '#a78bfa', marginBottom: '10px' }}>🛠️ {issue.ai_materials}</div>}
                              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#34d399' }}>AI Confidence: {Math.round((issue.ai_confidence || 0.9)*100)}%</div>
                            </td>
                            <td style={{ padding: '20px', verticalAlign: 'top', minWidth: '180px' }}>
                              <div style={{ marginBottom: '12px' }}><StatusBadge status={issue.status} /></div>
                              <select className="form-select" value={issue.status} onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                                style={{ padding: '8px 12px', fontSize: '0.82rem', background: 'var(--bg-elevated)', marginBottom: '8px', width: '100%' }}>
                                <option value="Open">Mark Open</option>
                                <option value="In Progress">Mark In Progress</option>
                                <option value="Resolved">Mark Resolved</option>
                              </select>
                              <select className="form-select" value={issue.department || 'Unassigned'} onChange={(e) => handleDepartmentChange(issue.id, e.target.value)}
                                style={{ padding: '8px 12px', fontSize: '0.82rem', background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)', width: '100%' }}>
                                <option value="Unassigned">Assign Dept...</option>
                                <option value="Roads & Transport">Roads & Transport</option>
                                <option value="Water Dept">Water Dept</option>
                                <option value="Sanitation">Sanitation</option>
                                <option value="Electrical">Electrical</option>
                                <option value="Parks & Rec">Parks & Rec</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile issue cards */}
                  <div className="show-mobile-only" style={{ flexDirection: 'column', gap: '12px' }}>
                    {filteredIssues.map((issue) => (
                      <div key={issue.id} className="admin-issue-card" style={{
                        borderLeft: issue.severity === 'High' && issue.status === 'Open' ? '3px solid var(--color-danger)' : '3px solid var(--border-subtle)',
                      }}>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          <CategoryBadge category={issue.category} />
                          <SeverityBadge severity={issue.severity} />
                          <StatusBadge status={issue.status} />
                        </div>
                        <div>
                          <h4 style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '4px', lineHeight: 1.3 }}>{issue.title}</h4>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>📍 {issue.address}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {issue.reporter_name} · 👍 {issue.verifications} · AI {Math.round((issue.ai_confidence || 0.9)*100)}%
                          </div>
                        </div>
                        {issue.ai_cost && (
                          <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700 }}>💰 Est. Cost: {issue.ai_cost}</div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <select className="form-select" value={issue.status} onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                            style={{ padding: '8px 10px', fontSize: '0.8rem', background: 'var(--bg-elevated)' }}>
                            <option value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                          <select className="form-select" value={issue.department || 'Unassigned'} onChange={(e) => handleDepartmentChange(issue.id, e.target.value)}
                            style={{ padding: '8px 10px', fontSize: '0.8rem', background: 'rgba(59,130,246,0.08)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' }}>
                            <option value="Unassigned">Assign...</option>
                            <option value="Roads & Transport">Roads</option>
                            <option value="Water Dept">Water</option>
                            <option value="Sanitation">Sanitation</option>
                            <option value="Electrical">Electrical</option>
                            <option value="Parks & Rec">Parks</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 900, marginBottom: 'clamp(20px, 4vw, 32px)' }}>
                System Configuration
              </h1>
              <div className="grid-2">
                <div className="card" style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Settings size={18} color="var(--color-primary)" /> Routing Rules
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <ToggleRow label="Auto-route Potholes to Roads Dept" checked={true} />
                    <ToggleRow label="Auto-route Leakages to Water Dept" checked={true} />
                    <ToggleRow label="Auto-route Garbage to Sanitation" checked={true} />
                    <ToggleRow label="Require manual approval for High Cost (>₹50,000)" checked={false} />
                  </div>
                  <button className="btn btn-primary btn-full" style={{ marginTop: '20px', justifyContent: 'center' }} onClick={() => toast.success('Routing rules saved')}>
                    Save Rules
                  </button>
                </div>

                <div className="card" style={{ padding: 'clamp(20px, 3vw, 32px)' }}>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={18} color="var(--color-accent)" /> Notifications & Triggers
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <ToggleRow label="Send WhatsApp to Citizens on Resolution" checked={true} />
                    <ToggleRow label="Send SMS for Critical Severity Alerts" checked={true} />
                    <ToggleRow label="Weekly Council Report Generation" checked={false} />
                  </div>
                  <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-subtle)', paddingTop: '20px' }}>
                    <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Data Export</label>
                    <button className="btn btn-ghost btn-full" style={{ justifyContent: 'center' }} onClick={() => toast.success('CSV Download Started')}>
                      📥 Export Civic Reports (.CSV)
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}

function KpiCard({ icon: Icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: `0 8px 30px ${color}20` }}
      className="kpi-card"
      style={{ borderBottom: `3px solid ${color}` }}
    >
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: `radial-gradient(circle, ${color}12 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Icon size={15} color={color} /> {title}
      </div>
      <div className="kpi-card-value">{value}</div>
    </motion.div>
  )
}

function ToggleRow({ label, checked: initialChecked }) {
  const [checked, setChecked] = useState(initialChecked)
  return (
    <div className="toggle-row">
      <span className="toggle-label">{label}</span>
      <div
        onClick={() => setChecked(!checked)}
        className="toggle-switch"
        style={{ background: checked ? 'var(--color-primary)' : 'var(--bg-surface)', border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--border-medium)'}` }}
      >
        <div className="toggle-thumb" style={{ left: checked ? '22px' : '3px' }} />
      </div>
    </div>
  )
}
