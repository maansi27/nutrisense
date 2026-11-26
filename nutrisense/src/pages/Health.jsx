import { useState } from 'react'
import { Droplet, Info, AlertTriangle, CheckCircle2, Plus } from 'lucide-react'
import { Card, CardHead, Chip, Section, useApp } from '../ui'

const CTX = ['fasting', 'post-meal', 'bedtime']

export default function Health() {
  const { glucose, setGlucose, go, profile } = useApp()
  const [targets, setTargets] = useState(profile.gt || { fasting: [70, 100], 'post-meal': [70, 140], bedtime: [90, 150] })
  const [val, setVal] = useState('')
  const [ctx, setCtx] = useState('fasting')
  const [note, setNote] = useState('')

  const inRange = (g) => g.v >= targets[g.ctx][0] && g.v <= targets[g.ctx][1]
  const last7 = glucose.slice(-7)
  const out = last7.filter((g) => !inRange(g))
  const avg = Math.round(glucose.reduce((s, g) => s + g.v, 0) / glucose.length)
  const pctIn = Math.round((glucose.filter(inRange).length / glucose.length) * 100)

  const add = () => {
    const v = +val
    if (!v || v < 30 || v > 500) return
    setGlucose([...glucose, { d: 0, ctx, v, note }])
    setVal(''); setNote('')
  }

  // chart
  const W = 640, H = 240, pad = 34
  const maxV = 200, minV = 60
  const X = (i) => pad + (i / Math.max(1, glucose.length - 1)) * (W - pad * 2)
  const Y = (v) => H - pad - ((v - minV) / (maxV - minV)) * (H - pad * 2)
  const path = glucose.map((g, i) => `${i ? 'L' : 'M'}${X(i)},${Y(g.v)}`).join(' ')

  return (
    <>
      <Section title="Health context log" sub="Log glucose readings against targets you set. You get general flags — never a diagnosis." />
      <div className="health-grid">
        <div className="stack">
          <div className="stat-row">
            <div className="stat" style={{ background: 'var(--green-soft)' }}><b>{pctIn}%</b><span>readings in your target range</span></div>
            <div className="stat" style={{ background: 'var(--purple-soft)' }}><b>{avg}<small style={{ fontSize: 14 }}> mg/dL</small></b><span>average · last {glucose.length} readings</span></div>
            <div className="stat" style={{ background: out.length ? 'var(--orange-soft)' : 'var(--blue-soft)' }}><b>{out.length}</b><span>out of range in the last 7</span></div>
          </div>

          <Card>
            <CardHead icon={<Droplet size={17} />} title="Glucose trend" sub="shaded band = fasting target" />
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ display: 'block' }}>
              <rect x={pad} y={Y(targets.fasting[1])} width={W - pad * 2} height={Y(targets.fasting[0]) - Y(targets.fasting[1])} fill="#19b26b" opacity=".12" rx="8" />
              <rect x={pad} y={Y(targets['post-meal'][1])} width={W - pad * 2} height={Y(targets.fasting[1]) - Y(targets['post-meal'][1])} fill="#ffd23f" opacity=".14" rx="8" />
              {[80, 100, 120, 140, 160, 180].map((t) => <g key={t}><line x1={pad} x2={W - pad} y1={Y(t)} y2={Y(t)} stroke="#eeedf5" /><text x="4" y={Y(t) + 4} fontSize="11" fill="#9a99a8">{t}</text></g>)}
              <path d={path} fill="none" stroke="#7c5cff" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
              {glucose.map((g, i) => <circle key={i} cx={X(i)} cy={Y(g.v)} r="5.5" fill={inRange(g) ? '#19b26b' : '#ff8a3d'} stroke="#fff" strokeWidth="2.5"><title>{g.v} mg/dL · {g.ctx}</title></circle>)}
            </svg>
            <div className="row wrap" style={{ gap: 14, marginTop: 8 }}>
              <span className="small row" style={{ gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 9, background: '#19b26b' }} /> In range</span>
              <span className="small row" style={{ gap: 6 }}><i style={{ width: 10, height: 10, borderRadius: 9, background: '#ff8a3d' }} /> Above/below target</span>
            </div>
          </Card>

          <Card>
            <CardHead icon={<Info size={17} />} title="General flags" />
            {out.length >= 3 ? (
              <div className="flag warn"><AlertTriangle size={20} color="#ff8a3d" style={{ flex: 'none' }} /><span><b>{out.length} of your last 7 readings</b> were outside the targets you set. Consider reviewing your recent meals — and discussing the pattern with your doctor or dietitian.</span></div>
            ) : (
              <div className="flag good"><CheckCircle2 size={20} color="#19b26b" style={{ flex: 'none' }} /><span>Most recent readings sit within your own targets. Keep logging to see patterns.</span></div>
            )}
            <div className="flag info"><Info size={20} color="#2677c2" style={{ flex: 'none' }} /><span>Post-meal readings tend to run higher after refined-carb meals. Low-GI meals in your plan are chosen to help with this.</span></div>
            <div className="flag info"><Info size={20} color="#2677c2" style={{ flex: 'none' }} /><span>This tool offers general information only. It does not diagnose conditions or advise on medication. <a href="#care" onClick={(e) => { e.preventDefault(); go('care') }} style={{ color: '#5a3ee0', fontWeight: 700 }}>Find a professional nearby →</a></span></div>
          </Card>
        </div>

        <div className="stack">
          <Card>
            <CardHead icon={<Plus size={17} />} title="Log a reading" />
            <div className="field" style={{ marginBottom: 12 }}>
              <label>Glucose (mg/dL)</label>
              <input className="input" type="number" placeholder="e.g. 112" value={val} onChange={(e) => setVal(e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 12 }}>
              <label>When</label>
              <div className="seg" style={{ width: '100%' }}>{CTX.map((c) => <button key={c} className={ctx === c ? 'on' : ''} onClick={() => setCtx(c)} style={{ flex: 1, justifyContent: 'center' }}>{c}</button>)}</div>
            </div>
            <div className="field" style={{ marginBottom: 16 }}>
              <label>Note (optional)</label>
              <input className="input" placeholder="What did you eat?" value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <button className="btn primary block" onClick={add}>Save reading</button>
          </Card>

          <Card>
            <CardHead title="Your target ranges" sub="user-provided" />
            {CTX.map((c) => (
              <div key={c} className="row between" style={{ marginBottom: 10 }}>
                <span style={{ fontWeight: 600, textTransform: 'capitalize' }}>{c}</span>
                <div className="row" style={{ gap: 6 }}>
                  <input className="input" style={{ width: 66, padding: '8px 10px' }} type="number" value={targets[c][0]} onChange={(e) => setTargets({ ...targets, [c]: [+e.target.value, targets[c][1]] })} />
                  –
                  <input className="input" style={{ width: 66, padding: '8px 10px' }} type="number" value={targets[c][1]} onChange={(e) => setTargets({ ...targets, [c]: [targets[c][0], +e.target.value] })} />
                </div>
              </div>
            ))}
          </Card>

          <Card>
            <CardHead title="Recent readings" />
            {[...glucose].reverse().slice(0, 6).map((g, i) => (
              <div key={i} className="log-row">
                <span className="val">{g.v}</span>
                <div className="grow"><b style={{ textTransform: 'capitalize' }}>{g.ctx}</b><div className="small muted">{g.d === 0 ? 'Today' : `${g.d} day${g.d > 1 ? 's' : ''} ago`}{g.note ? ` · ${g.note}` : ''}</div></div>
                <Chip tone={inRange(g) ? 'good' : 'warn'}>{inRange(g) ? 'In range' : 'Outside'}</Chip>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </>
  )
}
