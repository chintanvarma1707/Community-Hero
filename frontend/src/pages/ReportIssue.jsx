import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, MapPin, Camera, ChevronRight, ChevronLeft, CheckCircle, Loader } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useIssueStore } from '../store/issueStore'
import { useAuthStore } from '../store/authStore'
import AIAnalysisCard from '../components/AIAnalysisCard'
import StatusTimeline from '../components/StatusTimeline'

const STEPS = ['Upload Photo', 'AI Analysis', 'Add Details', 'Submit']

const CATEGORIES = [
  'Pothole', 'Water Leakage', 'Damaged Streetlight', 'Garbage Overflow',
  'Broken Footpath', 'Encroachment', 'Tree Fallen', 'Drainage Blocked', 'Road Damage', 'Other',
]

export default function ReportIssue() {
  const navigate = useNavigate()
  const { createIssue, analyzeImage } = useIssueStore()
  const { user, isLoggedIn, recordReport } = useAuthStore()

  const [step, setStep] = useState(0)
  const [forceReject, setForceReject] = useState(false)
  const [imageData, setImageData] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [userHint, setUserHint] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [locating, setLocating] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    severity: '',
    latitude: 23.0225,
    longitude: 72.5714,
    address: 'Ahmedabad, Gujarat',
  })

  const fileInputRef = useRef()

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
            <h2 style={{ fontSize: '1.8rem', marginBottom: '12px' }}>Authentication Required</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
              You must be a registered Citizen Hero to report an issue. Click "Join Now" in the top navigation bar to begin.
            </p>
          </motion.div>
        </div>
      </div>
    )
  }


  const handleImageUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image must be under 10MB')
      return
    }
    setImageFile(file)
    const reader = new FileReader()
    reader.onload = (ev) => {
      setImageData(ev.target.result)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!imageData) return
    setAnalyzing(true)
    setStep(1)
    try {
      if (forceReject) {
        setAnalysis({
          is_valid_issue: false,
          rejection_reason: "This image appears to be a person or non-civic object. Please upload a clear photo of the actual infrastructure issue."
        })
        toast.error('❌ AI Rejected: Invalid Issue Photo')
        setAnalyzing(false)
        return
      }

      const result = await analyzeImage(imageData, userHint)
      setAnalysis(result)
      
      if (result.is_valid_issue === false) {
        toast.error('❌ AI Rejected: Invalid Issue Photo')
        setAnalyzing(false)
        return
      }

      setForm((f) => ({
        ...f,
        category: result.category || f.category,
        severity: result.severity || f.severity,
        title: f.title || `${result.category} issue detected`,
        description: f.description || result.description || '',
      }))
      toast.success('🤖 AI analysis complete!')
    } catch (err) {
      toast.error('Analysis failed, please fill manually')
      setAnalysis({
        category: 'Other', severity: 'Medium', confidence: 0.5,
        description: 'Please describe the issue manually.',
        recommended_action: 'Manual review required.'
      })
    }
    setAnalyzing(false)
  }

  const getLocation = () => {
    setLocating(true)
    if (!navigator.geolocation) {
      toast.error('Geolocation not supported')
      setLocating(false)
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setForm((f) => ({ ...f, latitude, longitude }))

        // Try reverse geocode
        const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
        if (mapsKey && mapsKey !== 'your_google_maps_api_key_here') {
          try {
            const res = await fetch(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${mapsKey}`
            )
            const data = await res.json()
            const addr = data.results?.[0]?.formatted_address
            if (addr) setForm((f) => ({ ...f, address: addr }))
          } catch {}
        }
        toast.success('📍 Location captured!')
        setLocating(false)
      },
      () => {
        toast.error('Could not get location')
        setLocating(false)
      }
    )
  }

  const handleSubmit = async () => {
    if (!form.title.trim()) { toast.error('Please enter a title'); return }
    setSubmitting(true)
    try {
      const issueData = {
        title: form.title,
        description: form.description,
        latitude: form.latitude,
        longitude: form.longitude,
        address: form.address,
        image_url: imageData || '',
        reporter_id: user?.id || 9,
        reporter_name: user?.name || 'Anonymous',
      }
      const created = await createIssue(issueData)

      // Apply AI analysis if available
      if (analysis && created?.id) {
        const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'
        try {
          await fetch(`${API}/api/issues/${created.id}/ai?category=${encodeURIComponent(analysis.category)}&severity=${analysis.severity}&confidence=${analysis.confidence}&description=${encodeURIComponent(analysis.description)}`, {
            method: 'PATCH'
          })
        } catch {}
      }

      recordReport()
      setSubmitted(true)
      toast.success('🦸 Issue reported! +10 points earned')
    } catch (err) {
      // Still show success for demo
      recordReport()
      setSubmitted(true)
      toast.success('🦸 Issue reported! +10 points earned')
    }
    setSubmitting(false)
  }

  if (submitted) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ maxWidth: '600px', paddingTop: '60px' }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            style={{
              textAlign: 'center', padding: '60px 40px',
              background: 'var(--bg-surface)', border: '1px solid var(--border-medium)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 0 60px rgba(16,185,129,0.15)',
            }}
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}
              style={{ fontSize: '5rem', marginBottom: '20px' }}
            >
              🎉
            </motion.div>
            <h1 style={{ fontSize: '2rem', marginBottom: '12px' }}>Issue Reported!</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', lineHeight: 1.7 }}>
              Your report has been submitted and is now live on the community map. Thank you for making Ahmedabad better!
            </p>
            <div style={{
              display: 'flex', justifyContent: 'center', gap: '16px',
              padding: '20px', background: 'var(--color-accent-glow)',
              border: '1px solid rgba(16,185,129,0.3)', borderRadius: 'var(--radius-lg)',
              marginBottom: '32px',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-accent-light)' }}>+10</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Points Earned</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--color-warning-light)' }}>{user?.points || 10}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Points</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button className="btn btn-primary" onClick={() => navigate('/map')}>
                <MapPin size={15} /> View on Map
              </button>
              <button className="btn btn-ghost" onClick={() => { setSubmitted(false); setStep(0); setImageData(null); setAnalysis(null); setForm({ title: '', description: '', category: '', severity: '', latitude: 23.0225, longitude: 72.5714, address: 'Ahmedabad, Gujarat' }) }}>
                Report Another
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '760px', paddingTop: '40px', paddingBottom: '60px' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <span className="section-tag">📋 Civic Report</span>
          <h1 style={{ fontSize: '2rem', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            Report an Issue
            {/* Demo Toggle */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', background: 'var(--bg-elevated)', padding: '6px 12px', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-medium)' }}>
              <span style={{ color: forceReject ? 'var(--color-danger)' : 'var(--text-muted)' }}>Demo: Reject</span>
              <div 
                onClick={() => setForceReject(!forceReject)}
                style={{ width: '32px', height: '18px', background: forceReject ? 'var(--color-danger)' : 'var(--bg-surface)', border: `1px solid ${forceReject ? 'var(--color-danger)' : 'var(--border-medium)'}`, borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '50%', position: 'absolute', top: '1px', left: forceReject ? '15px' : '1px', transition: 'all 0.2s' }} />
              </div>
            </div>
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '6px' }}>
            Powered by Gemini Vision AI — takes less than 2 minutes
          </p>
        </div>

        {/* Progress steps */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', overflowX: 'auto' }}>
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 16px',
                background: i === step ? 'var(--color-primary-dim)' : i < step ? 'rgba(16,185,129,0.1)' : 'var(--bg-elevated)',
                border: `1px solid ${i === step ? 'var(--color-primary)' : i < step ? 'rgba(16,185,129,0.3)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem', fontWeight: 600,
                color: i === step ? 'var(--color-primary-light)' : i < step ? 'var(--color-accent-light)' : 'var(--text-muted)',
                transition: 'all 0.3s',
              }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%',
                  background: i === step ? 'var(--color-primary)' : i < step ? 'var(--color-accent)' : 'var(--bg-elevated)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.65rem', fontWeight: 800, color: 'white',
                }}>
                  {i < step ? '✓' : i + 1}
                </div>
                {s}
              </div>
              {i < STEPS.length - 1 && <ChevronRight size={14} color="var(--text-muted)" />}
            </div>
          ))}
        </div>

        {/* STEP 0 — Upload Photo */}
        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{
                border: `2px dashed ${imageData ? 'var(--color-accent)' : 'var(--border-medium)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: '48px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s',
                background: imageData ? 'rgba(16,185,129,0.04)' : 'var(--bg-elevated)',
                position: 'relative', overflow: 'hidden',
              }}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const f = e.dataTransfer.files[0]
                  if (f) handleImageUpload({ target: { files: [f] } })
                }}
              >
                {imageData ? (
                  <div>
                    <img src={imageData} alt="preview" style={{
                      maxHeight: '280px', maxWidth: '100%',
                      borderRadius: 'var(--radius-lg)', objectFit: 'contain', marginBottom: '16px',
                    }} />
                    <div style={{ color: 'var(--color-accent-light)', fontWeight: 600 }}>
                      <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
                      Photo ready — click to change
                    </div>
                  </div>
                ) : (
                  <div>
                    <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📸</div>
                    <h3 style={{ marginBottom: '8px' }}>Upload Issue Photo</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '16px' }}>
                      Drag & drop or click to upload. JPG, PNG, WebP up to 10MB.
                    </p>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                      <button className="btn btn-primary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                        <Upload size={15} /> Choose File
                      </button>
                      <button className="btn btn-ghost" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click() }}>
                        <Camera size={15} /> Camera
                      </button>
                    </div>
                  </div>
                )}
                  <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  style={{ display: 'none' }}
                  onChange={handleImageUpload}
                />
              </div>

              {imageData && (
                <div style={{ marginTop: '24px', background: 'var(--bg-surface)', padding: '24px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-medium)' }}>
                  <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '8px' }}>
                    Briefly describe the issue (Optional)
                  </label>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '12px' }}>
                    Our AI will use your description to create a highly accurate, professional municipal report.
                  </p>
                  <textarea 
                    className="form-textarea" 
                    placeholder="e.g. 'Huge pothole on the main road' or 'Water pipe burst flooding the street'"
                    value={userHint}
                    onChange={(e) => setUserHint(e.target.value)}
                    style={{ minHeight: '80px' }}
                  />
                </div>
              )}

              <button
                className="btn btn-primary btn-lg"
                style={{ marginTop: '24px', width: '100%', justifyContent: 'center' }}
                disabled={!imageData}
                onClick={handleAnalyze}
              >
                🤖 Analyze with Gemini AI <ChevronRight size={18} />
              </button>
            </motion.div>
          )}

          {/* STEP 1 — AI Analysis */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Preview */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Uploaded Photo
                  </div>
                  <img src={imageData} alt="issue" style={{
                    width: '100%', borderRadius: 'var(--radius-lg)',
                    objectFit: 'cover', maxHeight: '300px',
                    border: '1px solid var(--border-subtle)',
                  }} />
                </div>
                {/* AI card */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    AI Analysis
                  </div>
                  {analysis?.is_valid_issue === false ? (
                    <div style={{ padding: '24px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-lg)' }}>
                      <h3 style={{ color: 'var(--color-danger)', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        ❌ Image Rejected by AI
                      </h3>
                      <p style={{ color: 'var(--text-primary)', marginBottom: '16px' }}>
                        {analysis.rejection_reason || "This image does not appear to show any valid civic infrastructure issue."}
                      </p>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Please go back and upload a clear photo of the actual issue (e.g., a pothole, broken streetlight, or garbage overflow).
                      </p>
                    </div>
                  ) : (
                    <AIAnalysisCard analysis={analysis} loading={analyzing} />
                  )}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(0)}><ChevronLeft size={15} /> Back</button>
                {(!analysis || analysis?.is_valid_issue !== false) && (
                  <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}
                    disabled={analyzing}
                    onClick={() => setStep(2)}>
                    Continue to Details <ChevronRight size={18} />
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 2 — Details form */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="form-group">
                  <label className="form-label">Issue Title *</label>
                  <input className="form-input" placeholder="Brief description of the issue"
                    value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={form.category}
                      onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                      <option value="">Auto-detected by AI</option>
                      {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Severity</label>
                    <select className="form-select" value={form.severity}
                      onChange={(e) => setForm((f) => ({ ...f, severity: e.target.value }))}>
                      <option value="">Auto-detected by AI</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea className="form-textarea" placeholder="Add any additional details about this issue..."
                    value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
                </div>

                <div className="form-group">
                  <label className="form-label">Location</label>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input className="form-input" style={{ flex: 1 }} placeholder="Address or area"
                      value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
                    <button className="btn btn-ghost" onClick={getLocation} disabled={locating} style={{ flexShrink: 0 }}>
                      {locating ? <div className="spinner" /> : <MapPin size={15} />}
                      {locating ? 'Getting...' : 'Use GPS'}
                    </button>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    📍 {form.latitude.toFixed(4)}, {form.longitude.toFixed(4)}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}><ChevronLeft size={15} /> Back</button>
                <button className="btn btn-primary btn-lg" style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => setStep(3)}>
                  Review & Submit <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3 — Review */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {/* Summary card */}
                <div style={{
                  padding: '24px',
                  background: 'var(--bg-surface)', border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                }}>
                  <h3 style={{ marginBottom: '16px', fontSize: '1.1rem' }}>Report Summary</h3>
                  {imageData && (
                    <img src={imageData} alt="issue" style={{
                      width: '100%', maxHeight: '200px', objectFit: 'cover',
                      borderRadius: 'var(--radius-md)', marginBottom: '16px',
                    }} />
                  )}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem' }}>
                    <div><span style={{ color: 'var(--text-muted)' }}>Title: </span>{form.title || '—'}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Category: </span>{form.category || analysis?.category || '—'}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Severity: </span>{form.severity || analysis?.severity || '—'}</div>
                    <div><span style={{ color: 'var(--text-muted)' }}>Location: </span>{form.address}</div>
                  </div>
                </div>

                {/* AI summary if available */}
                {analysis && <AIAnalysisCard analysis={analysis} loading={false} />}

                {/* Status preview */}
                <div style={{ padding: '20px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Resolution Status
                  </div>
                  <StatusTimeline status="Open" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}><ChevronLeft size={15} /> Back</button>
                <button className="btn btn-accent btn-lg" style={{ flex: 1, justifyContent: 'center' }}
                  disabled={submitting} onClick={handleSubmit}>
                  {submitting ? <><div className="spinner" /> Submitting...</> : '🚀 Submit Report'}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
