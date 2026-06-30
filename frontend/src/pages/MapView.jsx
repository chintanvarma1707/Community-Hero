import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, X, Layers, RefreshCw, Plus, ChevronUp, ChevronDown, List } from 'lucide-react'
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

const DEFAULT_CENTER = { lat: 23.0225, lng: 72.5714 }

export default function MapView() {
  const { issues, fetchIssues, loading, filters, setFilters, selectedIssue, setSelectedIssue } = useIssueStore()
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false) // for mobile
  const navigate = useNavigate()

  const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

  useEffect(() => { fetchIssues() }, [])

  useEffect(() => {
    if (!MAPS_KEY || MAPS_KEY === 'your_google_maps_api_key_here') {
      setMapLoaded(true)
      return
    }
    if (window.google?.maps) { setMapLoaded(true); return }
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=visualization`
    script.async = true
    script.onload = () => setMapLoaded(true)
    document.head.appendChild(script)
    return () => { try { document.head.removeChild(script) } catch(e) {} }
  }, [MAPS_KEY])

  useEffect(() => {
    if (!mapLoaded || !window.google?.maps || map) return
    const m = new window.google.maps.Map(document.getElementById('gmap'), {
      center: DEFAULT_CENTER, zoom: 12,
      styles: darkMapStyle,
      disableDefaultUI: false,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    })
    setMap(m)
  }, [mapLoaded])

  useEffect(() => {
    if (!map || !issues.length) return
    markers.forEach((m) => m.setMap(null))
    const newMarkers = issues.map((issue) => {
      const color = SEVERITY_COLORS[issue.severity] || '#6366f1'
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
      marker.addListener('click', () => {
        setSelectedIssue(issue)
        setSidebarOpen(true)
      })
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
    <div style={
      {
        position: 'fixed',
        top: 'var(--navbar-height)',
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        overflow: 'hidden',
      }
    }>
      <div style={{ display: 'flex', width: '100%', height: '100%', position: 'relative' }}>

        {/* ── Overlay for mobile (when sidebar open) ── */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 30,
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(4px)',
            }}
          />
        )}

        {/* ── LEFT SIDEBAR (desktop fixed, mobile bottom sheet) ── */}
        <div style={{
          width: '320px',
          flexShrink: 0,
          background: 'rgba(9, 14, 26, 0.97)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          zIndex: 40,
          overflowY: 'hidden',
        }} className="map-sidebar-desktop">


          {/* Sidebar Header */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                🗺️ Live Issues
                <span style={{
                  fontSize: '0.7rem', fontWeight: 700,
                  padding: '2px 8px', background: 'var(--color-danger-glow)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 'var(--radius-full)', color: 'var(--color-danger-light)',
                }}>
                  {filteredIssues.length} active
                </span>
              </h2>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setShowFilters(!showFilters)} style={{ padding: '5px 10px', fontSize: '0.78rem' }}>
                  <Filter size={12} /> Filter
                </button>
                {/* Close button for mobile */}
                <button
                  className="show-mobile-only btn btn-ghost btn-sm"
                  style={{ padding: '5px 8px' }}
                  onClick={() => setSidebarOpen(false)}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Filter panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', paddingTop: '8px' }}>
                    <select className="form-select" value={filters.status}
                      onChange={(e) => setFilters({ status: e.target.value })}
                      style={{ fontSize: '0.78rem', padding: '7px 12px' }}>
                      <option value="">All Statuses</option>
                      <option>Open</option><option>In Progress</option><option>Resolved</option>
                    </select>
                    <select className="form-select" value={filters.severity}
                      onChange={(e) => setFilters({ severity: e.target.value })}
                      style={{ fontSize: '0.78rem', padding: '7px 12px' }}>
                      <option value="">All Severities</option>
                      <option>High</option><option>Medium</option><option>Low</option>
                    </select>
                    <select className="form-select" value={filters.category}
                      onChange={(e) => setFilters({ category: e.target.value })}
                      style={{ fontSize: '0.78rem', padding: '7px 12px' }}>
                      <option value="">All Categories</option>
                      {Object.keys(CATEGORY_ICONS).map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <button className="btn btn-ghost btn-sm" onClick={() => setFilters({ status: '', severity: '', category: '' })} style={{ fontSize: '0.78rem' }}>
                      <X size={11} /> Clear Filters
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Issue list */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px' }}>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: '76px' }} />
                ))}
              </div>
            ) : filteredIssues.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🔍</div>
                No issues match your filters
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filteredIssues.map((issue) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`issue-list-item ${selectedIssue?.id === issue.id ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedIssue(issue)
                      if (map) map.panTo({ lat: issue.latitude, lng: issue.longitude })
                      setSidebarOpen(false) // close on mobile after selection
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', gap: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, flex: 1, lineHeight: 1.3 }}>{issue.title}</span>
                      <SeverityBadge severity={issue.severity} />
                    </div>
                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                      <StatusBadge status={issue.status} />
                      <span className="tag" style={{ fontSize: '0.68rem' }}>👍 {issue.verifications}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Report button */}
          <div style={{ padding: '10px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/report')}>
              <Plus size={15} /> Report New Issue
            </button>
          </div>
        </div>

        {/* ── MAP AREA ── */}
        <div style={{ flex: 1, position: 'relative', height: '100%', overflow: 'hidden' }}>
          {hasMapKey ? (
            <div id="gmap" style={{ width: '100%', height: '100%' }} />
          ) : (
            <FallbackMap issues={filteredIssues} selectedIssue={selectedIssue} onSelect={(issue) => { setSelectedIssue(issue); setSidebarOpen(false); }} />
          )}

          {/* Issue popup */}
          <AnimatePresence>
            {selectedIssue && (
              <div style={{
                position: 'absolute',
                bottom: 'clamp(12px, 3vw, 24px)',
                right: 'clamp(12px, 3vw, 24px)',
                left: 'auto',
                zIndex: 20,
                maxWidth: 'min(380px, calc(100vw - 24px))',
                width: '100%',
              }}>
                <IssueCard issue={selectedIssue} onClose={() => setSelectedIssue(null)} />
              </div>
            )}
          </AnimatePresence>

          {/* Map legend */}
          <div style={{
            position: 'absolute', top: '12px', right: '12px', zIndex: 10,
            background: 'rgba(6,11,23,0.92)', backdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
            padding: '10px 14px',
          }}>
            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <Layers size={9} style={{ display: 'inline', marginRight: '4px' }} /> Severity
            </div>
            {Object.entries(SEVERITY_COLORS).map(([sev, color]) => (
              <div key={sev} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{sev}</span>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981' }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Resolved</span>
            </div>
          </div>

          {/* Refresh button */}
          <button className="btn btn-ghost btn-sm" onClick={fetchIssues} style={{
            position: 'absolute', top: '12px', left: '12px', zIndex: 10,
            background: 'rgba(6,11,23,0.92)', backdropFilter: 'blur(16px)',
          }}>
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Mobile FAB to open sidebar */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        style={{
          position: 'fixed',
          bottom: '90px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 50,
          display: 'none', // shown via CSS media query below
          gap: '8px', padding: '12px 20px',
          borderRadius: '9999px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 20px var(--color-primary-glow), 0 8px 32px rgba(0,0,0,0.4)',
          fontSize: '0.85rem', fontWeight: 700,
          whiteSpace: 'nowrap',
          alignItems: 'center',
          fontFamily: 'var(--font-body)',
        }}
        id="map-fab"
      >
        <List size={16} />
        {sidebarOpen ? 'Hide List' : `${filteredIssues.length} Issues`}
        {sidebarOpen ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
      </button>

      <style>{`
        @media (max-width: 768px) {
          #map-fab { display: flex !important; }
          .map-sidebar-desktop {
            position: fixed !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 70px !important;
            top: auto !important;
            width: 100% !important;
            height: 60vh !important;
            border-right: none !important;
            border-top: 1px solid var(--border-subtle) !important;
            border-radius: 20px 20px 0 0 !important;
            transform: ${sidebarOpen ? 'translateY(0)' : 'translateY(110%)'};
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) !important;
            z-index: 40 !important;
          }
        }
      `}</style>
    </div>
  )
}

/** Beautiful CSS fallback map */
function FallbackMap({ issues, selectedIssue, onSelect }) {
  const [hovered, setHovered] = useState(null)

  const LAT_MIN = 22.95, LAT_MAX = 23.10
  const LNG_MIN = 72.45, LNG_MAX = 72.65

  const toPos = (lat, lng) => ({
    left: `${((lng - LNG_MIN) / (LNG_MAX - LNG_MIN)) * 100}%`,
    top: `${((LAT_MAX - lat) / (LAT_MAX - LAT_MIN)) * 100}%`,
  })

  return (
    <div style={{
      width: '100%', height: '100%',
      background: 'linear-gradient(135deg, #060f22 0%, #0a1a38 50%, #060e1e 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid lines */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05 }}>
        {[...Array(14)].map((_, i) => (
          <g key={i}>
            <line x1={`${(i + 1) * 100/14}%`} y1="0" x2={`${(i + 1) * 100/14}%`} y2="100%" stroke="#6366f1" strokeWidth="1" />
            <line x1="0" y1={`${(i + 1) * 100/14}%`} x2="100%" y2={`${(i + 1) * 100/14}%`} stroke="#6366f1" strokeWidth="1" />
          </g>
        ))}
      </svg>

      {/* Road-like paths */}
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.12 }}>
        <path d="M 0 45% Q 30% 42% 50% 48% T 100% 44%" stroke="#94a3b8" strokeWidth="6" fill="none" />
        <path d="M 15% 0 L 15% 100%" stroke="#94a3b8" strokeWidth="4" fill="none" />
        <path d="M 60% 0 L 55% 100%" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <path d="M 0 75% Q 40% 72% 100% 74%" stroke="#94a3b8" strokeWidth="5" fill="none" />
        <path d="M 0 25% L 100% 22%" stroke="#94a3b8" strokeWidth="3" fill="none" />
        <path d="M 30% 0 Q 35% 50% 30% 100%" stroke="#94a3b8" strokeWidth="2" fill="none" />
        <path d="M 80% 0 L 78% 100%" stroke="#94a3b8" strokeWidth="2" fill="none" />
      </svg>

      {/* City label */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        fontSize: '0.6rem', color: 'rgba(148,163,184,0.2)', fontWeight: 700,
        textTransform: 'uppercase', letterSpacing: '0.4em', textAlign: 'center',
        pointerEvents: 'none',
      }}>
        AHMEDABAD<br />CITY MAP
      </div>

      {/* Issue pins */}
      {issues.map((issue) => {
        const pos = toPos(issue.latitude, issue.longitude)
        const color = SEVERITY_COLORS[issue.severity] || '#6366f1'
        const size = issue.status === 'Resolved' ? 18 : 14 + Math.min(issue.verifications, 10)
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
            {issue.status !== 'Resolved' && (
              <div style={{
                position: 'absolute', inset: -6, borderRadius: '50%',
                border: `2px solid ${color}`,
                animation: 'pulse-ring 2.5s ease-out infinite',
              }} />
            )}
            <div style={{
              width: isSelected ? size + 8 : size,
              height: isSelected ? size + 8 : size,
              borderRadius: '50%',
              background: issue.status === 'Resolved' ? '#10b981' : color,
              border: `3px solid ${isSelected ? 'white' : 'rgba(255,255,255,0.35)'}`,
              boxShadow: `0 0 ${isSelected ? 24 : 12}px ${color}${isSelected ? '' : '88'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: isSelected ? '0.85rem' : '0.6rem',
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
        background: 'rgba(6,11,23,0.92)', backdropFilter: 'blur(16px)',
        border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
        padding: '8px 16px', fontSize: '0.72rem', color: 'var(--text-muted)', textAlign: 'center',
        whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 32px)',
        overflow: 'hidden', textOverflow: 'ellipsis',
      }}>
        🗺️ Add <code>VITE_GOOGLE_MAPS_API_KEY</code> in <code>frontend/.env</code> for Google Maps
      </div>
    </div>
  )
}

const darkMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#0a1628' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0a1628' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#4b5563' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1a3352' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#09162a' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#264d7a' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#060e1e' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#6b7280' }] },
]
