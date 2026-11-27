import { useState } from 'react'
import { Leaf, ArrowRight, ArrowLeft, Sparkles, Check } from 'lucide-react'
import { GOALS, RESTRICTIONS, ACTIVITY } from '../data'
import { targets } from '../logic'

const STEPS = ['Welcome', 'Personal', 'Goal', 'Restrictions', 'Health context']

export default function Onboarding({ initial, onDone }) {
  const [step, setStep] = useState(0)
  const [f, setF] = useState({ name: '', sex: 'female', age: '', height: '', weight: '', goalWeight: '', activity: 1.375, goal: null, restrictions: [], diabetes: false, bp: false, gt: { fasting: [70, 100], 'post-meal': [70, 140], bedtime: [90, 150] }, ...initial })
  const set = (patch) => setF((x) => ({ ...x, ...patch }))
  const num = (k) => (e) => set({ [k]: e.target.value })
  const toggleR = (id) => set({ restrictions: f.restrictions.includes(id) ? f.restrictions.filter((x) => x !== id) : [...f.restrictions, id] })
  const setGt = (c, i, v) => set({ gt: { ...f.gt, [c]: f.gt[c].map((x, j) => (j === i ? +v : x)) } })

  const valid = [
    true,
    f.name.trim() && +f.age > 0 && +f.height > 0 && +f.weight > 0,
    !!f.goal,
    true,
    true,
  ][step]

  const finish = () => {
    const p = { ...f, name: f.name.trim(), age: +f.age, height: +f.height, weight: +f.weight, goalWeight: +f.goalWeight || +f.weight, diabetes: f.diabetes || f.goal === 'diabetes' }
    onDone(p)
  }
  const preview = f.goal && +f.age && +f.height && +f.weight ? targets({ ...f, age: +f.age, height: +f.height, weight: +f.weight, goalWeight: +f.goalWeight || +f.weight, diabetes: f.diabetes }) : null

  return (
    <div className="ob-wrap">
      <div className="ob-top"><div className="logo"><Leaf size={22} /></div><b style={{ fontFamily: 'var(--display)', fontSize: 20 }}>NutriSense</b></div>
      <div className="ob-card">
        {step > 0 && (
          <div className="ob-steps">{STEPS.slice(1).map((s, i) => <div key={s} className={`ob-step ${i + 1 === step ? 'on' : i + 1 < step ? 'done' : ''}`}><span>{i + 1 < step ? <Check size={13} /> : i + 1}</span>{s}</div>)}</div>
        )}

        {step === 0 && (
          <div className="ob-body">
            <span className="chip purple"><Sparkles size={13} /> Goal-based personalized nutrition</span>
            <h1>Advice must start with <i>you</i>.</h1>
            <p className="muted" style={{ fontSize: 17, maxWidth: 560 }}>Before we score any food or build a plan, tell us what you need. It takes about a minute — no lab tests or wearables required.</p>
            <div className="ob-three">
              <div><b>Requirements vary</b><p>Health conditions, dietary preferences, lifestyle and personal goals shape what advice means.</p></div>
              <div><b>Generic tools stop short</b><p>Most apps stop at calorie tracking, generic ratings or broad recommendations.</p></div>
              <div><b>Decisions stay fragmented</b><p>We connect food labels, restrictions, available ingredients and daily planning.</p></div>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="ob-body">
            <h2>Tell us about yourself</h2><p className="muted">Used to estimate your daily energy and nutrient targets.</p>
            <div className="form-grid" style={{ marginTop: 22 }}>
              <div className="field"><label>What should we call you?</label><input className="input" autoFocus value={f.name} onChange={(e) => set({ name: e.target.value })} /></div>
              <div className="field"><label>Sex</label><select className="input" value={f.sex} onChange={(e) => set({ sex: e.target.value })}><option value="female">Female</option><option value="male">Male</option></select></div>
              <div className="field"><label>Age</label><input className="input" type="number" value={f.age} onChange={num('age')} /></div>
              <div className="field"><label>Height (cm)</label><input className="input" type="number" value={f.height} onChange={num('height')} /></div>
              <div className="field"><label>Weight (kg)</label><input className="input" type="number" value={f.weight} onChange={num('weight')} /></div>
              <div className="field"><label>Goal weight (kg) · optional</label><input className="input" type="number" value={f.goalWeight} onChange={num('goalWeight')} /></div>
              <div className="field" style={{ gridColumn: '1 / -1' }}><label>Activity level</label>
                <div className="seg">{ACTIVITY.map((a) => <button key={a.id} className={f.activity === a.id ? 'on' : ''} onClick={() => set({ activity: a.id })}>{a.label}</button>)}</div></div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="ob-body">
            <h2>What's your main goal?</h2><p className="muted">Every score, meal idea and plan is tuned to this.</p>
            {['Body goals', 'Health goals'].map((grp) => (
              <div key={grp}><div className="goal-group">{grp}</div><div className="goal-grid" style={{ marginTop: 22 }}>{GOALS.filter((g) => g.group === grp).map((g) => <button key={g.id} className={`goal ${f.goal === g.id ? 'on' : ''}`} onClick={() => set({ goal: g.id })}><span>{g.emoji}</span><b>{g.label}</b></button>)}</div></div>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="ob-body">
            <h2>Any restrictions?</h2><p className="muted">Vegetarian, vegan, Jain, allergies, intolerances — foods that conflict are flagged and meals are filtered. Skip if none.</p>
            <div className="tag-pick" style={{ marginTop: 22 }}>{RESTRICTIONS.map((r) => <button key={r.id} className={f.restrictions.includes(r.id) ? 'on' : ''} onClick={() => toggleR(r.id)}>{r.label}</button>)}</div>
          </div>
        )}

        {step === 4 && (
          <div className="ob-body">
            <h2>Health context</h2><p className="muted">Optional. Entered by you — we never diagnose or advise on medication.</p>
            <div className="form-grid" style={{ margin: '22px 0' }}>
              <div className={`toggle ${f.diabetes || f.goal === 'diabetes' ? 'on' : ''}`} onClick={() => set({ diabetes: !f.diabetes })}><div className="sw" /><div><b>Monitoring diabetes</b><div className="small muted">Stricter sugar & glycaemic scoring</div></div></div>
              <div className={`toggle ${f.bp ? 'on' : ''}`} onClick={() => set({ bp: !f.bp })}><div className="sw" /><div><b>Blood-pressure restriction</b><div className="small muted">Lower sodium ceiling</div></div></div>
            </div>
            {(f.diabetes || f.goal === 'diabetes') && (
              <>
                <h4 style={{ marginBottom: 10 }}>Your glucose targets (mg/dL) — as given by you or your doctor</h4>
                {Object.keys(f.gt).map((c) => (
                  <div key={c} className="row" style={{ marginBottom: 8 }}>
                    <span style={{ width: 100, fontWeight: 600, textTransform: 'capitalize' }}>{c}</span>
                    <input className="input" style={{ width: 90 }} type="number" value={f.gt[c][0]} onChange={(e) => setGt(c, 0, e.target.value)} />–
                    <input className="input" style={{ width: 90 }} type="number" value={f.gt[c][1]} onChange={(e) => setGt(c, 1, e.target.value)} />
                  </div>
                ))}
              </>
            )}
            {preview && (
              <div className="ob-preview"><b>Your starting targets:</b> {preview.kcal} kcal · {preview.protein} g protein · {preview.carbs} g carbs · {preview.fat} g fat</div>
            )}
          </div>
        )}

        <div className="ob-actions">
          {step > 0 ? <button className="btn ghost" onClick={() => setStep(step - 1)}><ArrowLeft size={16} /> Back</button> : <span />}
          {step < 4
            ? <button className="btn primary" disabled={!valid} onClick={() => setStep(step + 1)} style={{ opacity: valid ? 1 : 0.5 }}>{step === 0 ? 'Get started' : 'Continue'} <ArrowRight size={16} /></button>
            : <button className="btn dark" onClick={finish}>Build my plan <Sparkles size={16} /></button>}
        </div>
      </div>
      <p className="muted small" style={{ textAlign: 'center', marginTop: 16, maxWidth: 520 }}>Decision support only — not a replacement for a dietitian or doctor.</p>
    </div>
  )
}
