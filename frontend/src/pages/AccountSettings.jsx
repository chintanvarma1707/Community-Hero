import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { User, Mail, Phone, Shield, Zap, Award, FileText, CheckCircle, LogOut, Save, Plus, ExternalLink } from 'lucide-react'
import { useAuthStore } from '../store/authStore'
import { useIssueStore } from '../store/issueStore'
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/SeverityBadge'

const EMOJI_OPTIONS = ['🦸', '🌟', '🔥', '💎', '⚡', '🌸', '🎯', '🌈', '👑', '🛡️', '🚀', '🦁']

export default function AccountSettings() {
  const navigate = useNavigate()
  const { user, isLoggedIn, logout, updateUser } = useAuthStore()
  const { issues, fetchIssues, setSelectedIssue } = useIssueStore()

  const [activeTab, setActiveTab] = useState('overview') // 'overview' | 'settings'
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar_emoji: user?.avatar_emoji || '🦸',
    notifyEmail: true,
    notifySms: true,
    notifyNewsletter: false,
  })
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    fetchIssues()
  }, [])

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar_emoji: user.avatar_emoji || '🦸',
        notifyEmail: true,
        notifySms: true,
        notifyNewsletter: false,
      })
    }
  }, [user])

  if (!isLoggedIn) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: '600px', paddingTop: '80px', textAlign: 'center' }}>
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{
              padding: '60px 40px', background: 'var(--bg-surface)',
              border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-xl)',
              boxShadow: 'var(--shadow-lg)'
            }}
          >
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Account Access Required</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
              Please click "Join Now" in the navigation bar to create your Citizen Hero account and unlock your personalized dashboard.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }

  // Filter issues reported by current user
  const myIssues = issues.filter((i) => i.reporter_id === 9 || i.reporter_name === user.name)

  const handleSaveSettings = (e) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      updateUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar_emoji: formData.avatar_emoji,
      })
      setIsSaving(false)
      toast.success('⚙️ Account settings updated successfully!')
    }, 400)
  }

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '1000px', paddingTop: 'clamp(20px, 4vw, 40px)', paddingBottom: '80px' }}>
        
        {/* ---- HERO PROFILE HEADER ---- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'relative', overflow: 'hidden',
            padding: 'clamp(20px, 4vw, 40px)', marginBottom: 'clamp(16px, 3vw, 32px)',
            background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(16,185,129,0.05) 100%)',
            border: '1px solid var(--border-primary)',
            borderRadius: 'var(--radius-xl)',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(16px, 3vw, 28px)', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            {/* Avatar Badge */}
            <div style={{
              width: 96, height: 96,
              background: 'var(--bg-elevated)',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-lg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3.5rem', boxShadow: '0 0 30px var(--color-primary-glow)',
            }}>
              {user.avatar_emoji}
            </div>

            {/* User Info */}
            <div style={{ flex: 1, minWidth: '260px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 2.2rem)', fontWeight: 900, fontFamily: 'var(--font-display)', margin: 0 }}>
                  {user.name}
                </h1>
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: '4px',
                  padding: '4px 12px', background: 'var(--color-primary-dim)',
                  border: '1px solid var(--color-primary)', borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-primary-light)',
                }}>
                  <Shield size={12} /> Civic Member
                </span>
              </div>

              {/* Contact metadata */}
              <div style={{ display: 'flex', gap: '20px', color: 'var(--text-secondary)', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="var(--text-muted)" /> {user.email || 'No email provided'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={14} color="var(--text-muted)" /> {user.phone || 'No phone provided'}
                </div>
              </div>
            </div>

            {/* Total Points Display */}
            <div style={{
              background: 'rgba(8,13,26,0.8)', backdropFilter: 'blur(10px)',
              border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-lg)',
              padding: '20px 28px', textAlign: 'center', minWidth: '160px',
            }}>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--color-warning-light)', fontFamily: 'var(--font-display)' }}>
                <Zap size={22} style={{ display: 'inline', marginRight: '4px' }} />{user.points}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Civic Points
              </div>
            </div>
          </div>
        </motion.div>

        {/* ---- METRICS GRID ---- */}
        <div className="grid-4" style={{ marginBottom: 'clamp(20px, 4vw, 36px)' }}>
          <div className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📋</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)' }}>
              {user.reports_count || myIssues.length}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Issues Reported</div>
          </div>

          <div className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🎯</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent-light)', fontFamily: 'var(--font-display)' }}>
              {user.resolved_count || myIssues.filter((i) => i.status === 'Resolved').length}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Issues Solved</div>
          </div>

          <div className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>👍</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#3b82f6', fontFamily: 'var(--font-display)' }}>
              {user.verifications_count}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Verifications Done</div>
          </div>

          <div className="card" style={{ padding: '24px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🏆</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-warning-light)', fontFamily: 'var(--font-display)' }}>
              {user.badges?.length || 1}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '4px' }}>Badges Earned</div>
          </div>
        </div>

        {/* ---- TABS NAVIGATION ---- */}
        <div style={{
          display: 'flex', gap: '10px', borderBottom: '1px solid var(--border-subtle)',
          marginBottom: 'clamp(20px, 4vw, 32px)', paddingBottom: '14px',
          justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('overview')}
              style={{ gap: '8px' }}
            >
              <FileText size={16} /> My Reported Issues
            </button>
            <button
              className={`btn ${activeTab === 'settings' ? 'btn-primary' : 'btn-ghost'}`}
              onClick={() => setActiveTab('settings')}
              style={{ gap: '8px' }}
            >
              <Shield size={16} /> Account Settings
            </button>
          </div>

          <button className="btn btn-ghost" style={{ color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.3)' }} onClick={handleLogout}>
            <LogOut size={15} /> Log Out
          </button>
        </div>

        {/* ---- TAB CONTENT 1: MY ISSUES ---- */}
        {activeTab === 'overview' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 800 }}>📌 Issues You Raised & Their Status</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
                  Live tracking of municipal response, AI confidence, and community verifications.
                </p>
              </div>
              <button className="btn btn-primary" onClick={() => navigate('/report')}>
                <Plus size={16} /> Report New Issue
              </button>
            </div>

            {myIssues.length === 0 ? (
              <div style={{
                padding: '64px 32px', textAlign: 'center',
                background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)'
              }}>
                <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📭</div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '8px' }}>No Issues Reported Yet</h3>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  You haven't submitted any infrastructure reports yet. When you report a pothole, water leak, or broken streetlight, you can track its complete resolution journey right here.
                </p>
                <button className="btn btn-primary btn-lg" onClick={() => navigate('/report')}>
                  <Plus size={18} /> Report Your First Issue
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myIssues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    style={{
                      padding: '24px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex', gap: '24px', alignItems: 'center',
                      justifyContent: 'space-between', flexWrap: 'wrap',
                    }}
                    whileHover={{ borderColor: 'var(--border-medium)', boxShadow: 'var(--shadow-md)' }}
                  >
                    <div style={{ flex: 1, minWidth: '280px' }}>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <CategoryBadge category={issue.category} />
                        <SeverityBadge severity={issue.severity} />
                        <StatusBadge status={issue.status} />
                      </div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
                        {issue.title}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.5 }}>
                        {issue.description || issue.ai_description || 'No description provided.'}
                      </p>
                      <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap' }}>
                        <span>📍 {issue.address}</span>
                        <span>🤖 AI Confidence: {Math.round((issue.ai_confidence || 0.9) * 100)}%</span>
                        <span>👍 {issue.verifications} Community Verifications</span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          setSelectedIssue(issue)
                          navigate('/map')
                        }}
                        style={{ gap: '8px' }}
                      >
                        <ExternalLink size={15} /> View on Map
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to permanently delete this issue?')) {
                            useIssueStore.getState().deleteIssue(issue.id)
                            toast.success('Issue deleted successfully')
                          }
                        }}
                        style={{ gap: '8px', color: 'var(--color-danger)', border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        🗑️ Delete Issue
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ---- TAB CONTENT 2: SETTINGS & EDIT ---- */}
        {activeTab === 'settings' && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div style={{
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-xl)', padding: 'clamp(20px, 4vw, 40px)'
            }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>
                ⚙️ Full Account Settings & Profile Edit
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
                Update your contact details, choose your hero avatar, and configure notifications.
              </p>

              <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                
                {/* Contact inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Full Name *</label>
                    <input
                      className="form-input"
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Email Address *</label>
                    <input
                      className="form-input"
                      type="email"
                      required
                      placeholder="e.g. citizen@ahmedabad.gov.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem' }}>Phone Number *</label>
                    <input
                      className="form-input"
                      type="tel"
                      required
                      placeholder="e.g. +91 9876543210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Avatar selection */}
                <div className="form-group">
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: '12px' }}>
                    Choose Your Hero Avatar Emoji
                  </label>
                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => setFormData({ ...formData, avatar_emoji: emoji })}
                        style={{
                          width: 54, height: 54,
                          background: formData.avatar_emoji === emoji ? 'var(--color-primary-dim)' : 'var(--bg-elevated)',
                          border: `2px solid ${formData.avatar_emoji === emoji ? 'var(--color-primary)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-md)',
                          fontSize: '1.8rem',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          cursor: 'pointer', transition: 'all 0.2s',
                          boxShadow: formData.avatar_emoji === emoji ? '0 0 16px var(--color-primary-glow)' : 'none',
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notifications toggles */}
                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '20px' }}>🔔 Notification Preferences</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.notifyEmail}
                        onChange={(e) => setFormData({ ...formData, notifyEmail: e.target.checked })}
                        style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Email alerts on issue updates</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Get notified instantly when municipal authorities update your issue status.</div>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.notifySms}
                        onChange={(e) => setFormData({ ...formData, notifySms: e.target.checked })}
                        style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>SMS notifications for Resolved issues</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Receive a quick text message as soon as your reported problem is fully resolved.</div>
                      </div>
                    </label>

                    <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.notifyNewsletter}
                        onChange={(e) => setFormData({ ...formData, notifyNewsletter: e.target.checked })}
                        style={{ width: 18, height: 18, accentColor: 'var(--color-primary)' }}
                      />
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700 }}>Weekly City Impact Summary</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Receive a weekly newsletter showing overall city improvements and top leaderboard heroes.</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '28px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary btn-lg" disabled={isSaving} style={{ gap: '10px' }}>
                    {isSaving ? <div className="spinner" /> : <Save size={18} />}
                    {isSaving ? 'Saving Changes...' : 'Save All Settings'}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
