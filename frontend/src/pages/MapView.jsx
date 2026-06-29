import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, Layers, RefreshCw, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useIssueStore } from '../store/issueStore'
import IssueCard from '../components/IssueCard'
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/SeverityBadge'

const SEVERITY_COLORS = {
  High: '#ef4444',
  Medium: '#f59e0b',
  Low: '#10b981',
}

const CATEGORY_ICONS = {
  Pothole: '🕳️', 'Water Leakage': '💧', 'Damaged Streetlight': '💡',
  'Garbage Overflow': '🗑️', 'Broken Footpath': '🚶', Encroachment: '🚧',
  'Tree Fallen': '🌳', 'Drainage Blocked': '🌊', 'Road Damage': '🛣️', Other: '📌',
}

// Ahmedabad center
const DEFAULT_CENTER = { lat: 23.0225, lng: 72.5714 }

export default function MapView() {
  const { issues, fetchIssues, loading, filters, setFilters, selectedIssue, setSelectedIssue } = useIssueStore()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  useEffect(() => {
    fetchIssues()
  }, [])

  // Load Google Maps script
  useEffect(() => {
    if (!MAPS_KEY || MAPS_KEY === 'your_google_maps_api_key_here') {
      setMapLoaded(true) // Show fallback
      return
    }
    if (window.google?.maps) { setMapLoaded(true); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=visualization`
    script.async = true
    script.onload = () => setMapLoaded(true)
    document.head.appendChild(script)
    return () => document.head.removeChild(script)
  }, [MAPS_KEY])

  // Init map
  useEffect(() => {
    if (!mapLoaded || !window.google?.maps || map) return
    const m = new window.google.maps.Map(document.getElementById('gmap'), {
      center: DEFAULT_CENTER,
      zoom: 12,
      styles: darkMapStyle,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })
    setMap(m)
  }, [mapLoaded])

  // Place markers when issues/map change
  useEffect(() => {
    if (!map || !issues.length) return

    // Clear old markers
    markers.forEach((m) => m.setMap(null))

    const newMarkers = issues.map((issue) => {
      const color = SEVERITY_COLORS[issue.severity] || '#6366f1'
      const icon = CATEGORY_ICONS[issue.category] || '📌'

      const marker = new window.google.maps.Marker({
        position: { lat: issue.latitude, lng: issue.longitude },
        map,
        title: issue.title,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: issue.status === 'Resolved' ? 8 : 12 + (issue.verifications * 0.5),
          fillColor: issue.status === 'Resolved' ? '#10b981' : color,
          fillOpacity: 0.9,
          strokeColor: 'white',
          strokeWeight: 2,
        },
        animation: window.google.maps.Animation.DROP,
      })

      marker.addListener('click', () => setSelectedIssue(issue))
      return marker
    })

    setMarkers(newMarkers)
  }, [map, issues])

  const filteredIssues = issues.filter((i) => {
    if (filters.status && i.status !== filters.status) return false
    if (filters.severity && i.severity !== filters.severity) return false
    if (filters.category && i.category !== filters.category) return false
    return true
  })

  const hasMapKey = MAPS_KEY && MAPS_KEY !== 'your_google_maps_api_key_here'

  return (
    <div className="page-wrapper">
      <div style={{ display: 'flex', height: 'calc(100vh - var(--navbar-height))', position: 'relative' }}>

        {/* ---- LEFT SIDEBAR ---- */}
        <div style={{
          width: '340px', flexShrink: 0,
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 10,
        }}>
          {/* Header */}
          <div style={{ padding: '16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 800 }}>
                🗺️ Live Issues
                <span style={{
                  marginLeft: '8px', fontSize: '0.72rem', fontWeight: 700,
                  padding: '2px 8px', background: 'var(--color-danger-glow)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-full)', color: 'var(--color-danger-light)',
                }}>
                  {filteredIssues.length} active
                </span>
              </h2>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowFilters(!showFilters)}>
                <Filter size={13} /> Filter
              </button>
            </div>

            {/* Filters */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '8px' }}>
                    <select className="form-select" value={filters.status}
                      onChange={(e) => setFilters({ status: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                      <option value="">All Statuses</option>
                      <option>Open</option>
                      <option>In Progress</option>
                      <option>Resolved</option>
                    </select>
                    <select className="form-select" value={filters.severity}
                      onChange={(e) => setFilters({ severity: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                      <option value="">All Severities</option>
                      <option>High</option>
                      <option>Medium</option>
                      <option>Low</option>
                    </select>
                    <select className="form-select" value={filters.category}
                      onChange={(e) => setFilters({ category: e.target.value })}
                      style={{ fontSize: '0.8rem', padding: '8px 12px' }}>
                      <option value="">All Categories</option>
                      {Object.keys(CATEGORY_ICONS).map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ status: '', severity: '', category: '' })}>
                      <X size={12} /> Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Issue list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: '80px' }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredIssues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{
                      padding: '12px',
                      background: selectedIssue?.id === issue.id ? 'rgba(99,102,241,0.1)' : 'var(--bg-elevated)',
                      border: selectedIssue?.id === issue.id ? '1px solid var(--color-primary)' : '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onClick={() => {
                      setSelectedIssue(issue)
                      if (map) map.panTo({ lat: issue.latitude, lng: issue.longitude })
                    }}
                    whileHover={{ borderColor: 'var(--border-medium)' }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, flex: 1, marginRight: '8px' }}>{issue.title}</span>
                      <SeverityBadge severity={issue.severity} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <StatusBadge status={issue.status} />
                      <span className="tag" style={{ fontSize: '0.68rem' }}>
                        👍 {issue.verifications}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Report button */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => navigate('/report')}>
              <Plus size={15} /> Report New Issue
            </button>
          </div>
        </div>

        {/* ---- MAP AREA ---- */}
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          {hasMapKey ? (
            <div id="gmap" style={{ width: '100%', height: '100%' }} />
          ) : (
            <FallbackMap issues={filteredIssues} selectedIssue={selectedIssue} onSelect={setSelectedIssue} />
          )}

          {/* Issue popup */}
          <AnimatePresence>
            {selectedIssue && (
              <div style={{
                position: 'absolute', bottom: '24px', right: '24px', zIndex: 20,
              }}>
                <IssueCard issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
              </div>
            )}
          </AnimatePresence>

          {/* Map legend */}
          <div style={{
            position: 'absolute', top: '16px', right: '16px', zIndex: 10,
            background: 'rgba(8,13,26,0.9)', backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Layers size={10} style={{ display: 'inline', marginRight: '4px' }} /> Severity
            </div>
            {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
              <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{sev}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Resolved</span>
            </div>
          </div>

          {/* Refresh */}
          <button
            className="btn btn-ghost btn-sm"
            onClick={fetchIssues}
            style={{
              position: 'absolute', top: '16px', left: '16px', zIndex: 10,
              background: 'rgba(8,13,26,0.9)', backdropFilter: 'blur(12px)',
            }}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>
    </div>
  )
}

/** Beautiful CSS fallback map when no Google Maps key */
function FallbackMap({ issues, selectedIssue, onSelect }) {
  const [hovered, setHovered] = useState(null)

  // Normalize coordinates to percentage positions within Ahmedabad bbox
  const LAT_MIN = 22.95, LAT_MAX = 23.10
  const LNG_MIN = 72.45, LNG_MAX = 72.65

  const toPos = (lat, lng) => ({
    left: `${((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100}%`,
    top: `${((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100}%`,
  })

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #0a1628 0%, #0d1f3c 50%, #071428 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.06 }}>
        {[...Array(12)].map((_, i) => (
          <g key={i}>
            <line x1={`${(i + 1) * 100/12}%`} y1="0" x2={`${(i + 1) * 100/12}%`} y2="100%" stroke="#6366f1" strokeWidth="1" />
            <line x1="0" y1={`${(i + 1) * 100/12}%`} x2="100%" y2={`${(i + 1) * 100/12}%`} stroke="#6366f1" strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* Road-like paths */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.15 }}>
        <path d="M 0 45% Q 30% 42% 50% 48% T 100% 44%" stroke="#94a3b8" strokeWidth="6" fill="none" />
        <path d="M 15% 0 L 15% 100%" stroke="#94a3b8" strokeWidth="4" fill="none" />
        <path d="M 60% 0 L 55% 100%" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <path d="M 0 75% Q 40% 72% 100% 74%" stroke="#94a3b8" strokeWidth="5" fill="none" />
        <path d="M 0 25% L 100% 22%" stroke="#94a3b8" strokeWidth="3" fill="none" />
      </svg>

      {/* Ahmedabad label */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: '0.65rem', color: 'rgba(148,163,184,0.3)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.3em', textAlign: 'center',
      }}>
        AHMEDABAD<br />CITY MAP
      </div>

      {/* Issue pins */}
      {issues.map((issue) => {
        const pos = toPos(issue.latitude, issue.longitude)
        const color = SEVERITY_COLORS[issue.severity] || '#6366f1'
        const size = issue.status === 'Resolved' ? 16 : 14 + Math.min(issue.verifications, 10)
        const isSelected = selectedIssue?.id === issue.id

        return (
          <div
            key={issue.id}
            onClick={() => onSelect(issue)}
            onMouseEnter={() => setHovered(issue.id)}
            onMouseLeave={() => setHovered(null)}
            style={{
              position: 'absolute',
              left: pos.left, top: pos.top,
              transform: 'translate(-50%, -50%)',
              zIndex: isSelected ? 20 : hovered === issue.id ? 15 : 5,
              cursor: 'pointer',
            }}
          >
            {/* Pulse ring */}
            {issue.status !== 'Resolved' && (
              <div style={{
                position: 'absolute', inset: -6,
                borderRadius: '50%', border: `2px solid ${color}`,
                animation: 'pulse-ring 2.5s ease-out infinite',
              }} />
            )}
            {/* Pin dot */}
            <div style={{
              width: isSelected ? size + 8 : size,
              height: isSelected ? size + 8 : size,
              borderRadius: '50%',
              background: issue.status === 'Resolved' ? '#10b981' : color,
              border: `3px solid ${isSelected ? 'white' : 'rgba(255,255,255,0.4)'}`,
              boxShadow: `0 0 ${isSelected ? 20 : 10}px ${color}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: isSelected ? '0.9rem' : '0.6rem',
              transition: 'all 0.2s',
            }}>
              {CATEGORY_ICONS[issue.category] || '📌'}
            </div>
          </div>
        )
      })}

      {/* No key notice */}
      <div style={{
        position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
        background: 'rgba(8,13,26,0.9)', backdropFilter: 'blur(12px)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
        padding: '10px 20px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center',
        whiteSpace: 'nowrap',
      }}>
        🗺️ Add <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>frontend/.env</code> for full Google Maps
      </div>
    </div>
  )
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0d1f3c' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0d1f3c' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4b5563' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e3a5f' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#0a1628' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#2d5a8e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#071428' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
]
