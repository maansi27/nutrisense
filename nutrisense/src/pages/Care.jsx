import { useState } from 'react'
import { Star, Navigation, Phone, CalendarPlus, Stethoscope, Salad } from 'lucide-react'
import { Card, Chip, Section, useApp } from '../ui'
import { PROVIDERS } from '../data'

export default function Care() {
  const { profile } = useApp()
  const [type, setType] = useState('all')
  const [sel, setSel] = useState(null)
  const goalTag = { loss: 'Weight loss', gain: 'Weight gain', muscle: 'Muscle gain', diabetes: 'Diabetes' }[profile.goal]
  const list = PROVIDERS.filter((p) => type === 'all' || p.type === type)
    .sort((a, b) => Number(b.spec.includes(goalTag)) - Number(a.spec.includes(goalTag)) || a.dist - b.dist)

  return (
    <>
      <Section title="Find a dietitian or doctor" sub="Professionals near you, with those matching your goal shown first."
        right={<div className="seg">{[['all', 'All'], ['dietitian', 'Dietitians'], ['doctor', 'Doctors']].map(([id, l]) => <button key={id} className={type === id ? 'on' : ''} onClick={() => setType(id)}>{l}</button>)}</div>} />
      <div className="care-grid">
        <div>
          {list.map((p) => (
            <div key={p.id} className={`prov ${sel === p.id ? 'on' : ''}`} onClick={() => setSel(p.id)}>
              <div className={`face ${p.type}`}>{p.type === 'doctor' ? '🩺' : '🥗'}</div>
              <div className="grow">
                <div className="row between"><b style={{ fontSize: 16 }}>{p.name}</b><span className="small muted">{p.dist} km</span></div>
                <div className="small muted">{p.title} · {p.clinic}</div>
                <div className="row wrap" style={{ gap: 6, margin: '8px 0' }}>
                  <Chip tone="yellow"><Star size={11} fill="#d9a400" stroke="#d9a400" />{p.rating} ({p.reviews})</Chip>
                  {p.spec.map((s) => <Chip key={s} tone={s === goalTag ? 'purple' : ''}>{s}</Chip>)}
                </div>
                <div className="row between wrap">
                  <span className="small" style={{ color: p.open.startsWith('Open') ? '#0e8a50' : '#c4601a', fontWeight: 600 }}>{p.open}</span>
                  {sel === p.id && <div className="row"><button className="btn ghost sm"><Phone size={13} /> Call</button><button className="btn dark sm"><CalendarPlus size={13} /> Book</button></div>}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mapbox">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <rect width="100" height="100" fill="#e8efe4" />
            <path d="M0 18 C 30 25, 50 10, 100 22 L100 30 C 55 20, 30 34, 0 26Z" fill="#bcdcf5" />
            <rect x="8" y="46" width="22" height="16" rx="3" fill="#cfe5c4" /><rect x="62" y="70" width="26" height="18" rx="3" fill="#cfe5c4" />
            {[[0, 40, 100, 44], [0, 72, 100, 66], [30, 0, 36, 100], [70, 0, 62, 100], [50, 30, 52, 100]].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="2.2" />)}
            {[[0, 58, 100, 56], [14, 0, 18, 100], [86, 0, 90, 100]].map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fff" strokeWidth="1" />)}
          </svg>
          <div className="you" />
          {list.map((p) => (
            <div key={p.id} className={`pin ${sel === p.id ? 'on' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }} onClick={() => setSel(p.id)}>
              <div className="bub">{p.type === 'doctor' ? <Stethoscope size={13} /> : <Salad size={13} />}{p.name.replace('Dr. ', '')}</div><div className="tail" />
            </div>
          ))}
          <Chip tone="dark" style={{ position: 'absolute', left: 16, bottom: 16 }}><Navigation size={12} /> Prototype map — location search via Maps / OpenStreetMap API</Chip>
        </div>
      </div>
    </>
  )
}
