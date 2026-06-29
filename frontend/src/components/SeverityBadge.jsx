const SEVERITY_CONFIG = {
  High: { class: 'badge-high', dot: '#ef4444', label: '🔴 High' },
  Medium: { class: 'badge-medium', dot: '#f59e0b', label: '🟡 Medium' },
  Low: { class: 'badge-low', dot: '#10b981', label: '🟢 Low' },
}

const STATUS_CONFIG = {
  Open: { class: 'badge-open', label: 'Open' },
  'In Progress': { class: 'badge-in-progress', label: 'In Progress' },
  Resolved: { class: 'badge-resolved', label: 'Resolved' },
}

export function SeverityBadge({ severity, size = 'sm' }) {
  const cfg = SEVERITY_CONFIG[severity] || SEVERITY_CONFIG.Low
  return (
    <span className={`badge ${cfg.class}`} style={{ fontSize: size === 'lg' ? '0.85rem' : '0.72rem' }}>
      {cfg.label}
    </span>
  )
}

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Open
  return (
    <span className={`badge ${cfg.class}`}>
      {status === 'Open' && '🔓'} {status === 'In Progress' && '⚙️'} {status === 'Resolved' && '✅'} {cfg.label}
    </span>
  )
}

export function CategoryBadge({ category }) {
  const icons = {
    Pothole: '🕳️', 'Water Leakage': '💧', 'Damaged Streetlight': '💡',
    'Garbage Overflow': '🗑️', 'Broken Footpath': '🚶', Encroachment: '🚧',
    'Tree Fallen': '🌳', 'Drainage Blocked': '🌊', 'Road Damage': '🛣️', Other: '📌',
  }
  return (
    <span className="tag">
      {icons[category] || '📌'} {category}
    </span>
  )
}
