import { Card, CardHead, Section, useApp } from '../ui'
import { GOALS, RESTRICTIONS, ACTIVITY } from '../data'
import { User, Target, ShieldAlert, Gauge } from 'lucide-react'

export default function Profile() {
  const { profile: p, updateProfile, t, restart } = useApp()
  const num = (k) => (e) => updateProfile({ [k]: +e.target.value || 0 })
  const toggleR = (id) => updateProfile({ restrictions: p.restrictions.includes(id) ? p.restrictions.filter((x) => x !== id) : [...p.restrictions, id] })

  return (
    <>
      <Section title="Your dietary profile" sub="A simple profile — no lab tests or wearables needed. Every recommendation is driven from here." right={<button className="btn ghost sm" onClick={restart}>Redo guided setup</button>} />
      <div className="stack">
        <Card>
          <CardHead icon={<User size={17} />} title="Personal" />
          <div className="form-grid">
            <div className="field"><label>Name</label><input className="input" value={p.name} onChange={(e) => updateProfile({ name: e.target.value || 'Friend' })} /></div>
            <div className="field"><label>Sex</label><select className="input" value={p.sex} onChange={(e) => updateProfile({ sex: e.target.value })}><option value="female">Female</option><option value="male">Male</option></select></div>
            <div className="field"><label>Age</label><input className="input" type="number" value={p.age} onChange={num('age')} /></div>
            <div className="field"><label>Height (cm)</label><input className="input" type="number" value={p.height} onChange={num('height')} /></div>
            <div className="field"><label>Weight (kg)</label><input className="input" type="number" value={p.weight} onChange={num('weight')} /></div>
            <div className="field"><label>Goal weight (kg)</label><input className="input" type="number" value={p.goalWeight} onChange={num('goalWeight')} /></div>
            <div className="field"><label>Activity level</label>
              <select className="input" value={p.activity} onChange={(e) => updateProfile({ activity: +e.target.value })}>{ACTIVITY.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}</select></div>
          </div>
        </Card>

        <Card>
          <CardHead icon={<Target size={17} />} title="Your goal" />
          {['Body goals', 'Health goals'].map((grp) => (
              <div key={grp}><div className="goal-group">{grp}</div><div className="goal-grid">{GOALS.filter((g) => g.group === grp).map((g) => <button key={g.id} className={`goal ${p.goal === g.id ? 'on' : ''}`} onClick={() => updateProfile({ goal: g.id })}><span>{g.emoji}</span><b>{g.label}</b></button>)}</div></div>
            ))}
        </Card>

        <Card>
          <CardHead icon={<ShieldAlert size={17} />} title="Restrictions & health context" sub="detected restrictions are applied to every score and plan" />
          <div className="tag-pick" style={{ marginBottom: 18 }}>
            {RESTRICTIONS.map((r) => <button key={r.id} className={p.restrictions.includes(r.id) ? 'on' : ''} onClick={() => toggleR(r.id)}>{r.label}</button>)}
          </div>
          <div className="form-grid">
            <div className={`toggle ${p.diabetes ? 'on' : ''}`} onClick={() => updateProfile({ diabetes: !p.diabetes })}><div className="sw" /><div><b>Monitoring diabetes</b><div className="small muted">Stricter sugar & GI scoring</div></div></div>
            <div className={`toggle ${p.bp ? 'on' : ''}`} onClick={() => updateProfile({ bp: !p.bp })}><div className="sw" /><div><b>Blood-pressure restriction</b><div className="small muted">Lower sodium ceiling</div></div></div>
          </div>
        </Card>

        <Card>
          <CardHead icon={<Gauge size={17} />} title="Your daily targets" sub="auto-calculated from your profile" />
          <div className="targets">
            {[['Energy', t.kcal, 'kcal', '#fff6d9'], ['Protein', t.protein, 'g', '#efeaff'], ['Carbs', t.carbs, 'g', '#e4f2ff'], ['Fat', t.fat, 'g', '#fdeaea'], ['Fibre', t.fiber, 'g', '#e3f7ec'], ['Sugar limit', t.sugar, 'g', '#fff0e3'], ['Sodium limit', t.sodium, 'mg', '#f1f0f6'], ['BMI', t.bmi, '', '#e3f7ec']].map(([l, v, u, bg]) => (
              <div key={l} className="target" style={{ background: bg }}><b>{v}<small style={{ fontSize: 13, fontWeight: 500 }}> {u}</small></b><span>{l}</span></div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}
