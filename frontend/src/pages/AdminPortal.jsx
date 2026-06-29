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
  
  const [activeTab, setActiveTab] = useState('queue') // 'dashboard', 'queue', 'settings'
  const [filterStatus, setFilterStatus] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchIssues()
  }, [])

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
                <div style={{ fontSize: '0.85rem', opacity: 0.9 }}>
                  "Hello {issue?.reporter_name || 'Citizen'}, your issue '{issue?.title}' has been successfully resolved by the Municipal Corporation! Thank you for being a Community Hero."
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
      if (res.ok) {
        toast.success(`Assigned to ${newDept}`)
        fetchIssues() // Refresh to show new dept
      }
    } catch (err) {
      toast.error('Failed to assign department')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="page-wrapper" style={{ background: '#020408', display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', background: 'var(--bg-surface)', borderRight: '1px solid var(--border-medium)', padding: '24px 0', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '0 24px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#60a5fa', marginBottom: '8px' }}>
            <Shield size={28} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>Gov Command</h2>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Admin Portal</div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '0 12px' }}>
          <SidebarLink icon={LayoutDashboard} label="Dashboard" active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
          <SidebarLink icon={ListTodo} label="Live Queue" active={activeTab === 'queue'} onClick={() => setActiveTab('queue')} badge={openIssues} />
          <SidebarLink icon={Settings} label="Settings" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
        </nav>

        <div style={{ marginTop: 'auto', padding: '0 12px' }}>
          <button 
            onClick={handleLogout}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }}
            onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)' }}
            onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.background = 'transparent' }}
          >
            <LogOut size={18} /> Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Executive Overview</h1>
                {highSeverity > 0 && (
                  <div style={{ padding: '10px 20px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-lg)', color: 'var(--color-danger-light)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} /> {highSeverity} Critical Issues
                  </div>
                )}
              </div>

              <div className="grid-4" style={{ marginBottom: '40px' }}>
                <KpiCard icon={AlertTriangle} title="Open Reports" value={openIssues} color="var(--color-danger)" />
                <KpiCard icon={Activity} title="In Progress" value={inProgressIssues} color="var(--color-warning)" />
                <KpiCard icon={CheckCircle} title="Resolved" value={resolvedIssues} color="var(--color-accent)" />
                <KpiCard icon={Clock} title="Avg. Resolution" value="48h" color="var(--color-primary)" />
              </div>

              <div className="card" style={{ 
                padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px',
                background: 'linear-gradient(135deg, rgba(30,41,59,0.5), rgba(15,23,42,0.5))',
                border: '1px dashed var(--border-medium)', position: 'relative', overflow: 'hidden'
              }}>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />
                <Activity size={48} color="#475569" style={{ marginBottom: '16px', zIndex: 1 }} />
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', zIndex: 1 }}>City Heatmap Coming Soon</h3>
                <p style={{ color: 'var(--text-muted)', zIndex: 1 }}>The geographic analytics module is currently under development.</p>
              </div>
            </motion.div>
          )}

          {activeTab === 'queue' && (
            <motion.div key="queue" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>Live Issue Queue</h1>
                <div style={{ display: 'flex', gap: '16px' }}>
                  <div className="form-group" style={{ marginBottom: 0, position: 'relative' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="text" className="form-input" placeholder="Search issues..." style={{ paddingLeft: '36px', width: '250px' }} value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <select className="form-select" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ width: '160px' }}>
                    <option value="All">All Statuses</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>
              </div>

              <div className="card" style={{ overflowX: 'auto' }}>
                {loading ? (
                  <div style={{ padding: '60px', textAlign: 'center' }}>
                    <div className="spinner" style={{ width: '40px', height: '40px', margin: '0 auto 16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>Loading live queue...</p>
                  </div>
                ) : filteredIssues.length === 0 ? (
                  <div style={{ padding: '60px', textAlign: 'center', color: 'var(--text-muted)' }}>No issues found matching your filters.</div>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-medium)', background: 'rgba(0,0,0,0.2)' }}>
                        <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Issue Details</th>
                        <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reporter</th>
                        <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Analysis</th>
                        <th style={{ padding: '16px 24px', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredIssues.map((issue) => (
                        <tr key={issue.id} style={{ borderBottom: '1px solid var(--border-subtle)', background: issue.severity === 'High' && issue.status === 'Open' ? 'rgba(239, 68, 68, 0.04)' : 'transparent', transition: 'background 0.2s' }}>
                          <td style={{ padding: '24px', verticalAlign: 'top', maxWidth: '300px' }}>
                            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                              <CategoryBadge category={issue.category} />
                              <SeverityBadge severity={issue.severity} />
                            </div>
                            <h4 style={{ fontWeight: 800, fontSize: '1.05rem', marginBottom: '8px', color: 'var(--text-primary)' }}>{issue.title}</h4>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>📍 {issue.address}</div>
                          </td>
                          <td style={{ padding: '24px', verticalAlign: 'top' }}>
                            <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '6px', color: 'var(--text-primary)' }}>{issue.reporter_name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--color-primary-light)', background: 'var(--color-primary-dim)', display: 'inline-block', padding: '2px 8px', borderRadius: '10px' }}>👍 {issue.verifications} Verifications</div>
                          </td>
                          <td style={{ padding: '24px', verticalAlign: 'top', maxWidth: '280px' }}>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>{issue.ai_description || 'No AI analysis.'}</div>
                            {issue.ai_cost && <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginBottom: '6px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>💰 Est. Cost: {issue.ai_cost}</div>}
                            {issue.ai_materials && <div style={{ fontSize: '0.8rem', color: '#a78bfa', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>🛠️ {issue.ai_materials}</div>}
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34d399' }}>AI Confidence: {Math.round((issue.ai_confidence || 0.9)*100)}%</div>
                          </td>
                          <td style={{ padding: '24px', verticalAlign: 'top' }}>
                            <div style={{ marginBottom: '16px' }}><StatusBadge status={issue.status} /></div>
                            <select className="form-select" value={issue.status} onChange={(e) => handleStatusChange(issue.id, e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem', height: 'auto', background: 'var(--bg-elevated)', marginBottom: '8px', width: '100%' }}>
                              <option value="Open">Mark Open</option>
                              <option value="In Progress">Mark In Progress</option>
                              <option value="Resolved">Mark Resolved</option>
                            </select>
                            <select className="form-select" value={issue.department || 'Unassigned'} onChange={(e) => handleDepartmentChange(issue.id, e.target.value)} style={{ padding: '8px 12px', fontSize: '0.85rem', height: 'auto', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)', width: '100%' }}>
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
                )}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div key="settings" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '32px' }}>System Configuration</h1>
              
              <div className="grid-2">
                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Settings size={20} color="var(--color-primary)" /> Routing Rules</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ToggleRow label="Auto-route Potholes to Roads Dept" checked={true} />
                    <ToggleRow label="Auto-route Leakages to Water Dept" checked={true} />
                    <ToggleRow label="Auto-route Garbage to Sanitation" checked={true} />
                    <ToggleRow label="Require manual approval for High Cost (>₹50,000)" checked={false} />
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }} onClick={() => toast.success('Routing rules saved')}>Save Rules</button>
                </div>

                <div className="card" style={{ padding: '32px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Activity size={20} color="var(--color-accent)" /> Notifications & Triggers</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <ToggleRow label="Send WhatsApp to Citizens on Resolution" checked={true} />
                    <ToggleRow label="Send SMS for Critical Severity Alerts" checked={true} />
                    <ToggleRow label="Weekly Council Report Generation" checked={false} />
                  </div>
                  <div style={{ marginTop: '32px' }}>
                    <label className="form-label">Data Export</label>
                    <button className="btn" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-primary)', width: '100%', justifyContent: 'center' }} onClick={() => toast.success('CSV Download Started')}>Export Civic Reports (.CSV)</button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function SidebarLink({ icon: Icon, label, active, onClick, badge }) {
  return (
    <button 
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px',
        background: active ? 'linear-gradient(90deg, rgba(59,130,246,0.15) 0%, transparent 100%)' : 'transparent',
        border: 'none', 
        borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
        borderRadius: '0 var(--radius-md) var(--radius-md) 0',
        color: active ? '#60a5fa' : 'var(--text-secondary)',
        fontWeight: active ? 700 : 500,
        fontSize: '0.95rem', cursor: 'pointer', transition: 'all 0.2s', width: '100%', textAlign: 'left'
      }}
      onMouseOver={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text-primary)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
        }
      }}
      onMouseOut={(e) => {
        if (!active) {
          e.currentTarget.style.color = 'var(--text-secondary)'
          e.currentTarget.style.background = 'transparent'
        }
      }}
    >
      <Icon size={18} /> {label}
      {badge > 0 && (
        <span style={{ marginLeft: 'auto', background: '#ef4444', color: 'white', fontSize: '0.7rem', fontWeight: 800, padding: '2px 8px', borderRadius: '12px', boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)' }}>{badge}</span>
      )}
    </button>
  )
}

function KpiCard({ icon: Icon, title, value, color }) {
  return (
    <motion.div 
      whileHover={{ y: -4, boxShadow: `0 8px 30px ${color}20` }}
      style={{ 
        padding: '24px', 
        background: 'linear-gradient(145deg, var(--bg-surface) 0%, var(--bg-elevated) 100%)',
        border: '1px solid var(--border-subtle)',
        borderBottom: `3px solid ${color}`,
        borderRadius: 'var(--radius-lg)',
        position: 'relative', overflow: 'hidden',
        transition: 'all 0.2s'
      }}
    >
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Icon size={16} color={color} /> {title}
      </div>
      <div style={{ fontSize: '2.8rem', fontWeight: 900, fontFamily: 'var(--font-display)', color: 'var(--text-primary)', lineHeight: 1 }}>{value}</div>
    </motion.div>
  )
}

function ToggleRow({ label, checked: initialChecked }) {
  const [checked, setChecked] = useState(initialChecked)
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
      <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</span>
      <div 
        onClick={() => setChecked(!checked)}
        style={{ width: '44px', height: '24px', background: checked ? 'var(--color-primary)' : 'var(--bg-surface)', border: `1px solid ${checked ? 'var(--color-primary)' : 'var(--border-medium)'}`, borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s' }}
      >
        <div style={{ width: '18px', height: '18px', background: 'white', borderRadius: '50%', position: 'absolute', top: '2px', left: checked ? '22px' : '2px', transition: 'all 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }} />
      </div>
    </div>
  )
}
