import { createContext, useContext } from 'react'

export const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

export function Card({ className = '', children, ...rest }) {
  return <section className={`card ${className}`} {...rest}>{children}</section>
}

export function CardHead({ icon, title, sub, right }) {
  return (
    <div className="card-head">
      <div className="card-title">
        {icon && <span className="ico-badge">{icon}</span>}
        <h3>{title}</h3>
        {sub && <span className="muted small">{sub}</span>}
      </div>
      {right}
    </div>
  )
}

export function Chip({ tone = '', children, ...rest }) {
  return <span className={`chip ${tone}`} {...rest}>{children}</span>
}

export function Disclaimer({ compact }) {
  return (
    <div className={`disclaimer ${compact ? 'compact' : ''}`}>
      <b>Decision support only.</b> NutriSense does not diagnose, treat, or recommend medication, and is not a replacement for a dietitian or doctor.
    </div>
  )
}

// Circular score ring
export function ScoreRing({ value, tone, size = 150, label }) {
  const r = size / 2 - 12
  const c = 2 * Math.PI * r
  return (
    <div className={`ring ${tone}`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} className="ring-bg" />
        <circle
          cx={size / 2} cy={size / 2} r={r} className="ring-fg"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="ring-text"><b>{value}</b><span>{label || '/ 100'}</span></div>
    </div>
  )
}

// Small macro donut tile (like "Daily intake")
export function MacroRing({ label, value, goal, color, emoji }) {
  const pct = Math.min(1, value / goal)
  const r = 26, c = 2 * Math.PI * r
  return (
    <div className="macro">
      <svg width="68" height="68" viewBox="0 0 68 68">
        <circle cx="34" cy="34" r={r} fill="none" stroke={color + '33'} strokeWidth="7" />
        <circle cx="34" cy="34" r={r} fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - pct)} transform="rotate(-90 34 34)" />
        <text x="34" y="39" textAnchor="middle" fontSize="18">{emoji}</text>
      </svg>
      <b>{Math.round(value)}<small>g</small></b>
      <span>{label}</span>
    </div>
  )
}

export function Bar({ pct, tone = 'purple' }) {
  return <div className="bar"><i className={tone} style={{ width: `${Math.min(100, Math.max(2, pct * 100))}%` }} /></div>
}

export function Section({ title, sub, right, children }) {
  return (
    <div className="section">
      <div className="section-head">
        <div><h2>{title}</h2>{sub && <p className="muted">{sub}</p>}</div>
        {right}
      </div>
      {children}
    </div>
  )
}
